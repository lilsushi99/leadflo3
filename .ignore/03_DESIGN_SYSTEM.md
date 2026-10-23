# LeadFlow CRM — Design System & UI/UX Rules

## 1. Visual direction
Professional, restrained, modern B2B SaaS. The interface should feel clear, mature, and calm. Premium quality comes from proportion, typography, spacing, and interaction—not visual effects.

## 2. Brand and color tokens
Primary green is confirmed: `#76E05B`.

Use centralized CSS variables/design tokens. Suggested starting palette:
- `--color-primary: #76E05B`
- `--color-primary-hover`: a slightly darker, accessible derivative of the primary green
- `--color-primary-soft`: a very pale green tint for selected states
- `--color-canvas: #F7F8F5` (warm off-white)
- `--color-surface: #FFFFFF`
- `--color-text: #20251F`
- `--color-text-secondary: #69716A`
- `--color-text-muted: #8B928C`
- `--color-border: #E7EAE5`
- `--color-input: #F3F5F2`
- Semantic success/info/warning/error colors with pale backgrounds and readable foreground text.

The exact existing tokens in the repository take precedence unless they conflict with the confirmed brand rules. Avoid duplicate token definitions.

### Color usage
- Use green for primary actions, selected navigation markers, subtle focus states, and positive states.
- Most of the interface should remain neutral.
- KPI cards are white on a warm off-white canvas.
- Do not use primary green as a full background for large areas unless a specific component clearly requires it.
- Do not rely on color alone to communicate status.

## 3. Strict visual prohibitions
- No gradients anywhere.
- No neon/cyberpunk palettes.
- No glows, halos, flickering, or pulsing indicators.
- No glassmorphism.
- No unnecessary decorative strokes or card outlines.
- No outlines around status badges.
- No excessive shadows or floating cards.
- No oversized icon circles used as decoration.
- No random emoji as UI icons.
- No futuristic AI/database/server/CPU iconography.
- No excessive pills, chips, labels, or three-level title treatment.
- No Space Grotesk and no monospace font in the UI.
- Do not bold every heading or label.

## 4. Typography
Use Outfit only. Reuse the existing font import if present; otherwise import Outfit from Google Fonts using the project's established font-loading method. Avoid introducing another font family.

Suggested hierarchy:
- Page title: 24–28px, semibold
- Section title: 16–18px, medium/semibold
- KPI value: 26–32px, semibold
- Body: 14px, regular
- Table header: 12–13px, medium
- Supporting text: 13–14px, regular
- Metadata: 12px, regular
Use weight and color thoughtfully. Most headings need not be bold. Keep line lengths and line heights readable.

## 5. Spacing, radii, and borders
Use a consistent spacing scale, ideally based on 4px increments. Common spacing can include 4, 8, 12, 16, 20, 24, 32, and 40px.

Use moderate radii consistently:
- Inputs and compact controls: roughly 8–10px
- Cards and dialogs: roughly 10–14px
- Pills: fully rounded only when the component is semantically a badge or chip.

Avoid making every surface heavily rounded. Use borders only when they clarify structure. Default dividers should be thin and low contrast.

## 6. Sidebar
- Sidebar is on the LEFT on desktop.
- Brand/logo at the top; logo must be replaceable by SVG or PNG.
- Navigation grouped with small muted-gray group labels.
- Parent items use recognizable icons and expandable chevrons.
- Child items are indented and use small circular markers with a subtle vertical tree connector.
- Keep circles for child navigation; do not add icons to every child.
- Active child row has a faint green background; active marker uses `#76E05B`.
- Hover is a subtle neutral or pale-green tint.
- No glowing, gradient, flashing, or bright active states.
- Bottom area contains Lead Credits, workspace/branch selector, and profile.
- Navigation can scroll independently when necessary; bottom controls remain accessible.
- Keep row heights, icon alignment, indentation, and group spacing consistent.

## 7. Horizontal header
Preserve the existing horizontal header above the main content:
- Global search on the left.
- Branch/date controls where relevant.
- Notification control and profile shortcut where already implemented.
- Compact, aligned controls with consistent heights.
- No second competing navigation bar.
- No excessive shadows or heavy bottom borders.
- Responsive layout must prevent overflow.

## 8. Buttons
Create/reuse variants:
- Primary: `#76E05B`, readable dark text if contrast requires it, no border, moderate radius.
- Secondary: neutral surface or subtle border.
- Tertiary: quiet text/button style.
- Icon button: compact, clear accessible name/tooltip where needed.
- Destructive: semantic red treatment only for destructive actions.

Hover: slight color change, no glow/gradient. Focus: restrained but visible. Disabled: clearly inactive. Use consistent heights and padding.

## 9. Inputs and dropdowns
- Default input surface: soft ash gray.
- Placeholder: muted but readable.
- Focus: subtle green border/ring; no radiating gradient or bright halo.
- Dropdowns open under their trigger, align correctly, and use a clean white surface.
- Selected option: pale green background and/or restrained green indicator.
- Keyboard navigation and visible focus are required.
- Inputs of the same type should have consistent heights and spacing.

## 10. Status badges
Rounded rectangles with pale semantic fills and no visible outline. Use compact padding and readable text.
- Green: positive/completed/qualified/delivered.
- Blue: informational/contacted/in progress.
- Amber: pending/attention.
- Red: failed/invalid/urgent.
- Purple: secondary classification where useful.
- Gray: neutral/inactive/unknown.
Use a consistent mapping across modules.

## 11. Tables
- Muted headers, readable dark text, subtle dividers.
- Consistent row padding and column alignment.
- Subtle hover, no heavy row outlines.
- Sort indicators only where sorting works.
- Pagination must work if displayed.
- Select-all should have a clear scope (current page vs all filtered records).
- Horizontal scroll or responsive table pattern on narrow screens.
- Do not use tiny text to force all columns into view.

## 12. Cards, KPI blocks, and charts
KPI cards: white surface, restrained radius, consistent padding, no gradient, no decorative outline. Use only metrics relevant to the page.

Area charts: crisp green line; solid green fill under curve at approximately 10–20% opacity; fill clipped to the line shape; subtle gridlines and muted axes; useful tooltip; no gradient.

Donut charts: restrained distinguishable colors; clean natural surface in center; hover tooltip with category/count/percentage when applicable; data and percentages must reconcile.

## 13. Notes, tasks, and empty states
Tasks and notes should feel calm and readable, similar in spirit to Notion, Apple Notes, or Google Keep—not overdecorated project-management cards.

Empty states should explain what the user can do next and offer a relevant action where appropriate. Avoid illustrations or large colorful panels unless genuinely useful.

## 14. Motion
Use restrained transitions, generally 120–180ms. No endless fake progress, blinking status indicators, or unnecessary animation. Simulated progress must finish and be clearly identified as simulated.

## 15. Responsive rules
Desktop-first information density without desktop-only assumptions:
- Tablet: rearrange panels and controls.
- Mobile: drawer/collapsed navigation, stacked forms, accessible actions.
- Wide tables may scroll horizontally or switch to a deliberate compact view.
- Prevent accidental page-level horizontal overflow.
