# request-analysis-modal-single-repository Specification

## Purpose
**Single Repository** mode: Source Repository (`http`|`https` only — no `git:` / `git@`), Commit ID, `ReportRequest` to `POST /api/v1/reports/new` with `analysisType:"source"` and optional `credential` when private repo ON. Text-field **keyboard Enter** behaves as **[Keyboard Enter on modal text fields](../request-analysis-modal/spec.md)**.

## Requirements

### Requirement: Single-repository submit and validation  
When **Single Repository** is selected, submit SHALL require non-empty CVE, `sourceRepo`, and `commitId`. Repo URL validated HTTP/HTTPS; invalid URL ⇒ error under Source Repo field on **blur or submit**.

Success **HTTP 202**: build `ReportRequest` (cve in `vulnerabilities`, trimmed repo/commit, metadata, credential if applicable), POST with `submit: true`, navigate `/reports/component/:cveId/:reportId` using response report id.

HTTP 400 mapped to `cveId`, `sourceRepo`, `commitId`, credential ⇒ field errors (`FormHelperText` error); modal stays open.

#### Scenario: Happy path submits and navigates  
- **WHEN** valid CVE, valid HTTP(S) repo URL, Commit ID, optional credentials per switch  
- **AND** user submits successfully  
- **THEN** POST `/reports/new`; on 202 navigate component report route and close modal.

#### Scenario: Submit with empty repo or commit blocked  
- **WHEN** any of CVE/sourceRepo/commit missing  
- **AND** user submits  
- **THEN** *Required* on each empty applicable field; API not invoked.

#### Scenario: Bad repo URL blocked on blur or submit  
- **WHEN** Source Repo filled but scheme/host invalid OR `git:`/ssh-style disallowed patterns per implementation  
- **AND** blur **or submit**  
- **THEN** descriptive URL error shown; submit flow blocked when validation runs at submit.