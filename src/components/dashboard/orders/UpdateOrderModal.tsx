import { Modal, Row, Col, Button, Form, FormInstance, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { buttonStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle';
import { IOrder } from '../../../types';
interface UpdateOrderModalProps {
  shouldOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: IOrder) => void;
  isLoading?: boolean;
  order: IOrder | null;
}
export default function UpdateOrderModal({ order, shouldOpen, onCancel, onSubmit, isLoading }: UpdateOrderModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onInternalCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (order && shouldOpen) form.setFieldsValue(order);
  }, [shouldOpen]);

  return (
    <Modal
      open={shouldOpen}
      destroyOnClose
      closable={false}
      title={<h3>{t('update order')}</h3>}
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
          <UpdateOrderForm order={order} form={form} onSubmit={onSubmit} />
        </Col>
      </Row>
    </Modal>
  );
}

export const UpdateOrderForm = ({ form, onSubmit, order }: { form: FormInstance; onSubmit: (values: IOrder) => void; order: IOrder | null }) => {
  const { t } = useTranslation();

  const onFinish = (values: any) => {
    onSubmit({ ...values });
  };

  return (
    <>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item label={t('order status')} name="status">
          <Select size="large" style={{ width: '100%' }}>
            <Select.Option value="Processing">{t('processing')}</Select.Option>
            <Select.Option value="Delivering">{t('delivering')}</Select.Option>
            <Select.Option value="Done">{t('done')}</Select.Option>
            <Select.Option value="Cancelled">{t('cancelled')}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </>
  );
};
