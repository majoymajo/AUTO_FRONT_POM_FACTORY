
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || import.meta.env.VITE_USE_MOCK_API === true;



import kudosServiceReal from './api/kudosService';
import kudosServiceMock from './api/kudosService.mock';


export const kudosService = USE_MOCK_API ? kudosServiceMock : kudosServiceReal;


export { apiClient } from './api/client';
