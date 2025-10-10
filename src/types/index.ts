export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // Price in GHC
  thumbnailUrl: string;
  fileUrl: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  email: string;
  productId: string;
  reference: string;
  verified: boolean;
  downloadToken: string;
  createdAt: Date;
}
