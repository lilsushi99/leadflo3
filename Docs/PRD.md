# LeadFlow CRM — Product Requirements Document (PRD)

**Product:** LeadFlow CRM  
**Product type:** Internal CRM and lead-generation workspace for a marketing and sales company  
**Status:** Rebuild specification; implementation and provider access must be verified  
**Companion documents:** `DESIGN_SYSTEM.md`, `IMPLEMENTATION_STATUS.md`

## 1. Product vision

LeadFlow helps a marketing and sales team acquire potential customers, keep their contact information organized, qualify opportunities, communicate with prospects, track deals and revenue, and understand team performance.

The product should be a connected workflow—not a collection of visually polished but unrelated pages.

**Core workflow:** Acquire leads → store and organize contacts → assign ownership → qualify opportunities → communicate and follow up → close or lose deals → report results.

A separate opportunity-discovery workflow finds relevant public posts or business listings. A post is not automatically a lead; employees review it and create/link a lead when appropriate.

## 2. Product principles

1. **Database is the source of truth.** All persistent records and dashboard metrics must come from the backend/database, not hardcoded React arrays.
2. **One canonical lead.** A contact can be linked to multiple activities and deals without creating duplicate lead records.
3. **Truthful integrations.** Never invent search results, contact details, delivery events, open events, or successful operations.
4. **Provider-aware design.** External services have different API permissions, quotas, data fields and terms. Build provider adapters and show unavailable/unconfigured states honestly.
5. **Security by default.** Secrets stay on the server; authorization is enforced by backend endpoints, not only by hiding UI elements.
6. **Preserve the design system.** Follow `DESIGN_SYSTEM.md`.
7. **Incremental delivery.** Implement and test complete vertical slices instead of attempting an unverified all-at-once implementation.
8. **Privacy and lawful use.** Only collect and process data through permitted methods, honor provider terms and applicable privacy/marketing laws, and respect opt-outs.

## 3. Users and roles

### Owner / Administrator
- Manage system settings, users, roles, permissions and provider configuration.
- Access all authorized records, reporting and audit logs.
- Configure team targets and system-level defaults.

### Team Lead / Manager
- View assigned team performance and permitted team records.
- Assign leads, deals and tasks.
- Set employee targets and deadlines.
- Monitor sales activity and outcomes.

### Sales Representative
- View and manage assigned leads/deals.
- Log calls, notes, stage changes and follow-up tasks.
- Record deal amounts and outcomes according to permissions.
- Use permitted outreach features.

### Marketing Representative
- Use permitted lead acquisition, imports, forms, discovery and outreach tools.
- View or edit records based on assigned permissions.

Permissions must be configurable. Backend endpoints must enforce them. UI hiding alone is not security.

## 4. Application navigation

Recommended top-level navigation:

1. **Overview**
2. **Leads**
   - All Leads
   - Lead Discovery
   - Import & Enrichment
   - Forms & Capture
   - Lists & Segments
3. **Sales**
   - Pipeline
   - Deal Records
   - Follow-up Tasks (may also be accessible from Workspace)
4. **Outreach**
   - Compose / Campaigns
   - Email Activity
   - Templates
   - Sequences & Follow-ups
   - Email Account Setup
5. **Pain Points**
   - Search Configuration
   - Public Post Results
   - Saved Opportunities
6. **Insights**
   - Performance Overview
   - Lead Conversion
   - Revenue
   - Team Performance
7. **Workspace**
   - Team
   - Assignments & Targets
   - My Tasks
8. **Administration**
   - Users & Roles
   - Permissions
   - System Settings
   - Audit Logs
   - Provider Configuration (where appropriate)

Remove branch management because the business has one office. Avoid a large standalone Integrations area unless the product later requires it. Place provider configuration in the module where users need it, with a central admin view if useful.

Routes must map to actual screens, support direct navigation and refresh, and synchronize active/expanded sidebar state with the URL. Use the router already installed if sound; otherwise select a standard React routing solution.

## 5. Lead data model and All Leads

### Lead fields
- `id`: stable database ID; user-facing lead ID such as `LD-000001` generated server-side.
- `first_name`, `last_name` or `full_name`: store names in a structured, consistent way.
- `company_name`: optional.
- `email`: optional.
- `phone`: optional; normalize where possible and preserve country code.
- `industry`: optional.
- `product_service`: product/service the company intends to sell to the prospect.
- `source`: required source category where known (manual, import, website form, discovery, Google Maps, connected ad source, referral, etc.).
- `source_detail`: optional source/provider name or campaign/form reference.
- `location`: optional structured city/region/country where available.
- `verification_status`: unknown, unverified, verified, invalid; distinguish email and phone verification where needed.
- `owner_user_id` / assignee: optional until assigned.
- `created_by_user_id`.
- `created_at`, `updated_at`, `archived_at` if soft-delete is used.
- `notes` should preferably be stored in a related activity/note table, not an unbounded field.

Do not include branch as a lead field.

### All Leads table
Show a configurable/usable table with:
- Lead ID
- Name
- Company (optional)
- Source
- Phone
- Email
- Industry
- Product / Service
- Location
- Verification
- Sales status/stage (avoid confusing lead lifecycle status with deal stage)
- Assignee
- Created date
- Actions

Provide search, filters, pagination, bulk selection and permission-aware actions. Opening a lead should show its profile and activity history.

### Add/edit lead
- Validate inputs server-side and client-side.
- Permit records with incomplete data when appropriate; don't invent missing values.
- Detect likely duplicates using normalized email and phone, with careful review for ambiguous matches.
- If Source or Product/Service includes “Other,” reveal a custom value input and save the actual value.
- Preserve source attribution when leads enter from forms, imports, discovery or external providers.
- Saving must persist to the database and remain after refresh.

## 6. Import & Enrichment

Support CSV and Excel import where compatible libraries and file handling permit it.

Workflow:
1. Upload file with size/type validation.
2. Parse headers and preview rows.
3. Map source columns to LeadFlow fields.
4. Allow unmapped fields to be skipped; do not silently map incorrectly.
5. Preview missing values, invalid rows and possible duplicates.
6. Confirm import.
7. Save valid records and report imported, skipped, duplicate and failed counts.
8. Provide a downloadable error report when practical.

Do not claim the import succeeded until the backend confirms. Consider asynchronous jobs for large files. Enrichment must use configured, permitted providers; no fabricated data.

## 7. Forms & Capture

Allow authorized users to:
- Create and edit a form with configurable fields.
- Set required/optional fields, product/service context, and a source label.
- Preview the form.
- Publish a shareable hosted form URL and/or provide an embed snippet if supported.
- Receive form submissions through a public endpoint protected with validation, rate limits, anti-spam measures and appropriate consent language.
- Save each submission as a lead, preserving form/source attribution.
- Handle duplicates and submission errors.
- Export or review submissions.

A form builder is not an advertising-platform integration. Direct lead ingestion from Facebook/Instagram or other advertising platforms requires a separate supported integration and permissions. Do not claim universal ad-platform capture without it.

## 8. Lead Discovery

### Goal
Search supported and permitted sources for matching people/businesses and save genuine returned records into the CRM. Return up to the target count; never fabricate records to reach it.

### Inputs
- Keyword/name/hashtag chips; Enter creates a chip with soft neutral fill and no visible stroke.
- Location: city, region, country or supported radius, with provider-backed autocomplete.
- Target count, configurable within provider limits.
- Source/platform selection.
- Desired contact fields: email, phone or both.
- Optional validation filters.
- Search mode: person/profile/post discovery vs. business listing discovery.

### Supported-source model
Do not hardcode the assumption that all platforms expose identical data. Each source must have a provider adapter/capability configuration describing:
- Whether search is supported.
- Whether keyword, hashtag, profile, location or post search is supported.
- Available fields.
- Authentication and permission requirements.
- Quotas/rate limits.
- Terms and restrictions.
- Whether email/phone can legitimately be returned.
- Attribution/original URL availability.

Potential sources to evaluate (not a promise that all are available):
- Google Maps / Places: business listings and supported place fields.
- Google Search or a licensed web-search provider: web pages/posts indexed by that provider, subject to terms.
- YouTube Data API: supported video/channel search and public metadata; contact details are not guaranteed.
- X API: only the search capabilities and fields permitted by the selected access tier.
- Meta APIs: Facebook/Instagram access is permission- and use-case-dependent; advertising lead retrieval is distinct from general public-post search.
- LinkedIn APIs: access is restricted to approved products/scopes; do not assume broad profile or contact scraping.
- TikTok APIs: access and search features depend on approved products/scopes.
- Reddit API or approved provider: public discussions where access and terms permit.
- Google Trends: trend data is not a directory of personal contact details; any integration should use a supported source/provider and not promise an official public API where none is available.
- Other licensed discovery/search providers may be evaluated after requirements and budget are clear.

Do not use unauthorized scraping, bypass login/access controls, evade rate limits, or collect data in violation of provider terms. Respect applicable privacy law and marketing consent/opt-out requirements.

### Search behavior
- Create a discovery job record with requester, filters, sources, status, timestamps and provider job IDs as applicable.
- Show queued/running/completed/partial/failed states.
- Display progress only when the provider supplies meaningful progress; do not fake a percentage.
- Store each result with provider/source attribution, source URL when available, retrieval timestamp and a link to the job.
- Show contact fields only when actually returned or lawfully enriched.
- Mark verification as unknown/unverified unless an actual validation method reports a result.
- Deduplicate against existing leads and within the job.
- Allow review/selection before saving to All Leads, with an option to save all eligible results if explicitly selected.
- Handle partial results, rate limits, quota errors, provider not configured, no results, and provider outage clearly.
- A requested count is a maximum/target, not a guarantee.

### Location autocomplete
Use a configured, suitable provider such as Google Places Autocomplete or another licensed geocoding/autocomplete service. Review pricing, restrictions, API key restrictions and terms. Do not use the public Nominatim endpoint as a high-volume client-side autocomplete service. Keep secret credentials server-side where appropriate.

## 9. Google Maps / Business Discovery

Treat this as a mode within Lead Discovery.

Inputs:
- Business category/keyword (e.g. gyms, fitness centres).
- Location (e.g. California).
- Optional supported filters (phone, website, category, rating if permitted).

Possible result fields, depending on provider:
- Business name
- Category
- Address/location
- Phone
- Website
- Place/provider ID
- Source listing URL
- Rating/review metadata only where permitted and useful

Do not promise email addresses unless a configured, permitted provider actually supplies them. Save business records as leads with source attribution and available fields. Consider a `business`/company record linked to one or more individual contacts if the product needs richer account-based CRM later.

Google Places API is a likely option to evaluate; it requires project configuration, billing where applicable, and adherence to its display/storage rules.

## 10. Sales pipeline and deal management

### Pipeline stages
Active stages:
1. New Opportunity
2. Qualified
3. Proposal / Offer
4. Negotiation

Closing outcomes:
- Closed Won
- Closed Lost

Stage definitions:
- **New Opportunity:** new lead ready for sales follow-up.
- **Qualified:** conversation confirms a plausible need, interest and fit.
- **Proposal / Offer:** offer, product, scope or price has been presented.
- **Negotiation:** prospect is considering terms or needs follow-up.
- **Closed Won:** agreed closing condition is met; record the amount and date.
- **Closed Lost:** opportunity ends without a sale; record reason where available.

Users can move deals by drag-and-drop, stage selector or edit form. Every transition must persist and create stage history.

### Deal fields
- Deal ID
- Deal name
- Linked lead ID
- Product/service
- Owner/assignee
- Stage/outcome
- Deal amount and currency
- Expected close date
- Closed date
- Lost reason (when relevant)
- Next follow-up date
- Created/updated timestamps

Lead and deal are related but distinct records. One lead may have more than one deal over time. Provide “Add to Sales” from Leads; it creates a linked deal rather than duplicating the lead.

### Deal records page
Table columns:
- Deal ID/name
- Lead/customer
- Product/service
- Owner
- Stage/outcome
- Deal amount
- Created date
- Closing date
- Last contact
- Next follow-up
- Actions

Include search, filters, pagination and details/history.

### Call/activity logging
Users can log call date/time, outcome, notes, follow-up date and relevant stage change. Possible outcomes include no answer, follow-up requested, interested, not interested, qualified, and sale completed. Outcomes must be configurable or mapped clearly to workflow. A call outcome should not automatically mark a deal won unless the user confirms the closing conditions.

### Sales KPIs
- Open deals: deals not closed won/lost.
- Won deals: count of closed-won deals for the selected period/filter.
- Lost deals: count of closed-lost deals for the selected period/filter.
- Pending/negotiation: count in relevant active stages.
- Won deal value: sum of amounts for closed-won deals in the selected period.
- Revenue received should be a separate metric if payment transactions are later tracked.
- Profit must not be inferred from deal value; it requires cost/expense data.

## 11. Outreach and email

### Features
- Connect a supported email account/provider.
- Compose and send to selected eligible lead recipients.
- Reuse and edit saved templates.
- Store template name, subject, HTML/body and metadata.
- Preview HTML safely; sanitize user-provided HTML to prevent script injection.
- Campaigns with recipient selection, scheduling (if supported), send status and reporting.
- Email activity linked to lead/deal.
- Sequences and follow-up scheduling with safeguards.
- Unsubscribe/suppression handling and permission-aware recipient eligibility.

### Email provider requirements
Gmail API with OAuth may support a Gmail-connected workflow, subject to OAuth consent, scopes, verification/publishing requirements, quotas and provider policies. A dedicated transactional/marketing email provider may be more appropriate for bulk campaigns and event webhooks. Decide based on actual sending needs, volume, compliance, budget and provider restrictions.

Do not store a Google password. Use OAuth and store tokens securely server-side with appropriate encryption/access controls. Never expose access/refresh tokens in frontend code.

### Email events and metrics
Track provider-reported events, where available:
- Queued/accepted/sent
- Delivered
- Bounced
- Opened (tracking is imperfect and may be blocked or distorted by privacy features)
- Clicked (only if supported and configured)
- Replied (requires an actual reply-detection workflow)
- Unsubscribed/complained where available

A send request being accepted is not proof of delivery. Do not promise inbox placement or exact spam-folder detection unless a provider actually supplies reliable information. Email warming is a separate third-party capability and must not be simulated as real.

### Six requested dashboard metrics
Sent, delivered, bounced, opened, replied, and unopened/unknown. Label the last metric carefully because opens are not perfectly observable. Report date range and source. No hardcoded counts.

## 12. Pain Points / public opportunity discovery

### Goal
Find public posts/discussions that indicate a need the company can address.

Search inputs:
- Exact phrases and keywords.
- Boolean operators where supported by provider.
- Optional location/language/date filters when supported.
- Selected supported sources.

Result fields where permitted:
- Post text/snippet
- Platform/source
- Author/profile reference where available
- Post date
- Original post URL
- Match terms / reason for relevance
- Review status (new, relevant, dismissed, actioned)
- Assigned reviewer

Actions:
- Open original post.
- Mark relevant or dismiss.
- Assign for review.
- Save the author as a lead only when permitted and sufficient data is available.
- Record a response/action note if useful.

Do not generate fake posts. A post is not automatically a lead or a verified business opportunity. Do not implement automated public replies without explicit product, provider, permission and compliance review.

## 13. Overview dashboard

The Overview should be derived from the same saved records as the modules.

### Recommended KPIs
- Leads discovered (define whether this means discovery results, unique leads saved, or all acquired leads; label precisely).
- Qualified leads.
- Deals won.
- Revenue recorded from won deals.
- Emails sent.
- Emails opened, where tracking is enabled.

Each KPI needs a documented calculation, date filter and loading/empty/error state. Avoid double-counting a lead across sources or discovery jobs.

### Charts and sections
- Activity chart: deals won and deals lost over time; optionally include won deal value.
- Lead sources pie chart: counts of leads grouped by recorded source.
- Recent leads: newest lead records.
- Priority tasks: assignments for the logged-in user, with due date, status, priority and progress.
- Team/manager views may show additional permitted performance summaries.

Do not describe deal value as profit. If expenses and cost accounting are not implemented, do not show a “profit” KPI.

## 14. Workspace, assignments and targets

- Manage team member records and role assignments.
- Assign leads, deals and tasks to users.
- Record assignment timestamps and reassignment history.
- Allow managers to set individual targets with metric, amount/count, period, start/end dates and owner.
- Show each user their tasks and targets.
- Calculate progress from actual records and documented rules.
- Support task states such as open, in progress, completed and cancelled.
- Audit changes to important records and targets.
- Team performance metrics must respect date range and permissions.

## 15. Authentication, authorization and administration

- Secure login/logout and session/token lifecycle.
- Password hashing if using local credentials; never store plaintext passwords.
- Prefer a proven authentication implementation/library rather than inventing cryptography.
- Protect API routes on the server.
- Validate and authorize every create/read/update/delete action.
- Prevent one user from accessing another user's restricted records through direct API requests.
- Provide password reset and invitation flows if in scope.
- Record significant administrative and data changes in audit logs.
- Apply rate limits, input validation, secure headers, CORS configuration and safe error handling.
- Do not expose stack traces, secrets, tokens or database errors to end users.

Firebase Authentication is optional. If used, define clearly how Firebase identity maps to the MySQL user/role record. Do not create two competing sources of truth for user permissions.

## 16. Backend and project structure

Target separation:

- `frontend/`: React application, components, pages, client-side validation and API client.
- `backend/`: Express application, routes/controllers, services, repositories/data access, validation, authentication/authorization, provider adapters and jobs.
- `Docs/`: design system, PRD, implementation status and integration notes.
- `database/` or backend migrations directory: versioned schema migrations and separate seed/demo data.

The current application may not use this layout. Inspect the existing project first and migrate carefully. Do not blindly move files if that breaks Vite paths, build commands, deployment or imports. Keep package scripts and deployment instructions updated.

Use modular backend organization, for example:
- `routes/`
- `controllers/`
- `services/`
- `repositories/`
- `middleware/`
- `validators/`
- `providers/`
- `jobs/`
- `config/`
- `migrations/`
- `seeds/`
- `tests/`

Use an API prefix such as `/api/v1` if compatible with the project.

## 17. Database and migration requirements

MySQL is the intended database. The backend should connect through environment variables and a connection pool.

Required deliverables:
- `.env.example` with placeholder values only.
- `.env` created locally only when the user supplies credentials; never commit it or include real secrets in a prompt or source repository.
- Versioned schema migrations as the authoritative repeatable schema definition.
- Separate optional seed/demo SQL (e.g. `seed_demo.sql`) that is clearly labeled as test data and never mixed with production records.
- Migration instructions and rollback/backup guidance where feasible.
- Database indexes and foreign keys for key relationships.
- Timestamps, appropriate decimal/currency representation and transaction-safe updates where required.

Do not make the user manually import both migrations and a competing “actual SQL” schema that can drift. Prefer one canonical migration path. If an importable SQL export is also supplied for phpMyAdmin, generate it from the same schema/migration version and document that it is equivalent. Demo data must be separate from schema SQL.

Example environment variable names (placeholders only):
- `NODE_ENV`
- `PORT`
- `APP_URL`
- `FRONTEND_URL`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_NAME`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `SESSION_SECRET` or the selected auth secret
- Provider-specific credentials, added only after provider selection

Do not commit `.env`. Add `.env` to `.gitignore`. Never put DB credentials in frontend environment variables or browser bundles.

### Remote development database safety
A publicly reachable MySQL endpoint increases risk. Prefer a VPN, SSH tunnel, IP allowlisting, or a private network where possible. If Hostinger remote MySQL is required:
- Allow only the developer's current public IP when feasible, not all IPs.
- Use a dedicated least-privilege database user.
- Use TLS/secure transport if supported.
- Use a separate development database, never production data.
- Keep credentials out of chat prompts, screenshots, Git and frontend code.
- Back up before migrations and rotate credentials if exposed.
- Restrict the DB user to only the necessary database.
- Do not expose phpMyAdmin publicly without strong access protection.

## 18. API and provider strategy

There is no single universal API that safely returns every public social post, profile, hashtag and personal email/phone across all requested platforms. Provider selection must be explicit.

Create provider adapters with a consistent internal interface. The app should not be coupled to one provider's response schema. Each adapter must document capability, authentication, fields, quotas, cost, terms and failure behavior.

Evaluate providers before implementing:
- Google Places API for business listing search and supported place details.
- Gmail API/OAuth for individual or supported Gmail-connected sending, subject to permissions and quotas.
- A transactional/marketing email provider for campaign sending and event webhooks if needed.
- Official platform APIs or licensed providers for X, YouTube, TikTok, Reddit, Meta and LinkedIn, subject to actual product access and terms.
- A licensed web-search provider for public web search if needed.
- A suitable location autocomplete/geocoding provider.

Do not claim broad LinkedIn/Instagram/Facebook profile scraping, universal email extraction, or hashtag coverage without an actual provider and permission. Do not use public Nominatim as a high-volume client-side autocomplete endpoint. Do not assume Google Trends offers a general official API for all desired functionality.

Provider configuration should be represented as enabled/disabled/not configured and should expose meaningful health/error states without revealing secrets.

## 19. Non-functional requirements

- Security: server-side auth/authorization, secure secret handling, validation, rate limiting and safe logging.
- Reliability: clear loading/error/retry states, transactional updates for related writes and idempotency for webhook/job processing where practical.
- Performance: pagination for large tables, indexed searches, background jobs for long discovery/import/send operations.
- Maintainability: typed request/response contracts where practical, modular provider adapters and shared validation.
- Observability: structured logs and job status; do not log passwords, OAuth tokens or unnecessary personal data.
- Accessibility: follow `DESIGN_SYSTEM.md`.
- Deployability: provide clear local and Hostinger deployment steps and verify the actual hosting plan supports the backend runtime.

## 20. Implementation sequence

1. Preserve current design; inspect repo; create/verify design tokens and docs.
2. Establish frontend/backend split and deployment-safe scripts.
3. Set up MySQL schema/migrations, health check, authentication and roles.
4. Implement leads CRUD, All Leads, activity, assignments and database persistence.
5. Implement CSV/Excel import and forms.
6. Implement Sales pipeline and deal records.
7. Implement Overview KPIs from database records.
8. Add provider-backed discovery modes after provider choice and credentials.
9. Add email connection/sending/event tracking.
10. Add Pain Points provider(s).
11. Add team targets, insights, audit logs and remaining refinements.
12. Test, secure and deploy.

Each phase must be tested before moving to the next. Do not build every module as a visual mock and call it complete.

## 21. Acceptance criteria

A feature is not “functional” merely because its screen renders or a button responds.

General acceptance:
- Data survives page refresh and application restart.
- API validates requests and returns appropriate status codes.
- Unauthorized users are denied by the backend.
- UI displays loading, empty, success and error states correctly.
- Errors do not erase user input unnecessarily.
- No fabricated records or metrics are presented as real.
- Build, type and relevant tests pass.
- The implementation report names changed files and checks performed.

Specific acceptance examples:
- Add lead: record is stored in MySQL, assigned a stable ID and visible after refresh.
- Import: user maps columns, previews data, confirms import and sees a true success/error summary.
- Pipeline: stage changes persist and stage history is recorded.
- Won deal: amount and closing date are stored; overview revenue updates from the documented calculation.
- Discovery: provider not configured is clearly shown; configured provider results include source attribution and are saved only after permitted processing.
- Email: message status comes from provider response/events; no false delivery/open claims.
- Permissions: direct API calls cannot bypass role restrictions.
- Dashboard: metrics reflect database records and selected filters.

## 22. Open decisions to resolve before live integrations

- Which lead-discovery provider(s) are affordable and permitted for each desired source?
- Is Gmail sufficient for the initial sending use case, or is a dedicated campaign provider required?
- What expected email volume and sending compliance requirements apply?
- Which currency/currencies will deals use?
- What exact event qualifies a deal as Closed Won: signed agreement, payment received, or another company rule?
- What fields are required on the public lead form and what consent language is needed?
- Which Hostinger plan and Node.js deployment features are available?
- Which metrics should be visible to each role?

Do not block the database, leads, pipeline and basic app foundations while these provider decisions are pending. Build provider-ready interfaces, but show unconfigured states rather than fake results.
