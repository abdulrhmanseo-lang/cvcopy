
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { Loader2 } from 'lucide-react';

// Lazy loading pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Builder = React.lazy(() => import('./pages/Builder'));
const Preview = React.lazy(() => import('./pages/Preview'));
const Templates = React.lazy(() => import('./pages/Templates'));
const CoverLetter = React.lazy(() => import('./pages/CoverLetter'));
const Auth = React.lazy(() => import('./pages/Auth'));
const JobGuarantee = React.lazy(() => import('./pages/JobGuarantee'));
const JobsTracking = React.lazy(() => import('./pages/JobsTracking'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const PaymentCallback = React.lazy(() => import('./pages/PaymentCallback'));
const WebCV = React.lazy(() => import('./pages/WebCV'));

const PageLoader = () => (
  <div className="min-h-screen bg-dark flex items-center justify-center">
    <Loader2 size={40} className="text-primary animate-spin" />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/builder" element={<PageTransition><Builder /></PageTransition>} />
        <Route path="/preview" element={<PageTransition><Preview /></PageTransition>} />
        <Route path="/templates" element={<PageTransition><Templates /></PageTransition>} />
        <Route path="/cover-letter" element={<PageTransition><CoverLetter /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/cv/:id" element={<PageTransition><WebCV /></PageTransition>} />
        <Route path="/job-guarantee" element={<PageTransition><JobGuarantee /></PageTransition>} />
        <Route path="/payment/callback" element={<PageTransition><PaymentCallback /></PageTransition>} />

        <Route path="/dashboard" element={
          <PageTransition>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </PageTransition>
        } />

        <Route path="/dashboard/jobs-tracking" element={
          <PageTransition>
            <ProtectedRoute requiredPlan="guaranteed">
              <JobsTracking />
            </ProtectedRoute>
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
