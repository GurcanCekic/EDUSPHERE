---

name: edusphere
description: Manage the EDUSPHERE active-feature Git lifecycle.
argument-hint: start | review | finish | status | abort
disable-model-invocation: true
allowed-tools: * Bash(git *) * Bash(npm *) * Bash(npx *)

---

# EDUSPHERE Feature Lifecycle

Execute the requested EDUSPHERE lifecycle action.

Requested action:

`$ARGUMENTS`

Only accept one of:

* `start`
* `review`
* `finish`
* `status`
* `abort`

Do not infer a different action. If the action is missing or unsupported, show the supported commands and make no changes.

Always follow `CLAUDE.md`.

---

## Shared rules

* Work on one active feature only.
* Read `context/project-status.md`.
* Read `context/active-feature.md`.
* Do not expand feature scope.
* Do not perform unrelated refactoring.
* Never use destructive Git commands to discard work.
* Never force-push.
* Never push directly if validation has failed.
* Never merge when unresolved review findings remain.
* Preserve all uncommitted user work.
* Stop and report clearly when a safe precondition is not satisfied.

The authoritative integration branch is `main`.

Feature branches must use:

`feature/<feature-id>-<short-slug>`

Derive the feature ID and title from `context/active-feature.md`.

Example:

`feature/002-configure-code-quality-tools`

Use lowercase kebab-case for the slug.

---

## Action: start

Prepare the repository for implementation of the current active feature.

1. Read:

   * `CLAUDE.md`
   * `context/project-status.md`
   * `context/active-feature.md`
2. Determine the active feature ID and title.
3. Run `git status --short`.
4. Refuse to continue if there are uncommitted changes.
5. Confirm the current branch.
6. Switch to `main`.
7. Pull the latest remote changes using fast-forward only:

   * `git pull --ff-only origin main`
8. Verify that a branch for this active feature does not already exist locally or remotely.
9. Create the correctly named feature branch from updated `main`.
10. Report:

    * active feature
    * new branch name
    * implementation scope
    * concise implementation plan

Do not implement code during `start` unless the user explicitly asks to continue after branch preparation.

---

## Action: review

Review the current active feature without merging or pushing.

1. Read:

   * `CLAUDE.md`
   * `context/project-status.md`
   * `context/active-feature.md`
2. Confirm the current branch matches the active feature.
3. Inspect:

   * `git status`
   * `git diff`
   * `git diff --cached`
   * commits relative to `main`
4. Review the implementation for:

   * active-feature scope
   * acceptance criteria
   * correctness
   * security
   * server-side authorization
   * tenant isolation where applicable
   * localization of user-facing text
   * unnecessary abstractions
   * unrelated changes
   * missing or weak tests
   * documentation requirements
5. Run the relevant project validation commands defined by the repository.
6. At minimum, when scripts exist, run:

   * lint
   * type-check
   * tests
   * production build
7. Do not modify code merely to hide test failures.
8. Report findings ordered by severity.
9. Clearly state one result:

   * `REVIEW PASSED`
   * `REVIEW FAILED`

Do not commit, merge, delete branches or push during `review`.

---

## Action: finish

Close the current active feature safely.

1. Read:

   * `CLAUDE.md`
   * `context/project-status.md`
   * `context/active-feature.md`
2. Confirm the current branch matches the active feature.
3. Confirm there are feature changes to finish.
4. Perform the complete `review` process again.
5. Refuse to continue unless the review passes.
6. Confirm all acceptance criteria are satisfied.
7. Update the required governance documentation:

   * `context/active-feature.md`
   * `context/project-status.md`
   * `context/feature-history.md`, if it exists
   * architecture decision records only when an approved architectural decision changed
8. Review the final diff after documentation updates.
9. Stage only files belonging to the active feature.
10. Commit using:

    * `feat: <feature-id> <concise feature title>`
11. Push the feature branch to `origin`.
12. Switch to `main`.
13. Pull using:

    * `git pull --ff-only origin main`
14. Merge the feature branch using a non-fast-forward merge:

    * `git merge --no-ff <feature-branch>`
15. Push `main` to `origin`.
16. Delete the local feature branch.
17. Delete the remote feature branch.
18. Confirm:

    * commit hash
    * merged branch
    * pushed branch
    * validation results
    * documentation updates
    * branch deletion results

If any push or merge step fails:

* stop immediately
* do not delete either branch
* do not attempt force operations
* report the exact repository state and failure

---

## Action: status

Do not modify the repository.

Report:

* current active feature
* current branch
* expected feature branch
* clean or dirty working tree
* changed files
* commits ahead of and behind `main`
* whether the branch exists remotely
* whether documentation appears ready
* recommended next command

---

## Action: abort

Abort safely without losing work.

1. Show:

   * current branch
   * working-tree status
   * uncommitted changes
   * commits not present on `main`
2. Never run:

   * `git reset --hard`
   * `git clean`
   * forced checkout
   * forced branch deletion
3. If the feature branch contains any changes or commits, do not delete it.
4. Explain the safe manual options:

   * keep the branch
   * commit work in progress
   * stash changes
   * return to implementation
5. Delete a feature branch only when it is fully clean, contains no unique commits, and deletion is unquestionably safe.
