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
import type { Environment, ApplicationCode, PermissionAction } from "@/types"
import {
  Search,
  Plus,
  Lock,
  Eye,
  Edit3,
  Trash2,
  Play
} from "lucide-react"

export default function PermissionsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const user = useAuthStore((state) => state.user)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterApplication, setFilterApplication] = useState<ApplicationCode | "all">("all")
  const [filterEnvironment, setFilterEnvironment] = useState<Environment | "all">("all")
  const [filterAction, setFilterAction] = useState<PermissionAction | "all">("all")
  const [activeTab, setActiveTab] = useState<"all" | "dev" | "qa" | "uat" | "prod">("all")

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<any>(null)

  // Form state for creating new permission (RGD Section 8.2)
  const [permissionForm, setPermissionForm] = useState<{
    applicationCode: ApplicationCode
    environment: Environment
    action: PermissionAction
    description: string
    resource: string
  }>({
    applicationCode: "APP1",
    environment: "DEV",
    action: "READ",
    description: "",
    resource: ""
  })

  // RGD Section 7.1.2: SUB_ADMIN environment restrictions
  const canAccessEnvironment = (env: Environment): boolean => {
    if (!user) return false
    if (user.userRole === "IT_ADMIN") return true
    if (user.userRole === "SUB_ADMIN") {
      return env === "DEV" || env === "QA"
    }
    return false
  }

  // Filter logic
  const filteredPermissions = useMemo(() => {
    let filtered = mockData.permissions

    // Tab filtering by environment
    if (activeTab !== "all") {
      filtered = filtered.filter((p) => p.environment.toLowerCase() === activeTab)
    }

    // Application filter
    if (filterApplication !== "all") {
      filtered = filtered.filter((p) => p.applicationCode === filterApplication)
    }

    // Environment filter
    if (filterEnvironment !== "all") {
      filtered = filtered.filter((p) => p.environment === filterEnvironment)
    }

    // Action filter
    if (filterAction !== "all") {
      filtered = filtered.filter((p) => p.action === filterAction)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.applicationCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply SUB_ADMIN restrictions
    if (user?.userRole === "SUB_ADMIN") {
      filtered = filtered.filter((p) => p.environment === "DEV" || p.environment === "QA")
    }

    return filtered
  }, [mockData.permissions, activeTab, filterApplication, filterEnvironment, filterAction, searchQuery, user])

  // Statistics
  const stats = {
    total: mockData.permissions.length,
    dev: mockData.permissions.filter((p) => p.environment === "DEV").length,
    qa: mockData.permissions.filter((p) => p.environment === "QA").length,
    uat: mockData.permissions.filter((p) => p.environment === "UAT").length,
    prod: mockData.permissions.filter((p) => p.environment === "PROD").length,
  }

  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "DEV":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "QA":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "UAT":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "PROD":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getActionIcon = (action: PermissionAction) => {
    switch (action) {
      case "READ":
        return <Eye className="h-3.5 w-3.5" />
      case "CREATE":
        return <Plus className="h-3.5 w-3.5" />
      case "UPDATE":
        return <Edit3 className="h-3.5 w-3.5" />
      case "DELETE":
        return <Trash2 className="h-3.5 w-3.5" />
      case "EXECUTE":
        return <Play className="h-3.5 w-3.5" />
      default:
        return <Lock className="h-3.5 w-3.5" />
    }
  }

  const handleCreatePermission = () => {
    // Generate permission name: {APP}_{ENV}_{ACTION}
    const permissionName = `${permissionForm.applicationCode}_${permissionForm.environment}_${permissionForm.action}`
    console.log("Creating permission:", permissionName, permissionForm)
    setIsCreateOpen(false)
    // Reset form
    setPermissionForm({
      applicationCode: "APP1",
      environment: "DEV",
      action: "READ",
      description: "",
      resource: ""
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
        <p className="text-muted-foreground">
          Manage environment-based permissions (RGD Section 8.2)
        </p>
        {user?.userRole === "SUB_ADMIN" && (
          <Badge variant="destructive" className="mt-2">
            ⚠️ SUB_ADMIN: Limited to DEV & QA environments only
          </Badge>
        )}
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All environments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">DEV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.dev}</div>
            <p className="text-xs text-muted-foreground">Development</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">QA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.qa}</div>
            <p className="text-xs text-muted-foreground">Quality Assurance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">UAT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.uat}</div>
            <p className="text-xs text-muted-foreground">
              {canAccessEnvironment("UAT") ? "User Acceptance" : "⛔ Blocked"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">PROD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.prod}</div>
            <p className="text-xs text-muted-foreground">
              {canAccessEnvironment("PROD") ? "Production" : "⛔ Blocked"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions by name, app code, or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterApplication} onValueChange={(value) => setFilterApplication(value as ApplicationCode | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Application" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="APP1">APP1</SelectItem>
                <SelectItem value="APP2">APP2</SelectItem>
                <SelectItem value="APP3">APP3</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEnvironment} onValueChange={(value) => setFilterEnvironment(value as Environment | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Environments</SelectItem>
                <SelectItem value="DEV">DEV</SelectItem>
                <SelectItem value="QA">QA</SelectItem>
                <SelectItem value="UAT">UAT {!canAccessEnvironment("UAT") && "⛔"}</SelectItem>
                <SelectItem value="PROD">PROD {!canAccessEnvironment("PROD") && "⛔"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAction} onValueChange={(value) => setFilterAction(value as PermissionAction | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE">CREATE</SelectItem>
                <SelectItem value="READ">READ</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="EXECUTE">EXECUTE</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Permission
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="dev">DEV ({stats.dev})</TabsTrigger>
          <TabsTrigger value="qa">QA ({stats.qa})</TabsTrigger>
          <TabsTrigger value="uat" disabled={!canAccessEnvironment("UAT")}>
            UAT ({stats.uat}) {!canAccessEnvironment("UAT") && "🔒"}
          </TabsTrigger>
          <TabsTrigger value="prod" disabled={!canAccessEnvironment("PROD")}>
            PROD ({stats.prod}) {!canAccessEnvironment("PROD") && "🔒"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Permission Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Application</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Environment</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredPermissions.map((permission) => (
                      <tr key={permission.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm font-medium">{permission.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{permission.applicationCode}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={getEnvironmentColor(permission.environment)}>
                            {permission.environment}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {getActionIcon(permission.action)}
                            <span className="text-sm">{permission.action}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                          {permission.description}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPermission(permission)
                              setIsViewDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredPermissions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No permissions found</p>
                    <p className="text-sm">Try adjusting your filters or search query</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Permission Dialog - RGD Section 8.2 */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
            <DialogDescription>
              Permission naming follows RGD format: {"{"}APP{"}"}_{"{"} ENV{"}"}_{"{"} ACTION{"}"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Application Code</Label>
              <Select
                value={permissionForm.applicationCode}
                onValueChange={(value) => setPermissionForm({ ...permissionForm, applicationCode: value as ApplicationCode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APP1">APP1</SelectItem>
                  <SelectItem value="APP2">APP2</SelectItem>
                  <SelectItem value="APP3">APP3</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Environment</Label>
              <Select
                value={permissionForm.environment}
                onValueChange={(value) => setPermissionForm({ ...permissionForm, environment: value as Environment })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEV">DEV - Development</SelectItem>
                  <SelectItem value="QA">QA - Quality Assurance</SelectItem>
                  <SelectItem value="UAT" disabled={!canAccessEnvironment("UAT")}>
                    UAT - User Acceptance {!canAccessEnvironment("UAT") && "⛔"}
                  </SelectItem>
                  <SelectItem value="PROD" disabled={!canAccessEnvironment("PROD")}>
                    PROD - Production {!canAccessEnvironment("PROD") && "⛔"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={permissionForm.action}
                onValueChange={(value) => setPermissionForm({ ...permissionForm, action: value as PermissionAction })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREATE">CREATE</SelectItem>
                  <SelectItem value="READ">READ</SelectItem>
                  <SelectItem value="UPDATE">UPDATE</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="EXECUTE">EXECUTE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Resource (Optional)</Label>
              <Input
                value={permissionForm.resource}
                onChange={(e) => setPermissionForm({ ...permissionForm, resource: e.target.value })}
                placeholder="e.g., Financial Reports, User Data"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={permissionForm.description}
                onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                placeholder="Describe what this permission allows..."
              />
            </div>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Generated Permission Name:</p>
              <p className="font-mono text-sm mt-1">
                {permissionForm.applicationCode}_{permissionForm.environment}_{permissionForm.action}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePermission}>Create Permission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Permission Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permission Details</DialogTitle>
            <DialogDescription>
              Complete information about this permission
            </DialogDescription>
          </DialogHeader>
          {selectedPermission && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Permission Name</Label>
                <p className="font-mono text-sm font-medium mt-1">{selectedPermission.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Application</Label>
                  <Badge variant="outline" className="mt-1">{selectedPermission.applicationCode}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Environment</Label>
                  <Badge className={`${getEnvironmentColor(selectedPermission.environment)} mt-1`}>
                    {selectedPermission.environment}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Action</Label>
                  <p className="text-sm mt-1 flex items-center gap-1.5">
                    {getActionIcon(selectedPermission.action)}
                    {selectedPermission.action}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm mt-1">{selectedPermission.description}</p>
              </div>
              {selectedPermission.resource && (
                <div>
                  <Label className="text-xs text-muted-foreground">Resource</Label>
                  <p className="text-sm mt-1">{selectedPermission.resource}</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground">Created</Label>
                <p className="text-sm mt-1">
                  {new Date(selectedPermission.createdAt).toLocaleDateString()} by {selectedPermission.createdBy}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
