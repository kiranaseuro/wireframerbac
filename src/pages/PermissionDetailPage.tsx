/**
 * Permission Detail Wireframe
 * Shows detailed view of how permissions are displayed and managed
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Lock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Users,
  Building2,
  Database,
  FileText,
  Settings,
  Activity
} from 'lucide-react';

export default function PermissionDetailPage() {
  const [selectedPermission, setSelectedPermission] = useState('read_financial_data');

  // Mock permission data with comprehensive details
  const permissions = {
    read_financial_data: {
      id: 'perm_001',
      name: 'Read Financial Data',
      code: 'finance.read',
      description: 'View financial reports, transactions, and account balances',
      application: 'Financial Management System',
      resource: 'Financial Data',
      actions: ['Read', 'View', 'Export'],
      dataClassification: 'Confidential',
      riskLevel: 'High',
      grantedTo: {
        users: 23,
        roles: 5,
        groups: 3
      },
      compliance: ['SOX', 'GDPR', 'PCI-DSS'],
      auditRequired: true,
      createdAt: '2024-01-15',
      lastModified: '2025-12-10',
      owner: 'Finance Department'
    }
  };

  const permissionDetails = permissions[selectedPermission as keyof typeof permissions];

  // Mock users with this permission
  const usersWithPermission = [
    { name: 'Alice Admin', email: 'alice.admin@fmg.com', source: 'Role: Super Admin', granted: '2024-01-20', status: 'active' },
    { name: 'Jane Smith', email: 'jane.smith@fmg.com', source: 'Role: Manager', granted: '2024-03-15', status: 'active' },
    { name: 'Bob Wilson', email: 'bob.wilson@fmg.com', source: 'AD Group: Finance Team', granted: '2024-02-01', status: 'active' },
    { name: 'Carol Davis', email: 'carol.davis@fmg.com', source: 'Direct Assignment', granted: '2025-01-10', status: 'pending_review' },
  ];

  // Mock roles with this permission
  const rolesWithPermission = [
    { name: 'Super Admin', users: 5, type: 'System', status: 'active' },
    { name: 'Manager', users: 45, type: 'Business', status: 'active' },
    { name: 'Finance Admin', users: 8, type: 'Department', status: 'active' },
    { name: 'Accountant', users: 23, type: 'Job Function', status: 'active' },
    { name: 'Auditor', users: 12, type: 'Compliance', status: 'active' },
  ];

  // Permission categories
  const permissionCategories = [
    {
      category: 'Data Access',
      permissions: [
        { name: 'Read Financial Data', code: 'finance.read', level: 'High', users: 23 },
        { name: 'Write Financial Data', code: 'finance.write', level: 'Critical', users: 8 },
        { name: 'Delete Financial Data', code: 'finance.delete', level: 'Critical', users: 3 },
        { name: 'Export Financial Data', code: 'finance.export', level: 'High', users: 15 },
      ]
    },
    {
      category: 'User Management',
      permissions: [
        { name: 'Create Users', code: 'users.create', level: 'High', users: 5 },
        { name: 'Edit Users', code: 'users.edit', level: 'High', users: 12 },
        { name: 'Delete Users', code: 'users.delete', level: 'Critical', users: 3 },
        { name: 'View Users', code: 'users.read', level: 'Medium', users: 45 },
      ]
    },
    {
      category: 'System Configuration',
      permissions: [
        { name: 'Manage Roles', code: 'roles.manage', level: 'Critical', users: 5 },
        { name: 'Manage Permissions', code: 'permissions.manage', level: 'Critical', users: 3 },
        { name: 'System Settings', code: 'system.configure', level: 'Critical', users: 2 },
        { name: 'View Audit Logs', code: 'audit.read', level: 'High', users: 15 },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
          <p className="text-muted-foreground">
            Detailed view and configuration of system permissions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Create Permission
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions by name, code, or application..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Permission List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Permission Categories</CardTitle>
            <CardDescription>Browse by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {permissionCategories.map((category, catIndex) => (
              <div key={catIndex} className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  {category.category}
                </h4>
                <div className="space-y-1">
                  {category.permissions.map((perm, permIndex) => (
                    <button
                      key={permIndex}
                      onClick={() => setSelectedPermission(perm.code)}
                      className={`w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors ${
                        selectedPermission === perm.code ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{perm.name}</span>
                        <Badge
                          variant={
                            perm.level === 'Critical' ? 'destructive' :
                            perm.level === 'High' ? 'default' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {perm.level}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          {perm.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {perm.users} users
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Permission Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permission Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>{permissionDetails.name}</CardTitle>
                    <Badge
                      variant={permissionDetails.riskLevel === 'High' ? 'destructive' : 'default'}
                    >
                      {permissionDetails.riskLevel} Risk
                    </Badge>
                  </div>
                  <CardDescription className="font-mono text-xs">
                    {permissionDetails.code}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {permissionDetails.description}
              </p>

              <Separator />

              {/* Permission Attributes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="mr-2 h-4 w-4" />
                    Application
                  </div>
                  <div className="font-medium">{permissionDetails.application}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Database className="mr-2 h-4 w-4" />
                    Resource
                  </div>
                  <div className="font-medium">{permissionDetails.resource}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Lock className="mr-2 h-4 w-4" />
                    Data Classification
                  </div>
                  <Badge variant="outline">{permissionDetails.dataClassification}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-2 h-4 w-4" />
                    Owner
                  </div>
                  <div className="font-medium">{permissionDetails.owner}</div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Allowed Actions</div>
                <div className="flex flex-wrap gap-2">
                  {permissionDetails.actions.map((action, index) => (
                    <Badge key={index} variant="secondary">
                      {action === 'Read' && <Eye className="mr-1 h-3 w-3" />}
                      {action === 'View' && <Eye className="mr-1 h-3 w-3" />}
                      {action === 'Export' && <Download className="mr-1 h-3 w-3" />}
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Compliance */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Compliance Requirements</div>
                <div className="flex flex-wrap gap-2">
                  {permissionDetails.compliance.map((comp, index) => (
                    <Badge key={index} variant="outline" className="font-mono">
                      {comp}
                    </Badge>
                  ))}
                  {permissionDetails.auditRequired && (
                    <Badge variant="default">
                      <Activity className="mr-1 h-3 w-3" />
                      Audit Required
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  This permission is granted to <strong>{permissionDetails.grantedTo.users} users</strong> through{' '}
                  <strong>{permissionDetails.grantedTo.roles} roles</strong> and{' '}
                  <strong>{permissionDetails.grantedTo.groups} AD groups</strong>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Detailed Tabs */}
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="users">
                    Users ({usersWithPermission.length})
                  </TabsTrigger>
                  <TabsTrigger value="roles">
                    Roles ({rolesWithPermission.length})
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    Audit History
                  </TabsTrigger>
                </TabsList>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-3">
                  {usersWithPermission.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{user.source}</div>
                          <div className="text-xs text-muted-foreground">
                            Granted: {user.granted}
                          </div>
                        </div>
                        <Badge
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                        >
                          {user.status === 'active' ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles" className="space-y-3">
                  {rolesWithPermission.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-8 w-8 text-primary" />
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {role.type} • {role.users} users
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{role.status}</Badge>
                    </div>
                  ))}
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-2">
                  <div className="space-y-2 text-sm">
                    {[
                      { date: '2025-12-10', user: 'Alice Admin', action: 'Modified permission', details: 'Updated data classification to Confidential' },
                      { date: '2025-11-20', user: 'Bob Auditor', action: 'Reviewed permission', details: 'Compliance review completed' },
                      { date: '2025-10-15', user: 'Jane Smith', action: 'Granted to role', details: 'Added to Manager role' },
                      { date: '2024-01-15', user: 'System', action: 'Created permission', details: 'Initial permission setup' },
                    ].map((event, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{event.action}</span>
                            <span className="text-xs text-muted-foreground">{event.date}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {event.details}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            by {event.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
