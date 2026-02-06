/**
 * AD Group to Role Mapping Wireframe
 * Configure how Active Directory groups map to RBAC roles
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Users,
  ArrowRight,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  CheckCircle2,
  Settings,
  Info
} from 'lucide-react';

interface GroupMapping {
  id: string;
  adGroup: string;
  adGroupId: string;
  role: string;
  userCount: number;
  lastSync: string;
  autoAssign: boolean;
  status: 'active' | 'inactive';
}

export default function GroupMappingPage() {
  const [mappings] = useState<GroupMapping[]>([
    {
      id: '1',
      adGroup: 'Domain Admins',
      adGroupId: 'ad-group-001',
      role: 'Super Admin',
      userCount: 5,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    },
    {
      id: '2',
      adGroup: 'IT Support',
      adGroupId: 'ad-group-002',
      role: 'Help Desk',
      userCount: 23,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    },
    {
      id: '3',
      adGroup: 'Developers',
      adGroupId: 'ad-group-003',
      role: 'Developer',
      userCount: 156,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    },
    {
      id: '4',
      adGroup: 'Engineering Managers',
      adGroupId: 'ad-group-004',
      role: 'Manager',
      userCount: 18,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    },
    {
      id: '5',
      adGroup: 'Finance Team',
      adGroupId: 'ad-group-005',
      role: 'Finance User',
      userCount: 34,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    },
    {
      id: '6',
      adGroup: 'HR Department',
      adGroupId: 'ad-group-006',
      role: 'HR Administrator',
      userCount: 12,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    },
    {
      id: '7',
      adGroup: 'Security Team',
      adGroupId: 'ad-group-007',
      role: 'Security Analyst',
      userCount: 8,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    },
    {
      id: '8',
      adGroup: 'Auditors',
      adGroupId: 'ad-group-008',
      role: 'Audit Viewer',
      userCount: 6,
      lastSync: '2 hours ago',
      autoAssign: true,
      status: 'active'
    }
  ]);

  // Available AD groups (not yet mapped)
  const availableADGroups = [
    'Sales Team',
    'Marketing',
    'Customer Support',
    'Operations',
    'Legal Department',
    'Executive Team'
  ];

  // Available roles
  const availableRoles = [
    'Super Admin',
    'Manager',
    'Developer',
    'Help Desk',
    'Finance User',
    'HR Administrator',
    'Security Analyst',
    'Audit Viewer',
    'Department Admin',
    'Role Admin',
    'End User'
  ];

  const totalMappedUsers = mappings.reduce((sum, m) => sum + m.userCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AD Group to Role Mapping</h1>
          <p className="text-muted-foreground">
            Configure automatic role assignments based on Active Directory group membership
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync AD Groups
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Mapping
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          When users are synced from Active Directory, their roles will be automatically assigned based on these group mappings.
          Users can belong to multiple AD groups and will receive all corresponding roles.
        </AlertDescription>
      </Alert>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mappings</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mappings.filter(m => m.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              of {mappings.length} total mappings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mapped Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMappedUsers}</div>
            <p className="text-xs text-muted-foreground">
              users with auto-assigned roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AD Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mappings.length}</div>
            <p className="text-xs text-muted-foreground">
              {availableADGroups.length} unmapped groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Assign</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mappings.filter(m => m.autoAssign).length}
            </div>
            <p className="text-xs text-muted-foreground">
              mappings with auto-assign enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mapping Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Group Mappings</CardTitle>
              <CardDescription>Configure how AD groups map to RBAC roles</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search mappings..."
                className="w-64"
              />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mappings.map((mapping) => (
              <div
                key={mapping.id}
                className={`p-4 border rounded-lg transition-all ${
                  mapping.status === 'active' ? 'border-border' : 'border-muted opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left side - AD Group */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{mapping.adGroup}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {mapping.adGroupId}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {mapping.userCount} users
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Last sync: {mapping.lastSync}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="mx-6">
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  </div>

                  {/* Right side - Role */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{mapping.role}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        {mapping.autoAssign ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Auto-Assign
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Manual
                          </Badge>
                        )}
                        <Badge
                          variant={mapping.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {mapping.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Mapping</CardTitle>
          <CardDescription>Create a new AD group to role mapping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Active Directory Group</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Select AD Group...</option>
                {availableADGroups.map((group, index) => (
                  <option key={index} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>RBAC Role</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Select Role...</option>
                {availableRoles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Mapping
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-assign"
              className="h-4 w-4 rounded border-input"
              defaultChecked
            />
            <Label htmlFor="auto-assign" className="text-sm font-normal">
              Enable auto-assign (automatically assign role when user is synced from AD)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Unmapped AD Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Unmapped AD Groups</CardTitle>
          <CardDescription>
            These AD groups exist but are not mapped to any role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableADGroups.map((group, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-3 py-2 cursor-pointer hover:bg-muted"
              >
                <Users className="mr-2 h-3 w-3" />
                {group}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 w-4 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
          <CardDescription>Perform actions on multiple mappings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button variant="outline">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Enable All Auto-Assign
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync All Mappings
            </Button>
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Export Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
