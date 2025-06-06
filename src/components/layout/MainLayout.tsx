import { Layout, Menu, Space, Switch } from 'antd';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/useTheme';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Header, Content } = Layout;

const MainLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      label: <NavLink to="/">Submissions</NavLink>,
    },
    {
      key: '/forms',
      label: <NavLink to="/forms">New Application</NavLink>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="main-header">
        <div className="logo-container" style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <NavLink style={{ color: 'white', textDecoration: 'none' }} to="/">
            Insurance
          </NavLink>
        </div>

        <Menu
          className="main-menu-desk"
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, justifyContent: 'center', borderBottom: 'none' }}
        />

        <Space className="header-actions">
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            onChange={toggleTheme}
            checked={theme === 'dark'}
          />
        </Space>
      </Header>
      <div>
        <Menu
          className="main-menu-mobile"
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0, justifyContent: 'center', borderBottom: 'none' }}
        />
      </div>

      <Content style={{ padding: '24px 48px' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
