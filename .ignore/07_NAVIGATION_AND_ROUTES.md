# LeadFlow CRM — Navigation & Route Rules

## 1. Shell
The application uses a left sidebar, a horizontal top header, and a scrollable main content area. Preserve the existing implementation.

## 2. Navigation tree
MAIN
- Overview

LEAD OPERATIONS
- Lead Intelligence
  - All Leads
  - Lead Discovery
  - Lists & Segments
  - Import & Enrichment
- Outreach
  - Email Campaigns
  - Email Deliveries
  - Sequences & Follow-ups
  - Templates
- Sales
  - Sales Pipeline
  - Deals
  - Tasks & Activities
  - Meetings & Calls
- Insights
  - Analytics & Reports
  - Team Performance
- Workspace
  - Team & Assignments
  - Branches
  - Integrations
- Administration
  - Credits & Billing
  - Settings
  - Audit & Compliance

## 3. Navigation behavior
- Parent groups expand/collapse.
- Clicking a child navigates to its real route.
- The current route determines the active item.
- A deep-linked child route automatically shows its parent expanded.
- Active child uses pale green row tint and a green circular marker.
- Child links keep their small circular markers and tree connector; do not replace them with icons.
- Parent items use recognizable icons from the existing icon library.
- Unimplemented modules remain visible but show a restrained Coming Soon state.
- Do not let unimplemented routes break the app or render unrelated pages.

## 4. Route implementation
Inspect the existing router and route naming before changing paths. Preserve existing URLs whenever possible. Use consistent naming and avoid duplicate routes.

Potential route patterns (adapt to the actual app):
- `/overview`
- `/leads`
- `/leads/discovery`
- `/leads/lists`
- `/leads/import`
- `/outreach/campaigns`
- `/outreach/deliveries`
- `/outreach/sequences`
- `/outreach/templates`
- `/sales/pipeline`
- `/sales/deals`
- `/sales/activities`
- `/sales/meetings`

These are suggestions only. The current repository's working route conventions take precedence.

## 5. Global header
Preserve existing global search, branch selector, notifications, and profile controls. Extend existing search only if the current architecture supports it safely. Do not add duplicate headers inside pages.
