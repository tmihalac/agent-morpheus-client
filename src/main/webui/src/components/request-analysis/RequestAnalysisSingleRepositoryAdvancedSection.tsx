// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import { ExpandableSection, FormSection } from "@patternfly/react-core";
import type { AnalysisRequestFormSingleRepoAdvancedHandlers } from "../../hooks/useAnalysisRequestForm";
import RequestAnalysisSingleRepositoryManifestPathField from "./RequestAnalysisSingleRepositoryManifestPathField";
import RequestAnalysisSingleRepositoryProgrammingLanguageField from "./RequestAnalysisSingleRepositoryProgrammingLanguageField";

export interface RequestAnalysisSingleRepositoryAdvancedSectionProps {
  isAdvancedExpanded: boolean;
  manifestPath: string;
  manifestPathError: string | null;
  ecosystem: string;
  ecosystemError: string | null;
  isSubmitting: boolean;
  handlers: AnalysisRequestFormSingleRepoAdvancedHandlers;
}

const RequestAnalysisSingleRepositoryAdvancedSection: React.FC<
  RequestAnalysisSingleRepositoryAdvancedSectionProps
> = (props) => (
  <ExpandableSection
    toggleText="Advanced"
    isExpanded={props.isAdvancedExpanded}
    onToggle={props.handlers.onAdvancedToggle}
    isWidthLimited
  >
    <FormSection>
      <RequestAnalysisSingleRepositoryManifestPathField
        manifestPath={props.manifestPath}
        manifestPathError={props.manifestPathError}
        isSubmitting={props.isSubmitting}
        handlers={props.handlers}
      />
      <RequestAnalysisSingleRepositoryProgrammingLanguageField
        ecosystem={props.ecosystem}
        ecosystemError={props.ecosystemError}
        isSubmitting={props.isSubmitting}
        handlers={props.handlers}
      />
    </FormSection>
  </ExpandableSection>
);

export default RequestAnalysisSingleRepositoryAdvancedSection;
