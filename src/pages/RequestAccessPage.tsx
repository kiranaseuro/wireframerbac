import { useState, useMemo } from "react"
import { useAuthStore } from "@/stores/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  CheckCircle,
  Shield,
  Clock,
  FileCheck,
  Users,
  Lock,
  Star,
  TrendingUp,
  AlertCircle,
  Send
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function RequestAccessPage() {
  const user = useAuthStore((state) => state.user)
  const mockData = useAuthStore((state) => state.mockData)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [justification, setJustification] = useState("")
  const [priority, setPriority] = useState("normal")
  const [isTemporary, setIsTemporary] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")

  const activeRoles = mockData.roles.filter((role) => role.status === "active")

  // Filter logic
  const filteredRoles = useMemo(() => {
    let filtered = activeRoles

    if (activeCategory !== "all") {
      filtered = filtered.filter((role) => role.department === activeCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [activeRoles, activeCategory, searchQuery])

  // Get unique departments for categories
  const departments = ["all", ...Array.from(new Set(activeRoles.map((r) => r.department)))]

  // Statistics
  const stats = {
    availableRoles: activeRoles.length,
    popularRoles: activeRoles.filter((r) => r.userCount > 20).length,
    myPendingRequests: mockData.requests.filter((r) => r.requesterId === user?.id && r.status === "pending").length,
    avgApprovalTime: "2.5 days"
  }

  const selectedRoleData = selectedRole ? mockData.roles.find((r) => r.id === selectedRole) : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      navigate("/my-requests")
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md border-2 shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="rounded-full bg-green-500/10 p-6 border-4 border-green-200">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold">Request Submitted!</h3>
                <p className="text-muted-foreground text-lg">
                  Your access request has been submitted for approval.
                </p>
              </div>
              <div className="w-full p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  📧 You'll receive an email notification once your request is reviewed.
                </p>
              </div>
              <Button onClick={() => navigate("/my-requests")} size="lg" className="w-full">
                View My Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Request Access
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse available roles and submit access requests
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Roles</CardTitle>
            <div className="rounded-full p-2 bg-blue-500/10">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.availableRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active roles to request
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Roles</CardTitle>
            <div className="rounded-full p-2 bg-orange-500/10">
              <Star className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.popularRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Most requested
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Pending</CardTitle>
            <div className="rounded-full p-2 bg-purple-500/10">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.myPendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Approval</CardTitle>
            <div className="rounded-full p-2 bg-green-500/10">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.avgApprovalTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average wait time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </CardContent>
      </Card>

      {/* Department Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full max-w-4xl flex-wrap h-auto">
          {departments.map((dept) => (
            <TabsTrigger key={dept} value={dept} className="capitalize">
              {dept === "all" ? "All Roles" : dept}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Roles Grid */}
            <div className="lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredRoles.slice(0, 12).map((role) => (
                  <Card
                    key={role.id}
                    className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                      selectedRole === role.id
                        ? "border-orange-500 shadow-lg bg-orange-50/50 dark:bg-orange-950/20"
                        : "hover:border-orange-300"
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                            <Shield className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{role.name}</CardTitle>
                            <CardDescription className="text-xs">{role.department}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">{role.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-2">{role.description}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs">
                        <div className="flex items-center">
                          <Lock className="mr-1 h-3 w-3 text-blue-600" />
                          <span className="text-muted-foreground">{role.permissions.length} permissions</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center">
                          <Users className="mr-1 h-3 w-3 text-purple-600" />
                          <span className="text-muted-foreground">{role.userCount} users</span>
                        </div>
                      </div>
                      {role.userCount > 30 && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          <Star className="mr-1 h-3 w-3 text-orange-500" />
                          Popular
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredRoles.length === 0 && (
                <Card className="border-2">
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground">No roles found matching your search</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Request Form */}
            <div>
              <Card className="sticky top-6 border-2 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileCheck className="mr-2 h-5 w-5 text-orange-600" />
                    Request Details
                  </CardTitle>
                  <CardDescription>Complete the form to submit your request</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Selected Role Display */}
                    <div className="space-y-2">
                      <Label>Selected Role</Label>
                      {selectedRoleData ? (
                        <div className="p-3 rounded-lg border-2 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
                          <div className="font-medium">{selectedRoleData.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {selectedRoleData.department} • {selectedRoleData.level}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {selectedRoleData.permissions.length} permissions included
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg border-2 border-dashed text-center text-sm text-muted-foreground">
                          No role selected. Click a role card to select.
                        </div>
                      )}
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        <option value="low">Low - No rush</option>
                        <option value="normal">Normal - Standard process</option>
                        <option value="high">High - Needed soon</option>
                        <option value="urgent">Urgent - Business critical</option>
                      </select>
                    </div>

                    {/* Temporary Access */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="temporary"
                        checked={isTemporary}
                        onChange={(e) => setIsTemporary(e.target.checked)}
                        className="h-4 w-4 rounded border-input"
                      />
                      <Label htmlFor="temporary" className="text-sm font-normal cursor-pointer">
                        This is temporary access (will expire)
                      </Label>
                    </div>

                    {/* Justification */}
                    <div className="space-y-2">
                      <Label htmlFor="justification">
                        Business Justification <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="justification"
                        placeholder="Explain why you need this access and how you'll use it..."
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        required
                        rows={6}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        {justification.length}/20 characters minimum
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      disabled={!selectedRole || justification.length < 20}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
