# request-analysis-modal-single-repository Specification

## Purpose
**Single Repository** mode: Source Repository (`http`|`https` only — no `git:` / `git@`), Commit ID, **Private repository** (parent spec), collapsible **Advanced** (optional manifest path and programming language). Submit via `POST /api/v1/reports/new` with `analysisType:"source"`. Text-field **Enter** follows **[Keyboard Enter on modal text fields](../request-analysis-modal/spec.md)**.

## Requirements

### Requirement: Single-repository submit and validation
Submit SHALL require non-empty CVE, `sourceRepo`, and `commitId`. Repo URL validated HTTP/HTTPS on **blur or submit**. When non-empty, **Manifest path** SHALL be validated per **Manifest path security validation** on **blur or submit**. Success **HTTP 202**: build `ReportRequest` (CVE in `vulnerabilities`, trimmed repo/commit, metadata, optional `credential`, optional trimmed `manifestPath`/`ecosystem` when supplied and valid), POST with `submit: true`, navigate `/reports/component/:cveId/:reportId`. HTTP **400** maps `cveId`, `sourceRepo`, `commitId`, `manifestPath`, `ecosystem`, credential to field errors; modal stays open.

#### Scenario: Happy path submits and navigates
- **WHEN** valid CVE, HTTP(S) repo, Commit ID, and optional credential/Advanced fields empty or filled with valid values
- **AND** user submits successfully
- **THEN** POST `/reports/new` omitting blank Advanced values; on 202 navigate and close modal.

#### Scenario: Submit with empty repo or commit blocked
- **WHEN** CVE, sourceRepo, or commitId is missing
- **AND** user submits
- **THEN** *Required* on each empty field; API not invoked.

#### Scenario: Bad repo URL blocked on blur or submit
- **WHEN** Source Repo is filled but not valid HTTP/HTTPS (including disallowed `git:`/ssh-style patterns)
- **AND** blur or submit runs validation
- **THEN** descriptive URL error shown; submit blocked.

### Requirement: Advanced optional fields
Single Repository SHALL show Source Repository and Commit ID, then **Private repository** controls, then **Advanced** (`ExpandableSection`, collapsed by default). Expanded **Advanced** SHALL show optional **Manifest path** (`TextInput`, path within the cloned repo) and **Programming language** (`FormSelect`: unset placeholder plus `go`, `python`, `javascript`, `java`, `c`). Neither Advanced field SHALL block submit when empty. Server errors for `ecosystem` SHALL show under the dropdown.

#### Scenario: Advanced collapsed by default
- **WHEN** user selects **Single Repository**
- **THEN** repo and commit fields are visible, Private repository appears before Advanced, and Advanced is collapsed until expanded.

#### Scenario: Optional values on submit
- **WHEN** user submits with non-empty Manifest path and/or selected language
- **THEN** POST body includes `manifestPath` and/or `ecosystem`; when blank, values are omitted so agent autodetection applies.

#### Scenario: Mode switch clears Advanced
- **WHEN** user switches away from Single Repository
- **THEN** Advanced values, errors, and expanded state are cleared.

### Requirement: Manifest path security validation
When the trimmed **Manifest path** is non-empty, the client SHALL validate it as a **relative path within the cloned repository** before submit. Validation SHALL run on **submit** and on **blur** (and **Enter** SHALL follow blur per parent modal **Keyboard Enter** requirement). Empty or whitespace-only values SHALL remain valid (field is optional; omitted from POST body). The client SHALL **reject** unsafe input with a descriptive field error and SHALL NOT call the API. Unsafe input includes:

- Absolute paths (leading `/` or Windows drive-letter prefix such as `C:\` / `C:/`)
- Backslash separators (`\`)
- Any path segment equal to `..` (parent-directory traversal)
- Null bytes

Valid examples include `go.mod`, `services/api/go.mod`, and `./pkg/go.mod`. The client SHALL NOT silently rewrite or strip path segments; invalid input is rejected.

#### Scenario: Valid relative manifest path submits
- **WHEN** user enters a non-empty relative path without traversal segments (e.g. `services/api/go.mod`)
- **AND** user submits with other required fields valid
- **THEN** no manifest path field error is shown
- **AND** POST body includes the trimmed `manifestPath`.

#### Scenario: Parent-directory traversal blocked
- **WHEN** user enters a manifest path containing a `..` segment (e.g. `../etc/passwd` or `foo/../bar`)
- **AND** blur or submit runs validation
- **THEN** a descriptive error appears under **Manifest path**
- **AND** submit is blocked; API is not invoked.

#### Scenario: Absolute path blocked
- **WHEN** user enters an absolute manifest path (e.g. `/etc/passwd` or `C:\Windows\go.mod`)
- **AND** blur or submit runs validation
- **THEN** a descriptive error appears under **Manifest path**
- **AND** submit is blocked; API is not invoked.

#### Scenario: Empty manifest path remains optional
- **WHEN** user leaves **Manifest path** empty or whitespace-only
- **AND** user submits with other required fields valid
- **THEN** no manifest path field error is shown
- **AND** `manifestPath` is omitted from the POST body.
