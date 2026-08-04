# 011 — Create Database and Identity Foundation

## Goal

Establish the PostgreSQL database foundation and create the core data model for schools, global users, school memberships, roles, usernames, and password credentials.

## Scope

* Configure the PostgreSQL connection.
* Configure version-controlled database migrations.
* Create the `schools` table.
* Create the `users` table.
* Create the `school_roles` table.
* Create the `school_memberships` table.
* Add school-specific usernames.
* Add membership status.
* Add optional password credentials.
* Add server-side password hashing and verification utilities.
* Create the initial system-defined school roles.

## Out of Scope

* Login and logout
* Sessions
* Authentication pages
* Authorization and permissions
* Membership invitations
* Password reset
* Email verification
* Multi-factor authentication
* OAuth
* School management UI
* User management UI
* Custom school roles
* Marketplace access

## Requirements

### Database Foundation

* PostgreSQL configuration must use validated environment variables.
* Database access must remain server-side.
* Credentials must not be committed to version control.
* Schema changes must use version-controlled migrations.
* Migration commands must support applying, rolling back, and checking migrations.

### Schools

* Each school must have a unique identifier.
* Each school must have a required name.
* Each school must have a required unique normalized slug.
* Each school must include creation and update timestamps.

### Users

* User identity must remain separate from school membership.
* Each user must have a unique identifier.
* Email must be optional.
* Non-empty emails must be normalized and unique.
* Multiple users without email addresses must be allowed.
* No school or tenant identifier may be stored directly on the user record.
* Password hash must be optional.
* Plain-text passwords must never be stored or logged.

### School Roles

The initial stable role keys must be:

* `OWNER`
* `ADMIN`
* `TEACHER`
* `STUDENT`
* `PARENT`

Role keys must be language-independent and must not depend on translated display labels.

### School Memberships

* A user may belong to multiple schools.
* A membership must reference one user and one school.
* The same user must not have duplicate memberships in the same school.
* Each membership must reference exactly one school role.
* A user may have different roles in different schools.
* Membership status must support:

  * `ACTIVE`
  * `INACTIVE`
* New memberships must default to `ACTIVE`.
* Inactive memberships must remain stored.

### School-Specific Usernames

* Username must be stored on the school membership, not the user.
* Username must be optional.
* Username must be normalized before storage.
* Username must be unique within a school.
* The same username may be used in different schools.
* Empty usernames must be stored as null.

### Password Credentials

* Password hashing and verification must run only on the server.
* A maintained password-hashing library must be used.
* Password validation must use Zod.
* Password hashes must never be exposed to client-side code.
* Existing users without passwords must remain valid.

## Acceptance Criteria

* The application connects successfully to PostgreSQL.
* All migrations apply successfully to a clean database.
* All migrations can be rolled back successfully.
* Schools, users, roles, and memberships can be created with valid data.
* Duplicate school slugs are rejected.
* Duplicate normalized non-empty emails are rejected.
* Multiple users without email addresses can exist.
* A user can belong to multiple schools.
* A user can have different roles in different schools.
* Duplicate user-school memberships are rejected.
* Memberships default to `ACTIVE`.
* Duplicate normalized usernames within the same school are rejected.
* The same username can exist in different schools.
* Passwords can be securely hashed and verified.
* Incorrect passwords fail verification.
* Plain-text passwords are not persisted or logged.
* Project validation completes successfully.
