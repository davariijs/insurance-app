import type { ThemeConfig } from 'antd';

const sharedConfig: ThemeConfig = {
  token: {
    fontFamily: 'Vazirmatn, sans-serif',
    borderRadius: 6,
  },
  components: {
    Button: {
      controlHeight: 40,
    },
  },
};

export const lightTheme: ThemeConfig = {
  ...sharedConfig,
  token: {
    ...sharedConfig.token,
    colorPrimary: '#006A4E', 
    colorBgLayout: '#F8F9FA', 
    colorTextBase: '#333333',
  },
};

export const darkTheme: ThemeConfig = {
  ...sharedConfig,
  token: {
    ...sharedConfig.token,
    colorPrimary: '#32CD32', 
    colorBgLayout: '#1C1C1E', 
    colorTextBase: '#E0E0E0',
    colorBgContainer: '#2C2C2E', 
  },
};