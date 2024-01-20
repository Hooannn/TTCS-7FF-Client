import { IVoucher } from './product';

export interface IOrder {
  _id: string;
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  totalPrice: number;
  note?: string;
  voucher?: string | IVoucher;
  isDelivery: boolean;
  deliveryAddress?: string;
  deliveryPhone?: string;
  rating?: number;
  status: OrderStatus;
  createdAt?: string;
}

export type OrderStatus = 'Processing' | 'Delivering' | 'Done' | 'Cancelled';
