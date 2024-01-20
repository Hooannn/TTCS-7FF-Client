import { FC, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getI18n, useTranslation } from 'react-i18next';
import { Avatar, Button, Divider, Form, Input, Radio, Space, Tooltip, Image, Badge, ConfigProvider, Modal, Col, Row } from 'antd';
import { CarryOutOutlined, HomeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import type { FormInstance } from 'antd/es/form';
import toastConfig from '../../configs/toast';
import useTitle from '../../hooks/useTitle';
import useCart from '../../hooks/useCart';
import useCheckout from '../../services/checkout';
import useVouchers from '../../services/vouchers';
import { buttonStyle, containerStyle, inputStyle } from '../../assets/styles/globalStyle';
import { RootState } from '../../store';
import { IDetailedItem, IVoucher } from '../../types';
import '../../assets/styles/pages/CheckoutPage.css';
import FooterModals from './InfoModals';
import { setOrderNote } from '../../slices/app.slice';
import dayjs from 'dayjs';

interface IDeliveryOption {
  disabled: boolean;
  message: string;
}

const CheckoutPage: FC = () => {
  const { t } = useTranslation();
  const i18n = getI18n();
  const [voucher, setVoucher] = useState<IVoucher | null>(null);
  const [voucherInput, setVoucherInput] = useState<string>('');
  const navigate = useNavigate();
  const locale = i18n.resolvedLanguage as 'vi' | 'en';
  const { verifyVoucherMutation } = useVouchers({ enabledFetchVouchers: false });
  const { checkoutMutation } = useCheckout();
  useTitle(`${t('checkout')} - 7FF`);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const orderNote = useSelector((state: RootState) => state.app.orderNote);
  const cartItems = useSelector((state: RootState) => state.app.cartItems);

  useEffect(() => {
    formRef.current?.setFieldsValue({ name: `${user.lastName} ${user.firstName}` });
  }, []);

  const [isDelivery, setIsDelivery] = useState(false);
  const formRef = useRef<FormInstance>(null);
  const { detailedItems, totalPrice, shippingFee: DEFAULT_SHIPPING_FEE } = useCart();
  const shippingFee = isDelivery ? DEFAULT_SHIPPING_FEE : 0;

  const discount = useMemo(() => {
    if (!voucher?._id) return 0;
    else if (voucher?.discountType === 'percent') {
      return totalPrice * (voucher?.discountAmount / 100);
    } else return voucher?.discountAmount > totalPrice ? totalPrice : voucher?.discountAmount;
  }, [voucher]);

  const onApplyVoucher = async ({ voucher }: { voucher: string }) => {
    if (!voucher) return;
    const { data } = await verifyVoucherMutation.mutateAsync(voucher.toUpperCase());
    setVoucher(data.data);
  };

  const onFinish = async (values: any) => {
    if (takeFromStoreOption.disabled && deliveryOption.disabled) return;
    const items = cartItems.map((cartItem: any) => ({ product: cartItem.product._id, quantity: cartItem.quantity }));
    Modal.confirm({
      icon: null,
      title: t(`your order total is {{total}}, please confirm before ordering`, {
        total: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice + shippingFee - discount),
      }),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        const { data } = await checkoutMutation.mutateAsync({
          voucher: voucher?._id,
          customerId: user._id,
          items,
          note: orderNote,
          isDelivery,
          ...values,
        });
        dispatch(setOrderNote(''));
        navigate(`/sales/thanks/${data.data._id}`);
      },
      okButtonProps: {
        type: 'primary',
        shape: 'round',
        style: { ...buttonStyle, width: '100px', marginLeft: '12px' },
      },
      cancelButtonProps: {
        type: 'text',
        shape: 'round',
        style: { ...buttonStyle, width: '100px' },
      },
    });
  };

  const DEFAULT_OPTION = {
    disabled: false,
    message: '...',
  };
  const [takeFromStoreOption, setTakeFromStoreOption] = useState<IDeliveryOption>(DEFAULT_OPTION);
  const [deliveryOption, setDeliveryOption] = useState<IDeliveryOption>(DEFAULT_OPTION);
  const updateOption = useCallback(() => {
    const currentTime = dayjs(new Date()).format('HH:mm');
    if (currentTime < '07:00') {
      setTakeFromStoreOption({
        disabled: true,
        message: 'our store starts receiving online orders from 7:00',
      });
      setDeliveryOption({
        disabled: true,
        message: 'our store starts receiving online orders from 7:00',
      });
    } else if (currentTime <= '21:00') {
      setTakeFromStoreOption({
        disabled: false,
        message: 'please get your order within 1 hour, or we might cancel it',
      });
      setDeliveryOption({
        disabled: false,
        message: 'you will have to pay extra ₫20.000 if the total price is less than ₫300.000',
      });
    } else if (currentTime <= '21:30') {
      setTakeFromStoreOption({
        disabled: false,
        message: 'our store wil be closed at 22:00, please get your order before that',
      });
      setDeliveryOption({
        disabled: true,
        message: 'delivery service is not available after 21:00',
      });
    } else {
      setTakeFromStoreOption({
        disabled: true,
        message: 'sorry, we only receive online order from 7:00 to 21:30',
      });
      setDeliveryOption({
        disabled: true,
        message: 'delivery service is not available after 21:00',
      });
    }
  }, []);

  useEffect(() => {
    updateOption();
    const timerId = setInterval(updateOption, 60000);

    return () => clearInterval(timerId);
  }, []);

  let content = null;
  if (cartItems.length <= 0) {
    toast(t('your cart is currently empty, you cannot access checkout page'), toastConfig('error'));
    content = <Navigate to="/cart" />;
  } else if (detailedItems.every((item: IDetailedItem) => item.product.isAvailable === false)) {
    toast(t('items in your cart are all currently unavailable, you cannot access checkout page'), toastConfig('info'));
    content = <Navigate to="/cart" />;
  } else {
    content = (
      <ConfigProvider
        theme={{ token: { colorPrimary: '#1a1a1a' } }}
        children={
          <div className="checkout-page">
            <div className="abs-btns">
              <Tooltip title={t('change language')}>
                {i18n.resolvedLanguage === 'en' && (
                  <Avatar onClick={() => i18n.changeLanguage('vi')} src="/en.jpg" style={{ cursor: 'pointer' }}></Avatar>
                )}
                {i18n.resolvedLanguage === 'vi' && (
                  <Avatar onClick={() => i18n.changeLanguage('en')} src="/vn.jpg" style={{ cursor: 'pointer' }}></Avatar>
                )}
              </Tooltip>
            </div>

            <div className="container" style={containerStyle}>
              <div className="shipping-form-wrapper">
                <div className="shipping-form__logo">
                  <img src="/logo.png" alt="logo" onClick={() => navigate('/')} />
                </div>
                <div className="shipping-form">
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    ref={formRef}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Form.Item
                      name="name"
                      rules={[
                        { required: true, message: t('required').toString() },
                        { whitespace: true, message: t('required').toString() },
                      ]}
                    >
                      <Input size="large" spellCheck={false} placeholder={t('your name...').toString()} style={inputStyle} />
                    </Form.Item>

                    <Radio.Group
                      onChange={e => setIsDelivery(e.target.value)}
                      value={isDelivery}
                      style={{ marginBottom: 24 }}
                      name="radiogroup"
                      size="large"
                    >
                      <Space direction="vertical">
                        <Radio value={false} disabled={takeFromStoreOption.disabled}>
                          {t('pick up at shop')} <i style={{ marginLeft: 6 }}>({t(takeFromStoreOption.message, { nsSeparator: false })})</i>
                        </Radio>
                        <Radio value={true} disabled={deliveryOption.disabled}>
                          {t('delivery')} <i style={{ marginLeft: 6 }}>({t(deliveryOption.message, { nsSeparator: false })})</i>
                        </Radio>
                      </Space>
                    </Radio.Group>

                    {isDelivery && (
                      <>
                        <Form.Item
                          name="deliveryPhone"
                          rules={[
                            { required: true, message: t('required').toString() },
                            {
                              pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                              message: t('invalid phone number').toString(),
                            },
                          ]}
                        >
                          <Input size="large" placeholder={t('phone number...').toString()} style={inputStyle} />
                        </Form.Item>
                        <Form.Item
                          name="deliveryAddress"
                          rules={[
                            { required: true, message: t('required').toString() },
                            { whitespace: true, message: t('required').toString() },
                          ]}
                        >
                          <Input size="large" spellCheck={false} placeholder={t('address...').toString()} style={inputStyle} />
                        </Form.Item>
                      </>
                    )}
                    <Row align="middle" justify="space-between" style={{ marginTop: 'auto' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 500, cursor: 'pointer' }}>
                        <div onClick={() => navigate('/')}>
                          <HomeOutlined /> {`${t('back to home')}`}
                        </div>
                        <div onClick={() => navigate('/cart')} style={{ marginTop: 4 }}>
                          <CarryOutOutlined /> {`${t('add note or change quantity')}`}
                        </div>
                      </div>
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                          loading={checkoutMutation.isLoading}
                          disabled={takeFromStoreOption.disabled && deliveryOption.disabled}
                          size="large"
                          type="primary"
                          htmlType="submit"
                          className="submit-btn"
                        >
                          {takeFromStoreOption.disabled && deliveryOption.disabled
                            ? t('available from 7:00 to 21:30', { nsSeparator: false })
                            : t('checkout')}
                        </Button>
                      </Form.Item>
                    </Row>
                  </Form>
                </div>
                <Divider style={{ marginTop: 56, borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                <FooterModals />
              </div>

              <div className="cart-items">
                {detailedItems
                  .filter((item: IDetailedItem) => item.product.isAvailable)
                  .map((item: IDetailedItem) => (
                    <div key={item.product._id} className="checkout-cart-item">
                      <Badge count={item.quantity} color="rgba(115, 115, 115, 0.9)">
                        <div className="item-image">
                          <div className="img-wrapper">
                            <Image src={item.product.featuredImages?.length ? item.product.featuredImages[0] : '../alt-feature-img.png'} />
                          </div>
                        </div>
                      </Badge>
                      <div className="item-name">
                        <h4 style={{ margin: '0 0 8px', fontWeight: 700 }}>{item.product.name[locale]}</h4>
                        <span>{`${(item.product.price * 1).toLocaleString('en-US')} /1`}</span>
                      </div>
                      <div className="item-price">{`₫${(item.product.price * item.quantity).toLocaleString('en-US')}`}</div>
                    </div>
                  ))}
                <Divider style={{ borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                <Form onFinish={onApplyVoucher} requiredMark={false} name="basic" autoComplete="off">
                  <Row gutter={12} align="middle">
                    <Col span={18}>
                      <Form.Item name="voucher">
                        <Input
                          readOnly={voucher?._id as any}
                          placeholder={t('gift or discount code...').toString()}
                          style={inputStyle}
                          value={voucherInput}
                          onChange={e => setVoucherInput(e.target.value)}
                          spellCheck="false"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item>
                        {!voucher?._id && (
                          <Button
                            loading={verifyVoucherMutation.isLoading}
                            block
                            type="primary"
                            className="submit-coupon-btn"
                            htmlType="submit"
                            disabled={!voucherInput}
                          >
                            {t('apply')}
                          </Button>
                        )}
                        {voucher?._id && (
                          <Button
                            onClick={e => {
                              e.preventDefault();
                              setVoucher(null);
                            }}
                            loading={verifyVoucherMutation.isLoading}
                            block
                            type="primary"
                            danger
                            className="submit-coupon-btn cancel-coupon"
                          >
                            {t('cancel')}
                          </Button>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <Divider style={{ borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                <div className="display-price">
                  <span>{t('subtotal')}</span>
                  <span style={{ fontWeight: 500 }}>{`₫${totalPrice.toLocaleString('en-US')}`}</span>
                </div>
                <div className="display-price">
                  <span>
                    {t('shipping fee')} <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
                  </span>
                  <span style={{ fontWeight: 500 }}>{`₫${shippingFee.toLocaleString('en-US')}`}</span>
                </div>
                {discount > 0 && (
                  <div className="display-price">
                    <span>{t('discount')}</span>
                    <span style={{ fontWeight: 500, color: 'green' }}>- {`₫${discount.toLocaleString('en-US')}`}</span>
                  </div>
                )}
                <Divider style={{ borderColor: 'rgba(26, 26, 26, 0.12)' }} />
                <div className="display-price">
                  <span style={{ fontSize: '1rem', fontWeight: 500 }}>{t('total')}:</span>
                  <span>
                    <span style={{ marginRight: 9, fontSize: '0.75rem' }}>VND</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 500 }}>{`₫${(totalPrice + shippingFee - discount).toLocaleString('en-US')}`}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  return content;
};

export default CheckoutPage;
