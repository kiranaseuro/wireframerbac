import { faker } from "@faker-js/faker"
import type {
  User,
  Role,
  Permission,
  AccessRequest,
  Group,
  AuditLog,
  Report,
  AccessItem,
  Notification,
  UserRole,
  UserStatus,
  RequestStatus,
} from "@/types"

// Seed for consistent data
faker.seed(123)

const departments = ["Finance", "IT", "HR", "Sales", "Marketing", "Operations", "Legal", "Engineering"]
const locations = ["New York", "San Francisco", "London", "Tokyo", "Mumbai", "Sydney"]
const applications = ["SAP", "Salesforce", "Workday", "Jira", "Confluence", "ServiceNow", "Tableau", "PowerBI"]

// Generate Users
export function generateUsers(count: number = 100): User[] {
  const users: User[] = []
  const userRoles: UserRole[] = ["user", "manager", "dept_admin", "role_admin", "permission_admin", "audit_viewer", "help_desk", "super_admin"]

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const status: UserStatus = i < 85 ? "active" : faker.helpers.arrayElement(["inactive", "suspended", "terminated"] as UserStatus[])

    users.push({
      id: faker.string.uuid(),
      email: faker.internet.email({ firstName, lastName }),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      department: faker.helpers.arrayElement(departments),
      title: faker.person.jobTitle(),
      manager: i > 0 ? users[Math.floor(Math.random() * Math.min(i, 20))].fullName : undefined,
      managerId: i > 0 ? users[Math.floor(Math.random() * Math.min(i, 20))].id : undefined,
      location: faker.helpers.arrayElement(locations),
      employeeId: faker.string.numeric(6),
      status,
      userRole: i < 10 ? faker.helpers.arrayElement(userRoles.slice(0, 7)) : "user",
      createdAt: faker.date.past({ years: 2 }),
      lastLogin: status === "active" ? faker.date.recent({ days: 7 }) : undefined,
      mfaEnabled: faker.datatype.boolean({ probability: 0.7 }),
    })
  }

  return users
}

// Generate Roles
export function generateRoles(count: number = 30): Role[] {
  const roles: Role[] = []
  const levels = ["L1", "L2", "L3", "L4"]

  for (let i = 0; i < count; i++) {
    const dept = faker.helpers.arrayElement(departments)
    const level = faker.helpers.arrayElement(levels)
    const function_name = faker.helpers.arrayElement(["Analyst", "Manager", "Director", "Admin", "Viewer"])

    roles.push({
      id: faker.string.uuid(),
      name: `${dept} ${function_name}`,
      code: `${dept.substring(0, 3).toUpperCase()}-${function_name.toUpperCase()}-${level}`,
      description: faker.lorem.sentence(),
      department: dept,
      level,
      status: i < 28 ? "active" : faker.helpers.arrayElement(["inactive", "deprecated"]),
      parentRoleId: i > 5 && Math.random() > 0.5 ? roles[Math.floor(Math.random() * Math.min(i, 10))].id : undefined,
      permissions: Array.from({ length: faker.number.int({ min: 3, max: 15 }) }, () => faker.string.uuid()),
      userCount: faker.number.int({ min: 1, max: 50 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      createdBy: faker.person.fullName(),
      isTemporal: faker.datatype.boolean({ probability: 0.1 }),
    })
  }

  return roles
}

// Generate Permissions
export function generatePermissions(count: number = 120): Permission[] {
  const permissions: Permission[] = []
  const types = ["create", "read", "update", "delete", "approve", "execute", "admin"]
  const classifications = ["public", "internal", "confidential", "restricted"]

  applications.forEach((app) => {
    const modules = ["Dashboard", "Reports", "Settings", "Users", "Data"]
    modules.forEach((module) => {
      types.forEach((type) => {
        if (permissions.length < count) {
          permissions.push({
            id: faker.string.uuid(),
            name: `${app} ${module} - ${type}`,
            code: `${app.toUpperCase()}_${module.toUpperCase()}_${type.toUpperCase()}`,
            description: `Permission to ${type} ${module.toLowerCase()} in ${app}`,
            type: type as any,
            resource: module,
            application: app,
            module,
            dataClassification: faker.helpers.arrayElement(classifications) as any,
            inheritable: faker.datatype.boolean({ probability: 0.7 }),
            allowOverride: faker.datatype.boolean({ probability: 0.3 }),
            createdAt: faker.date.past({ years: 1 }),
          })
        }
      })
    })
  })

  return permissions.slice(0, count)
}

// Generate Access Requests
export function generateAccessRequests(users: User[], roles: Role[], count: number = 40): AccessRequest[] {
  const requests: AccessRequest[] = []
  const statuses: RequestStatus[] = ["pending", "approved", "rejected", "in_progress"]

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users)
    const role = faker.helpers.arrayElement(roles)
    const status = faker.helpers.arrayElement(statuses)
    const isTemporary = faker.datatype.boolean({ probability: 0.2 })

    requests.push({
      id: faker.string.uuid(),
      requesterId: user.id,
      requesterName: user.fullName,
      requesterEmail: user.email,
      type: "role",
      itemId: role.id,
      itemName: role.name,
      justification: faker.lorem.paragraph(),
      priority: faker.helpers.arrayElement(["standard", "urgent"]),
      status,
      isTemporary,
      requestedAt: faker.date.recent({ days: 14 }),
      startDate: isTemporary ? faker.date.soon({ days: 7 }) : undefined,
      endDate: isTemporary ? faker.date.future({ years: 0.25 }) : undefined,
      approvers: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          role: "Manager",
          status: status === "pending" ? "pending" : faker.helpers.arrayElement(["approved", "rejected"]),
          decidedAt: status !== "pending" ? faker.date.recent({ days: 3 }) : undefined,
        },
      ],
      comments: [],
    })
  }

  return requests
}

// Generate Groups
export function generateGroups(count: number = 15): Group[] {
  const groups: Group[] = []

  for (let i = 0; i < count; i++) {
    const dept = faker.helpers.arrayElement(departments)

    groups.push({
      id: faker.string.uuid(),
      name: `AD-${dept}-${faker.helpers.arrayElement(["All", "Managers", "Admins", "ReadOnly"])}`,
      type: "security",
      source: "ad",
      memberCount: faker.number.int({ min: 5, max: 150 }),
      mappedRoleId: Math.random() > 0.3 ? faker.string.uuid() : undefined,
      mappedRoleName: Math.random() > 0.3 ? `${dept} Role` : undefined,
      lastSynced: faker.date.recent({ days: 1 }),
      syncStatus: faker.helpers.arrayElement(["synced", "synced", "synced", "pending", "error"]),
      description: faker.lorem.sentence(),
    })
  }

  return groups
}

// Generate Audit Logs
export function generateAuditLogs(users: User[], count: number = 500): AuditLog[] {
  const logs: AuditLog[] = []
  const eventTypes = ["authentication", "authorization", "role_change", "permission_change", "admin_action", "access_request", "approval"]
  const actions = ["login", "logout", "view", "create", "update", "delete", "approve", "reject"]

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users)
    const result = faker.helpers.arrayElement(["success", "success", "success", "success", "failure"])

    logs.push({
      id: faker.string.uuid(),
      timestamp: faker.date.recent({ days: 30 }),
      eventType: faker.helpers.arrayElement(eventTypes) as any,
      userId: user.id,
      userName: user.fullName,
      action: faker.helpers.arrayElement(actions),
      resource: faker.helpers.arrayElement([...applications, "User", "Role", "Permission", "Group"]),
      result: result as any,
      ipAddress: faker.internet.ipv4(),
      details: {
        userAgent: faker.internet.userAgent(),
        method: faker.helpers.arrayElement(["GET", "POST", "PUT", "DELETE"]),
        path: faker.internet.url(),
      },
    })
  }

  // Sort by timestamp descending
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Generate Reports
export function generateReports(): Report[] {
  return [
    {
      id: "1",
      name: "User Access Summary",
      description: "Complete overview of all user access rights",
      category: "access",
      frequency: "on_demand",
      lastRun: faker.date.recent({ days: 2 }),
      isFavorite: true,
    },
    {
      id: "2",
      name: "Orphaned Accounts",
      description: "Users with no active roles or permissions",
      category: "compliance",
      frequency: "daily",
      lastRun: faker.date.recent({ days: 1 }),
      isFavorite: true,
    },
    {
      id: "3",
      name: "Dormant Accounts",
      description: "Users with no activity in the last 90 days",
      category: "security",
      frequency: "weekly",
      lastRun: faker.date.recent({ days: 3 }),
      isFavorite: false,
    },
    {
      id: "4",
      name: "Privileged User Report",
      description: "All users with admin or elevated privileges",
      category: "security",
      frequency: "daily",
      lastRun: faker.date.recent({ days: 1 }),
      isFavorite: true,
    },
    {
      id: "5",
      name: "SoD Violations",
      description: "Users with conflicting role assignments",
      category: "compliance",
      frequency: "on_demand",
      lastRun: faker.date.recent({ days: 5 }),
      isFavorite: false,
    },
    {
      id: "6",
      name: "Access Request Metrics",
      description: "Statistics on access request processing",
      category: "operational",
      frequency: "monthly",
      lastRun: faker.date.recent({ days: 7 }),
      isFavorite: false,
    },
    {
      id: "7",
      name: "Role Assignment Report",
      description: "Distribution of roles across the organization",
      category: "access",
      frequency: "monthly",
      lastRun: faker.date.recent({ days: 15 }),
      isFavorite: false,
    },
  ]
}

// Generate Access Items (for My Access page)
export function generateAccessItems(count: number = 15): AccessItem[] {
  const items: AccessItem[] = []
  const types = ["role", "permission", "application", "group"]

  for (let i = 0; i < count; i++) {
    const grantedDate = faker.date.past({ years: 1 })
    const expiresDate = Math.random() > 0.7 ? faker.date.future({ years: 0.5 }) : undefined
    const isExpiring = expiresDate && (expiresDate.getTime() - Date.now()) < (30 * 24 * 60 * 60 * 1000)

    items.push({
      id: faker.string.uuid(),
      name: `${faker.helpers.arrayElement(departments)} ${faker.helpers.arrayElement(["Analyst", "Manager", "Viewer", "Admin"])}`,
      type: faker.helpers.arrayElement(types) as any,
      grantedDate,
      expiresDate,
      status: expiresDate && expiresDate < new Date() ? "expired" : isExpiring ? "expiring_soon" : "active",
      grantedBy: faker.person.fullName(),
      source: faker.helpers.arrayElement(["Direct", "Group", "Inherited"]),
    })
  }

  return items
}

// Generate Notifications
export function generateNotifications(count: number = 10): Notification[] {
  const notifications: Notification[] = []
  const types = ["approval_required", "request_approved", "request_rejected", "access_expiring", "system"]

  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(types) as any
    let title = ""
    let message = ""

    switch (type) {
      case "approval_required":
        title = "Approval Required"
        message = `${faker.person.fullName()} has requested access to ${faker.helpers.arrayElement(departments)} Role`
        break
      case "request_approved":
        title = "Request Approved"
        message = "Your access request has been approved"
        break
      case "request_rejected":
        title = "Request Rejected"
        message = "Your access request has been rejected"
        break
      case "access_expiring":
        title = "Access Expiring Soon"
        message = `Your access to ${faker.helpers.arrayElement(applications)} will expire in 7 days`
        break
      case "system":
        title = "System Maintenance"
        message = "Scheduled maintenance on Saturday 2AM-4AM"
        break
    }

    notifications.push({
      id: faker.string.uuid(),
      type,
      title,
      message,
      isRead: i > 3 ? faker.datatype.boolean() : false,
      createdAt: faker.date.recent({ days: 7 }),
      actionUrl: type === "approval_required" ? "/approvals" : undefined,
      actionLabel: type === "approval_required" ? "Review" : undefined,
    })
  }

  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// Demo Users for Role Switching
export const demoUsers: User[] = [
  {
    id: "demo-user-1",
    email: "john.doe@fmg.com",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    department: "Finance",
    title: "Financial Analyst",
    manager: "Jane Smith",
    managerId: "demo-user-2",
    location: "New York",
    employeeId: "100001",
    status: "active",
    userRole: "user",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
    mfaEnabled: true,
  },
  {
    id: "demo-user-2",
    email: "jane.smith@fmg.com",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    department: "Finance",
    title: "Finance Manager",
    manager: "Alice Admin",
    location: "New York",
    employeeId: "100002",
    status: "active",
    userRole: "manager",
    createdAt: new Date("2023-06-10"),
    lastLogin: new Date(),
    mfaEnabled: true,
  },
  {
    id: "demo-user-3",
    email: "alice.admin@fmg.com",
    firstName: "Alice",
    lastName: "Admin",
    fullName: "Alice Admin",
    department: "IT",
    title: "Chief Technology Officer",
    location: "San Francisco",
    employeeId: "100003",
    status: "active",
    userRole: "super_admin",
    createdAt: new Date("2022-03-01"),
    lastLogin: new Date(),
    mfaEnabled: true,
  },
  {
    id: "demo-user-4",
    email: "bob.auditor@fmg.com",
    firstName: "Bob",
    lastName: "Auditor",
    fullName: "Bob Auditor",
    department: "Compliance",
    title: "Compliance Officer",
    location: "London",
    employeeId: "100004",
    status: "active",
    userRole: "audit_viewer",
    createdAt: new Date("2023-01-20"),
    lastLogin: new Date(),
    mfaEnabled: true,
  },
]

// Initialize all mock data
export function initializeMockData() {
  const users = [...demoUsers, ...generateUsers(96)]
  const roles = generateRoles()
  const permissions = generatePermissions()
  const requests = generateAccessRequests(users, roles)
  const groups = generateGroups()
  const auditLogs = generateAuditLogs(users)
  const reports = generateReports()
  const accessItems = generateAccessItems()
  const notifications = generateNotifications()

  return {
    users,
    roles,
    permissions,
    requests,
    groups,
    auditLogs,
    reports,
    accessItems,
    notifications,
  }
}
