import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Rides from './pages/Rides';
import Events from './pages/Events';
import Marketplace from './pages/Marketplace';
import Clubs from './pages/Clubs';
import LostFound from './pages/LostFound';
import Jobs from './pages/Jobs';
import Complaints from './pages/Complaints';
import Messages from './pages/Messages';


const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Home />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Only Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={['ADMIN']}>
                  <DashboardLayout>
                    <AdminPanel />
                  </DashboardLayout>
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          />

          {/* Shared Routes */}
          <Route
            path="/rides"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Rides />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Events />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Marketplace />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Clubs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/lost-found"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <LostFound />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Jobs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Complaints />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />




          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Messages />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;