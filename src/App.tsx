import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import JobsListPage from './pages/jobs/JobsListPage';
import JobDetailPage from './pages/jobs/JobDetailPage';
import CompaniesListPage from './pages/companies/CompaniesListPage';
import CompanyDetailPage from './pages/companies/CompanyDetailPage';
import MyResumesPage from './pages/resumes/MyResumesPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobsPage from './pages/admin/jobs/AdminJobsPage';
import CreateJobPage from './pages/admin/jobs/CreateJobPage';
import EditJobPage from './pages/admin/jobs/EditJobPage';
import AdminCompaniesPage from './pages/admin/companies/AdminCompaniesPage';
import CreateCompanyPage from './pages/admin/companies/CreateCompanyPage';
import EditCompanyPage from './pages/admin/companies/EditCompanyPage';
import AdminResumesPage from './pages/admin/resumes/AdminResumesPage';
import AdminUsersPage from './pages/admin/users/AdminUsersPage';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompaniesListPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/my-resumes" element={<MyResumesPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobsPage />} />
            <Route path="jobs/create" element={<CreateJobPage />} />
            <Route path="jobs/edit/:id" element={<EditJobPage />} />
            <Route path="companies" element={<AdminCompaniesPage />} />
            <Route path="companies/create" element={<CreateCompanyPage />} />
            <Route path="companies/edit/:id" element={<EditCompanyPage />} />
            <Route path="resumes" element={<AdminResumesPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
