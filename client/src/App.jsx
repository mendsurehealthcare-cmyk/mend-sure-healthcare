import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import StateMessage from './components/StateMessage';

// Lazy-loaded rather than imported up front: with 15 pages in one bundle,
// visiting any single page — including a doctor's profile reached via a
// direct link — downloaded and parsed all of them first. Splitting per route
// means a page only costs what it actually needs.
const Home = lazy(() => import('./pages/Home'));
const Treatments = lazy(() => import('./pages/Treatments'));
const TreatmentDetail = lazy(() => import('./pages/TreatmentDetail'));
const Hospitals = lazy(() => import('./pages/Hospitals'));
const HospitalDetail = lazy(() => import('./pages/HospitalDetail'));
const Doctors = lazy(() => import('./pages/Doctors'));
const DoctorDetail = lazy(() => import('./pages/DoctorDetail'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const About = lazy(() => import('./pages/About'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Login = lazy(() => import('./pages/Login'));
const Account = lazy(() => import('./pages/Account'));
const Reports = lazy(() => import('./pages/Reports'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminDoctorsList = lazy(() => import('./pages/admin/AdminDoctorsList'));
const AdminDoctorForm = lazy(() => import('./pages/admin/AdminDoctorForm'));
const AdminHospitalsList = lazy(() => import('./pages/admin/AdminHospitalsList'));
const AdminHospitalForm = lazy(() => import('./pages/admin/AdminHospitalForm'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          {/* Inside Layout so a page-level crash keeps the header, nav, and
              footer — the patient can still navigate away or find a number. */}
          <ErrorBoundary>
            <Suspense fallback={<StateMessage>Loading...</StateMessage>}>
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
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                {/* Log in, create an account, and confirm the emailed code all
                    happen on this one page. Clerk emails a six-digit code rather
                    than a link, so there is no callback route to land on. */}
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

                {/* Admin dashboard — AdminRoute bounces anyone who isn't a
                    logged-in admin, but the real access control lives in the
                    /api/admin/* routes themselves. */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminOverview />} />
                  <Route path="doctors" element={<AdminDoctorsList />} />
                  <Route path="doctors/new" element={<AdminDoctorForm />} />
                  <Route path="doctors/:id" element={<AdminDoctorForm />} />
                  <Route path="hospitals" element={<AdminHospitalsList />} />
                  <Route path="hospitals/new" element={<AdminHospitalForm />} />
                  <Route path="hospitals/:id" element={<AdminHospitalForm />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
