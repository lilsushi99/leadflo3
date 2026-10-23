# LeadFlow CRM — Design System

**Purpose:** This document is the visual source of truth for LeadFlow CRM. Read it before creating, refactoring, or styling any UI. Preserve the approved visual language while rebuilding functionality.

**Status:** Based on the design direction established for the current project. Where exact values are not confirmed by the existing source code, treat the values below as design tokens to verify against the approved UI before changing them.

## 1. Product design principles

LeadFlow is a premium, mature B2B SaaS application for a marketing and sales team. The interface should feel clear, calm, trustworthy, efficient, and polished—not futuristic or decorative.

Priorities, in order:
1. Preserve the approved existing design and visual identity.
2. Make workflows and data relationships understandable.
3. Make important actions easy to find and safe to use.
4. Use consistent spacing, typography, components, and interaction states.
5. Make the interface responsive and accessible.

### Avoid
- Gradients, glow effects, glassmorphism, neon purple/blue/pink palettes, and “AI glow”.
- Excessive bold text, unnecessary borders, dense clutter, blinking status indicators, emoji icons, and decorative effects without functional meaning.
- Default browser-looking dropdowns, unlabeled form controls, fake charts, hardcoded business metrics, or success messages for actions that did not succeed.
- Replacing existing components or redesigning screens without a functional or usability reason.

## 2. Design tokens

Use centralized CSS variables or the project's existing token system. Do not scatter repeated literal colors throughout components.

| Token | Default value | Intended use |
|---|---|---|
| `--lf-canvas` | `#F7F8F5` | Main application background |
| `--lf-surface` | `#FFFFFF` | Main cards and inner surfaces |
| `--lf-text` | `#20251F` | Primary text |
| `--lf-text-secondary` | `#69716A` | Supporting text, descriptions |
| `--lf-text-muted` | `#8B928C` | Placeholder, subtle metadata |
| `--lf-border` | `#E7EAE5` | Subtle separators and necessary outlines |
| `--lf-input` | `#F3F5F2` | Input and quiet inset surfaces |
| `--lf-primary` | `#76E05B` | Primary action accent and progress |
| `--lf-primary-soft` | `#EFFBEA` | Selected/active soft-green surfaces |
| `--lf-shell` | `#F0F2EE` | Outer shell around double-container cards (verify against approved screen) |
| `--lf-danger` | `#C65C52` | Destructive actions and meaningful negative states |
| `--lf-warning` | `#B88736` | Caution states |
| `--lf-info` | `#5475A5` | Informational states |

Do not use color alone to communicate status. Pair color with a label or icon. Maintain sufficient contrast, especially for muted text and small labels.

## 3. Typography

- Font family: **Outfit** only, unless the existing approved code has a documented reason otherwise.
- Use a clear hierarchy: page title, section title, card label, body, helper text, metadata.
- Primary text uses `--lf-text`; supporting content uses `--lf-text-secondary`; metadata may use `--lf-text-muted`.
- Use bold weights selectively. Avoid bolding entire tables or long descriptions.
- Numeric KPI values should be prominent but not oversized. Use tabular numerals where available for changing numeric values.
- Form labels must be visible and separate from placeholders. Placeholder text is not a replacement for a label.

Suggested hierarchy (adjust to match the existing UI):
- Page title: 24–30px, semibold.
- Section/card title: 14–18px, medium/semibold.
- Body: 13–15px, regular.
- Label and metadata: 11–13px, regular/medium.
- Helper/error text: 12–13px.

## 4. Spacing, layout and responsive behavior

- Use a consistent spacing scale (prefer multiples of 4px).
- Maintain generous whitespace and readable density.
- Align page headings, filters, cards, and tables to a consistent content grid.
- Avoid horizontal overflow on mobile; tables may use an intentional scroll container or a mobile-friendly record layout.
- Do not change the current sidebar/header dimensions without first checking the approved UI.
- Respect existing responsive breakpoints and behavior.
- Do not add a new layout framework or replace the current styling approach merely for preference.

## 5. Cards and double-container treatment

### Standard cards
- White surface on the off-white canvas.
- Rounded corners consistent across the application.
- Soft, restrained shadow only when needed to distinguish elevation.
- Do not outline every card with a visible stroke. Use spacing, surfaces and hierarchy first.

### KPI cards — approved double-container principle
- Outer shell: very light ash/off-white surface, no visible border.
- Inner card: white surface, no visible border.
- Keep the gap between outer shell and inner card approximately **1px**; do not create a large moat.
- Keep both outer and inner radii coordinated.
- Keep padding compact and consistent; avoid making KPI cards unnecessarily tall.
- KPI content should align cleanly: label, value, icon and comparison/metric.
- If the KPI is defined as a numeric metric, show the number and its appropriate comparison. If it is a chart KPI, use the chart treatment only where specified.
- Do not invent values. Real screens use API/database data; loading, empty, and error states are distinct.
- Large values may use compact notation (e.g. 99K, 100K) where that improves readability, while full values remain available in a tooltip or accessible label.

## 6. Borders, strokes, shadows and radii

- Default to no visible outline on KPI shells and major content containers.
- Use `--lf-border` for table separators, field boundaries when necessary, dividers and subtle structural separation.
- Avoid stacking a shadow, thick border and contrasting background on the same component.
- Focus rings must remain visible and accessible; do not remove keyboard focus indication.
- Use consistent radius tokens. Suggested starting scale: small 8px, medium 12px, large 16px, pill/full for tags and progress bars. Verify against existing components.
- Hover should be subtle: soft background shift, not glow or strong animation.

## 7. Color accents and status semantics

- Green is the primary action/positive accent, not a background for every component.
- Use pale green for active navigation and successful states.
- Use red sparingly for errors, destructive actions, bounces, and closed-lost/negative outcomes.
- Use amber for pending/needs-attention states.
- Use neutral grays for default, inactive, and metadata states.
- Avoid using green, red, or yellow solely as tiny blinking dots.
- Keep status labels legible and text-backed.

## 8. Icons

- Use the icon library already installed in the project, preferably Lucide where appropriate. Do not add a second icon library without a clear need.
- Icons must be consistent in stroke, size, alignment and color.
- No emoji in place of interface icons.
- Use icons to support labels, not replace essential text.
- For a compact icon container, use a subtle neutral or pale-green surface; avoid glow effects.
- Do not use an icon with an uncertain meaning for a destructive or high-impact action.

## 9. Sidebar and application shell

- Preserve the approved sidebar design, navigation hierarchy, spacing, logo treatment, and header alignment.
- Keep active navigation state clear with the existing pale-green background, green icon/text, and left-side active indicator where already implemented.
- Preserve the existing curved/rib-like parent-child navigation connector if it is part of the approved implementation; do not replace it with arrows or a generic straight connector without approval.
- Sidebar expansion and active states must reflect the current URL/route.
- Keep logo/brand placement and header separator alignment consistent with the approved design.
- Do not copy a reference image's sidebar if its structure conflicts with the product's specified navigation.

## 10. Forms and controls

- Every input must have a visible label, a useful placeholder when appropriate, and clear validation/help text.
- Use custom-styled rounded dropdowns and menus consistent with the application.
- Provide loading, disabled, invalid, success and error states.
- Keep destructive actions visually distinct and require confirmation where data loss is possible.
- For tag/keyword entry, pressing Enter should create a token/chip with a soft neutral fill, no visible stroke, and a clear way to remove it.
- Autocomplete must show loading, no-results and error states, and must use a configured provider rather than fabricated suggestions.
- Use semantic buttons and accessible keyboard navigation.

## 11. Tables and record views

- Tables should prioritize scanability: readable row heights, restrained separators, aligned numeric values, and a clear header row.
- Use soft ash dividers and subtle hover/selected-row backgrounds instead of heavy cell borders.
- Keep filters, search, column visibility and pagination consistent across record tables.
- Provide empty, loading, error and no-match states.
- Use stable IDs for records; do not use row position as a database identifier.
- Row actions should be clear and permission-aware.
- On small screens, use a deliberate responsive strategy rather than compressing every column until unreadable.

## 12. Charts and dashboards

- Charts must use real computed data, or explicitly labeled demo data during development.
- Show meaningful axes, legends, date ranges and empty states.
- Keep chart colors restrained and consistent with the design tokens.
- Never make a chart look populated when there are no underlying records.
- Define each KPI and chart calculation in the product requirements.
- Provide useful tooltips and accessible text summaries where feasible.

## 13. Interaction and motion

- Use brief, restrained transitions only when they clarify state changes.
- Avoid continuous animation, pulsing, blinking and ornamental motion.
- A visible action must do what its label promises.
- Never display a success toast before the server confirms success.
- On API failure, retain user input when possible and show a useful error.
- Confirm irreversible deletes and explain what will be deleted.

## 14. Accessibility

- Maintain keyboard access and visible focus states.
- Associate labels with fields.
- Use accessible names for icon-only controls.
- Do not rely on color alone.
- Respect reduced-motion preferences.
- Ensure adequate text contrast and usable touch targets.

## 15. Implementation rules for AI coding tools

Before editing:
1. Read this file and `PRD.md` in `Docs/`.
2. Inspect the existing components, tokens, routes and dependencies relevant to the task.
3. Identify which existing components should be reused.
4. Preserve the approved visual design unless a change is explicitly required.

While editing:
- Centralize reusable tokens and components.
- Do not redesign unrelated screens.
- Do not replace the current UI with generic boilerplate.
- Do not hardcode business data in UI components.
- Keep visual changes and business logic organized.
- Avoid introducing dependencies without explaining why.

After editing:
- Run available build, lint and type checks.
- Report the actual files changed and the checks performed.
- Identify any UI or integration that remains simulated or unconfigured.
