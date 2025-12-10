export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  categoryId: number;
  condition: 'excelente' | 'bueno' | 'regular' | 'malo';
  price?: number;
  type: 'venta' | 'donacion';
  description: string;
  imageUrl: string;
  userId: number;
  active: boolean;
  createdAt: string;
  releaseDate: string; 
  location: string;
}