// @vitest-environment happy-dom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CancelablePromise } from "../generated-client";
import { request } from "../generated-client/core/request";
import { useGitHubTokenStatus } from "./useGitHubTokenStatus";

vi.mock("../generated-client/core/request", () => ({
  request: vi.fn(),
}));

const mockRequest = vi.mocked(request);
const WARNING =
  "GitHub token is invalid or expired. Analysis will continue using all-language patterns.";

describe("useGitHubTokenStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockRequest.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("polls every five seconds and clears the warning after a valid response", async () => {
    mockRequest
      .mockReturnValueOnce(
        Promise.resolve({ status: "invalid", warning: WARNING }) as unknown as CancelablePromise<unknown>,
      )
      .mockReturnValue(
        Promise.resolve({ status: "valid", warning: null }) as unknown as CancelablePromise<unknown>,
      );

    const { result } = renderHook(() => useGitHubTokenStatus(true));

    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.warning).toBe(WARNING);
    expect(mockRequest).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(mockRequest).toHaveBeenCalledTimes(2);
    expect(result.current.warning).toBeNull();
  });

  it("keeps the warning when a status poll is temporarily unavailable", async () => {
    mockRequest
      .mockReturnValueOnce(
        Promise.resolve({ status: "invalid", warning: WARNING }) as unknown as CancelablePromise<unknown>,
      )
      .mockReturnValue(
        Promise.resolve({ status: "unknown", warning: null }) as unknown as CancelablePromise<unknown>,
      );

    const { result } = renderHook(() => useGitHubTokenStatus(true));

    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(result.current.warning).toBe(WARNING);
  });
});
