# 015 — Manage School Profile

## Goal

Allow school members to view the active school's information and allow authorized administrators to update it.

## Scope

* View the active school profile.
* Edit the school name.
* Edit the school slug.
* Protect updates using existing school authorization.

## Out of Scope

* School branding
* Contact information
* Academic settings
* School deletion
* School creation
* Member management
* Subdomain provisioning

## Requirements

* Every authenticated school member may view the school profile.
* Only `OWNER` and `ADMIN` may update the school profile.
* Updates use the validated active school context.
* School names are required.
* School slugs are normalized and globally unique.
* Validation uses Zod.
* User-facing validation messages use localization.
* Unauthorized updates return a forbidden response.

## Acceptance Criteria

* School members can view the active school profile.
* Owners and administrators can update the school name and slug.
* Other roles cannot update the school.
* Duplicate slugs are rejected.
* Switching schools displays the correct school profile.
* Users cannot access or update another school by modifying requests.
* Project validation completes successfully.