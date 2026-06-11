// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

/** CVE ID pattern matching backend validation: ^CVE-[0-9]{4}-[0-9]{4,19}$ */
export const CVE_ID_PATTERN = /^CVE-[0-9]{4}-[0-9]{4,19}$/;

/** Repository URL: HTTP/HTTPS only (git: and git@ are not accepted) */
export const REPO_URL_HTTP_HTTPS = /^https?:\/\/.+/;

/**
 * Validates CVE ID format using the official CVE regex pattern.
 * @returns Error message if invalid, null if valid or empty (empty is "Required" on submit)
 */
export function validateCveIdFormat(cveId: string): string | null {
  if (!cveId || cveId.trim() === "") {
    return null;
  }
  if (!CVE_ID_PATTERN.test(cveId.trim())) {
    return "CVE ID format is invalid. Must match the official CVE pattern CVE-YYYY-NNNN+";
  }
  return null;
}

/**
 * Validates Source Repository URL format (HTTP/HTTPS only; git: and git@ are rejected).
 * @returns Error message if invalid, null if valid or empty (empty handled as "Required" on submit)
 */
export function validateSourceRepoUrl(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (!REPO_URL_HTTP_HTTPS.test(trimmed)) {
    return "Source Repository must be a valid HTTP or HTTPS URL (e.g. https://github.com/org/repo)";
  }
  try {
    new URL(trimmed);
    return null;
  } catch {
    return "Source Repository must be a valid HTTP or HTTPS URL (e.g. https://github.com/org/repo)";
  }
}

/**
 * Windows drive-letter absolute path prefix (e.g. C:\ or C:/).
 * Rejected as invalid input for the Linux agent container—not a path-traversal
 * mitigation; such paths cannot resolve to files inside the cloned repository.
 */
const MANIFEST_PATH_WINDOWS_ABSOLUTE = /^[A-Za-z]:[/\\]/;

/**
 * Validates manifest path as a relative path within the cloned repository.
 * Rejects absolute paths, backslashes, parent-directory segments, and null bytes.
 * @returns Error message if invalid, null if valid or empty (empty is optional on submit)
 */
export function validateManifestPath(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }
  if (trimmed.startsWith("/")) {
    return "Manifest path must be a relative path within the repository";
  }
  if (MANIFEST_PATH_WINDOWS_ABSOLUTE.test(trimmed)) {
    return "Manifest path must be a relative path within the repository";
  }
  if (trimmed.includes("\\")) {
    return "Manifest path must use forward slashes only";
  }
  if (trimmed.includes("\0")) {
    return "Manifest path contains invalid characters";
  }
  for (const segment of trimmed.split("/")) {
    if (segment === "..") {
      return "Manifest path must not contain parent directory references (..)";
    }
  }
  return null;
}

/**
 * Auto-detects credential type based on content (matches backend InlineCredential.detectType()).
 */
export function detectCredentialType(secret: string): "SSH_KEY" | "PAT" | null {
  if (!secret || secret.trim() === "") {
    return null;
  }
  if (secret.startsWith("-----BEGIN") && secret.includes("-----END")) {
    return "SSH_KEY";
  }
  return "PAT";
}
