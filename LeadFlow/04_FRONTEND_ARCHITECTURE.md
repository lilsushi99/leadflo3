# LeadFlow CRM — Frontend Architecture & Change Safety

## 1. First inspect, then extend
Before coding, inspect:
- `package.json` and lockfile.
- Framework and build tool.
- App entry points and routing.
- Existing layouts and shared components.
- CSS strategy and design tokens.
- Icon and chart libraries already installed.
- Existing mock data, service functions, and types.
- Existing tests, lint, typecheck, and build commands.

Do not assume the project uses a particular stack just because a prior prompt mentioned it.

## 2. Architectural principles
- Preserve the existing stack unless there is a compelling reason to change it.
- Prefer small, focused changes.
- Reuse the current shell and shared components.
- Separate presentation, domain logic, and data access.
- Keep business rules out of deeply nested UI components where practical.
- Use stable identifiers for linked records.
- Avoid duplicate state when values can be derived from the source data.
- Avoid unnecessary global state libraries.
- Do not introduce a backend for a frontend-only task.
- Do not replace the router or styling system casually.

## 3. Suggested conceptual structure
Adapt to the repository; do not force this exact structure if the existing project has a better equivalent.

- `src/app/` or existing route directory: route/page entry points.
- `src/components/layout/`: application shell, sidebar, top header.
- `src/components/ui/`: shared buttons, inputs, dropdowns, badges, dialogs, tables.
- `src/features/overview/`: Overview-specific UI and selectors.
- `src/features/leads/`: Lead Intelligence UI and workflows.
- `src/features/outreach/`: campaign, delivery, sequence, template features.
- `src/features/sales/`: sales-specific pages and workflows.
- `src/data/`: centralized sample datasets.
- `src/services/`: frontend service abstractions.
- `src/lib/`: shared helpers, formatters, constants.
- `src/types/`: shared types/interfaces if the project uses them.
- `src/styles/`: global styles and token definitions if consistent with current setup.

This is a conceptual guide, not a mandate to move all existing files. Keep everything compatible with the existing project.

## 4. Component boundaries
Create shared components only when they genuinely improve consistency or reuse. Examples:
- PageHeader
- Primary/secondary button
- SearchInput
- FilterDropdown
- StatusBadge
- DataTable or table primitives
- ConfirmDialog
- DetailDrawer
- EmptyState
- Pagination
- FormField
- Toast/notification
- LoadingState

Do not create a large abstraction for a one-off component without a reason. Do not duplicate a shared component with a different name just to customize a page.

## 5. Routing
Use the project's existing router and route conventions. Each implemented destination must have a stable route. Avoid navigation actions that only change a label while showing unrelated content.

Use a clear route-to-active-sidebar mapping. Directly loading a route should highlight the correct navigation item and expand its parent section.

## 6. State management
Use local component state for isolated interactions. Use the existing app-level state approach for shared data. Do not install a global state library solely for a small frontend feature.

Derived metrics, filtered rows, and counts should be calculated from the relevant source data where practical. Avoid maintaining several independently editable copies of the same value.

## 7. Errors and resilience
- Handle empty datasets.
- Handle invalid form inputs.
- Handle missing optional fields.
- Avoid runtime errors when mock records are incomplete.
- Use stable keys in repeated UI.
- Avoid broken navigation and dead buttons.
- Keep destructive actions explicit.
- Do not silently swallow errors.

## 8. Change boundaries
When asked to build Sales:
- Implement Sales only, plus any genuinely necessary shared components.
- Preserve Overview, Lead Intelligence, and Outreach.
- Do not redesign the shell.
- Do not alter established design tokens unless fixing a clear inconsistency.
- Do not implement Insights, Workspace, or Administration unless explicitly requested.

## 9. Verification
Run available scripts for lint, type checking, tests, and build. If a script does not exist, do not invent a successful result. Report what was actually run and any pre-existing or new failures.
