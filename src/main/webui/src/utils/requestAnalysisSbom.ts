// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

const SPDX_VERSION = "2.3" as const;
const CYCLONEDX_VERSION = "1.6" as const;

export { SPDX_VERSION, CYCLONEDX_VERSION };

export enum SbomFormat {
  SPDX = "SPDX",
  CycloneDX = "CycloneDX",
}

/**
 * Detects SBOM format by parsing file content.
 * @returns Format if recognized, null if valid JSON but unsupported
 * @throws Error if file is not valid JSON
 */
export async function detectSbomFormat(file: File): Promise<SbomFormat | null> {
  try {
    const text = await file.text();
    const json = JSON.parse(text) as Record<string, unknown>;
    if (json.SPDXID && json.spdxVersion === `SPDX-${SPDX_VERSION}`) {
      return SbomFormat.SPDX;
    }
    if (json.bomFormat === SbomFormat.CycloneDX && json.specVersion === CYCLONEDX_VERSION) {
      return SbomFormat.CycloneDX;
    }
    return null;
  } catch {
    throw new Error("File is not valid JSON");
  }
}

/** User-facing unsupported format message (matches prior modal copy). */
export function unsupportedSbomFormatMessage(): string {
  return `File format not supported. Please upload an ${SbomFormat.SPDX} ${SPDX_VERSION} or ${SbomFormat.CycloneDX} ${CYCLONEDX_VERSION} file.`;
}
