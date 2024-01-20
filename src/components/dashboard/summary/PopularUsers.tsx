import { Avatar, Button, Card, Table, Tag } from 'antd';
import { IUser } from '../../../types';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface PopularUsersProps {
  data?: IUser[];
  title?: string;
  isLoading?: boolean;
  highlightFieldDisplay?: string;
  highlightField?: string;
  type?: 'newest' | 'highestTotalOrderValue';
}
export default function PopularUsers({ highlightField, highlightFieldDisplay, type, data, title, isLoading }: PopularUsersProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns: ColumnsType<IUser> = useMemo(
    () => [
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
        title: t('avatar'),
        dataIndex: 'avatar',
        key: 'avatar',
        render: avatar => <Avatar src={avatar} size="large" />,
      },
      {
        title: t('name'),
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => (
          <div>
            <div>{`${record.firstName} ${record.lastName}`}</div>
          </div>
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
        title: highlightFieldDisplay,
        dataIndex: highlightField,
        key: highlightField,
        render: value => (
          <Tag>
            <strong>{type === 'newest' ? dayjs(value).format('DD/MM/YYYY') : value}</strong>
          </Tag>
        ),
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
        rowKey={(record: IUser) => (record as any)._id}
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Card>
  );
}
