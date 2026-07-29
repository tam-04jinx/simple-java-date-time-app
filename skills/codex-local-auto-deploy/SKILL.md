---
name: local-auto-deploy
description: Automatically validate and deploy code locally after Codex makes code changes. Use when the user asks for an agent or workflow that runs the app after edits, deploys locally, restarts a local development server, verifies localhost, or keeps a Java Spring Boot project available after code changes.
---

# Local Auto Deploy

## Overview

Use this skill to turn code-change tasks into a full local validation and deploy loop. After making edits, run tests when practical, start or restart the local app, verify a local health/page endpoint, and report the URL.

## Workflow

1. Inspect the project.
   - Identify the framework from files such as `pom.xml`, `package.json`, `Dockerfile`, `docker-compose.yml`, or run scripts.
   - For this Spring Boot app, prefer Maven commands and `http://localhost:8080`.
   - If a project-specific run script exists, read it before choosing commands.

2. Make the requested code change.
   - Keep changes scoped to the user request.
   - Do not deploy before the code change is complete.

3. Validate before deploy.
   - Run the relevant tests if available.
   - For this app, run `mvn test`.
   - If tests need local port binding and fail with `Operation not permitted`, rerun with escalation.

4. Start or restart the local app.
   - Use `scripts/spring_boot_local_deploy.sh` from this skill for Maven Spring Boot apps.
   - Pass the project root as the first argument.
   - Pass an optional port as the second argument; default to `8080`.
   - The script stops any previous process recorded in `.codex-local-deploy/app.pid`, starts `mvn spring-boot:run`, writes logs to `.codex-local-deploy/app.log`, and verifies the app.

5. Verify local availability.
   - Check `http://localhost:<port>/` and a health endpoint when present.
   - For Spring Boot Actuator apps, check `/actuator/health`.
   - If the sandbox blocks local network checks, rerun the checks with escalation.

6. Report the outcome.
   - Include changed files, test result, local URL, and log path.
   - If deploy failed, include the failing command and the most useful log lines.

## Commands

For this app, the normal loop is:

```bash
mvn test
skills/codex-local-auto-deploy/scripts/spring_boot_local_deploy.sh /Users/naveen/code/simple-java-date-time-app 8080
```

## Safety

- Never kill unrelated processes by guessing. Only stop the PID recorded by this skill's `.codex-local-deploy/app.pid`, unless the user explicitly asks for broader cleanup.
- Do not skip tests just because the deploy command starts successfully.
- Do not leave the user without the local URL when deployment succeeds.
- If a command requires network access or local port binding outside the sandbox, request escalation with a concise reason.
