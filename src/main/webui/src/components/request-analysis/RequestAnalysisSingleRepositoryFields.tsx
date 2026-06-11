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
import type { AnalysisRequestFormRepositoryTextHandlers } from "../../hooks/useAnalysisRequestForm";

export interface RequestAnalysisSingleRepositoryFieldsProps {
  sourceRepo: string;
  sourceRepoError: string | null;
  commitId: string;
  commitIdError: string | null;
  isSubmitting: boolean;
  handlers: AnalysisRequestFormRepositoryTextHandlers;
}

const RequestAnalysisSingleRepositoryFields: React.FC<
  RequestAnalysisSingleRepositoryFieldsProps
> = ({
  sourceRepo,
  sourceRepoError,
  commitId,
  commitIdError,
  isSubmitting,
  handlers,
}) => (
  <>
    <FormGroup label="Source Repository" isRequired fieldId="source-repo">
      <TextInput
        isRequired
        type="text"
        id="source-repo"
        name="source-repo"
        value={sourceRepo}
        onChange={(e, v) => handlers.onTextChange("sourceRepo", e, v)}
        onBlur={() => handlers.onTextBlur("sourceRepo")}
        onKeyDown={(e) => handlers.onTextKeyDown("sourceRepo", e)}
        placeholder="e.g. https://github.com/org/repo"
        isDisabled={isSubmitting}
        validated={sourceRepoError ? "error" : "default"}
      />
      <FormHelperText>
        <HelperText>
          {sourceRepoError && (
            <HelperTextItem variant="error">{sourceRepoError}</HelperTextItem>
          )}
        </HelperText>
      </FormHelperText>
    </FormGroup>
    <FormGroup label="Commit ID" isRequired fieldId="commit-id">
      <TextInput
        isRequired
        type="text"
        id="commit-id"
        name="commit-id"
        value={commitId}
        onChange={(e, v) => handlers.onTextChange("commitId", e, v)}
        onKeyDown={(e) => handlers.onTextKeyDown("commitId", e)}
        placeholder="e.g. v1.0.0, f76b3537930637666e7be8000008f69731ea642d"
        isDisabled={isSubmitting}
        validated={commitIdError ? "error" : "default"}
      />
      <FormHelperText>
        <HelperText>
          {commitIdError && (
            <HelperTextItem variant="error">{commitIdError}</HelperTextItem>
          )}
        </HelperText>
      </FormHelperText>
    </FormGroup>
  </>
);

export default RequestAnalysisSingleRepositoryFields;
