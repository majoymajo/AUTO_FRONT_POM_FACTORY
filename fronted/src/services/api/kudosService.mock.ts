import type { KudosFormData } from '../../schemas/kudosSchema';
import type { KudosResponse } from './kudosService';


const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));


const mockKudosDatabase: Array<{
  id: string;
  message: string;
  createdAt: string;
  from?: string;
  to?: string;
}> = [
  {
    id: '1',
    message: '¡Excelente trabajo en el último proyecto!',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    from: 'Juan Pérez',
    to: 'María García',
  },
  {
    id: '2',
    message: 'Gracias por tu ayuda con el código.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    from: 'Ana López',
    to: 'Carlos Rodríguez',
  },
  {
    id: '3',
    message: 'Tu creatividad es increíble, sigue así!',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    from: 'Pedro Martínez',
    to: 'Laura Sánchez',
  },
];


export const kudosServiceMock = {

  sendKudos: async (data: KudosFormData): Promise<KudosResponse> => {
    await delay(800); 


    if (!data.message || data.message.trim().length === 0) {
      throw new Error('El mensaje no puede estar vacío');
    }


    const newKudo = {
      id: String(mockKudosDatabase.length + 1),
      message: data.message,
      createdAt: new Date().toISOString(),

      from: 'Usuario Actual',
      to: 'Equipo Sofkianos',
    };


    mockKudosDatabase.unshift(newKudo);


    return {
      success: true,
      message: 'Kudo enviado exitosamente',
      data: {
        id: newKudo.id,
        message: newKudo.message,
        createdAt: newKudo.createdAt,
      },
    };
  },


  getAllKudos: async (): Promise<any> => {
    await delay(600); 


    return {
      success: true,
      data: mockKudosDatabase,
      total: mockKudosDatabase.length,
    };
  },


  getKudoById: async (id: string): Promise<any> => {
    await delay(400);

    const kudo = mockKudosDatabase.find((k) => k.id === id);

    if (!kudo) {
      throw new Error('Kudo no encontrado');
    }

    return {
      success: true,
      data: kudo,
    };
  },


  deleteKudo: async (id: string): Promise<any> => {
    await delay(500);

    const index = mockKudosDatabase.findIndex((k) => k.id === id);

    if (index === -1) {
      throw new Error('Kudo no encontrado');
    }

    mockKudosDatabase.splice(index, 1);

    return {
      success: true,
      message: 'Kudo eliminado exitosamente',
    };
  },
};

export default kudosServiceMock;
