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
  Key,
  Lock,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Eye,
  Edit3,
  FileText,
  Database,
  Settings,
  Download,
  Filter,
  MoreVertical,
  Code,
  Layers
} from "lucide-react"

export default function PermissionsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterApplication, setFilterApplication] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterClassification, setFilterClassification] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Get unique applications and types
  const applications = ["all", ...Array.from(new Set(mockData.permissions.map((p) => p.application)))]
  const types = ["all", ...Array.from(new Set(mockData.permissions.map((p) => p.type)))]

  // Filter logic
  const filteredPermissions = useMemo(() => {
    let filtered = mockData.permissions

    // Tab filtering
    if (activeTab === "high-risk") {
      filtered = filtered.filter((p) => p.dataClassification === "restricted" || p.dataClassification === "confidential")
    } else if (activeTab === "read-only") {
      filtered = filtered.filter((p) => p.type === "read")
    } else if (activeTab === "write-access") {
      filtered = filtered.filter((p) => p.type === "write" || p.type === "delete")
    }

    // Application filter
    if (filterApplication !== "all") {
      filtered = filtered.filter((p) => p.application === filterApplication)
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.type === filterType)
    }

    // Classification filter
    if (filterClassification !== "all") {
      filtered = filtered.filter((p) => p.dataClassification === filterClassification)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.application.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [mockData.permissions, activeTab, filterApplication, filterType, filterClassification, searchQuery])

  // Statistics
  const stats = {
    totalPermissions: mockData.permissions.length,
    activePermissions: mockData.permissions.length, // Assuming all are active
    highRisk: mockData.permissions.filter((p) => p.dataClassification === "restricted" || p.dataClassification === "confidential").length,
    applications: Array.from(new Set(mockData.permissions.map((p) => p.application))).length
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "public":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "internal":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "confidential":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "restricted":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "read":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "write":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "delete":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "execute":
        return "bg-purple-500/10 text-purple-600 border-purple-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "read":
        return <Eye className="h-3 w-3" />
      case "write":
        return <Edit3 className="h-3 w-3" />
      case "delete":
        return <AlertTriangle className="h-3 w-3" />
      case "execute":
        return <Settings className="h-3 w-3" />
      default:
        return <Key className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Permission Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure and manage granular permissions across all applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Permission
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <div className="rounded-full p-2 bg-amber-500/10">
              <Key className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPermissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Defined in system
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.activePermissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in use
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <div className="rounded-full p-2 bg-red-500/10">
              <ShieldAlert className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.highRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Restricted/Confidential
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <div className="rounded-full p-2 bg-purple-500/10">
              <Layers className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.applications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Integrated systems
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
                placeholder="Search by name, code, application, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <select
              value={filterApplication}
              onChange={(e) => setFilterApplication(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Applications</option>
              {applications.slice(1).map((app) => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Types</option>
              {types.slice(1).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Classifications</option>
              <option value="public">Public</option>
              <option value="internal">Internal</option>
              <option value="confidential">Confidential</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="all">All ({mockData.permissions.length})</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk ({stats.highRisk})</TabsTrigger>
          <TabsTrigger value="read-only">
            Read Only ({mockData.permissions.filter((p) => p.type === "read").length})
          </TabsTrigger>
          <TabsTrigger value="write-access">
            Write Access ({mockData.permissions.filter((p) => p.type === "write" || p.type === "delete").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-2">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Permission</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Application</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Resource</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Classification</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredPermissions.slice(0, 50).map((perm) => (
                      <tr key={perm.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-white">
                              <Lock className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{perm.name}</span>
                                {(perm.dataClassification === "restricted" || perm.dataClassification === "confidential") && (
                                  <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Code className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-mono">{perm.code}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full p-1.5 bg-purple-500/10">
                              <Database className="h-3 w-3 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{perm.application}</div>
                              <div className="text-xs text-muted-foreground">{perm.module}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{perm.resource}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${getTypeColor(perm.type)} border`}>
                            {getTypeIcon(perm.type)}
                            <span className="ml-1">{perm.type}</span>
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${getClassificationColor(perm.dataClassification)} border`}>
                            {perm.dataClassification === "restricted" && <AlertTriangle className="mr-1 h-3 w-3" />}
                            {perm.dataClassification === "confidential" && <ShieldAlert className="mr-1 h-3 w-3" />}
                            {perm.dataClassification === "internal" && <Lock className="mr-1 h-3 w-3" />}
                            {perm.dataClassification === "public" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {perm.dataClassification}
                          </Badge>
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

          {/* Empty State */}
          {filteredPermissions.length === 0 && (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No permissions found matching your search criteria</p>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(filteredPermissions.length, 50)}</span> of{" "}
              <span className="font-medium">{filteredPermissions.length}</span> permissions
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Classification Legend */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5 text-amber-600" />
            Data Classification Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-green-900 dark:text-green-100">Public</div>
                <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Can be freely shared externally
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-blue-900 dark:text-blue-100">Internal</div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  For internal use only
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
              <ShieldAlert className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-orange-900 dark:text-orange-100">Confidential</div>
                <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Sensitive business data
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-red-200 bg-red-50/50 dark:bg-red-950/20">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-red-900 dark:text-red-100">Restricted</div>
                <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Requires strict controls
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-2 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Key className="mr-2 h-5 w-5 text-amber-600" />
            Permission Management Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>Apply data classification consistently across all permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>Regular audit high-risk permissions (restricted and confidential)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>Use granular permissions rather than broad access rights</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5" />
              <span>Document permission dependencies and required compliance controls</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
