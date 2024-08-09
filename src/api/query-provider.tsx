import { QueryClient, QueryClientProvider } from "react-query";
import { memo, ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { ApiClientProvider } from "./api-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
});

export const QueryProvider = memo(({ children }: { children: ReactNode }) => {
  return (
    <ApiClientProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ApiClientProvider>
  );
});

QueryProvider.displayName = "CoreApiProvider";
