/**
 * Super Admin Dashboard Wireframe
 * Comprehensive system overview for super administrators
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Users,
  Key,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Server,
  Settings,
  FileText,
  BarChart3,
  UserPlus,
  UserX,
  RefreshCw,
  Download
} from 'lucide-react';

export default function SuperAdminDashboard() {
  // Mock system statistics
  const systemStats = {
    totalUsers: 847,
    activeUsers: 823,
    inactiveUsers: 24,
    suspendedUsers: 0,
    totalRoles: 45,
    totalPermissions: 342,
    totalGroups: 28,
    pendingRequests: 15,
    criticalAlerts: 3,
    adSyncStatus: 'healthy',
    lastAdSync: '2 hours ago',
    systemUptime: '99.98%',
    avgResponseTime: '124ms'
  };

  // Recent security alerts
  const securityAlerts = [
    {
      severity: 'high',
      type: 'Multiple Failed Logins',
      user: 'john.doe@fmg.com',
      time: '5 minutes ago',
      status: 'investigating'
    },
    {
      severity: 'medium',
      type: 'Privilege Escalation Attempt',
      user: 'sarah.wilson@fmg.com',
      time: '1 hour ago',
      status: 'resolved'
    },
    {
      severity: 'high',
      type: 'Unauthorized Access Attempt',
      user: 'unknown@external.com',
      time: '3 hours ago',
      status: 'blocked'
    }
  ];

  // Recent admin actions
  const recentActions = [
    { action: 'Created Role', target: 'Senior Developer', user: 'Alice Admin', time: '10 minutes ago' },
    { action: 'Modified Permission', target: 'finance.write', user: 'Alice Admin', time: '25 minutes ago' },
    { action: 'Approved Request', target: 'Access Request #1245', user: 'Jane Smith', time: '1 hour ago' },
    { action: 'Synced AD Users', target: '23 new users', user: 'System', time: '2 hours ago' },
    { action: 'Suspended User', target: 'bob.inactive@fmg.com', user: 'Alice Admin', time: '3 hours ago' },
  ];

  // System health metrics
  const healthMetrics = [
    { name: 'API Response Time', value: '124ms', status: 'healthy', trend: 'down' },
    { name: 'Database Performance', value: '98%', status: 'healthy', trend: 'up' },
    { name: 'AD Sync Status', value: 'Connected', status: 'healthy', trend: 'stable' },
    { name: 'Authentication Success', value: '99.7%', status: 'healthy', trend: 'up' },
  ];

  // Permission risk analysis
  const riskAnalysis = [
    { category: 'Critical Permissions', count: 15, users: 8, trend: 'stable' },
    { category: 'High Risk Users', count: 12, permissions: 45, trend: 'up' },
    { category: 'Orphaned Permissions', count: 5, lastUsed: '90+ days', trend: 'stable' },
    { category: 'Compliance Violations', count: 2, severity: 'medium', trend: 'down' },
  ];

  // Top users by permissions
  const topUsers = [
    { name: 'Alice Admin', email: 'alice.admin@fmg.com', permissions: 342, roles: 5, risk: 'high' },
    { name: 'System Service Account', email: 'svc_system@fmg.com', permissions: 298, roles: 3, risk: 'critical' },
    { name: 'Bob IT Admin', email: 'bob.admin@fmg.com', permissions: 234, roles: 4, risk: 'high' },
    { name: 'Jane Manager', email: 'jane.smith@fmg.com', permissions: 156, roles: 3, risk: 'medium' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Shield className="mr-3 h-8 w-8 text-red-600" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System-wide overview and administrative controls
          </p>
        </div>
        <Badge variant="destructive" className="text-sm px-3 py-1">
          <Lock className="mr-1 h-4 w-4" />
          Super Admin Access
        </Badge>
      </div>

      {/* Critical Alerts */}
      {securityAlerts.filter(a => a.status === 'investigating').length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong>{systemStats.criticalAlerts} critical security alerts</strong> require immediate attention
            </span>
            <Button variant="outline" size="sm">
              View All Alerts
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {systemStats.activeUsers} active
              </span>
              <span>•</span>
              <span className="flex items-center text-yellow-600">
                <Clock className="mr-1 h-3 w-3" />
                {systemStats.inactiveUsers} inactive
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles & Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalRoles}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
              <span>Roles</span>
              <span>•</span>
              <span>{systemStats.totalPermissions} permissions</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{systemStats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AD Sync Status</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Healthy</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last sync: {systemStats.lastAdSync}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Security Alerts</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Security Alerts Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Alerts</CardTitle>
                  <CardDescription>Real-time security incidents and threats</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {securityAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        alert.severity === 'high' ? 'text-red-600' :
                        alert.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}
                    />
                    <div>
                      <div className="font-medium">{alert.type}</div>
                      <div className="text-sm text-muted-foreground">{alert.user}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{alert.time}</span>
                    <Badge
                      variant={
                        alert.status === 'investigating' ? 'destructive' :
                        alert.status === 'resolved' ? 'default' :
                        'secondary'
                      }
                    >
                      {alert.status}
                    </Badge>
                    <Button variant="outline" size="sm">Investigate</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                  {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                  {metric.trend === 'stable' && <Server className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center mt-2">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      metric.status === 'healthy' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-xs text-muted-foreground capitalize">{metric.status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm text-muted-foreground">System Uptime</span>
                  <span className="font-semibold">{systemStats.systemUptime}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                  <span className="font-semibold">{systemStats.avgResponseTime}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm text-muted-foreground">Total Groups</span>
                  <span className="font-semibold">{systemStats.totalGroups}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <span className="font-semibold">423</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Permission Risk Analysis</CardTitle>
                  <CardDescription>Identify and mitigate security risks</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Full Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskAnalysis.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{risk.category}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {risk.count} items • {Object.entries(risk).filter(([k]) => !['category', 'count', 'trend'].includes(k)).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                    </div>
                  </div>
                  <Badge variant={risk.count > 10 ? 'destructive' : risk.count > 5 ? 'default' : 'secondary'}>
                    {risk.trend === 'up' && <TrendingUp className="mr-1 h-3 w-3" />}
                    {risk.trend === 'down' && <TrendingDown className="mr-1 h-3 w-3" />}
                    {risk.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Users by Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>High-Privilege Users</CardTitle>
              <CardDescription>Users with the most permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{user.permissions} permissions</div>
                      <div className="text-xs text-muted-foreground">{user.roles} roles</div>
                    </div>
                    <Badge
                      variant={
                        user.risk === 'critical' ? 'destructive' :
                        user.risk === 'high' ? 'default' :
                        'secondary'
                      }
                    >
                      {user.risk}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Administrative Actions</CardTitle>
              <CardDescription>Latest system modifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentActions.map((action, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{action.action}</span>
                      <span className="text-xs text-muted-foreground">{action.time}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {action.target}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      by {action.user}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Super Admin Actions</CardTitle>
          <CardDescription>System-wide administrative controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex-col">
              <RefreshCw className="h-5 w-5 mb-2" />
              <span className="text-sm">Sync AD Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-5 w-5 mb-2" />
              <span className="text-sm">System Settings</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-5 w-5 mb-2" />
              <span className="text-sm">Audit Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Database className="h-5 w-5 mb-2" />
              <span className="text-sm">Database Backup</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
