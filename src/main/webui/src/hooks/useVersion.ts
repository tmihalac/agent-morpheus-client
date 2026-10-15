// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useApi } from './useApi';
import { JS_REQUEST_HEADER } from '../config/apiClient';
import { redirectToLogin } from '../utils/errorHandling';

export interface ComponentInfo {
  version: string;
  status: string;
}

export interface VersionInfo {
  applicationRelease: string | null;
  environment: {
    namespace: string | null;
    ocpVersion: string | null;
    deploymentMethod: string | null;
  } | null;
  components: {
    operator: ComponentInfo | null;
    engine: ComponentInfo | null;
    webapp: ComponentInfo | null;
    cache: ComponentInfo | null;
    mcpServer: ComponentInfo | null;
    mongodb: ComponentInfo | null;
  } | null;
  models: {
    llmModel: string | null;
    embedModel: string | null;
    llmMode: string | null;
  } | null;
}

export function useVersion() {
  const { data, loading, error } = useApi<VersionInfo>(
    async () => {
      const response = await fetch('/api/v1/version', {
        headers: {
          Accept: 'application/json',
          ...JS_REQUEST_HEADER,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 499) {
          redirectToLogin();
          return new Promise<VersionInfo>(() => {});
        }
        throw new Error(`Failed to fetch version info: ${response.status} ${response.statusText}`);
      }

      return response.json();
    }
  );

  return { versionInfo: data, loading, error };
}
