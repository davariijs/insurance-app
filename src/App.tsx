import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import { useTheme } from './context/ThemeContext';
import { lightTheme, darkTheme } from './config/antdTheme';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './components/layout/MainLayout';
import CustomSpinner from './components/common/CustomSpinner';

const InsuranceFormPage = React.lazy(() => import('./pages/InsuranceFormPage'));
const SubmissionsListPage = React.lazy(() => import('./pages/SubmissionsListPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
    <CustomSpinner />
  </div>
);

function App() {
  const { theme } = useTheme();
  const location = useLocation();

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  if (theme === 'dark') {
    currentTheme.algorithm = antdTheme.darkAlgorithm;
  }
  

  return (
    <ConfigProvider theme={currentTheme}>
      <AntdApp>
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<SubmissionsListPage />} />
                <Route path="forms" element={<InsuranceFormPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </Suspense>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;