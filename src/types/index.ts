// User Types
export type UserStatus = "active" | "inactive" | "suspended" | "terminated"
export type UserRole = "user" | "manager" | "dept_admin" | "role_admin" | "permission_admin" | "audit_viewer" | "help_desk" | "super_admin"

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
  // Active Directory fields
  adSynced?: boolean
  adGroups?: string[]
  username?: string
  jobTitle?: string
}

// Role Types
export type RoleStatus = "active" | "inactive" | "deprecated"

export interface Role {
  id: string
  name: string
  code: string
  description: string
  department: string
  level: string
  status: RoleStatus
  parentRoleId?: string
  permissions: string[]
  userCount: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isTemporal: boolean
}

// Permission Types
export type PermissionType = "read" | "write" | "delete" | "execute" | "create" | "update" | "approve" | "admin"
export type DataClassification = "public" | "internal" | "confidential" | "restricted"

export interface Permission {
  id: string
  name: string
  code: string
  description: string
  type: PermissionType
  resource: string
  application: string
  module: string
  dataClassification: DataClassification
  inheritable: boolean
  allowOverride: boolean
  createdAt: Date
}

// Access Request Types
export type RequestStatus = "pending" | "approved" | "rejected" | "in_progress" | "completed" | "cancelled"
export type RequestPriority = "standard" | "urgent"
export type RequestType = "role" | "permission" | "application"

export interface AccessRequest {
  id: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  type: RequestType
  itemId: string
  itemName: string
  justification: string
  priority: RequestPriority
  status: RequestStatus
  isTemporary: boolean
  startDate?: Date
  endDate?: Date
  requestedAt: Date
  approvers: Approver[]
  comments: Comment[]
}

export interface Approver {
  id: string
  name: string
  email: string
  role: string
  status: "pending" | "approved" | "rejected"
  comments?: string
  decidedAt?: Date
}

export interface Comment {
  id: string
  userId: string
  userName: string
  text: string
  createdAt: Date
}

// Group Types
export type GroupType = "security" | "distribution"
export type GroupSource = "ad" | "manual"
export type SyncStatus = "synced" | "pending" | "error"

export interface Group {
  id: string
  name: string
  type: GroupType
  source: GroupSource
  memberCount: number
  mappedRoleId?: string
  mappedRoleName?: string
  lastSynced?: Date
  syncStatus: SyncStatus
  description?: string
}

// Audit Log Types
export type AuditEventType = "authentication" | "authorization" | "role_change" | "permission_change" | "admin_action" | "access_request" | "approval" | "login" | "logout" | "access_granted" | "access_denied" | "role_modified" | "permission_granted" | "user_created"
export type AuditResult = "success" | "failure"

export interface AuditLog {
  id: string
  timestamp: Date
  eventType: AuditEventType
  userId: string
  userName: string
  action: string
  resource: string
  result: AuditResult
  ipAddress: string
  details: Record<string, any>
}

// Report Types
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
  source: string
}

// Notification Types
export type NotificationType = "approval_required" | "request_approved" | "request_rejected" | "access_expiring" | "access_expired" | "system" | "security"

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
