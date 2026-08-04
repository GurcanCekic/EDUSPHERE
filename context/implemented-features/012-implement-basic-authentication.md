# 012 — Implement Basic Authentication

## Goal

Allow EDUSPHERE users to sign in and sign out using their existing credentials.

## Scope

* Create a login page.
* Support email and school-username login.
* Verify passwords securely on the server.
* Create an authenticated session after successful login.
* Add logout functionality.
* Protect one minimal authenticated page.
* Provide the current authenticated user to server-side application code.

## Out of Scope

* Registration
* Password reset
* Email verification
* Multi-factor authentication
* OAuth or social login
* Remember-me functionality
* School selection for users with multiple memberships
* Role-based authorization
* Permission checks
* Account lockout
* User or school management pages

## Requirements

### Login Methods

* Platform users may authenticate with email and password.
* School users may authenticate with:

  * School slug
  * School-specific username
  * Password
* Username lookup must always include the school context.
* Frontend input must not determine tenant authorization by itself.

### Authentication

* Credential verification must run only on the server.
* Password hashes must never be exposed or logged.
* Invalid credentials must return a generic error without revealing whether the account exists.
* Inactive school memberships must not allow school-username login.
* Authentication validation must use Zod.

### Sessions

* Successful login must create a secure server-managed session.
* Session cookies must be HTTP-only.
* Production session cookies must be secure.
* Logout must invalidate the active session.
* Protected server-side code must be able to retrieve the authenticated user identifier.

### Protected Page

* Add one minimal authenticated page.
* Unauthenticated users attempting to access it must be redirected to login.
* The page must not yet apply school-role or permission checks.

## Acceptance Criteria

* A user with valid email credentials can sign in.
* A user with valid school slug, username, and password can sign in.
* The same username in different schools resolves using the supplied school slug.
* Invalid credentials display a generic authentication error.
* An inactive school membership cannot authenticate through its school username.
* Successful login creates a secure session.
* An authenticated user can access the protected page.
* An unauthenticated user is redirected to the login page.
* Logout invalidates the session and prevents further access to the protected page.
* No registration, password recovery, or authorization functionality is implemented.
* Project validation completes successfully.