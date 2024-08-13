import { useApiClient } from "../api-provider";
import { useMutation, useQueryClient } from "react-query";
import { Registration } from "../types";

export const useGetRegistrations = () => {
  const { ApiClient } = useApiClient();

  const { mutateAsync } = useMutation(
    ["get-registration"],
    () => ApiClient.getRegistrations(),

  );
  return mutateAsync;
};

export const useUpdateRegistration = () => {
  const { ApiClient } = useApiClient();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(
    ["update-registration"],
    (registration: Registration) => ApiClient.updateRegistration(registration),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get-registrations"]);
      },
    }
  );
  return mutateAsync;
};

export const useDeleteRegistration = () => {
    const { ApiClient } = useApiClient();
    const queryClient = useQueryClient();
  
    const { mutateAsync } = useMutation(
      ["delete-registration"],
      (id: string) => ApiClient.delteRegistration(id),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["get-registrations"]);
        },
      }
    );
    return mutateAsync;
  };

  export const useSearchByKey = () => {
    const { ApiClient } = useApiClient();

    const { mutateAsync } = useMutation(
      ["search-registration"],
      ({ key, value }: { key: string, value: string }) => ApiClient.searchByKey(key, value),

    );
    return mutateAsync;
  };
