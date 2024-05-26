import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation, getI18n } from 'react-i18next';
import { Avatar } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { IProduct, IResponseData } from '../../types';
import { priceFormat } from '../../utils/price-format';
import useDebounce from '../../hooks/useDebounce';
import useAxiosIns from '../../hooks/useAxiosIns';
import '../../assets/styles/components/AppBar.css';

const SearchBox = () => {
  const { t } = useTranslation();
  const i18n = getI18n();
  const locale = i18n.resolvedLanguage as 'en' | 'vi';
  const axios = useAxiosIns();
  const navigate = useNavigate();

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
  );
};

export default SearchBox;
