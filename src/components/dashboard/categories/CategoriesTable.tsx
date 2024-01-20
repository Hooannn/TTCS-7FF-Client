import React from 'react';
import { Button, Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ICategory } from '../../../types';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { buttonStyle } from '../../../assets/styles/globalStyle';
import dayjs from '../../../libs/dayjs';
interface CategoriesTableProps {
  isLoading: boolean;
  total: number;
  categories: ICategory[];
  current: number;
  itemPerPage: number;
  setItemPerPage: (newItemPerPage: number) => void;
  setCurrent: (value: number) => void;
  onDelete: (categoryId: string) => void;
  onSelectCategory: (category: ICategory) => void;
}
const CategoriesTable: React.FC<CategoriesTableProps> = ({
  current,
  setCurrent,
  isLoading,
  categories,
  onDelete,
  onSelectCategory,
  total,
  itemPerPage,
  setItemPerPage,
}) => {
  const { t } = useTranslation();
  const onDeleteBtnClick = (categoryId: string) => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      title: t('are you sure that you want to delete category with id') + ' ' + categoryId + '?',
      okText: t('delete'),
      cancelText: t('cancel'),
      onOk: () => {
        onDelete(categoryId);
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
  const onUpdateBtnClick = (category: ICategory) => onSelectCategory(category);
  const onChange = (values: any) => {
    const { current } = values;
    setCurrent(current);
  };
  const columns: ColumnsType<ICategory> = [
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
        rowKey={(record: ICategory) => (record as any)._id}
        onChange={onChange}
        loading={isLoading}
        columns={columns}
        dataSource={categories}
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

export default CategoriesTable;
