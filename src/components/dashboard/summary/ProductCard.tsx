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
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
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
        src={product.featuredImage ?? '../alt-feature-img.png'}
      />

      <Row justify="center">
        <Col>
          <div style={{ fontSize: '30px', margin: '40px 0 0', color: '#ffbe33' }}>
            <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.currentPrice)}</strong>
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

            <Row align="middle" justify="space-between" style={{ padding: '0', marginTop: '12px' }}>
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>
                <div>
                  <DropboxOutlined /> {t('total units')}
                </div>
              </Col>
              <Col style={{ fontSize: '18px', fontWeight: 500 }}>{product.totalSoldUnits ?? 0}</Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
