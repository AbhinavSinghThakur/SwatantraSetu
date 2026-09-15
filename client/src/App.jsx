import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing';
import About from './pages/About';
import Services from './pages/Services';
import FindWorker from './pages/FindWorker';
import HowItWorks from './pages/HowItWorks';
import WorkerRegistration from './pages/WorkerRegistration';
import CustomerRegistration from './pages/CustomerRegistration';
import Cooperatives from './pages/Cooperatives';
import Welfare from './pages/Welfare';
import Trust from './pages/Trust';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerProfile from './pages/WorkerProfile';
import BookingFlow from './pages/BookingFlow';
import MobileApp from './pages/MobileApp';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import WorkerDashboard from './pages/dashboards/WorkerDashboard';
import CoopDashboard from './pages/dashboards/CoopDashboard';
import FederationDashboard from './pages/dashboards/FederationDashboard';
import { useAuth } from './context/AuthContext';
import { roleHome } from './utils/format';

function Protected({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Landing />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="find-worker" element={<FindWorker />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="register/worker" element={<WorkerRegistration />} />
        <Route path="register/customer" element={<CustomerRegistration />} />
        <Route path="cooperatives" element={<Cooperatives />} />
        <Route path="welfare" element={<Welfare />} />
        <Route path="trust" element={<Trust />} />
        <Route path="impact" element={<Impact />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="workers/:id" element={<WorkerProfile />} />
        <Route path="book/:workerId" element={<BookingFlow />} />
        <Route path="mobile" element={<MobileApp />} />
      </Route>

      <Route path="/app" element={<AppLayout />}>
        <Route path="customer" element={<Protected roles={['customer']}><CustomerDashboard /></Protected>} />
        <Route path="worker" element={<Protected roles={['worker']}><WorkerDashboard /></Protected>} />
        <Route path="coop" element={<Protected roles={['coop_admin']}><CoopDashboard /></Protected>} />
        <Route path="federation" element={<Protected roles={['federation_admin']}><FederationDashboard /></Protected>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
