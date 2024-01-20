import { Col, Row, Button } from 'antd';
import { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { buttonStyle, secondaryButtonStyle } from '../../assets/styles/globalStyle';
import AddVoucherModal from '../../components/dashboard/vouchers/AddVoucherModal';
import VouchersTable from '../../components/dashboard/vouchers/VouchersTable';
import { IResponseData, IVoucher } from '../../types';
import useVouchers from '../../services/vouchers';
import { exportToCSV } from '../../utils/export-csv';
import UpdateVoucherModal from '../../components/dashboard/vouchers/UpdateVoucherModal';
import SortAndFilter from '../../components/dashboard/vouchers/SortAndFilter';
import useTitle from '../../hooks/useTitle';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
export default function UsersDashboardPage() {
  const {
    fetchVouchersQuery,
    vouchers,
    total,
    addVoucherMutation,
    deleteVoucherMutation,
    updateVoucherMutation,
    current,
    setCurrent,
    buildQuery,
    onFilterSearch,
    searchVouchersQuery,
    onResetFilterSearch,
    itemPerPage,
    setItemPerPage,
  } = useVouchers({ enabledFetchVouchers: true });
  const [shouldAddModalOpen, setAddModelOpen] = useState(false);
  const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
  const { t } = useTranslation();
  const axios = useAxiosIns();
  useTitle(`${t('vouchers')} - 7FF`);

  const onAddVoucher = (values: IVoucher) => {
    addVoucherMutation.mutateAsync(values).finally(() => setAddModelOpen(false));
  };
  const onUpdateVoucher = (values: IVoucher) => {
    updateVoucherMutation.mutateAsync({ voucherId: selectedVoucher?._id as string, data: values }).finally(() => setUpdateModalOpen(false));
  };
  const onDeleteVoucher = (voucherId: string) => {
    deleteVoucherMutation.mutate(voucherId);
  };

  const fetchAllVouchersMutation = useMutation({
    mutationFn: () => axios.get<IResponseData<IVoucher[]>>(`/vouchers`),
  });

  const onExportToCSV = async () => {
    const { data } = await fetchAllVouchersMutation.mutateAsync();
    const vouchers = data?.data.map(rawVoucher => ({
      [t('id').toString()]: rawVoucher._id,
      [t('created at')]: dayjs(rawVoucher.createdAt).format('DD/MM/YYYY'),
      [t('code')]: rawVoucher.code,
      [t('discount type')]: t(rawVoucher.discountType),
      [t('discount amount')]: rawVoucher.discountAmount,
      [t('total usage limit')]: rawVoucher.totalUsageLimit,
      [t('expired date')]: dayjs(rawVoucher.expiredDate).format('DD/MM/YYYY'),
    }));
    exportToCSV(vouchers, `7FF_Vouchers_${Date.now()}`);
  };

  return (
    <Row>
      <UpdateVoucherModal
        isLoading={updateVoucherMutation.isLoading}
        onSubmit={onUpdateVoucher}
        voucher={selectedVoucher}
        shouldOpen={shouldUpdateModalOpen}
        onCancel={() => setUpdateModalOpen(false)}
      />
      <AddVoucherModal
        onSubmit={onAddVoucher}
        isLoading={addVoucherMutation.isLoading}
        shouldOpen={shouldAddModalOpen}
        onCancel={() => setAddModelOpen(false)}
      />

      <Col span={24}>
        <Row align="middle">
          <Col span={12}>
            <h2>{t('vouchers')}</h2>
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
                  style={buttonStyle}
                  loading={fetchAllVouchersMutation.isLoading}
                  onClick={() => onExportToCSV()}
                >
                  <strong>{t('export csv')}</strong>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <VouchersTable
          total={total as number}
          onDelete={onDeleteVoucher}
          onSelectVoucher={voucher => {
            setSelectedVoucher(voucher);
            setUpdateModalOpen(true);
          }}
          isLoading={
            searchVouchersQuery.isFetching ||
            fetchVouchersQuery.isFetching ||
            deleteVoucherMutation.isLoading ||
            addVoucherMutation.isLoading ||
            updateVoucherMutation.isLoading
          }
          vouchers={vouchers}
          current={current}
          setCurrent={setCurrent}
          itemPerPage={itemPerPage}
          setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
        />
      </Col>
    </Row>
  );
}
