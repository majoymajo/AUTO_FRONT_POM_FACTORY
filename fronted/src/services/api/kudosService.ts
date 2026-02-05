import { apiClient } from './client';
import type { KudosFormData } from '../../schemas/kudosSchema';

export interface KudosResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    message: string;
    createdAt: string;
  };
}

export const kudosService = {
  // Send kudos message
  sendKudos: async (data: KudosFormData): Promise<KudosResponse> => {
    try {
      const response = await apiClient.post<KudosResponse>('/kudos', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al enviar el mensaje'
      );
    }
  },

  // Get all kudos
  getAllKudos: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/kudos');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener los mensajes'
      );
    }
  },
};

export default kudosService;
