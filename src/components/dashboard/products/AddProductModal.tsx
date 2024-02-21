import { Modal, Row, Col, Button, Form, Input, FormInstance, Select, Empty, Spin, SelectProps, Image, Upload, Space, Carousel } from 'antd';
import { getI18n, useTranslation } from 'react-i18next';
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle';
import { ICategory, IProduct } from '../../../types';
import { useMemo, useRef, useState } from 'react';
import { DeleteFilled, LeftOutlined, MoneyCollectOutlined, RightOutlined } from '@ant-design/icons';
import useFiles from '../../../services/files';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { CarouselRef } from 'antd/es/carousel';
interface AddProductModalProps {
  shouldOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<IProduct>) => void;
  isLoading: boolean;
  onSearchCategory: (value: string) => void;
  onCategoryChange: (value: string) => void;
  categories: ICategory[] | undefined;
  isLoadingCategory: boolean;
}
export default function AddProductModal({
  onSearchCategory,
  onCategoryChange,
  categories,
  isLoadingCategory,
  shouldOpen,
  onCancel,
  onSubmit,
  isLoading,
}: AddProductModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const onInternalCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={shouldOpen}
      afterClose={() => form.resetFields()}
      destroyOnClose
      closable={false}
      title={<h3>{t('new product')}</h3>}
      width={1000}
      onCancel={onInternalCancel}
      footer={
        <Row align="middle" justify="end" gutter={12}>
          <Col span={6}>
            <Button loading={isLoading} block type="text" shape="round" style={buttonStyle} onClick={() => onInternalCancel()}>
              <strong>{t('cancel')}</strong>
            </Button>
          </Col>
          <Col span={6}>
            <Button loading={isLoading} onClick={() => form.submit()} block shape="round" style={secondaryButtonStyle}>
              <strong>{t('confirm')}</strong>
            </Button>
          </Col>
        </Row>
      }
    >
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <AddProductForm
            form={form}
            onSubmit={onSubmit}
            categories={categories}
            isLoadingCategory={isLoadingCategory}
            onCategoryChange={onCategoryChange}
            onSearchCategory={onSearchCategory}
          />
        </Col>
      </Row>
    </Modal>
  );
}

export const AddProductForm = ({
  form,
  onSubmit,
  categories,
  isLoadingCategory,
  onSearchCategory,
  onCategoryChange,
}: {
  isLoadingCategory: boolean;
  categories: ICategory[] | undefined;
  form: FormInstance;
  onSubmit: (values: Partial<IProduct>) => void;
  onSearchCategory: (value: string) => void;
  onCategoryChange: (value: string) => void;
}) => {
  const { uploadMutation, deleteMutation } = useFiles();
  const { t } = useTranslation();
  const locale = getI18n().resolvedLanguage as 'vi' | 'en';
  const [featuredImages, setFeaturedImages] = useState<string[]>([]);
  const carouselRef = useRef<CarouselRef>(null);

  const onFinish = (values: any) => {
    onSubmit({
      category: values.category.value,
      categoryId: values.category.value,
      isAvailable: values.isAvailable,
      featuredImages,
      price: values.price,
      currentPrice: values.price,
      name: {
        vi: values['name.vi'],
        en: values['name.en'],
      },
      description: {
        vi: values['description.vi'],
        en: values['description.en'],
      },
      nameVi: values['name.vi'],
      nameEn: values['name.en'],
      descriptionVi: values['description.vi'],
      descriptionEn: values['description.en'],
    });
  };

  const onDeleteFeaturedImage = async (image: string) => {
    await deleteMutation.mutateAsync(image);
    setFeaturedImages(prev => prev?.filter(item => item !== image));
  };

  const handleUpload = ({ file }: UploadRequestOption<any>) => {
    uploadMutation.mutateAsync({ file, folder: 'products' }).then(res => {
      const url = res.data.data?.url;
      setFeaturedImages(prev => [url, ...prev]);
    });
  };

  const categoryOptions: SelectProps['options'] = useMemo(() => {
    if (isLoadingCategory) return [{ key: 'loading', label: <Spin />, disabled: true }];
    else if (!categories?.length) return [{ key: 'empty', label: <Empty />, disabled: true }];
    return categories.map(category => ({ key: category._id, label: category.name[locale], value: category._id }));
  }, [categories, isLoadingCategory]);

  return (
    <Row align="middle" gutter={24} className="add-product-modal">
      <Col span={12}>
        <Row align="middle" justify="space-between" style={{ padding: '8px 0' }}>
          <Col>
            <div style={{ textAlign: 'left' }}>
              <label>{t('featured images')}</label>
            </div>
          </Col>
          <Col>
            <Upload customRequest={handleUpload} accept="image/*" showUploadList={false} multiple>
              <Button loading={uploadMutation.isLoading} type="primary" shape="round" ghost size="large">
                <small>
                  <strong>+ {t('add')}</strong>
                </small>
              </Button>
            </Upload>
          </Col>
        </Row>
        {featuredImages?.length > 0 && (
          <Carousel ref={carouselRef} style={{ paddingBlock: 20 }}>
            {featuredImages?.map((image, idx) => (
              <div key={image + idx}>
                <div style={{ position: 'relative' }}>
                  <Image preview={false} src={image} />
                  <Button
                    loading={deleteMutation.isLoading}
                    style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '10' }}
                    danger
                    shape="circle"
                    type="primary"
                    icon={<DeleteFilled />}
                    onClick={() => onDeleteFeaturedImage(image)}
                  ></Button>
                </div>
              </div>
            ))}
          </Carousel>
        )}

        {featuredImages?.length > 1 && (
          <Space size={12} style={{ marginTop: 40 }}>
            <Button type="primary" shape="circle" size="large" icon={<LeftOutlined />} onClick={() => carouselRef.current?.prev()} />
            <Button type="primary" shape="circle" size="large" icon={<RightOutlined />} onClick={() => carouselRef.current?.next()} />
          </Space>
        )}
        {!featuredImages?.length && <Empty imageStyle={{ height: 200 }} />}
      </Col>

      <Col span={12}>
        <Form requiredMark={false} layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label={t('name vi')}
            name="name.vi"
            rules={[
              { required: true, message: t('required').toString() },
              { whitespace: true, message: t('required').toString() },
            ]}
          >
            <Input size="large" spellCheck={false} placeholder={t('name vi').toString()} style={inputStyle} />
          </Form.Item>
          <Form.Item
            label={t('name en')}
            name="name.en"
            rules={[
              { required: true, message: t('required').toString() },
              { whitespace: true, message: t('required').toString() },
            ]}
          >
            <Input size="large" spellCheck={false} placeholder={t('name en').toString()} style={inputStyle} />
          </Form.Item>
          <Form.Item
            label={t('description vi')}
            name="description.vi"
            rules={[
              { required: true, message: t('required').toString() },
              { whitespace: true, message: t('required').toString() },
            ]}
          >
            <Input.TextArea
              size="large"
              spellCheck={false}
              placeholder={t('description vi').toString()}
              autoSize={{ minRows: 2, maxRows: 3 }}
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            label={t('description en')}
            name="description.en"
            rules={[
              { required: true, message: t('required').toString() },
              { whitespace: true, message: t('required').toString() },
            ]}
          >
            <Input.TextArea
              size="large"
              spellCheck={false}
              placeholder={t('description en').toString()}
              autoSize={{ minRows: 2, maxRows: 3 }}
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item name="price" rules={[{ required: true, message: t('required').toString() }]}>
            <Input
              prefix={<MoneyCollectOutlined />}
              size="large"
              type="number"
              spellCheck={false}
              placeholder={t('price').toString()}
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item name="category" label={t('category')} rules={[{ required: true, message: t('required').toString() }]}>
            <Select
              placeholder={t('select category')}
              labelInValue
              filterOption={false}
              size="large"
              onChange={onCategoryChange}
              options={categoryOptions}
            ></Select>
          </Form.Item>
          <Form.Item name="isAvailable" label={t('is available')} initialValue={true}>
            <Select size="large">
              <Select.Option value={true}>{t('yes')}</Select.Option>
              <Select.Option value={false}>{t('no')}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
