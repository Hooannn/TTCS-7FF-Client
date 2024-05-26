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
  const columns: ColumnsType<IProduct> = useMemo(
    () => [
      {
        title: t('featured images'),
        dataIndex: 'featuredImage',
        key: 'featuredImage',
        render: featuredImage => (
          <>
            {featuredImage && <Image width={50} src={featuredImage} />}
            {!featuredImage && (
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
        render: data => (
          <Tag>
            <strong>{data ?? 0}</strong>
          </Tag>
        ),
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
    [highlightField, locale],
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
