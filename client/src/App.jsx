import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Treatments from './pages/Treatments';
import TreatmentDetail from './pages/TreatmentDetail';
import Hospitals from './pages/Hospitals';
import HospitalDetail from './pages/HospitalDetail';
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Account from './pages/Account';
import Reports from './pages/Reports';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/treatments/:slug" element={<TreatmentDetail />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/hospitals/:slug" element={<HospitalDetail />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:slug" element={<DoctorDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />

            {/* Patient-only pages — ProtectedRoute bounces anyone logged out
                to /login and sends them back here afterwards. */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
