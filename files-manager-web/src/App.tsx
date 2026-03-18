import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import RulesPage from './pages/RulesPage';
import Layout from './Layout';
import { routes } from './routes';
import DashboardPage from './pages/DashboardPage';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackBarProvider, useSnackBar } from './contexts/SnackBarContext';
import RuleFormPage from './pages/RuleFormPage';
import { SettingsPage } from './pages/SettingsPage';
import LogsPage from './pages/LogsPage';
import LandingPage from './pages/LandingPage';
import HistoryPage from './pages/HistoryPage';

function AppProviders() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#667eea',
        light: '#8b9ff5',
        dark: '#4c5fd4',
        contrastText: '#fff',
      },
      secondary: {
        main: '#764ba2',
        light: '#9169b8',
        dark: '#5a3a7d',
        contrastText: '#fff',
      },
    },
  });
  const snackBar = useSnackBar();

  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (error: any) => {
          error.response?.data?.errors.forEach((err: string) => {
            snackBar.showSnackBar(err, 'error');
          });
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path={routes.home.path} element={<LandingPage />} />
            <Route element={<Layout />}>
              <Route path={routes.dashboard.path} element={<DashboardPage />} />
              <Route path={routes.rules.path} element={<RulesPage />} />
              <Route path={routes.newRule.path} element={<RuleFormPage />} />
              <Route path={routes.editRule.path} element={<RuleFormPage />} />
              <Route path={routes.settings.path} element={<SettingsPage />} />
              <Route path={routes.logs.path} element={<LogsPage />} />
              <Route path={routes.history.path} element={<HistoryPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <SnackBarProvider>
      <AppProviders />
    </SnackBarProvider>
  );
}
