import { useEffect, useState } from 'react';
import { kudosService } from '../../services';

export interface Kudo {
  id: string;
  message: string;
  createdAt: string;
  from?: string;
  to?: string;
}

export const useKudos = () => {
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKudos = async () => {
    try {
      setLoading(true);
      const response = await kudosService.getAllKudos();
      if (response.success) {
        setKudos(response.data);
      }
    } catch (error) {
      console.error('Error fetching kudos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKudos();


    const interval = setInterval(fetchKudos, 10000); 
    return () => clearInterval(interval);
  }, []);

  return {
    kudos,
    loading,
    refreshKudos: fetchKudos
  };
};
