import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuthStore } from "./stores/auth-store"
import { useNotificationStore } from "./stores/notification-store"

// Pages
import DashboardPage from "./pages/DashboardPage"
import MyAccessPage from "./pages/MyAccessPage"
import UsersPage from "./pages/UsersPage"
import RolesPage from "./pages/RolesPage"
import PermissionsPage from "./pages/PermissionsPage"
import GroupsPage from "./pages/GroupsPage"
import AuditLogsPage from "./pages/AuditLogsPage"
import ReportsPage from "./pages/ReportsPage"
import NotificationSettingsPage from "./pages/NotificationSettingsPage"
// Admin Pages
import ADSyncPage from "./pages/ADSyncPage"
import PermissionDetailPage from "./pages/PermissionDetailPage"
import SuperAdminDashboard from "./pages/SuperAdminDashboard"
import GroupMappingPage from "./pages/GroupMappingPage"

// ============================================================================
// WORKFLOW PAGES REMOVED (RGD Section 3 - Out of Scope)
// - RequestAccessPage, MyRequestsPage, ApprovalsPage removed
// - Access requests handled via external HR/IT ticketing systems
// ============================================================================

// Layout
import AppLayout from "./components/layout/app-layout"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function App() {
  const initializeData = useAuthStore((state) => state.initializeData)
  const autoLogin = useAuthStore((state) => state.autoLogin)
  const initializeNotifications = useNotificationStore(
    (state) => state.initializeNotifications
  )

  useEffect(() => {
    initializeData()
    initializeNotifications()
    // Auto-login as alice.admin@fmg.com (super admin)
    autoLogin()
  }, [initializeData, initializeNotifications, autoLogin])

  return (
    <BrowserRouter>
      <Routes>
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
          {/* Workflow routes REMOVED - out of scope per RGD Section 3 */}
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notification-settings" element={<NotificationSettingsPage />} />
          {/* Admin Routes */}
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
