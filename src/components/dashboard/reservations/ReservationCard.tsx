import { Card, Descriptions, Badge, Tooltip, Button } from 'antd';
import { IReservation } from '../../../types';
import { useTranslation } from 'react-i18next';
import dayjs from '../../../libs/dayjs';
import { CheckOutlined, BackwardOutlined } from '@ant-design/icons';

interface ReservationCardProps {
  reservation: IReservation;
  isLoading?: boolean;
  onUpdateStatus: ({ reservationId, status }: { reservationId: string; status: string }) => void;
}

export default function ReservationCard({ reservation, isLoading, onUpdateStatus }: ReservationCardProps) {
  const { t } = useTranslation();
  return (
    <Card
      style={{ boxShadow: '0px 0px 16px rgba(17,17,26,0.1)', color: '#222831' }}
      extra={
        reservation.status === 'Processing' ? (
          <Tooltip title={t('mark as done')}>
            <Button
              onClick={() => onUpdateStatus({ reservationId: reservation._id as string, status: 'Done' })}
              loading={isLoading}
              size="small"
              type="text"
              style={{ background: 'darkgreen' }}
              shape="circle"
              icon={<CheckOutlined style={{ color: 'white', fontSize: '12px' }} />}
            />
          </Tooltip>
        ) : (
          <Tooltip title={t('mark as undone')}>
            <Button
              onClick={() => onUpdateStatus({ reservationId: reservation._id as string, status: 'Processing' })}
              loading={isLoading}
              size="small"
              type="text"
              style={{ background: 'orangered' }}
              shape="circle"
              icon={<BackwardOutlined style={{ color: 'white', fontSize: '12px' }} />}
            />
          </Tooltip>
        )
      }
      size="small"
      title={
        <>
          {t('reservation id').toString()} {reservation._id?.toString()}
        </>
      }
    >
      <Descriptions layout="vertical">
        <Descriptions.Item span={2} label={t('customer name')}>
          {reservation.underName}
        </Descriptions.Item>
        <Descriptions.Item span={2} label={t('number of guests')}>
          {reservation.attrs?.guests}
        </Descriptions.Item>
        <Descriptions.Item span={2} label={t('booking time')}>
          {dayjs(new Date(parseInt(reservation.bookingTime.toString()))).format('YYYY-MM-DD HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item span={2} label={t('phone number')}>
          {reservation.contacts?.phone || t('not updated yet')}
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Email">
          {reservation.contacts?.email || t('not updated yet')}
        </Descriptions.Item>
        <Descriptions.Item span={2} label={t('status')}>
          <Badge status={reservation.status === 'Done' ? 'success' : 'processing'} text={t((reservation.status as string).toLowerCase())} />
        </Descriptions.Item>
        <Descriptions.Item span={2} label={t('customer id')}>
          {reservation.customerId || t('not updated yet')}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
