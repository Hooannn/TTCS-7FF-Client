import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { getI18n, useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { containerStyle } from '../assets/styles/globalStyle';
import '../assets/styles/components/AboutUs.css';

interface IProps {
  isAboutPage?: boolean;
}

const STORY = {
  brief: {
    en: 'Started as a startup project aiming to bring the best snacking experience to everyone, creating a brand with validity, quality, good service, fast delivery with our exquisite, safe and affordable snack, 7FF (short for 7 Fast Food) is a food chain that specialize in providing refreshment and snack as well as conventional fast food...',
    vi: '7FF là viết tắt của Seven Fast Food, cái tên được bắt nguồn từ một nhóm khởi nghiệp với 7 tiêu chí là: Uy tín, chất lượng, phục vụ tận tình, giao hàng nhanh chóng, món ăn ngon, đạt chuẩn an toàn thực phẩm và giá cả hợp lý. 7FF bán chủ yếu là đồ ăn vặt và một số thức ăn nhanh phổ biến...',
  },
  fullPart01: {
    en: 'Started as a startup project aiming to bring the best snacking experience to everyone, creating a brand with validity, quality, good service, fast delivery with our exquisite, safe and affordable snack, 7FF (short for 7 Fast Food) is a food chain that specialize in providing refreshment and snack as well as conventional fast food.\nWe are aiming to broaden our reach from the Xuân Thới Sơn, Hóc Môn District, Hồ Chí Minh City HQ and so far, have successfully opened 7 branch restaurants in near by districts and wards, serving more than 2 thousand customers everyday.',
    vi: '7FF là viết tắt của Seven Fast Food, cái tên được bắt nguồn từ một nhóm khởi nghiệp với 7 tiêu chí là: Uy tín, chất lượng, phục vụ tận tình, giao hàng nhanh chóng, món ăn ngon, đạt chuẩn an toàn thực phẩm, giá cả hợp lý. 7FF bán chủ yếu là đồ ăn vặt và một số thức ăn nhanh phổ biến.\nHiện tại, trụ sở chính của 7FF ở Xuân Thới Sơn, Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam. Cùng với đó là 7 chi nhánh có mặt ở các quận huyện lân cận, với hơn 2000 đơn được phục vụ mỗi ngày.',
  },
  fullPart02: {
    en: '"Yêu là phải nói, như đói là phải ăn !"\nIn order to bring you the best experience, our staff members all have been carefully selected and trained to provide the premium quality food and service in our restaurant.\nWe are always aware of customers’ evolving tastes. That’s why on top of ensuring only the best quality food are being serve to our customers, our refreshment selection always changing and constantly bringing new flavor to the menu, satisfying all your snacking needs.',
    vi: '"Yêu là phải nói, như đói là phải ăn !"\nNhằm đem đến trải nghiệm tốt nhất cho khách hàng, tất cả nhân viên trong đội ngũ của 7FF đều được tuyển chọn và đào tạo kỹ lưỡng để có thể đảm bảo được chất lượng của món ăn và chất lượng phục vụ.\nNgoài việc chú trọng hương vị của thức ăn, 7FF còn hướng đến cho khách hàng nhiều sự lựa chọn, với mong muốn đáp ứng các nhu cầu ăn vặt của khách hàng. Thay đổi, bức phá, đáp ứng thị hiếu của khách hàng luôn là mục tiêu mà 7FF hướng tới.',
  },
  fullPart03: {
    en: "“Don’t worry about failure, you only have to be right once” - Drew Houston\n7FF is a food chain begin its life as four students' startup project. Our journey initiated as a small kiot selling snacks with no name for ourself, with the amount of orders and customers just barely enough to get by.\nWithout proper funding as well as zero experience in operating a business, couple with inept customer service and a limited menu, we soon found ourself in a crisis with what seems like no way out. But with our perseverance to make 7FF’s vision a reality, we overcome all those hardship to become a citywide successful snack brand.",
    vi: '7FF là thương hiệu do một nhóm sinh viên lập nghiệp gồm 4 thành viên xây dựng nên. Xuất phát điểm của 7FF là một cửa hàng đồ ăn vặt nhỏ, chưa nhận được sự quan tâm của khách hàng. Số lượng khách hàng và đơn hàng mỗi ngày đều ở mức rất thấp. Thậm chí đã có thời điểm doanh thu chỉ đủ đáp ứng cho vật liệu và các chi phí phát sinh.\nKhi mới thành lập, 7FF gặp phải rất nhiều khó khăn như thiếu vốn đầu tư, kinh nghiệm vận hành, chất lượng dịch vụ và thực đơn còn hạn chế. Với những khó khăn trên 7FF đã phải trải qua một giai đoạn khủng hoảng. Bằng sự kiên trì, học hỏi và nghiên cứu và tích cực đổi mới, 7FF đã vượt qua giai đoạn khó khăn và hiện trở thành một trong những thương hiệu đồ ăn vặt phổ biến nhất.',
  },
};

const AboutUs: FC<IProps> = ({ isAboutPage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';

  return (
    <section className="about-us">
      {isAboutPage ? (
        <>
          <div className="container" style={containerStyle}>
            <div className="image-wrapper">
              <img src="/about-img.png" />
            </div>
            <div className="story-wrapper">
              <h2 className="heading">{t('we are 7ff')}</h2>
              {STORY.fullPart01[locale].split('\n').map((prg: string, i: number) => (
                <p className="story" key={i}>
                  {prg}
                </p>
              ))}
            </div>
          </div>
          <div className="container" style={{ ...containerStyle, marginTop: -40 }}>
            <div className="story-wrapper">
              <h2 className="heading">{t('just a message from 7ff')} ...</h2>
              {STORY.fullPart02[locale].split('\n').map((prg: string, i: number) => (
                <p className="story" key={i}>
                  {prg}
                </p>
              ))}
            </div>
            <div className="image-wrapper">
              <img src="/about-img-2.png" style={{ width: 420 }} />
            </div>
          </div>
          <div className="container" style={{ ...containerStyle, marginTop: -24 }}>
            <div className="image-wrapper">
              <img src="/about-img-3.png" />
            </div>
            <div className="story-wrapper">
              <h2 className="heading">{t('start-up story of 7ff')}</h2>
              {STORY.fullPart03[locale].split('\n').map((prg: string, i: number) => (
                <p className="story" key={i}>
                  {prg}
                </p>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="container" style={containerStyle}>
          <div className="image-wrapper">
            <img src="/about-img.png" />
          </div>
          <div className="story-wrapper">
            <h2 className="heading">{t('we are 7ff')}</h2>
            <p className="story">{STORY.brief[locale]}</p>
            <Button type="primary" shape="round" size="large" className="read-more-btn" onClick={() => navigate('/about')}>
              {t('read more')}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutUs;
