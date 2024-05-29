import { Col, Row, Button } from 'antd';
import { useEffect, useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { getI18n, useTranslation } from 'react-i18next';
import { buttonStyle, secondaryButtonStyle } from '../../assets/styles/globalStyle';
import { ICategory, IProduct, IResponseData } from '../../types';
import useProducts from '../../services/products';
import { exportToCSV } from '../../utils/export-csv';
import SortAndFilter from '../../components/dashboard/products/SortAndFilter';
import useTitle from '../../hooks/useTitle';
import ProductsTable from '../../components/dashboard/products/ProductsTable';
import UpdateProductModal from '../../components/dashboard/products/UpdateProductModal';
import AddProductModal from '../../components/dashboard/products/AddProductModal';
import { useMutation, useQuery } from 'react-query';
import useAxiosIns from '../../hooks/useAxiosIns';
import useDebounce from '../../hooks/useDebounce';
import '../../assets/styles/pages/ProductsDashboardPage.css';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export default function ProductsDashboardPage() {
  const {
    fetchProductsQuery,
    products,
    total,
    addProductMutation,
    deleteProductMutation,
    updateProductMutation,
    current,
    setCurrent,
    buildQuery,
    onFilterSearch,
    searchProductsQuery,
    onResetFilterSearch,
    itemPerPage,
    setItemPerPage,
  } = useProducts({ enabledFetchProducts: true });
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const [shouldAddModalOpen, setAddModelOpen] = useState(false);
  const [shouldUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const axios = useAxiosIns();
  const [searchCategory, setSearchCategory] = useState<string>('');
  const debouncedSearchCategory = useDebounce(searchCategory);
  const [query, setQuery] = useState<string>('');
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'Admin';
  const fetchAllCategoriesQuery = useQuery(['categories-all', query], {
    queryFn: () => {
      return axios.get<IResponseData<ICategory[]>>(`/categories?filter=${query}`);
    },
    refetchOnWindowFocus: false,
    enabled: false,
    select: res => res.data,
  });
  const categories = fetchAllCategoriesQuery.data?.data || [];
  const { t } = useTranslation();
  useTitle(`${t('products')} - 7FF`);

  const onAddCategory = (values: Partial<IProduct>) => {
    addProductMutation.mutateAsync(values).finally(() => setAddModelOpen(false));
  };

  const onUpdateProduct = (values: Partial<IProduct>) => {
    updateProductMutation.mutateAsync({ productId: selectedProduct?._id as string, data: values }).finally(() => setUpdateModalOpen(false));
  };

  const onDeleteProduct = (productId: string) => {
    deleteProductMutation.mutate(productId);
  };

  const fetchAllProductsMutation = useMutation({
    mutationFn: () => axios.get<IResponseData<IProduct[]>>(`/products`),
  });

  const onExportToCSV = async () => {
    const { data } = await fetchAllProductsMutation.mutateAsync();
    const products = data?.data.map(rawProduct => ({
      [t('id').toString()]: rawProduct._id,
      [t('created at')]: dayjs(rawProduct.createdAt).format('DD/MM/YYYY'),
      [t('unit price')]: rawProduct.currentPrice,
      [t('name') + ' VI']: rawProduct.nameVi,
      [t('name') + ' EN']: rawProduct.nameEn,
      [t('description') + ' VI']: rawProduct.descriptionVi,
      [t('description') + ' EN']: rawProduct.descriptionEn,
      [t('featured images')]: `${
        rawProduct.featuredImages && rawProduct.featuredImages?.length > 0 ? rawProduct.featuredImages?.join('\n') : t('no images')
      }`,
      [t('category')]: locale === 'vi' ? (rawProduct.category as any).nameVi : (rawProduct.category as any).nameEn,
      [t('is available')]: rawProduct.isAvailable ? t('yes') : t('no'),
    }));
    exportToCSV(products, `7FF_Products_${Date.now()}`);
  };

  useEffect(() => {
    if (!debouncedSearchCategory || !(debouncedSearchCategory as string).trim()) {
      setQuery('');
    } else {
      const query: any = {};
      query[`name.${locale}`] = { $regex: `^${debouncedSearchCategory}` };
      setQuery(JSON.stringify(query));
    }
  }, [debouncedSearchCategory]);

  useEffect(() => {
    fetchAllCategoriesQuery.refetch();
  }, [query]);

  useEffect(() => {
    fetchAllCategoriesQuery.refetch();
  }, [shouldUpdateModalOpen, shouldAddModalOpen]);

  return (
    <Row>
      <UpdateProductModal
        isLoading={updateProductMutation.isLoading}
        onSubmit={onUpdateProduct}
        product={selectedProduct}
        shouldOpen={shouldUpdateModalOpen}
        categories={categories}
        isLoadingCategory={fetchAllCategoriesQuery.isLoading}
        onSearchCategory={value => setSearchCategory(value)}
        onCategoryChange={() => setQuery('')}
        onCancel={() => setUpdateModalOpen(false)}
      />
      <AddProductModal
        onSubmit={onAddCategory}
        isLoading={addProductMutation.isLoading}
        shouldOpen={shouldAddModalOpen}
        categories={categories}
        isLoadingCategory={fetchAllCategoriesQuery.isLoading}
        onSearchCategory={value => setSearchCategory(value)}
        onCategoryChange={() => setQuery('')}
        onCancel={() => setAddModelOpen(false)}
      />

      <Col span={24}>
        <Row align="middle">
          <Col span={12} style={{ marginBottom: 16 }}>
            <h2>{t('products')}</h2>
          </Col>
          <Col span={12}>
            <Row align="middle" justify="end" gutter={8}>
              <Col span={5}>
                <SortAndFilter categories={categories} onChange={buildQuery} onSearch={onFilterSearch} onReset={onResetFilterSearch} />
              </Col>
              <Col span={5}>
                <Button disabled={!isAdmin} block shape="round" style={{ ...secondaryButtonStyle }} onClick={() => setAddModelOpen(true)}>
                  <strong>+ {t('add')}</strong>
                </Button>
              </Col>
              <Col span={5}>
                <Button
                  block
                  icon={<DownloadOutlined style={{ marginRight: '4px' }} />}
                  type="text"
                  shape="round"
                  style={{ ...buttonStyle, border: '1px solid' }}
                  loading={fetchAllProductsMutation.isLoading}
                  onClick={() => onExportToCSV()}
                >
                  <strong>{t('export csv')}</strong>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <ProductsTable
          total={total as number}
          isAdmin={isAdmin}
          onDelete={onDeleteProduct}
          onSelectProduct={product => {
            setSelectedProduct(product);
            setUpdateModalOpen(true);
          }}
          isLoading={
            searchProductsQuery.isFetching ||
            fetchProductsQuery.isFetching ||
            deleteProductMutation.isLoading ||
            addProductMutation.isLoading ||
            updateProductMutation.isLoading
          }
          products={products}
          current={current}
          setCurrent={setCurrent}
          itemPerPage={itemPerPage}
          setItemPerPage={newItemPerPage => setItemPerPage(newItemPerPage)}
        />
      </Col>
    </Row>
  );
}
