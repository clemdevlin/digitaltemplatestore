import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Product, Transaction, NewProduct } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { Session, AuthError } from '@supabase/supabase-js';

// --- CONTEXT INTERFACE ---
interface AppContextType {
  products: Product[];
  loading: boolean;
  session: Session | null;
  authLoading: boolean;
  addProduct: (product: NewProduct) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
  createTransaction: (transactionData: { email: string; productId: string; reference: string }) => Promise<Transaction | null>;
  verifyTransaction: (reference: string) => Promise<Transaction | undefined>;
  getTransactionByToken: (token: string) => Promise<{transaction: Transaction | null, product: Product | null}>;
  getSignedUrl: (filePath: string) => Promise<string | null>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

// --- CONTEXT CREATION ---
const AppContext = createContext<AppContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setAuthLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addProduct = async (productData: NewProduct) => {
    // 1. Upload thumbnail
    const thumbExt = productData.thumbnailFile.name.split('.').pop();
    const thumbPath = `${Date.now()}.${thumbExt}`;
    const { error: thumbError } = await supabase.storage.from('thumbnails').upload(thumbPath, productData.thumbnailFile);
    if (thumbError) throw new Error(`Thumbnail upload failed: ${thumbError.message}`);
    const { data: { publicUrl: thumbnailUrl } } = supabase.storage.from('thumbnails').getPublicUrl(thumbPath);

    // 2. Upload product file
    const fileExt = productData.productFile.name.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;
    const { error: fileError } = await supabase.storage.from('templates').upload(filePath, productData.productFile);
    if (fileError) throw new Error(`Product file upload failed: ${fileError.message}`);

    // 3. Insert into database
    const { error: dbError } = await supabase.from('products').insert({
      title: productData.title,
      description: productData.description,
      price: productData.price,
      thumbnail_url: thumbnailUrl,
      file_path: filePath,
    });
    if (dbError) throw new Error(`Database insert failed: ${dbError.message}`);

    await fetchProducts(); // Refresh product list
  };

  const deleteProduct = async (productId: string) => {
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) return;

    // 1. Delete files from storage
    if (productToDelete.thumbnail_url) {
        const thumbPath = productToDelete.thumbnail_url.split('/').pop();
        if(thumbPath) await supabase.storage.from('thumbnails').remove([thumbPath]);
    }
    if (productToDelete.file_path) {
        await supabase.storage.from('templates').remove([productToDelete.file_path]);
    }
    
    // 2. Delete from database
    await supabase.from('products').delete().eq('id', productId);
    
    await fetchProducts(); // Refresh product list
  };
  
  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const createTransaction = async (transactionData: { email: string; productId: string; reference: string }) => {
    const { data, error } = await supabase.from('transactions').insert({
      email: transactionData.email,
      product_id: transactionData.productId,
      reference: transactionData.reference,
    }).select().single();
    
    if (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
    return data;
  };
  
  const verifyTransaction = async (reference: string) => {
    // In a real app, this would be an edge function that securely verifies with Paystack
    const downloadToken = crypto.randomUUID();
    const { data, error } = await supabase
      .from('transactions')
      .update({ verified: true, download_token: downloadToken })
      .eq('reference', reference)
      .select()
      .single();
    
    if (error) {
      console.error("Error verifying transaction:", error);
      return undefined;
    }
    return data;
  };

  const getTransactionByToken = async (token: string) => {
    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('download_token', token)
        .single();
    
    if (txError || !transaction) {
        return { transaction: null, product: null };
    }

    const { data: product, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('id', transaction.product_id as string)
        .single();
    
    if (pError || !product) {
        return { transaction, product: null };
    }

    return { transaction, product };
  }

  const getSignedUrl = async (filePath: string) => {
    console.log("Generating signed URL for:", filePath);
    const { data, error } = await supabase.storage.from('templates').createSignedUrl(filePath, 300); // 60 seconds validity
    if (error) {
        console.error("Error creating signed URL", error);
        return null;
    }
    return data.signedUrl;
  }

  const signInWithPassword = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider value={{ products, loading, session, authLoading, addProduct, deleteProduct, getProductById, createTransaction, verifyTransaction, getTransactionByToken, getSignedUrl, signInWithPassword, signOut }}>
      {children}
    </AppContext.Provider>
  );
};

// --- CUSTOM HOOK ---
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
