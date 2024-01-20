import { useMutation } from 'react-query';
import { onError } from '../../utils/error-handlers';
import useAxiosIns from '../../hooks/useAxiosIns';
import type { IResponseData } from '../../types';

export default () => {
  const axios = useAxiosIns();
  const checkoutMutation = useMutation({
    mutationFn: (payload: {
      customerId: string;
      isDelivery?: boolean;
      items: { product: string; quantity: number }[];
      deliveryPhone?: string;
      deliveryAddress?: string;
      voucher?: string;
      note?: string;
    }) => axios.post<IResponseData<any>>(`/checkout`, payload),
    onError: onError,
    onSuccess: res => {},
  });
  return { checkoutMutation };
};
