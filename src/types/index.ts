export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail_url: string | null;
  file_path: string | null;
  created_at: string | null;
}

export interface Transaction {
  id: string;
  email: string;
  product_id: string | null;
  reference: string;
  verified: boolean | null;
  download_token: string | null;
  created_at: string | null;
}

export type NewProduct = Omit<Product, 'id' | 'created_at' | 'thumbnail_url' | 'file_path'> & {
  thumbnailFile: File;
  productFile: File;
};
