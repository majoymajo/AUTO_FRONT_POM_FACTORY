import { apiClient } from "./client";
import type { KudoFormData } from "../../schemas/kudoFormSchema";
import type { KudoListParams, PagedKudoResponse } from "../../types/models/kudoPublic";

export const kudosService = {
  send: async (payload: KudoFormData): Promise<void> => {
    const response = await apiClient.post("/v1/kudos", payload);
    if (response.status !== 202) {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  },
  list: async (params: KudoListParams = {}): Promise<PagedKudoResponse> => {
    const { page = 0, size = 20, sortDirection = 'DESC', ...rest } = params;
    const response = await apiClient.get("/v1/kudos", {
      params: { page, size, sortDirection, ...rest },
    });
    return response.data as PagedKudoResponse;
  },
};

export default kudosService;
