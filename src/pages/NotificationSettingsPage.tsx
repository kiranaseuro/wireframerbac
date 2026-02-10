import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Mail,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Send,
  Save
} from "lucide-react"

interface NotificationPreference {
  id: string
  label: string
  description: string
  enabled: boolean
  category: string
}

export default function NotificationSettingsPage() {
  const [email, setEmail] = useState("user@fmg.com")
  const [frequency, setFrequency] = useState("immediate")
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [quietHoursStart, setQuietHoursStart] = useState("22:00")
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00")

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    // Access Requests
    { id: "req_new", label: "New Request Submitted", description: "When you submit a new access request", enabled: true, category: "requests" },
    { id: "req_approved", label: "Request Approved", description: "When your access request is approved", enabled: true, category: "requests" },
    { id: "req_rejected", label: "Request Rejected", description: "When your access request is rejected", enabled: true, category: "requests" },
    { id: "req_additional", label: "Additional Information Needed", description: "When approver needs more details", enabled: true, category: "requests" },

    // Approvals (for managers)
    { id: "app_new", label: "New Approval Required", description: "When a request needs your approval", enabled: true, category: "approvals" },
    { id: "app_reminder", label: "Approval Reminder", description: "Daily reminder for pending approvals", enabled: true, category: "approvals" },
    { id: "app_urgent", label: "Urgent Approval", description: "High-priority requests needing immediate attention", enabled: true, category: "approvals" },
    { id: "app_overdue", label: "Overdue Approval", description: "When approvals are past due date", enabled: true, category: "approvals" },

    // Access Changes
    { id: "access_granted", label: "Access Granted", description: "When new access is granted to you", enabled: true, category: "access" },
    { id: "access_revoked", label: "Access Revoked", description: "When access is removed from your account", enabled: true, category: "access" },
    { id: "access_expiring_7", label: "Access Expiring (7 days)", description: "7 days before access expires", enabled: true, category: "access" },
    { id: "access_expiring_3", label: "Access Expiring (3 days)", description: "3 days before access expires", enabled: true, category: "access" },
    { id: "access_expiring_1", label: "Access Expiring (1 day)", description: "1 day before access expires", enabled: true, category: "access" },
    { id: "access_expired", label: "Access Expired", description: "When your access has expired", enabled: true, category: "access" },

    // Security & Compliance
    { id: "sec_failed_login", label: "Failed Login Attempts", description: "Multiple failed login attempts detected", enabled: true, category: "security" },
    { id: "sec_suspicious", label: "Suspicious Activity", description: "Unusual activity on your account", enabled: true, category: "security" },
    { id: "sec_privilege", label: "Privilege Escalation", description: "When elevated permissions are granted", enabled: true, category: "security" },
    { id: "comp_certification", label: "Certification Due", description: "Access certification review required", enabled: true, category: "security" },
    { id: "comp_review", label: "Access Review", description: "Periodic access review notification", enabled: false, category: "security" },

    // Administrative (for admins)
    { id: "admin_config", label: "Configuration Changes", description: "System configuration modifications", enabled: false, category: "admin" },
    { id: "admin_bulk", label: "Bulk Operations", description: "Completion of bulk user operations", enabled: false, category: "admin" },
    { id: "admin_sync", label: "AD Sync Status", description: "Active Directory synchronization updates", enabled: true, category: "admin" },
    { id: "admin_reports", label: "Report Generation", description: "When scheduled reports are ready", enabled: false, category: "admin" },
  ])

  const togglePreference = (id: string) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    )
  }

  const toggleCategory = (category: string, enabled: boolean) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.category === category ? { ...pref, enabled } : pref
      )
    )
  }

  const handleSave = () => {
    alert("Notification preferences saved successfully!")
    // TODO: API call to save preferences
  }

  const handleTestEmail = () => {
    alert(`Test email sent to ${email}`)
    // TODO: API call to send test email
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "requests": return <CheckCircle className="h-5 w-5" />
      case "approvals": return <Clock className="h-5 w-5" />
      case "access": return <Shield className="h-5 w-5" />
      case "security": return <AlertTriangle className="h-5 w-5" />
      case "admin": return <Settings className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }


  const getEnabledCount = (category: string) => {
    return preferences.filter(p => p.category === category && p.enabled).length
  }

  const getTotalCount = (category: string) => {
    return preferences.filter(p => p.category === category).length
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Notification Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your email notification preferences and delivery settings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleTestEmail}>
            <Send className="mr-2 h-4 w-4" />
            Send Test Email
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="delivery">
            <Mail className="mr-2 h-4 w-4" />
            Delivery Settings
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Access Requests */}
          <Card className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon("requests")}
                  <div>
                    <CardTitle>Access Requests</CardTitle>
                    <CardDescription>
                      Notifications about your access request submissions and status updates
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {getEnabledCount("requests")} / {getTotalCount("requests")} enabled
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="requests-all">Enable All</Label>
                    <Switch
                      id="requests-all"
                      checked={getEnabledCount("requests") === getTotalCount("requests")}
                      onCheckedChange={(checked: boolean) => toggleCategory("requests", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences.filter(p => p.category === "requests").map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Label htmlFor={pref.id} className="font-medium cursor-pointer">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={pref.enabled}
                    onCheckedChange={() => togglePreference(pref.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Approvals */}
          <Card className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon("approvals")}
                  <div>
                    <CardTitle>Approvals</CardTitle>
                    <CardDescription>
                      Notifications for managers about pending access requests requiring approval
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {getEnabledCount("approvals")} / {getTotalCount("approvals")} enabled
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="approvals-all">Enable All</Label>
                    <Switch
                      id="approvals-all"
                      checked={getEnabledCount("approvals") === getTotalCount("approvals")}
                      onCheckedChange={(checked: boolean) => toggleCategory("approvals", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences.filter(p => p.category === "approvals").map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Label htmlFor={pref.id} className="font-medium cursor-pointer">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={pref.enabled}
                    onCheckedChange={() => togglePreference(pref.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Access Changes */}
          <Card className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon("access")}
                  <div>
                    <CardTitle>Access Changes</CardTitle>
                    <CardDescription>
                      Notifications when your access permissions are granted, revoked, or expiring
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {getEnabledCount("access")} / {getTotalCount("access")} enabled
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="access-all">Enable All</Label>
                    <Switch
                      id="access-all"
                      checked={getEnabledCount("access") === getTotalCount("access")}
                      onCheckedChange={(checked: boolean) => toggleCategory("access", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences.filter(p => p.category === "access").map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Label htmlFor={pref.id} className="font-medium cursor-pointer">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={pref.enabled}
                    onCheckedChange={() => togglePreference(pref.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security & Compliance */}
          <Card className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon("security")}
                  <div>
                    <CardTitle>Security & Compliance</CardTitle>
                    <CardDescription>
                      Important security alerts and compliance reminders
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {getEnabledCount("security")} / {getTotalCount("security")} enabled
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="security-all">Enable All</Label>
                    <Switch
                      id="security-all"
                      checked={getEnabledCount("security") === getTotalCount("security")}
                      onCheckedChange={(checked: boolean) => toggleCategory("security", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences.filter(p => p.category === "security").map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Label htmlFor={pref.id} className="font-medium cursor-pointer">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={pref.enabled}
                    onCheckedChange={() => togglePreference(pref.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Administrative */}
          <Card className="border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon("admin")}
                  <div>
                    <CardTitle>Administrative</CardTitle>
                    <CardDescription>
                      System administration and operational notifications
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {getEnabledCount("admin")} / {getTotalCount("admin")} enabled
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="admin-all">Enable All</Label>
                    <Switch
                      id="admin-all"
                      checked={getEnabledCount("admin") === getTotalCount("admin")}
                      onCheckedChange={(checked: boolean) => toggleCategory("admin", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferences.filter(p => p.category === "admin").map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <Label htmlFor={pref.id} className="font-medium cursor-pointer">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={pref.enabled}
                    onCheckedChange={() => togglePreference(pref.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings Tab */}
        <TabsContent value="delivery" className="space-y-6">
          <Card className="border">
            <CardHeader>
              <CardTitle>Email Address</CardTitle>
              <CardDescription>
                Email address where notifications will be sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Primary Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@fmg.com"
                />
                <p className="text-sm text-muted-foreground">
                  This is the email address associated with your account
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle>Notification Frequency</CardTitle>
              <CardDescription>
                How often you want to receive email notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Delivery Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate - Send as events occur</SelectItem>
                    <SelectItem value="hourly">Hourly Digest - Combine into hourly summaries</SelectItem>
                    <SelectItem value="daily">Daily Digest - Once per day summary</SelectItem>
                    <SelectItem value="weekly">Weekly Digest - Once per week summary</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {frequency === "immediate" && "Critical notifications are always sent immediately"}
                  {frequency === "hourly" && "Notifications are bundled and sent every hour"}
                  {frequency === "daily" && "Receive one email per day with all notifications"}
                  {frequency === "weekly" && "Receive one email per week with all notifications"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>
                Pause non-critical notifications during specific hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                  <p className="text-sm text-muted-foreground">
                    Non-urgent notifications will be held until quiet hours end
                  </p>
                </div>
                <Switch
                  id="quiet-hours"
                  checked={quietHoursEnabled}
                  onCheckedChange={setQuietHoursEnabled}
                />
              </div>

              {quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-start">Start Time</Label>
                    <Input
                      id="quiet-start"
                      type="time"
                      value={quietHoursStart}
                      onChange={(e) => setQuietHoursStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-end">End Time</Label>
                    <Input
                      id="quiet-end"
                      type="time"
                      value={quietHoursEnd}
                      onChange={(e) => setQuietHoursEnd(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground col-span-2">
                    Quiet hours: {quietHoursStart} to {quietHoursEnd}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
