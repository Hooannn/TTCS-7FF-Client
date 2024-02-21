import { Modal, Row, Col, Button, Form, Input, FormInstance } from 'antd';
import { useTranslation } from 'react-i18next';
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle';
import { ICategory } from '../../../types';
interface AddCategoryModalProps {
  shouldOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: ICategory) => void;
  isLoading: boolean;
}
export default function AddCategoryModal({ shouldOpen, onCancel, onSubmit, isLoading }: AddCategoryModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onInternalCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={shouldOpen}
      destroyOnClose
      afterClose={() => form.resetFields()}
      closable={false}
      title={<h3>{t('new category')}</h3>}
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
          <AddCategoryForm form={form} onSubmit={onSubmit} />
        </Col>
      </Row>
    </Modal>
  );
}

export const AddCategoryForm = ({ form, onSubmit }: { form: FormInstance; onSubmit: (values: ICategory) => void }) => {
  const { t } = useTranslation();

  const onFinish = (values: any) => {
    onSubmit({
      nameVi: values['name.vi'],
      nameEn: values['name.en'],
    });
  };

  return (
    <>
      <Form requiredMark={false} layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="name.vi"
          label={t('name vi')}
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
      </Form>
    </>
  );
};
