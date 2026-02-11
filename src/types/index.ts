// ============================================================================
// RBAC TYPE DEFINITIONS - ALIGNED WITH RGD v3.0
// ============================================================================
// This file defines types according to the Pure RBAC Requirements Gathering
// Document with Active Directory Integration via SAML
// ============================================================================

// Environment Types (RGD Section 8.1)
export type Environment = "DEV" | "QA" | "UAT" | "PROD"

// Application Code Types (RGD Section 8.2)
export type ApplicationCode = "APP1" | "APP2" | "APP3" | "ADMIN"

// Permission Action Types (RGD Section 8.3)
export type PermissionAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "EXECUTE"

// User Types
export type UserStatus = "active" | "inactive" | "suspended" | "terminated"

// User Role Types (RGD Section 7.1)
// Primary administrative roles: IT_ADMIN (full access) and SUB_ADMIN (DEV/QA only)
// Custom application roles follow pattern: {APP}_{ENV}_{FUNCTION}
export type UserRole =
  | "IT_ADMIN"           // Full access to ALL environments (RGD Section 7.1.1)
  | "SUB_ADMIN"          // Limited to DEV and QA ONLY (RGD Section 7.1.2)
  | "APP1_PROD_VIEWER"   // Example custom role: Read-only APP1 production access
  | "APP1_DEV_DEVELOPER" // Example custom role: Full APP1 development access
  | "APP2_QA_TESTER"     // Example custom role: QA testing access
  | "AUDITOR"            // Read-only audit access (RGD Section 4.3)

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  department: string
  title: string
  manager?: string
  managerId?: string
  location: string
  employeeId: string
  phone?: string
  status: UserStatus
  userRole: UserRole
  createdAt: Date
  lastLogin?: Date
  mfaEnabled: boolean
  // Active Directory fields (RGD Section 5.2.3)
  adSynced?: boolean
  adGroups?: string[]
  username?: string
  jobTitle?: string
}

// Role Types (RGD Section 7)
export type RoleStatus = "active" | "inactive" | "deprecated"

export interface Role {
  id: string
  name: string              // Human-readable name (e.g., "IT Administrator")
  code: string              // Role code (e.g., "IT_ADMIN", "SUB_ADMIN")
  description: string
  department: string
  level: string
  status: RoleStatus
  parentRoleId?: string
  permissions: string[]     // Array of permission names (e.g., ["APP1_PROD_READ", "APP2_DEV_CREATE"])
  userCount: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
  // Temporal role assignment support (RGD FR-RM-005)
  isTemporal: boolean
  temporalStartDate?: Date
  temporalEndDate?: Date
}

// Permission Types (RGD Section 8.2, FR-PM-001)
// Permission naming convention: {APPLICATION_CODE}_{ENVIRONMENT}_{ACTION}
// Examples: APP1_DEV_READ, APP2_PROD_EXECUTE, ADMIN_PROD_DELETE
export interface Permission {
  id: string
  name: string              // Auto-generated: {APP}_{ENV}_{ACTION} (e.g., "APP1_PROD_READ")
  description: string
  applicationCode: ApplicationCode   // APP1, APP2, APP3, ADMIN
  environment: Environment           // DEV, QA, UAT, PROD
  action: PermissionAction           // CREATE, READ, UPDATE, DELETE, EXECUTE
  resource?: string                  // Optional: specific resource protected
  createdAt: Date
  updatedAt?: Date
  createdBy: string
}

// Group Types (RGD Section 5.2.3)
export type GroupType = "security" | "distribution"
export type GroupSource = "ad" | "manual"
export type SyncStatus = "synced" | "pending" | "error"

export interface Group {
  id: string
  name: string
  type: GroupType
  source: GroupSource
  memberCount: number
  mappedRoleId?: string      // Role automatically assigned to group members
  mappedRoleName?: string
  lastSynced?: Date
  syncStatus: SyncStatus
  description?: string
}

// AD Group Mapping (RGD Section 5.2.3)
export interface ADGroupMapping {
  id: string
  adGroupName: string        // Active Directory security group name
  rbacRoleId: string         // RBAC role ID to map to
  rbacRoleName: string       // RBAC role name
  autoAssign: boolean        // Auto-assign role when user synced from AD
  userCount: number          // Number of users with this mapping
  lastSynced?: Date
  createdAt: Date
  createdBy: string
}

// Audit Log Types (RGD Section 11)
export type AuditEventType =
  | "authentication"       // SAML authentication events (RGD AUD-001)
  | "authorization"        // Authorization decisions (RGD AUD-002)
  | "role_change"         // Role assignments/removals (RGD AUD-003)
  | "permission_change"   // Permission modifications (RGD AUD-003)
  | "admin_action"        // Administrative actions (RGD AUD-003)
  | "user_lifecycle"      // User creation/deactivation (RGD AUD-004)
  | "security_violation"  // SUB_ADMIN UAT/PROD access attempts (RGD AUD-002)
  | "login"
  | "logout"
  | "access_granted"
  | "access_denied"
  | "role_modified"
  | "permission_granted"
  | "user_created"

export type AuditResult = "success" | "failure" | "denied"

export interface AuditLog {
  id: string
  timestamp: Date
  eventType: AuditEventType
  userId: string
  userName: string
  action: string            // Detailed action description
  resource: string          // Resource affected
  result: AuditResult
  ipAddress: string
  denialReason?: string     // Required for authorization denials (RGD Section 11.2)
  environment?: Environment // Environment for authorization events
  details: Record<string, any>
}

// Report Types (RGD Section 11.5)
export type ReportCategory = "access" | "compliance" | "security" | "operational"
export type ReportFrequency = "on_demand" | "daily" | "weekly" | "monthly" | "quarterly"

export interface Report {
  id: string
  name: string
  description: string
  category: ReportCategory
  frequency: ReportFrequency
  lastRun?: Date
  isFavorite: boolean
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string
  title: string
  type: "stat" | "chart" | "list" | "action"
  data: any
}

// Access Item (for My Access page)
export type AccessItemType = "role" | "permission" | "application" | "group"
export type AccessItemStatus = "active" | "expiring_soon" | "expired"

export interface AccessItem {
  id: string
  name: string
  type: AccessItemType
  grantedDate: Date
  expiresDate?: Date
  status: AccessItemStatus
  grantedBy: string
  source: string            // "direct", "role", "ad_group"
  environment?: Environment // For environment-specific access
}

// Notification Types (RGD Section 2.1.4 - Email Notifications)
// NOTE: Approval notifications removed (workflow out of scope per RGD Section 3)
export type NotificationType =
  | "access_expiring"      // Role expiration warning (RGD FR-RM-005)
  | "access_expired"       // Role expired notification
  | "system"               // System notifications
  | "security"             // Security alerts (RGD Section 11.3)
  | "role_assigned"        // Role assignment confirmation
  | "role_removed"         // Role removal notification

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  actionUrl?: string
  actionLabel?: string
}

// Auth Types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (role: UserRole) => void
}

// Filter and Sort Types
export interface TableFilters {
  search?: string
  status?: string
  department?: string
  role?: string
  environment?: Environment
  applicationCode?: ApplicationCode
  dateRange?: {
    from: Date
    to: Date
  }
}

export interface SortConfig {
  key: string
  direction: "asc" | "desc"
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Authorization Request/Response Types (RGD Section 6.4, FR-AZ-001)
export interface AuthorizationRequest {
  userId: string
  applicationCode: ApplicationCode
  environment: Environment
  action: PermissionAction
}

export interface AuthorizationResponse {
  decision: "ALLOW" | "DENY"
  userId: string
  roles: UserRole[]
  timestamp: Date
  reason?: string           // Required for DENY decisions
  requiredPermission?: string  // e.g., "APP1_PROD_UPDATE"
}

// Environment Access Helper Types
export interface EnvironmentAccess {
  environment: Environment
  hasAccess: boolean
  roles: UserRole[]
}

// Permission Creation Form (for UI)
export interface PermissionFormData {
  applicationCode: ApplicationCode
  environment: Environment
  action: PermissionAction
  description: string
  resource?: string
}

// Role Assignment with Temporal Support (RGD FR-RM-005)
export interface RoleAssignment {
  userId: string
  roleId: string
  roleName: string
  assignedBy: string
  assignedAt: Date
  startDate?: Date
  endDate?: Date
  isTemporary: boolean
  source: "manual" | "ad_group"  // How the role was assigned
}
