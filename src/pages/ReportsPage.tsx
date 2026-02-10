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
import { Textarea } from "@/components/ui/textarea"
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
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false)
  const [isScheduleReportOpen, setIsScheduleReportOpen] = useState(false)
  const [isConfigureReportOpen, setIsConfigureReportOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [reportForm, setReportForm] = useState({
    name: "",
    description: "",
    category: "operational",
    frequency: "on_demand"
  })
  const [scheduleForm, setScheduleForm] = useState({
    reportId: "",
    frequency: "weekly",
    time: "09:00",
    recipients: ""
  })

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
        return "bg-muted text-foreground border"
      case "operational":
        return "bg-muted text-foreground border"
      case "security":
        return "bg-muted text-foreground border"
      case "user_activity":
        return "bg-muted text-foreground border"
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
        return "bg-muted text-foreground border"
      case "weekly":
        return "bg-muted text-foreground border"
      case "monthly":
        return "bg-muted text-foreground border"
      case "quarterly":
        return "bg-muted text-foreground border"
      case "on_demand":
        return "bg-gray-500/10 text-gray-600 border-gray-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const handleRunReport = (reportId: string) => {
    console.log(`Running report: ${reportId}`)
    alert("Report generated successfully! Download will begin shortly...")
  }

  const handleCreateReport = () => {
    if (reportForm.name && reportForm.description) {
      console.log("Creating report:", reportForm)
      alert(`Custom report "${reportForm.name}" created successfully!`)
      setIsCreateReportOpen(false)
      setReportForm({
        name: "",
        description: "",
        category: "operational",
        frequency: "on_demand"
      })
    }
  }

  const handleScheduleReport = () => {
    if (scheduleForm.reportId && scheduleForm.recipients) {
      console.log("Scheduling report:", scheduleForm)
      alert("Report scheduled successfully!")
      setIsScheduleReportOpen(false)
      setScheduleForm({
        reportId: "",
        frequency: "weekly",
        time: "09:00",
        recipients: ""
      })
    }
  }

  const handleConfigureReport = (report: any) => {
    setSelectedReport(report)
    setIsConfigureReportOpen(true)
  }

  const handleExportReport = (reportId: string) => {
    console.log(`Exporting report: ${reportId}`)
    alert("Report exported successfully!")
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight    text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate comprehensive reports for compliance, operations, and security
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={() => setIsScheduleReportOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button size="lg" onClick={() => setIsCreateReportOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Create Custom Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <BarChart3 className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available report types
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Clock className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Automated reports
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 30 Days</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <TrendingUp className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.last30Days}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recently generated
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <Star className="h-4 w-4 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.favorites}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pinned reports
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
                placeholder="Search reports by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterFrequency} onValueChange={setFilterFrequency}>
              <SelectTrigger className="h-11 w-full md:w-48">
                <SelectValue placeholder="All Frequencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                {frequencies.slice(1).map((freq) => (
                  <SelectItem key={freq} value={freq}>{freq.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Card key={report.id} className="border hover:shadow-lg transition-all hover:scale-[1.02] group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`h-12 w-12 rounded-lg    flex items-center justify-center text-white`}>
                        {getCategoryIcon(report.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg line-clamp-1">{report.name}</CardTitle>
                          {report.isFavorite && (
                            <Star className="h-4 w-4 text-foreground fill-yellow-500" />
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
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRunReport(report.id)
                      }}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Run Now
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExportReport(report.id)
                      }}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Export
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConfigureReport(report)
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <Card className="border">
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
      <Card className="border">
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <FileText className="mr-2 h-5 w-5 text-foreground" />
            Report Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <Shield className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">Compliance</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  SOX, GDPR, audit reports
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <BarChart3 className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">Operational</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  Role usage, access trends
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">Security</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  Access violations, threats
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border border bg-muted dark:bg-muted">
              <Users className="h-5 w-5 text-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm text-foreground dark:text-foreground">User Activity</div>
                <div className="text-xs text-foreground dark:text-foreground mt-1">
                  Login patterns, behaviors
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
            <Activity className="mr-2 h-5 w-5 text-foreground" />
            Reporting Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Schedule compliance reports for automatic monthly generation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Export reports in multiple formats (PDF, Excel, CSV) for stakeholder distribution</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Pin frequently used reports to favorites for quick access</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-foreground mt-0.5" />
              <span>Review security reports weekly to identify and address potential risks</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Create Custom Report Modal */}
      <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Custom Report</DialogTitle>
            <DialogDescription>
              Design a custom report tailored to your specific needs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Report Name */}
            <div className="space-y-2">
              <Label htmlFor="report-name">Report Name</Label>
              <Input
                id="report-name"
                placeholder="e.g., Quarterly Access Review"
                value={reportForm.name}
                onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="report-description">Description</Label>
              <Textarea
                id="report-description"
                placeholder="Describe what this report will cover..."
                value={reportForm.description}
                onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Category and Frequency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-category">Category</Label>
                <Select
                  value={reportForm.category}
                  onValueChange={(value) => setReportForm({ ...reportForm, category: value })}
                >
                  <SelectTrigger id="report-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="user_activity">User Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-frequency">Run Frequency</Label>
                <Select
                  value={reportForm.frequency}
                  onValueChange={(value) => setReportForm({ ...reportForm, frequency: value })}
                >
                  <SelectTrigger id="report-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_demand">On Demand</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Report Preview */}
            {reportForm.name && (
              <div className="p-4 rounded-lg border bg-muted">
                <h4 className="font-semibold mb-2 text-sm">Report Preview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    <span className="font-medium">{reportForm.name}</span>
                  </div>
                  {reportForm.description && (
                    <p className="text-muted-foreground text-xs ml-5">{reportForm.description}</p>
                  )}
                  <div className="flex gap-2 ml-5 mt-2">
                    <Badge>{reportForm.category.replace("_", " ")}</Badge>
                    <Badge variant="outline">{reportForm.frequency.replace("_", " ")}</Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateReportOpen(false)
                setReportForm({
                  name: "",
                  description: "",
                  category: "operational",
                  frequency: "on_demand"
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReport}
              disabled={!reportForm.name || !reportForm.description}
            >
              <FileText className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Modal */}
      <Dialog open={isScheduleReportOpen} onOpenChange={setIsScheduleReportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              Set up automatic report generation and delivery
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Select Report */}
            <div className="space-y-2">
              <Label htmlFor="schedule-report">Select Report</Label>
              <Select
                value={scheduleForm.reportId}
                onValueChange={(value) => setScheduleForm({ ...scheduleForm, reportId: value })}
              >
                <SelectTrigger id="schedule-report">
                  <SelectValue placeholder="Choose a report to schedule..." />
                </SelectTrigger>
                <SelectContent>
                  {mockData.reports.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{report.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Frequency and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-frequency">Frequency</Label>
                <Select
                  value={scheduleForm.frequency}
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, frequency: value })}
                >
                  <SelectTrigger id="schedule-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-time">Run Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                />
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-2">
              <Label htmlFor="schedule-recipients">Recipients (Email Addresses)</Label>
              <Textarea
                id="schedule-recipients"
                placeholder="Enter email addresses separated by commas..."
                value={scheduleForm.recipients}
                onChange={(e) => setScheduleForm({ ...scheduleForm, recipients: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Report will be sent automatically to these addresses
              </p>
            </div>

            {/* Schedule Summary */}
            {scheduleForm.reportId && scheduleForm.recipients && (
              <div className="p-4 rounded-lg border bg-muted">
                <h4 className="font-semibold mb-2 text-sm flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Report:</span>
                    <span className="font-medium">
                      {mockData.reports.find(r => r.id === scheduleForm.reportId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-medium capitalize">{scheduleForm.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{scheduleForm.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipients:</span>
                    <span className="font-medium">{scheduleForm.recipients.split(",").length} email(s)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsScheduleReportOpen(false)
                setScheduleForm({
                  reportId: "",
                  frequency: "weekly",
                  time: "09:00",
                  recipients: ""
                })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleReport}
              disabled={!scheduleForm.reportId || !scheduleForm.recipients}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Report Modal */}
      <Dialog open={isConfigureReportOpen} onOpenChange={setIsConfigureReportOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Report Configuration</DialogTitle>
            <DialogDescription>
              View and manage report settings
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted">
                <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                  {getCategoryIcon(selectedReport.category)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedReport.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReport.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge className={getCategoryColor(selectedReport.category)}>
                      {selectedReport.category.replace("_", " ")}
                    </Badge>
                    <Badge className={getFrequencyColor(selectedReport.frequency)}>
                      {selectedReport.frequency.replace("_", " ")}
                    </Badge>
                    {selectedReport.isFavorite && (
                      <Badge variant="outline">
                        <Star className="mr-1 h-3 w-3 fill-yellow-500" />
                        Favorite
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Configuration Options */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm capitalize">{selectedReport.category.replace("_", " ")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Run Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm capitalize">{selectedReport.frequency.replace("_", " ")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Last Run</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedReport.lastRun ? formatDate(selectedReport.lastRun) : "Never"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">PDF, Excel, CSV</p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="p-4 rounded-lg border bg-muted">
                <h4 className="font-semibold mb-3 text-sm">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsConfigureReportOpen(false)
                      handleRunReport(selectedReport.id)
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsConfigureReportOpen(false)
                      setScheduleForm({ ...scheduleForm, reportId: selectedReport.id })
                      setIsScheduleReportOpen(true)
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportReport(selectedReport.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log("Adding to favorites:", selectedReport.id)
                      alert("Report added to favorites!")
                    }}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    {selectedReport.isFavorite ? "Remove Favorite" : "Add Favorite"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsConfigureReportOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
