export type ProductType = 'product' | 'course';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  type: 'product';
}

export interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  students: string;
  image: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | string;
  type: 'course';
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: ProductType;
}

export type PaymentMethod = 'pix' | 'card';

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zip: string;
  paymentMethod: PaymentMethod;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: Omit<CheckoutFormData, 'paymentMethod'>;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'paid' | 'failed';
  metadata?: Record<string, unknown>;
}

export interface PaymentResponse {
  success: boolean;
  paymentMethod: PaymentMethod;
  pixQrCode?: string;
  paymentLink?: string;
  error?: string;
  raw?: unknown;
}


