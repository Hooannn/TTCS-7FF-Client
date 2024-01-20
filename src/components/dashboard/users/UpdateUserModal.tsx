import { LoadingOutlined, LockOutlined, MailOutlined, PlusOutlined, CompassOutlined, PhoneOutlined } from '@ant-design/icons';
import { Modal, Row, Col, Button, Form, Input, Upload, FormInstance, Avatar, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buttonStyle, inputStyle, secondaryButtonStyle } from '../../../assets/styles/globalStyle';
import useFiles from '../../../services/files';
import { IUser } from '../../../types';
interface UpdateUserModalProps {
  shouldOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: IUser) => void;
  isLoading?: boolean;
  user: IUser | null;
  showRole: boolean;
}
export default function UpdateUserModal({ showRole, user, shouldOpen, onCancel, onSubmit, isLoading }: UpdateUserModalProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onInternalCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (user && shouldOpen) form.setFieldsValue(user);
  }, [shouldOpen]);

  return (
    <Modal
      open={shouldOpen}
      destroyOnClose
      closable={false}
      title={<h3>{t('update user')}</h3>}
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
          <UpdateUserForm showRole={showRole} user={user} form={form} onSubmit={onSubmit} />
        </Col>
      </Row>
    </Modal>
  );
}

export const UpdateUserForm = ({
  showRole,
  form,
  onSubmit,
  user,
}: {
  showRole: boolean;
  form: FormInstance;
  onSubmit: (values: IUser) => void;
  user: IUser | null;
}) => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(user?.avatar);
  const { uploadMutation } = useFiles();
  const handleUpload = ({ file }: any) => {
    uploadMutation.mutateAsync({ file, folder: 'avatar' }).then(res => {
      const newUrl = res.data.data?.url;
      setAvatar(newUrl);
    });
  };

  const onFinish = (values: any) => {
    onSubmit({ ...values, avatar });
  };

  return (
    <>
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader"
        accept="image/*"
        showUploadList={false}
        customRequest={handleUpload}
      >
        {avatar && !uploadMutation.isLoading ? (
          <Avatar src={avatar} size={100} />
        ) : (
          <div>
            {uploadMutation.isLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="firstName"
          rules={[
            { required: true, message: t('required').toString() },
            { whitespace: true, message: t('required').toString() },
          ]}
        >
          <Input size="large" spellCheck={false} placeholder={t('first name...').toString()} style={inputStyle} />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={[
            { required: true, message: t('required').toString() },
            { whitespace: true, message: t('required').toString() },
          ]}
        >
          <Input size="large" spellCheck={false} placeholder={t('last name...').toString()} style={inputStyle} />
        </Form.Item>
        <Form.Item name="address">
          <Input
            size="large"
            prefix={<CompassOutlined className="site-form-item-icon" />}
            spellCheck={false}
            placeholder={t('address') + '...'}
            style={inputStyle}
          />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          rules={[
            {
              pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
              message: t('invalid phone number').toString(),
            },
          ]}
        >
          <Input
            size="large"
            prefix={<PhoneOutlined className="site-form-item-icon" />}
            spellCheck={false}
            placeholder={t('phone number') + '...'}
            style={inputStyle}
          />
        </Form.Item>
        <Form.Item label={t('reset password')} name="resetPassword">
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={t('password...').toString()}
            style={inputStyle}
            autoComplete="new-password"
          />
        </Form.Item>
        {showRole && (
          <Form.Item name="role" label={t('role')} initialValue={'User'}>
            <Select defaultValue={'User'} size="large">
              <Select.Option value="User">User</Select.Option>
              <Select.Option value="Staff">Staff</Select.Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </>
  );
};
