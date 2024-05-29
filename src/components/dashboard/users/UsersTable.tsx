import React, { useState } from 'react';
import { Avatar, Button, Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IUser } from '../../../types';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { buttonStyle } from '../../../assets/styles/globalStyle';
import dayjs from '../../../libs/dayjs';
interface UsersTableProps {
  isLoading: boolean;
  total: number;
  users: IUser[];
  current: number;
  itemPerPage: number;
  setItemPerPage: (newItemPerPage: number) => void;
  setCurrent: (value: number) => void;
  onDelete: (userId: string) => void;
  onSelectUser: (user: IUser) => void;
  isAdmin: boolean;
}
const UsersTable: React.FC<UsersTableProps> = ({
  current,
  setCurrent,
  isLoading,
  users,
  onDelete,
  onSelectUser,
  total,
  setItemPerPage,
  itemPerPage,
  isAdmin,
}) => {
  const { t } = useTranslation();
  const onDeleteBtnClick = (userId: string) => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      title: t('are you sure that you want to delete user with id') + ' ' + userId + '?',
      okText: t('delete'),
      cancelText: t('cancel'),
      onOk: () => {
        onDelete(userId);
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
  const onUpdateBtnClick = (user: IUser) => onSelectUser(user);
  const onChange = (values: any) => {
    const { current } = values;
    setCurrent(current);
  };
  const columns: ColumnsType<IUser> = [
    {
      title: t('id'),
      dataIndex: 'userId',
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
      title: t('avatar'),
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
      render: src => <Avatar src={src} size="large" />,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
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
      title: t('role'),
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: text => (
        <Tag color="blue" style={{ marginRight: 0 }}>
          {text || (
            <small>
              <em>{t('not updated yet')}</em>
            </small>
          )}
        </Tag>
      ),
    },
    {
      title: t('phone number'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
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
      title: t('last name').toString(),
      dataIndex: 'lastName',
      key: 'lastName',
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
      title: t('first name').toString(),
      dataIndex: 'firstName',
      key: 'firstName',
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
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
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
      title: t('action'),
      key: 'action',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Space size="middle">
              <Button disabled={!isAdmin} onClick={() => onUpdateBtnClick(record)} shape="round" type="primary">
                {t('update')}
              </Button>
              <Button
                disabled={!isAdmin}
                onClick={() => onDeleteBtnClick(record.userId)}
                type="text"
                shape="round"
                danger
                style={{ border: '1px solid' }}
              >
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
        rowKey={(record: IUser) => record.userId}
        onChange={onChange}
        loading={isLoading}
        columns={columns}
        dataSource={users}
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

export default UsersTable;
