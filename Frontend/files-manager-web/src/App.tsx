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

function AppProviders() {
  const theme = createTheme();
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
          <Layout />
          <Routes>
            <Route path={routes.home.path} element={<DashboardPage />} />
            <Route path={routes.rules.path} element={<RulesPage />} />
            <Route path={routes.newRule.path} element={<RuleFormPage />} />
            <Route path={routes.editRule.path} element={<RuleFormPage />} />
            <Route path={routes.settings.path} element={<SettingsPage />} />
            <Route path={routes.logs.path} element={<LogsPage />} />
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
