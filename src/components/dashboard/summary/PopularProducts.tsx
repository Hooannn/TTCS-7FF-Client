import { Button, Card, Image, Table, Tag } from 'antd';
import { IProduct } from '../../../types';
import { getI18n, useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface PopularProductsProps {
  data?: IProduct[];
  title?: string;
  highlightField?: string;
  highlightFieldDisplay?: string;
  isLoading?: boolean;
  extra?: string;
  type?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
export default function PopularProducts({ extra, type, data, title, highlightField, isLoading, highlightFieldDisplay }: PopularProductsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const getWeekNumber = (date: Date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfYear = ((today.getTime() - onejan.getTime() + 86400000) / 86400000) >> 0;
    return Math.ceil(dayOfYear / 7);
  };
  const columns: ColumnsType<IProduct> = useMemo(
    () => [
      {
        title: t('featured images'),
        dataIndex: 'featuredImages',
        key: 'featuredImages',
        render: featuredImages => (
          <>
            {featuredImages.length > 0 && <Image width={50} src={featuredImages[0]} />}
            {!featuredImages.length && (
              <small>
                <em>{t('not updated yet')}</em>
              </small>
            )}
          </>
        ),
      },

      {
        title: t('name'),
        dataIndex: 'name',
        key: 'name',
        render: name => (
          <div>
            <div>
              {name[locale] || (
                <small>
                  <em>{t('not updated yet')}</em>
                </small>
              )}
            </div>
          </div>
        ),
      },
      {
        title: t('category'),
        dataIndex: 'category',
        key: 'category',
        render: category => (
          <div>
            {category.name[locale] || (
              <small>
                <em>{t('not updated yet')}</em>
              </small>
            )}
          </div>
        ),
      },
      {
        title: highlightFieldDisplay,
        dataIndex: highlightField,
        key: highlightField,
        render: data => {
          if (extra === 'view')
            return (
              <Tag>
                <strong>{data.count ? data.count : 0}</strong>
              </Tag>
            );
          const year = new Date().getFullYear().toString();
          const month = new Date().getMonth() + 1;
          const week = `${getWeekNumber(new Date())}`;
          switch (type) {
            case 'yearly':
              const yearlyDataIndex = data.findIndex((data: any) => data.year === year);
              return (
                <Tag>
                  <strong>{data[yearlyDataIndex][extra as string]}</strong>
                </Tag>
              );
            case 'weekly':
              const weeklyDataIndex = data.findIndex((data: any) => data.year === year && data.week === week);
              return (
                <Tag>
                  <strong>{data[weeklyDataIndex][extra as string]}</strong>
                </Tag>
              );
            case 'monthly':
              const monthlyDataIndex = data.findIndex((data: any) => data.year === year && data.month === month.toString());
              return (
                <Tag>
                  <strong>{data[monthlyDataIndex][extra as string]}</strong>
                </Tag>
              );
            case 'daily':
              return (
                <Tag>
                  <strong>{data[extra as string]}</strong>
                </Tag>
              );
          }
        },
      },
      {
        title: t('action'),
        key: 'action',
        render: (_, record) => {
          return (
            <>
              <Button onClick={() => navigate(`/product/${record._id}`)} block shape="round" type="primary">
                {t('view')}
              </Button>
            </>
          );
        },
      },
    ],
    [highlightField],
  );
  return (
    <Card
      title={title}
      style={{
        borderRadius: '12px',
        boxShadow: '0px 0px 16px rgba(17,17,26,0.1)',
        minHeight: '485px',
      }}
    >
      <Table
        size="small"
        style={{ width: '100%' }}
        rowKey={(record: IProduct) => (record as any)._id}
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Card>
  );
}
