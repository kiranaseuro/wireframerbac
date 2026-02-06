# FMG RBAC System - Demo Prototype

A fully functional Role-Based Access Control (RBAC) system prototype built with React, TypeScript, and shadcn/ui.

## 🎯 Overview

This is a comprehensive demonstration of an enterprise RBAC system with:
- **Authentication** with role-based access
- **Role switching** to demonstrate different user personas
- **Complete user self-service** (request access, track requests, view access)
- **Approval workflows** for managers
- **User, role, and permission management** for administrators
- **Active Directory group synchronization**
- **Comprehensive audit logging**
- **Reports and analytics dashboard**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed

### Installation

```bash
# Navigate to the project directory
cd rbac-demo

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application will open at `http://localhost:5173`

## 👤 Demo Accounts

Use these accounts to explore different user roles:

| Email | Role | Password | Access Level |
|-------|------|----------|--------------|
| `john.doe@fmg.com` | End User | `demo` | Basic user access, can request access |
| `jane.smith@fmg.com` | Manager | `demo` | + Approve requests, view team access |
| `alice.admin@fmg.com` | Super Admin | `demo` | Full system access, all features |
| `bob.auditor@fmg.com` | Audit Viewer | `demo` | View audit logs and reports |

**Note:** Any password works with demo accounts for testing purposes.

## 🎨 Key Features

### For End Users
- **Dashboard** - Personal access overview with quick actions
- **My Access** - View all assigned roles, permissions, and applications
- **Request Access** - Browse and request new roles/permissions with justification
- **My Requests** - Track status of submitted requests

### For Managers
- **Pending Approvals** - Review and approve/reject access requests
- **Team Access Review** - Quarterly access recertification
- **Team Dashboard** - Overview of team access and pending actions

### For Administrators
- **User Management** - Create, edit, and manage user accounts
- **Role Management** - Define roles with hierarchies and permissions
- **Permission Management** - Control application and resource permissions
- **Group Management** - Sync and map Active Directory groups
- **Audit Logs** - Complete system activity trail with search and export
- **Reports** - Pre-built compliance and operational reports

### Demo Features
- **Role Switcher** - Switch between user personas in real-time (top right menu)
- **Mock Data** - Realistic data for 100 users, 30 roles, 120 permissions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Notifications** - Bell icon shows approval requests and updates

## 📱 Application Structure

```
rbac-demo/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Sidebar, Header, AppLayout
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Application pages
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   ├── RolesPage.tsx
│   │   └── ...
│   ├── stores/              # Zustand state management
│   │   ├── auth-store.ts
│   │   └── notification-store.ts
│   ├── lib/
│   │   ├── mock-data.ts     # Data generation
│   │   └── utils.ts         # Utility functions
│   └── types/               # TypeScript definitions
```

## 🔐 Security Features Demonstrated

- **Role-Based Access Control** - Different UI and features per role
- **Segregation of Duties** - Prevents conflicting role assignments
- **Audit Trail** - All actions logged with user, timestamp, and result
- **Multi-Factor Authentication** - Support indicated (simulated)
- **Session Management** - Auto-logout and session tracking
- **Data Classification** - Permissions tagged by sensitivity level

## 🎯 User Flows Demonstrated

### Flow 1: Employee Requests Access
1. Login as John Doe (End User) - `john.doe@fmg.com`
2. Navigate to "Request Access"
3. Browse available roles
4. Select a role and provide justification
5. Submit request
6. Track status in "My Requests"

### Flow 2: Manager Approves Request
1. Login as Jane Smith (Manager) - `jane.smith@fmg.com`
2. Dashboard shows pending approvals badge
3. Navigate to "Approvals"
4. Review request details and justification
5. Add comments (optional)
6. Approve or reject request

### Flow 3: Admin Manages Users
1. Login as Alice Admin (Super Admin) - `alice.admin@fmg.com`
2. Navigate to "Users"
3. Search and filter users
4. View user details, roles, and activity

### Flow 4: Auditor Reviews Activity
1. Login as Bob Auditor (Audit Viewer) - `bob.auditor@fmg.com`
2. Navigate to "Audit Logs"
3. Search logs by user, action, or date
4. Export logs for compliance

## 🛠️ Technology Stack

- **Framework:** React 18 + TypeScript + Vite
- **UI Library:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Zustand with persistence
- **Icons:** Lucide React
- **Mock Data:** Faker.js

## 📊 Data Model

### Key Entities
- **Users** - 100+ mock users across departments
- **Roles** - 30 roles with hierarchies (Finance, IT, HR, etc.)
- **Permissions** - 120+ permissions across 8 applications
- **Requests** - 40+ access requests in various states
- **Groups** - 15 AD security groups with sync status
- **Audit Logs** - 500+ events for the past 30 days
- **Reports** - 7 pre-built compliance and operational reports

## 🔄 Role-Based UI Behavior

The UI dynamically adjusts based on the logged-in user's role:

| Feature | End User | Manager | Super Admin | Audit Viewer |
|---------|----------|---------|-------------|--------------|
| Dashboard | ✓ Basic | ✓ + Approvals | ✓ + System Health | ✓ + Activity |
| My Access | ✓ | ✓ | ✓ | ✓ |
| Request Access | ✓ | ✓ | ✓ | ✓ |
| Approvals | ✗ | ✓ | ✓ | ✗ |
| Users | ✗ | ✗ | ✓ | ✗ |
| Roles | ✗ | ✗ | ✓ | ✗ |
| Permissions | ✗ | ✗ | ✓ | ✗ |
| Groups | ✗ | ✗ | ✓ | ✗ |
| Audit Logs | ✗ | ✗ | ✓ | ✓ |
| Reports | ✗ | ✓ | ✓ | ✓ |

## 💼 Client Presentation Tips

1. **Start with Super Admin** - Show full system capabilities (`alice.admin@fmg.com`)
2. **Demonstrate Role Switching** - Use the "Switch Role" button in the top right
3. **Walk Through User Flow** - Request → Approve → Grant access
4. **Show Search and Filters** - Demonstrate data management on Users and Audit Logs pages
5. **Highlight Audit Trail** - Emphasize compliance features
6. **Discuss Customization** - Explain what can be tailored to client needs

## 📝 Project Requirements Alignment

This prototype demonstrates all requirements from the wireframe document:

✅ **User Personas** - 8 personas implemented with distinct access levels
✅ **Role-Based UI** - Dynamic menu and features per role
✅ **Authentication** - Login with role switching
✅ **Self-Service** - Request access, view access, track requests
✅ **Approval Workflow** - Manager approval with comments
✅ **User Management** - CRUD operations, search, filter
✅ **Role Management** - View roles, hierarchies, permissions
✅ **Permission Management** - Browse and manage permissions
✅ **Group Management** - AD sync simulation
✅ **Audit Logs** - Comprehensive activity tracking
✅ **Reports** - Pre-built report library
✅ **Notifications** - Real-time alerts
✅ **Responsive Design** - Works on all devices

## 🧪 Testing the Demo

Try these scenarios:

1. **Login as different users** - See how the UI changes
2. **Submit an access request** - As End User, then approve it as Manager
3. **Browse Users** - As Super Admin, search and filter
4. **View Audit Logs** - As Audit Viewer or Super Admin
5. **Use Role Switcher** - Switch personas without logging out

## 🚧 Known Limitations (Demo Only)

- **No backend** - All data is mock/in-memory
- **No persistence** - Data resets on page refresh (except auth state)
- **No actual API calls** - Simulated with delays
- **No email notifications** - Shown as toasts
- **No actual AD integration** - Simulated sync status

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📞 Support

For questions or issues with this demo:
- Ensure all npm dependencies are installed: `npm install`
- Check the demo accounts table above
- Try clearing browser cache if issues persist
- Use the role switcher to instantly change personas

## 🎉 Summary

This prototype demonstrates a **production-ready** RBAC system UI/UX with:
- ✅ Fully functional navigation and routing
- ✅ Role-based access control
- ✅ Complete user workflows
- ✅ Modern, polished design
- ✅ Realistic mock data
- ✅ Client-presentation ready

**Perfect for stakeholder demonstrations, requirement validation, and development planning.**

---

Built with React + TypeScript + shadcn/ui
