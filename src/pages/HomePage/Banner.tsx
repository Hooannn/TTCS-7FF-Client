import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getI18n, useTranslation } from 'react-i18next';
import { Button, Carousel } from 'antd';
import { containerStyle } from '../../assets/styles/globalStyle';

const BANNER_CAROUSEL_CONTENT = [
  {
    title: {
      en: '7 Fast Food restaurant',
      vi: 'Nhà hàng 7 Fast Food',
    },
    description: {
      en: 'With 7 criteria as our pointer, highly trained employees and a diverse menu to select from, here at 7FF we value each and every order placed to bring you the best snacking experience.',
      vi: 'Với 7 tiêu chí đã đề ra, cùng với đội ngũ nhân viên thông qua tuyển chọn kỹ lưỡng và sự đa dạng trong các món ăn, 7FF luôn đặt tất cả tâm huyết vào từng đơn hàng để mang đến cho quý khách những trải nghiệm tuyệt vời nhất.',
    },
    buttonTitle: 'learn more about us',
    btnNavigation: '/about',
  },
  {
    title: {
      en: 'Yêu là phải nói, như đói là phải ăn !',
      vi: 'Yêu là phải nói, như đói là phải ăn !',
    },
    description: {
      en: '7FF is a food chain that specialize in providing refreshment and snack as well as conventional fast food. In order to bring you the best dining experience, our staff members all have been carefully selected and trained to provide the premium quality meals and service in our restaurant.',
      vi: '7FF được biết đến với các món ăn vặt quen thuộc và phổ biến. Tất cả các nhân viên trong đội ngũ của 7FF đều được tuyển chọn và đào tạo kỹ lưỡng để có thể đảm bảo được chất lượng của món ăn và chất lượng phục vụ.',
    },
    buttonTitle: 'see the menu',
    btnNavigation: '/menu',
  },
  {
    title: {
      en: "7ff's signature dish",
      vi: 'Món ăn đặc trưng của 7ff',
    },
    description: {
      en: 'Rainbow popsicle\nRaibow popsicle made from natural fruits: strawberry, orange, kiwi, butterfly pea flower and blueberry.',
      vi: 'Kem que cầu vòng\nKem cầu vòng được làm hoàn toàn từ trái cây tự nhiên, gồm các vị: dâu, cam vàng, kiwi, hoa đậu biếc và việt quốc.',
    },
    buttonTitle: 'see details',
    btnNavigation: '/product/6458fb3f12088981acc6f36a',
  },
];

const Banner: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';

  return (
    <section className="banner">
      <img src="/hero-banner.jpg" className="banner-img" />
      <div className="container" style={containerStyle}>
        <Carousel className="carousel" autoplay>
          {BANNER_CAROUSEL_CONTENT.map((item, i) => (
            <div key={i} className="carousel-item-wrapper">
              <div className="carousel-item">
                <h1 className="header">{item.title[locale]}</h1>
                {item.description[locale].split('\n').map((prg, _i) => (
                  <span key={_i} className="description">
                    {prg}
                  </span>
                ))}
                <Button type="primary" shape="round" size="large" className="order-btn" onClick={() => navigate(item.btnNavigation)}>
                  {t(item.buttonTitle)}
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default Banner;
