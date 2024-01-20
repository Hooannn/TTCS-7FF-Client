import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Form, Input } from 'antd';
import type { FormInstance } from 'antd/es/form';
import useTitle from '../../hooks/useTitle';
import useUsers from '../../services/users';
import ProfileSidebar from '../../components/ProfileSidebar';
import { RootState } from '../../store';
import { setUser } from '../../slices/auth.slice';
import { containerStyle, inputStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/pages/ProfilePage.css';

const ProfilePage: FC = () => {
  const { t } = useTranslation();
  const { updateProfileMutation } = useUsers({ enabledFetchUsers: false, endpoint: '/users' });
  const dispatch = useDispatch();

  useTitle(`${t('edit account')} - 7FF`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    formRef.current?.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
    });
  }, [user]);

  const formRef = useRef<FormInstance>(null);
  const onFinish = (values: any) => {
    const { email, ...otherValues } = values;
    updateProfileMutation.mutate({ data: { ...user, ...otherValues } });
    dispatch(setUser({ ...user, ...otherValues }));
  };

  return (
    <div className="profile-page">
      <section className="container-wrapper">
        <div className="container" style={containerStyle}>
          <ProfileSidebar />

          <div className="update-account-form">
            <Form layout="vertical" onFinish={onFinish} ref={formRef}>
              <h3 className="form-heading">{t('account details')}</h3>
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
                name="phoneNumber"
                rules={[
                  {
                    pattern: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                    message: t('invalid phone number').toString(),
                  },
                ]}
              >
                <Input size="large" placeholder={t('phone number...').toString()} style={inputStyle} />
              </Form.Item>
              <Form.Item
                name="email"
                // rules={[
                //   { required: true, message: t('please enter your email').toString() },
                //   { whitespace: true, message: t('please enter your email').toString() },
                //   { type: 'email', message: t('invalid email address').toString() },
                // ]}
              >
                <Input size="large" spellCheck={false} placeholder="Email..." style={inputStyle} disabled />
              </Form.Item>
              <Form.Item name="address">
                <Input size="large" spellCheck={false} placeholder={t('address...').toString()} style={inputStyle} />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button size="large" shape="round" block type="primary" htmlType="submit" className="update-account-btn">
                  {t('update account')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
