# LeadFlow CRM — Project Context & Agent Instructions

## Purpose
LeadFlow CRM is a lead discovery, qualification, outreach, and conversion workspace. Its product promise is **Discover. Rate. Convert. Measure.**

This folder is the persistent source of truth for frontend product decisions, design rules, architecture conventions, and module specifications. Read the relevant files here before making changes. Do not rely on an old chat prompt when these files provide the current instruction.

## Non-negotiable working rules
1. Inspect the existing repository, package manifest, routes, components, styles, and current behavior before editing.
2. Implement changes in the existing project. Do not generate a replacement application.
3. Preserve completed and working functionality unless a requirement explicitly calls for a change.
4. Reuse existing components and dependencies where suitable. Do not create duplicate design systems or install duplicate libraries.
5. Frontend-first for now. Use centralized, realistic mock data behind service functions where no backend exists.
6. Never claim that a real email, integration, database write, billing event, enrichment request, or automation occurred unless it is actually connected.
7. Do not scatter mock data, business rules, colors, or repeated styles across components.
8. Do not delete or rewrite unrelated files. Keep changes focused.
9. Do not stop at analysis or a plan. Implement, run available checks, inspect the result, and report honestly.
10. If a dependency or architectural choice is uncertain, inspect the current project first and choose the smallest compatible change.
11. Keep existing routes and interactions working. Do not use fake buttons that have no action.
12. Do not invent product requirements that conflict with these documents. If an implementation detail is missing, choose the simplest consistent behavior and document it.

## Product identity
- Product: LeadFlow CRM
- Tagline: Discover. Rate. Convert. Measure.
- Primary brand color: `#76E05B`
- Font: Outfit only
- Theme: light mode
- Current scope: frontend UI and interactions; backend/database/email provider are not assumed to exist.

## Current module status
Completed or established in prior phases:
- Application shell and sidebar
- Overview
- Lead Intelligence: All Leads, Lead Discovery, Lists & Segments, Import & Enrichment
- Outreach: Email Campaigns, Email Deliveries, Sequences & Follow-ups, Templates

Next module to implement:
- Sales

Other visible modules planned for later:
- Insights
- Workspace
- Administration

Always inspect the actual repository to confirm which features are implemented before assuming a module is complete.

## Definition of done
A task is complete when:
- The requested UI is implemented in the existing app.
- Existing modules still work.
- Visible controls have meaningful behavior or clearly indicate that they are unavailable.
- Loading, empty, validation, and error states are handled.
- Design rules in `03_DESIGN_SYSTEM.md` are followed.
- Data is centralized and consistent.
- The app passes available build/lint/type checks, or any existing failures are reported accurately.
- The final response lists what changed, what works, what is simulated, and any remaining issues.
