import { FC, useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getI18n, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import { Form, Input, Button, Typography, Divider, Space, Tooltip, Avatar, ConfigProvider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import useAuth from '../../services/auth';
import useTitle from '../../hooks/useTitle';
import toastConfig from '../../configs/toast';
import { RootState } from '../../store';
import { inputStyle, buttonStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/pages/AuthPage.css';
type FormType = 'signIn' | 'signUp' | 'forgot' | 'reset';
interface FormProps {
  isLoading?: boolean;
  setFormType?: (type: FormType) => void;
}
const SignInInputs: FC<FormProps> = ({ setFormType, isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('sign in')}
      </Typography.Title>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('please enter your email').toString() },
          { whitespace: true, message: t('please enter your email').toString() },
          { type: 'email', message: t('invalid email address').toString() },
        ]}
      >
        <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} spellCheck={false} placeholder="Email..." style={inputStyle} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: t('please enter your password').toString() },
          { max: 25, min: 6, message: t('your password must be between 6 and 25 in length').toString() },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={t('password...').toString()}
          style={inputStyle}
        />
      </Form.Item>
      <span onClick={() => (setFormType as any)('forgot')} className="forgot-password">
        {t('forgot password?')}
      </span>
      <Form.Item>
        <Button loading={isLoading} size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle}>
          {t('sign in')}
        </Button>
      </Form.Item>
    </>
  );
};

const SignUpInputs: FC<FormProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('sign up')}
      </Typography.Title>
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
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('please enter your email').toString() },
          { whitespace: true, message: t('please enter your email').toString() },
          { type: 'email', message: t('invalid email address').toString() },
        ]}
      >
        <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} spellCheck={false} placeholder="Email..." style={inputStyle} />
      </Form.Item>
      <Space size="small">
        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('please enter your password').toString() },
            { max: 25, min: 6, message: t('your password must be between 6 and 25 in length').toString() },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={t('password...').toString()}
            style={inputStyle}
          />
        </Form.Item>
        <Form.Item
          name="cf-password"
          rules={[
            { required: true, message: t('please enter your password').toString() },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('password do not match').toString());
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder={t('confirm password...').toString()}
            style={inputStyle}
          />
        </Form.Item>
      </Space>
      <Form.Item>
        <Button size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle} loading={isLoading}>
          {t('sign up')}
        </Button>
      </Form.Item>
    </>
  );
};

const ForgotInputs: FC<FormProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('forgot password')}
      </Typography.Title>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('please enter your email').toString() },
          { whitespace: true, message: t('please enter your email').toString() },
          { type: 'email', message: t('invalid email address').toString() },
        ]}
      >
        <Input size="large" prefix={<MailOutlined className="site-form-item-icon" />} spellCheck={false} placeholder="Email..." style={inputStyle} />
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle}>
          {t('submit')}
        </Button>
      </Form.Item>
    </>
  );
};

const ResetInputs: FC<FormProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  return (
    <>
      <Typography.Title level={3} className="text-center" style={{ marginBottom: '24px' }}>
        {t('reset password')}
      </Typography.Title>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: t('please enter your password').toString() },
          { max: 25, min: 6, message: t('your password must be between 6 and 25 in length').toString() },
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={t('password...').toString()}
          style={inputStyle}
        />
      </Form.Item>
      <Form.Item
        name="cf-password"
        rules={[
          { required: true, message: t('please enter your password').toString() },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(t('password do not match').toString());
            },
          }),
        ]}
      >
        <Input.Password
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={t('confirm password...').toString()}
          style={inputStyle}
        />
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} size="large" shape="round" type="primary" htmlType="submit" block className="submit-btn" style={buttonStyle}>
          {t('submit')}
        </Button>
      </Form.Item>
    </>
  );
};

const AuthPage: FC = () => {
  const [form] = Form.useForm();
  const [formType, setFormType] = useState<FormType>('signIn');
  const { signInMutation, forgotPasswordMutation, googleAuthMutation, signUpMutation, resetPasswordMutation } = useAuth();
  const [query, setQuery] = useSearchParams();
  const isLogged = useSelector(
    (state: RootState) => state.auth.isLogged,
    () => true,
  );

  const { t } = useTranslation();
  const i18n = getI18n();
  useTitle(`${t('account')} - 7FF`);

  const onSignIn = async (values: any) => {
    signInMutation.mutate(values);
  };

  const onSignUp = (values: any) => {
    signUpMutation.mutate(values);
  };

  const onForgotPassword = async (values: any) => {
    await forgotPasswordMutation.mutateAsync({ email: values.email });
    form.resetFields();
  };

  const onResetPassword = async (values: any) => {
    const token = query.get('token') as string;
    await resetPasswordMutation.mutateAsync({ password: values.password, token });
    form.resetFields();
    query.delete('token');
    setQuery(query);
    setFormType('signIn');
  };

  const formEventHandlers = {
    signIn: (values: any) => onSignIn(values),
    signUp: (values: any) => onSignUp(values),
    forgot: (values: any) => onForgotPassword(values),
    reset: (values: any) => onResetPassword(values),
  };

  const onFinish = (values: any) => {
    formEventHandlers[formType](values);
  };
  useEffect(() => {
    if (query.get('type')) {
      setFormType(query.get('type') as FormType);
    }
  }, [query]);

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async res => {
      googleAuthMutation.mutate(res.access_token);
    },
  });

  let content = null;
  if (isLogged) {
    toast(t('you have already logged in'), toastConfig('error'));
    content = <Navigate to="/" />;
  } else {
    content = (
      <div className="auth-page">
        <div className="abs-btns">
          <Tooltip title={t('change language')}>
            {i18n.resolvedLanguage === 'en' && (
              <Avatar onClick={() => i18n.changeLanguage('vi')} src="/en.jpg" style={{ cursor: 'pointer' }}></Avatar>
            )}
            {i18n.resolvedLanguage === 'vi' && (
              <Avatar onClick={() => i18n.changeLanguage('en')} src="/vn.jpg" style={{ cursor: 'pointer' }}></Avatar>
            )}
          </Tooltip>
        </div>

        <ConfigProvider
          theme={{ token: { colorError: '#3700b3' } }}
          children={
            <Form layout="vertical" className="auth-form" onFinish={onFinish} form={form} autoComplete="off">
              {formType === 'signIn' && <SignInInputs setFormType={setFormType} isLoading={signInMutation.isLoading} />}
              {formType === 'signUp' && <SignUpInputs isLoading={signUpMutation.isLoading} />}
              {formType === 'forgot' && <ForgotInputs isLoading={forgotPasswordMutation.isLoading} />}
              {formType === 'reset' && <ResetInputs isLoading={resetPasswordMutation.isLoading} />}

              {formType !== 'forgot' && formType !== 'reset' && (
                <>
                  <Divider style={{ borderColor: '#101319', marginBottom: '8px' }}>
                    {formType === 'signIn' ? t('or sign in using') : t('or sign up using')}{' '}
                  </Divider>
                  <Button shape="round" size="large" block onClick={() => handleGoogleAuth()} style={buttonStyle} className="google-auth-btn">
                    <img src="/google-brand.png" />
                    {formType === 'signIn' ? t('sign in with Google') : t('sign up with Google')}
                  </Button>
                </>
              )}

              <div className="text-center">
                {formType === 'signIn' ? t("don't have an account?") + ' ' : t('already have an account?') + ' '}
                <strong onClick={() => setFormType(formType === 'signIn' ? 'signUp' : 'signIn')}>
                  {formType === 'signIn' ? t('sign up') : t('sign in')}
                </strong>
              </div>
            </Form>
          }
        />
      </div>
    );
  }

  return content;
};

export default AuthPage;
