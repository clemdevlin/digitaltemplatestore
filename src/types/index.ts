export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail_url: string | null;
  file_path: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  email: string;
  product_id: string;
  reference: string;
  verified: boolean;
  download_token: string | null;
  created_at: string;
}

export type NewProduct = Omit<Product, 'id' | 'created_at' | 'thumbnail_url' | 'file_path'> & {
  thumbnailFile: File;
  productFile: File;
};
