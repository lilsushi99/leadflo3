# LeadFlow CRM — Shared Components & Interaction Contracts

## 1. Purpose
This document defines the behavior shared components should follow so the application remains predictable as new modules are added.

## 2. Page headers
A page header normally contains:
- One clear page title.
- One short supporting sentence.
- A primary action when the page has a main creation task.
- Secondary actions only when useful.

Avoid a label pill + title + subtitle stack on every page. Do not repeat the same heading in multiple places.

## 3. Search
- Search should filter the records shown in the current context.
- Use clear placeholders describing searchable fields.
- Show a clear action when the query is non-empty.
- Search and filters should compose.
- Do not reset unrelated filters when the query changes.
- Debounce only if necessary; do not add complexity for tiny local datasets.
- Empty search results should offer a way to clear the query or filters.

## 4. Filters
- Labels must be understandable.
- Selected values should remain visible.
- Provide clear/reset behavior.
- Use the same dropdown styling across modules.
- Do not imply a filter works if it is only decorative.
- If filters affect metrics and tables on the same page, keep them consistent.

## 5. Forms
- Use visible labels, not placeholder-only labels.
- Indicate required fields appropriately.
- Validate before saving.
- Show errors next to relevant fields and explain how to correct them.
- Preserve user input when a validation error occurs.
- Cancel should not save.
- Confirm destructive actions.
- Use a clear saving/disabled state when a real asynchronous operation exists; do not fake network behavior.

## 6. Dialogs and drawers
Use dialogs for short, focused actions and drawers for contextual detail or workflows that benefit from retaining the page behind them. Avoid giant dialogs that make forms hard to use.

Requirements:
- Clear title and purpose.
- Predictable close behavior.
- Escape/keyboard support when the underlying primitive supports it.
- Focus handling and accessible labels.
- Visible cancel and primary actions.
- Unsaved changes warning where appropriate.

## 7. Buttons
Every visible button must:
- Perform its advertised action, or
- Be visibly disabled with a reason, or
- Open a clearly identified unavailable/coming-soon state.

Do not leave decorative buttons that appear functional.

## 8. Status badges
Use the shared semantic status mapping in the design system. Do not invent a new color mapping for each module. Badge text remains explicit; color alone is not enough.

## 9. Tables
- Sorting indicators appear only on sortable columns.
- Pagination controls change the displayed rows.
- Row selection has a clear scope.
- Bulk actions operate on the selected records.
- More-actions menus are contextual and state-aware.
- Row clicks should not conflict with buttons inside the row.
- Keep tables accessible and responsive.

## 10. Feedback
Use the existing toast/notification pattern if available. Otherwise, implement a small consistent feedback component rather than browser alerts for ordinary success messages.

Feedback should state what actually happened. If the behavior was simulated, say so where that distinction matters.

## 11. Loading, empty, error, and success states
- Loading: concise and non-disruptive.
- Empty: explain the situation and suggest a relevant next step.
- Error: explain the problem and recovery action where possible.
- Success: confirm only completed actions.
- Simulated: distinguish demonstration behavior from real integrations.

## 12. Destructive actions
Deleting, archiving, removing a recipient, or cancelling a campaign should be explicit. Confirm irreversible actions. Use soft-delete/archive when appropriate to preserve mock data history.

## 13. Accessibility
Use semantic HTML and accessible component primitives. Ensure keyboard operation, visible focus, readable labels, meaningful icon-button names, and contrast. Never remove focus outlines without replacing them with an accessible alternative.
