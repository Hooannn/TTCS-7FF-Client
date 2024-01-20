import { useQuery } from 'react-query';
import { onError } from '../../utils/error-handlers';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useState } from 'react';
import dayjs from '../../libs/dayjs';
import type { IStatistics, IResponseData, IProduct, IUser } from '../../types';

interface StatisticsResponse {
  [key: string]: IStatistics;
}
interface PopularProductsResponse {
  [key: string]: IProduct[];
}

interface PopularUsersResponse {
  [key: string]: IUser[];
}
export default () => {
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const axios = useAxiosIns();
  const getStatisticsQuery = useQuery({
    queryKey: ['statistics', type],
    queryFn: () => {
      const now = dayjs(Date.now()).valueOf();
      return axios.get<IResponseData<StatisticsResponse>>(`/statistics?type=${type}&to=${now}`);
    },
    onError: onError,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    select: res => res.data.data,
  });

  const getPopularProductsQuery = useQuery({
    queryKey: ['statistics-popular-products', type],
    queryFn: () => axios.get<IResponseData<PopularProductsResponse>>(`/statistics/popular-products?type=${type}`),
    onError: onError,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    select: res => res.data.data,
  });

  const getPopularUsersQuery = useQuery({
    queryKey: ['statistics-popular-users', type],
    queryFn: () => axios.get<IResponseData<PopularUsersResponse>>(`/statistics/popular-users?type=${type}`),
    onError: onError,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    select: res => res.data.data,
  });

  return { getStatisticsQuery, setType, getPopularProductsQuery, type, getPopularUsersQuery };
};
