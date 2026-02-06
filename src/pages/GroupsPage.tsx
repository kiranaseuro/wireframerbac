import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  MapPin
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function GroupsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterSyncStatus, setFilterSyncStatus] = useState("all")
  const [filterMapped, setFilterMapped] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

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
        return "bg-green-500/10 text-green-600 border-green-200"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      case "error":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Security":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "Distribution":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "Office365":
        return "bg-purple-500/10 text-purple-600 border-purple-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AD Group Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Synchronize and manage Active Directory groups with role mappings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync All Groups
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
            <div className="rounded-full p-2 bg-emerald-500/10">
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active Directory groups
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Synced</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.synced}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully synchronized
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <div className="rounded-full p-2 bg-yellow-500/10">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting synchronization
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mapped Roles</CardTitle>
            <div className="rounded-full p-2 bg-blue-500/10">
              <Link2 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.mapped}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Groups with role mappings
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
                placeholder="Search by group name, description, or mapped role..."
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
              {types.slice(1).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterSyncStatus}
              onChange={(e) => setFilterSyncStatus(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Sync Status</option>
              <option value="synced">Synced</option>
              <option value="pending">Pending</option>
              <option value="error">Error</option>
            </select>
            <select
              value={filterMapped}
              onChange={(e) => setFilterMapped(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Mappings</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
            </select>
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
              <Card key={group.id} className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
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
                        <Users className="h-3 w-3 text-blue-600" />
                        <span className="text-sm font-semibold">{group.memberCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mapped Role */}
                  <div className="p-3 rounded-lg border-2 border-dashed">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Mapped Role</span>
                    </div>
                    {group.mappedRoleName ? (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
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
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Sync
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Link2 className="mr-1 h-3 w-3" />
                      Map Role
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
          {filteredGroups.length === 0 && (
            <Card className="border-2">
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
      <Card className="border-2 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Settings className="mr-2 h-5 w-5 text-emerald-600" />
            AD Group Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-white dark:bg-gray-900">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Automatic Sync Schedule</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Groups are automatically synchronized every 4 hours from Active Directory
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 bg-white dark:bg-gray-900">
              <Link2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Role Mapping</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Map AD groups to RBAC roles for automatic user permission assignment
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-yellow-200 bg-white dark:bg-gray-900">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
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
      <Card className="border-2 border-teal-200 bg-teal-50/50 dark:bg-teal-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-teal-600" />
            Group Management Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5" />
              <span>Keep group names descriptive and follow a consistent naming convention</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5" />
              <span>Map security groups to roles for seamless access management</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5" />
              <span>Monitor pending syncs and resolve errors promptly to maintain data integrity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5" />
              <span>Regularly audit unmapped groups to ensure complete role coverage</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
