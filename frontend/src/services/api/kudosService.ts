import { apiClient } from './client';
import type { KudoFormData } from '../../schemas/kudoFormSchema';

/**
 * Service for Kudos related operations
 */
export const kudosService = {
  /**
   * Sends a kudo to the backend
   */
  send: async (payload: KudoFormData): Promise<void> => {
    const response = await apiClient.post('/v1/kudos', payload);
    if (response.status !== 202) {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  }
};

export default kudosService;
