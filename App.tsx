import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import GeneratePage from './pages/GeneratePage';
import AuthPage from './pages/AuthPage';
import CreditsPage from './pages/CreditsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import Footer from './components/Footer';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.isAdmin ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-light dark:bg-dark text-light-text dark:text-dark-text transition-colors duration-300 font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-16 font-heading">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/generate" element={
                  <PrivateRoute>
                    <GeneratePage />
                  </PrivateRoute>
                } />
                 <Route path="/credits" element={
                  <PrivateRoute>
                    <CreditsPage />
                  </PrivateRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }>
                  <Route index element={<Navigate to="users" />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="payments" element={<AdminPaymentsPage />} />
                </Route>

                 <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;