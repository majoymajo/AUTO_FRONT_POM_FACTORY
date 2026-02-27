import { renderHook } from "@testing-library/react";
import { useKudoFormLogic } from "./useKudoFormLogic";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock services
vi.mock("../../services", () => ({
  kudosService: {
    send: vi.fn(),
  },
}));

import { kudosService } from "../../services";
import { toast } from "sonner";

describe("useKudoFormLogic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useKudoFormLogic());

    expect(result.current.formData).toEqual({
      from: "",
      to: "",
      category: undefined,
      message: "",
    });
  });

  it("should call kudosService.send and toast.success on success", async () => {
    const mockSend = vi.mocked(kudosService.send);
    mockSend.mockResolvedValueOnce({ status: 201 });

    const { result } = renderHook(() => useKudoFormLogic());

    await result.current.handleSend();

    expect(kudosService.send).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("¡Kudo enviado! ");
  });

  it("should call toast.error on failure", async () => {
    const mockSend = vi.mocked(kudosService.send);
    mockSend.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useKudoFormLogic());

    try {
      await result.current.handleSend();
    } catch (e) {
      // expected
    }

    expect(toast.error).toHaveBeenCalledWith(
      "Error enviando kudo. Por favor intenta de nuevo.",
    );
  });
});
