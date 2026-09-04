import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppContext from 'hooks/app';
import MessagingProvider from 'hooks/messaging';
import { useWindowSize } from 'hooks/windowSize';
import { theme } from 'config/theme';
import { BrowserRouter } from 'routes/BrowserRouter';
import AppRoutes from 'routes/Routes';
import history from 'services/history';

const App: React.FC = () => {
  const { isMobile, width } = useWindowSize();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContext.Provider value={{ isMobile, windowWidth: width }}>
        <MessagingProvider>
          <BrowserRouter history={history}>
            <AppRoutes />
          </BrowserRouter>
        </MessagingProvider>
      </AppContext.Provider>
    </ThemeProvider>
  );
};

export default App;
