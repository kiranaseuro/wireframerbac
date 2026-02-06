import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuthStore } from "./stores/auth-store"
import { useNotificationStore } from "./stores/notification-store"

// Pages
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import MyAccessPage from "./pages/MyAccessPage"
import RequestAccessPage from "./pages/RequestAccessPage"
import MyRequestsPage from "./pages/MyRequestsPage"
import ApprovalsPage from "./pages/ApprovalsPage"
import UsersPage from "./pages/UsersPage"
import RolesPage from "./pages/RolesPage"
import PermissionsPage from "./pages/PermissionsPage"
import GroupsPage from "./pages/GroupsPage"
import AuditLogsPage from "./pages/AuditLogsPage"
import ReportsPage from "./pages/ReportsPage"
// New Wireframe Pages
import ADSyncPage from "./pages/ADSyncPage"
import PermissionDetailPage from "./pages/PermissionDetailPage"
import SuperAdminDashboard from "./pages/SuperAdminDashboard"
import GroupMappingPage from "./pages/GroupMappingPage"

// Layout
import AppLayout from "./components/layout/app-layout"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const initializeData = useAuthStore((state) => state.initializeData)
  const initializeNotifications = useNotificationStore(
    (state) => state.initializeNotifications
  )

  useEffect(() => {
    initializeData()
    initializeNotifications()
  }, [initializeData, initializeNotifications])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="my-access" element={<MyAccessPage />} />
          <Route path="request-access" element={<RequestAccessPage />} />
          <Route path="my-requests" element={<MyRequestsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          {/* New Wireframe Routes */}
          <Route path="ad-sync" element={<ADSyncPage />} />
          <Route path="permission-detail" element={<PermissionDetailPage />} />
          <Route path="super-admin" element={<SuperAdminDashboard />} />
          <Route path="group-mapping" element={<GroupMappingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
