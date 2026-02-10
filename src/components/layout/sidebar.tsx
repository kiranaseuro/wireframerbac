import { NavLink } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Key,
  FileCheck,
  ClipboardList,
  CheckSquare,
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
  {
    to: "/request-access",
    label: "Request Access",
    icon: FileCheck,
  },
  {
    to: "/my-requests",
    label: "My Requests",
    icon: ClipboardList,
  },
  {
    to: "/approvals",
    label: "Approvals",
    icon: CheckSquare,
    roles: ["manager", "dept_admin", "super_admin"],
  },
  {
    to: "/users",
    label: "Users",
    icon: Users,
    roles: ["dept_admin", "super_admin", "help_desk"],
  },
  {
    to: "/roles",
    label: "Roles",
    icon: Shield,
    roles: ["role_admin", "super_admin"],
  },
  {
    to: "/permissions",
    label: "Permissions",
    icon: Lock,
    roles: ["permission_admin", "super_admin"],
  },
  {
    to: "/groups",
    label: "Groups",
    icon: UserCog,
    roles: ["super_admin", "dept_admin"],
  },
  {
    to: "/audit-logs",
    label: "Audit Logs",
    icon: FileText,
    roles: ["audit_viewer", "super_admin"],
  },
  {
    to: "/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["manager", "dept_admin", "audit_viewer", "super_admin"],
  },
  {
    to: "/super-admin",
    label: "Super Admin",
    icon: ShieldAlert,
    roles: ["super_admin"],
  },
  {
    to: "/ad-sync",
    label: "AD Sync",
    icon: RefreshCw,
    roles: ["super_admin"],
  },
  {
    to: "/group-mapping",
    label: "Group Mapping",
    icon: Settings,
    roles: ["super_admin"],
  },
  {
    to: "/permission-detail",
    label: "Permission Details",
    icon: Lock,
    roles: ["super_admin", "permission_admin"],
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
