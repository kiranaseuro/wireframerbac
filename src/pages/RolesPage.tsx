import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Building2,
  ShieldCheck,
  Edit,
  Copy,
  Trash2,
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
        return "bg-green-500/10 text-green-600 border-green-200"
      case "inactive":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      case "deprecated":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "admin":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "medium":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "low":
        return "bg-green-500/10 text-green-600 border-green-200"
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
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-sky-600 bg-clip-text text-transparent">
            Role Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Define and manage roles with associated permissions and access levels
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <div className="rounded-full p-2 bg-cyan-500/10">
              <Shield className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Defined roles in system
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Roles</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activeRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in use
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <div className="rounded-full p-2 bg-purple-500/10">
              <Key className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.totalPermissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all roles
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Assigned</CardTitle>
            <div className="rounded-full p-2 bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total role assignments
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
                placeholder="Search by role name, description, or code..."
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
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Levels</option>
              {levels.slice(1).map((level) => (
                <option key={level} value={level}>{level}</option>
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
              <option value="deprecated">Deprecated</option>
            </select>
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
              <Card key={role.id} className="border-2 hover:shadow-lg transition-all hover:scale-[1.02] group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center text-white">
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
                        <Users className="h-3 w-3 text-blue-600" />
                        <span className="text-sm font-semibold">{role.userCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 col-span-2">
                      <span className="text-xs text-muted-foreground">Permissions</span>
                      <div className="flex items-center gap-1">
                        <Key className="h-3 w-3 text-purple-600" />
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
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="mr-1 h-3 w-3" />
                      Clone
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredRoles.length === 0 && (
            <Card className="border-2">
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
      <Card className="border-2 border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Settings className="mr-2 h-5 w-5 text-cyan-600" />
            Role Management Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5" />
              <span>Follow principle of least privilege - grant only necessary permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5" />
              <span>Use role inheritance to create hierarchical permission structures</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5" />
              <span>Regularly review high-privilege roles for compliance and security</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5" />
              <span>Clone existing roles to quickly create similar permission sets</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
