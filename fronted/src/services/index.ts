// Toggle between mock and real API
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Import both services
import kudosServiceReal from './api/kudosService';
import kudosServiceMock from './api/kudosService.mock';

// Export the appropriate service based on environment
export const kudosService = USE_MOCK_API ? kudosServiceMock : kudosServiceReal;

// You can also export other services here
export { apiClient } from './api/client';
