# LeadFlow CRM — Sales Module Frontend Specification

## 1. Scope
Implement the Sales module within the existing LeadFlow CRM shell. Read all applicable files in this folder before coding, especially:
- `01_PROJECT_CONTEXT.md`
- `02_PRODUCT_PRD.md`
- `03_DESIGN_SYSTEM.md`
- `04_FRONTEND_ARCHITECTURE.md`
- `05_COMPONENTS_AND_INTERACTIONS.md`
- `06_DATA_AND_MOCK_SERVICES.md`
- `07_NAVIGATION_AND_ROUTES.md`
- `08_FRONTEND_SKILLS_AND_DEPENDENCIES.md`
- `09_ACCESSIBILITY_RESPONSIVE_QA.md`

Do not redesign the shell or rewrite completed Overview, Lead Intelligence, or Outreach features.

Implement these Sales destinations:
1. Sales Pipeline
2. Deals
3. Tasks & Activities
4. Meetings & Calls

Use centralized mock data and working frontend interactions. No real backend, calendar provider, email provider, or CRM integration is assumed.

## 2. Sales user goals
Users should be able to:
- Understand the current sales pipeline.
- See which opportunities are moving, stalled, won, or lost.
- Create and update deals.
- Link deals to existing leads and companies.
- Track next actions and sales activities.
- Schedule and manage meetings/calls in the local demo.
- Filter work by stage, owner, branch, date, and status.
- See consistent information across pipeline, deals, tasks, and meetings.

## 3. Shared Sales design rules
Follow `03_DESIGN_SYSTEM.md`. Use the existing left sidebar, header, Outfit typography, primary green `#76E05B`, off-white canvas, white surfaces, subtle dividers, quiet hover states, and soft semantic badges.

No gradients, glow, neon, futuristic icons, decorative outlines, excessive KPI cards, or default-looking template redesigns.

Use the existing icon library. Appropriate icons might include briefcase-business, chart-no-axes-combined, check-square, calendar-days, phone, video, plus, filter, and ellipsis. Choose valid icons from the installed library; do not install a second icon set.

## 4. Sales Pipeline

### Heading
**Sales Pipeline**

Description: “Track opportunities from first conversation to closed deal.”

Primary action: **Add Deal**

### Pipeline overview
Create a clean pipeline board grouped by the existing stage model. A kanban-style board is suitable if it remains readable and responsive. Each stage should show:
- Stage name.
- Number of deals.
- Total deal value for that stage.
- Deal cards.

Suggested initial stages:
1. New Opportunity
2. Qualified
3. Proposal
4. Negotiation
5. Closed Won
6. Closed Lost

Inspect existing code/data before adopting these labels; reuse established stages where they exist. Avoid duplicate or contradictory stage definitions.

### Deal card
Each card should show only useful information:
- Deal name.
- Company or lead.
- Deal value and currency.
- Expected close date.
- Owner/assignee.
- Priority or risk indicator where appropriate.
- A contextual actions menu.

Use compact cards with restrained borders and spacing. Do not fill each card with unnecessary icons and badges.

### Pipeline behavior
- Clicking a deal opens its detail drawer/page.
- Add Deal opens a validated form.
- Stage changes update the deal and the stage totals.
- If drag-and-drop already exists or can be added cleanly, allow deals to move between stages. Otherwise, provide an accessible stage-change control.
- Closed Won and Closed Lost should be handled distinctly.
- Confirm stage transitions that would have significant consequences if appropriate.
- Filters should update the board and summary values consistently.
- A no-results state should explain how to clear filters.

### Pipeline summary
If useful, show a compact summary for:
- Open Pipeline Value.
- Deals Won.
- Deals Lost.
- Expected Close Value or another relevant metric.

Keep the summary small and subordinate to the pipeline. Do not add a large grid of decorative KPIs.

## 5. Deals page

### Heading
**Deals**

Description: “Review and manage sales opportunities across your workspace.”

Primary action: **Add Deal**

### Table
Use a clean table with relevant columns:
- Deal Name
- Lead / Contact
- Company
- Stage
- Deal Value
- Probability, if used
- Expected Close Date
- Owner
- Branch
- Last Activity
- Actions

Use consistent mock records linked to the Lead Intelligence dataset. Avoid separate fictional copies of leads and companies.

### Search and filters
Support:
- Search by deal, contact, or company.
- Stage.
- Owner.
- Branch.
- Expected close date range.
- Deal value range if practical.
- Won/lost/open state.

Search and filters should compose. Provide a clear reset action.

### Deal form
Include:
- Deal name.
- Linked lead/contact from existing leads.
- Company, derived where possible from the linked lead or selected from existing companies.
- Deal value.
- Currency, using the existing project convention.
- Stage.
- Probability if the product uses it.
- Expected close date.
- Owner.
- Branch.
- Notes/description, optional.

Validate required fields and sensible values. Do not accept negative deal values. If stage probabilities are used, centralize the defaults and allow manual overrides only if appropriate.

### Deal details
Show:
- Deal name and stage.
- Value and expected close date.
- Linked contact and company.
- Owner and branch.
- Notes.
- Related activities and meetings.
- A concise activity timeline where mock data exists.

Support editing and stage changes. Do not invent historical events. Only show events present in the mock dataset or created through the UI.

## 6. Tasks & Activities page

### Heading
**Tasks & Activities**

Description: “Keep sales actions organized and follow up at the right time.”

Primary action: **Create Task** or **Log Activity**, depending on the current UI convention.

### Distinguish tasks from completed activities
Tasks represent actions to be completed. Activities represent logged events such as a call, email, meeting, or note. Do not make these concepts indistinguishable.

Use tabs or a clear view selector:
- Tasks
- Activity History

### Tasks view
Useful fields:
- Task Title
- Related Lead or Deal
- Type
- Due Date
- Priority
- Assigned To
- Status
- Actions

Support filters:
- Due Today
- Upcoming
- Overdue
- Completed
- Assignee
- Branch
- Priority

Actions:
- Complete.
- Edit.
- Reschedule.
- Open linked lead/deal.
- Delete or archive where appropriate.

Completing a task must update the underlying mock record and any relevant summary counts.

### Activity history
Support activity types such as:
- Call.
- Email.
- Meeting.
- Note.
- Stage Change.

Show:
- Activity type.
- Summary.
- Linked lead/deal.
- Owner.
- Timestamp.
- Outcome, if relevant.

Provide a **Log Activity** workflow with fields appropriate to the selected activity type. Do not pretend a logged email was sent through a real provider.

## 7. Meetings & Calls page

### Heading
**Meetings & Calls**

Description: “Plan conversations and keep a clear record of customer interactions.”

Primary action: **Schedule Meeting**. A separate **Log Call** action may be provided if it fits the current design.

### Main interface
Provide a practical agenda/list view, with optional calendar-style view if it can be implemented reliably without a large new dependency.

Useful filters:
- Today.
- Upcoming.
- Past.
- Meeting or call type.
- Owner.
- Branch.
- Status.

### Meeting fields
- Title.
- Related lead/contact.
- Related deal, optional.
- Meeting type (in-person, phone, video, other).
- Start date and time.
- End time or duration.
- Owner/attendees.
- Location or meeting link, optional.
- Notes.
- Status.

Validate that the end time follows the start time. Use local date/time conventions consistently.

### Call logging
Fields may include:
- Contact.
- Related deal.
- Date and time.
- Call outcome.
- Duration, optional.
- Notes.
- Next follow-up task, optional.

Suggested outcomes:
- Connected.
- No Answer.
- Voicemail.
- Follow-up Required.
- Completed.

Do not imply calls or calendar invitations were actually made or sent. This is a frontend demonstration until a provider is connected.

### Meeting behavior
- Create, edit, view, cancel, and mark completed for local demo records.
- Show upcoming and past meetings accurately.
- Link meetings and calls to existing leads and deals.
- If a follow-up is created from a meeting/call, it should appear in Tasks & Activities using the same task dataset.

## 8. Data model and relationships
Use centralized mock data and stable IDs.

Suggested Deal fields:
- `id`
- `name`
- `leadId`
- `companyId`
- `value`
- `currency`
- `stage`
- `probability` (optional)
- `expectedCloseDate`
- `ownerId`
- `branchId`
- `description`
- `createdAt`
- `updatedAt`
- `lastActivityAt`

Suggested Task fields:
- `id`
- `title`
- `type`
- `leadId` (optional)
- `dealId` (optional)
- `dueAt`
- `priority`
- `status`
- `assigneeId`
- `branchId`
- `notes` (optional)
- `completedAt` (optional)

Suggested Activity fields:
- `id`
- `type`
- `summary`
- `leadId` (optional)
- `dealId` (optional)
- `ownerId`
- `occurredAt`
- `outcome` (optional)
- `notes` (optional)

Suggested Meeting/Call fields:
- `id`
- `type`
- `title`
- `leadId`
- `dealId` (optional)
- `ownerId`
- `startAt`
- `endAt` or `duration`
- `status`
- `location` or `meetingLink` (optional)
- `notes` (optional)
- `outcome` (optional)

Adapt these types to existing conventions rather than creating duplicate equivalents.

## 9. Mock-data consistency
- Pipeline cards and Deals table must use the same deal records.
- Stage totals must reflect the current filtered deal data.
- Deal values must reconcile with pipeline totals.
- Linked contacts must refer to existing leads.
- Company information should be shared where possible.
- Activities should link to valid lead/deal IDs.
- Completing a task should update the task list and counts.
- Creating a meeting follow-up should create a task in the shared task dataset.
- Date filters must use a consistent date interpretation.

## 10. Empty, loading, and error states
Include:
- No deals in this stage.
- No matching deals.
- No upcoming meetings.
- No tasks due.
- Invalid form values.
- Missing linked record.
- No activity history.

Do not use a blank panel with no explanation.

## 11. Out of scope
Do not build:
- Real authentication or role enforcement.
- Backend persistence or database migrations.
- Real calendar provider integration.
- Real telephony/calling.
- Real email sending.
- Sales forecasting that claims production accuracy.
- Insights, Workspace, or Administration modules.

Do not imply that any of these integrations exist.

## 12. Definition of done
- All four Sales destinations work.
- The sidebar and header are preserved.
- Existing Overview, Lead Intelligence, and Outreach remain functional.
- Add/edit deal works in the frontend.
- Pipeline stage changes update totals.
- Search and filters work.
- Tasks can be completed/rescheduled.
- Activities can be logged.
- Meetings/calls can be created and updated.
- Shared data relationships are consistent.
- Responsive behavior is checked.
- Available build/lint/type checks are run and honestly reported.
