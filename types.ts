export interface User {
  id: number;
  name: string;
  email: string;
  credits: number;
  isAdmin: boolean;
}

export type Theme = 'light' | 'dark';

export interface CreditPlan {
    credits: number | 'Unlimited';
    price: number;
    name: string;
}

export interface PaymentRequest {
  id: number;
  userId: number;
  userName: string;
  plan: string;
  amount: number;
  utrCode: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  // Fix: Added optional 'note' property to allow it in payment requests.
  note?: string;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  users: User[];
  paymentRequests: PaymentRequest[];
  login: (email: string, password?: string) => boolean;
  signup: (name: string, email: string) => void;
  logout: () => void;
  updateCredits: (newCredits: number) => void;
  submitPaymentRequest: (request: Omit<PaymentRequest, 'id' | 'userId' | 'userName' | 'status'>) => void;
  approvePayment: (id: number) => void;
  rejectPayment: (id: number) => void;
  adminUpdateUserCredits: (userId: number, newCredits: number) => void;
}
