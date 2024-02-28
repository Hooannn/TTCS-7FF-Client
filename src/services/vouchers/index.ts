import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData, IVoucher } from '../../types';
import { useEffect, useState } from 'react';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useTranslation } from 'react-i18next';
const SORT_MAPPING = {
  '-createdAt': { createdAt: -1 },
  createdAt: { createdAt: 1 },
};
export default ({ enabledFetchVouchers }: { enabledFetchVouchers?: boolean }) => {
  const { t } = useTranslation();
  const [itemPerPage, setItemPerPage] = useState<number>(8);
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [total, setTotal] = useState<number>();
  const [current, setCurrent] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const queryClient = useQueryClient();
  const axios = useAxiosIns();

  const buildQuery = (values: { searchString: string; sort: string; discountType: string; range: string[] | any[] | undefined }) => {
    const { searchString, sort, discountType, range } = values;
    const query: any = {};
    if (searchString) query.code = searchString;
    if (discountType) {
      query.discountType = discountType !== 'All' ? discountType : undefined;
    }
    if (range)
      query.createdAt = {
        start: range[0],
        end: range[1],
      };
    setQuery(JSON.stringify(query));
    if (sort) setSort(JSON.stringify((SORT_MAPPING as any)[sort]));
  };

  const searchVouchersQuery = useQuery(['search-vouchers', query, sort], {
    queryFn: () =>
      axios.get<IResponseData<IVoucher[]>>(`/vouchers?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}&filter=${query}&sort=${sort}`),
    keepPreviousData: true,
    onError: onError,
    enabled: false,
    onSuccess: res => {
      const vouchers = res.data.data;
      const total = res.data.total;
      setTotal(total);
      setVouchers(vouchers);
    },
  });

  const onResetFilterSearch = () => {
    setIsSearching(false);
    setQuery('');
    setSort('');
    setTimeout(() => fetchVouchersQuery.refetch(), 300);
  };

  const onFilterSearch = () => {
    searchVouchersQuery.refetch();
    setIsSearching(true);
  };

  useEffect(() => {
    if (isSearching) {
      searchVouchersQuery.refetch();
    }
  }, [current, itemPerPage]);

  const fetchVouchersQuery = useQuery(['vouchers', current, itemPerPage], {
    queryFn: () => {
      if (!isSearching) return axios.get<IResponseData<IVoucher[]>>(`/vouchers?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}`);
    },
    keepPreviousData: true,
    onError: onError,
    enabled: enabledFetchVouchers,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    onSuccess: res => {
      if (!res) return;
      const vouchers = res.data.data;
      const total = res.data.total;
      setTotal(total);
      setVouchers(vouchers);
    },
  });

  const addVoucherMutation = useMutation({
    mutationFn: (data: IVoucher) => axios.post<IResponseData<IVoucher>>('/vouchers', data),
    onSuccess: res => {
      if (isSearching) {
        queryClient.invalidateQueries('search-vouchers');
        searchVouchersQuery.refetch();
      } else queryClient.invalidateQueries('vouchers');
      toast(t(res.data.message), toastConfig('success'));
    },
    onError: onError,
  });

  const updateVoucherMutation = useMutation({
    mutationFn: ({ voucherId, data }: { voucherId: string; data: IVoucher }) =>
      axios.patch<IResponseData<IVoucher>>(`/vouchers?id=${voucherId}`, data),
    onSuccess: res => {
      if (isSearching) {
        queryClient.invalidateQueries('search-vouchers');
        searchVouchersQuery.refetch();
      } else queryClient.invalidateQueries('vouchers');
      toast(t(res.data.message), toastConfig('success'));
    },
    onError: onError,
  });

  const verifyVoucherMutation = useMutation({
    mutationFn: (code: string) => axios.get<IResponseData<IVoucher>>(`/vouchers/validate?code=${code}`),
    onError: onError,
  });

  const deleteVoucherMutation = useMutation({
    mutationFn: (voucherId: string) => axios.delete<IResponseData<unknown>>(`/vouchers?id=${voucherId}`),
    onSuccess: res => {
      if (isSearching) {
        queryClient.invalidateQueries('search-vouchers');
        searchVouchersQuery.refetch();
      } else queryClient.invalidateQueries('vouchers');
      toast(t(res.data.message), toastConfig('success'));
    },
    onError: onError,
  });

  return {
    fetchVouchersQuery,
    total,
    vouchers,
    current,
    setCurrent,
    addVoucherMutation,
    deleteVoucherMutation,
    updateVoucherMutation,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    verifyVoucherMutation,
    searchVouchersQuery,
    itemPerPage,
    setItemPerPage,
  };
};
