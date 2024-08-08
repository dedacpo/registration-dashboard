import { useApiClient } from "../api-provider";
import { useQuery } from "react-query";


export const useGetRegistrations = () => {
    const {ApiClient} = useApiClient();
    return useQuery(["registrations"], async () => ApiClient.getRegistrations())
}