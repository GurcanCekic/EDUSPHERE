# CLAUDE.md

# EDUSPHERE Development Guide

This repository contains the EDUSPHERE platform.

Always prefer simple, maintainable implementations.

Implement one approved feature at a time.

Do not implement future roadmap items.

---

# Your Responsibilities

When implementing a feature:

* Read `context/active-feature.md` before making changes.
* Follow the approved feature specification exactly.
* Stay within the feature scope.
* Do not redesign previously implemented features unless explicitly instructed.
* Do not introduce speculative architecture.

---

# Project Principles

Always follow these principles:

* School is the tenant.
* User identity is separate from school membership.
* Backend authorization is mandatory.
* Academic history must be preserved.
* AI enhances workflows rather than replacing core functionality.
* English and Turkish are supported from the beginning.
* Prefer the smallest implementation that satisfies the current feature.

---

# Approved Architecture

* Next.js App Router
* React
* TypeScript
* PostgreSQL
* Tailwind CSS
* shadcn/ui
* Zod
* Modular Monolith

Do not introduce:

* NestJS
* Microservices
* Redis
* Message queues
* Background workers
* Elasticsearch
* Kubernetes

unless explicitly approved.

---

# Development Rules

Before implementing a feature:

1. Read this file.
2. Read `context/active-feature.md`.

Implement only what is described in the active feature.

If a requirement is unclear, stop and explain the ambiguity instead of making assumptions.

Do not implement functionality belonging to future features.

---

# Multi-Tenancy Rules

Always assume:

* School is the tenant.
* Backend authorization is required.
* Never rely on frontend filtering for security.
* Never assume a user belongs to only one school.
* Keep user identity separate from school membership.

If a feature does not require tenant functionality, do not introduce tenant abstractions.

---

# Implementation Guidelines

Prefer:

* Small pull requests
* Small features
* Incremental implementation
* Reuse of existing code
* Simple folder structures

Avoid:

* Overengineering
* Premature abstractions
* Placeholder implementations
* Unused utilities
* Dead code
* TODOs for future roadmap items unless explicitly requested

---

# Documentation Rules

The repository uses the following governance documents.

## context/active-feature.md

Contains the specification for the feature currently being implemented.

This is the source of truth.

## context/implemented-features/

Contains completed feature specifications.

After a feature is implemented:

1. Copy `context/active-feature.md` to:

   `context/implemented-features/<feature-number>-<feature-name>.md`

2. Replace `context/active-feature.md` with:

```md
# Active Feature

None
```

Never modify completed feature specifications unless explicitly instructed.

---

# Completion Checklist

Before considering a feature complete:

* Implementation matches the approved specification.
* The application builds successfully.
* No unrelated files were modified.
* No future features were implemented.
* No unnecessary dependencies were added.
* Documentation has been updated where required.

---

# Default Decision Rule

If multiple implementations are possible:

1. Choose the simplest solution.
2. Prefer maintainability over cleverness.
3. Avoid introducing new dependencies unless they provide clear value.
4. Stay within the approved feature scope.
5. If uncertain, ask instead of assuming.
