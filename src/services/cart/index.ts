import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchCartItems, addCartItem, removeCartItem, resetCartItems } from '../../slices/app.slice';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useDispatch, useSelector } from 'react-redux';
import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';
export default ({ enabledFetchCartItems }: { enabledFetchCartItems: boolean }) => {
  const { t } = useTranslation();
  const axios = useAxiosIns();
  const query = useQueryClient();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);
  const dispatch = useDispatch();
  const fetchCartItemsQuery = useQuery({
    queryKey: 'cartItems',
    queryFn: () => dispatch(fetchCartItems(axios) as any),
    enabled: enabledFetchCartItems,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });

  const addCartItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!isLogged) return toast(t('you must be logged in to do this operation').toString(), toastConfig('info'));
      return dispatch(addCartItem({ axios, productId: productId, quantity: quantity }) as any);
    },
    onSuccess: () => query.invalidateQueries(['cartItems']),
  });

  const removeCartItemMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      dispatch(removeCartItem({ axios, productId: productId, quantity: quantity }) as any),
    onSuccess: () => query.invalidateQueries(['cartItems']),
  });

  const resetCartItemsMutation = useMutation({
    mutationFn: () => dispatch(resetCartItems(axios) as any),
    onSuccess: () => query.invalidateQueries(['cartItems']),
  });

  return { fetchCartItemsQuery, resetCartItemsMutation, removeCartItemMutation, addCartItemMutation };
};
