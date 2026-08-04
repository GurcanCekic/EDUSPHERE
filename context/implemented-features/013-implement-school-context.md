# 013 — Implement School Context

## Goal

Allow authenticated users to establish and maintain a valid active school context for all school-scoped operations.

## Scope

* Automatically select the school when only one active membership exists.
* Allow users with multiple active memberships to select and switch schools.
* Store the active school context in the authenticated session.
* Create a shared server-side school context guard.
* Protect school-scoped pages using the shared guard.

## Out of Scope

* Role-based authorization
* Permission definitions
* Marketplace mode
* School administration
* Membership management
* Tenant branding
* Subdomain routing

## Requirements

### School Selection

* Users with one active membership enter that school automatically.
* Users with multiple active memberships must select a school.
* Only active memberships belonging to the authenticated user may be displayed.

### School Switching

* Users with multiple memberships may switch schools.
* Every switch request must be validated on the server.
* Failed switches must not modify the current school context.

### School Context

The active session must contain:

* Authenticated user identifier
* Active school identifier
* Active membership identifier
* School role key

### School Guard

* Every school-scoped request must verify:

  * Authentication
  * Active school context
  * Active membership
* Inactive or missing memberships are rejected.
* Client-provided school identifiers are never trusted.

## Acceptance Criteria

* Users with one membership enter that school automatically.
* Users with multiple memberships can select and switch schools.
* Users without an active membership cannot access school-scoped pages.
* Server-side code receives the validated school context.
* Manipulating client data cannot change the active school.
* Project validation completes successfully.