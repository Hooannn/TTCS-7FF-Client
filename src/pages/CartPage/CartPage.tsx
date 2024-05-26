import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getI18n, useTranslation } from 'react-i18next';
import { Button, ConfigProvider, Input, Progress, Table, Image, Tooltip, Avatar } from 'antd';
import { LockOutlined, DeleteOutlined } from '@ant-design/icons';
import useTitle from '../../hooks/useTitle';
import useCart from '../../hooks/useCart';
import useCartItems from '../../services/cart';
import QuantityInput from '../../components/shared/QuantityInput';
import { IDetailedItem } from '../../types';
import { RootState } from '../../store';
import { setOrderNote } from '../../slices/app.slice';
import { containerStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/pages/CartPage.css';
import { priceFormat } from '../../utils/price-format';

const CartPage: FC = () => {
  const { t } = useTranslation();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const navigate = useNavigate();
  const { removeCartItemMutation, addCartItemMutation } = useCartItems({ enabledFetchCartItems: false });

  const orderNote = useSelector((state: RootState) => state.app.orderNote);
  const dispatch = useDispatch();
  useTitle(`${t('cart')} - 7FF`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartItems = useSelector((state: RootState) => state.app.cartItems);
  const { detailedItems, totalPrice } = useCart();

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: '#1a1a1a' } }}
      children={
        <div className="cart-page">
          <section className="container-wrapper">
            <div className="container" style={containerStyle}>
              {cartItems.length > 0 ? (
                <>
                  <div className="heading-and-progress">
                    <h2 className="heading">{t('my cart')}</h2>
                  </div>

                  <div className="cart-items-wrapper">
                    <div className="cart-items">
                      <Table
                        pagination={false}
                        rowKey={(record: IDetailedItem) => record.product._id as string}
                        columns={[
                          {
                            title: t('feature image'),
                            dataIndex: 'product',
                            width: 150,
                            render: (value: IDetailedItem['product']) => {
                              return (
                                <div className={`item-image ${value.isAvailable ? '' : 'unavailable'}`}>
                                  <Image src={value.featuredImages?.length ? value.featuredImages[0] : ''} />
                                </div>
                              );
                            },
                          },
                          {
                            title: t("product's name"),
                            dataIndex: 'product',
                            render: (value: IDetailedItem['product']) => {
                              return (
                                <>
                                  <strong>{value.name[locale]}</strong>
                                  {!value.isAvailable && <p style={{ marginBlock: 2, fontSize: 13 }}>{t('this product is currently unavailable')}</p>}
                                </>
                              );
                            },
                          },
                          {
                            title: t('unit price'),
                            dataIndex: 'product',
                            align: 'center',
                            width: 120,
                            render: (value: IDetailedItem['product']) => {
                              return <span>{priceFormat(value.price)} /1</span>;
                            },
                          },
                          {
                            title: t('quantity'),
                            dataIndex: 'quantity',
                            align: 'center',
                            width: 150,
                            render: (value: number, record: IDetailedItem) => {
                              return (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                  <QuantityInput
                                    loading={removeCartItemMutation.isLoading || addCartItemMutation.isLoading}
                                    quantity={value}
                                    initValue={value}
                                    onChange={newValue => {
                                      const quantity = newValue - value;
                                      if (quantity === 0) return;
                                      else if (quantity < 0)
                                        return removeCartItemMutation.mutate({
                                          productId: record.product.productId as string,
                                          quantity: Math.abs(quantity),
                                        });
                                      return addCartItemMutation.mutate({
                                        productId: record.product.productId as string,
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
                                      onClick={() =>
                                        removeCartItemMutation.mutate({ productId: record.product.productId as string, quantity: 100000 })
                                      }
                                    />
                                  </Tooltip>
                                </div>
                              );
                            },
                          },
                          {
                            title: t('total'),
                            align: 'center',
                            width: 120,
                            render: (value: any, record: IDetailedItem) => {
                              return <span>{priceFormat(record.product.price * record.quantity)}</span>;
                            },
                          },
                        ]}
                        dataSource={detailedItems}
                      />
                    </div>

                    <div className="order-summary">
                      <div className="subtotal">
                        <span>{t('subtotal')}:</span>
                        <span>{priceFormat(totalPrice)}</span>
                      </div>
                      <div className="total">
                        <span>{t('total')}:</span>
                        <span>{priceFormat(totalPrice)}</span>
                      </div>
                      <p style={{ margin: '8px 0 0', color: 'rgba(26, 26, 26, 0.7)' }}>{t('VAT included, shipping fee not covered')}.</p>
                      <Input.TextArea
                        value={orderNote}
                        onChange={e => dispatch(setOrderNote(e.target.value))}
                        placeholder={t('order notes...').toString()}
                        autoSize={{ minRows: 4 }}
                        className="order-notes"
                        spellCheck="false"
                      />
                      <Button
                        type="primary"
                        shape="round"
                        block
                        disabled={detailedItems.every((item: IDetailedItem) => item.product.isAvailable === false)}
                        className="checkout-btn"
                        onClick={() => navigate('/sales/checkout')}
                      >
                        <LockOutlined />
                        {t('checkout')}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar src="/empty-cart.png" size={340} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 400 }}>{t('your cart is empty')}</h4>
                  <Button
                    type="primary"
                    size="large"
                    shape="round"
                    className="continue-btn"
                    onClick={() => {
                      navigate('/menu');
                    }}
                  >
                    {t('see our menu')}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      }
    />
  );
};

export default CartPage;
