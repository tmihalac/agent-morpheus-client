// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from "react";
import { GitHubTokenEndpointService } from "../generated-client/services/GitHubTokenEndpointService";
import type { GitHubTokenStatus } from "../generated-client/models/GitHubTokenStatus";
import { useApi } from "./useApi";
import type { AnalysisRequestFormValues } from "./useAnalysisRequestForm";
import { SOURCE_ECOSYSTEM_UNSET } from "../utils/requestAnalysisSource";

export const GITHUB_TOKEN_STATUS_POLL_INTERVAL_MS = 5000;

export interface GitHubTokenStatusResult {
  warning: string | null;
  error: Error | null;
}

export function shouldPollGitHubToken(
  values: Pick<
    AnalysisRequestFormValues,
    "mode" | "sourceRepo" | "ecosystem" | "isAuthenticationSecretChecked"
  >,
): boolean {
  if (
    values.mode !== "single-repository" ||
    values.ecosystem !== SOURCE_ECOSYSTEM_UNSET ||
    values.isAuthenticationSecretChecked
  ) {
    return false;
  }
  try {
    return new URL(values.sourceRepo).hostname.toLowerCase() === "github.com";
  } catch {
    return false;
  }
}

export function useGitHubTokenStatus(enabled: boolean): GitHubTokenStatusResult {
  const [poll, setPoll] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const interval = window.setInterval(
      () => setPoll((value) => value + 1),
      GITHUB_TOKEN_STATUS_POLL_INTERVAL_MS,
    );
    return () => window.clearInterval(interval);
  }, [enabled]);

  const { data, error } = useApi<GitHubTokenStatus | null>(
    () =>
      enabled
        ? GitHubTokenEndpointService.getApiV1GithubTokenStatus()
        : Promise.resolve(null),
    { deps: [enabled, poll] },
  );

  useEffect(() => {
    if (!enabled) {
      setWarning(null);
    } else if (data?.status === "invalid") {
      setWarning(data.warning ?? null);
    } else if (data?.status === "valid") {
      setWarning(null);
    }
  }, [data, enabled]);

  return {
    warning,
    error,
  };
}
