import { NavLink } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Key,
  Users,
  Shield,
  Lock,
  UserCog,
  FileText,
  BarChart3,
  RefreshCw,
  Settings,
  ShieldAlert,
} from "lucide-react"
import type { UserRole } from "@/types"

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  roles?: UserRole[]
}

const navigation: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/my-access",
    label: "My Access",
    icon: Key,
  },
  // ============================================================================
  // WORKFLOW PAGES REMOVED (RGD Section 3 - Out of Scope)
  // - Request Access, My Requests, Approvals are handled via external
  //   HR/IT ticketing systems per organizational decision
  // ============================================================================

  // ============================================================================
  // ADMIN PAGES - Both IT_ADMIN and SUB_ADMIN have access (RGD Section 7.1)
  // SUB_ADMIN has same administrative capabilities as IT_ADMIN
  // ONLY difference: Environment restrictions (DEV/QA only, no UAT/PROD)
  // Environment restrictions are enforced INSIDE the pages, not in navigation
  // ============================================================================
  {
    to: "/users",
    label: "Users",
    icon: Users,
    roles: ["IT_ADMIN", "SUB_ADMIN"],
  },
  {
    to: "/roles",
    label: "Roles",
    icon: Shield,
    roles: ["IT_ADMIN", "SUB_ADMIN"], // SUB_ADMIN can manage roles
  },
  {
    to: "/permissions",
    label: "Permissions",
    icon: Lock,
    roles: ["IT_ADMIN", "SUB_ADMIN"], // SUB_ADMIN can manage permissions (DEV/QA only)
  },
  {
    to: "/groups",
    label: "Groups",
    icon: UserCog,
    roles: ["IT_ADMIN", "SUB_ADMIN"], // SUB_ADMIN can manage groups
  },
  {
    to: "/audit-logs",
    label: "Audit Logs",
    icon: FileText,
    roles: ["AUDITOR", "IT_ADMIN", "SUB_ADMIN"], // SUB_ADMIN can view audit logs
  },
  {
    to: "/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["AUDITOR", "IT_ADMIN", "SUB_ADMIN"], // SUB_ADMIN can view reports
  },

  // ============================================================================
  // IT_ADMIN-ONLY PAGES (RGD Section 7.1.1)
  // These are high-level system administration pages
  // SUB_ADMIN does NOT have access to these
  // ============================================================================
  {
    to: "/super-admin",
    label: "Super Admin",
    icon: ShieldAlert,
    roles: ["IT_ADMIN"], // IT_ADMIN only - system-wide dashboard
  },
  {
    to: "/ad-sync",
    label: "AD Sync",
    icon: RefreshCw,
    roles: ["IT_ADMIN"], // IT_ADMIN only - Active Directory sync
  },
  {
    to: "/group-mapping",
    label: "Group Mapping",
    icon: Settings,
    roles: ["IT_ADMIN", "SUB_ADMIN"], // Both can map - SUB_ADMIN limited to DEV/QA environments
  },
  {
    to: "/permission-detail",
    label: "Permission Details",
    icon: Lock,
    roles: ["IT_ADMIN", "SUB_ADMIN"], // Both can view permission details
  },
]

export default function Sidebar() {
  const user = useAuthStore((state) => state.user)

  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles) return true
    if (!user) return false
    return item.roles.includes(user.userRole)
  })

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground">FMG RBAC</h1>
        <p className="text-sm text-muted-foreground">Access Control System</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-medium">Demo Mode</p>
          <p className="text-xs text-muted-foreground mt-1">
            This is a prototype demonstration
          </p>
        </div>
      </div>
    </div>
  )
}
