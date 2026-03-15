import { describe, it, expect, vi, beforeEach } from "vitest";
import { kudosService } from "../services/api/kudosService";
import { apiClient } from "../services/api/client";
import { createMockPagedResponse } from "./mocks/kudosListMocks";

vi.mock("../services/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("kudosService.list", () => {
  const mockGet = vi.mocked(apiClient.get);

  beforeEach(() => {
    mockGet.mockClear();
  });

  it("construye query params por defecto sin filtros", async () => {
    const mockResponse = createMockPagedResponse();
    mockGet.mockResolvedValueOnce({ data: mockResponse });

    await kudosService.list();

    expect(mockGet).toHaveBeenCalledWith("/v1/kudos", {
      params: {
        page: 0,
        size: 20,
        sortDirection: "DESC",
      },
    });
  });

  it("incluye category en query params cuando se proporciona", async () => {
    mockGet.mockResolvedValueOnce({ data: createMockPagedResponse() });

    await kudosService.list({ category: "Teamwork" });

    expect(mockGet).toHaveBeenCalledWith("/v1/kudos", {
      params: expect.objectContaining({ category: "Teamwork" }),
    });
  });

  it("incluye searchText en query params", async () => {
    mockGet.mockResolvedValueOnce({ data: createMockPagedResponse() });

    await kudosService.list({ searchText: "proyecto" });

    expect(mockGet).toHaveBeenCalledWith("/v1/kudos", {
      params: expect.objectContaining({ searchText: "proyecto" }),
    });
  });

  it("incluye rango de fechas en query params", async () => {
    mockGet.mockResolvedValueOnce({ data: createMockPagedResponse() });

    await kudosService.list({
      startDate: "2026-01-01",
      endDate: "2026-02-01",
    });

    expect(mockGet).toHaveBeenCalledWith("/v1/kudos", {
      params: expect.objectContaining({
        startDate: "2026-01-01",
        endDate: "2026-02-01",
      }),
    });
  });

  it("omite filtros no definidos del query string", async () => {
    mockGet.mockResolvedValueOnce({ data: createMockPagedResponse() });

    await kudosService.list({});

    // We can check the actual params object passed to Axios
    const params = mockGet.mock.calls[0][1]?.params;
    expect(params).not.toHaveProperty("category");
    expect(params).not.toHaveProperty("searchText");
    expect(params).not.toHaveProperty("startDate");
    expect(params).not.toHaveProperty("endDate");
  });

  it("respeta page, size y sortDirection personalizados", async () => {
    mockGet.mockResolvedValueOnce({ data: createMockPagedResponse() });

    await kudosService.list({ page: 3, size: 50, sortDirection: "ASC" });

    expect(mockGet).toHaveBeenCalledWith("/v1/kudos", {
      params: expect.objectContaining({
        page: 3,
        size: 50,
        sortDirection: "ASC",
      }),
    });
  });

  it("retorna la respuesta tipada del backend", async () => {
    const mockData = createMockPagedResponse({ totalElements: 42 });
    mockGet.mockResolvedValueOnce({ data: mockData });

    const result = await kudosService.list();

    expect(result.totalElements).toBe(42);
    expect(result.content).toHaveLength(20);
  });

  it("propaga errores de red", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network Error"));

    await expect(kudosService.list()).rejects.toThrow("Network Error");
  });
});
