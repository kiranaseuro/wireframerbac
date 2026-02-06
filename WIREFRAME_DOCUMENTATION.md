# FMG RBAC System - Wireframe Documentation

## Overview

This document provides a comprehensive guide to the new wireframe pages created for the FMG RBAC (Role-Based Access Control) system with Active Directory integration.

## What's New

### 🎨 New Wireframe Pages

Four new wireframe pages have been created to visualize the complete AD integration and enhanced permission management:

1. **Super Admin Dashboard** (`/super-admin`)
2. **AD Sync Management** (`/ad-sync`)
3. **Group Mapping Configuration** (`/group-mapping`)
4. **Permission Detail View** (`/permission-detail`)

---

## Page Details

### 1. Super Admin Dashboard (`/super-admin`)

**Purpose**: Comprehensive system overview for super administrators

**Features**:
- ✅ Real-time system statistics (users, roles, permissions, groups)
- ✅ Security alerts and threat monitoring
- ✅ System health metrics (API response time, database performance, AD sync status)
- ✅ Risk analysis and compliance tracking
- ✅ High-privilege user monitoring
- ✅ Recent administrative actions log
- ✅ Quick action buttons for system-wide operations

**Access**: Only visible to users with `super_admin` role

**Key Metrics Displayed**:
- Total Users (847 active, 24 inactive)
- Roles & Permissions (45 roles, 342 permissions)
- Pending Requests (15 awaiting approval)
- AD Sync Status (healthy, last sync time)

**Tabs**:
1. **Security Alerts**: Real-time security incidents (failed logins, privilege escalation, unauthorized access)
2. **System Health**: Performance metrics, uptime, response times
3. **Risk Analysis**: Permission risk analysis, high-privilege users, compliance violations
4. **Recent Activity**: Latest administrative actions

---

### 2. AD Sync Management (`/ad-sync`)

**Purpose**: Synchronize users from Microsoft Active Directory

**Features**:
- ✅ Manual sync button with progress indicator
- ✅ Connection status indicator (Connected/Disconnected)
- ✅ Microsoft Graph API configuration display
- ✅ Sync statistics (total users, new users, updated users)
- ✅ Recent synced users list with department and AD groups
- ✅ Group mappings overview
- ✅ Detailed sync logs with timestamps

**Access**: Only visible to users with `super_admin` role

**Sync Statistics**:
- Total Users: 847 in Active Directory
- New Users: +23 from last sync
- Updated Users: 145 modified
- Last Sync: Duration and timestamp

**Tabs**:
1. **Recent Synced Users**: Shows newly added and updated users with their AD groups
2. **Group Mappings**: Displays how AD security groups map to RBAC roles
3. **Sync Logs**: Detailed log of sync operations with success/error messages

---

### 3. Group Mapping Configuration (`/group-mapping`)

**Purpose**: Configure how Active Directory groups automatically map to RBAC roles

**Features**:
- ✅ Visual mapping display (AD Group → RBAC Role)
- ✅ Auto-assign toggle for each mapping
- ✅ User count per mapping
- ✅ Last sync timestamp
- ✅ Add new mapping interface
- ✅ Edit and delete existing mappings
- ✅ Unmapped AD groups section
- ✅ Bulk operations (enable all, sync all, export config)

**Access**: Only visible to users with `super_admin` role

**Pre-configured Mappings**:
- Domain Admins → Super Admin (5 users)
- IT Support → Help Desk (23 users)
- Developers → Developer (156 users)
- Engineering Managers → Manager (18 users)
- Finance Team → Finance User (34 users)
- HR Department → HR Administrator (12 users)
- Security Team → Security Analyst (8 users)
- Auditors → Audit Viewer (6 users)

**How It Works**:
1. When users are synced from AD, their group memberships are read
2. Based on group mappings, roles are automatically assigned
3. Users can belong to multiple groups and receive all corresponding roles
4. Auto-assign can be enabled/disabled per mapping

---

### 4. Permission Detail View (`/permission-detail`)

**Purpose**: Detailed visualization of permission structure and usage

**Features**:
- ✅ Permission categories sidebar (Data Access, User Management, System Configuration)
- ✅ Comprehensive permission details (name, code, description, application, resource)
- ✅ Risk level indicators (Critical, High, Medium, Low)
- ✅ Data classification badges (Confidential, Restricted, Internal, Public)
- ✅ Allowed actions with icons
- ✅ Compliance requirements (SOX, GDPR, PCI-DSS)
- ✅ Users with permission (with grant source)
- ✅ Roles containing permission
- ✅ Audit history

**Access**: Visible to `super_admin` and `permission_admin` roles

**Permission Attributes**:
- **Name**: Human-readable permission name
- **Code**: Technical identifier (e.g., `finance.read`)
- **Application**: System the permission belongs to
- **Resource**: What the permission protects
- **Actions**: Allowed operations (Read, Write, Delete, Export, etc.)
- **Data Classification**: Sensitivity level
- **Risk Level**: Security risk assessment
- **Owner**: Department responsible for the permission

**Tabs**:
1. **Users**: Shows all users with this permission and how they got it (role, AD group, direct assignment)
2. **Roles**: Lists all roles containing this permission
3. **Audit History**: Complete timeline of permission modifications

**Permission Categories**:
- **Data Access**: Financial data, reports, exports
- **User Management**: Create, edit, delete users
- **System Configuration**: Roles, permissions, system settings

---

## Navigation

All new wireframe pages are accessible via the sidebar navigation when logged in as a **Super Admin**.

### Sidebar Menu Structure:

```
Dashboard
My Access
Request Access
My Requests
Approvals (Manager+)
Users (Admin)
Roles (Role Admin)
Permissions (Permission Admin)
Groups (Admin)
Audit Logs (Auditor)
Reports (Manager+)
─────────────────────
Super Admin (Super Admin only) ⭐ NEW
AD Sync (Super Admin only) ⭐ NEW
Group Mapping (Super Admin only) ⭐ NEW
Permission Details (Super Admin + Permission Admin) ⭐ NEW
```

---

## Super Admin User

### Default Super Admin Account

**Email**: `alice.admin@fmg.com`
**Role**: `super_admin`
**Status**: Active

To access all new wireframe pages:
1. Log in as `alice.admin@fmg.com`
2. Navigate using the sidebar menu
3. All four new pages will be visible

---

## Technical Details

### Technologies Used

- **React 19** with TypeScript
- **shadcn/ui** components (fully configured)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Zustand** for state management

### File Structure

```
src/
├── pages/
│   ├── SuperAdminDashboard.tsx    ⭐ NEW
│   ├── ADSyncPage.tsx             ⭐ NEW
│   ├── GroupMappingPage.tsx       ⭐ NEW
│   ├── PermissionDetailPage.tsx   ⭐ NEW
│   └── ... (existing pages)
├── types/
│   └── index.ts                   ⭐ UPDATED (added AD fields)
├── components/
│   └── layout/
│       └── sidebar.tsx            ⭐ UPDATED (added new routes)
└── App.tsx                        ⭐ UPDATED (added new routes)
```

### Routes Added

| Route | Component | Access |
|-------|-----------|--------|
| `/super-admin` | SuperAdminDashboard | super_admin |
| `/ad-sync` | ADSyncPage | super_admin |
| `/group-mapping` | GroupMappingPage | super_admin |
| `/permission-detail` | PermissionDetailPage | super_admin, permission_admin |

### Updated Type Definitions

Added to `User` interface:
```typescript
adSynced?: boolean      // Flag indicating if user was synced from AD
adGroups?: string[]     // List of AD security groups user belongs to
username?: string       // AD username
jobTitle?: string       // Job title from AD
```

---

## How to Test the Wireframes

### Step 1: Start the Application
```bash
npm run dev
```

### Step 2: Login as Super Admin
1. Navigate to http://localhost:5173
2. Click "Demo Account" on login page
3. Select **"Alice Admin (Super Admin)"**
4. Click "Sign In"

### Step 3: Explore Wireframes

**Test Super Admin Dashboard**:
- Click "Super Admin" in sidebar
- Explore tabs: Security Alerts, System Health, Risk Analysis, Recent Activity
- Check real-time statistics

**Test AD Sync**:
- Click "AD Sync" in sidebar
- Click "Sync Now" button (simulates sync with progress)
- View tabs: Recent Synced Users, Group Mappings, Sync Logs

**Test Group Mapping**:
- Click "Group Mapping" in sidebar
- Review existing mappings (8 pre-configured)
- See unmapped AD groups
- Test add new mapping interface

**Test Permission Detail**:
- Click "Permission Details" in sidebar
- Browse permission categories in left sidebar
- Select different permissions to see details
- Explore tabs: Users, Roles, Audit History

---

## Mock Data

All wireframes use **realistic mock data** for demonstration purposes:

- **847 users** from Active Directory
- **8 AD group mappings** pre-configured
- **45 roles** with various permissions
- **342 permissions** across multiple applications
- **Security alerts** with different severity levels
- **System health metrics** with realistic values
- **Recent sync data** with timestamps

---

## Future Implementation Steps

To convert these wireframes into a fully functional system:

### Phase 1: Backend Setup
1. Set up Microsoft Graph API authentication
2. Create API endpoints for AD user sync
3. Implement user synchronization logic
4. Set up database schema for AD-synced users

### Phase 2: Frontend Integration
1. Replace mock data with real API calls
2. Implement real-time sync progress tracking
3. Add error handling and validation
4. Connect group mappings to backend

### Phase 3: Testing & Deployment
1. Test AD connection with real credentials
2. Perform user acceptance testing
3. Security audit and compliance review
4. Deploy to production environment

---

## Key Features to Implement

### Active Directory Integration
- [ ] Microsoft Graph API authentication (OAuth2)
- [ ] User sync endpoint
- [ ] Group membership fetching
- [ ] Automatic role assignment based on groups
- [ ] Scheduled sync jobs (hourly/daily)
- [ ] Webhook support for real-time updates

### Permission Management
- [ ] Dynamic permission loading
- [ ] Permission audit trail
- [ ] Role-permission matrix
- [ ] Permission request workflow
- [ ] Compliance reporting

### Super Admin Features
- [ ] System configuration management
- [ ] Security alert notifications
- [ ] User suspension/activation
- [ ] Bulk user operations
- [ ] Database backup/restore

---

## Security Considerations

### Access Control
- All super admin pages are role-protected
- Only `super_admin` role can access sensitive operations
- Permission detail view shared with `permission_admin`

### AD Sync Security
- Microsoft Graph API uses OAuth2 client credentials flow
- Secure storage of tenant ID and client secret
- Encrypted connection to Active Directory
- Audit logging for all sync operations

### Data Protection
- PII (Personally Identifiable Information) handling
- GDPR compliance for user data
- SOX compliance for financial permissions
- Role-based data access controls

---

## Compliance & Auditing

### Audit Trail
- All permission changes logged
- User sync operations tracked
- Admin actions recorded with timestamp
- Security alerts documented

### Compliance Standards
- **SOX**: Financial data access control
- **GDPR**: User data privacy
- **PCI-DSS**: Payment card data security
- **HIPAA**: Healthcare data (if applicable)

---

## Support & Documentation

### Getting Help
- Review this documentation
- Check existing codebase for patterns
- Refer to shadcn/ui documentation: https://ui.shadcn.com
- Microsoft Graph API docs: https://docs.microsoft.com/graph

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent naming conventions
- Component-based architecture

---

## Summary

✅ **4 new wireframe pages** created
✅ **shadcn/ui components** used throughout
✅ **Super admin role** properly configured
✅ **Active Directory integration** UI complete
✅ **Permission visualization** comprehensive
✅ **Group mapping** interface intuitive
✅ **Mock data** realistic and detailed
✅ **Navigation** properly integrated
✅ **Type definitions** updated

**Next Steps**: Review wireframes with stakeholders, gather feedback, and proceed with backend implementation.

---

**Created**: 2026-02-06
**Version**: 1.0
**Status**: Wireframes Complete - Ready for Review
