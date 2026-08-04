---

name: edusphere
description: Start, review, and finish an EDUSPHERE feature.
argument-hint: start | review | finish
disable-model-invocation: true
allowed-tools: * Bash(git *) * Bash(npm *) * Bash(npx *)

---

# EDUSPHERE Feature Workflow

Requested action:

`$ARGUMENTS`

Supported actions:

* `start`
* `review`
* `finish`

If the action is missing or invalid, show the three supported commands and do nothing else.

Always follow `CLAUDE.md`.

---

# Start

When the action is `start`:

1. Read:

   * `CLAUDE.md`
   * `context/active-feature.md`

2. Read the feature ID and feature title from `context/active-feature.md`.

3. Create a branch name using:

   `feature/<feature-id>-<short-feature-name>`

   Example:

   `feature/002-configure-project-structure`

4. Check the current Git status.

5. Handle uncommitted changes:

   * Changes limited to `context/active-feature.md` are expected, because the active feature is written immediately before starting. Commit them on `main` using:

     `chore: set active feature <feature-id>`

   * If any other file has uncommitted changes, stop and explain that those changes must be committed or stashed first.

6. Switch to `main`.

7. Pull the latest `main` branch:

   `git pull --ff-only origin main`

8. Create and switch to the feature branch.

9. Summarize:

   * active feature
   * created branch
   * feature scope
   * implementation plan

Do not implement the feature during `start`.

If the expected feature branch already exists, switch to it instead of returning an error.

---

# Review

When the action is `review`:

1. Read:

   * `CLAUDE.md`
   * `context/active-feature.md`

2. Confirm the current branch is a feature branch.

3. Review all changes against:

   * feature scope
   * acceptance criteria
   * security requirements
   * multi-tenancy requirements
   * localization requirements
   * testing requirements

4. Check for:

   * unrelated changes
   * unnecessary refactoring
   * missing validation
   * missing tests
   * hardcoded user-facing text
   * frontend-only authorization
   * possible tenant data leakage

5. Run the available project checks, such as:

   * lint
   * type-check
   * tests
   * build

6. Do not commit, push, merge, or delete branches.

7. End with exactly one result:

   `REVIEW PASSED`

   or

   `REVIEW FAILED`

If the review fails, list the required fixes.

---

# Finish

When the action is `finish`:

1. Read:

   * `CLAUDE.md`
   * `context/active-feature.md`

2. Confirm the current branch is a feature branch.

3. Perform the same checks as `review`.

4. Stop if the review fails.

5. Confirm the required documentation is updated.

6. Stage the feature changes.

7. Commit using:

   `feat: <feature-id> <feature title>`

8. Push the feature branch:

   `git push -u origin <feature-branch>`

9. Switch to `main`.

10. Pull the latest `main`:

    `git pull --ff-only origin main`

11. Merge the feature branch:

    `git merge --no-ff <feature-branch>`

12. Push `main`:

    `git push origin main`

13. Delete the local feature branch:

    `git branch -d <feature-branch>`

14. Delete the remote feature branch:

    `git push origin --delete <feature-branch>`

15. Report:

    * completed feature
    * commit
    * validation results
    * merged branch
    * push result
    * branch deletion result

If merge or push fails:

* stop immediately
* do not force-push
* do not delete the feature branch
* explain the failure and current Git state
