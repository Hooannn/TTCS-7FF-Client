import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getI18n, useTranslation } from 'react-i18next';
import { Row, Col, Button, Space } from 'antd';
import useTitle from '../../hooks/useTitle';
import useAxiosIns from '../../hooks/useAxiosIns';
import Loading from '../../components/shared/Loading';
import { IOrder, IResponseData } from '../../types';
import { buttonStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/pages/ThankYouPage.css';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const axios = useAxiosIns();
  const { orderId } = useParams();
  const getOrderByIdQuery = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => axios.get<IResponseData<IOrder>>(`/orders/${orderId}`),
  });
  const order = getOrderByIdQuery.data?.data?.data;
  const { t } = useTranslation();
  useTitle(`${t('thank you')} - 7FF`);

  return (
    <Row align="middle" justify="center" className="thank-you-page">
      {getOrderByIdQuery.isLoading && <Loading />}
      {!getOrderByIdQuery.isLoading && (
        <>
          <img src="/tkp-left-pattern.png" className="abs-bg-img left-pattern" />
          <img src="/tkp-right-pattern.png" className="abs-bg-img right-pattern" />
          <Col>
            <div className="thank-you-title">
              <img src="/tkp-title.png" className="thank-you-title-img" />
              <p>{getI18n().resolvedLanguage === 'en' ? 'for your order' : 'cảm ơn bạn đã ủng hộ 7FF'}</p>
            </div>

            <div className="order-info">
              <h4 className="title">{t('your order has been received')} !</h4>
              <p className="sub-title">{`${t('order ID')}: ${order?.orderId}`}</p>
              <Space align="center" size={12}>
                <Button onClick={() => navigate('/profile/orders')} style={{ ...buttonStyle, width: 220 }} shape="round" className="to-my-orders">
                  <strong>{t('see your orders')}</strong>
                </Button>
                <Button onClick={() => navigate('/menu')} style={{ ...buttonStyle, width: 220 }} type="primary" shape="round" className="to-menu">
                  <strong> {t('buy again')}</strong>
                </Button>
              </Space>
            </div>
          </Col>
        </>
      )}
    </Row>
  );
}
