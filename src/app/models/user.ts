export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  memberSince?: string;
  active: boolean;
}
