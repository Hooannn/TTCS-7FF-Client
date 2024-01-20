import React from 'react';
import { Button, Modal, Space, Table, Tag, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IProduct } from '../../../types';
import { getI18n, useTranslation } from 'react-i18next';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { buttonStyle } from '../../../assets/styles/globalStyle';
import dayjs from '../../../libs/dayjs';
interface ProductsTableProps {
  isLoading: boolean;
  total: number;
  products: IProduct[];
  current: number;
  itemPerPage: number;
  setItemPerPage: (newItemPerPage: number) => void;
  setCurrent: (value: number) => void;
  onDelete: (productId: string) => void;
  onSelectProduct: (product: IProduct) => void;
}
const ProductsTable: React.FC<ProductsTableProps> = ({
  current,
  setCurrent,
  isLoading,
  products,
  onDelete,
  onSelectProduct,
  total,
  itemPerPage,
  setItemPerPage,
}) => {
  const { t } = useTranslation();
  const locale = getI18n().resolvedLanguage;
  const onDeleteBtnClick = (productId: string) => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      title: t('are you sure that you want to delete product with id') + ' ' + productId + '?',
      okText: t('delete'),
      cancelText: t('cancel'),
      onOk: () => {
        onDelete(productId);
      },
      okButtonProps: {
        danger: true,
        shape: 'round',
        style: { ...buttonStyle, width: '100px', marginLeft: '12px' },
      },
      cancelButtonProps: {
        type: 'text',
        shape: 'round',
        style: { ...buttonStyle, width: '100px' },
      },
    });
  };
  const onUpdateBtnClick = (product: IProduct) => onSelectProduct(product);
  const onChange = (values: any) => {
    const { current } = values;
    setCurrent(current);
  };
  const columns: ColumnsType<IProduct> = [
    {
      title: t('id'),
      dataIndex: '_id',
      key: 'id',
      render: text => (
        <span>
          {text || (
            <small>
              <em>{t('not updated yet')}</em>
            </small>
          )}
        </span>
      ),
    },
    {
      title: t('created at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => (
        <span>
          {dayjs(text).format('DD/MM/YYYY') || (
            <small>
              <em>{t('not updated yet')}</em>
            </small>
          )}
        </span>
      ),
    },
    {
      title: t('featured images'),
      dataIndex: 'featuredImages',
      key: 'featuredImages',
      render: featuredImages => (
        <>
          {featuredImages.length > 0 && (
            <Image.PreviewGroup>
              {featuredImages.map((image: string, idx: number) => (
                <Image width={70} key={image + idx} src={image} />
              ))}
            </Image.PreviewGroup>
          )}
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
            VI:{' '}
            {name.vi || (
              <small>
                <em>{t('not updated yet')}</em>
              </small>
            )}
          </div>
          <div>
            EN:{' '}
            {name.en || (
              <small>
                <em>{t('not updated yet')}</em>
              </small>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
      render: description => (
        <div>
          <div>
            VI:{' '}
            {description.vi || (
              <small>
                <em>{t('not updated yet')}</em>
              </small>
            )}
          </div>
          <div>
            EN:{' '}
            {description.en || (
              <small>
                <em>{t('not updated yet')}</em>
              </small>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t('is available'),
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: isAvailable => <div>{isAvailable ? t('yes') : t('no')}</div>,
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
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      render: price => (
        <Tag color="green">
          {price || (
            <small>
              <em>{t('not updated yet')}</em>
            </small>
          )}
        </Tag>
      ),
    },
    {
      title: t('action'),
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Space size="middle">
              <Button onClick={() => onUpdateBtnClick(record)} shape="round" type="primary">
                {t('update')}
              </Button>
              <Button onClick={() => onDeleteBtnClick((record as any)._id)} type="text" shape="round" danger>
                {t('delete')}
              </Button>
            </Space>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Table
        style={{ width: '100%' }}
        rowKey={(record: IProduct) => (record as any)._id}
        onChange={onChange}
        loading={isLoading}
        columns={columns}
        dataSource={products}
        pagination={{
          pageSize: itemPerPage,
          total,
          current,
          onShowSizeChange: (_, size) => {
            setItemPerPage(size);
          },
        }}
      />
    </>
  );
};

export default ProductsTable;
