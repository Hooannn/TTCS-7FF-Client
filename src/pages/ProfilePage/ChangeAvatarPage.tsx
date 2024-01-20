import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Space, Upload } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import useTitle from '../../hooks/useTitle';
import useFiles from '../../services/files';
import useUsers from '../../services/users';
import ProfileSidebar from '../../components/ProfileSidebar';
import { RootState } from '../../store';
import { containerStyle } from '../../assets/styles/globalStyle';
import '../../assets/styles/pages/ProfilePage.css';
import { setUser } from '../../slices/auth.slice';
import { UploadRequestOption } from 'rc-upload/lib/interface';

const ChangeAvatarPage: FC = () => {
  const { t } = useTranslation();
  const { uploadMutation } = useFiles();
  const { updateProfileMutation } = useUsers({ enabledFetchUsers: false, endpoint: '/users' });
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const [avatar, setAvatar] = useState(user?.avatar);

  useTitle(`${t('change avatar')} - 7FF`);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleUpload = ({ file }: UploadRequestOption<any>) => {
    uploadMutation.mutateAsync({ file, folder: 'avatar' }).then(res => {
      const newUrl = res.data.data?.url;
      setAvatar(newUrl);
    });
  };

  const updateAvatar = () => {
    updateProfileMutation.mutate({ data: { ...user, avatar } });
    dispatch(setUser({ ...user, avatar }));
  };

  return (
    <div className="profile-page">
      <section className="container-wrapper">
        <div className="container" style={containerStyle}>
          <ProfileSidebar />

          <div className="update-avatar-wrapper">
            <h3 className="heading">{t('change avatar')}</h3>

            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              accept="image/*"
              showUploadList={false}
              customRequest={handleUpload}
            >
              <Button type="primary" shape="circle" size="large" icon={<EditOutlined />} className="upload-icon" />
              {avatar && !uploadMutation.isLoading ? (
                <Avatar src={avatar} size={100} />
              ) : (
                <div>
                  {uploadMutation.isLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>

            <Space style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} size={24}>
              <Button
                type="primary"
                shape="round"
                size="large"
                block
                disabled={!avatar || avatar === user?.avatar}
                onClick={updateAvatar}
                className="change-avatar-btn"
              >
                {t('update')}
              </Button>
              <Button
                type="default"
                shape="round"
                size="large"
                block
                disabled={!avatar || avatar === user?.avatar}
                onClick={() => setAvatar(user?.avatar)}
                className="change-avatar-btn"
              >
                {t('cancel')}
              </Button>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChangeAvatarPage;
