import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Button, Divider, Empty, Modal, Row, Select, Skeleton, Table } from 'antd';
import useTitle from '../../hooks/useTitle';
import useAxiosIns from '../../hooks/useAxiosIns';
import ProfileSidebar from '../../components/ProfileSidebar';
import { IReservation, IResponseData, ReservationStatus } from '../../types';
import { RootState } from '../../store';
import { containerStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/pages/ProfilePage.css';

const MyReservationsPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const axios = useAxiosIns();
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeStatus, setActiveStatus] = useState<ReservationStatus | ''>('');
  const [sortOption, setSortOption] = useState('bookingTime');
  const fetchReservationsQuery = useQuery(['my-reservations', sortOption], {
    queryFn: () => axios.get<IResponseData<IReservation[]>>(`/my-reservations?email=${user.email}&sort=${sortOption}`),
    enabled: true,
    refetchIntervalInBackground: true,
    refetchInterval: 10 * 60 * 1000,
    select: res => res.data,
  });
  const reservations = fetchReservationsQuery.data?.data ?? [];
  useTitle(`${t('my table reservations')} - 7FF`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RESERVATION_STATUSES = ['Processing', 'Done'];
  const MATCHING_ITEMS = reservations.filter((reservation: IReservation) => reservation.status === activeStatus || activeStatus === '');

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeReservationId, setActiveReservationId] = useState<string>('');

  return (
    <div className="profile-page">
      <section className="container-wrapper">
        <div className="container" style={containerStyle}>
          <ProfileSidebar />

          <div className="my-orders">
            <div className="heading">{t('my table reservations')}</div>
            {fetchReservationsQuery.isLoading && <Skeleton />}

            {reservations.length === 0 && !fetchReservationsQuery.isLoading && (
              <div className="empty-order empty-reservation">
                <div className="empty-order-discover" style={{ color: '#332e2e' }}>
                  <h2>{t("let's start a new")}</h2>
                  <h3>{t('table reservation!')}</h3>
                  <Button size="large" shape="round" onClick={() => navigate('/booking')} className="start-order-btn">
                    {t('start reserving')}
                  </Button>
                </div>
              </div>
            )}

            {reservations.length > 0 && !fetchReservationsQuery.isLoading && (
              <div>
                <div className="order-filter">
                  <div className="status-options">
                    {RESERVATION_STATUSES.map((status: string) => (
                      <div
                        key={status}
                        onClick={() => setActiveStatus(prev => (prev !== status ? (status as ReservationStatus) : ''))}
                        className={`status-option-item ${activeStatus === status ? 'active' : ''}`}
                      >
                        {t(status.toLowerCase())}
                      </div>
                    ))}
                  </div>
                  <div className="sort-options">
                    <Select
                      placeholder={t('sort by...').toString()}
                      size="large"
                      style={{ width: 200 }}
                      dropdownStyle={{ padding: 5 }}
                      value={sortOption}
                      onChange={value => setSortOption(value)}
                    >
                      <Select.Option value="bookingTime" className="sort-option-item">
                        {t('reservation time')}
                      </Select.Option>
                      <Select.Option value="createdAt" className="sort-option-item">
                        {t('oldest reservations')}
                      </Select.Option>
                      <Select.Option value="" className="sort-option-item">
                        {t('latest reservations')}
                      </Select.Option>
                      <Select.Option value="status" className="sort-option-item">
                        {t('reservation status')}
                      </Select.Option>
                    </Select>
                  </div>
                </div>
                <div className="order-list">
                  <Table
                    dataSource={MATCHING_ITEMS}
                    locale={{
                      emptyText: (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description={
                            <p style={{ margin: '15px 0 0', fontSize: 15, fontWeight: 500, fontStyle: 'italic' }}>
                              {t('you have no reservation with status')}: {t(activeStatus.toLocaleLowerCase())}.
                            </p>
                          }
                        />
                      ),
                    }}
                    rowKey={(record: IReservation) => record._id as string}
                    columns={[
                      { title: t('reservation ID'), dataIndex: '_id', width: 210 },
                      {
                        title: t('reservation time'),
                        dataIndex: 'bookingTime',
                        render: value => <span>{dayjs(new Date(parseInt(value.toString()))).format('YYYY-MM-DD HH:mm')}</span>,
                      },
                      {
                        title: t('request making time'),
                        dataIndex: 'createdAt',
                        render: value => <span>{dayjs(value).format('DD/MM/YYYY HH:mm')}</span>,
                      },
                      {
                        title: t('number of guests'),
                        dataIndex: 'attrs',
                        align: 'center',
                        width: 90,
                        render: value => <span>{`0${value?.guests}`.slice(-2)}</span>,
                      },
                      {
                        title: t('status'),
                        dataIndex: 'status',
                        width: 130,
                        align: 'center',
                        render: (value: ReservationStatus) => <span className={`table-order-status ${value}`}>{t(value.toLocaleLowerCase())}</span>,
                      },
                      {
                        title: t('details'),
                        render: (_, record: IReservation) => (
                          <Button
                            type="primary"
                            shape="round"
                            onClick={() => {
                              setActiveReservationId(record?._id ? record._id : '');
                              setOpenModal(true);
                            }}
                            style={{ fontWeight: 500 }}
                          >
                            {t('view')}
                          </Button>
                        ),
                      },
                    ]}
                    pagination={{ defaultPageSize: 4, showSizeChanger: false }}
                  />
                </div>
              </div>
            )}
          </div>

          {openModal && (
            <OrderDetailModal
              reservationId={activeReservationId}
              onClose={() => {
                setOpenModal(false);
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
};

interface IModalProps {
  reservationId: string;
  onClose: () => void;
}

const OrderDetailModal: FC<IModalProps> = ({ reservationId, onClose }) => {
  const axios = useAxiosIns();
  const { t } = useTranslation();

  const getReservationDetailQuery = useQuery(['reservation-details'], {
    queryFn: () => axios.get(`/reservation/${reservationId}`),
    refetchOnWindowFocus: false,
    select: res => res.data,
  });
  const reservationDetails = getReservationDetailQuery.data?.data;

  return (
    <Modal
      title={t('reservation details')}
      open
      onCancel={onClose}
      width={650}
      centered
      footer={[
        <Button key="close" type="primary" onClick={onClose} disabled={!reservationDetails} style={{ fontWeight: 500 }}>
          {t('close')}
        </Button>,
      ]}
    >
      {getReservationDetailQuery.isLoading ? (
        <Skeleton />
      ) : reservationDetails ? (
        <div className="order-details">
          <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
          <Row justify="space-between" align="middle">
            <span className="bold-text">{t("customer's name")}:</span>
            <span>{reservationDetails.underName}</span>
          </Row>
          <Row justify="space-between" align="middle">
            <span className="bold-text">{t('phone number')}:</span>
            <span>{reservationDetails.contacts.phone}</span>
          </Row>
          <Row justify="space-between" align="middle">
            <span className="bold-text">Email:</span>
            <span>{reservationDetails.contacts.email}</span>
          </Row>
          <Row justify="space-between" align="middle">
            <span className="bold-text">{t('reservation ID')}:</span>
            <span>{reservationDetails._id}</span>
          </Row>
          <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
          <Row justify="space-between" align="middle">
            <span className="bold-text">{t('reservation created date')}:</span>
            <span>{dayjs(reservationDetails.createdAt).format('DD/MM/YYYY HH:mm')}</span>
          </Row>
          <Row justify="space-between" align="middle">
            <span className="bold-text">{t('last time status updated')}:</span>
            <span>{dayjs(reservationDetails.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
          </Row>
          <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
          <Row justify="space-between" align="middle">
            <span className="bold-text">{t('number of guests')}:</span>
            <span className="bold-text" style={{ textTransform: 'lowercase' }}>
              {`0${reservationDetails.attrs.guests}`.slice(-2)} {reservationDetails.attrs.guests > 1 ? t('guests') : t('guest')}
            </span>
          </Row>
          <Row justify="space-between" align="middle">
            <span className="bold-text">{t('booking time')}:</span>
            <span className="bold-text">{dayjs(reservationDetails.bookingTime).format('DD/MM/YYYY HH:mm')}</span>
          </Row>
          <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
        </div>
      ) : (
        <div>
          <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
          <p style={{ marginBlock: 50, color: 'rgba(0, 0, 0, 0.25)', textAlign: 'center', fontWeight: 500, fontStyle: 'italic' }}>
            {t('cannot find information for the reservation with ID')}: {reservationId}
          </p>
          <Divider style={{ margin: '12px 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
        </div>
      )}
    </Modal>
  );
};

export default MyReservationsPage;
