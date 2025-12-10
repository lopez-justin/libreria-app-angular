export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  rating: number;
  totalBooks: number;
  memberSince: string;
  active: boolean;
}