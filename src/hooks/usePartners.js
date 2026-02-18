import { useEffect, useState } from 'react';
import { getAllPartners, getPartnerById } from '../services/partners.service';

export const usePartners = (params = {}, immediate = true) => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPartners(params);
      setPartners(data);
      return data;
    } catch (e) {
      setError(e);
      setPartners([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (immediate) fetchPartners(); }, [JSON.stringify(params), immediate]);
  return { partners, loading, error, refetch: fetchPartners };
};

export const useSinglePartner = (id, immediate = true) => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(immediate && !!id);
  const [error, setError] = useState(null);

  const fetchOne = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPartnerById(id);
      setPartner(data);
      return data;
    } catch (e) {
      setError(e);
      setPartner(null);
      return null;
    } finally { setLoading(false); }
  };

  useEffect(() => { if (immediate && id) fetchOne(); }, [id, immediate]);
  return { partner, loading, error, refetch: fetchOne };
};