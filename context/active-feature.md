# 008 — Configure Environment Variables

## Goal

Establish a minimal and consistent way to manage application environment variables.

## Scope

* Add an example environment file.
* Define one non-sensitive application environment variable.
* Read the variable through a shared configuration module.
* Validate the variable with Zod when the application starts.

## Out of Scope

* Database connection variables
* Authentication secrets
* Third-party API keys
* Production deployment configuration
* Secret management services
* Tenant-specific configuration
* Client-exposed environment variables

## Requirements

* Add a `.env.example` file containing the required variable name without sensitive values.
* Keep the local `.env` file excluded from version control.
* Create a shared server-side environment configuration module.
* Validate required environment variables with Zod.
* Fail clearly when a required variable is missing or invalid.
* Do not access `process.env` directly outside the configuration module for this feature.

## Acceptance Criteria

* The application starts when the required environment variable is valid.
* The application reports a clear validation error when the variable is missing.
* `.env.example` documents the required variable.
* Local environment values are not committed to version control.
* The development server runs successfully with valid configuration.
* The production build completes successfully.