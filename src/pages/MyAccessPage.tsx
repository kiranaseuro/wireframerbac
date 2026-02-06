import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Search,
  Shield,
  Key,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  FileText,
  Download,
  Filter
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { generateAccessItems } from "@/lib/mock-data"

export default function MyAccessPage() {
  const user = useAuthStore((state) => state.user)
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")

  const accessItems = generateAccessItems(15)
  const myRoles = mockData.roles.slice(0, 5)
  const myPermissions = mockData.permissions.slice(0, 12)

  // Filter logic
  const filteredAccessItems = useMemo(() => {
    let filtered = accessItems

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType)
    }

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [accessItems, filterType, searchQuery])

  // Statistics
  const stats = {
    totalRoles: myRoles.length,
    totalPermissions: myPermissions.length,
    activeAccess: accessItems.filter((item) => item.status === "active").length,
    expiringSoon: accessItems.filter((item) => item.status === "expiring_soon").length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "expiring_soon":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      case "expired":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            My Access
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your roles, permissions, and application access
          </p>
        </div>
        <Button variant="outline" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Roles</CardTitle>
            <div className="rounded-full p-2 bg-purple-500/10">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active role assignments
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <div className="rounded-full p-2 bg-blue-500/10">
              <Key className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPermissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Granted permissions
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Access</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activeAccess}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <div className="rounded-full p-2 bg-orange-500/10">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Need renewal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles, permissions, or applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Types</option>
              <option value="role">Roles</option>
              <option value="permission">Permissions</option>
              <option value="application">Applications</option>
            </select>
            <Button variant="outline" className="h-11">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roles">Roles ({myRoles.length})</TabsTrigger>
          <TabsTrigger value="permissions">Permissions ({myPermissions.length})</TabsTrigger>
          <TabsTrigger value="all">All Access ({filteredAccessItems.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* User Info Card */}
          <Card className="border-2 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white font-bold text-2xl">
                  {user?.firstName[0]}{user?.lastName[0]}
                </div>
                <div>
                  <CardTitle className="text-2xl">{user?.fullName}</CardTitle>
                  <CardDescription className="text-base">
                    {user?.title} • {user?.department}
                  </CardDescription>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="default">{user?.userRole}</Badge>
                    <Badge variant="outline">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      MFA Enabled
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Access Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Roles */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-600" />
                  My Roles
                </CardTitle>
                <CardDescription>Your current role assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {myRoles.slice(0, 3).map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {role.permissions.length} permissions • {role.level}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{role.status}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("roles")}>
                  View All Roles
                </Button>
              </CardContent>
            </Card>

            {/* Recent Permissions */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5 text-blue-600" />
                  Top Permissions
                </CardTitle>
                <CardDescription>Most recently granted permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {myPermissions.slice(0, 3).map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {permission.application}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {permission.type}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("permissions")}>
                  View All Permissions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myRoles.map((role) => (
              <Card key={role.id} className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.department}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={role.status === "active" ? "default" : "secondary"}>
                      {role.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Level</span>
                      <Badge variant="outline">{role.level}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Permissions</span>
                      <span className="font-semibold">{role.permissions.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <span className="text-sm text-muted-foreground">Granted</span>
                      <span className="text-sm">{formatDate(role.createdAt)}</span>
                    </div>
                    {role.parentRoleId && (
                      <div className="flex items-center space-x-2 p-2 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-blue-600">Inherited Role</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="mt-6">
          <Card className="border-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Permission</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Application</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Classification</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {myPermissions.map((permission) => (
                      <tr key={permission.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
                              <Lock className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{permission.name}</div>
                              <div className="text-xs text-muted-foreground">{permission.resource}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">{permission.application}</td>
                        <td className="px-4 py-4">
                          <Badge variant="outline">{permission.type}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            variant={
                              permission.dataClassification === "restricted" ? "destructive" :
                              permission.dataClassification === "confidential" ? "default" :
                              "secondary"
                            }
                          >
                            {permission.dataClassification}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="default" className="bg-green-600">
                            Active
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Access Tab */}
        <TabsContent value="all" className="mt-6">
          <Card className="border-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Granted Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Expires</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAccessItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline">{item.type}</Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {formatDate(item.grantedDate)}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {item.expiresDate ? formatDate(item.expiresDate) : (
                            <Badge variant="secondary" className="text-xs">Never</Badge>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${getStatusColor(item.status)} border`}>
                            {item.status === "active" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {item.status === "expiring_soon" && <Clock className="mr-1 h-3 w-3" />}
                            {item.status === "expired" && <AlertCircle className="mr-1 h-3 w-3" />}
                            {item.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">{item.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
