import { Row, Col, Card, Empty, Badge, Button, Select } from 'antd';
import useReservations from '../../services/reservations';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import dayjs from '../../libs/dayjs';
import ReservationCard from '../../components/dashboard/reservations/ReservationCard';

export default function ReservationsDashboardPage() {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { reservations, fetchReservationsQuery, updateReservationMutation, setFilter } = useReservations({ enabledFetchReservations: true });
  const [status, setStatus] = useState<'Processing' | 'Done'>('Processing');
  const onUpdateReservationStatus = ({ reservationId, status }: { reservationId: string; status: string }) => {
    updateReservationMutation.mutate({ reservationId, reservation: { status: status as any } });
  };

  useEffect(() => {
    setSelectedDay(null);
    setFilter(JSON.stringify({ status }));
  }, [status]);

  const bookingDays = useMemo(() => {
    let results: any = {};
    reservations?.forEach(reservation => {
      const date = dayjs(new Date(parseInt(reservation.bookingTime.toString()))).format('YYYY-MM-DD');
      results[date] = results[date] ? results[date] + 1 : 1;
    });
    return Object.keys(results).map(key => ({
      date: key,
      count: results[key],
    }));
  }, [reservations]);

  const reservationsByDate = useMemo(() => {
    return reservations?.filter(reservation => {
      const date = dayjs(new Date(parseInt(reservation.bookingTime.toString()))).format('YYYY-MM-DD');
      return date === selectedDay;
    });
  }, [selectedDay, reservations]);

  return (
    <Row>
      <Col span={24}>
        <Row align="middle" justify="space-between">
          <Col>
            <h2>{t('booking table')}</h2>
          </Col>
          <Col>
            <strong style={{ marginRight: '8px' }}>{t('status')}</strong>
            <Select value={status} size="large" style={{ width: 200 }} dropdownStyle={{ padding: 5 }} onChange={value => setStatus(value)}>
              <Select.Option value="Processing">{t('processing')}</Select.Option>
              <Select.Option value="Done">{t('done')}</Select.Option>
            </Select>
          </Col>
        </Row>
      </Col>

      <Row
        style={{
          padding: '12px 24px',
          background: 'white',
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0px 0px 16px rgba(17,17,26,0.1)',
        }}
      >
        <Col span={24} style={{ padding: '24px 0' }}>
          <Row gutter={16}>
            {bookingDays.map(bookingDay => (
              <Col key={bookingDay.date}>
                <Badge count={bookingDay.count}>
                  <Button
                    onClick={() => setSelectedDay(prev => (prev !== bookingDay.date ? bookingDay.date : null))}
                    type={selectedDay === bookingDay.date ? 'primary' : 'default'}
                    style={{ height: '80px', width: '80px', borderRadius: '12px' }}
                  >
                    <Row align="middle" justify="center">
                      <Col>
                        <div>{dayjs(bookingDay.date).format('DD/MM')}</div>
                        <strong style={{ fontSize: '22px' }}>{dayjs(bookingDay.date).format('ddd')}</strong>
                      </Col>
                    </Row>
                  </Button>
                </Badge>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={24}>
          {fetchReservationsQuery.isLoading && (
            <Row style={{ width: '100%' }} gutter={12}>
              {Array(20)
                .fill(0)
                .map((_, idx) => (
                  <Col key={idx} span={8}>
                    <Card loading style={{ height: '350px', width: '100%' }} />
                  </Col>
                ))}
            </Row>
          )}
          {!fetchReservationsQuery.isLoading && reservations && reservations.length > 0 && (
            <Row gutter={12}>
              {selectedDay
                ? reservationsByDate?.map(reservation => (
                    <Col lg={12} xl={6} key={reservation._id} style={{ paddingBottom: '24px' }}>
                      <ReservationCard
                        isLoading={updateReservationMutation.isLoading}
                        onUpdateStatus={onUpdateReservationStatus}
                        reservation={reservation}
                      />
                    </Col>
                  ))
                : reservations?.map(reservation => (
                    <Col lg={12} xl={6} key={reservation._id} style={{ paddingBottom: '24px' }}>
                      <ReservationCard
                        isLoading={updateReservationMutation.isLoading}
                        onUpdateStatus={onUpdateReservationStatus}
                        reservation={reservation}
                      />
                    </Col>
                  ))}
            </Row>
          )}
          {!fetchReservationsQuery.isLoading && reservations && reservations.length === 0 && (
            <Row gutter={12} align="middle" justify="center">
              <Col>
                <Empty></Empty>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Row>
  );
}
