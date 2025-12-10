export interface Transaction {
  id?: number;
  bookId: number;
  bookTitle: string;
  bookImageUrl: string;
  requesterId: number;
  requesterName: string;
  ownerId: number;
  ownerName: string;
  type: 'venta' | 'donacion';
  price?: number;
  status: 'pendiente' | 'aceptada' | 'rechazada';
  requestDate: string;
  responseDate?: string;
  message?: string;
}

