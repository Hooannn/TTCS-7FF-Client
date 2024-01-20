import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  LineChartOutlined,
  TagsOutlined,
  ClusterOutlined,
  InboxOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppState } from '../../slices/app.slice';
import { RootState } from '../../store';

const DashboardSidebar: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedKeys, setSelectedKeys] = useState<string[]>();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const items = [
    {
      label: t('dashboard'),
      key: '',
      icon: <HomeOutlined />,
      visible: true,
    },
    {
      label: t('client facing'),
      key: '/client_facing',
      icon: <UserOutlined />,
      visible: true,
      children: [
        {
          label: t('products'),
          key: '/products',
          icon: <ShoppingCartOutlined />,
        },
        {
          label: t('categories'),
          key: '/categories',
          icon: <ClusterOutlined />,
        },
        {
          label: t('users'),
          key: '/users',
          icon: <UserOutlined />,
        },
        {
          label: t('orders'),
          key: '/orders',
          icon: <FileTextOutlined />,
        },
        {
          label: t('vouchers'),
          key: '/vouchers',
          icon: <TagsOutlined />,
        },
      ],
    },
    {
      label: t('staffs'),
      key: '/staffs',
      visible: user?.role === 'Admin',
      icon: <TeamOutlined />,
    },
    {
      label: t('overall'),
      key: '/overall',
      icon: <LineChartOutlined />,
      visible: true,
    },
  ];

  useEffect(() => {
    const remainingPath = location.pathname.slice('/dashboard'.length);
    const foundItem = items.find(item => item.children?.length && item.children?.find(child => child.key === remainingPath));
    setSelectedKeys([remainingPath]);
    setOpenKeys(foundItem?.key ? [foundItem.key] : []);
  }, [location]);

  return (
    <Layout.Sider
      theme="dark"
      width={250}
      collapsible
      collapsed={collapsed}
      onCollapse={value => setCollapsed(value)}
      style={{ boxShadow: '1px 0px 1px rgba(0, 0, 0, 0.12)' }}
    >
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={e => navigate(`/dashboard${e.key}`)}
        items={items.filter(item => item.visible)}
      />
    </Layout.Sider>
  );
};

export default DashboardSidebar;
