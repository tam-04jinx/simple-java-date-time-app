# Codex Local Auto Deploy Agent

## Role

Automatically deploy the app locally after code changes when working with Codex.

## When To Run

Run this Codex agent after a code edit, bug fix, UI change, dependency update, or configuration change that should be validated in a local browser or API client.

## Workflow

1. Inspect the changed files and identify the app runtime.
2. Run the relevant tests before deployment.
3. Restart only the local app process started by this workflow.
4. Verify the app responds on localhost.
5. Report the URL, test result, and log location.

## Project Defaults

- Project type: Java Spring Boot with Maven
- Test command: `mvn test`
- Local URL: `http://localhost:8080/`
- Health URL: `http://localhost:8080/actuator/health`
- Deploy skill: `$local-auto-deploy`
- Deploy helper: `skills/codex-local-auto-deploy/scripts/spring_boot_local_deploy.sh`

## Rules

- Do not kill unrelated processes.
- Do not skip tests unless the user explicitly asks.
- If port binding or localhost checks are blocked by sandboxing, request escalation.
- Always include the local URL when deployment succeeds.
