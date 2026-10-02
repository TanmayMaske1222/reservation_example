import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { DepartmentsPage } from './pages/public/DepartmentsPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// User Portal Pages & Layout
import { UserLayout } from './pages/user/UserLayout';
import { UserDashboard } from './pages/user/UserDashboard';
import { TrainReservation } from './pages/user/TrainReservation';
import { FlightReservation } from './pages/user/FlightReservation';
import { BusReservation } from './pages/user/BusReservation';
import { MyBookingsPage } from './pages/user/MyBookingsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import { UserNotificationsPage } from './pages/user/UserNotificationsPage';
import { UserSupportPage } from './pages/user/UserSupportPage';

// Admin Portal Pages & Layout
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminTrainsPage } from './pages/admin/AdminTrainsPage';
import { AdminFlightsPage } from './pages/admin/AdminFlightsPage';
import { AdminBusesPage } from './pages/admin/AdminBusesPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function MainRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname && window.location.pathname !== '/'
      ? window.location.pathname
      : '/';
  });

  const [routeState, setRouteState] = useState<any>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, state?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState(state || {}, '', path);
    } catch {
      // Ignore if iframe origin restrictions
    }
    setCurrentPath(path);
    setRouteState(state || null);
  };

  // Route Dispatcher
  const renderContent = () => {
    // ADMIN PORTAL
    if (currentPath === '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/admin')) {
      return (
        <AdminLayout currentPath={currentPath} onNavigate={navigate}>
          {currentPath === '/admin/dashboard' && <AdminDashboard onNavigate={navigate} />}
          {currentPath === '/admin/users' && <AdminUsersPage />}
          {currentPath === '/admin/trains' && <AdminTrainsPage />}
          {currentPath === '/admin/flights' && <AdminFlightsPage />}
          {currentPath === '/admin/buses' && <AdminBusesPage />}
          {currentPath === '/admin/bookings' && <AdminBookingsPage />}
          {currentPath === '/admin/payments' && <AdminPaymentsPage />}
          {currentPath === '/admin/reports' && <AdminReportsPage />}
          {currentPath === '/admin/settings' && <AdminSettingsPage />}
          {currentPath === '/admin' && <AdminDashboard onNavigate={navigate} />}
        </AdminLayout>
      );
    }

    // USER PORTAL
    if (currentPath.startsWith('/user')) {
      return (
        <UserLayout currentPath={currentPath} onNavigate={navigate}>
          {currentPath === '/user/dashboard' && <UserDashboard onNavigate={navigate} />}
          {currentPath === '/user/trains' && <TrainReservation initialSearch={routeState} />}
          {currentPath === '/user/flights' && <FlightReservation initialSearch={routeState} />}
          {currentPath === '/user/buses' && <BusReservation initialSearch={routeState} />}
          {currentPath === '/user/bookings' && <MyBookingsPage />}
          {currentPath === '/user/profile' && <UserProfilePage onNavigate={navigate} />}
          {currentPath === '/user/notifications' && <UserNotificationsPage />}
          {currentPath === '/user/support' && <UserSupportPage />}
          {currentPath === '/user' && <UserDashboard onNavigate={navigate} />}
        </UserLayout>
      );
    }

    // PUBLIC WEBSITE
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">
          {currentPath === '/' && <HomePage onNavigate={navigate} />}
          {currentPath === '/about' && <AboutPage />}
          {currentPath === '/departments' && <DepartmentsPage />}
          {currentPath === '/services' && <ServicesPage />}
          {currentPath === '/contact' && <ContactPage />}
          {currentPath === '/login' && <LoginPage onNavigate={navigate} />}
          {currentPath === '/register' && <RegisterPage onNavigate={navigate} />}
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  };

  return <>{renderContent()}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  );
}
