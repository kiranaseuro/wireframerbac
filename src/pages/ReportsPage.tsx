import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  Calendar,
  Search,
  Star,
  BarChart3,
  Clock,
  TrendingUp,
  Play,
  Settings,
  CheckCircle2,
  Shield,
  Users,
  Activity
} from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ReportsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterFrequency, setFilterFrequency] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Get unique categories and frequencies
  const categories = ["all", ...Array.from(new Set(mockData.reports.map((r) => r.category)))]
  const frequencies = ["all", ...Array.from(new Set(mockData.reports.map((r) => r.frequency)))]

  // Filter logic
  const filteredReports = useMemo(() => {
    let filtered = mockData.reports

    // Tab filtering
    if (activeTab !== "all") {
      if (activeTab === "favorites") {
        filtered = filtered.filter((r) => r.isFavorite)
      } else {
        filtered = filtered.filter((r) => r.category === activeTab)
      }
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((r) => r.category === filterCategory)
    }

    // Frequency filter
    if (filterFrequency !== "all") {
      filtered = filtered.filter((r) => r.frequency === filterFrequency)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [mockData.reports, activeTab, filterCategory, filterFrequency, searchQuery])

  // Statistics
  const stats = {
    totalReports: mockData.reports.length,
    scheduled: mockData.reports.filter((r) => r.frequency !== "on_demand").length,
    last30Days: mockData.reports.filter((r) => {
      if (!r.lastRun) return false
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(r.lastRun) > thirtyDaysAgo
    }).length,
    favorites: mockData.reports.filter((r) => r.isFavorite).length
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "compliance":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "operational":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "security":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "user_activity":
        return "bg-purple-500/10 text-purple-600 border-purple-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "compliance":
        return <Shield className="h-5 w-5" />
      case "operational":
        return <BarChart3 className="h-5 w-5" />
      case "security":
        return <CheckCircle2 className="h-5 w-5" />
      case "user_activity":
        return <Users className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "weekly":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "monthly":
        return "bg-purple-500/10 text-purple-600 border-purple-200"
      case "quarterly":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "on_demand":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const handleRunReport = (reportId: string) => {
    alert(`Running report: ${reportId}`)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate comprehensive reports for compliance, operations, and security
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button size="lg" className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700">
            <FileText className="mr-2 h-4 w-4" />
            Create Custom Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <div className="rounded-full p-2 bg-fuchsia-500/10">
              <BarChart3 className="h-4 w-4 text-fuchsia-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available report types
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <div className="rounded-full p-2 bg-blue-500/10">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Automated reports
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.last30Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recently generated
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <div className="rounded-full p-2 bg-yellow-500/10">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.favorites}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pinned reports
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
                placeholder="Search reports by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>{cat.replace("_", " ")}</option>
              ))}
            </select>
            <select
              value={filterFrequency}
              onChange={(e) => setFilterFrequency(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Frequencies</option>
              {frequencies.slice(1).map((freq) => (
                <option key={freq} value={freq}>{freq.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="all">All ({mockData.reports.length})</TabsTrigger>
          <TabsTrigger value="compliance">
            Compliance ({mockData.reports.filter((r) => r.category === "compliance").length})
          </TabsTrigger>
          <TabsTrigger value="operational">
            Operational ({mockData.reports.filter((r) => r.category === "operational").length})
          </TabsTrigger>
          <TabsTrigger value="security">
            Security ({mockData.reports.filter((r) => r.category === "security").length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites ({stats.favorites})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <Card key={report.id} className="border-2 hover:shadow-lg transition-all hover:scale-[1.02] group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-500 flex items-center justify-center text-white`}>
                        {getCategoryIcon(report.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg line-clamp-1">{report.name}</CardTitle>
                          {report.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <CardDescription className="text-xs mt-1 line-clamp-2">
                          {report.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Info Blocks */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col p-2 rounded-lg bg-muted/50">
                      <span className="text-xs text-muted-foreground mb-1">Category</span>
                      <Badge className={`${getCategoryColor(report.category)} border text-xs w-fit`}>
                        {report.category.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex flex-col p-2 rounded-lg bg-muted/50">
                      <span className="text-xs text-muted-foreground mb-1">Frequency</span>
                      <Badge className={`${getFrequencyColor(report.frequency)} border text-xs w-fit`}>
                        {report.frequency.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Last Run */}
                  {report.lastRun && (
                    <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Last run:</span>
                      </div>
                      <span className="font-medium">{formatDate(report.lastRun)}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRunReport(report.id)}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Run Now
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No reports found matching your search criteria</p>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredReports.length}</span> report{filteredReports.length !== 1 ? 's' : ''}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Categories Info */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <FileText className="mr-2 h-5 w-5 text-fuchsia-600" />
            Report Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-red-200 bg-red-50/50 dark:bg-red-950/20">
              <Shield className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-red-900 dark:text-red-100">Compliance</div>
                <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                  SOX, GDPR, audit reports
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-blue-900 dark:text-blue-100">Operational</div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Role usage, access trends
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
              <CheckCircle2 className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-orange-900 dark:text-orange-100">Security</div>
                <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Access violations, threats
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border-2 border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
              <Users className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <div className="font-medium text-sm text-purple-900 dark:text-purple-100">User Activity</div>
                <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                  Login patterns, behaviors
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="border-2 border-fuchsia-200 bg-fuchsia-50/50 dark:bg-fuchsia-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Activity className="mr-2 h-5 w-5 text-fuchsia-600" />
            Reporting Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-fuchsia-600 mt-0.5" />
              <span>Schedule compliance reports for automatic monthly generation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-fuchsia-600 mt-0.5" />
              <span>Export reports in multiple formats (PDF, Excel, CSV) for stakeholder distribution</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-fuchsia-600 mt-0.5" />
              <span>Pin frequently used reports to favorites for quick access</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-fuchsia-600 mt-0.5" />
              <span>Review security reports weekly to identify and address potential risks</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
