import { FC, useState } from 'react';
import { getI18n, useTranslation } from 'react-i18next';
import { Button, Divider, Modal } from 'antd';

interface InfoModalProps {
  shouldOpen: boolean;
  onClose: () => void;
}
interface InfoModalPropsWithType extends InfoModalProps {
  type: modalTypes;
}
type modalTypes = keyof typeof CONTENT;

const CONTENT = {
  returnPolicy: {
    title: {
      en: 'Return Policy',
      vi: 'Chính Sách Hoàn Trả',
    },
    body: [
      {
        subTitle: {
          en: 'Applicable items',
          vi: 'Sản phẩm áp dụng',
        },
        text: {
          en: 'Assorted dried products.\nCanned cakes.\nBaking ingredients, making water.',
          vi: 'Các loại sản phẩm sấy.\nCác loại bánh đóng hộp.\nCác bộ nguyên liệu làm bánh, làm nước.',
        },
      },
      {
        subTitle: {
          en: 'Time application',
          vi: 'Thời gian áp dụng',
        },
        text: {
          en: 'Within 3 days of receiving the goods.',
          vi: 'Trong vòng 3 ngày kể từ lúc nhận hàng.',
        },
      },
      {
        subTitle: {
          en: 'Conditions apply',
          vi: 'Điều kiện áp dụng',
        },
        text: {
          en: 'The product had a manufacturing defect.\nThe product was damaged in transit.\nThe order was delivered missing or wrong product.',
          vi: 'Sản phẩm gặp lỗi trong quá trình sản xuất.\nSản phẩm bị hư hỏng trong quá trình vận chuyển.\nĐơn hàng bị giao thiếu hoặc nhầm sản phẩm.',
        },
      },
      {
        subTitle: {
          en: 'Requests for customers',
          vi: 'Yêu cầu cho khách hàng',
        },
        text: {
          en: 'There is a video of the opening process.\nReturned products must be in the same quantity as when delivered.',
          vi: 'Có video quay lại quá trình mở hàng.\nSản phẩm hoàn trả phải đầy đủ số lượng như khi được giao.',
        },
      },
    ],
  },
  termsOfDelivery: {
    title: {
      en: 'Terms Of Delivery',
      vi: 'Điều Khoản Giao Hàng',
    },
    body: [
      {
        subTitle: {
          en: 'Applicable items',
          vi: 'Sản phẩm áp dụng',
        },
        text: {
          en: 'Districts with branches 7FF: all products of 7FF.\nOther districts: dried products, canned cakes, sets of ingredients for baking, making water.',
          vi: 'Các quận có chi nhánh 7FF: tất cả sản phẩm của 7FF.\nCác quận khác: các loại sản phẩm sấy, các loại bánh đóng hộp, các bộ nguyên liệu làm bánh, làm nước.',
        },
      },
      {
        subTitle: {
          en: 'Shipping unit',
          vi: 'Đơn vị vận chuyển',
        },
        text: {
          en: 'Orders in Hoc Mon district: delivery staff from 7FF.\nOther districts: via food delivery services (Grab Food or Shopee Food).',
          vi: 'Các đơn hàng ở quận Hóc Môn: nhân viên giao hàng tại 7FF.\nCác quận khác: thông qua các dịch vụ chuyển đồ ăn (Grab Food hoặc Shopee Food).',
        },
      },
      {
        subTitle: {
          en: 'Transport fee',
          vi: 'Phí vận chuyển',
        },
        text: {
          en: 'Orders in Hoc Mon district: free shipping.\nOther districts: the shipping fee is based on the delivery services.',
          vi: 'Các đơn hàng ở quận Hóc Môn: miễn phí vận chuyển.\nOther districts: mức phí vận chuyển phụ thuộc vào đơn vị vận chuyển.',
        },
      },
      {
        subTitle: {
          en: 'Payment methods',
          vi: 'Hình thức thu tiền',
        },
        text: {
          en: 'For orders with delivery: cash on delivery (COD) or you can contact 7FF to transfer.',
          vi: 'Đối với các đơn hàng có giao hàng: thu tiền mặt lúc nhận hàng (COD) hoặc có thể liên hệ chuyển khoản cho 7FF.',
        },
      },
    ],
  },
  informationSecurity: {
    title: {
      en: 'Information Security Policy',
      vi: 'Chính Sách Bảo Mật Thông Tin',
    },
    body: [
      {
        subTitle: {
          en: 'Purpose of information collection',
          vi: 'Mục đích thu thập thông tin',
        },
        text: {
          en: 'We will use the information you have provided to process orders, provide services and manage your account, verify and execute online transactions, identify web visitors.\nWe may pass your name and address on to a third party for delivery to you (for example to a courier or delivery unit).',
          vi: 'Chúng tôi sẽ dùng thông tin bạn đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và quản lý tài khoản của bạn, xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web.\nChúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc đơn vị giao hàng).',
        },
      },
      {
        subTitle: {
          en: 'Customer benefits',
          vi: 'Quyền lợi khách hàng',
        },
        text: {
          en: 'You have the right to request access to your personal data, have the right to ask us to correct errors in your data at no cost.\nYou have the right to ask us at any time. stop using your personal data for marketing purposes and this process will also go through your consent.',
          vi: 'Bạn có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí.\nBất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị và quá trình này cũng sẽ thông qua sự đồng ý của bạn.',
        },
      },
      {
        subTitle: {
          en: 'Security',
          vi: 'Bảo mật',
        },
        text: {
          en: 'We take appropriate technical and security measures to prevent unauthorized access or that could cause damage to your information.\nYou must not use any program. program, tool or other means to interfere with the system or change the data structure.',
          vi: 'Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép có thể gây mất mát hoặc thiệt hại cho thông tin của bạn.\nMong bạn vui lòng không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu.',
        },
      },
    ],
  },
  termsOfUse: {
    title: {
      en: 'Terms Of Use',
      vi: 'Điều Khoản Sử Dụng',
    },
    body: [
      {
        subTitle: {
          en: 'Web user guide',
          vi: 'Hướng dẫn sử dụng web',
        },
        text: {
          en: 'When you visit our website, you agree to our terms.\nIt is strictly forbidden to use any part of this website for commercial purposes or on behalf of any other third party without the prior written consent of 7FF.',
          vi: 'Khi quý khách truy cập vào trang web của chúng tôi có nghĩa là quý khách đồng ý với các điều khoản của chúng tôi.\nNghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu không được sự chấp thuận bằng văn bản từ 7FF.',
        },
      },
      {
        subTitle: {
          en: 'Trademarks and copyrights',
          vi: 'Thương hiệu và bản quyền',
        },
        text: {
          en: 'All intellectual property rights (registered or unregistered), informational content and all design, text, graphics, software, images, video, music, sound, software compilation software, the source code and the underlying software are our property. Copyright is reserved.',
          vi: 'Mọi quyền sở hữu trí tuệ (đã đăng ký hoặc chưa đăng ký), nội dung thông tin và tất cả các thiết kế, văn bản, đồ họa, phần mềm, hình ảnh, video, âm nhạc, âm thanh, biên dịch phần mềm, mã nguồn và phần mềm cơ bản đều là tài sản của chúng tôi. Bản quyền đã được bảo lưu.',
        },
      },
      {
        subTitle: {
          en: 'Accept orders and prices',
          vi: 'Chấp nhận đơn hàng và giá cả',
        },
        text: {
          en: 'We reserve the right to refuse or cancel your order in case of force majeure. We may ask for more phone numbers and addresses before accepting orders.\nWe are committed to providing the most accurate pricing information to consumers. However, sometimes errors still occur, depending on the case, we will contact you for instructions or notice to cancel that order.',
          vi: 'Chúng tôi có quyền từ chối hoặc hủy đơn hàng của quý khách trong các trường hợp bất khả kháng. Chúng tôi có thể hỏi thêm về số điện thoại và địa chỉ trước khi nhận đơn hàng.\nChúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác nhất cho người tiêu dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy ra, tùy theo từng trường hợp chúng tôi sẽ liên hệ hướng dẫn hoặc thông báo hủy đơn hàng đó cho quý khách.',
        },
      },
    ],
  },
  contactInfo: {
    title: {
      en: 'Contact Information',
      vi: 'Thông Tin Liên Hệ',
    },
    body: [
      {
        subTitle: {
          en: 'Social platforms',
          vi: 'Nền tảng mạng xã hội',
        },
        text: {
          en: 'Facebook: https://www.facebook.com/bichdung.nguyen.311\nTiktok: https://www.tiktok.com/@ha21052105\nInstagram: https://www.instagram.com/ygohappy123\nYoutube: https://www.youtube.com/channel/UCnptFzQJtuSQNMmE5ljel_Q',
          vi: 'Facebook: https://www.facebook.com/bichdung.nguyen.311\nTiktok: https://www.tiktok.com/@ha21052105\nInstagram: https://www.instagram.com/ygohappy123\nYoutube: https://www.youtube.com/channel/UCnptFzQJtuSQNMmE5ljel_Q',
        },
      },
      {
        subTitle: {
          en: 'Address',
          vi: 'Địa chỉ',
        },
        text: {
          en: 'Xuân Thới Sơn commune, Hóc Môn district, Hồ Chí Minh city',
          vi: 'Xã Xuân Thới Sơn, huyện Hóc Môn, thành phố Hồ Chí Minh',
        },
      },
      {
        subTitle: {
          en: 'Phone numbers',
          vi: 'Số điện thoại',
        },
        text: {
          en: '(+84)913.283.742 (mr. Huy)\n(+84)913.283.743 (mr. Nguyen)',
          vi: '(+84)913.283.742 (anh Huy)\n(+84)913.283.743 (anh Nguyên)',
        },
      },
    ],
  },
  shippingFee: {
    title: {
      en: 'Shipping Fee',
      vi: 'Phí Vận Chuyển',
    },
    body: [
      {
        subTitle: {
          en: 'Districts in Ho Chi Minh city',
          vi: 'Các quận huyện ở thành phố Hồ Chí Minh',
        },
        text: {
          en: '',
          vi: '',
        },
      },
      {
        subTitle: {
          en: 'Districts outside Ho Chi Minh city',
          vi: 'Các quận huyện khác ngoài thành phố Hồ Chí Minh',
        },
        text: {
          en: '7ff currently does not have a delivery policy outside of Ho Chi Minh City, we sincerely apologize.',
          vi: '7FF hiện chưa có chính sách giao hàng ngoài phạm vi thành phố Hồ Chí Minh, chúng tôi chân thành xin lỗi.',
        },
      },
    ],
  },
};

const InfoModal: FC<InfoModalPropsWithType> = ({ type, shouldOpen, onClose }) => {
  const { t } = useTranslation();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';

  return (
    <Modal
      open={shouldOpen}
      width={600}
      onCancel={onClose}
      title={CONTENT[type].title[locale]}
      footer={[
        <Button key="close" type="primary" onClick={onClose} className="checkout-page-close-modal-btn" style={{ paddingBlock: 8 }}>
          {t('close')}
        </Button>,
      ]}
    >
      <Divider style={{ margin: '12px 0 0', borderWidth: 2, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
      {CONTENT[type].body.map((prg, i) => (
        <div key={i}>
          <p style={{ margin: '12px 0 8px', fontSize: '1rem', fontWeight: 500, textTransform: 'capitalize' }}>
            {`0${i + 1}`.slice(-2)}. {prg.subTitle[locale]}
          </p>
          {prg.text[locale].split('\n').map((_prg, _i) => (
            <p style={{ margin: '0 0 4px' }} key={_i}>
              - {_prg}
            </p>
          ))}
        </div>
      ))}
    </Modal>
  );
};

const ReturnPolicyModal: FC<InfoModalProps> = ({ shouldOpen, onClose }) => (
  <InfoModal type="returnPolicy" shouldOpen={shouldOpen} onClose={onClose} />
);
const TermsOfDeliveryModal: FC<InfoModalProps> = ({ shouldOpen, onClose }) => (
  <InfoModal type="termsOfDelivery" shouldOpen={shouldOpen} onClose={onClose} />
);
const TermsOfUseModal: FC<InfoModalProps> = ({ shouldOpen, onClose }) => <InfoModal type="termsOfUse" shouldOpen={shouldOpen} onClose={onClose} />;
const InformationSecurityModal: FC<InfoModalProps> = ({ shouldOpen, onClose }) => (
  <InfoModal type="informationSecurity" shouldOpen={shouldOpen} onClose={onClose} />
);
const ContactInfoModal: FC<InfoModalProps> = ({ shouldOpen, onClose }) => <InfoModal type="contactInfo" shouldOpen={shouldOpen} onClose={onClose} />;
const ShippingFeeModal: FC<InfoModalProps> = ({ shouldOpen, onClose }) => <InfoModal type="shippingFee" shouldOpen={shouldOpen} onClose={onClose} />;

const FooterModals: FC = () => {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState<modalTypes | ''>('');
  const handleClose = () => setActiveModal('');

  return (
    <div className="shipping-form__footer">
      <ReturnPolicyModal shouldOpen={activeModal === 'returnPolicy'} onClose={handleClose} />
      <TermsOfDeliveryModal shouldOpen={activeModal === 'termsOfDelivery'} onClose={handleClose} />
      <TermsOfUseModal shouldOpen={activeModal === 'termsOfUse'} onClose={handleClose} />
      <InformationSecurityModal shouldOpen={activeModal === 'informationSecurity'} onClose={handleClose} />
      <ContactInfoModal shouldOpen={activeModal === 'contactInfo'} onClose={handleClose} />

      <span onClick={() => setActiveModal('returnPolicy')}>{t('return')}</span>
      <span onClick={() => setActiveModal('termsOfDelivery')}>{t('terms of delivery')}</span>
      <span onClick={() => setActiveModal('informationSecurity')}>{t('information security')}</span>
      <span onClick={() => setActiveModal('termsOfUse')}>{t('terms of use')}</span>
      <span onClick={() => setActiveModal('contactInfo')}>{t('contact info')}</span>
    </div>
  );
};

export default FooterModals;
export { TermsOfDeliveryModal, ShippingFeeModal };
