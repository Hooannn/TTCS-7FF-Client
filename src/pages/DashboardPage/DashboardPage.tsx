import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useTitle from '../../hooks/useTitle';
import { Row, Col, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { buttonStyle } from '../../assets/styles/globalStyle';
import useStatistics from '../../services/statistics';
import UsersSummary from '../../components/dashboard/summary/UsersSummary';
import RevenuesSummary from '../../components/dashboard/summary/RevenuesSummary';
import OrdersSummary from '../../components/dashboard/summary/OrdersSummary';
import PopularProducts from '../../components/dashboard/summary/PopularProducts';
import PopularUsers from '../../components/dashboard/summary/PopularUsers';
const DashboardPage: FC = () => {
  const { t } = useTranslation();
  useTitle(`${t('dashboard')} - 7FF`);
  const { getStatisticsQuery, setType, getPopularProductsQuery, type, getPopularUsersQuery } = useStatistics();
  const orders = getStatisticsQuery.data?.orders;
  const revenues = getStatisticsQuery.data?.revenues;
  const users = getStatisticsQuery.data?.users;
  const highestViewCountProducts = getPopularProductsQuery.data?.highestViewCountProducts;
  const highestTotalSoldUnitsProducts = getPopularProductsQuery.data?.highestTotalSoldUnitsProducts;
  const highestTotalSalesProducts = getPopularProductsQuery.data?.highestTotalSalesProducts;
  const newestUsers = getPopularUsersQuery.data?.newestUsers;
  const usersWithHighestTotalOrderValue = getPopularUsersQuery.data?.usersWithHighestTotalOrderValue;
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

  useEffect(() => {
    const segmentOption = segmentedOptions.find(option => option.value === selectedSegment);
    setType(segmentOption?.value as any);
  }, [selectedSegment]);

  const onExportToCSV = () => {};

  return (
    <Row>
      <Col span={24}>
        <Row align="middle">
          <Col span={12}>
            <h2>Dashboard</h2>
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
        <Row align="middle" justify="space-between" gutter={12}>
          <Col lg={24} xl={8}>
            <RevenuesSummary loading={getStatisticsQuery.isLoading} value={revenues?.currentCount} previousValue={revenues?.previousCount} />
          </Col>
          <Col lg={24} xl={8}>
            <OrdersSummary loading={getStatisticsQuery.isLoading} value={orders?.currentCount} previousValue={orders?.previousCount} />
          </Col>
          <Col lg={24} xl={8}>
            <UsersSummary loading={getStatisticsQuery.isLoading} value={users?.currentCount} previousValue={users?.previousCount} />
          </Col>
        </Row>
      </Col>

      <Col span={24} style={{ padding: '12px 0' }}>
        <Row gutter={12}>
          {/* <Col lg={24} xl={8}> */}
          <Col lg={24} xl={12}>
            <PopularProducts
              isLoading={getPopularProductsQuery.isLoading}
              data={highestViewCountProducts}
              highlightFieldDisplay={t('view').toString()}
              highlightField={`${type}ViewCount`}
              extra="view"
              type={type}
              title={t('products with the highest view count').toString()}
            />
          </Col>
          {/* <Col lg={24} xl={8}>
            <PopularProducts
              isLoading={getPopularProductsQuery.isLoading}
              data={highestTotalSalesProducts}
              highlightFieldDisplay={t('total').toString()}
              type={type}
              highlightField={`${type}Data`}
              extra="totalSales"
              title={t('products with the highest total sales').toString()}
            />
          </Col> */}
          {/* <Col lg={24} xl={8}> */}
          <Col lg={24} xl={12}>
            <PopularProducts
              isLoading={getPopularProductsQuery.isLoading}
              data={highestTotalSoldUnitsProducts}
              highlightFieldDisplay={t('unit').toString()}
              type={type}
              extra="totalUnits"
              highlightField={`${type}Data`}
              title={t('products with the highest total sold units').toString()}
            />
          </Col>
        </Row>
      </Col>

      <Col span={24}>
        <Row gutter={12}>
          <Col lg={24} xl={12}>
            <PopularUsers
              isLoading={getPopularUsersQuery.isLoading}
              data={newestUsers}
              highlightFieldDisplay={t('created at').toString()}
              highlightField="createdAt"
              type="newest"
              title={t('newest users').toString()}
            />
          </Col>
          <Col lg={24} xl={12}>
            <PopularUsers
              isLoading={getPopularUsersQuery.isLoading}
              data={usersWithHighestTotalOrderValue}
              highlightFieldDisplay={t('total order value').toString()}
              type="highestTotalOrderValue"
              highlightField="totalOrderValue"
              title={t('users with highest total order value').toString()}
            />
          </Col>
        </Row>
      </Col>

      {/*<Col span={24} style={{ padding: '24px 0' }}>
        <RevenuesChart loading={getStatisticsQuery.isLoading} data={revenues?.details} />
                  </Col>*/}
    </Row>
  );
};

export default DashboardPage;
