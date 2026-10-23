# LeadFlow CRM — Data Model & Mock Service Conventions

## 1. Purpose
Keep frontend data realistic, linked, and easy to replace with real APIs later.

## 2. General rules
- Use centralized mock datasets rather than independent hardcoded records in pages.
- Give records stable IDs.
- Use consistent date formats internally; format for display at the UI boundary.
- Keep entity relationships explicit.
- Derive counts and metrics from source records whenever feasible.
- Avoid impossible or contradictory sample metrics.
- Do not fabricate missing personal information.
- Do not treat local storage as a database.
- Keep data access behind small service functions where practical.

## 3. Core entities
Adapt to the current app's existing types and naming. Do not duplicate equivalent types.

### Lead
Suggested fields: `id`, `firstName`, `lastName`, `email`, `phone`, `companyId`, `source`, `location`, `interestedService`, `status`, `verificationStatus`, `assigneeId`, `branchId`, `createdAt`, `lastActivityAt`, `consentStatus`, `suppressionStatus`.

### Company
Suggested fields: `id`, `name`, `website`, `industry`, `location`.

### User
Suggested fields: `id`, `displayName`, `email`, `role`, `avatarUrl` or initials.

### Branch
Suggested fields: `id`, `name`, `location`, `status`.

### Saved list / segment
Use stable IDs and explicit list type. Saved lists hold manually selected lead IDs. Dynamic segments hold rule definitions and derive membership from current lead data.

### Campaign
Suggested fields: `id`, `name`, `status`, `audienceType`, `audienceId`, `subject`, `senderName`, `senderEmail`, `contentSnapshot`, `scheduledAt`, `createdAt`, `ownerId`, `branchId`.

### Delivery
Suggested fields: `id`, `campaignId`, `leadId` or recipient snapshot, `recipientEmail`, `status`, `attemptedAt`, `deliveredAt`, `errorCode`, `errorMessage`.

### Sequence and sequence step
A sequence has stable ID, name, status, audience reference, owner, and ordered steps. Each step references a template or stored content and a delay rule.

### Template
Suggested fields: `id`, `name`, `category`, `subject`, `body`, `ownerId`, `createdAt`, `updatedAt`, `archivedAt`.

### Deal
Suggested fields are defined in `10_SALES_MODULE_SPEC.md`; link to lead/company where possible.

### Task/activity
Use a consistent model for title, type, linked lead/deal, assignee, due date, status, priority, and completion timestamp where applicable.

## 4. Service abstraction
Prefer a small set of functions such as:
- `list`
- `getById`
- `create`
- `update`
- `archive` or `delete`
- `filter`
- `export`, if needed

Names should follow the current project's conventions. Do not create a generic enterprise data framework for a small frontend-only project.

## 5. Persistence
If the app already has a persistence strategy, preserve it. Otherwise, local storage can be used for selected user-created demo records, behind service functions and with safe parsing/fallback behavior. Static seed data should be recoverable.

Do not persist ephemeral UI state unnecessarily. Do not store secrets or pretend local storage provides secure authentication.

## 6. Metrics
Calculate totals from source records whenever feasible. When sample metrics are intentionally illustrative, keep them internally consistent and avoid suggesting they are real business analytics.

Examples:
- Deal value totals should match the included deals and their stage definitions.
- Delivery status totals should reconcile with delivery records.
- A completed task should no longer appear in the active task count.
- A dynamic segment's count should reflect its current rules and the same lead dataset.

## 7. Import and export
Validate imported data. Preserve row-level errors and duplicate warnings. Never silently discard invalid rows. Export only the records the UI says are in scope, and make clear whether the export uses current filters or selected rows.
