import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EntityListPage from './components/EntityListPage';
import { ENTITY_CONFIGS, ENTITY_ORDER } from './config/entities';

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            }
          />
          {ENTITY_ORDER.map((key) => (
            <Route
              key={key}
              path={`/${key}`}
              element={
                <AdminLayout>
                  <EntityListPage config={ENTITY_CONFIGS[key]} />
                </AdminLayout>
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
