import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Shield,
  Key,
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
  const [isExtensionOpen, setIsExtensionOpen] = useState(false)
  const [selectedAccess, setSelectedAccess] = useState<any>(null)
  const [extensionForm, setExtensionForm] = useState({
    duration: "30",
    justification: ""
  })

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

  const getStatusColor = (_status: string) => {
    return "bg-muted text-foreground border"
  }

  const handleRequestExtension = (access: any) => {
    setSelectedAccess(access)
    setIsExtensionOpen(true)
  }

  const handleSubmitExtension = () => {
    if (extensionForm.justification.length >= 20) {
      console.log("Requesting extension:", { selectedAccess, extensionForm })
      alert(`Extension request submitted for "${selectedAccess.name}"!`)
      setIsExtensionOpen(false)
      setSelectedAccess(null)
      setExtensionForm({
        duration: "30",
        justification: ""
      })
    }
  }

  const handleExportReport = () => {
    const csvContent = [
      ["Access Name", "Type", "Granted Date", "Expires", "Status", "Source"],
      ...accessItems.map(item => [
        item.name,
        item.type,
        new Date(item.grantedDate).toLocaleDateString(),
        item.expiresDate ? new Date(item.expiresDate).toLocaleDateString() : "Never",
        item.status,
        item.source
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "my-access-report.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            My Access
          </h1>
          <p className="text-lg text-muted-foreground">
            View and manage your roles, permissions, and application access
          </p>
        </div>
        <Button variant="outline" size="lg" onClick={handleExportReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Roles</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Shield className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active role assignments
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissions</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Key className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPermissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Granted permissions
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Access</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeAccess}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.expiringSoon}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Need renewal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border">
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
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="role">Roles</SelectItem>
                <SelectItem value="permission">Permissions</SelectItem>
                <SelectItem value="application">Applications</SelectItem>
              </SelectContent>
            </Select>
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
          <Card className="border bg-muted">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
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
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
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
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Shield className="h-5 w-5" />
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
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
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
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Lock className="h-5 w-5" />
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
              <Card key={role.id} className="border hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
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
                      <div className="flex items-center space-x-2 p-2 rounded bg-muted border">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs">Inherited Role</span>
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
          <Card className="border">
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
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <Lock className="h-4 w-4" />
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
          <Card className="border">
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
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAccessItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
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
                        <td className="px-4 py-4">
                          {item.status === "expiring_soon" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestExtension(item)}
                            >
                              Request Extension
                            </Button>
                          )}
                          {item.status === "active" && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Extension Modal */}
      <Dialog open={isExtensionOpen} onOpenChange={setIsExtensionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Access Extension</DialogTitle>
            <DialogDescription>
              Request to extend access for an expiring item
            </DialogDescription>
          </DialogHeader>

          {selectedAccess && (
            <div className="space-y-6">
              {/* Access Info */}
              <div className="p-4 rounded-lg border bg-muted">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedAccess.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedAccess.type}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Granted:</span>
                    <p className="font-medium">{formatDate(selectedAccess.grantedDate)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <p className="font-medium">
                      {selectedAccess.expiresDate ? formatDate(selectedAccess.expiresDate) : "Never"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className="mt-1">{selectedAccess.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              </div>

              {/* Extension Warning */}
              <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Expiring Soon</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This access is set to expire soon. Request an extension to maintain your access.
                </p>
              </div>

              {/* Extension Duration */}
              <div className="space-y-2">
                <Label htmlFor="extension-duration">Extension Duration</Label>
                <Select
                  value={extensionForm.duration}
                  onValueChange={(value) => setExtensionForm({ ...extensionForm, duration: value })}
                >
                  <SelectTrigger id="extension-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How long do you need this access extended?
                </p>
              </div>

              {/* Justification */}
              <div className="space-y-2">
                <Label htmlFor="extension-justification">
                  Business Justification <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="extension-justification"
                  placeholder="Explain why you need this access extension..."
                  value={extensionForm.justification}
                  onChange={(e) => setExtensionForm({ ...extensionForm, justification: e.target.value })}
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {extensionForm.justification.length}/20 characters minimum
                </p>
              </div>

              {/* Preview */}
              {extensionForm.justification.length >= 20 && (
                <div className="p-4 rounded-lg border bg-muted">
                  <h4 className="font-semibold mb-2 text-sm">Extension Request Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Access:</span>
                      <span className="font-medium">{selectedAccess.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Expiry:</span>
                      <span className="font-medium">
                        {selectedAccess.expiresDate ? formatDate(selectedAccess.expiresDate) : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extension Duration:</span>
                      <span className="font-medium">{extensionForm.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">New Expiry Date:</span>
                      <span className="font-medium">
                        {selectedAccess.expiresDate
                          ? new Date(
                              new Date(selectedAccess.expiresDate).getTime() +
                                parseInt(extensionForm.duration) * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Extension Request Process</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Your request will be reviewed by the access manager. You'll receive an email notification once it's approved or denied.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsExtensionOpen(false)
                setSelectedAccess(null)
                setExtensionForm({
                  duration: "30",
                  justification: ""
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitExtension}
              disabled={extensionForm.justification.length < 20}
            >
              <Clock className="mr-2 h-4 w-4" />
              Submit Extension Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
