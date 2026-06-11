// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import {
  SOURCE_ECOSYSTEM_CHOICES,
  SOURCE_ECOSYSTEM_UNSET,
} from "../../utils/requestAnalysisSource";
import type { AnalysisRequestFormSingleRepoAdvancedHandlers } from "../../hooks/useAnalysisRequestForm";

export interface RequestAnalysisSingleRepositoryProgrammingLanguageFieldProps {
  ecosystem: string;
  ecosystemError: string | null;
  isSubmitting: boolean;
  handlers: Pick<AnalysisRequestFormSingleRepoAdvancedHandlers, "onEcosystemChange">;
}

const RequestAnalysisSingleRepositoryProgrammingLanguageField: React.FC<
  RequestAnalysisSingleRepositoryProgrammingLanguageFieldProps
> = ({ ecosystem, ecosystemError, isSubmitting, handlers }) => (
  <FormGroup label="Programming language" fieldId="programming-language">
    <FormSelect
      id="programming-language"
      aria-label="Programming language"
      value={ecosystem}
      validated={ecosystemError ? "error" : "default"}
      isDisabled={isSubmitting}
      style={{ fontSize: "1rem" }}
      onChange={(event, value) => handlers.onEcosystemChange(event, value)}
    >
      <FormSelectOption value={SOURCE_ECOSYSTEM_UNSET} label="Select language" isDisabled />
      {SOURCE_ECOSYSTEM_CHOICES.map((choice) => (
        <FormSelectOption key={choice} value={choice} label={choice} />
      ))}
    </FormSelect>
    {ecosystemError && (
      <FormHelperText>
        <HelperText>
          <HelperTextItem variant="error">{ecosystemError}</HelperTextItem>
        </HelperText>
      </FormHelperText>
    )}
  </FormGroup>
);

export default RequestAnalysisSingleRepositoryProgrammingLanguageField;
