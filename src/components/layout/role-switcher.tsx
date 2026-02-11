import { useAuthStore } from "@/stores/auth-store"
import { demoUsers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, RefreshCw, Shield, Eye, UserCog } from "lucide-react"
import type { UserRole } from "@/types"

interface RoleOption {
  email: string
  name: string
  role: UserRole
  icon: React.ElementType
  badge: string
  badgeVariant: "destructive" | "default" | "secondary" | "outline"
  description: string
}

const roleOptions: RoleOption[] = [
  {
    email: "alice.admin@fmg.com",
    name: "Alice Admin",
    role: "IT_ADMIN",
    icon: ShieldCheck,
    badge: "IT Administrator",
    badgeVariant: "destructive",
    description: "Full access to all environments (DEV, QA, UAT, PROD)"
  },
  {
    email: "bob.developer@fmg.com",
    name: "Bob Developer",
    role: "SUB_ADMIN",
    icon: Shield,
    badge: "Sub Administrator",
    badgeVariant: "default",
    description: "Limited to DEV & QA only (UAT/PROD blocked)"
  },
  {
    email: "charlie.auditor@fmg.com",
    name: "Charlie Auditor",
    role: "AUDITOR",
    icon: Eye,
    badge: "Auditor",
    badgeVariant: "secondary",
    description: "Read-only access to audit logs and reports"
  },
  {
    email: "diana.viewer@fmg.com",
    name: "Diana Viewer",
    role: "APP1_PROD_VIEWER",
    icon: UserCog,
    badge: "APP1 Production Viewer",
    badgeVariant: "outline",
    description: "Read-only access to APP1 in production"
  }
]

export default function RoleSwitcher() {
  const user = useAuthStore((state) => state.user)
  const switchRole = useAuthStore((state) => state.switchRole)

  if (!user) return null

  const currentRole = roleOptions.find(r => r.role === user.userRole)
  const Icon = currentRole?.icon || ShieldCheck

  const handleRoleSwitch = (email: string) => {
    const selectedUser = demoUsers.find(u => u.email === email)
    if (selectedUser) {
      switchRole(selectedUser.userRole)
      // Force page reload to ensure all components update
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-dashed border-orange-300">
      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-300">
        DEMO MODE
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 hover:bg-muted"
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{currentRole?.badge || user.userRole}</span>
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Switch Test Role
            </div>
            <p className="text-xs font-normal text-muted-foreground mt-1">
              Test different role permissions and UI restrictions
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {roleOptions.map((option) => {
            const OptionIcon = option.icon
            const isCurrentRole = option.role === user.userRole

            return (
              <DropdownMenuItem
                key={option.email}
                onClick={() => handleRoleSwitch(option.email)}
                className={`cursor-pointer p-3 ${isCurrentRole ? 'bg-muted' : ''}`}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    isCurrentRole ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <OptionIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{option.name}</span>
                      {isCurrentRole && (
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <Badge variant={option.badgeVariant} className="text-xs mb-1">
                      {option.badge}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuSeparator />
          <div className="p-2">
            <p className="text-xs text-muted-foreground">
              💡 Switch roles to test environment restrictions and UI differences
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
