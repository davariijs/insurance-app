import { Layout, Menu, Button, Space, Switch } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>

        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          Insurify
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          selectable={false}
          style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
          items={[
            { key: 'form', label: <NavLink to="/">{t('nav_form')}</NavLink> },
            { key: 'submissions', label: <NavLink to="/submissions">{t('nav_submissions')}</NavLink> },
          ]}
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