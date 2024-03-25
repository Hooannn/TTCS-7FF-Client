import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getI18n, useTranslation } from 'react-i18next';
import { Avatar, Button, Divider, Drawer, Progress, Image, Space, Tooltip, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled, LockOutlined } from '@ant-design/icons';
import useCart from '../../hooks/useCart';
import { IDetailedItem } from '../../types';
import { RootState } from '../../store';
import { buttonStyle } from '../../assets/styles/globalStyle';
import useCartItems from '../../services/cart';
import QuantityInput from '../../components/shared/QuantityInput';
import { priceFormat } from '../../utils/price-format';
interface IProps {
  isCartOpen: boolean;
  setIsCartOpen: (value: boolean) => void;
}

const CartDrawer: FC<IProps> = ({ isCartOpen, setIsCartOpen }) => {
  const { t } = useTranslation();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const { removeCartItemMutation, addCartItemMutation, resetCartItemsMutation } = useCartItems({ enabledFetchCartItems: true });
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.app.cartItems);

  const { detailedItems, totalPrice, MINIMUM_VALUE_FOR_FREE_SHIPPING } = useCart();
  const handleResetCartBtnClick = () => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      title: t('are you sure that you want to remove all items from cart ?'),
      okText: t('delete'),
      cancelText: t('cancel'),
      onOk: () => {
        resetCartItemsMutation.mutate();
      },
      okButtonProps: {
        danger: true,
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

  return (
    <Drawer
      open={isCartOpen}
      onClose={() => {
        setIsCartOpen(false);
      }}
      title={t('cart')}
      contentWrapperStyle={{ width: 600 }}
      extra={
        cartItems.length !== 0 && (
          <Button loading={resetCartItemsMutation.isLoading} onClick={handleResetCartBtnClick}>
            {t('reset cart')}
          </Button>
        )
      }
    >
      <div className={`cart-content ${cartItems.length === 0 ? 'no-items' : ''}`}>
        {cartItems.length === 0 ? (
          <div style={{ marginTop: 45, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src="/empty-cart.png" size={340} />
            <h4 className="heading">{t('your cart is empty')}</h4>
            <Button
              type="primary"
              size="large"
              shape="round"
              className="continue-btn"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/menu');
              }}
            >
              {t('see our menu')}
            </Button>
          </div>
        ) : (
          <>
            <div className="cart-progress">
              {totalPrice < MINIMUM_VALUE_FOR_FREE_SHIPPING ? (
                <>
                  <span>{t('buy')} </span>
                  <strong>{priceFormat(MINIMUM_VALUE_FOR_FREE_SHIPPING - totalPrice)}</strong>
                  <span> {t('more to get free shipping')}</span>
                </>
              ) : (
                <span>{t('your order is free shipping now')}</span>
              )}
              <Progress
                percent={(totalPrice / MINIMUM_VALUE_FOR_FREE_SHIPPING) * 100}
                size="small"
                showInfo={false}
                strokeColor="#1a1a1a"
                trailColor="rgba(26, 26, 26, 0.3)"
                style={{ marginBottom: 0 }}
              />
            </div>

            <Divider style={{ margin: '12px 0', borderColor: 'rgba(26, 26, 26, 0.12)' }} />

            <div className="cart-items">
              {detailedItems.map((item: IDetailedItem) => (
                <div key={item.product?._id} className={`cart-item ${item.quantity === 0 ? 'unavailable' : ''}`}>
                  <div className="item-image">
                    {item.product?.featuredImages?.length ? (
                      <Image src={item.product?.featuredImages[0]} />
                    ) : (
                      <Image src="alt-feature-img.png" preview={false} />
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <h4 className="item-name">{item.product?.name[locale]}</h4>
                    <p className="item-price">
                      {item.quantity
                        ? priceFormat(item.product?.price * item.quantity)
                        : t('this product is currently unavailable')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <QuantityInput
                      loading={removeCartItemMutation.isLoading || addCartItemMutation.isLoading}
                      initValue={item.quantity}
                      quantity={item.quantity}
                      onChange={newValue => {
                        const quantity = newValue - item.quantity;
                        if (quantity === 0) return;
                        else if (quantity < 0)
                          return removeCartItemMutation.mutate({
                            productId: item.product?.productId as string,
                            quantity: Math.abs(quantity),
                          });
                        return addCartItemMutation.mutate({
                          productId: item.product?.productId as string,
                          quantity: Math.abs(quantity),
                        });
                      }}
                    />
                    <Tooltip title={t('delete item')} placement="bottom">
                      <Button
                        type="primary"
                        danger
                        shape="circle"
                        loading={removeCartItemMutation.isLoading}
                        icon={<DeleteOutlined />}
                        onClick={() => removeCartItemMutation.mutate({ productId: item.product?.productId as string, quantity: 100000 })}
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

            <Divider style={{ borderColor: 'rgba(26, 26, 26, 0.12)' }} />

            <div className="cart-footer">
              <h5 className="total-price">
                <span>{t('subtotal')}:</span>
                <span>{priceFormat(totalPrice)}</span>
              </h5>
              <p>{t('VAT included, shipping fee not covered')}.</p>
              <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
                <Button
                  type="primary"
                  shape="round"
                  className="see-cart-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                >
                  {t('view my cart')}
                </Button>
                <Button shape="round" className="checkout-btn" onClick={() => navigate('/sales/checkout')}>
                  <LockOutlined />
                  {t('checkout')}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
