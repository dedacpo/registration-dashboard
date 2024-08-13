import axios from "axios";
import { Registration } from "./types/registration";

export namespace ApiClient {
  export const ApiClientAxios = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  ApiClientAxios.interceptors.response.use((response) => {
    return response.data;
  });

  export async function getRegistrations(): Promise<Registration[]> {
    return ApiClientAxios.get("/registrations/");
  }

  export async function updateRegistration(registration: Registration): Promise<Registration> {
    return ApiClientAxios.put(`/registrations/${registration.id}`, { ...registration });
  }

  export async function delteRegistration(id: string): Promise<Registration> {
    return ApiClientAxios.delete(`/registrations/${id}`);
  }

  export async function searchByKey(key: string, value: string): Promise<Registration[]> {
    return ApiClientAxios.get(`/registrations?${key}=${value}`);
  }
}
