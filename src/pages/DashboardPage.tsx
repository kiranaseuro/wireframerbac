import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Shield,
  FileText,
  CheckCircle,
  TrendingUp,
  ShieldAlert,
  Lock
} from "lucide-react"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const mockData = useAuthStore((state) => state.mockData)
  const navigate = useNavigate()

  if (!user) return null

  // RGD-Compliant Role Checks (Section 7.1)
  const isITAdmin = user.userRole === "IT_ADMIN"
  const isSubAdmin = user.userRole === "SUB_ADMIN"
  const isAuditor = user.userRole === "AUDITOR"
  const isAdmin = isITAdmin || isSubAdmin

  // Stats for different roles
  const myAccessCount = 12

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  const stats = [
    {
      title: "My Access",
      value: myAccessCount,
      description: "Active roles & permissions",
      icon: Shield,
      trend: "+2 this week",
      trendUp: true,
      color: "bg-blue-500/10 text-blue-600",
      iconColor: "text-blue-600"
    },
    ...(isAdmin ? [{
      title: "Total Users",
      value: mockData.users.filter(u => u.status === "active").length,
      description: "Active in system",
      icon: Users,
      trend: `+${mockData.users.filter(u => u.adSynced).length} from AD`,
      trendUp: true,
      color: "bg-green-500/10 text-green-600",
      iconColor: "text-green-600"
    }] : []),
    ...(isAdmin ? [{
      title: "Total Roles",
      value: mockData.roles.filter(r => r.status === "active").length,
      description: "Active roles",
      icon: Shield,
      trend: "3 IT_ADMIN, 12 SUB_ADMIN",
      trendUp: true,
      color: "bg-purple-500/10 text-purple-600",
      iconColor: "text-purple-600"
    }] : []),
    ...(isAdmin ? [{
      title: "Permissions",
      value: mockData.permissions.length,
      description: "Environment-based",
      icon: Lock,
      trend: "DEV, QA, UAT, PROD",
      trendUp: true,
      color: "bg-orange-500/10 text-orange-600",
      iconColor: "text-orange-600"
    }] : [])
  ]

  return (
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's your access overview for today
            {isITAdmin && (
              <Badge variant="destructive" className="ml-2">
                IT Administrator
              </Badge>
            )}
            {isSubAdmin && (
              <Badge variant="secondary" className="ml-2">
                Sub Administrator (DEV/QA Only)
              </Badge>
            )}
            {isAuditor && (
              <Badge variant="outline" className="ml-2">
                Auditor
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions for faster workflow</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            onClick={() => navigate("/my-access")}
          >
            <Shield className="mr-2 h-4 w-4" />
            View My Access
          </Button>

          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate("/users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          )}

          {isITAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate("/permissions")}
            >
              <Lock className="mr-2 h-4 w-4" />
              Manage Permissions
            </Button>
          )}

          {(isAuditor || isITAdmin) && (
            <Button
              variant="outline"
              onClick={() => navigate("/audit-logs")}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Audit Logs
            </Button>
          )}

          {isITAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate("/super-admin")}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              Super Admin Dashboard
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Environment Access Overview - RGD Section 8.5 */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Access Overview</CardTitle>
            <CardDescription>Your access levels across different environments (RGD Section 8.1)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="text-sm font-medium">Development (DEV)</p>
                  <p className="text-xs text-muted-foreground">Active development environment</p>
                </div>
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {isAdmin ? "Full Access" : "No Access"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="text-sm font-medium">Quality Assurance (QA)</p>
                  <p className="text-xs text-muted-foreground">Testing and validation environment</p>
                </div>
                <Badge variant={isAdmin ? "default" : "secondary"}>
                  {isAdmin ? "Full Access" : "No Access"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="text-sm font-medium">User Acceptance Testing (UAT)</p>
                  <p className="text-xs text-muted-foreground">Pre-production validation</p>
                </div>
                <Badge variant={isITAdmin ? "default" : "destructive"}>
                  {isITAdmin ? "Full Access" : "⛔ BLOCKED (SUB_ADMIN)"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="text-sm font-medium">Production (PROD)</p>
                  <p className="text-xs text-muted-foreground">Live production environment</p>
                </div>
                <Badge variant={isITAdmin ? "default" : "destructive"}>
                  {isITAdmin ? "Full Access" : "⛔ BLOCKED (SUB_ADMIN)"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity for Auditors */}
      {(isAuditor || isITAdmin) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Audit Activity</CardTitle>
                <CardDescription>Latest system events (RGD Section 11)</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/audit-logs")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockData.auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => navigate("/audit-logs")}
                >
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.userName} • {new Date(log.timestamp).toLocaleTimeString()}
                      {log.environment && ` • ${log.environment}`}
                    </p>
                  </div>
                  <Badge variant={log.result === "success" ? "default" : log.result === "denied" ? "destructive" : "secondary"}>
                    {log.result}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Alerts */}
      {isITAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-muted" onClick={() => navigate("/ad-sync")}>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Active Directory sync completed successfully</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-muted" onClick={() => navigate("/audit-logs")}>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">All authorization checks operational</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-muted" onClick={() => navigate("/reports")}>
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm">System performance: 99.8% uptime this month</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access Request Note - RGD Section 3 (Out of Scope) */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="text-orange-900">Access Requests</CardTitle>
          <CardDescription className="text-orange-700">
            Handled via external HR/IT ticketing systems (RGD Section 3)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-800">
            To request new access or roles, please submit a ticket through your organization's
            HR or IT service desk. IT Administrators will assign approved access directly in this system.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
