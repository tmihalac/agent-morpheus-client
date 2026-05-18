// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {
  FormGroup,
  FileUpload,
  FileUploadHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { SbomFormat, SPDX_VERSION, CYCLONEDX_VERSION } from "../../utils/requestAnalysisSbom";
import type { AnalysisRequestFormFileHandlers } from "../../hooks/useAnalysisRequestForm";

export interface RequestAnalysisSbomFileFieldProps {
  fileValue: string;
  filename: string;
  fileError: string | null;
  isSubmitting: boolean;
  handlers: AnalysisRequestFormFileHandlers;
}

const RequestAnalysisSbomFileField: React.FC<RequestAnalysisSbomFileFieldProps> = ({
  fileValue,
  filename,
  fileError,
  isSubmitting,
  handlers,
}) => (
  <FormGroup label="SBOM file" isRequired fieldId="sbom-file">
    <FileUpload
      id="sbom-file"
      value={fileValue}
      filename={filename}
      filenamePlaceholder="Drag and drop a file or upload (Accepted file types: JSON)"
      onFileInputChange={handlers.onFileInputChange}
      onClearClick={handlers.onClearFile}
      browseButtonText="Upload"
      browseButtonAriaDescribedby="sbom-file-helper-text"
      isDisabled={isSubmitting}
      accept=".json"
    >
      <FileUploadHelperText id="sbom-file-helper-text">
        <HelperText>
          {fileError ? (
            <HelperTextItem variant="error">{fileError}</HelperTextItem>
          ) : (
            <HelperTextItem>
              Supported formats: {SbomFormat.SPDX} {SPDX_VERSION} (multi-component) or{" "}
              {SbomFormat.CycloneDX} {CYCLONEDX_VERSION} (single-component)
            </HelperTextItem>
          )}
        </HelperText>
      </FileUploadHelperText>
    </FileUpload>
  </FormGroup>
);

export default RequestAnalysisSbomFileField;
