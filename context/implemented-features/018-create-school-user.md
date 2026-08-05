# 018 — Create School User

## Goal

Allow authorized school administrators to create a new school-managed user and immediately add them as a member of the active school.

## Scope

* Add a **Create School User** action from the School Members page.
* Create a new global user account.
* Create a membership for the active school.
* Assign an initial school role.
* Support school username login.
* Support optional email login when an email is provided.
* Provide localized English and Turkish UI text.

## Out of Scope

* Adding existing platform users to a school
* Editing user information
* Changing membership roles
* Deactivating memberships
* Reactivating memberships
* Bulk user creation
* CSV import
* Email invitations
* Password reset
* Student, teacher, or parent profiles
* Academic information
* Platform-wide user administration

## Requirements

* Only authorized school administrators may create school users.
* The user must be created within the context of the active school.
* Creating the user must also create the initial school membership.
* Username is required and must be unique within the active school.
* Email is optional.
* If an email is provided, it must be globally unique.
* An initial password must be provided and stored using the existing password hashing utility.
* Plain-text passwords must never be stored or logged.
* An initial school role must be selected from the predefined school roles.
* The implementation must preserve the separation between global identity and school membership.
* The new membership must belong only to the active school.
* All validation messages must use the existing localization system.
* No academic profile or additional records may be created automatically.
* The implementation must reuse the existing authentication, authorization, school context, and localization foundations.

## Acceptance Criteria

* An authorized administrator can create a new school-managed user.
* A global user account is created successfully.
* A membership for the active school is created successfully.
* The assigned school role is stored correctly.
* The new user can authenticate using the supported login methods.
* Username uniqueness is enforced within the active school.
* Email uniqueness is enforced globally when an email is provided.
* Passwords are securely hashed.
* Plain-text passwords are never persisted or logged.
* Unauthorized users cannot create school users.
* No memberships are created in other schools.
* No academic profile data is created.
* English and Turkish translations are displayed correctly.
* Project validation completes successfully.