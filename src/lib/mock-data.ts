// ============================================================================
// MOCK DATA GENERATION - ALIGNED WITH RGD v3.0
// ============================================================================
// This file generates mock data according to the Pure RBAC Requirements
// Gathering Document with Active Directory Integration via SAML
// ============================================================================

import { faker } from "@faker-js/faker"
import type {
  User,
  Role,
  Permission,
  Group,
  AuditLog,
  Report,
  AccessItem,
  Notification,
  UserRole,
  UserStatus,
  Environment,
  ApplicationCode,
  PermissionAction,
} from "@/types"

// Seed for consistent data
faker.seed(123)

const departments = ["Finance", "IT", "HR", "Sales", "Marketing", "Operations", "Legal", "Engineering"]
const locations = ["New York", "San Francisco", "London", "Tokyo", "Mumbai", "Sydney"]

// RGD-Compliant Application Codes (Section 8.2)
const applicationCodes: ApplicationCode[] = ["APP1", "APP2", "APP3", "ADMIN"]

// RGD-Compliant Environments (Section 8.1)
const environments: Environment[] = ["DEV", "QA", "UAT", "PROD"]

// RGD-Compliant Actions (Section 8.3)
const actions: PermissionAction[] = ["CREATE", "READ", "UPDATE", "DELETE", "EXECUTE"]

// ============================================================================
// DEMO USERS (RGD-Compliant Roles)
// ============================================================================

export const demoUsers: User[] = [
  {
    id: "demo-user-1",
    email: "alice.admin@fmg.com",
    firstName: "Alice",
    lastName: "Admin",
    fullName: "Alice Admin",
    department: "IT",
    title: "IT Administrator",
    location: "San Francisco",
    employeeId: "100001",
    status: "active",
    userRole: "IT_ADMIN",  // RGD Section 7.1.1 - Full access to all environments
    createdAt: new Date("2022-03-01"),
    lastLogin: new Date(),
    mfaEnabled: true,
    adSynced: true,
    adGroups: ["Domain Admins", "IT Support"],
    username: "alice.admin",
  },
  {
    id: "demo-user-2",
    email: "bob.developer@fmg.com",
    firstName: "Bob",
    lastName: "Developer",
    fullName: "Bob Developer",
    department: "Engineering",
    title: "Senior Developer",
    manager: "Alice Admin",
    location: "San Francisco",
    employeeId: "100002",
    status: "active",
    userRole: "SUB_ADMIN",  // RGD Section 7.1.2 - Limited to DEV/QA only
    createdAt: new Date("2023-06-10"),
    lastLogin: new Date(),
    mfaEnabled: true,
    adSynced: true,
    adGroups: ["Developers"],
    username: "bob.developer",
  },
  {
    id: "demo-user-3",
    email: "charlie.auditor@fmg.com",
    firstName: "Charlie",
    lastName: "Auditor",
    fullName: "Charlie Auditor",
    department: "Compliance",
    title: "Compliance Officer",
    manager: "Alice Admin",
    location: "London",
    employeeId: "100003",
    status: "active",
    userRole: "AUDITOR",  // RGD Section 4.3 - Read-only audit access
    createdAt: new Date("2023-01-20"),
    lastLogin: new Date(),
    mfaEnabled: true,
    adSynced: true,
    adGroups: ["Auditors"],
    username: "charlie.auditor",
  },
  {
    id: "demo-user-4",
    email: "diana.viewer@fmg.com",
    firstName: "Diana",
    lastName: "Viewer",
    fullName: "Diana Viewer",
    department: "Finance",
    title: "Financial Analyst",
    manager: "Alice Admin",
    location: "New York",
    employeeId: "100004",
    status: "active",
    userRole: "APP1_PROD_VIEWER",  // Custom role - Read-only APP1 production
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(),
    mfaEnabled: true,
    adSynced: true,
    adGroups: ["Finance Team"],
    username: "diana.viewer",
  },
]

// ============================================================================
// USER GENERATION
// ============================================================================

export function generateUsers(count: number = 100): User[] {
  const users: User[] = []
  const userRoles: UserRole[] = [
    "IT_ADMIN",
    "SUB_ADMIN",
    "APP1_PROD_VIEWER",
    "APP1_DEV_DEVELOPER",
    "APP2_QA_TESTER",
    "AUDITOR",
  ]

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const status: UserStatus = i < 85 ? "active" : faker.helpers.arrayElement(["inactive", "suspended", "terminated"] as UserStatus[])
    const adSynced = Math.random() > 0.1

    users.push({
      id: faker.string.uuid(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
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
      userRole: i < 10 ? faker.helpers.arrayElement(userRoles) : faker.helpers.arrayElement(["APP1_PROD_VIEWER", "APP1_DEV_DEVELOPER", "APP2_QA_TESTER"]),
      createdAt: faker.date.past({ years: 2 }),
      lastLogin: status === "active" ? faker.date.recent({ days: 7 }) : undefined,
      mfaEnabled: faker.datatype.boolean({ probability: 0.7 }),
      adSynced,
      adGroups: adSynced ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
        faker.helpers.arrayElement(["Domain Users", "Developers", "Finance Team", "HR Department", "IT Support"])
      ) : undefined,
      username: adSynced ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}` : undefined,
    })
  }

  return users
}

// ============================================================================
// ROLE GENERATION (RGD Section 7)
// ============================================================================

export function generateRoles(): Role[] {
  const roles: Role[] = [
    // Primary Administrative Roles (RGD Section 7.1)
    {
      id: "role-it-admin",
      name: "IT Administrator",
      code: "IT_ADMIN",
      description: "Full administrative access to all environments (DEV, QA, UAT, PROD). Can manage users, roles, and permissions across all systems.",
      department: "IT",
      level: "L4",
      status: "active",
      permissions: [
        // All ADMIN permissions across all environments
        "ADMIN_DEV_CREATE", "ADMIN_DEV_READ", "ADMIN_DEV_UPDATE", "ADMIN_DEV_DELETE", "ADMIN_DEV_EXECUTE",
        "ADMIN_QA_CREATE", "ADMIN_QA_READ", "ADMIN_QA_UPDATE", "ADMIN_QA_DELETE", "ADMIN_QA_EXECUTE",
        "ADMIN_UAT_CREATE", "ADMIN_UAT_READ", "ADMIN_UAT_UPDATE", "ADMIN_UAT_DELETE", "ADMIN_UAT_EXECUTE",
        "ADMIN_PROD_CREATE", "ADMIN_PROD_READ", "ADMIN_PROD_UPDATE", "ADMIN_PROD_DELETE", "ADMIN_PROD_EXECUTE",
        // All APP permissions
        "APP1_PROD_READ", "APP1_PROD_UPDATE", "APP2_PROD_READ",
      ],
      userCount: 5,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2024-01-15"),
      createdBy: "System",
      isTemporal: false,
    },
    {
      id: "role-sub-admin",
      name: "Sub Administrator",
      code: "SUB_ADMIN",
      description: "Limited administrative access to DEV and QA environments ONLY. Cannot access UAT or PROD environments (enforced by backend).",
      department: "IT",
      level: "L3",
      status: "active",
      permissions: [
        // Only DEV and QA permissions (UAT/PROD blocked)
        "ADMIN_DEV_CREATE", "ADMIN_DEV_READ", "ADMIN_DEV_UPDATE", "ADMIN_DEV_DELETE", "ADMIN_DEV_EXECUTE",
        "ADMIN_QA_CREATE", "ADMIN_QA_READ", "ADMIN_QA_UPDATE", "ADMIN_QA_DELETE", "ADMIN_QA_EXECUTE",
        "APP1_DEV_READ", "APP1_DEV_UPDATE", "APP1_QA_READ", "APP1_QA_EXECUTE",
      ],
      userCount: 12,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2024-01-15"),
      createdBy: "System",
      isTemporal: false,
    },
    {
      id: "role-auditor",
      name: "Auditor",
      code: "AUDITOR",
      description: "Read-only access to audit logs and reports. Cannot modify any data.",
      department: "Compliance",
      level: "L2",
      status: "active",
      permissions: ["ADMIN_PROD_READ"],
      userCount: 6,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2024-01-15"),
      createdBy: "System",
      isTemporal: false,
    },
  ]

  // Custom Application Roles (RGD Section 7.3)
  const customRoles = [
    {
      name: "APP1 Production Viewer",
      code: "APP1_PROD_VIEWER",
      description: "Read-only access to APP1 in production environment",
      permissions: ["APP1_PROD_READ"],
      department: "Finance",
    },
    {
      name: "APP1 Development Developer",
      code: "APP1_DEV_DEVELOPER",
      description: "Full access to APP1 in development environment",
      permissions: ["APP1_DEV_CREATE", "APP1_DEV_READ", "APP1_DEV_UPDATE", "APP1_DEV_DELETE", "APP1_DEV_EXECUTE"],
      department: "Engineering",
    },
    {
      name: "APP2 QA Tester",
      code: "APP2_QA_TESTER",
      description: "Test execution access to APP2 in QA environment",
      permissions: ["APP2_QA_READ", "APP2_QA_EXECUTE"],
      department: "QA",
    },
  ]

  customRoles.forEach((role, index) => {
    roles.push({
      id: `role-custom-${index}`,
      name: role.name,
      code: role.code,
      description: role.description,
      department: role.department,
      level: "L2",
      status: "active",
      permissions: role.permissions,
      userCount: faker.number.int({ min: 5, max: 40 }),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
      createdBy: "alice.admin@fmg.com",
      isTemporal: false,
    })
  })

  return roles
}

// ============================================================================
// PERMISSION GENERATION (RGD Section 8.2, FR-PM-001)
// Permission Naming Convention: {APPLICATION_CODE}_{ENVIRONMENT}_{ACTION}
// ============================================================================

export function generatePermissions(): Permission[] {
  const permissions: Permission[] = []

  applicationCodes.forEach((appCode) => {
    environments.forEach((env) => {
      actions.forEach((action) => {
        permissions.push({
          id: faker.string.uuid(),
          name: `${appCode}_${env}_${action}`,  // e.g., "APP1_PROD_READ"
          description: `Permission to ${action.toLowerCase()} ${appCode} in ${env} environment`,
          applicationCode: appCode,
          environment: env,
          action: action,
          resource: appCode === "ADMIN" ? "System Administration" : `${appCode} Resources`,
          createdAt: faker.date.past({ years: 1 }),
          createdBy: "alice.admin@fmg.com",
        })
      })
    })
  })

  return permissions
}

// ============================================================================
// GROUP GENERATION (RGD Section 5.2.3)
// ============================================================================

export function generateGroups(count: number = 15): Group[] {
  const groups: Group[] = []

  // Pre-defined AD Group Mappings
  const predefinedGroups = [
    { name: "Domain Admins", mappedRole: "IT_ADMIN", userCount: 5 },
    { name: "IT Support", mappedRole: "SUB_ADMIN", userCount: 23 },
    { name: "Developers", mappedRole: "APP1_DEV_DEVELOPER", userCount: 156 },
    { name: "Finance Team", mappedRole: "APP1_PROD_VIEWER", userCount: 34 },
    { name: "HR Department", mappedRole: null, userCount: 12 },
    { name: "Auditors", mappedRole: "AUDITOR", userCount: 6 },
  ]

  predefinedGroups.forEach((group, index) => {
    groups.push({
      id: `group-${index}`,
      name: group.name,
      type: "security",
      source: "ad",
      memberCount: group.userCount,
      mappedRoleId: group.mappedRole ? `role-${group.mappedRole}` : undefined,
      mappedRoleName: group.mappedRole || undefined,
      lastSynced: faker.date.recent({ days: 1 }),
      syncStatus: "synced",
      description: `Active Directory security group: ${group.name}`,
    })
  })

  // Generate additional random groups
  for (let i = predefinedGroups.length; i < count; i++) {
    const dept = faker.helpers.arrayElement(departments)
    groups.push({
      id: faker.string.uuid(),
      name: `AD-${dept}-${faker.helpers.arrayElement(["All", "Managers", "Admins", "ReadOnly"])}`,
      type: "security",
      source: "ad",
      memberCount: faker.number.int({ min: 5, max: 150 }),
      mappedRoleId: Math.random() > 0.5 ? faker.string.uuid() : undefined,
      mappedRoleName: Math.random() > 0.5 ? `${dept} Role` : undefined,
      lastSynced: faker.date.recent({ days: 1 }),
      syncStatus: faker.helpers.arrayElement(["synced", "synced", "synced", "pending"]),
      description: faker.lorem.sentence(),
    })
  }

  return groups
}

// ============================================================================
// AUDIT LOG GENERATION (RGD Section 11)
// ============================================================================

export function generateAuditLogs(users: User[], count: number = 500): AuditLog[] {
  const logs: AuditLog[] = []
  const eventTypes: any[] = [
    "authentication",
    "authorization",
    "role_change",
    "permission_change",
    "admin_action",
    "security_violation",  // SUB_ADMIN trying to access UAT/PROD
  ]
  const actions = ["login", "logout", "view", "create", "update", "delete", "assign_role", "remove_role"]

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users)
    const eventType = faker.helpers.arrayElement(eventTypes)
    const result: any = faker.helpers.arrayElement(["success", "success", "success", "success", "failure", "denied"])

    // Generate security violation logs for SUB_ADMIN attempts to access PROD
    const environment = eventType === "authorization" || eventType === "security_violation"
      ? faker.helpers.arrayElement(environments)
      : undefined

    const denialReason = result === "denied" && user.userRole === "SUB_ADMIN" && (environment === "UAT" || environment === "PROD")
      ? "SUB_ADMIN role restricted to DEV/QA environments only"
      : result === "denied"
        ? `User does not have required permission`
        : undefined

    logs.push({
      id: faker.string.uuid(),
      timestamp: faker.date.recent({ days: 30 }),
      eventType,
      userId: user.id,
      userName: user.fullName,
      action: faker.helpers.arrayElement(actions),
      resource: faker.helpers.arrayElement([...applicationCodes, "User", "Role", "Permission", "Group"]),
      result,
      ipAddress: faker.internet.ipv4(),
      denialReason,
      environment,
      details: {
        userAgent: faker.internet.userAgent(),
        method: faker.helpers.arrayElement(["GET", "POST", "PUT", "DELETE"]),
        sessionId: faker.string.uuid(),
      },
    })
  }

  // Sort by timestamp descending
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// ============================================================================
// REPORT GENERATION (RGD Section 11.5)
// ============================================================================

export function generateReports(): Report[] {
  return [
    {
      id: "1",
      name: "User Access Summary",
      description: "Complete overview of all user access rights (RGD Report AUD-RPT-001)",
      category: "access",
      frequency: "on_demand",
      lastRun: faker.date.recent({ days: 2 }),
      isFavorite: true,
    },
    {
      id: "2",
      name: "Role Assignment Report",
      description: "Show all users assigned to each role (RGD Report AUD-RPT-002)",
      category: "compliance",
      frequency: "monthly",
      lastRun: faker.date.recent({ days: 1 }),
      isFavorite: true,
    },
    {
      id: "3",
      name: "Permission Matrix",
      description: "Show role-to-permission mappings (RGD Report AUD-RPT-003)",
      category: "access",
      frequency: "on_demand",
      lastRun: faker.date.recent({ days: 3 }),
      isFavorite: true,
    },
    {
      id: "4",
      name: "Failed Authorization Report",
      description: "Identify potential security incidents (RGD Report AUD-RPT-004)",
      category: "security",
      frequency: "daily",
      lastRun: faker.date.recent({ days: 1 }),
      isFavorite: true,
    },
    {
      id: "5",
      name: "SUB_ADMIN Restriction Violations",
      description: "Alert on SUB_ADMIN attempts to access UAT/PROD (RGD Report AUD-RPT-005)",
      category: "security",
      frequency: "on_demand",
      lastRun: faker.date.recent({ days: 1 }),
      isFavorite: true,
    },
    {
      id: "6",
      name: "Administrative Action Log",
      description: "Review all administrative changes (RGD Report AUD-RPT-006)",
      category: "compliance",
      frequency: "weekly",
      lastRun: faker.date.recent({ days: 5 }),
      isFavorite: false,
    },
    {
      id: "7",
      name: "Environment Access Report",
      description: "Show who has access to PROD environment (RGD Report AUD-RPT-007)",
      category: "compliance",
      frequency: "monthly",
      lastRun: faker.date.recent({ days: 15 }),
      isFavorite: false,
    },
  ]
}

// ============================================================================
// ACCESS ITEM GENERATION (For My Access Page)
// ============================================================================

export function generateAccessItems(count: number = 15): AccessItem[] {
  const items: AccessItem[] = []

  for (let i = 0; i < count; i++) {
    const grantedDate = faker.date.past({ years: 1 })
    const expiresDate = Math.random() > 0.7 ? faker.date.future({ years: 0.5 }) : undefined
    const isExpiring = expiresDate && (expiresDate.getTime() - Date.now()) < (30 * 24 * 60 * 60 * 1000)
    const environment = faker.helpers.arrayElement(environments)

    items.push({
      id: faker.string.uuid(),
      name: faker.helpers.arrayElement([
        `APP1_${environment}_READ`,
        `APP2_${environment}_EXECUTE`,
        `IT_ADMIN`,
        `SUB_ADMIN`,
      ]),
      type: Math.random() > 0.5 ? "role" : "permission",
      grantedDate,
      expiresDate,
      status: expiresDate && expiresDate < new Date() ? "expired" : isExpiring ? "expiring_soon" : "active",
      grantedBy: faker.person.fullName(),
      source: faker.helpers.arrayElement(["direct", "role", "ad_group"]),
      environment,
    })
  }

  return items
}

// ============================================================================
// NOTIFICATION GENERATION (RGD Section 2.1.4)
// NOTE: Approval notifications removed (workflow out of scope)
// ============================================================================

export function generateNotifications(count: number = 10): Notification[] {
  const notifications: Notification[] = []
  const types: any[] = ["access_expiring", "access_expired", "system", "security", "role_assigned", "role_removed"]

  for (let i = 0; i < count; i++) {
    const type = faker.helpers.arrayElement(types)
    let title = ""
    let message = ""

    switch (type) {
      case "role_assigned":
        title = "Role Assigned"
        message = `You have been assigned the role: ${faker.helpers.arrayElement(["IT_ADMIN", "SUB_ADMIN", "APP1_PROD_VIEWER"])}`
        break
      case "role_removed":
        title = "Role Removed"
        message = "Your access to SUB_ADMIN role has been removed"
        break
      case "access_expiring":
        title = "Access Expiring Soon"
        message = `Your access to APP1_PROD_VIEWER will expire in 7 days (RGD FR-RM-005)`
        break
      case "access_expired":
        title = "Access Expired"
        message = "Your temporary role assignment has expired"
        break
      case "security":
        title = "Security Alert"
        message = "Unauthorized access attempt detected from SUB_ADMIN to PROD environment"
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
    })
  }

  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// ============================================================================
// INITIALIZE ALL MOCK DATA
// ============================================================================

export function initializeMockData() {
  const users = [...demoUsers, ...generateUsers(96)]
  const roles = generateRoles()
  const permissions = generatePermissions()
  const groups = generateGroups()
  const auditLogs = generateAuditLogs(users)
  const reports = generateReports()
  const accessItems = generateAccessItems()
  const notifications = generateNotifications()

  return {
    users,
    roles,
    permissions,
    // requests removed - workflow out of scope (RGD Section 3)
    groups,
    auditLogs,
    reports,
    accessItems,
    notifications,
  }
}
