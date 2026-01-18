import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components (loaded eagerly as they're always needed)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Common Components
import AnnouncementPopup from './components/common/AnnouncementPopup';
import ToastBanner from './components/common/ToastBanner';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy loaded pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// Public Pages (lazy loaded)
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages (lazy loaded)
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));
const AnnouncementManagement = lazy(() => import('./pages/admin/AnnouncementManagement'));
const ContactManagement = lazy(() => import('./pages/admin/ContactManagement'));

// Auth Store
import useAuthStore from './store/authStore';

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" style={{ margin: '0 auto 16px', borderWidth: '3px' }}></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

// Protected Route Component - preserves redirect URL
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve the intended destination as redirect parameter
    const redirectPath = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Main Layout for public pages
function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ToastBanner />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </main>
      <Footer />
      <AnnouncementPopup />
    </div>
  );
}

// Static page component for better performance
function StaticPage({ title }) {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: '60vh', padding: '80px 24px' }}>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900" style={{ marginBottom: '16px' }}>{title}</h1>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Auth Routes (no layout) */}
        <Route path="/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Login />
          </Suspense>
        } />
        <Route path="/register" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Register />
          </Suspense>
        } />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductManagement />
            </Suspense>
          } />
          <Route path="orders" element={
            <Suspense fallback={<LoadingSpinner />}>
              <OrderManagement />
            </Suspense>
          } />
          <Route path="announcements" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AnnouncementManagement />
            </Suspense>
          } />
          <Route path="contacts" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ContactManagement />
            </Suspense>
          } />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        {/* Protected Routes - Require Authentication */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <MainLayout><Products /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <MainLayout><ProductDetail /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout><Cart /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout><Checkout /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MainLayout><Orders /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout><Profile /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <MainLayout><Wishlist /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Static Pages */}
        <Route path="/about" element={<MainLayout><StaticPage title="About Us" /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/faq" element={<MainLayout><StaticPage title="FAQ" /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><StaticPage title="Privacy Policy" /></MainLayout>} />
        <Route path="/terms" element={<MainLayout><StaticPage title="Terms of Service" /></MainLayout>} />
        <Route path="/shipping-info" element={<MainLayout><StaticPage title="Shipping Info" /></MainLayout>} />
        <Route path="/returns-policy" element={<MainLayout><StaticPage title="Returns Policy" /></MainLayout>} />

        {/* 404 */}
        <Route path="*" element={
          <MainLayout>
            <div className="flex items-center justify-center" style={{ minHeight: '60vh', padding: '80px 24px' }}>
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900" style={{ marginBottom: '16px' }}>404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
