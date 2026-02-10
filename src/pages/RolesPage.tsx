import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Shield,
  Key,
  Users,
  TrendingUp,
  Lock,
  CheckCircle2,
  AlertCircle,
  Crown,
  ShieldCheck,
  Edit,
  Copy,
  MoreVertical,
  Download,
  Settings
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function RolesPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)

  // Form state
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    department: "",
    level: "user",
    permissions: [] as string[],
    status: "active"
  })

  // Get unique departments and levels
  const departments = ["all", ...Array.from(new Set(mockData.roles.map((r) => r.department)))]
  const levels = ["all", ...Array.from(new Set(mockData.roles.map((r) => r.level)))]

  // Filter logic
  const filteredRoles = useMemo(() => {
    let filtered = mockData.roles

    // Tab filtering
    if (activeTab === "active") {
      filtered = filtered.filter((r) => r.status === "active")
    } else if (activeTab === "inactive") {
      filtered = filtered.filter((r) => r.status === "inactive")
    } else if (activeTab === "high-privilege") {
      filtered = filtered.filter((r) => r.level === "high" || r.level === "admin")
    }

    // Department filter
    if (filterDepartment !== "all") {
      filtered = filtered.filter((r) => r.department === filterDepartment)
    }

    // Level filter
    if (filterLevel !== "all") {
      filtered = filtered.filter((r) => r.level === filterLevel)
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [mockData.roles, activeTab, filterDepartment, filterLevel, filterStatus, searchQuery])

  // Statistics
  const stats = {
    totalRoles: mockData.roles.length,
    activeRoles: mockData.roles.filter((r) => r.status === "active").length,
    totalPermissions: mockData.roles.reduce((sum, r) => sum + r.permissions.length, 0),
    totalUsers: mockData.roles.reduce((sum, r) => sum + r.userCount, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-muted text-foreground border"
      case "inactive":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      case "deprecated":
        return "bg-muted text-foreground border"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-muted text-foreground border"
      case "high":
        return "bg-muted text-foreground border"
      case "medium":
        return "bg-muted text-foreground border"
      case "low":
        return "bg-muted text-foreground border"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "admin":
        return <Crown className="h-4 w-4" />
      case "high":
        return <ShieldCheck className="h-4 w-4" />
      case "medium":
        return <Shield className="h-4 w-4" />
      case "low":
        return <Lock className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight    text-foreground">
            Role Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Define and manage roles with associated permissions and access levels
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const csv = [
                ["Name", "Description", "Department", "Level", "Permissions", "Status"].join(","),
                ...filteredRoles.map(r => [
                  r.name,
                  r.description,
                  r.department,
                  r.level,
                  r.permissions.length,
                  r.status
                ].join(","))
              ].join("\n")
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'roles.csv'
              a.click()
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="lg"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Shield className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Defined roles in system
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.activeRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in use
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Key className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalPermissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all roles
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Assigned</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Users className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total role assignments
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
                placeholder="Search by role name, description, or code..."
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
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.slice(1).map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
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
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="all">All Roles ({mockData.roles.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.activeRoles})</TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({mockData.roles.filter((r) => r.status === "inactive").length})
          </TabsTrigger>
          <TabsTrigger value="high-privilege">
            High Privilege ({mockData.roles.filter((r) => r.level === "high" || r.level === "admin").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="border hover:shadow-lg transition-all hover:scale-[1.02] group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-12 w-12 rounded-lg    flex items-center justify-center text-white">
                        {getLevelIcon(role.level)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {role.code} • {role.department}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(role.status)} border`}>
                      {role.status === "active" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {role.status === "inactive" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {role.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>

                  {/* Info Blocks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-xs text-muted-foreground">Level</span>
                      <Badge className={`${getLevelColor(role.level)} border text-xs`}>
                        {role.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-xs text-muted-foreground">Users</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-foreground" />
                        <span className="text-sm font-semibold">{role.userCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 col-span-2">
                      <span className="text-xs text-muted-foreground">Permissions</span>
                      <div className="flex items-center gap-1">
                        <Key className="h-3 w-3 text-foreground" />
                        <span className="text-sm font-semibold">{role.permissions.length} permissions</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <span>Created {formatDate(role.createdAt)}</span>
                    {role.parentRoleId && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="mr-1 h-2.5 w-2.5" />
                        Inherited
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedRole(role)
                        setRoleForm({
                          name: role.name,
                          description: role.description,
                          department: role.department,
                          level: role.level,
                          permissions: role.permissions,
                          status: role.status
                        })
                        setIsEditOpen(true)
                      }}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setRoleForm({
                          name: `${role.name} (Copy)`,
                          description: role.description,
                          department: role.department,
                          level: role.level,
                          permissions: role.permissions,
                          status: "active"
                        })
                        setIsCreateOpen(true)
                      }}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Clone
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        alert(`More options for: ${role.name}\n\n- View Details\n- Delete Role\n- Export Role\n- View Audit History`)
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredRoles.length === 0 && (
            <Card className="border">
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No roles found matching your search criteria</p>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredRoles.length}</span> role{filteredRoles.length !== 1 ? 's' : ''}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card className="border border bg-muted dark:bg-muted">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Settings className="mr-2 h-5 w-5 text-foreground" />
            Role Management Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Follow principle of least privilege - grant only necessary permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Use role inheritance to create hierarchical permission structures</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Regularly review high-privilege roles for compliance and security</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Clone existing roles to quickly create similar permission sets</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Create/Clone Role Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{roleForm.name.includes("(Copy)") ? "Clone Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions and access levels
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                placeholder="e.g., Senior Developer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                placeholder="Describe the role and its responsibilities..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={roleForm.department} onValueChange={(value) => setRoleForm({ ...roleForm, department: value })}>
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
                <Label htmlFor="level">Access Level</Label>
                <Select value={roleForm.level} onValueChange={(value) => setRoleForm({ ...roleForm, level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto">
                {mockData.permissions.slice(0, 10).map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={perm.id}
                      checked={roleForm.permissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, perm.id] })
                        } else {
                          setRoleForm({ ...roleForm, permissions: roleForm.permissions.filter(p => p !== perm.id) })
                        }
                      }}
                      className="h-4 w-4 rounded border-input"
                    />
                    <label htmlFor={perm.id} className="text-sm cursor-pointer flex-1">
                      {perm.name}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {roleForm.permissions.length} permission(s) selected
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false)
              setRoleForm({
                name: "",
                description: "",
                department: "",
                level: "user",
                permissions: [],
                status: "active"
              })
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Creating role:", roleForm)
              alert(`Role "${roleForm.name}" created successfully with ${roleForm.permissions.length} permissions!`)
              setIsCreateOpen(false)
              setRoleForm({
                name: "",
                description: "",
                department: "",
                level: "user",
                permissions: [],
                status: "active"
              })
            }}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify role settings and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editRoleName">Role Name</Label>
              <Input
                id="editRoleName"
                value={roleForm.name}
                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <Select value={roleForm.department} onValueChange={(value) => setRoleForm({ ...roleForm, department: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.filter(d => d !== "all").map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLevel">Access Level</Label>
                <Select value={roleForm.level} onValueChange={(value) => setRoleForm({ ...roleForm, level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select value={roleForm.status} onValueChange={(value) => setRoleForm({ ...roleForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-48 overflow-y-auto">
                {mockData.permissions.slice(0, 10).map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`edit-${perm.id}`}
                      checked={roleForm.permissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRoleForm({ ...roleForm, permissions: [...roleForm.permissions, perm.id] })
                        } else {
                          setRoleForm({ ...roleForm, permissions: roleForm.permissions.filter(p => p !== perm.id) })
                        }
                      }}
                      className="h-4 w-4 rounded border-input"
                    />
                    <label htmlFor={`edit-${perm.id}`} className="text-sm cursor-pointer flex-1">
                      {perm.name}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {roleForm.permissions.length} permission(s) selected
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Updating role:", roleForm)
              alert(`Role "${roleForm.name}" updated successfully!`)
              setIsEditOpen(false)
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
