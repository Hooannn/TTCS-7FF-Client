import { Modal, Row, Col, Button, Form, FormInstance, Select, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle';
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
  const [shouldShowRejectionReason, setShouldShowRejectionReason] = useState(false)

  const onFinish = (values: any) => {
    onSubmit({ ...values });
  };

  const onSelectionChange = (event: string) => {
    form.resetFields(['rejectionReason'])
    if (event === 'Rejected') setShouldShowRejectionReason(true)
    else setShouldShowRejectionReason(false)
  }

  return (
    <>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item label={t('order status')} name="status">
          <Select size="large" style={{ width: '100%' }} onChange={onSelectionChange}>
            <Select.Option value="Pending">{t('pending')}</Select.Option>
            <Select.Option value="Processing">{t('processing')}</Select.Option>
            <Select.Option value="Rejected">{t('rejected')}</Select.Option>
            <Select.Option value="Done">{t('done')}</Select.Option>
          </Select>
        </Form.Item>
        {
          shouldShowRejectionReason && <Form.Item
            rules={[
              { required: shouldShowRejectionReason, message: t('required').toString() },
              { whitespace: shouldShowRejectionReason, message: t('required').toString() },
            ]}
            label={t('rejection reason')}
            name="rejectionReason">
            <Input.TextArea
              size="large"
              spellCheck={false}
              placeholder={t('enter rejection reason').toString()}
              autoSize={{ minRows: 3, maxRows: 4 }}
              style={inputStyle}
            />
          </Form.Item>
        }
      </Form>
    </>
  );
};
