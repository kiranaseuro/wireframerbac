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
    <div className="space-y-6">
      {/* Header with Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()}, {user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's your access overview for today
            {user.userRole === "super_admin" && (
              <Badge variant="destructive" className="ml-2">
                Super Admin
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
            onClick={() => navigate("/request-access")}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Request Access
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/my-access")}
          >
            <Shield className="mr-2 h-4 w-4" />
            View My Access
          </Button>

          {isManager && (
            <Button
              variant="outline"
              onClick={() => navigate("/approvals")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Review Approvals
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="outline"
              onClick={() => navigate("/users")}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          )}

          {user.userRole === "super_admin" && (
            <Button
              variant="outline"
              onClick={() => navigate("/super-admin")}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              Super Admin
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity / Requests */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Your latest access requests</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-requests")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockData.requests
                .filter((r) => r.requesterId === user.id)
                .slice(0, 5)
                .map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigate("/my-requests")}
                  >
                    <div className="flex items-center gap-2">
                      {request.status === "approved" ? <CheckCircle className="h-4 w-4" /> :
                       request.status === "rejected" ? <AlertCircle className="h-4 w-4" /> :
                       <Clock className="h-4 w-4" />}
                      <div>
                        <p className="text-sm font-medium">{request.itemName}</p>
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent requests
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {isManager && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>Requests awaiting your review</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/approvals")}>
                  Review All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockData.requests
                  .filter((r) => r.status === "pending")
                  .slice(0, 5)
                  .map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => navigate("/approvals")}
                    >
                      <div>
                        <p className="text-sm font-medium">{request.requesterName}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.itemName}
                        </p>
                      </div>
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        navigate("/approvals");
                      }}>
                        Review
                      </Button>
                    </div>
                  ))}
                {mockData.requests.filter((r) => r.status === "pending").length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No pending approvals
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isAuditor && !isManager && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>System Activity</CardTitle>
                  <CardDescription>Recent audit events</CardDescription>
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

      {/* System Alerts */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">3 access certifications due this month</span>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => navigate("/reports")}>
                Review
              </Button>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-muted" onClick={() => navigate("/audit-logs")}>
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">All systems synchronized successfully</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md cursor-pointer hover:bg-muted" onClick={() => navigate("/reports")}>
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Access request processing time improved by 40%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
