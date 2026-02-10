import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  User,
  Clock,
  Activity,
  Filter,
  Calendar,
  Globe,
  TrendingUp
} from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function AuditLogsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterEventType, setFilterEventType] = useState("all")
  const [filterResult, setFilterResult] = useState("all")
  const [filterUser, setFilterUser] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [advancedFilters, setAdvancedFilters] = useState({
    startDate: "",
    endDate: "",
    ipAddress: "",
    resource: ""
  })

  // Get unique event types and users
  const eventTypes = ["all", ...Array.from(new Set(mockData.auditLogs.map((log) => log.eventType)))]
  const users = ["all", ...Array.from(new Set(mockData.auditLogs.map((log) => log.userName)))]

  // Filter logic
  const filteredLogs = useMemo(() => {
    let filtered = mockData.auditLogs

    // Tab filtering
    if (activeTab === "success") {
      filtered = filtered.filter((log) => log.result === "success")
    } else if (activeTab === "failure") {
      filtered = filtered.filter((log) => log.result === "failure")
    } else if (activeTab === "critical") {
      filtered = filtered.filter((log) =>
        log.eventType === "access_denied" ||
        log.eventType === "role_modified" ||
        log.eventType === "permission_granted"
      )
    }

    // Event type filter
    if (filterEventType !== "all") {
      filtered = filtered.filter((log) => log.eventType === filterEventType)
    }

    // Result filter
    if (filterResult !== "all") {
      filtered = filtered.filter((log) => log.result === filterResult)
    }

    // User filter
    if (filterUser !== "all") {
      filtered = filtered.filter((log) => log.userName === filterUser)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((log) =>
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery)
      )
    }

    return filtered
  }, [mockData.auditLogs, activeTab, filterEventType, filterResult, filterUser, searchQuery])

  // Statistics
  const stats = {
    totalEvents: mockData.auditLogs.length,
    successRate: Math.round((mockData.auditLogs.filter((log) => log.result === "success").length / mockData.auditLogs.length) * 100),
    failedAttempts: mockData.auditLogs.filter((log) => log.result === "failure").length,
    criticalEvents: mockData.auditLogs.filter((log) =>
      log.eventType === "access_denied" ||
      log.eventType === "role_modified" ||
      log.eventType === "permission_granted"
    ).length
  }

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "login":
        return "bg-muted text-foreground border"
      case "logout":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      case "access_granted":
        return "bg-muted text-foreground border"
      case "access_denied":
        return "bg-muted text-foreground border"
      case "role_modified":
        return "bg-muted text-foreground border"
      case "permission_granted":
        return "bg-muted text-foreground border"
      case "user_created":
        return "bg-muted text-foreground border"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "login":
      case "logout":
        return <User className="h-3 w-3" />
      case "access_granted":
        return <CheckCircle2 className="h-3 w-3" />
      case "access_denied":
        return <XCircle className="h-3 w-3" />
      case "role_modified":
      case "permission_granted":
        return <Shield className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "Event Type", "User", "Action", "Resource", "Result", "IP Address"],
      ...mockData.auditLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.eventType,
        log.userName,
        log.action,
        log.resource,
        log.result,
        log.ipAddress
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "audit-logs-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleViewDetails = (log: any) => {
    setSelectedLog(log)
    setIsViewDetailsOpen(true)
  }

  const handleApplyAdvancedFilters = () => {
    console.log("Applying advanced filters:", advancedFilters)
    alert("Advanced filters applied successfully!")
    setIsAdvancedFiltersOpen(false)
  }

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters({
      startDate: "",
      endDate: "",
      ipAddress: "",
      resource: ""
    })
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight    text-foreground">
            Audit Trail
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete system activity log for compliance and security monitoring
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={() => setIsAdvancedFiltersOpen(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button size="lg" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <FileText className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Audit log entries
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <CheckCircle2 className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful operations
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <XCircle className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.failedAttempts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires investigation
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <AlertTriangle className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.criticalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-priority actions
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
                placeholder="Search by user, action, resource, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={filterEventType} onValueChange={setFilterEventType}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Event Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                {eventTypes.slice(1).map((type) => (
                  <SelectItem key={type} value={type}>{type.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterResult} onValueChange={setFilterResult}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.slice(1).sort().slice(0, 20).map((user) => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="all">All Events ({mockData.auditLogs.length})</TabsTrigger>
          <TabsTrigger value="success">
            Success ({mockData.auditLogs.filter((l) => l.result === "success").length})
          </TabsTrigger>
          <TabsTrigger value="failure">
            Failures ({stats.failedAttempts})
          </TabsTrigger>
          <TabsTrigger value="critical">Critical ({stats.criticalEvents})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Event Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Resource</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Result</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredLogs.slice(0, 100).map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(log)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(log.timestamp)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={`${getEventTypeColor(log.eventType)} border`}>
                            {getEventIcon(log.eventType)}
                            <span className="ml-1">{log.eventType.replace("_", " ")}</span>
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full    flex items-center justify-center text-white text-xs font-semibold">
                              {log.userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium">{log.userName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm">{log.action}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{log.resource}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={log.result === "success" ? "bg-muted text-foreground border border" : "bg-muted text-foreground border border"}>
                            {log.result === "success" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                            {log.result}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-mono text-muted-foreground">{log.ipAddress}</span>
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
          {filteredLogs.length === 0 && (
            <Card className="border">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No audit logs found matching your search criteria</p>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{Math.min(filteredLogs.length, 100)}</span> of{" "}
              <span className="font-medium">{filteredLogs.length}</span> events
            </div>
            {filteredLogs.length > 100 && (
              <div className="text-sm text-muted-foreground">
                Use filters to narrow down results
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Compliance Info */}
      <Card className="border border bg-muted dark:bg-muted">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Shield className="mr-2 h-5 w-5 text-foreground" />
            Compliance & Retention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-white dark:bg-gray-900">
              <Calendar className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm">Retention Period</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Logs retained for 7 years per SOX compliance
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-white dark:bg-gray-900">
              <Shield className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm">Tamper-Proof</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Immutable audit trail with cryptographic integrity
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-white dark:bg-gray-900">
              <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm">Real-Time Logging</div>
                <div className="text-xs text-muted-foreground mt-1">
                  All events logged immediately with timestamps
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
            Audit Log Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Review failed access attempts regularly to identify security threats</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Monitor critical events for role and permission changes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Export logs periodically for compliance reporting and archival</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Set up alerts for suspicious patterns like repeated failed logins</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* View Log Details Modal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit event
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              {/* Log Header */}
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted">
                <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  {getEventIcon(selectedLog.eventType)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedLog.action}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedLog.eventType.replace("_", " ")}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge className={`${getEventTypeColor(selectedLog.eventType)} border`}>
                      {selectedLog.eventType}
                    </Badge>
                    <Badge className={selectedLog.result === "success" ? "bg-green-600" : "bg-red-600"}>
                      {selectedLog.result}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">User</h4>
                  </div>
                  <p className="text-lg font-medium">{selectedLog.userName}</p>
                  <p className="text-xs text-muted-foreground mt-1">Performed this action</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Timestamp</h4>
                  </div>
                  <p className="text-sm font-medium">{formatDateTime(selectedLog.timestamp)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selectedLog.timestamp).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">IP Address</h4>
                  </div>
                  <p className="text-sm font-mono font-medium">{selectedLog.ipAddress}</p>
                  <p className="text-xs text-muted-foreground mt-1">Source location</p>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">Resource</h4>
                  </div>
                  <p className="text-sm font-medium">{selectedLog.resource}</p>
                  <p className="text-xs text-muted-foreground mt-1">Target resource</p>
                </div>
              </div>

              {/* Action Details */}
              <div className="p-4 rounded-lg border bg-muted">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Action Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action:</span>
                    <span className="font-medium">{selectedLog.action}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event Type:</span>
                    <span className="font-medium">{selectedLog.eventType.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Result:</span>
                    <Badge className={selectedLog.result === "success" ? "bg-green-600" : "bg-red-600"}>
                      {selectedLog.result === "success" ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                      {selectedLog.result}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resource:</span>
                    <span className="font-medium">{selectedLog.resource}</span>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Security Information</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This audit log is cryptographically signed and tamper-proof. All system activities are logged for compliance and security monitoring purposes.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Log
            </Button>
            <Button onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Modal */}
      <Dialog open={isAdvancedFiltersOpen} onOpenChange={setIsAdvancedFiltersOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Apply detailed filters to narrow down audit log results
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={advancedFilters.startDate}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={advancedFilters.endDate}
                  onChange={(e) => setAdvancedFilters({ ...advancedFilters, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* IP Address */}
            <div className="space-y-2">
              <Label htmlFor="ip-address">IP Address</Label>
              <Input
                id="ip-address"
                placeholder="e.g., 192.168.1.1"
                value={advancedFilters.ipAddress}
                onChange={(e) => setAdvancedFilters({ ...advancedFilters, ipAddress: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Filter by specific IP address</p>
            </div>

            {/* Resource */}
            <div className="space-y-2">
              <Label htmlFor="resource">Resource</Label>
              <Input
                id="resource"
                placeholder="e.g., /api/users, dashboard"
                value={advancedFilters.resource}
                onChange={(e) => setAdvancedFilters({ ...advancedFilters, resource: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Filter by resource or endpoint</p>
            </div>

            {/* Current Filters Summary */}
            {(advancedFilters.startDate || advancedFilters.endDate || advancedFilters.ipAddress || advancedFilters.resource) && (
              <div className="p-4 rounded-lg border bg-muted">
                <h4 className="font-semibold mb-2 text-sm">Active Filters</h4>
                <div className="space-y-1 text-sm">
                  {advancedFilters.startDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{advancedFilters.startDate}</span>
                    </div>
                  )}
                  {advancedFilters.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span className="text-muted-foreground">End Date:</span>
                      <span className="font-medium">{advancedFilters.endDate}</span>
                    </div>
                  )}
                  {advancedFilters.ipAddress && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <span className="text-muted-foreground">IP Address:</span>
                      <span className="font-medium">{advancedFilters.ipAddress}</span>
                    </div>
                  )}
                  {advancedFilters.resource && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      <span className="text-muted-foreground">Resource:</span>
                      <span className="font-medium">{advancedFilters.resource}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleResetAdvancedFilters}
            >
              Reset Filters
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsAdvancedFiltersOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApplyAdvancedFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
