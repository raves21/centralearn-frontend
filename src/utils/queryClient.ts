import { QueryClient } from "@tanstack/react-query";

export const neverRefetchSettings = {
  gcTime: Infinity,
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
