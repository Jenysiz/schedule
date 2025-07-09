import React from 'react';
import { ConfigProvider } from 'antd';
import FacilitySchedule from './components/FacilitySchedule';

const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      bodyBg: '#f5f5f5',
      siderBg: '#ffffff',
    },
    Card: {
      borderRadius: 12,
    },
    Button: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 6,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <FacilitySchedule />
    </ConfigProvider>
  );
}

export default App;