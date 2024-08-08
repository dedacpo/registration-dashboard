import { ReactNode, createContext, memo, useContext, useMemo } from "react";
import { ApiClient } from "./api-client";

const ApiContext = createContext<{ ApiClient: typeof ApiClient }>({
  ApiClient: ApiClient,
});

export const ApiClientProvider = memo(
  ({ children }: { children: ReactNode }) => {
    const value = useMemo(() => ({ ApiClient: ApiClient }), []);
    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
  }
);

export const useApiClient = () => useContext(ApiContext);
ApiClientProvider.displayName = "ApiProvider";
