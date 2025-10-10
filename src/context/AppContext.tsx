import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product, Transaction } from '@/types';
import { faker } from '@faker-js/faker';

// --- MOCK DATA GENERATION ---
const createMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraphs(3),
    price: parseFloat(faker.commerce.price({ min: 10, max: 200, dec: 0 })),
    thumbnailUrl: `https://picsum.photos/seed/${faker.string.uuid()}/400/300`,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Dummy PDF for download
    createdAt: faker.date.past(),
  }));
};

const INITIAL_PRODUCTS = createMockProducts(8);

// --- CONTEXT INTERFACE ---
interface AppContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
  createTransaction: (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'verified' | 'downloadToken'>) => Transaction;
  verifyTransaction: (reference: string) => Transaction | undefined;
}

// --- CONTEXT CREATION ---
const AppContext = createContext<AppContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: faker.string.uuid(),
      createdAt: new Date(),
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const createTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'verified' | 'downloadToken'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: faker.string.uuid(),
      createdAt: new Date(),
      verified: false, // Initially not verified
      downloadToken: ''
    };
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  };
  
  const verifyTransaction = (reference: string) => {
    let updatedTransaction: Transaction | undefined;
    setTransactions(prev => prev.map(t => {
      if (t.reference === reference) {
        updatedTransaction = { ...t, verified: true, downloadToken: faker.string.uuid() };
        return updatedTransaction;
      }
      return t;
    }));
    return updatedTransaction;
  };

  return (
    <AppContext.Provider value={{ products, transactions, addProduct, deleteProduct, getProductById, createTransaction, verifyTransaction }}>
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
