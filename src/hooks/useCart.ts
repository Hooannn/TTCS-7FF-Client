import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { IDetailedItem } from '../types';
import { RootState } from '../store';
import { ICartItem } from '../slices/app.slice';
interface ICartValues {
  detailedItems: IDetailedItem[];
  totalPrice: number;
  shippingFee: number;
}

const MINIMUM_VALUE_FOR_FREE_SHIPPING = 300000;
const DEFAULT_SHIPPING_FEE = 20000;
const INITIAL_CART_VALUES = {
  detailedItems: [],
  totalPrice: 0,
  shippingFee: 0,
};

const useCart = () => {
  const cartItems = useSelector((state: RootState) => state.app.cartItems);

  const cartValues = useMemo(() => {
    return cartItems.reduce((acc: ICartValues, item: ICartItem) => {
      if (item.product?.isAvailable) {
        const newTotalPrice = acc.totalPrice + item.product.price * item.quantity;
        return {
          detailedItems: [...acc.detailedItems, { product: item.product, quantity: item.quantity }],
          totalPrice: newTotalPrice,
          shippingFee: newTotalPrice >= MINIMUM_VALUE_FOR_FREE_SHIPPING ? 0 : DEFAULT_SHIPPING_FEE,
        };
      } else {
        return {
          detailedItems: [...acc.detailedItems, { product: item.product, quantity: 0 }],
          totalPrice: acc.totalPrice,
          shippingFee: acc.shippingFee,
        };
      }
    }, INITIAL_CART_VALUES);
  }, [cartItems]);

  return { ...cartValues, MINIMUM_VALUE_FOR_FREE_SHIPPING };
};

export default useCart;
