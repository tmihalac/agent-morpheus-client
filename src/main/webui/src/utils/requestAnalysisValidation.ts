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
