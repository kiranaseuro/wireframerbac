import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDate } from "@/lib/utils"
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  CheckSquare,
  AlertCircle,
  User,
  Calendar,
  FileText,
  TrendingUp,
  Zap,
  MessageSquare,
  History,
  ChevronRight,
  ListChecks,
  Timer
} from "lucide-react"

export default function ApprovalsPage() {
  const mockData = useAuthStore((state) => state.mockData)
  const user = useAuthStore((state) => state.user)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const allRequests = mockData.requests.filter((r) => r.status === "pending")

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    let filtered = allRequests

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((r) => r.priority === filterPriority)
    }

    // Filter by tab
    if (activeTab === "urgent") {
      filtered = filtered.filter((r) => r.priority === "urgent")
    } else if (activeTab === "recent") {
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
      filtered = filtered.filter((r) => new Date(r.requestedAt) >= twoDaysAgo)
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.justification.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [allRequests, filterPriority, activeTab, searchQuery])

  // Statistics
  const stats = {
    total: allRequests.length,
    urgent: allRequests.filter((r) => r.priority === "urgent").length,
    today: allRequests.filter((r) => {
      const today = new Date()
      const reqDate = new Date(r.requestedAt)
      return reqDate.toDateString() === today.toDateString()
    }).length,
    overdue: allRequests.filter((r) => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      return new Date(r.requestedAt) < threeDaysAgo
    }).length
  }

  const selectedRequestData = allRequests.find((r) => r.id === selectedRequest)

  const handleApprove = (requestId?: string) => {
    const id = requestId || selectedRequest
    if (id) {
      alert(`Request approved! ${comment ? `Comment: ${comment}` : ""}`)
      setSelectedRequest(null)
      setComment("")
      setSelectedItems(selectedItems.filter((i) => i !== id))
    }
  }

  const handleReject = (requestId?: string) => {
    const id = requestId || selectedRequest
    if (id) {
      alert(`Request rejected! ${comment ? `Comment: ${comment}` : ""}`)
      setSelectedRequest(null)
      setComment("")
      setSelectedItems(selectedItems.filter((i) => i !== id))
    }
  }

  const handleBulkApprove = () => {
    if (selectedItems.length > 0) {
      alert(`${selectedItems.length} requests approved!`)
      setSelectedItems([])
    }
  }

  const handleBulkReject = () => {
    if (selectedItems.length > 0) {
      alert(`${selectedItems.length} requests rejected!`)
      setSelectedItems([])
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredRequests.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredRequests.map((r) => r.id))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/10 text-red-600 border-red-200"
      case "high":
        return "bg-orange-500/10 text-orange-600 border-orange-200"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200"
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-200"
    }
  }

  const getTimeAgo = (date: Date | string) => {
    const now = new Date()
    const requestDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - requestDate.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Approval Center
          </h1>
          <p className="text-lg text-muted-foreground">
            Review and manage access requests from your team
          </p>
        </div>
        {user?.userRole === "super_admin" && (
          <Badge variant="destructive" className="h-8">
            <Zap className="mr-1 h-3 w-3" />
            Admin View
          </Badge>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <div className="rounded-full p-2 bg-blue-500/10">
              <ListChecks className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <div className="rounded-full p-2 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.today}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Submitted today
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <div className="rounded-full p-2 bg-orange-500/10">
              <Timer className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Older than 3 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, access type, or justification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="flex h-11 w-full md:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            {selectedItems.length > 0 && (
              <Button
                variant="outline"
                className="h-11"
                onClick={toggleSelectAll}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                {selectedItems.length === filteredRequests.length ? "Deselect All" : "Select All"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <Alert className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-900 dark:text-purple-100">
                {selectedItems.length} request{selectedItems.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleBulkApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve All
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkReject}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject All
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs for filtering */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            All ({allRequests.length})
          </TabsTrigger>
          <TabsTrigger value="urgent">
            Urgent ({stats.urgent})
          </TabsTrigger>
          <TabsTrigger value="recent">
            Recent ({stats.today})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Requests List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <Card
                    key={request.id}
                    className={`border-2 transition-all hover:shadow-lg ${
                      selectedRequest === request.id
                        ? "border-purple-500 shadow-lg"
                        : selectedItems.includes(request.id)
                        ? "border-blue-300"
                        : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(request.id)}
                            onChange={() => toggleSelectItem(request.id)}
                            className="mt-1 h-5 w-5 rounded border-input cursor-pointer"
                          />
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {request.requesterName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <CardTitle className="text-lg">
                                {request.requesterName}
                              </CardTitle>
                              <Badge
                                className={`${getPriorityColor(request.priority)} border`}
                              >
                                {request.priority}
                              </Badge>
                            </div>
                            <CardDescription className="flex items-center space-x-2 mt-1">
                              <span>{request.requesterEmail}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {getTimeAgo(request.requestedAt)}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2 p-3 rounded-lg bg-muted/50">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Requested Access:</p>
                            <p className="text-sm text-muted-foreground">
                              {request.itemName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 p-3 rounded-lg bg-muted/50">
                          <MessageSquare className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Justification:</p>
                            <p className="text-sm text-muted-foreground">
                              {request.justification}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Requested: {formatDate(request.requestedAt)}</span>
                          {request.isTemporary && (
                            <>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                Temporary Access
                              </Badge>
                            </>
                          )}
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-950"
                            onClick={() => setSelectedRequest(request.id)}
                          >
                            <ChevronRight className="mr-2 h-4 w-4" />
                            Review Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-2">
                  <CardContent className="py-16 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">All caught up!</h3>
                        <p className="text-muted-foreground">
                          No pending approvals at the moment
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Approval Action Panel */}
            <div>
              <Card className="sticky top-6 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {selectedRequest ? (
                      <>
                        <CheckSquare className="mr-2 h-5 w-5 text-purple-600" />
                        Review Request
                      </>
                    ) : (
                      <>
                        <History className="mr-2 h-5 w-5 text-muted-foreground" />
                        Action Panel
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {selectedRequest
                      ? "Make your decision on this request"
                      : "Select a request to review"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRequest && selectedRequestData ? (
                    <div className="space-y-4">
                      {/* Selected Request Summary */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {selectedRequestData.requesterName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {selectedRequestData.requesterName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedRequestData.requesterEmail}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="font-medium">
                            {selectedRequestData.itemName}
                          </p>
                          <Badge
                            className={`${getPriorityColor(
                              selectedRequestData.priority
                            )} border`}
                          >
                            {selectedRequestData.priority} priority
                          </Badge>
                        </div>
                      </div>

                      {/* Comments */}
                      <div>
                        <label className="text-sm font-semibold flex items-center mb-2">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Comments (optional)
                        </label>
                        <Textarea
                          placeholder="Add comments for the requester..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleApprove()}
                          className="w-full h-11 bg-green-600 hover:bg-green-700 font-semibold"
                        >
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Approve Request
                        </Button>
                        <Button
                          onClick={() => handleReject()}
                          variant="destructive"
                          className="w-full h-11 font-semibold"
                        >
                          <XCircle className="mr-2 h-5 w-5" />
                          Reject Request
                        </Button>
                        <Button
                          onClick={() => setSelectedRequest(null)}
                          variant="outline"
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">No request selected</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Click on a request to review and take action
                        </p>
                      </div>
                      {stats.urgent > 0 && (
                        <div className="pt-4">
                          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-900 dark:text-red-100">
                              <strong>{stats.urgent}</strong> urgent request
                              {stats.urgent > 1 ? "s" : ""} need
                              {stats.urgent === 1 ? "s" : ""} your attention
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="mt-4 border-2 border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Use bulk actions to approve multiple requests at once</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Filter by priority to focus on urgent items first</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Add comments to provide feedback to requesters</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
