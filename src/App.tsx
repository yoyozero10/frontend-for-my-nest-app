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
          {/* Protected routes sẽ được thêm sau */}
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
