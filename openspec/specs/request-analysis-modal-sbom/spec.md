# request-analysis-modal-sbom Specification

## Purpose
**SBOM** mode: `FileUpload` for JSON SBOMs, SPDX 2.3 vs CycloneDX 1.6 detection, multipart upload routes, navigation on success, file/JSON/format errors and HTTP 400 behaviors. Shared modal behaviors: [`request-analysis-modal`](../request-analysis-modal/spec.md) (**TextInput**/Enter rules apply **except** **`FileUpload`**).

## Requirements

### Requirement: SBOM upload flow
SBOM mode SHALL use PatternFly `FileUpload` (`Upload` browse, drag/drop, clear shows filename when set). CVE + file required on submit (`Required` each). File SHALL be parsed JSON; unrecognized SPDX 2.3 / CycloneDX 1.6 ⇒ error under upload (unsupported format wording OK). Invalid JSON ⇒ e.g. *File is not valid JSON* — no upload call. Detection errors before upload SHALL show actionable text; changing file **or** clear removes file-field error.

SPDX ⇒ `POST /api/v1/products/upload-spdx` multipart (CVE/vuln id, file; optional PAT/SSH credential fields when private repo ON). CycloneDX 1.6 ⇒ `POST /api/v1/products/upload-cyclonedx` similarly.

Success **HTTP 202**: SPDX ⇒ navigate `/reports/product/:productId/:cveId` (`productId` from response); CycloneDX ⇒ `/reports/component/:cveId/:reportId` (`reportRequestId`/id from response). Close modal after navigation. Credentials handling when private repo ON per parent spec.

HTTP 400 with field mappings for `cveId`, file, credential fields ⇒ mapped `FormHelperText` errors; modal open; form intact; retry allowed.

HTTP 400 CycloneDX only: failed attempt MUST NOT create a standalone **ghost** SBOM row in list refresh that exists solely from that failed request (behavior agreed with backend).

#### Scenario: Invalid JSON prevents upload  
- **WHEN** user selects non-JSON JSON-looking failure or malformed file and submits  
- **THEN** upload field shows invalid JSON guidance; API not invoked.

#### Scenario: SPDX success navigates product  
- **WHEN** valid CVE + SPDX 2.3 file (private repo credential optional per switch) and API returns 202  
- **THEN** app navigates to product URL with IDs from response and closes modal.

#### Scenario: CycloneDX success navigates component report  
- **WHEN** valid CVE + CycloneDX 1.6 file and API returns 202  
- **THEN** app navigates to `/reports/component/:cveId/:reportId` from response body and closes modal.

#### Scenario: CycloneDX 400 no orphan list row  
- **WHEN** CycloneDX upload returns 400  
- **THEN** errors/alerts behave as above AND refresh SHALL NOT expose a SBOM-only row caused solely by that failure.
