// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {
  FormGroup,
  TextInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import type { AnalysisRequestFormSingleRepoAdvancedHandlers } from "../../hooks/useAnalysisRequestForm";

export interface RequestAnalysisSingleRepositoryManifestPathFieldProps {
  manifestPath: string;
  manifestPathError: string | null;
  isSubmitting: boolean;
  handlers: Pick<
    AnalysisRequestFormSingleRepoAdvancedHandlers,
    "onTextChange" | "onTextKeyDown"
  >;
}

const RequestAnalysisSingleRepositoryManifestPathField: React.FC<
  RequestAnalysisSingleRepositoryManifestPathFieldProps
> = ({ manifestPath, manifestPathError, isSubmitting, handlers }) => (
  <FormGroup label="Manifest path" fieldId="manifest-path">
    <TextInput
      type="text"
      id="manifest-path"
      name="manifest-path"
      value={manifestPath}
      onChange={(e, v) => handlers.onTextChange("manifestPath", e, v)}
      onKeyDown={(e) => handlers.onTextKeyDown("manifestPath", e)}
      placeholder="e.g. services/api/go.mod"
      isDisabled={isSubmitting}
      validated={manifestPathError ? "error" : "default"}
    />
    <FormHelperText>
      <HelperText>
        {manifestPathError && (
          <HelperTextItem variant="error">{manifestPathError}</HelperTextItem>
        )}
      </HelperText>
    </FormHelperText>
  </FormGroup>
);

export default RequestAnalysisSingleRepositoryManifestPathField;
