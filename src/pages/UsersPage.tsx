import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
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

  // Dialog states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)

  // Form state for Add User
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    title: "",
    userRole: "end_user",
    status: "active"
  })

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
        u.userRole === "IT_ADMIN" || u.userRole === "SUB_ADMIN"
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
      u.userRole === "IT_ADMIN" || u.userRole === "SUB_ADMIN"
    ).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-muted text-foreground border"
      case "inactive":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      case "suspended":
        return "bg-muted text-foreground border"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getRoleColor = (role: string) => {
    if (role === "IT_ADMIN") return "bg-red-500/10 text-red-600 border-red-200"
    if (role === "SUB_ADMIN") return "bg-orange-500/10 text-orange-600 border-orange-200"
    if (role === "AUDITOR") return "bg-blue-500/10 text-blue-600 border-blue-200"
    if (role === "auditor" || role === "audit_viewer") return "bg-muted text-foreground border"
    return "bg-gray-500/10 text-gray-600 border-gray-200"
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight    text-foreground">
            User Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage users, roles, and access permissions across the organization
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              // Export users to CSV
              const csv = [
                ["Name", "Email", "Department", "Title", "Role", "Status"].join(","),
                ...filteredUsers.map(u => [
                  u.fullName,
                  u.email,
                  u.department,
                  u.title,
                  u.userRole,
                  u.status
                ].join(","))
              ].join("\n")
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'users.csv'
              a.click()
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="lg"
            onClick={() => setIsAddUserOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Users className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <UserCheck className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <TrendingUp className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Added in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administrators</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Shield className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.admins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Admin & Super Admin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border">
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
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.slice(1).map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.slice(1).map((role) => (
                  <SelectItem key={role} value={role}>{role.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
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
          <Card className="border">
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
                              <Avatar className="h-10 w-10   ">
                                <AvatarFallback className="text-white font-semibold">
                                  {getInitials(user.fullName)}
                                </AvatarFallback>
                              </Avatar>
                              {user.mfaEnabled && (
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-muted border border-white flex items-center justify-center">
                                  <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{user.fullName}</p>
                                {user.userRole === "IT_ADMIN" && (
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
                            <div className="rounded-full p-1.5 bg-muted">
                              <Building2 className="h-3 w-3 text-foreground" />
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setIsViewDetailsOpen(true)
                              }}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                alert(`More options for: ${user.fullName}\n\n- Edit User\n- Deactivate User\n- Reset Password\n- View Activity Log`)
                              }}
                            >
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
      <Card className="border border bg-muted dark:bg-muted">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <UserCog className="mr-2 h-5 w-5 text-foreground" />
            User Management Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Use department and role filters to quickly find specific user groups</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Green checkmark badge indicates MFA-enabled accounts for enhanced security</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Export user data for compliance reporting and auditing purposes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Monitor inactive users and last login times to maintain security hygiene</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with role and department assignment
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john.doe@company.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.filter(d => d !== "all").map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newUser.title}
                  onChange={(e) => setNewUser({ ...newUser, title: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userRole">User Role</Label>
                <Select value={newUser.userRole} onValueChange={(value) => setNewUser({ ...newUser, userRole: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="end_user">End User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="dept_admin">Department Admin</SelectItem>
                    <SelectItem value="IT_ADMIN">IT Administrator</SelectItem>
                    <SelectItem value="SUB_ADMIN">Sub Administrator (DEV/QA Only)</SelectItem>
                    <SelectItem value="AUDITOR">Auditor</SelectItem>
                    <SelectItem value="APP1_PROD_VIEWER">APP1 Production Viewer</SelectItem>
                    <SelectItem value="APP1_DEV_DEVELOPER">APP1 Development Developer</SelectItem>
                    <SelectItem value="APP2_QA_TESTER">APP2 QA Tester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Creating user:", newUser)
              alert(`User ${newUser.firstName} ${newUser.lastName} created successfully!`)
              setIsAddUserOpen(false)
              setNewUser({
                firstName: "",
                lastName: "",
                email: "",
                department: "",
                title: "",
                userRole: "end_user",
                status: "active"
              })
            }}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedUser.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p className="text-sm">{selectedUser.department}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm">{selectedUser.phone || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">User Role</Label>
                  <Badge>{selectedUser.userRole.replace("_", " ")}</Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant={selectedUser.status === "active" ? "default" : "secondary"}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Last Login</Label>
                  <p className="text-sm">{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : "Never"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
