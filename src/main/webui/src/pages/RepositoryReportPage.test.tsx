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

    expect(
      screen
        .getAllByRole("alert")
        .some((alert) => alert.textContent?.includes(warning)),
    ).toBe(true);
  });

  it("renders the API warning when a configured default ecosystem is retained", () => {
    renderPage(
      repositoryReport({
        ecosystem: "go",
        ecosystem_detection_warning: warning,
      }),
    );

    expect(
      screen
        .getAllByRole("alert")
        .some((alert) => alert.textContent?.includes(warning)),
    ).toBe(true);
  });

  it("does not render a warning when the report image does not contain one", () => {
    renderPage(repositoryReport());

    expect(screen.queryByText(warning)).toBeNull();
  });

  it("does not render a warning for a user-selected ecosystem without a warning field", () => {
    renderPage(repositoryReport({ ecosystem: "go" }));

    expect(screen.queryByText(warning)).toBeNull();
  });

  it.each([
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

  it("does not crash or warn for an RPM report with null source_info", () => {
    renderPage(
      repositoryReport({
        pipeline_mode: "rpm_package_checker",
        source_info: null,
        target_package: {
          name: "openssl",
          version: "3.2.2",
          release: "1.el9",
          arch: "x86_64",
          ecosystem: "rpm",
        },
        ecosystem_detection_warning: warning,
      }),
    );

    expect(screen.queryByText(warning)).toBeNull();
  });

  it.each([
    "https://evilgithub.com/example/repository",
    "https://github.com.attacker.example/example/repository",
  ])("does not warn for a spoofed GitHub hostname: %s", (gitRepo) => {
    renderPage(
      repositoryReport({
        source_info: [
          { type: "code", git_repo: gitRepo, ref: "main" },
        ],
        ecosystem_detection_warning: warning,
      }),
    );

    expect(screen.queryByText(warning)).toBeNull();
  });

  it("ignores GitHub URLs on non-code sources", () => {
    renderPage(
      repositoryReport({
        source_info: [
          {
            type: "doc",
            git_repo: "https://github.com/example/docs",
            ref: "main",
          },
          {
            type: "code",
            git_repo: "https://gitlab.com/example/repository",
            ref: "main",
          },
        ],
        ecosystem_detection_warning: warning,
      }),
    );

    expect(screen.queryByText(warning)).toBeNull();
  });

  it("uses the exact mixed-case GitHub hostname from the code source", () => {
    renderPage(
      repositoryReport({
        source_info: [
          {
            type: "doc",
            git_repo: "https://github.com.attacker.example/docs",
            ref: "main",
          },
          {
            type: "code",
            git_repo: "https://GitHub.com/example/repository",
            ref: "main",
          },
        ],
        ecosystem_detection_warning: warning,
      }),
    );

    expect(
      screen
        .getAllByRole("alert")
        .some((alert) => alert.textContent?.includes(warning)),
    ).toBe(true);
  });
});
