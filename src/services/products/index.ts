import toastConfig from '../../configs/toast';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { onError } from '../../utils/error-handlers';
import { IResponseData, IProduct } from '../../types';
import { useEffect, useState } from 'react';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useTranslation } from 'react-i18next';
const SORT_MAPPING = {
  '-createdAt': { createdAt: -1 },
  createdAt: { createdAt: 1 },
  '-updatedAt': { updatedAt: -1 },
  updatedAt: { updatedAt: 1 },
};
export default ({ enabledFetchProducts }: { enabledFetchProducts?: boolean }) => {
  const { t } = useTranslation();
  const [itemPerPage, setItemPerPage] = useState<number>(8);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [total, setTotal] = useState<number>();
  const [current, setCurrent] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [sort, setSort] = useState<string>('');
  const queryClient = useQueryClient();
  const axios = useAxiosIns();

  const buildQuery = (values: {
    isAvailable: boolean;
    searchPriceQuery: string;
    searchCategory: string;
    searchNameVi: string;
    searchNameEn: string;
    searchDescVi: string;
    searchDescEn: string;
    sort: string;
    range: string[] | any[] | undefined;
  }) => {
    const { isAvailable, searchPriceQuery, searchCategory, searchNameVi, searchNameEn, searchDescVi, searchDescEn, sort, range } = values;
    const query: any = {};
    query.isAvailable = isAvailable;
    if (searchPriceQuery) query.price = JSON.parse(searchPriceQuery);
    if (searchCategory) query.category = searchCategory;
    if (searchNameVi) query['name.vi'] = { $regex: `${searchNameVi}`, $options: 'i' };
    if (searchNameEn) query['name.en'] = { $regex: `${searchNameEn}`, $options: 'i' };
    if (searchDescVi) query['description.vi'] = { $regex: `${searchDescVi}`, $options: 'i' };
    if (searchDescEn) query['description.en'] = { $regex: `${searchDescEn}`, $options: 'i' };
    if (range)
      query.createdAt = {
        $gte: range[0],
        $lte: range[1],
      };
    setQuery(JSON.stringify(query));
    if (sort) setSort(JSON.stringify((SORT_MAPPING as any)[sort]));
  };

  const searchProductsQuery = useQuery(['search-products', query, sort], {
    queryFn: () =>
      axios.get<IResponseData<IProduct[]>>(`/products?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}&filter=${query}&sort=${sort}`),
    keepPreviousData: true,
    onError: onError,
    enabled: false,
    onSuccess: res => {
      const products = res.data.data;
      const total = res.data.total;
      setTotal(total);
      setProducts(products);
    },
  });

  const onResetFilterSearch = () => {
    setIsSearching(false);
    setQuery('');
    setSort('');
    setTimeout(() => fetchProductsQuery.refetch(), 300);
  };

  const onFilterSearch = () => {
    searchProductsQuery.refetch();
    setIsSearching(true);
  };

  useEffect(() => {
    if (isSearching) {
      searchProductsQuery.refetch();
    }
  }, [current, itemPerPage]);

  const fetchProductsQuery = useQuery(['products', current, itemPerPage], {
    queryFn: () => {
      if (!isSearching) return axios.get<IResponseData<IProduct[]>>(`/products?skip=${itemPerPage * (current - 1)}&limit=${itemPerPage}`);
    },
    keepPreviousData: true,
    onError: onError,
    enabled: enabledFetchProducts,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    onSuccess: res => {
      if (!res) return;
      const products = res.data.data;
      const total = res.data.total;
      setTotal(total);
      setProducts(products);
    },
  });

  const addProductMutation = useMutation({
    mutationFn: (data: Partial<IProduct>) => axios.post<IResponseData<IProduct>>('/products', data),
    onSuccess: res => {
      if (isSearching) {
        queryClient.invalidateQueries('search-products');
        searchProductsQuery.refetch();
      } else queryClient.invalidateQueries('products');
      toast(t(res.data.message), toastConfig('success'));
    },
    onError: onError,
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: Partial<IProduct> }) =>
      axios.patch<IResponseData<IProduct>>(`/products?id=${productId}`, data),
    onSuccess: res => {
      if (isSearching) {
        queryClient.invalidateQueries('search-products');
        searchProductsQuery.refetch();
      } else queryClient.invalidateQueries('products');
      toast(t(res.data.message), toastConfig('success'));
    },
    onError: onError,
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => axios.delete<IResponseData<unknown>>(`/products?id=${productId}`),
    onSuccess: res => {
      if (isSearching) {
        queryClient.invalidateQueries('search-products');
        searchProductsQuery.refetch();
      } else queryClient.invalidateQueries('products');
      toast(t(res.data.message), toastConfig('success'));
    },
    onError: onError,
  });

  return {
    fetchProductsQuery,
    total,
    products,
    current,
    setCurrent,
    addProductMutation,
    deleteProductMutation,
    updateProductMutation,
    buildQuery,
    onFilterSearch,
    onResetFilterSearch,
    searchProductsQuery,
    itemPerPage,
    setItemPerPage,
  };
};
