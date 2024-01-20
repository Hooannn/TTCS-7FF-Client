import { FC } from 'react';
import { getI18n, useTranslation } from 'react-i18next';
import { Layout } from 'antd';
import { FacebookOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, UsergroupAddOutlined, YoutubeOutlined } from '@ant-design/icons';
import { containerStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/components/Footer.css';

const FOOTER_CONTENT = {
  openingHours: {
    en: '7.00 Am - 10.00 Pm',
    vi: '7:00 Sáng - 10:00 Tối',
  },
  address: {
    en: 'Xuân Thới Sơn commune, Hóc Môn district, Hồ Chí Minh city',
    vi: 'Xã Xuân Thới Sơn, huyện Hóc Môn, thành phố Hồ Chí Minh',
  },
  socialInvitation: {
    en: 'Hey there fast food lovers! Keep your eye on our social media to not miss any attractive promotions. Give us a follow and stay tuned!',
    vi: 'Nếu bạn muốn biết thông tin về các chương trình khuyến mãi và các món ăn sắp được bán trong thời gian tới, hãy theo dõi chúng mình nha!',
  },
  contact: {
    email: 'sevenfastfoodservice@gmail.com',
    emailHref: 'sevenfastfoodservice@gmail.com',
    phone: '(+84) 913.283.742',
    phoneHref: '0913283742',
    addressUrl: { en: 'https://goo.gl/maps/9yw2H8hHaALagiwQ6', vi: 'https://goo.gl/maps/6RKi8R13P296uq2z7' },
    facebookUrl: 'https://www.facebook.com/bichdung.nguyen.311',
    instagramUrl: 'https://www.instagram.com/ygohappy123',
    youtubeUrl: 'https://www.youtube.com/channel/UCnptFzQJtuSQNMmE5ljel_Q',
  },
};

const Footer: FC = () => {
  const { t } = useTranslation();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const year = new Date().getFullYear().toString();

  return (
    <Layout.Footer className="footer">
      <div className="container" style={containerStyle}>
        <div className="footer-row">
          <div className="footer-col opening-hours">
            <h4 className="heading">{t('opening hours')}</h4>
            <span className="text">{FOOTER_CONTENT.openingHours[locale]}</span>
            <span className="text">{t('everyday')}</span>
            <span
              className="text address"
              style={{ width: 250 }}
              onClick={() => window.open(FOOTER_CONTENT.contact.addressUrl[locale], '_blank', 'noopener,noreferrer')}
            >
              {FOOTER_CONTENT.address[locale]}
            </span>
          </div>
          <div className="footer-col social-platforms">
            <h4 className="heading">7FF - {year}</h4>
            <span className="text">{FOOTER_CONTENT.socialInvitation[locale]}</span>
            <div className="social-links">
              <FacebookOutlined
                className="social-link"
                style={{ fontSize: '1.5rem' }}
                onClick={() => window.open(FOOTER_CONTENT.contact.facebookUrl, '_blank', 'noopener,noreferrer')}
              />
              <InstagramOutlined
                className="social-link"
                style={{ fontSize: '1.5rem' }}
                onClick={() => window.open(FOOTER_CONTENT.contact.instagramUrl, '_blank', 'noopener,noreferrer')}
              />
              <YoutubeOutlined
                className="social-link"
                style={{ fontSize: '1.5rem' }}
                onClick={() => window.open(FOOTER_CONTENT.contact.youtubeUrl, '_blank', 'noopener,noreferrer')}
              />
            </div>
          </div>
          <div className="footer-col contact-us">
            <h4 className="heading">{t('contact us')}</h4>
            <div className="contact-box" onClick={() => window.open(FOOTER_CONTENT.contact.facebookUrl, '_blank', 'noopener,noreferrer')}>
              {t('recruitment')}
              <UsergroupAddOutlined />
            </div>
            <div className="contact-box">
              <a href={`tel:${FOOTER_CONTENT.contact.phoneHref}`}>
                {FOOTER_CONTENT.contact.phone}
                <PhoneOutlined />
              </a>
            </div>
            <div className="contact-box">
              <a href={`mailto:${FOOTER_CONTENT.contact.emailHref}`}>
                {FOOTER_CONTENT.contact.email}
                <MailOutlined />
              </a>
            </div>
          </div>
        </div>
        <p className="copyright">
          &#169; {year} - {t('all rights reserved by 7FF')}
        </p>
      </div>
    </Layout.Footer>
  );
};

export default Footer;
