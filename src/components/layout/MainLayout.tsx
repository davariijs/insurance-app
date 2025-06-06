import { Layout, Menu, Button, Space, Switch } from 'antd';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
  };

  const menuItems = [
    {
      key: '/', 
      label: <NavLink to="/">{t('nav_submissions')}</NavLink>,
    },
    {
      key: '/forms',
      label: <NavLink to="/forms">{t('nav_form')}</NavLink>,
    },
    
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>

        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <NavLink style={{ color: 'white', textDecoration: 'none' }} to="/">
            Insurance
          </NavLink>
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]} 
          items={menuItems}
          style={{ flex: 1, minWidth: 0, justifyContent: 'center', borderBottom: 'none' }}
        />

        <Space>
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            onChange={toggleTheme}
            checked={theme === 'dark'}
          />
          <Button type="primary" onClick={changeLanguage}>
            {t('toggle_language')}
          </Button>
        </Space>
      </Header>

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

      <Footer style={{ textAlign: 'center' }}>
        Insurance ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default MainLayout;