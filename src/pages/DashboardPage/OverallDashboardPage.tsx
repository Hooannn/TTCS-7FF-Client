import { getI18n, useTranslation } from 'react-i18next';
import RevenuesChart from '../../components/dashboard/summary/RevenuesChart';
import { Row, Col, Select, Empty, Card, Button } from 'antd';
import { useState } from 'react';
import { useQuery } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { IProduct, IResponseData } from '../../types';
import ProductCard from '../../components/dashboard/summary/ProductCard';
import { DownloadOutlined } from '@ant-design/icons';
import { buttonStyle } from '../../assets/styles/globalStyle';
import { exportToCSV } from '../../utils/export-csv';
import dayjs from '../../libs/dayjs';
export default function OverallDashboardPage() {
  const { t } = useTranslation();
  const axios = useAxiosIns();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const getRevenuesChartQuery = useQuery({
    queryKey: ['revenues-chart', type],
    queryFn: () => axios.get<IResponseData<any>>(`/statistics/charts/revenues?type=${type}`),
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    select: res => res.data?.data,
  });

  const getProductsQuery = useQuery({
    queryKey: 'products',
    queryFn: () => axios.get<IResponseData<IProduct[]>>(`/products`),
    refetchIntervalInBackground: true,
    refetchInterval: 10000,
    select: res => res.data?.data,
  });

  const products = getProductsQuery.data;

  const onExportToCSV = () => {
    const getWeekNumber = (date: Date) => {
      const onejan = new Date(date.getFullYear(), 0, 1);
      const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayOfYear = ((today.getTime() - onejan.getTime() + 86400000) / 86400000) >> 0;
      return Math.ceil(dayOfYear / 7);
    };
    const year = new Date().getFullYear().toString();
    const month = new Date().getMonth() + 1;
    const week = `${getWeekNumber(new Date())}`;
    const getTotalSales = (product: IProduct, type: string) => {
      switch (type) {
        case 'yearly':
          const yearlyDataIndex = product.yearlyData.findIndex((data: any) => data.year === year);
          return product.yearlyData[yearlyDataIndex]?.totalSales || 0;
        case 'weekly':
          const weeklyDataIndex = product.weeklyData.findIndex((data: any) => data.year === year && data.week === week);
          return product.weeklyData[weeklyDataIndex]?.totalSales || 0;
        case 'monthly':
          const monthlyDataIndex = product.monthlyData.findIndex((data: any) => data.year === year && data.month === month.toString());
          return product.monthlyData[monthlyDataIndex]?.totalSales || 0;
        case 'daily':
          return product.dailyData?.totalSales || 0;
      }
    };

    const getTotalUnits = (product: IProduct, type: string) => {
      switch (type) {
        case 'yearly':
          const yearlyDataIndex = product.yearlyData.findIndex((data: any) => data.year === year);
          return product.yearlyData[yearlyDataIndex]?.totalUnits || 0;
        case 'weekly':
          const weeklyDataIndex = product.weeklyData.findIndex((data: any) => data.year === year && data.week === week);
          return product.weeklyData[weeklyDataIndex]?.totalUnits || 0;
        case 'monthly':
          const monthlyDataIndex = product.monthlyData.findIndex((data: any) => data.year === year && data.month === month.toString());
          return product.monthlyData[monthlyDataIndex]?.totalUnits || 0;
        case 'daily':
          return product.dailyData?.totalUnits || 0;
      }
    };
    const standardizedProducts = products?.map(rawProduct => ({
      [t('id')]: rawProduct._id,
      [t('created at')]: dayjs(rawProduct.createdAt).format('DD/MM/YYYY'),
      [t('name')]: rawProduct.name[locale],
      [t('daily data')]: `${t('views')}: ${rawProduct.dailyViewCount?.count}, ${t(
        'total units',
      )}: ${getTotalUnits(rawProduct, 'daily')}`,
      [t('weekly data')]: `${t('views')}: ${rawProduct.weeklyViewCount?.count}, ${t(
        'total units',
      )}: ${getTotalUnits(rawProduct, 'weekly')}`,
      [t('monthly data')]: `${t('views')}: ${rawProduct.monthlyViewCount?.count}, ${t(
        'total units',
      )}: ${getTotalUnits(rawProduct, 'monthly')}`,
      [t('yearly data')]: `${t('views')}: ${rawProduct.yearlyViewCount?.count}, ${t(
        'total units',
      )}: ${getTotalUnits(rawProduct, 'yearly')}`,
    }));
    exportToCSV(standardizedProducts, `7FF_Overall_Products_${Date.now()}`);
  };

  return (
    <Row>
      <Col span={24}>
        <Row align="middle">
          <Col span={12}>
            <h2>{t('overall')}</h2>
          </Col>
          <Col span={12}></Col>
        </Row>
      </Col>

      <Col span={24}>
        <RevenuesChart
          loading={getRevenuesChartQuery.isLoading}
          data={getRevenuesChartQuery.data}
          extra={
            <Select value={type} size="large" style={{ width: 200 }} dropdownStyle={{ padding: 5 }} onChange={value => setType(value)}>
              <Select.Option value="daily" className="sort-option-item">
                {t('daily')}
              </Select.Option>
              <Select.Option value="weekly" className="sort-option-item">
                {t('weekly')}
              </Select.Option>
              <Select.Option value="monthly" className="sort-option-item">
                {t('monthly')}
              </Select.Option>
              <Select.Option value="yearly" className="sort-option-item">
                {t('yearly')}
              </Select.Option>
            </Select>
          }
        />
      </Col>
      <Col span={24} style={{ padding: '24px 0' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <h2>{t('products overall')}</h2>
          </Col>
          <Col span={5}>
            <Button
              block
              icon={<DownloadOutlined style={{ marginRight: '4px' }} />}
              type="text"
              shape="round"
              loading={getProductsQuery.isLoading}
              style={buttonStyle}
              onClick={() => onExportToCSV()}
            >
              <strong>{t('export csv')}</strong>
            </Button>
          </Col>
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
