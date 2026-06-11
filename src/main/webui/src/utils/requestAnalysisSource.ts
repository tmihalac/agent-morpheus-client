// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

/** Agent OpenAPI `Ecosystem` enum values for single-repository analysis. */
export const SOURCE_ECOSYSTEM_CHOICES = ["go", "python", "javascript", "java", "c"] as const;

export type SourceEcosystemChoice = (typeof SOURCE_ECOSYSTEM_CHOICES)[number];

export const SOURCE_ECOSYSTEM_UNSET = "";

export function isSourceEcosystemChoice(value: string): value is SourceEcosystemChoice {
  return (SOURCE_ECOSYSTEM_CHOICES as readonly string[]).includes(value);
}
