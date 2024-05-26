import { IUser } from './auth';
import { ICategory, IContent } from './category';
interface IViewCount {
  time: number;
  count: number;
}
export interface IProduct {
  _id?: string;
  productId: string;
  name: IContent;
  description: IContent;
  price: number;
  yearlyData: {
    year: string;
    totalSales: number;
    totalUnits: number;
  }[];
  monthlyData: {
    month: string;
    year: string;
    totalSales: number;
    totalUnits: number;
  }[];
  weeklyData: {
    week: string;
    year: string;
    totalSales: number;
    totalUnits: number;
  }[];
  dailyData: {
    time: number;
    totalSales: number;
    totalUnits: number;
  };
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  stocks: number;
  category: ICategory | string;
  isAvailable: boolean;
  rating: number;
  ratingCount?: number;
  dailyViewCount?: IViewCount;
  weeklyViewCount?: IViewCount;
  monthlyViewCount?: IViewCount;
  yearlyViewCount?: IViewCount;
  featuredImages?: string[];
  images?: { imageUrl: string }[];
  createdAt?: string;
  totalSoldUnits?: number;
  categoryId?: string;
  currentPrice?: number;
}

export interface IDetailedItem {
  product: IProduct;
  quantity: number;
}

export interface IVoucher {
  _id: string;
  code: string;
  discountType: 'percent' | 'amount';
  discountAmount: number;
  totalUsageLimit: number;
  expiredDate?: string;
  createdAt?: string;
}
