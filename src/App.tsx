// src/App.tsx
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import { useTheme } from './context/ThemeContext';
import { lightTheme, darkTheme } from './config/antdTheme';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import MainLayout from './components/layout/MainLayout';
import InsuranceFormPage from './pages/InsuranceFormPage';
import SubmissionsListPage from './pages/SubmissionsListPage';

function App() {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const location = useLocation();

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  if (theme === 'dark') {
    currentTheme.algorithm = antdTheme.darkAlgorithm;
  }
  
  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <ConfigProvider theme={currentTheme}>
      <AntdApp> 
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<InsuranceFormPage />} />
              <Route path="submissions" element={<SubmissionsListPage />} />
              {/* <Route path="*" element={<NotFoundPage />} /> */}
            </Route>
          </Routes>
        </AnimatePresence>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;