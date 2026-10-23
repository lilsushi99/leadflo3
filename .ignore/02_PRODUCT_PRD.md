# LeadFlow CRM — Frontend Product Requirements

## 1. Product vision
LeadFlow CRM helps teams discover potential leads, organize and qualify them, conduct outreach, track engagement, manage sales opportunities, and understand performance.

The product should feel like a coherent professional SaaS workspace, not a collection of unrelated dashboard templates.

## 2. Current delivery approach
Build in modules while maintaining one shared shell, design system, route structure, and data model. Frontend interactions should be demonstrable without pretending that backend services are connected.

### Current or previously scoped modules
- Overview: agency-level snapshot and activity.
- Lead Intelligence: master lead register, discovery workflow, lists/segments, import/enrichment.
- Outreach: campaigns, delivery records, sequences/follow-ups, reusable templates.
- Sales: pipeline, deals, tasks/activities, meetings/calls.
- Insights: analytics and reporting.
- Workspace: team, assignments, branches, integrations.
- Administration: credits/billing, settings, audit/compliance.

## 3. User types
Use these as product roles for UI planning, not as real authentication until authentication exists:
- Workspace owner/admin: manages workspace configuration and access.
- Manager: monitors performance, assigns work, reviews deals and activities.
- Sales representative: manages assigned leads, deals, tasks, and meetings.
- Outreach operator: manages campaigns, sequences, templates, and delivery status.
- Analyst: reviews reports and trends.

The frontend may show role labels and sample ownership, but must not imply real permission enforcement without an implemented authorization layer.

## 4. Product principles
- Clear next action: every page should make its primary task obvious.
- Data integrity: repeated entities should refer to the same mock records.
- Progressive disclosure: show important information first; expose advanced controls when needed.
- Consistency: shared controls behave the same across modules.
- Honest states: simulated functions must be represented honestly.
- Useful density: fit meaningful information without cramped text or excessive whitespace.
- Reversible actions: confirm destructive operations and support cancel/undo where practical.
- Accessibility: keyboard support, clear labels, and readable contrast.
- Responsive by design: preserve workflows across desktop, tablet, and mobile.

## 5. Common page structure
Use the existing app shell and follow this page pattern where appropriate:
1. Page title and one concise description.
2. Primary action aligned with the heading.
3. Search and relevant filters.
4. Optional compact summary strip only when useful.
5. Main table, list, chart, editor, or workflow.
6. Contextual detail drawer/dialog when useful.
7. Empty, loading, error, and success states.

Avoid adding KPI grids to every module. Metrics should serve the task rather than decorate the page.

## 6. Data and integration truthfulness
No database, live email provider, external enrichment service, or real billing integration should be assumed. Use mock services and realistic sample data until the project actually connects a provider.

Examples:
- “Activate sequence” may activate a local simulated configuration; it must not imply real scheduled email execution.
- “Schedule campaign” may save a mock schedule; it must not imply a provider accepted the schedule.
- “Import” may parse a file in the browser and update mock data; it must not claim a server database was updated.
- “Retry delivery” may change a demo record; it must not claim a real message was resent.

## 7. Product-wide behavior
- Search and filters should compose predictably.
- Reset filters should clear the relevant filters only.
- Tables should support sorting/pagination where useful.
- Detail views should use the same entity data as list views.
- Use consistent status definitions across modules.
- Forms validate required fields and show actionable messages.
- Avoid silent data loss.
- Keep user-created frontend demo data consistent across views; local persistence is optional and should sit behind a service abstraction.

## 8. Out of scope until explicitly approved
- Real authentication/authorization.
- Real database or API integration.
- Actual outbound email delivery and scheduling.
- Actual enrichment/verification provider.
- Real payment processing or billing.
- Real integrations with third-party platforms.
- Production background jobs and automation.

Do not create these systems as part of a frontend-only task unless the user explicitly changes the scope.
