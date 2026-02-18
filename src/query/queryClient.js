import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Persist to localStorage (only in browser)
if (typeof window !== 'undefined' && window?.localStorage) {
  const STORAGE_KEY = 'tanstack_query_client';
  const localStoragePersister = {
    persistClient: async (client) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(client));
      } catch (e) {
        // ignore write errors (quota, privacy modes)
      }
    },
    restoreClient: async () => {
      try {
        const cached = window.localStorage.getItem(STORAGE_KEY);
        return cached ? JSON.parse(cached) : undefined;
      } catch (e) {
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    },
  };

  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: 30 * 60 * 1000, // 30 minutes
  });
}
