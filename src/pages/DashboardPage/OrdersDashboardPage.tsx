import { Col, Row, Button } from 'antd';
import { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { getI18n, useTranslation } from 'react-i18next';
import { buttonStyle } from '../../assets/styles/globalStyle';
import OrdersTable from '../../components/dashboard/orders/OrdersTable';
import { IOrder, IProduct, IResponseData } from '../../types';
import useOrders from '../../services/orders';
import { exportToCSV } from '../../utils/export-csv';
import UpdateOrderModal from '../../components/dashboard/orders/UpdateOrderModal';
import SortAndFilter from '../../components/dashboard/orders/SortAndFilter';
import useTitle from '../../hooks/useTitle';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
export default function UsersDashboardPage() {
  // TODO: Search, filter, pagination
  const {
    fetchOrdersQuery,
    orders,
    total,
    deleteOrderMutation,
    updateOrderMutation,
    current,
    setCurrent,
    buildQuery,
    onFilterSearch,
    searchOrdersQuery,
    onResetFilterSearch,
    itemPerPage,
    setItemPerPage,
  } = useOrders({ enabledFetchOrders: true });
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const axios = useAxiosIns();
  const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const { t } = useTranslation();
  useTitle(`${t('orders')} - 7FF`);
  const onUpdateOrder = (values: IOrder) => {
    updateOrderMutation.mutateAsync({ orderId: selectedOrder?._id as string, data: values }).finally(() => setUpdateModalOpen(false));
  };
  const onDeleteVoucher = (orderId: string) => {
    deleteOrderMutation.mutate(orderId);
  };

  const fetchAllOrdersMutation = useMutation({
    mutationFn: () => axios.get<IResponseData<IOrder[]>>(`/orders`),
  });

  const onExportToCSV = async () => {
    const { data } = await fetchAllOrdersMutation.mutateAsync();
    const orders = data?.data.map(rawOrder => ({
      [t('id').toString()]: rawOrder._id,
      [t('created at')]: dayjs(rawOrder.createdAt).format('DD/MM/YYYY'),
      [t('customer id')]: rawOrder.customerId,
      [t('total price')]: rawOrder.totalPrice,
      [t('voucher')]: (rawOrder.voucher as any)?.code,
      [t('note')]: rawOrder.note,
      [t('is delivery')]: rawOrder.isDelivery
        ? `${t('phone number')}: ${rawOrder.deliveryPhone}, ${t('address')}: ${rawOrder.deliveryAddress}`
        : t('no'),
      [t('status')]: t(rawOrder.status.toLowerCase()).toString(),
      [t('items')]: rawOrder.items?.map((item: any) => `${item.product?.name[locale]} x ${item.quantity}`).join(','),
    }));
    exportToCSV(orders, `7FF_Orders_${Date.now()}`);
  };

  return (
    <Row>
      <UpdateOrderModal
        isLoading={updateOrderMutation.isLoading}
        onSubmit={onUpdateOrder}
        order={selectedOrder}
        shouldOpen={shouldUpdateModalOpen}
        onCancel={() => setUpdateModalOpen(false)}
      />
      <Col span={24}>
        <Row align="middle">
          <Col span={12}>
            <h2>{t('orders')}</h2>
          </Col>
          <Col span={12}>
            <Row align="middle" justify="end" gutter={8}>
              <Col span={5}>
                <SortAndFilter onChange={buildQuery} onSearch={onFilterSearch} onReset={onResetFilterSearch} />
              </Col>
              {/*<Col span={5}>
                <Button block shape="round" style={{ ...secondaryButtonStyle }} onClick={() => setAddModelOpen(true)}>
                  <strong>+ {t('add')}</strong>
                </Button>
  </Col>*/}
              <Col span={5}>
                <Button
                  block
                  icon={<DownloadOutlined style={{ marginRight: '4px' }} />}
                  type="text"
                  shape="round"
                  style={buttonStyle}
                  loading={fetchAllOrdersMutation.isLoading}
                  onClick={() => onExportToCSV()}
                >
                  <strong>{t('export csv')}</strong>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <OrdersTable
          total={total as number}
          onDelete={onDeleteVoucher}
          onSelectOrder={order => {
            setSelectedOrder(order);
            setUpdateModalOpen(true);
          }}
          isLoading={searchOrdersQuery.isFetching || fetchOrdersQuery.isFetching || deleteOrderMutation.isLoading || updateOrderMutation.isLoading}
          orders={orders}
          current={current}
          setCurrent={setCurrent}
          itemPerPage={itemPerPage}
          setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
        />
      </Col>
    </Row>
  );
}
