019 — Add Existing Platform User to School
Goal

Allow authorized school administrators to add an existing EDUSPHERE user to the active school by creating a new school membership.

Scope
Find an existing user by email.
Create a membership for the active school.
Assign an initial school role.
Optionally assign a school username.
Set the membership as active.
Out of Scope
Creating new users
Editing users
Role changes
Membership activation/deactivation
Invitations
Bulk operations
Academic profiles
Requirements
Only authorized school administrators may perform this action.
The operation must be scoped to the active school.
The user must already exist.
The user must not already belong to the active school.
The selected role must be one of the predefined school roles.
School usernames must be unique within the active school.
The implementation must preserve the separation between global identity and school membership.
All validation messages must use the localization system.
Acceptance Criteria
Existing users can be added to the active school.
Duplicate memberships are prevented.
Other school memberships remain unchanged.
Unauthorized access is denied.
English and Turkish translations are available.
Project validation completes successfully.