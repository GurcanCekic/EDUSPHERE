# 017 — School Membership List

## Goal

Provide authorized school administrators with a read-only, tenant-scoped list of memberships belonging to the active school.

## Scope

* Add a School Members page within the active school workspace.
* Display memberships belonging only to the active school.
* Display basic identity information linked to each membership.
* Display the school-specific role.
* Display the membership status.
* Support searching by display name or school username.
* Support filtering by active and inactive status.
* Provide localized English and Turkish UI text.

## Out of Scope

* Creating users
* Adding existing platform users to a school
* Editing membership roles
* Deactivating memberships
* Reactivating memberships
* Deleting users or memberships
* Invitations
* Bulk actions
* Password management
* Student, teacher, or parent profiles
* Academic information
* Platform-wide user administration

## Requirements

* The page must require an authenticated user and an active school context.
* Access must be restricted to the existing school roles authorized to manage school access.
* Every membership query must be scoped to the active school on the server.
* Frontend filtering must not be used as a tenant-security boundary.
* Memberships from other schools must never be returned or displayed.
* The list must represent school memberships, not global users.
* A global user may have separate memberships, roles, and statuses in different schools.
* Display only the identity information required for school access administration:

  * Display name
  * School username, when available
  * Email, when available
  * School role
  * Membership status
* Platform-level roles must not be displayed.
* Active and inactive memberships must remain visible through the appropriate status filter.
* Search results must remain scoped to the active school.
* No membership or identity data may be modified by this feature.
* All user-facing text must use the existing localization system.
* The page must include localized loading, empty, no-results, unauthorized, and error states.
* The implementation must reuse the existing authentication, school context, authorization, UI, and localization foundations.
* No academic profile concepts or future Phase 2 write workflows may be introduced.

## Acceptance Criteria

* An authorized school administrator can open the School Members page.
* The page displays only memberships belonging to the active school.
* A user belonging to multiple schools appears only through the membership associated with the active school.
* Membership display name, school username, email when available, school role, and status are shown correctly.
* Active and inactive memberships can be filtered.
* Memberships can be searched by display name or school username.
* Search and filtering never return memberships from another school.
* Unauthorized users cannot access the page or retrieve membership data directly.
* The page provides correct English and Turkish translations.
* Empty and no-results states are displayed correctly.
* No create, edit, role-change, deactivate, reactivate, or delete action is available.
* Global identity and school membership remain separate.
* Project validation completes successfully.