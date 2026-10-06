// @vitest-environment happy-dom
// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { CancelablePromise } from "../generated-client";
import type { ProductSummary } from "../generated-client/models/ProductSummary";

vi.mock("../generated-client/core/request", () => ({
  request: vi.fn(),
}));

import { request } from "../generated-client/core/request";
import { useReport } from "./useReport";

const mockRequest = vi.mocked(request);

describe("useReport", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  // Reproduces the react-hooks/rules-of-hooks violation that was fixed: useApi was
  // previously called only AFTER an early `return` for a missing productId, so the
  // hook was skipped on those renders and React's hook call order could break.
  // The fix calls useApi unconditionally and rejects inside apiCall instead, so no
  // request must be issued and the "Product ID is required" error must surface.
  it("issues no request and synchronously returns loading:false with 'Product ID is required' when productId is undefined", () => {
    const { result } = renderHook(() => useReport(undefined));

    // Must be synchronous: ReportPage guards on `loading` before `productId`, so a
    // loading:true flash here would show the skeleton instead of the invalid-params alert.
    expect(result.current.loading).toBe(false);
    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.current.error?.message).toBe("Product ID is required");
    expect(result.current.data).toBeNull();
  });

  it("requests the product endpoint and returns data when productId is provided", async () => {
    const product = { summary: {} } as unknown as ProductSummary;
    mockRequest.mockReturnValue(
      Promise.resolve(product) as unknown as CancelablePromise<unknown>
    );

    const { result } = renderHook(() => useReport("prod-123"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockRequest).toHaveBeenCalledTimes(1);
    expect(mockRequest.mock.calls[0]?.[1]?.url).toBe(
      "/api/v1/reports/product/prod-123"
    );
    expect(result.current.data).toBe(product);
    expect(result.current.error).toBeNull();
  });
});
