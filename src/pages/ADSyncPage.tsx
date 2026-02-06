/**
 * Active Directory Sync Wireframe
 * Shows how AD users will be synced and managed
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Users,
  Shield,
  Settings,
  Clock,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

export default function ADSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(new Date());

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync(new Date());
    }, 2000);
  };

  // Mock sync statistics
  const syncStats = {
    totalUsers: 847,
    syncedUsers: 847,
    newUsers: 23,
    updatedUsers: 145,
    errors: 0,
    lastSyncDuration: '2.3s'
  };

  // Mock AD configuration
  const adConfig = {
    tenantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    status: 'connected'
  };

  // Mock recent sync users
  const recentSyncedUsers = [
    { name: 'John Anderson', email: 'john.anderson@fmg.com', department: 'Engineering', status: 'synced', groups: ['Developers', 'Team Leads'] },
    { name: 'Sarah Mitchell', email: 'sarah.mitchell@fmg.com', department: 'Finance', status: 'synced', groups: ['Finance Team', 'Managers'] },
    { name: 'Michael Chen', email: 'michael.chen@fmg.com', department: 'IT Operations', status: 'synced', groups: ['IT Support', 'Admins'] },
    { name: 'Emily Rodriguez', email: 'emily.rodriguez@fmg.com', department: 'HR', status: 'updated', groups: ['HR Department'] },
    { name: 'David Kim', email: 'david.kim@fmg.com', department: 'Engineering', status: 'new', groups: ['Developers'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Directory Sync</h1>
          <p className="text-muted-foreground">
            Synchronize users from Microsoft Active Directory
          </p>
        </div>
        <Button onClick={handleSync} disabled={syncing} size="lg">
          <RefreshCw className={`mr-2 h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Microsoft Graph API Configuration</CardDescription>
            </div>
            {adConfig.status === 'connected' ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />
                Disconnected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tenant ID</Label>
              <Input
                type="text"
                value={adConfig.tenantId}
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input
                type="text"
                value={adConfig.clientId}
                readOnly
                className="font-mono text-sm"
              />
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Configure Settings
          </Button>
        </CardContent>
      </Card>

      {/* Sync Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              In Active Directory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{syncStats.newUsers}</div>
            <p className="text-xs text-muted-foreground">
              From last sync
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updated</CardTitle>
            <Upload className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{syncStats.updatedUsers}</div>
            <p className="text-xs text-muted-foreground">
              Modified users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.lastSyncDuration}</div>
            <p className="text-xs text-muted-foreground">
              {lastSync?.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sync Details Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Details</CardTitle>
          <CardDescription>View synchronized users and group mappings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Recent Synced Users</TabsTrigger>
              <TabsTrigger value="groups">Group Mappings</TabsTrigger>
              <TabsTrigger value="logs">Sync Logs</TabsTrigger>
            </TabsList>

            {/* Recent Synced Users */}
            <TabsContent value="users" className="space-y-4">
              <div className="space-y-3">
                {recentSyncedUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{user.department}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.groups.join(', ')}
                        </div>
                      </div>
                      <Badge
                        variant={user.status === 'new' ? 'default' : user.status === 'updated' ? 'secondary' : 'outline'}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Group Mappings */}
            <TabsContent value="groups" className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Configure how AD security groups map to RBAC roles
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {[
                  { adGroup: 'Domain Admins', role: 'Super Admin', users: 5, color: 'bg-red-500' },
                  { adGroup: 'IT Support', role: 'Help Desk', users: 23, color: 'bg-blue-500' },
                  { adGroup: 'Developers', role: 'Developer', users: 156, color: 'bg-green-500' },
                  { adGroup: 'Managers', role: 'Manager', users: 45, color: 'bg-purple-500' },
                  { adGroup: 'Finance Team', role: 'Finance User', users: 34, color: 'bg-yellow-500' },
                ].map((mapping, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`h-3 w-3 rounded-full ${mapping.color}`} />
                      <div>
                        <div className="font-medium">{mapping.adGroup}</div>
                        <div className="text-sm text-muted-foreground">{mapping.users} users</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline">{mapping.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Configure Group Mappings
              </Button>
            </TabsContent>

            {/* Sync Logs */}
            <TabsContent value="logs" className="space-y-4">
              <div className="space-y-2 font-mono text-sm">
                {[
                  { time: '14:32:15', type: 'success', message: 'Sync completed successfully' },
                  { time: '14:32:14', type: 'info', message: 'Updated 145 existing users' },
                  { time: '14:32:13', type: 'info', message: 'Added 23 new users' },
                  { time: '14:32:11', type: 'info', message: 'Fetched 847 users from AD' },
                  { time: '14:32:10', type: 'success', message: 'Authenticated with Microsoft Graph API' },
                  { time: '14:32:09', type: 'info', message: 'Starting AD sync process' },
                ].map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50">
                    <span className="text-muted-foreground">[{log.time}]</span>
                    {log.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : log.type === 'error' ? (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                    )}
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
