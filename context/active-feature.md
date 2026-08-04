# 016 — Add Core Development Seed Data

## Goal

Provide a repeatable core development dataset for testing the existing EDUSPHERE authentication, school context, authorization, workspace, and school profile flows.

## Scope

* Add a development-only seed command.
* Seed the predefined school roles.
* Seed multiple schools.
* Seed users with secure password hashes.
* Seed school memberships.
* Include users with different roles.
* Include one user with memberships in multiple schools.
* Include one inactive membership.
* Seed basic school profile data required by the existing feature set.

## Out of Scope

* Students
* Teachers
* Parents
* Classes
* Courses
* Academic years
* Academic calendars
* Attendance
* Grades
* Marketplace content
* AI-related data
* Large or randomly generated datasets
* Production data seeding

## Requirements

* The seed process must run only through an explicit development command.
* It must not run automatically when the application starts.
* It must be safe to execute multiple times.
* Repeated execution must not create duplicate records.
* Existing seeded records may be updated when their expected seed values change.
* Passwords must be hashed using the existing server-side password utility.
* Plain-text passwords must never be stored in the database or logged.
* Seed data must preserve all foreign key and uniqueness constraints.
* The seeded dataset must include:

  * At least two schools
  * The predefined school roles
  * At least one `OWNER`
  * At least one `ADMIN`
  * At least one non-administrative member
  * At least one user belonging to multiple schools
  * At least one user with different roles in different schools
  * At least one inactive membership
  * Credentials for both email and school-username login flows
* Sample credentials must be documented for local development without exposing production secrets.
* Production environments must reject or prevent execution of the development seed command.

## Acceptance Criteria

* The seed command completes successfully on a clean database.
* Running the command repeatedly does not create duplicate schools, users, roles, or memberships.
* Seeded users can authenticate using the supported login methods.
* A multi-school user can select and switch between seeded schools.
* Role authorization can be tested with seeded owner, administrator, and non-administrator accounts.
* The inactive membership cannot be used for school access.
* Seeded school profiles can be viewed and edited according to existing authorization rules.
* Plain-text passwords are not persisted or logged.
* Production execution is prevented.
* Project validation completes successfully.
