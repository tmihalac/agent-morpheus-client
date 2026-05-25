// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import type { NavigateFunction } from "react-router";
import { ProductEndpointService } from "../generated-client/services/ProductEndpointService";
import type { ReportData } from "../generated-client/models/ReportData";
import { SbomFormat } from "./requestAnalysisSbom";
import { detectCredentialType } from "./requestAnalysisValidation";

export interface SbomMultipartFields {
  cveId: string;
  file: File;
  secretValue?: string;
  userName?: string;
}

export function buildSbomFormData(
  cveId: string,
  file: File,
  isAuthenticationSecretChecked: boolean,
  authenticationSecret: string,
  username: string
): SbomMultipartFields {
  const formData: SbomMultipartFields = {
    cveId,
    file,
  };
  if (isAuthenticationSecretChecked && authenticationSecret.trim() !== "") {
    formData.secretValue = authenticationSecret.trim();
    const credentialType = detectCredentialType(authenticationSecret);
    if (credentialType === "PAT" && username.trim() !== "") {
      formData.userName = username.trim();
    }
  }
  return formData;
}

/**
 * Upload SPDX or CycloneDX SBOM and navigate away on success.
 */
export async function uploadSbomFile(
  cveId: string,
  sbomFormat: SbomFormat,
  formData: SbomMultipartFields,
  navigate: NavigateFunction,
  onClose: () => void
): Promise<void> {
  if (sbomFormat === SbomFormat.SPDX) {
    const response = await ProductEndpointService.postApiV1ProductsUploadSpdx({
      formData,
    });
    const productId = (response as { productId: string }).productId;
    navigate(`/reports/product/${productId}/${cveId}`);
  } else {
    const response = await ProductEndpointService.postApiV1ProductsUploadCyclonedx({
      formData,
    });
    const reportData = response as ReportData;
    navigate(`/reports/component/${cveId}/${reportData.reportRequestId.reportId}`);
  }
  onClose();
}
