import { FC, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, getI18n } from 'react-i18next';
import { Layout, Button, Badge, Dropdown, Tooltip, Avatar, Modal } from 'antd';
import { CloseOutlined, DashboardOutlined, ExclamationCircleFilled, SearchOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import CartDrawer from './CartDrawer';
import useCart from '../../hooks/useCart';
import useDebounce from '../../hooks/useDebounce';
import { RootState } from '../../store';
import { signOut } from '../../slices/auth.slice';
import { buttonStyle, containerStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/components/AppBar.css';
import { useQuery } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import { IProduct, IResponseData } from '../../types';
import { priceFormat } from '../../utils/price-format';

interface IProps {
  isDashboard?: boolean;
}

interface IMonthlyData {
  month: string;
  year: string;
  totalSales: number;
  totalUnits: number;
}

const TABS = [
  { label: 'home', to: '/' },
  { label: 'menu', to: '/menu' },
  { label: 'about us', to: '/about' },
];

const AppBar: FC<IProps> = ({ isDashboard }) => {
  const { t } = useTranslation();
  const i18n = getI18n();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const { detailedItems } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const axios = useAxiosIns();
  const locale = i18n.resolvedLanguage as 'en' | 'vi';

  const items: MenuProps['items'] = [
    {
      label: t('profile'),
      key: 'profile',
      onClick: () => navigate('/profile/edit'),
    },
    {
      label: t('my orders'),
      key: 'orders',
      onClick: () => navigate('/profile/orders'),
    },
    {
      type: 'divider',
    },
    {
      label: t('sign out'),
      key: 'signOut',
      danger: true,
      onClick: () => onSignOutBtnClick(),
    },
  ];

  const onSignOutBtnClick = () => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      title: t('are you sure you want to sign out ?'),
      okText: t('sign out'),
      cancelText: t('cancel'),
      onOk: () => {
        dispatch(signOut());
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

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<IProduct[]>([]);
  const [inputFocusing, setInputFocusing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const handleTyping = (e: any) => {
    const searchInput = e.target.value;
    if (searchInput.startsWith(' ')) return;
    setSearchTerm(searchInput);
    setIsTyping(true);
    countdownTyping();
  };

  const searchProducts = useQuery(['appbar-search-products'], {
    queryFn: () => axios.get<IResponseData<IProduct[]>>(`/search/products?q=${(debouncedSearchTerm as string).trim()}`),
    enabled: false,
    onSuccess: res => {
      setSearchResult(res.data?.data);
    },
  });

  let timerId: undefined | ReturnType<typeof setTimeout> = undefined;
  const countdownTyping = () => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      setIsTyping(false);
    }, 500);
  };
  useEffect(() => {
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current?.contains(event.target as Node)) {
        setInputFocusing(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchBoxRef]);

  const debouncedSearchTerm = useDebounce(searchTerm);
  useEffect(() => {
    if (!debouncedSearchTerm || !(debouncedSearchTerm as string).trim()) {
      setSearchResult([]);
      return;
    }

    searchProducts.refetch();
  }, [debouncedSearchTerm]);

  return (
    <Layout.Header className="app-bar">
      <div style={containerStyle} className="container">
        <div className="logo-search">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/logo.png" className="logo-img" />
          </div>
          <div ref={searchBoxRef} className="search-box">
            <input
              type="text"
              placeholder={t('search...').toString()}
              className="search-input"
              spellCheck="false"
              value={searchTerm}
              onChange={handleTyping}
              onFocus={() => setInputFocusing(true)}
              ref={searchInputRef}
            />
            {searchTerm ? (
              <CloseOutlined
                className="search-icon"
                onClick={() => {
                  setSearchTerm('');
                  setSearchResult([]);
                  searchInputRef.current?.focus();
                }}
              />
            ) : (
              <SearchOutlined className="search-icon" />
            )}
            {inputFocusing && (
              <div className="search-result">
                {(!searchTerm || isTyping || searchProducts.isLoading) && (
                  <div className="search-result-no-result">
                    <p>{t('enter the name of the product')}</p>
                    <p>{t('you want to search for')}.</p>
                  </div>
                )}
                {searchResult.length === 0 && searchTerm && !isTyping && !searchProducts.isLoading && (
                  <div className="search-result-no-result">
                    <p>{t("we don't have any products")}</p>
                    <p>
                      {t(`named "{{searchTerm}}"`, {
                        searchTerm: searchTerm,
                      })}
                    </p>
                    <p>{t('or they are currently unavailable')}.</p>
                  </div>
                )}
                {searchResult.length > 0 &&
                  !isTyping &&
                  searchResult.map((product: IProduct, i: number) => (
                    <div key={product._id}>
                      <div
                        onClick={() => {
                          setSearchTerm('');
                          setSearchResult([]);
                          setInputFocusing(false);
                          navigate(`/product/${product._id}`);
                        }}
                        className="search-result-item"
                      >
                        <Avatar
                          src={product.featuredImages?.length ? product.featuredImages[0] : 'alt-feature-img.png'}
                          size={44}
                          style={{ flexShrink: 0 }}
                        />
                        <div className="search-result-item-desc">
                          <div className="search-result-item-name">{product.name[locale]}</div>
                          <div className="search-result-item-price">
                            <p style={{ margin: 0 }}>
                              {t('price')}: {priceFormat(product.price)} /1
                            </p>
                            <p style={{ margin: '2px 0 0' }}>{`${t('sold this month')}: ${product.totalSoldUnits ?? 0}`}</p>
                          </div>
                        </div>
                      </div>
                      {i !== searchResult.length - 1 && <div className="divider"></div>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <ul className="tabs">
          {TABS.map(({ label, to }) => (
            <li className={`tab-item ${location.pathname === to ? 'active' : ''}`} key={label} onClick={() => navigate(to)}>
              {t(label)}
            </li>
          ))}
        </ul>

        <div className="nav-btns">
          <Tooltip title={t('change language')}>
            {i18n.resolvedLanguage === 'en' && (
              <Avatar onClick={() => i18n.changeLanguage('vi')} src="/en.jpg" style={{ cursor: 'pointer' }}></Avatar>
            )}
            {i18n.resolvedLanguage === 'vi' && (
              <Avatar onClick={() => i18n.changeLanguage('en')} src="/vn.jpg" style={{ cursor: 'pointer' }}></Avatar>
            )}
          </Tooltip>

          {!user && (
            <Button size="large" type="primary" shape="round" className="nav-btn" onClick={() => navigate('/auth')}>
              {t('sign in')}
            </Button>
          )}

          {!isDashboard && ['Admin', 'Staff'].includes(user?.role) && (
            <Tooltip title={t('go to dashboard')}>
              <DashboardOutlined onClick={() => navigate('/dashboard')} className="nav-icon" style={{ color: 'white' }} />
            </Tooltip>
          )}

          {user && (
            <>
              <Tooltip title={t('cart')}>
                <Badge count={detailedItems.length}>
                  <ShoppingCartOutlined onClick={() => setIsCartOpen(true)} className="nav-icon" style={{ color: 'white' }} />
                </Badge>
              </Tooltip>
              <CartDrawer isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
              <Dropdown menu={{ items }} placement="bottom" arrow>
                <img src={user.avatar} className="user-avatar" onClick={() => navigate('/profile/edit')} />
              </Dropdown>
            </>
          )}
        </div>
      </div>
    </Layout.Header>
  );
};

export default AppBar;
