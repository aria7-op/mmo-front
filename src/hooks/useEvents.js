/**
 * Events Hook
 * Hook for fetching events data
 */

import { useState, useEffect } from 'react';
import { getAllEvents, getEventById } from '../services/events.service';

/**
 * useEvents Hook
 * Fetches events list with filters
 * @param {object} params - Query parameters (page, limit, status, search, upcoming, past)
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { events, pagination, loading, error, refetch }
 */
export const useEvents = (params = {}, immediate = true) => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAllEvents(params);
      setEvents(result.data || []);
      setPagination(result.pagination || null);
      return result;
    } catch (err) {
      setError(err);
      setEvents([]);
      setPagination(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchEvents();
    }
  }, [JSON.stringify(params), immediate]);

  return {
    events,
    pagination,
    loading,
    error,
    refetch: fetchEvents,
  };
};

/**
 * useSingleEvent Hook
 * Fetches single event by ID
 * @param {string} id - Event ID
 * @param {boolean} immediate - Fetch immediately (default: true)
 * @returns {object} - { event, loading, error, refetch }
 */
export const useSingleEvent = (idOrSlug, immediate = true) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(immediate && !!idOrSlug);
  const [error, setError] = useState(null);

  const slugify = (val) => {
    if (!val) return '';
    return String(val).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const fetchEvent = async () => {
    if (!idOrSlug) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First try by id directly
      let result = null;
      try {
        result = await getEventById(idOrSlug);
      } catch (_) {
        // ignore and try by slug fallback below
      }

      if (!result) {
        // Fallback: load events and match by slug or id
        const list = await getAllEvents({ page: 1, limit: 500 });
        const items = Array.isArray(list?.data) ? list.data : (Array.isArray(list) ? list : []);
        const target = items.find((e) => {
          const t = e?.title || {};
          const title = t.en || t.dr || t.ps || '';
          const generated = slugify(e?.slug || title);
          return e?._id === idOrSlug || generated === idOrSlug;
        });
        if (target) {
          result = target;
        }
      }

      if (!result) {
        throw new Error('Event not found');
      }

      setEvent(result);
      return result;
    } catch (err) {
      setError(err);
      setEvent(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && idOrSlug) {
      fetchEvent();
    }
  }, [idOrSlug, immediate]);

  return {
    event,
    loading,
    error,
    refetch: fetchEvent,
  };
};




