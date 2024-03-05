import { getI18n, useTranslation } from 'react-i18next';
import RevenuesChart from '../../components/dashboard/summary/RevenuesChart';
import { Row, Col, Select, Empty, Card, Button } from 'antd';
import { useState } from 'react';
import { useQuery } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { IProduct, IResponseData } from '../../types';
import ProductCard from '../../components/dashboard/summary/ProductCard';
export default function OverallDashboardPage() {
  const { t } = useTranslation();
  const axios = useAxiosIns();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const segmentedOptions = [
    {
      label: t('daily'),
      value: 'daily',
    },
    {
      label: t('weekly'),
      value: 'weekly',
    },
    {
      label: t('monthly'),
      value: 'monthly',
    },
    {
      label: t('yearly'),
      value: 'yearly',
    },
  ];
  const [selectedSegment, setSelectedSegment] = useState<string>(segmentedOptions[0].value);
  const getRevenuesChartQuery = useQuery({
    queryKey: ['revenues-chart', selectedSegment],
    queryFn: () => axios.get<IResponseData<any>>(`/statistics/charts/revenues?type=${selectedSegment}`),
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    select: res => res.data?.data,
  });

  const getProductsQuery = useQuery({
    queryKey: ['productsStatistics', selectedSegment],
    queryFn: () => axios.get<IResponseData<IProduct[]>>(`/products/statistics?type=${selectedSegment}`),
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    select: res => res.data?.data,
  });

  const products = getProductsQuery.data;

  return (
    <Row>
      <Col span={24}>
        <Row align="middle">
          <Col span={12}>
            <h2>{t('overall')}</h2>
          </Col>
          <Col span={12}>
            <Row align="middle" justify="end" gutter={8}>
              <Col>
                <Row>
                  {segmentedOptions.map(option => (
                    <Col key={option.label?.toString()}>
                      <Button
                        style={{ padding: '8px 0px', height: 'unset', minWidth: '90px' }}
                        onClick={() => setSelectedSegment(option.value)}
                        type={selectedSegment === option.value ? 'primary' : 'text'}
                      >
                        {option.label}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <RevenuesChart loading={getRevenuesChartQuery.isLoading} data={getRevenuesChartQuery.data} />
      </Col>
      <Col span={24} style={{ padding: '24px 0' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <h2>{t('products overall')}</h2>
          </Col>
          <Col span={5}></Col>
        </Row>
        {getProductsQuery.isLoading && (
          <Row style={{ width: '100%' }} gutter={12}>
            {Array(20)
              .fill(0)
              .map((_, idx) => (
                <Col key={idx} span={8}>
                  <Card loading style={{ height: '350px', width: '100%' }} />
                </Col>
              ))}
          </Row>
        )}
        {!getProductsQuery.isLoading && products?.length && (
          <Row gutter={12}>
            {products?.map(product => (
              <Col xs={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 8 }} key={product._id} style={{ paddingBottom: '24px' }}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
        {!getProductsQuery.isLoading && products?.length === 0 && (
          <Row gutter={12} align="middle" justify="center">
            <Col>
              <Empty />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
