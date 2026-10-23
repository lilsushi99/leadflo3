# LeadFlow CRM — Accessibility, Responsive Design & QA

## 1. Accessibility
- Use semantic elements and accessible component primitives.
- All form controls need associated labels.
- Icon-only buttons need accessible names and tooltips where useful.
- Keyboard users must be able to reach and operate interactive elements.
- Focus indicators must remain visible, using the restrained green focus treatment.
- Do not rely on color alone for status.
- Check text/background contrast, particularly on primary green.
- Dialogs and drawers should manage focus appropriately.
- Tables should use meaningful headers and logical reading order.
- Validation messages should be associated with the relevant fields.

## 2. Responsive behavior
### Desktop
Use available width efficiently. Keep sidebar width stable and main content readable. Do not introduce oversized margins.

### Tablet
Reflow card layouts, filters, and multi-column sections. Keep actions reachable. Avoid overlapping header controls.

### Mobile
Use the existing responsive sidebar drawer or compact navigation. Stack forms and cards. Use horizontally scrollable tables or deliberate mobile record layouts. Ensure dialogs fit the viewport and actions remain accessible.

Prevent page-level horizontal overflow. Intentional table scrolling is acceptable.

## 3. Interaction states to test
- Default, hover, focus, active, selected, disabled.
- Loading where an actual asynchronous action exists.
- Empty data.
- No search results.
- Validation failure.
- Save success.
- Recoverable error.
- Destructive-action confirmation.
- Simulated integration behavior clearly labelled.

## 4. Regression checklist
Before completing a module:
- Overview still loads.
- All Leads still loads and filters correctly.
- Lead Discovery still loads.
- Lists & Segments still loads.
- Import & Enrichment still loads.
- Email Campaigns still loads.
- Email Deliveries still loads.
- Sequences & Follow-ups still loads.
- Templates still loads.
- Sidebar parent/child expansion works.
- Active route state is correct.
- Global header remains intact.
- No existing page was accidentally replaced.
- No broken icon imports.
- No obvious console errors.
- No new build/type/lint errors.
- Responsive layouts are checked.

## 5. Completion report
When finishing a task, state:
1. What was implemented.
2. Which interactions work.
3. Which data or integrations are simulated.
4. Which checks were run and their actual result.
5. Any known limitations or follow-up work.

Never claim that tests passed unless they were actually run.
