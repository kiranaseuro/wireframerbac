# Email Notification Implementation Guide

## Overview
Email notifications can be implemented for various RBAC events to keep users informed about access requests, approvals, role changes, and security events.

## Notification Triggers

### 1. **Access Request Events**
- When a new access request is submitted
- When a request is approved/rejected
- When a request requires additional approval
- When a request expires or is about to expire

### 2. **Access Management Events**
- When access is granted to a user
- When access is revoked
- When access is about to expire (7 days, 3 days, 1 day)
- When temporary access expires

### 3. **Role & Permission Changes**
- When a new role is assigned
- When a role is removed
- When role permissions are modified
- When critical permissions are granted

### 4. **Approval Workflow Events**
- When a manager receives a new approval request
- When approval is overdue (reminder)
- When multiple approvals are pending

### 5. **Security & Compliance Events**
- Failed login attempts (multiple)
- Suspicious activity detected
- Compliance certification due
- Access review required
- Privilege escalation detected

### 6. **Administrative Events**
- System configuration changes
- Bulk user operations completed
- AD sync status (success/failure)
- Report generation completed

## UI Implementation

### Location in Application
1. **User Profile Settings** - Personal notification preferences
2. **Admin Settings** - System-wide notification rules
3. **Role/Permission Pages** - Event-specific notifications
4. **Dashboard** - Quick notification toggles

### UI Components Needed

#### 1. Notification Settings Page
```
Settings
├── Email Notifications
│   ├── Access Requests
│   ├── Approvals
│   ├── Access Changes
│   ├── Security Alerts
│   └── Administrative
└── Delivery Preferences
    ├── Email Address
    ├── Frequency (Immediate/Daily Digest/Weekly)
    └── Quiet Hours
```

#### 2. Toggle Switches for Each Category
- Individual notification types with on/off toggles
- Frequency selector (Immediate, Hourly, Daily Digest)
- Priority levels (All, High Priority Only, Critical Only)

#### 3. Email Template Preview
- Show users what emails will look like
- Customizable templates for admins

## Technical Implementation

### Backend Requirements
1. **Email Service Integration**
   - SMTP server configuration
   - Email template engine (e.g., Handlebars, Pug)
   - Queue system (e.g., Bull, RabbitMQ) for async processing

2. **Database Schema**
   ```sql
   notification_preferences (
     user_id,
     notification_type,
     enabled,
     frequency,
     delivery_method
   )

   notification_queue (
     id,
     user_id,
     type,
     data,
     status,
     scheduled_at,
     sent_at
   )

   notification_templates (
     id,
     name,
     subject,
     body_html,
     body_text
   )
   ```

3. **API Endpoints**
   - GET /api/notifications/preferences
   - PUT /api/notifications/preferences
   - POST /api/notifications/test (send test email)
   - GET /api/notifications/history

### Frontend State Management
```typescript
interface NotificationPreferences {
  accessRequests: {
    newRequest: boolean;
    requestApproved: boolean;
    requestRejected: boolean;
  };
  approvals: {
    newApproval: boolean;
    approvalReminder: boolean;
    urgentApproval: boolean;
  };
  accessChanges: {
    accessGranted: boolean;
    accessRevoked: boolean;
    accessExpiring: boolean;
  };
  security: {
    failedLogin: boolean;
    suspiciousActivity: boolean;
    privilegeEscalation: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
}
```

## Sample Email Templates

### 1. Access Request Approved
```
Subject: ✅ Your access request has been approved

Hi [User Name],

Good news! Your request for [Access Type] has been approved by [Approver Name].

Details:
- Request ID: #12345
- Access Type: [Role/Permission Name]
- Approved By: [Approver Name]
- Approved On: [Date]
- Access Valid Until: [Expiry Date]

You can now access [System/Resource] with your new permissions.

View Details: [Link to My Access page]

Best regards,
FMG RBAC System
```

### 2. Approval Required
```
Subject: ⏰ New access request awaiting your approval

Hi [Manager Name],

[User Name] has submitted a new access request that requires your approval.

Request Details:
- Requester: [User Name] ([Department])
- Access Type: [Role/Permission]
- Justification: [User's justification]
- Priority: [High/Medium/Low]
- Submitted: [Date]

Review Request: [Link to Approvals page]

Please review this request within [X] business days.

Best regards,
FMG RBAC System
```

### 3. Access Expiring Soon
```
Subject: ⚠️ Your access will expire in 3 days

Hi [User Name],

This is a reminder that your access to [System/Role] will expire soon.

Expiring Access:
- Access Type: [Role/Permission Name]
- Expires On: [Date]
- Days Remaining: 3

If you still need this access, please submit a renewal request:
[Link to Request Access page]

Best regards,
FMG RBAC System
```

## Implementation Steps

### Phase 1: Basic Infrastructure
1. Set up email service configuration
2. Create database tables for preferences
3. Build notification preference API
4. Create basic email templates

### Phase 2: UI Development
1. Create notification settings page
2. Add toggle switches for each notification type
3. Implement frequency selector
4. Add test email functionality

### Phase 3: Event Integration
1. Integrate with access request flow
2. Add triggers for approval events
3. Implement expiration reminders
4. Add security event notifications

### Phase 4: Advanced Features
1. Email digest (daily/weekly summaries)
2. Notification history/audit trail
3. Custom email templates for admins
4. In-app notification center (bell icon)
5. Mobile push notifications (future)

## Best Practices

1. **Opt-in by Default** - Enable critical notifications, let users opt-in to others
2. **Frequency Controls** - Prevent email fatigue with digest options
3. **Quiet Hours** - Respect user preferences for notification timing
4. **Unsubscribe Link** - Always include option to manage preferences
5. **Clear CTAs** - Make action buttons prominent in emails
6. **Mobile Responsive** - Ensure emails look good on all devices
7. **Plain Text Alternative** - Always include text-only version
8. **Rate Limiting** - Prevent spam from too many notifications
9. **Test Mode** - Allow users to send test notifications
10. **Audit Trail** - Log all notifications sent for compliance

## Security Considerations

1. **PII Protection** - Don't include sensitive data in email bodies
2. **Secure Links** - Use time-limited tokens for email links
3. **Email Verification** - Verify email addresses before sending
4. **Encryption** - Use TLS for email transmission
5. **Spam Prevention** - Implement rate limiting and abuse detection
