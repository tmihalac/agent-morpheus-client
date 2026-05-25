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
import type { AnalysisRequestFormCveHandlers } from "../../hooks/useAnalysisRequestForm";

export interface RequestAnalysisCveIdFieldProps {
  cveId: string;
  cveIdError: string | null;
  isSubmitting: boolean;
  handlers: AnalysisRequestFormCveHandlers;
}

const RequestAnalysisCveIdField: React.FC<RequestAnalysisCveIdFieldProps> = ({
  cveId,
  cveIdError,
  isSubmitting,
  handlers,
}) => (
  <FormGroup label="CVE ID" isRequired fieldId="cve-id">
    <TextInput
      isRequired
      type="text"
      id="cve-id"
      name="cve-id"
      value={cveId}
      onChange={(e, v) => handlers.onTextChange("cveId", e, v)}
      onBlur={() => handlers.onTextBlur("cveId")}
      onKeyDown={(e) => handlers.onTextKeyDown("cveId", e)}
      isDisabled={isSubmitting}
      validated={cveIdError ? "error" : "default"}
      placeholder="e.g. CVE-2024-50602"
    />
    <FormHelperText>
      <HelperText>
        {cveIdError && <HelperTextItem variant="error">{cveIdError}</HelperTextItem>}
      </HelperText>
    </FormHelperText>
  </FormGroup>
);

export default RequestAnalysisCveIdField;
