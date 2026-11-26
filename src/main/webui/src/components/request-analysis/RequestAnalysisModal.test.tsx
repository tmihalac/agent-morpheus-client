// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
  AnalysisRequestFormValues,
  UseAnalysisRequestFormResult,
} from "../../hooks/useAnalysisRequestForm";
import RequestAnalysisModal from "./RequestAnalysisModal";

vi.mock("../../hooks/useAnalysisRequestForm", () => ({
  useAnalysisRequestForm: vi.fn(),
}));
vi.mock("../../hooks/useGitHubTokenStatus", () => ({
  useGitHubTokenStatus: vi.fn(),
  shouldPollGitHubToken: vi.fn(() => true),
}));

import { useAnalysisRequestForm } from "../../hooks/useAnalysisRequestForm";
import { useGitHubTokenStatus } from "../../hooks/useGitHubTokenStatus";

const mockUseAnalysisRequestForm = vi.mocked(useAnalysisRequestForm);
const mockUseGitHubTokenStatus = vi.mocked(useGitHubTokenStatus);
const WARNING =
  "GitHub token is invalid or expired. Analysis will continue using all-language patterns.";

function formResult(): UseAnalysisRequestFormResult {
  const values: AnalysisRequestFormValues = {
    mode: "single-repository",
    cveId: "CVE-2026-1234",
    fileValue: "",
    filename: "",
    sourceRepo: "https://github.com/example/repository",
    commitId: "main",
    rpmPackageNvr: "",
    rpmArch: "x86_64",
    isAdvancedExpanded: false,
    manifestPath: "",
    ecosystem: "",
    isAuthenticationSecretChecked: false,
    authenticationInfo: "",
    username: "",
  };
  const errors = {
    cveId: null,
    file: null,
    sourceRepo: null,
    commitId: null,
    manifestPath: null,
    ecosystem: null,
    rpmPackageNvr: null,
    rpmArch: null,
    authenticationInfo: null,
    username: null,
    error: null,
    sbomValidationIssues: null,
  };
  const noop = vi.fn();
  return {
    values,
    errors,
    state: { isSubmitting: false, submitDisabled: false },
    handlers: {
      changeMode: noop,
      onTextChange: noop,
      onTextBlur: noop,
      onTextKeyDown: noop,
      onRpmArchChange: noop,
      onAdvancedToggle: noop,
      onEcosystemChange: noop,
      onPrivateRepoSwitch: noop,
      onFileInputChange: noop,
      onClearFile: noop,
      submit: noop,
    },
  };
}

describe("RequestAnalysisModal GitHub token warning", () => {
  beforeEach(() => {
    mockUseAnalysisRequestForm.mockReturnValue(formResult());
    mockUseGitHubTokenStatus.mockReturnValue({ warning: WARNING, error: null });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows a non-blocking warning while keeping submit enabled", () => {
    render(
      <MemoryRouter>
        <RequestAnalysisModal onClose={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText(WARNING)).toBeTruthy();
    expect(
      (screen.getByRole("button", { name: "Submit Analysis Request" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    expect(mockUseGitHubTokenStatus).toHaveBeenCalledWith(true);
  });
});
