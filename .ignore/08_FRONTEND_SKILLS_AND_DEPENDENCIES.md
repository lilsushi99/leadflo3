# LeadFlow CRM — Frontend Skills, Libraries & Dependency Policy

## 1. General rule
Inspect the current package manifest and installed dependencies before installing anything. Reuse what exists. Avoid duplicate libraries, unnecessary packages, or version upgrades unrelated to the task.

Do not run package installation commands blindly. Check the package manager and lockfile first.

## 2. Styling
Continue using the existing styling approach (CSS modules, Tailwind, global CSS, or another established approach). Do not migrate the entire project to a different styling system for one module.

If Tailwind is already installed, reuse it and centralize tokens in the existing theme/configuration. If not, do not introduce Tailwind automatically without a clear reason.

## 3. Font
Use Outfit only. Prefer the existing font import. If absent, import Outfit through Google Fonts using the framework's recommended font-loading method. Avoid loading multiple font families and avoid blocking rendering unnecessarily.

## 4. Icons
Preferred library: **Lucide React**, if the project is React-based and Lucide is already installed or can be added without conflict.

Before adding:
1. Inspect current icon imports.
2. Identify whether an icon package already exists.
3. Reuse the current consistent icon system if suitable.
4. Do not mix icon families casually.

Use conventional, semantically appropriate icons. No database/server/CPU icons as decoration, no emoji icons, and no futuristic iconography.

## 5. shadcn/ui
Use **shadcn/ui** only if compatible with the current React/Next.js setup and useful for accessible primitives. It is a foundation, not a design mandate.

Potential use cases:
- Select/dropdown.
- Dialog.
- Popover.
- Tabs.
- Tooltip.
- Calendar/date picker.
- Form primitives.

Before adding shadcn/ui:
- Inspect whether it is already configured.
- Inspect the project's Tailwind and component conventions.
- Do not replace the whole design with default shadcn styles.
- Customize components to match `03_DESIGN_SYSTEM.md`.
- Do not add duplicate Radix or other primitives if already present.

## 6. Charts
Use the chart library already installed. If none exists, prefer a compatible and maintainable option such as Recharts for React applications, after checking framework compatibility and bundle impact. Charts must be data-driven and interactive where required. Do not substitute static images for working charts.

## 7. Tables and forms
Prefer existing table/form primitives. If the project already uses TanStack Table, React Hook Form, Zod, or equivalent, reuse them. Do not install all of these by default. Add a dependency only when it solves a real need.

## 8. File parsing and export
For CSV import/export, first inspect existing utilities. If a library is necessary, choose a lightweight, compatible solution. Validate files and handle malformed input. Never upload data to a third party without explicit product requirements and user consent.

## 9. Motion
Use CSS transitions or existing motion utilities for simple interactions. Do not add an animation library for tiny hover transitions. Avoid motion that violates the restrained design rules.

## 10. Package-manager safety
- Identify npm, pnpm, yarn, or bun from the repository.
- Use the existing lockfile.
- Do not mix package managers.
- Do not run broad upgrades.
- Do not add dependencies that duplicate existing capabilities.
- After installation, run available lint/typecheck/build commands.
- Report any dependency or build failure honestly.

## 11. Agent workflow
When using an AI coding agent:
1. Read this specification folder.
2. Inspect the repository and existing behavior.
3. Identify the smallest relevant set of files.
4. Implement the requested module.
5. Reuse shared components and data services.
6. Test and inspect the result.
7. Summarize changes and limitations.
