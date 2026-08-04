# 014 — Create School Workspace

## Goal

Provide the initial authenticated workspace for school members after selecting their active school.

## Scope

* Create a shared school workspace layout.
* Add the school dashboard page.
* Add the workspace navigation.
* Display the active school name.
* Display the authenticated user's school role.
* Support school switching.
* Support logout.

## Out of Scope

* Dashboard metrics
* School management
* Student management
* Teacher management
* Academic modules
* Notifications
* School branding
* Marketplace

## Requirements

* The workspace requires authentication.
* The workspace requires a valid active school context.
* Navigation uses localized labels.
* School and role information come from validated server-side context.
* The school switcher only displays active memberships.
* Logout uses the existing authentication flow.
* Navigation visibility does not replace backend authorization.

## Acceptance Criteria

* Authenticated users can access the workspace.
* The dashboard renders inside the shared workspace.
* The active school and role are displayed.
* Eligible users can switch schools.
* Logout works correctly.
* Users without authentication or a valid school context cannot access the workspace.
* Project validation completes successfully.