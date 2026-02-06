import { axiosConfig } from './axiosConfig';
import type { KudoFormData } from '../schemas/kudoFormSchema';


export async function sendKudo(payload: KudoFormData): Promise<void> {
  const response = await axiosConfig.post('/v1/kudos', payload);
  if (response.status !== 202) {
    throw new Error(`Unexpected status: ${response.status}`);
  }
}
