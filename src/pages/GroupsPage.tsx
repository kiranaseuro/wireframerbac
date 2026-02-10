import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  RefreshCw,
  Search,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Link2,
  Settings,
  TrendingUp,
  Download,
  MoreVertical,
  ShieldCheck,
  FolderSync,
  MapPin,
  Shield
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function GroupsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSyncStatus, setFilterSyncStatus] = useState("all")
  const [filterMapped, setFilterMapped] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isMapRoleOpen, setIsMapRoleOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [selectedRoleId, setSelectedRoleId] = useState("")

  // Get unique types
  const types = ["all", ...Array.from(new Set(mockData.groups.map((g) => g.type)))]

  // Filter logic
  const filteredGroups = useMemo(() => {
    let filtered = mockData.groups

    // Tab filtering
    if (activeTab === "synced") {
      filtered = filtered.filter((g) => g.syncStatus === "synced")
    } else if (activeTab === "pending") {
      filtered = filtered.filter((g) => g.syncStatus === "pending")
    } else if (activeTab === "mapped") {
      filtered = filtered.filter((g) => g.mappedRoleName)
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((g) => g.type === filterType)
    }

    // Sync status filter
    if (filterSyncStatus !== "all") {
      filtered = filtered.filter((g) => g.syncStatus === filterSyncStatus)
    }

    // Mapped filter
    if (filterMapped === "mapped") {
      filtered = filtered.filter((g) => g.mappedRoleName)
    } else if (filterMapped === "unmapped") {
      filtered = filtered.filter((g) => !g.mappedRoleName)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.mappedRoleName && g.mappedRoleName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filtered
  }, [mockData.groups, activeTab, filterType, filterSyncStatus, filterMapped, searchQuery])

  // Statistics
  const stats = {
    totalGroups: mockData.groups.length,
    synced: mockData.groups.filter((g) => g.syncStatus === "synced").length,
    pending: mockData.groups.filter((g) => g.syncStatus === "pending").length,
    mapped: mockData.groups.filter((g) => g.mappedRoleName).length
  }

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case "synced":
        return "bg-muted text-foreground border"
      case "pending":
        return "bg-muted text-foreground border"
      case "error":
        return "bg-muted text-foreground border"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Security":
        return "bg-muted text-foreground border"
      case "Distribution":
        return "bg-muted text-foreground border"
      case "Office365":
        return "bg-muted text-foreground border"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const handleMapRole = (group: any) => {
    setSelectedGroup(group)
    setSelectedRoleId(group.mappedRoleId || "")
    setIsMapRoleOpen(true)
  }

  const handleViewDetails = (group: any) => {
    setSelectedGroup(group)
    setIsViewDetailsOpen(true)
  }

  const handleSaveMapping = () => {
    if (selectedGroup && selectedRoleId) {
      console.log(`Mapping group ${selectedGroup.id} to role ${selectedRoleId}`)
      alert(`Group "${selectedGroup.name}" mapped to role successfully!`)
      setIsMapRoleOpen(false)
      setSelectedGroup(null)
      setSelectedRoleId("")
    }
  }

  const handleSync = (groupId: string) => {
    console.log(`Syncing group ${groupId}`)
    alert("Group synchronized successfully!")
  }

  const handleSyncAll = () => {
    console.log("Syncing all groups")
    alert(`Synchronizing all ${mockData.groups.length} groups...`)
  }

  const handleExport = () => {
    const csvContent = [
      ["Group Name", "Type", "Members", "Sync Status", "Mapped Role", "Last Synced"],
      ...mockData.groups.map(g => [
        g.name,
        g.type,
        g.memberCount.toString(),
        g.syncStatus,
        g.mappedRoleName || "Not mapped",
        g.lastSynced ? new Date(g.lastSynced).toLocaleDateString() : "Never"
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ad-groups-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight    text-foreground">
            AD Group Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Synchronize and manage Active Directory groups with role mappings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="lg" onClick={handleSyncAll}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync All Groups
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Users className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active Directory groups
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.synced}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully synchronized
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Clock className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting synchronization
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mapped Roles</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Link2 className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.mapped}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Groups with role mappings
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
                placeholder="Search by group name, description, or mapped role..."
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
                {types.slice(1).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSyncStatus} onValueChange={setFilterSyncStatus}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Sync Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sync Status</SelectItem>
                <SelectItem value="synced">Synced</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMapped} onValueChange={setFilterMapped}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Mappings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Mappings</SelectItem>
                <SelectItem value="mapped">Mapped</SelectItem>
                <SelectItem value="unmapped">Unmapped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="all">All Groups ({mockData.groups.length})</TabsTrigger>
          <TabsTrigger value="synced">Synced ({stats.synced})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="mapped">Mapped ({stats.mapped})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="border hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-12 w-12 rounded-lg    flex items-center justify-center text-white">
                        <FolderSync className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{group.name}</CardTitle>
                        <CardDescription className="text-xs mt-1 line-clamp-1">
                          {group.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getSyncStatusColor(group.syncStatus)} border`}>
                      {group.syncStatus === "synced" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {group.syncStatus === "pending" && <Clock className="mr-1 h-3 w-3" />}
                      {group.syncStatus === "error" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {group.syncStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Info Blocks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-xs text-muted-foreground">Type</span>
                      <Badge className={`${getTypeColor(group.type)} border text-xs`}>
                        {group.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-xs text-muted-foreground">Members</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-foreground" />
                        <span className="text-sm font-semibold">{group.memberCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mapped Role */}
                  <div className="p-3 rounded-lg border border-dashed">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Mapped Role</span>
                    </div>
                    {group.mappedRoleName ? (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-foreground" />
                        <span className="text-sm font-medium">{group.mappedRoleName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Not mapped to any role</span>
                    )}
                  </div>

                  {/* Last Synced */}
                  <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Last synced:</span>
                    </div>
                    <span className="font-medium">
                      {group.lastSynced ? formatDate(group.lastSynced) : "Never"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSync(group.id)
                      }}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Sync
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMapRole(group)
                      }}
                    >
                      <Link2 className="mr-1 h-3 w-3" />
                      Map Role
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(group)
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
          {filteredGroups.length === 0 && (
            <Card className="border">
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No groups found matching your search criteria</p>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredGroups.length}</span> group{filteredGroups.length !== 1 ? 's' : ''}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sync Status Info */}
      <Card className="border border bg-muted dark:bg-muted">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Settings className="mr-2 h-5 w-5 text-foreground" />
            AD Group Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-white dark:bg-gray-900">
              <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm">Automatic Sync Schedule</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Groups are automatically synchronized every 4 hours from Active Directory
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-white dark:bg-gray-900">
              <Link2 className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm">Role Mapping</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Map AD groups to RBAC roles for automatic user permission assignment
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-white dark:bg-gray-900">
              <Clock className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm">Manual Sync</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Use the "Sync All Groups" button to trigger an immediate synchronization
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border border bg-muted dark:bg-muted">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-foreground" />
            Group Management Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Keep group names descriptive and follow a consistent naming convention</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Map security groups to roles for seamless access management</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Monitor pending syncs and resolve errors promptly to maintain data integrity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Regularly audit unmapped groups to ensure complete role coverage</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Map Role Modal */}
      <Dialog open={isMapRoleOpen} onOpenChange={setIsMapRoleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Map AD Group to Role</DialogTitle>
            <DialogDescription>
              Assign an RBAC role to this Active Directory group for automatic permission management
            </DialogDescription>
          </DialogHeader>

          {selectedGroup && (
            <div className="space-y-6">
              {/* Group Info */}
              <div className="p-4 rounded-lg border bg-muted">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                    <FolderSync className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedGroup.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <Badge className="ml-2">{selectedGroup.type}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Members:</span>
                    <span className="ml-2 font-semibold">{selectedGroup.memberCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className="ml-2">{selectedGroup.syncStatus}</Badge>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role-select">Select Role to Map</Label>
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Choose a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.roles
                      .filter(r => r.status === "active")
                      .map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>{role.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({role.permissions.length} permissions)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  All members of this AD group will automatically receive the selected role's permissions
                </p>
              </div>

              {/* Current Mapping */}
              {selectedGroup.mappedRoleName && (
                <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Current Mapping:</span>
                    <span>{selectedGroup.mappedRoleName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    Changing this mapping will update permissions for all {selectedGroup.memberCount} members
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsMapRoleOpen(false)
                setSelectedGroup(null)
                setSelectedRoleId("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMapping} disabled={!selectedRoleId}>
              <Link2 className="mr-2 h-4 w-4" />
              Save Mapping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Group Details Modal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AD Group Details</DialogTitle>
            <DialogDescription>
              Complete information about this Active Directory group
            </DialogDescription>
          </DialogHeader>

          {selectedGroup && (
            <div className="space-y-6">
              {/* Group Header */}
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted">
                <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  <FolderSync className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedGroup.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedGroup.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge className={getSyncStatusColor(selectedGroup.syncStatus)}>
                      {selectedGroup.syncStatus}
                    </Badge>
                    <Badge className={getTypeColor(selectedGroup.type)}>
                      {selectedGroup.type}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedGroup.memberCount}</p>
                    <p className="text-xs text-muted-foreground">Active users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Last Synced
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      {selectedGroup.lastSynced ? formatDate(selectedGroup.lastSynced) : "Never"}
                    </p>
                    <p className="text-xs text-muted-foreground">Sync status</p>
                  </CardContent>
                </Card>
              </div>

              {/* Role Mapping */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Role Mapping</h4>
                </div>
                {selectedGroup.mappedRoleName ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{selectedGroup.mappedRoleName}</p>
                        <p className="text-xs text-muted-foreground">
                          Automatically assigned to all group members
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsViewDetailsOpen(false)
                        handleMapRole(selectedGroup)
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed text-center">
                    <p className="text-sm text-muted-foreground mb-3">No role mapped to this group</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsViewDetailsOpen(false)
                        handleMapRole(selectedGroup)
                      }}
                    >
                      <Link2 className="mr-2 h-4 w-4" />
                      Map Role Now
                    </Button>
                  </div>
                )}
              </div>

              {/* Sync Information */}
              <div className="p-4 rounded-lg border bg-muted">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Synchronization Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sync Status:</span>
                    <span className="font-medium">{selectedGroup.syncStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Synced:</span>
                    <span className="font-medium">
                      {selectedGroup.lastSynced ? new Date(selectedGroup.lastSynced).toLocaleString() : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sync Frequency:</span>
                    <span className="font-medium">Every 4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="font-medium">Active Directory</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => handleSync(selectedGroup?.id)}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </Button>
            <Button onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
