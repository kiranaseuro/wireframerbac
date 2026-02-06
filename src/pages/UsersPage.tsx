import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  UserCog,
  Shield,
  Mail,
  Clock,
  Download,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Building2,
  Phone
} from "lucide-react"
import { getInitials, formatDate } from "@/lib/utils"

export default function UsersPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Get unique departments and roles
  const departments = ["all", ...Array.from(new Set(mockData.users.map((u) => u.department)))]
  const roles = ["all", ...Array.from(new Set(mockData.users.map((u) => u.userRole)))]

  // Filter logic
  const filteredUsers = useMemo(() => {
    let filtered = mockData.users

    // Tab filtering
    if (activeTab === "active") {
      filtered = filtered.filter((u) => u.status === "active")
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((u) => u.status === "inactive")
    } else if (activeTab === "admins") {
      filtered = filtered.filter((u) =>
        u.userRole.includes("admin") || u.userRole === "super_admin"
      )
    }

    // Department filter
    if (filterDepartment !== "all") {
      filtered = filtered.filter((u) => u.department === filterDepartment)
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.userRole === filterRole)
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((u) => u.status === filterStatus)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((u) =>
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [mockData.users, activeTab, filterDepartment, filterRole, filterStatus, searchQuery])

  // Statistics
  const stats = {
    totalUsers: mockData.users.length,
    activeUsers: mockData.users.filter((u) => u.status === "active").length,
    newThisMonth: mockData.users.filter((u) => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(u.createdAt) > thirtyDaysAgo
    }).length,
    admins: mockData.users.filter((u) =>
      u.userRole.includes("admin") || u.userRole === "super_admin"
    ).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "inactive":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      case "suspended":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getRoleColor = (role: string) => {
    if (role === "super_admin") return "bg-red-500/10 text-red-600 border-red-200"
    if (role.includes("admin")) return "bg-purple-500/10 text-purple-600 border-purple-200"
    if (role === "manager") return "bg-blue-500/10 text-blue-600 border-blue-200"
    if (role === "auditor" || role === "audit_viewer") return "bg-orange-500/10 text-orange-600 border-orange-200"
    return "bg-gray-500/10 text-gray-600 border-gray-200"
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage users, roles, and access permissions across the organization
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="rounded-full p-2 bg-indigo-500/10">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <div className="rounded-full p-2 bg-blue-500/10">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Added in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <div className="rounded-full p-2 bg-purple-500/10">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.admins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Admin & Super Admin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, department, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Departments</option>
              {departments.slice(1).map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Roles</option>
              {roles.slice(1).map((role) => (
                <option key={role} value={role}>{role.replace("_", " ")}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="all">All Users ({mockData.users.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.activeUsers})</TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({mockData.users.filter((u) => u.status === "inactive").length})
          </TabsTrigger>
          <TabsTrigger value="admins">Admins ({stats.admins})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Last Login</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.slice(0, 50).map((user) => (
                      <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-500">
                                <AvatarFallback className="text-white font-semibold">
                                  {getInitials(user.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              {user.mfaEnabled && (
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                                  <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{user.fullName}</p>
                                {user.userRole === "super_admin" && (
                                  <Badge variant="destructive" className="text-xs">
                                    <Shield className="mr-1 h-2.5 w-2.5" />
                                    Super Admin
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{user.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-xs">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full p-1.5 bg-blue-500/10">
                              <Building2 className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-sm">{user.department}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${getRoleColor(user.userRole)} border`}>
                            {user.userRole.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${getStatusColor(user.status)} border`}>
                            {user.status === "active" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {user.status === "inactive" && <XCircle className="mr-1 h-3 w-3" />}
                            {user.status === "suspended" && <AlertCircle className="mr-1 h-3 w-3" />}
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(filteredUsers.length, 50)}</span> of{" "}
              <span className="font-medium">{filteredUsers.length}</span> users
            </div>
            {filteredUsers.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                No users found matching your filters
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card className="border-2 border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <UserCog className="mr-2 h-5 w-5 text-indigo-600" />
            User Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5" />
              <span>Use department and role filters to quickly find specific user groups</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5" />
              <span>Green checkmark badge indicates MFA-enabled accounts for enhanced security</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5" />
              <span>Export user data for compliance reporting and auditing purposes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5" />
              <span>Monitor inactive users and last login times to maintain security hygiene</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
