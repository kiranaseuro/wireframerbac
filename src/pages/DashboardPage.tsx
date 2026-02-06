import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Shield,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowRight,
  ShieldAlert,
  Lock
} from "lucide-react"

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const mockData = useAuthStore((state) => state.mockData)
  const navigate = useNavigate()

  if (!user) return null

  const isAdmin = ["super_admin", "dept_admin", "role_admin"].includes(user.userRole)
  const isManager = ["manager", ...["super_admin", "dept_admin"]].includes(user.userRole)
  const isAuditor = ["audit_viewer", "super_admin"].includes(user.userRole)

  // Stats for different roles
  const myAccessCount = 12
  const pendingRequestsCount = mockData.requests.filter((r) => r.status === "pending").length
  const pendingApprovalsCount = isManager
    ? mockData.requests.filter((r) => r.status === "pending").length
    : 0

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
    {
      title: "Pending Requests",
      value: pendingRequestsCount,
      description: "Awaiting approval",
      icon: Clock,
      trend: "2 urgent",
      trendUp: false,
      color: "bg-orange-500/10 text-orange-600",
      iconColor: "text-orange-600"
    },
    ...(isManager ? [{
      title: "Approvals Needed",
      value: pendingApprovalsCount,
      description: "Require your action",
      icon: FileCheck,
      trend: "Action needed",
      trendUp: false,
      color: "bg-purple-500/10 text-purple-600",
      iconColor: "text-purple-600"
    }] : []),
    ...(isAdmin ? [{
      title: "Total Users",
      value: mockData.users.length,
      description: "Active in system",
      icon: Users,
      trend: "+23 this month",
      trendUp: true,
      color: "bg-green-500/10 text-green-600",
      iconColor: "text-green-600"
    }] : [])
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Greeting */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {getGreeting()}, {user.firstName}!
          </h1>
          <p className="text-lg text-muted-foreground flex items-center space-x-2">
            <span>Here's your access overview for today</span>
            {user.userRole === "super_admin" && (
              <Badge variant="destructive" className="ml-2">
                <ShieldAlert className="mr-1 h-3 w-3" />
                Super Admin
              </Badge>
            )}
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm font-medium">{user.department}</div>
            <div className="text-xs text-muted-foreground">{user.title}</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {user.firstName[0]}{user.lastName[0]}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] border-2 group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-full p-2 ${stat.color}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {stat.description}
                </p>
                <div className="flex items-center space-x-1">
                  <ArrowUpRight className={`h-3 w-3 ${stat.trendUp ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-orange-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions - Enhanced */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used actions for faster workflow</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all hover:scale-[1.02] hover:shadow-md border-2"
            onClick={() => navigate("/request-access")}
          >
            <FileCheck className="h-6 w-6 mb-2 text-blue-600" />
            <span className="font-semibold">Request Access</span>
            <span className="text-xs text-muted-foreground">Submit new request</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all hover:scale-[1.02] hover:shadow-md border-2"
            onClick={() => navigate("/my-access")}
          >
            <Shield className="h-6 w-6 mb-2 text-purple-600" />
            <span className="font-semibold">View My Access</span>
            <span className="text-xs text-muted-foreground">Current permissions</span>
          </Button>

          {isManager && (
            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-green-50 dark:hover:bg-green-950 transition-all hover:scale-[1.02] hover:shadow-md border-2"
              onClick={() => navigate("/approvals")}
            >
              <CheckCircle className="h-6 w-6 mb-2 text-green-600" />
              <span className="font-semibold">Review Approvals</span>
              <span className="text-xs text-muted-foreground">{pendingApprovalsCount} pending</span>
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-red-50 dark:hover:bg-red-950 transition-all hover:scale-[1.02] hover:shadow-md border-2"
              onClick={() => navigate("/users")}
            >
              <Users className="h-6 w-6 mb-2 text-red-600" />
              <span className="font-semibold">Manage Users</span>
              <span className="text-xs text-muted-foreground">User administration</span>
            </Button>
          )}

          {user.userRole === "super_admin" && (
            <Button
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-orange-50 dark:hover:bg-orange-950 transition-all hover:scale-[1.02] hover:shadow-md border-2"
              onClick={() => navigate("/super-admin")}
            >
              <ShieldAlert className="h-6 w-6 mb-2 text-orange-600" />
              <span className="font-semibold">Super Admin</span>
              <span className="text-xs text-muted-foreground">System overview</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity / Requests - Enhanced */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-blue-600" />
                  Recent Requests
                </CardTitle>
                <CardDescription>Your latest access requests</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-requests")}>
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.requests
                .filter((r) => r.requesterId === user.id)
                .slice(0, 5)
                .map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        request.status === "approved" ? "bg-green-500/10" :
                        request.status === "rejected" ? "bg-red-500/10" :
                        "bg-orange-500/10"
                      }`}>
                        {request.status === "approved" ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                         request.status === "rejected" ? <AlertCircle className="h-5 w-5 text-red-600" /> :
                         <Clock className="h-5 w-5 text-orange-600" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{request.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))}
              {mockData.requests.filter((r) => r.requesterId === user.id).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No recent requests</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {isManager && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileCheck className="mr-2 h-5 w-5 text-purple-600" />
                    Pending Approvals
                  </CardTitle>
                  <CardDescription>Requests awaiting your review</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/approvals")}>
                  Review All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.requests
                  .filter((r) => r.status === "pending")
                  .slice(0, 5)
                  .map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                          {request.requesterName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">{request.requesterName}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.itemName}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => navigate("/approvals")}>
                        Review
                      </Button>
                    </div>
                  ))}
                {mockData.requests.filter((r) => r.status === "pending").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No pending approvals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isAuditor && !isManager && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-indigo-600" />
                    System Activity
                  </CardTitle>
                  <CardDescription>Recent audit events</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/audit-logs")}>
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-semibold">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.userName} • {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant={log.result === "success" ? "default" : "destructive"}>
                      {log.result}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* System Alerts - Enhanced */}
      {isAdmin && (
        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-yellow-600" />
              System Alerts
            </CardTitle>
            <CardDescription>Important notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border-2 border-yellow-300 bg-yellow-100 p-4 text-yellow-900 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 transition-all hover:scale-[1.01]">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">3 access certifications due this month</span>
              <Button variant="ghost" size="sm" className="ml-auto">
                Review
              </Button>
            </div>
            <div className="flex items-center gap-3 rounded-lg border-2 border-green-300 bg-green-100 p-4 text-green-900 dark:border-green-700 dark:bg-green-950 dark:text-green-400 transition-all hover:scale-[1.01]">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">All systems synchronized successfully</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border-2 border-blue-300 bg-blue-100 p-4 text-blue-900 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-400 transition-all hover:scale-[1.01]">
              <TrendingUp className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Access request processing time improved by 40%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
