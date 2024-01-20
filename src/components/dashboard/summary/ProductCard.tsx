import { useMemo, useState } from 'react';
import { getI18n, useTranslation } from 'react-i18next';
import { Avatar, Card, Col, Row } from 'antd';
import { EyeOutlined, DollarOutlined, DropboxOutlined } from '@ant-design/icons';
import { IProduct } from '../../../types';
import '../../../assets/styles/pages/ProfilePage.css';

interface IProductCardProps {
  product: IProduct;
}
export default function ProductCard({ product }: IProductCardProps) {
  const { t } = useTranslation();
  const getWeekNumber = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfYear = ((today.getTime() - onejan.getTime() + 86400000) / 86400000) >> 0;
    return Math.ceil(dayOfYear / 7);
  };
  const year = new Date().getFullYear().toString();
  const month = new Date().getMonth() + 1;
  const week = `${getWeekNumber(new Date())}`;
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const viewCount = useMemo(() => product[`${type}ViewCount`]?.count || 0, [type]);
  const totalSales = useMemo(() => {
    switch (type) {
      case 'yearly':
        const yearlyDataIndex = product.yearlyData.findIndex((data: any) => data.year === year);
        return product.yearlyData[yearlyDataIndex]?.totalSales;
      case 'weekly':
        const weeklyDataIndex = product.weeklyData.findIndex((data: any) => data.year === year && data.week === week);
        return product.weeklyData[weeklyDataIndex]?.totalSales;
      case 'monthly':
        const monthlyDataIndex = product.monthlyData.findIndex((data: any) => data.year === year && data.month === month.toString());
        return product.monthlyData[monthlyDataIndex]?.totalSales;
      case 'daily':
        return product.dailyData?.totalSales;
    }
  }, [type, product]);
  const totalUnits = useMemo(() => {
    switch (type) {
      case 'yearly':
        const yearlyDataIndex = product.yearlyData.findIndex((data: any) => data.year === year);
        return product.yearlyData[yearlyDataIndex]?.totalUnits;
      case 'weekly':
        const weeklyDataIndex = product.weeklyData.findIndex((data: any) => data.year === year && data.week === week);
        return product.weeklyData[weeklyDataIndex]?.totalUnits;
      case 'monthly':
        const monthlyDataIndex = product.monthlyData.findIndex((data: any) => data.year === year && data.month === month.toString());
        return product.monthlyData[monthlyDataIndex]?.totalUnits;
      case 'daily':
        return product.dailyData?.totalUnits;
    }
  }, [type, product]);
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
  return (
    <Card
      style={{
        marginTop: '60px',
        position: 'relative',
        minHeight: '300px',
        textAlign: 'center',
        borderRadius: '12px',
        boxShadow: '0px 0px 16px rgba(17,17,26,0.1)',
      }}
    >
      <Avatar
        style={{
          position: 'absolute',
          top: '-55px',
          left: '50%',
          transform: 'translateX(-50%)',
          border: '5px solid white',
          backgroundColor: '#f5f5f5',
        }}
        size={110}
        src={product.featuredImages?.length ? product.featuredImages[0] : '../alt-feature-img.png'}
      />

      <Row justify="center">
        <Col>
          <div style={{ fontSize: '30px', margin: '40px 0 0', color: '#ffbe33' }}>
            <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</strong>
          </div>
          <div style={{ margin: '12px 0' }}>
            <strong style={{ fontSize: '20px', color: '#222831' }}>{product.name[locale]}</strong>
            <div style={{ fontSize: '14px', color: '#222831', fontWeight: 600 }}>{(product.category as any)?.name[locale]}</div>
          </div>

          <div className="product-card-desc" style={{ maxWidth: 407 }}>
            {t('description')}: {product.description[locale]}
          </div>
          <div style={{ margin: '12px 0' }} className="my-orders">
            <strong style={{ fontSize: '20px' }}>{t('overall')}</strong>
            <div className="order-filter" style={{ marginTop: '12px' }}>
              <div className="status-options" style={{ justifyContent: 'center' }}>
                {segmentedOptions.map(option => (
                  <div
                    onClick={() => setType(option.value as any)}
                    key={option.value}
                    className={`status-option-item ${type === option.value ? 'active' : ''}`}
                  >
                    <small>{option.label}</small>
                  </div>
                ))}
              </div>
            </div>
            <Row align="middle" justify="space-between">
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                <div>
                  <EyeOutlined /> {t('views')}
                </div>
              </Col>
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>{viewCount}</Col>
            </Row>
            {/*<Row align="middle" justify="space-between" style={{ padding: '12px 0 0' }}>
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                <div>
                  <DollarOutlined /> {t('total sales')}
                </div>
              </Col>
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalSales ?? 0)}
              </Col>
                </Row>*/}
            <Row align="middle" justify="space-between" style={{ padding: '12px 0 0' }}>
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                <div>
                  <DropboxOutlined /> {t('total units')}
                </div>
              </Col>
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>{totalUnits ?? 0}</Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
