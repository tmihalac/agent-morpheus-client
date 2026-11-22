// @vitest-environment happy-dom
// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FullReport, FullReportImage } from "../types/FullReport";
import RepositoryReportPage from "./RepositoryReportPage";

vi.mock("../hooks/useRepositoryReport", () => ({
  useRepositoryReport: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useParams: () => ({ cveId: "CVE-2026-1234", reportId: "scan-1234" }),
  };
});

import { useRepositoryReport } from "../hooks/useRepositoryReport";

const mockUseRepositoryReport = vi.mocked(useRepositoryReport);

const warning =
  "GitHub ecosystem detection failed; all-language patterns were used.";

function repositoryReport(
  image: Record<string, unknown> = {},
): FullReport {
  return {
    input: {
      scan: { id: "scan-1234" },
      image: {
        analysis_type: "image",
        ecosystem: "",
        name: "example",
        tag: "latest",
        source_info: [
          {
            type: "code",
            git_repo: "https://github.com/example/repository",
            ref: "main",
          },
        ],
        ...image,
      } as FullReportImage,
    },
    output: { analysis: [{ vuln_id: "CVE-2026-1234" }] },
  };
}

function renderPage(report: FullReport) {
  mockUseRepositoryReport.mockReturnValue({
    data: report,
    status: "pending",
    loading: false,
    error: null,
  });

  return render(
    <MemoryRouter>
      <RepositoryReportPage />
    </MemoryRouter>,
  );
}

describe("RepositoryReportPage ecosystem detection warning", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockUseRepositoryReport.mockReset();
  });

  it("renders the API warning when the report image contains it", () => {
    renderPage(repositoryReport({ ecosystem_detection_warning: warning }));

    expect(screen.getByText(warning)).not.toBeNull();
  });

  it("does not render a warning when the report image does not contain one", () => {
    renderPage(repositoryReport());

    expect(screen.queryByText(warning)).toBeNull();
  });

  it.each([
    ["a user-selected ecosystem", { ecosystem: "go" }],
    [
      "a non-GitHub repository",
      {
        source_info: [
          {
            type: "code",
            git_repo: "https://gitlab.com/example/repository",
            ref: "main",
          },
        ],
      },
    ],
    ["an RPM report", { pipeline_mode: "rpm_package_checker" }],
  ])("does not render a warning for %s", (_reportType, image) => {
    renderPage(repositoryReport({ ecosystem_detection_warning: warning, ...image }));

    expect(screen.queryByText(warning)).toBeNull();
  });
});
