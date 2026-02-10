import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<any>(null)

  // Form state
  const [permissionForm, setPermissionForm] = useState({
    name: "",
    code: "",
    description: "",
    application: "",
    type: "read",
    dataClassification: "internal"
  })

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
        return "bg-muted text-foreground border"
      case "internal":
        return "bg-muted text-foreground border"
      case "confidential":
        return "bg-muted text-foreground border"
      case "restricted":
        return "bg-muted text-foreground border"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "read":
        return "bg-muted text-foreground border"
      case "write":
        return "bg-muted text-foreground border"
      case "delete":
        return "bg-muted text-foreground border"
      case "execute":
        return "bg-muted text-foreground border"
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
          <h1 className="text-4xl font-bold tracking-tight  from-amber-600  text-foreground">
            Permission Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure and manage granular permissions across all applications
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const csv = [
                ["Name", "Code", "Application", "Type", "Classification"].join(","),
                ...filteredPermissions.map(p => [
                  p.name,
                  p.code,
                  p.application,
                  p.type,
                  p.dataClassification
                ].join(","))
              ].join("\n")
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'permissions.csv'
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
            Create Permission
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
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

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.activePermissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in use
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <ShieldAlert className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.highRisk}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Restricted/Confidential
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Layers className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.applications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Integrated systems
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
                placeholder="Search by name, code, application, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={filterApplication} onValueChange={setFilterApplication}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Applications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                {applications.slice(1).map((app) => (
                  <SelectItem key={app} value={app}>{app}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.slice(1).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterClassification} onValueChange={setFilterClassification}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Classifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="confidential">Confidential</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
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
          <Card className="border">
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
                            <div className="h-10 w-10 rounded-lg  from-amber-500  flex items-center justify-center text-white">
                              <Lock className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{perm.name}</span>
                                {(perm.dataClassification === "restricted" || perm.dataClassification === "confidential") && (
                                  <ShieldAlert className="h-3.5 w-3.5 text-foreground" />
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
                            <div className="rounded-full p-1.5 bg-muted">
                              <Database className="h-3 w-3 text-foreground" />
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPermission(perm)
                                setIsViewDetailsOpen(true)
                              }}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                alert(`More options for: ${perm.name}\n\n- Edit Permission\n- Duplicate Permission\n- Delete Permission\n- View Dependencies\n- Audit History`)
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

          {/* Empty State */}
          {filteredPermissions.length === 0 && (
            <Card className="border">
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
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <ShieldAlert className="mr-2 h-5 w-5 text-amber-600" />
            Data Classification Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">Public</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  Can be freely shared externally
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <Lock className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">Internal</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  For internal use only
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <ShieldAlert className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">Confidential</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  Sensitive business data
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <AlertTriangle className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">Restricted</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  Requires strict controls
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
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

      {/* Create Permission Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
            <DialogDescription>
              Define a new permission for application access control
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="permName">Permission Name</Label>
                <Input
                  id="permName"
                  value={permissionForm.name}
                  onChange={(e) => setPermissionForm({ ...permissionForm, name: e.target.value })}
                  placeholder="e.g., View Reports"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Permission Code</Label>
                <Input
                  id="code"
                  value={permissionForm.code}
                  onChange={(e) => setPermissionForm({ ...permissionForm, code: e.target.value })}
                  placeholder="e.g., reports.view"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="permDescription">Description</Label>
              <Textarea
                id="permDescription"
                value={permissionForm.description}
                onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                placeholder="Describe what this permission allows..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="application">Application</Label>
                <Select value={permissionForm.application} onValueChange={(value) => setPermissionForm({ ...permissionForm, application: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select application" />
                  </SelectTrigger>
                  <SelectContent>
                    {applications.filter(a => a !== "all").map((app) => (
                      <SelectItem key={app} value={app}>{app}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Permission Type</Label>
                <Select value={permissionForm.type} onValueChange={(value) => setPermissionForm({ ...permissionForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="classification">Data Classification</Label>
              <Select value={permissionForm.dataClassification} onValueChange={(value) => setPermissionForm({ ...permissionForm, dataClassification: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false)
              setPermissionForm({
                name: "",
                code: "",
                description: "",
                application: "",
                type: "read",
                dataClassification: "internal"
              })
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              console.log("Creating permission:", permissionForm)
              alert(`Permission "${permissionForm.name}" (${permissionForm.code}) created successfully!`)
              setIsCreateOpen(false)
              setPermissionForm({
                name: "",
                code: "",
                description: "",
                application: "",
                type: "read",
                dataClassification: "internal"
              })
            }}>
              Create Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Permission Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Permission Details</DialogTitle>
            <DialogDescription>
              Detailed information about this permission
            </DialogDescription>
          </DialogHeader>
          {selectedPermission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Permission Name</Label>
                  <p className="text-sm font-medium">{selectedPermission.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Code</Label>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{selectedPermission.code}</code>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Application</Label>
                  <p className="text-sm">{selectedPermission.application}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Badge>{selectedPermission.type}</Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Data Classification</Label>
                  <Badge variant={selectedPermission.dataClassification === "restricted" ? "destructive" : "secondary"}>
                    {selectedPermission.dataClassification}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Resource</Label>
                  <p className="text-sm">{selectedPermission.resource}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedPermission.description || "No description available"}
                </p>
              </div>
              {selectedPermission.conditions && selectedPermission.conditions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Conditions</Label>
                  <div className="border rounded-md p-3 space-y-1">
                    {selectedPermission.conditions.map((condition: string, index: number) => (
                      <div key={index} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
