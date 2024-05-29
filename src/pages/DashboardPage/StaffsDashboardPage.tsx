import { Col, Row, Button } from 'antd';
import { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { buttonStyle, secondaryButtonStyle } from '../../assets/styles/globalStyle';
import AddUserModal from '../../components/dashboard/users/AddUserModal';
import UsersTable from '../../components/dashboard/users/UsersTable';
import { IResponseData, IUser } from '../../types';
import useUsers from '../../services/users';
import { exportToCSV } from '../../utils/export-csv';
import UpdateUserModal from '../../components/dashboard/users/UpdateUserModal';
import SortAndFilter from '../../components/dashboard/users/SortAndFilter';
import useTitle from '../../hooks/useTitle';
import dayjs, { locale } from 'dayjs';
import { useMutation } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
export default function StaffsDashboardPage() {
  const {
    fetchUsersQuery,
    users,
    total,
    addUserMutation,
    deleteUserMutation,
    updateUserMutation,
    current,
    setCurrent,
    buildQuery,
    onFilterSearch,
    searchUsersQuery,
    onResetFilterSearch,
    itemPerPage,
    setItemPerPage,
  } = useUsers({ enabledFetchUsers: true, endpoint: '/staffs' });

  const axios = useAxiosIns();
  const [shouldAddModalOpen, setAddModelOpen] = useState(false);
  const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { t } = useTranslation();
  useTitle(`${t('user')} - 7FF`);

  const onAddUser = (values: IUser) => {
    addUserMutation.mutateAsync(values).finally(() => setAddModelOpen(false));
  };
  const onUpdateUser = (values: IUser) => {
    updateUserMutation.mutateAsync({ userId: selectedUser?.userId as string, data: values }).finally(() => setUpdateModalOpen(false));
  };
  const onDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const fetchAllUsersMutation = useMutation({
    mutationFn: () => axios.get<IResponseData<IUser[]>>(`/staffs`),
  });

  const onExportToCSV = async () => {
    const { data } = await fetchAllUsersMutation.mutateAsync();
    const users = data?.data.map(rawUser => ({
      [t('id').toString()]: rawUser.userId,
      [t('created at')]: dayjs(rawUser.createdAt).format('DD/MM/YYYY'),
      Email: rawUser.email,
      [t('role')]: rawUser.role,
      [t('phone number')]: rawUser.phoneNumber,
      [t('first name')]: rawUser.firstName,
      [t('last name')]: rawUser.lastName,
      [t('address')]: rawUser.address,
    }));
    exportToCSV(users, `7FF_Staffs_${Date.now()}`);
  };

  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  return (
    <Row>
      <UpdateUserModal
        isLoading={updateUserMutation.isLoading}
        onSubmit={onUpdateUser}
        user={selectedUser}
        shouldOpen={shouldUpdateModalOpen}
        onCancel={() => setUpdateModalOpen(false)}
        showRole={true}
      />
      <AddUserModal
        showRole
        onSubmit={onAddUser}
        isLoading={addUserMutation.isLoading}
        shouldOpen={shouldAddModalOpen}
        onCancel={() => setAddModelOpen(false)}
      />

      <Col span={24}>
        <Row align="middle">
          <Col span={12} style={{ marginBottom: 16 }}>
            <h2>{t('staffs')}</h2>
          </Col>
          <Col span={12}>
            <Row align="middle" justify="end" gutter={8}>
              <Col span={5}>
                <SortAndFilter onChange={buildQuery} onSearch={onFilterSearch} onReset={onResetFilterSearch} />
              </Col>
              <Col span={5}>
                <Button block shape="round" style={{ ...secondaryButtonStyle }} onClick={() => setAddModelOpen(true)}>
                  <strong>+ {t('add')}</strong>
                </Button>
              </Col>
              <Col span={5}>
                <Button
                  block
                  icon={<DownloadOutlined style={{ marginRight: '4px' }} />}
                  type="text"
                  shape="round"
                  loading={fetchAllUsersMutation.isLoading}
                  style={{ ...buttonStyle, border: '1px solid' }}
                  onClick={() => onExportToCSV()}
                >
                  <strong>{t('export csv')}</strong>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <UsersTable
          isAdmin={isAdmin}
          total={total as number}
          onDelete={onDeleteUser}
          onSelectUser={user => {
            setSelectedUser(user);
            setUpdateModalOpen(true);
          }}
          isLoading={
            searchUsersQuery.isFetching ||
            fetchUsersQuery.isFetching ||
            deleteUserMutation.isLoading ||
            addUserMutation.isLoading ||
            updateUserMutation.isLoading
          }
          users={users}
          current={current}
          setCurrent={setCurrent}
          itemPerPage={itemPerPage}
          setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
          showUpdateBtn={true}
        />
      </Col>
    </Row>
  );
}
