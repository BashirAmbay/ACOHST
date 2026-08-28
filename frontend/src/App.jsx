import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import ApplicantLayout from './layouts/ApplicantLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Management from './pages/public/Management';
import Academics from './pages/public/Academics';
import Admissions from './pages/public/Admissions';
import News from './pages/public/News';
import NewsDetail from './pages/public/NewsDetail';
import Facilities from './pages/public/Facilities';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Applicant Pages
import ApplicantDashboard from './pages/applicant/ApplicantDashboard';
import ApplicationForm from './pages/applicant/ApplicationForm';
import AdmissionLetterView from './pages/applicant/AdmissionLetterView';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CourseRegistration from './pages/student/CourseRegistration';
import StudentResults from './pages/student/StudentResults';
import StudentFees from './pages/student/StudentFees';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ApplicantsList from './pages/admin/ApplicantsList';
import StudentsList from './pages/admin/StudentsList';
import AcademicsManager from './pages/admin/AcademicsManager';
import FinanceManager from './pages/admin/FinanceManager';
import CMSManager from './pages/admin/CMSManager';
import UserManager from './pages/admin/UserManager';
import SettingsPage from './pages/admin/SettingsPage';
import AuditLogs from './pages/admin/AuditLogs';

// Protected Route Wrappers
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-500">Authenticating user session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'Super Admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="management" element={<Management />} />
              <Route path="academics" element={<Academics />} />
              <Route path="admissions" element={<Admissions />} />
              <Route path="news" element={<News />} />
              <Route path="news/:slug" element={<NewsDetail />} />
              <Route path="facilities" element={<Facilities />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Online Applicant Portal */}
            <Route 
              path="/applicant" 
              element={
                <ProtectedRoute allowedRoles={['Applicant', 'Student']}>
                  <ApplicantLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ApplicantDashboard />} />
              <Route path="apply" element={<ApplicationForm />} />
              <Route path="status" element={<ApplicantDashboard />} />
              <Route path="admission-letter" element={<AdmissionLetterView />} />
            </Route>

            {/* Student Portal */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDashboard />} />
              <Route path="courses" element={<CourseRegistration />} />
              <Route path="results" element={<StudentResults />} />
              <Route path="fees" element={<StudentFees />} />
            </Route>

            {/* Admin Management Dashboard */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['Super Admin', 'Administrator', 'Admission Officer', 'Academic Officer', 'Finance Officer', 'Content Manager']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="applicants" element={<ApplicantsList />} />
              <Route path="students" element={<StudentsList />} />
              <Route path="academics" element={<AcademicsManager />} />
              <Route path="finance" element={<FinanceManager />} />
              <Route path="cms" element={<CMSManager />} />
              <Route path="users" element={<UserManager />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="audit-logs" element={<AuditLogs />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
