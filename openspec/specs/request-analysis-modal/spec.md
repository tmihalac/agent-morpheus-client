# request-analysis-modal Specification

## Purpose
Shared Request Analysis modal shell: mode toggle, CVE ID validation, optional private-repository credentials, field/generic error handling, submit UX, and **Enter** parity for TextInputs as defined in **Keyboard Enter on modal text fields** below.

Mode-specific behaviors are specified in sibling capabilities: **[SBOM](../request-analysis-modal-sbom/spec.md)**, **[Single Repository](../request-analysis-modal-single-repository/spec.md)**, **[RPM fields](../request-analysis-modal-rpm-fields/spec.md)**.

## Implementation (non-normative)
Modal UI: `src/main/webui/src/components/request-analysis/`. Logic: `useAnalysisRequestForm.ts`; helpers: `requestAnalysisValidation.ts`, `requestAnalysisRpm.ts`, `requestAnalysisSbom.ts`, `requestAnalysisSubmit.ts`.

## Requirements

### Requirement: Mode selector and shared layout
The modal SHALL expose **SBOM**, **Single Repository**, and **RPM** via PatternFly `ToggleGroup`/`ToggleGroupItem` ("SBOM", "Single Repository", "RPM"), exactly one selected, meaningful `aria-label`, SBOM selected by default. Switching modes SHALL clear generic Alert errors and **all** field-specific errors **except `cveId`**. CVE ID SHALL always appear. Private repository controls SHALL follow **Private Repository Authentication** (including visibility rules when **RPM** is selected). SBOM mode shows file upload only; Single Repository shows Source Repo, Commit ID, Private repository, then collapsible **Advanced** per **[Single Repository](../request-analysis-modal-single-repository/spec.md)**; RPM mode shows Package NVR + Architecture only per **[RPM fields](../request-analysis-modal-rpm-fields/spec.md)**.

#### Scenario: Mode switch clears non-CVE errors
- **WHEN** the user switches among SBOM, Single Repository, and RPM via the toggle  
- **THEN** generic submission error and non-CVE field errors are cleared; CVE ID value and CVE error persist; controls match the newly selected mode.

### Requirement: Private Repository Authentication
When the selected analysis mode is **RPM**, private-repository credential controls SHALL NOT be shown and SHALL NOT affect submit enablement (**`new-rpm-report`** accepts no credential fields). When the selected mode is **SBOM** or **Single Repository**, the following SHALL apply: With **Private repository** ON: modal SHALL show required secret (`type="password"`) inside secondary `Card`; label-help popover with text *Provide an SSH private key or Personal Access Token to authenticate with the private repository.*; helper *Accepts SSH private keys… auto-detected.*; PAT vs SSH inferred from secret (starts with `-----BEGIN`/`-----END` pattern ⇒ SSH purple “SSH key” label, no username; otherwise PAT ⇒ teal “PAT” label + required username). With switch ON secret empty ⇒ submit disabled. Client-side: secret required when switch ON; when PAT ⇒ username required. Switch OFF ⇒ clear secret, username, and auth errors; editing secret/username clears **that** field’s error. SPDX/CycloneDX uploads MUST attach credentials when switch ON (`/upload-spdx`, `/upload-cyclonedx`); Single Repository attaches `credential` on `ReportRequest` per sibling specs.

#### Scenario: PAT requires username on submit  
- **WHEN** Private repository ON, PAT detected, username empty  
- **AND** user submits  
- **THEN** *Username is required for Personal Access Token authentication* under username; API not called; modal stays open.

#### Scenario: RPM mode suppresses private repository UI
- **WHEN** the selected mode is **RPM**  
- **THEN** private-repository switch, secret, username controls, and their labels are not shown  
- **AND** submit eligibility does not depend on private-repository credential state  

### Requirement: CVE ID validation
CVE ID MUST match `^CVE-[0-9]{4}-[0-9]{4,19}$` when validation runs for that field (including **blur** and **submit**). Invalid format ⇒ message explaining expected pattern ("CVE-YYYY…"). Empty required ⇒ *Required* on submit (aligned with tab specs).

#### Scenario: Invalid CVE format surfaced on blur or submit
- **WHEN** CVE is non-empty, invalid versus the regex above, **and** the field **blurs** or the user submits  
- **THEN** CVE shows the format message and submission is blocked until resolved.

### Requirement: Keyboard Enter on modal text fields
For **every** modal **PatternFly TextInput** (CVE ID, Source Repository, Commit ID, **Manifest path when Single Repository Advanced is expanded**, **Package NVR when RPM mode is active**, Authentication secret, Username), pressing **`Enter`** while focused SHALL **`preventDefault`** and SHALL invoke the **identical client validation/update paths** implemented for **`blur`** on that same field—including CVE format, Source Repo URL checks, RPM NVR parsing/validation **when RPM mode is active**, credential required/PAT username checks. **Excluded:** **`FileUpload`**, **`ToggleGroup`**, **`Switch`**, **`ExpandableSection`**, **Architecture** and **Programming language** selects. Fields with no blur rule only receive **`preventDefault`** (**Commit ID**, **Manifest path**).

#### Scenario: Enter matches blur for all modal TextInputs
- **WHEN** focus is in any listed TextInput above
- **AND** the user presses Enter
- **THEN** Enter is intercepted and blur rules apply where defined; Commit ID and Manifest path intercept only.

### Requirement: Errors, loading, generic failures
Editing a control SHALL clear **that field’s** error. Non-validation API failures (e.g. 429/500/network) SHALL show an Alert; modal SHALL stay open with form preserved and submit re-enabled. While submit is in-flight, duplicate submit SHALL be prevented; private-repo disabling rules still apply; cancel SHALL remain usable unless product rules say otherwise.

#### Scenario: Preserve form after non-field API error  
- **WHEN** client validation passes and the API fails without field mapping  
- **THEN** Alert shows a message; form values remain; loading ends.

### Requirement: Submit button
Submit SHALL be enabled when not submitting, mode-specific required inputs are satisfied ([SBOM](../request-analysis-modal-sbom/spec.md) / [Single Repository](../request-analysis-modal-single-repository/spec.md) / [**RPM fields**](../request-analysis-modal-rpm-fields/spec.md)), and not blocked by Private repository empty secret when mode is **SBOM** or **Single Repository**.

#### Scenario: Submit disabled while in-flight
- **WHEN** a submission is in progress
- **THEN** Submit is disabled until the request completes.
