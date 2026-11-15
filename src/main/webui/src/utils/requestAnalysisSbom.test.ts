import { describe, expect, it } from "vitest";

import {
  CYCLONEDX_VERSIONS,
  detectSbomFormat,
  SbomFormat,
  unsupportedSbomFormatMessage,
} from "./requestAnalysisSbom";

function sbomFile(content: Record<string, unknown>): File {
  return new File([JSON.stringify(content)], "sbom.json", { type: "application/json" });
}

describe("detectSbomFormat", () => {
  it.each(["1.6", "1.7"])("accepts CycloneDX %s", async (specVersion) => {
    await expect(detectSbomFormat(sbomFile({ bomFormat: "CycloneDX", specVersion }))).resolves.toBe(
      SbomFormat.CycloneDX,
    );
  });

  it.each(["1.5", "1.8"])("rejects CycloneDX %s", async (specVersion) => {
    await expect(detectSbomFormat(sbomFile({ bomFormat: "CycloneDX", specVersion }))).resolves.toBeNull();
  });

  it("still accepts SPDX 2.3", async () => {
    await expect(
      detectSbomFormat(sbomFile({ SPDXID: "SPDXRef-DOCUMENT", spdxVersion: "SPDX-2.3" })),
    ).resolves.toBe(SbomFormat.SPDX);
  });

  it("lists every supported CycloneDX version in the error message", () => {
    expect(unsupportedSbomFormatMessage()).toContain(CYCLONEDX_VERSIONS.join(" or "));
  });
});
