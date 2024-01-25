import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getI18n, useTranslation } from 'react-i18next';
import { Button, Image } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { containerStyle } from '../../assets/styles/globalStyle';

const SALE_OFF_CONTENT = {
  delivery: {
    imgSrc: 'free-delivery.jpg',
    title: {
      en: 'Free shipping',
      vi: 'Miễn phí vận chuyển',
    },
    subTitle: {
      big: {
        en: 'For orders in Hoc Mon district',
        vi: 'Cho các đơn hàng ở quận Hóc Môn',
      },
      small: {
        en: '',
        vi: '',
      },
    },
    btnText: {
      en: 'Order now',
      vi: 'Đặt hàng ngay',
    },
    btnNavigation: {
      en: '/menu',
      vi: '/menu',
    },
  },
  promotion: {
    imgSrc: 'black-pearl.jpg',
    title: {
      en: 'A free piece of black pearl',
      vi: 'Tặng 1 phần trân châu đen',
    },
    subTitle: {
      big: {
        en: 'For all milk tea served at 7FF',
        vi: 'Cho các loại trà sữa phục vụ tại 7FF',
      },
    },
    btnText: {
      en: 'See all serving milk tea',
      vi: 'Xem các loại trà sữa',
    },
    btnNavigation: {
      en: '/menu?category=Milk+tea',
      vi: '/menu?category=Trà+sữa',
    },
  },
};

const SaleOff: FC = () => {
  const { t } = useTranslation();
  const locale = getI18n().resolvedLanguage as 'en' | 'vi';
  const navigate = useNavigate();

  return (
    <section className="sale-off">
      <div className="container" style={containerStyle}>
        <div className="daily-promotions">
          <div className="promotion-card">
            <div className="image">
              <Image src={SALE_OFF_CONTENT.delivery.imgSrc} height="100%" preview={false} />
            </div>
            <div className="description">
              <h5 className="title">{SALE_OFF_CONTENT.delivery.title[locale]}</h5>
              <h6 className="sale-off-tag">
                <span>{SALE_OFF_CONTENT.delivery.subTitle.big[locale]}</span> {SALE_OFF_CONTENT.delivery.subTitle.small[locale]}
              </h6>
              <Button type="primary" shape="round" size="large" className="order-btn" onClick={() => navigate('/menu')}>
                {SALE_OFF_CONTENT.delivery.btnText[locale]} <ShoppingCartOutlined style={{ fontSize: '1.4rem' }} />
              </Button>
            </div>
          </div>
          <div className="promotion-card">
            <div className="image">
              <Image src={SALE_OFF_CONTENT.promotion.imgSrc} height="100%" preview={false} />
            </div>
            <div className="description">
              <h5 className="title">{SALE_OFF_CONTENT.promotion.title[locale]}</h5>
              <h6 className="sale-off-tag">
                <span>{SALE_OFF_CONTENT.promotion.subTitle.big[locale]}</span>
              </h6>
              <Button
                type="primary"
                shape="round"
                size="large"
                className="order-btn"
                onClick={() => navigate(SALE_OFF_CONTENT.promotion.btnNavigation[locale])}
              >
                {SALE_OFF_CONTENT.promotion.btnText[locale]}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleOff;
