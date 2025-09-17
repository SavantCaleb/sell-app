export interface Listing {
  id?: string;
  title: string;
  price: number;
  description: string;
  category: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt?: Date;
  userId?: string;
}

export interface User {
  id: string;
  email?: string;
  createdAt?: Date;
}