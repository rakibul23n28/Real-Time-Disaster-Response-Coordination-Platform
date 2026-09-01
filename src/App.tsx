import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AppStateProvider } from "./hooks/useAppState";
import { ToastProvider } from "./components/common/Toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// Public
import LandingPage from "./pages/public/LandingPage";
import NotFoundPage from "./pages/public/NotFoundPage";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Citizen
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import ReportForm from "./pages/citizen/ReportForm";
import MyReports from "./pages/citizen/MyReports";
import ReportDetail from "./pages/citizen/ReportDetail";
import CitizenMap from "./pages/citizen/CitizenMap";
import CitizenProfile from "./pages/citizen/CitizenProfile";

// Volunteer
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import VolunteerMap from "./pages/volunteer/VolunteerMap";
import VolunteerTasks from "./pages/volunteer/VolunteerTasks";
import TaskDetail from "./pages/volunteer/TaskDetail";
import FieldIssues from "./pages/volunteer/FieldIssues";
import VolunteerProfile from "./pages/volunteer/VolunteerProfile";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReportVerification from "./pages/admin/ReportVerification";
import AdminReportDetail from "./pages/admin/AdminReportDetail";
import AdminMap from "./pages/admin/AdminMap";
import SeverityAnalysis from "./pages/admin/SeverityAnalysis";
import ResourceAllocation from "./pages/admin/ResourceAllocation";
import InventoryManagement from "./pages/admin/InventoryManagement";
import Operations from "./pages/admin/Operations";
import AdminProfile from "./pages/admin/AdminProfile";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <AuthProvider>
        <AppStateProvider>
          <ToastProvider>
            <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Citizen */}
          <Route element={<ProtectedRoute role="citizen" />}>
            <Route element={<AppLayout />}>
              <Route path="/citizen" element={<CitizenDashboard />} />
              <Route path="/citizen/report" element={<ReportForm />} />
              <Route path="/citizen/reports" element={<MyReports />} />
              <Route path="/citizen/reports/:id" element={<ReportDetail />} />
              <Route path="/citizen/map" element={<CitizenMap />} />
              <Route path="/citizen/profile" element={<CitizenProfile />} />
            </Route>
          </Route>

          {/* Volunteer */}
          <Route element={<ProtectedRoute role="volunteer" />}>
            <Route element={<AppLayout />}>
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/volunteer/map" element={<VolunteerMap />} />
              <Route path="/volunteer/tasks" element={<VolunteerTasks />} />
              <Route path="/volunteer/tasks/:id" element={<TaskDetail />} />
              <Route path="/volunteer/issues" element={<FieldIssues />} />
              <Route path="/volunteer/profile" element={<VolunteerProfile />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/reports" element={<ReportVerification />} />
              <Route path="/admin/reports/:id" element={<AdminReportDetail />} />
              <Route path="/admin/map" element={<AdminMap />} />
              <Route path="/admin/severity" element={<SeverityAnalysis />} />
              <Route path="/admin/resources" element={<ResourceAllocation />} />
              <Route path="/admin/inventory" element={<InventoryManagement />} />
              <Route path="/admin/operations" element={<Operations />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ToastProvider>
        </AppStateProvider>
      </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
