import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "logout":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      case "access_granted":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "access_denied":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "role_modified":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "permission_granted":
        return "bg-purple-500/10 text-purple-600 border-purple-200"
      case "user_created":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-200"
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
    alert("Audit logs would be exported to CSV")
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Audit Trail
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete system activity log for compliance and security monitoring
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <div className="rounded-full p-2 bg-rose-500/10">
              <FileText className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Audit log entries
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful operations
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <div className="rounded-full p-2 bg-red-500/10">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.failedAttempts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires investigation
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <div className="rounded-full p-2 bg-orange-500/10">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.criticalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-priority actions
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
                placeholder="Search by user, action, resource, or IP address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <select
              value={filterEventType}
              onChange={(e) => setFilterEventType(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Event Types</option>
              {eventTypes.slice(1).map((type) => (
                <option key={type} value={type}>{type.replace("_", " ")}</option>
              ))}
            </select>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Results</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Users</option>
              {users.slice(1).sort().slice(0, 20).map((user) => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
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
          <Card className="border-2">
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
                      <tr key={log.id} className="hover:bg-muted/50 transition-colors">
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
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
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
                          <Badge className={log.result === "success" ? "bg-green-500/10 text-green-600 border-green-200 border" : "bg-red-500/10 text-red-600 border-red-200 border"}>
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
            <Card className="border-2">
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
      <Card className="border-2 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Shield className="mr-2 h-5 w-5 text-rose-600" />
            Compliance & Retention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 bg-white dark:bg-gray-900">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Retention Period</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Logs retained for 7 years per SOX compliance
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-purple-200 bg-white dark:bg-gray-900">
              <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Tamper-Proof</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Immutable audit trail with cryptographic integrity
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border-green-200 bg-white dark:bg-gray-900">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
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
      <Card className="border-2 border-pink-200 bg-pink-50/50 dark:bg-pink-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-pink-600" />
            Audit Log Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-pink-600 mt-0.5" />
              <span>Review failed access attempts regularly to identify security threats</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-pink-600 mt-0.5" />
              <span>Monitor critical events for role and permission changes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-pink-600 mt-0.5" />
              <span>Export logs periodically for compliance reporting and archival</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-pink-600 mt-0.5" />
              <span>Set up alerts for suspicious patterns like repeated failed logins</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
