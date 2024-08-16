import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "react-query";
import { useApiClient } from "../api-provider";
import {
  useGetRegistrations,
  useUpdateRegistration,
  useDeleteRegistration,
  useSearchByKey,
  usePostRegistration,
} from "../hooks";
import { Registration } from "../types";

jest.mock("../api-provider", () => ({
  useApiClient: jest.fn(),
}));

const mockGetRegistrations = jest.fn();
const mockUpdateRegistration = jest.fn();
const mockDeleteRegistration = jest.fn();
const mockSearchByKey = jest.fn();
const mockPostRegistration = jest.fn();

(useApiClient as jest.Mock).mockReturnValue({
  ApiClient: {
    getRegistrations: mockGetRegistrations,
    updateRegistration: mockUpdateRegistration,
    delteRegistration: mockDeleteRegistration,
    searchByKey: mockSearchByKey,
    postRegistration: mockPostRegistration,
  },
});

const mockInvalidateQueries = jest.fn();

jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

const queryClient = new QueryClient();

describe("Custom Hooks", () => {
  it("should fetch registrations using useGetRegistrations", async () => {
    const mockRegistrations = [
      {
        id: "1",
        employeeName: "John Doe",
        email: "john.doe@example.com",
        admissionDate: "2024-01-01",
        status: "REVIEW",
        cpf: "12345678900",
      },
    ];
    mockGetRegistrations.mockResolvedValue(mockRegistrations);

    const { result, waitFor } = renderHook(() => useGetRegistrations(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockRegistrations);
  });

  it("should update a registration and invalidate queries using useUpdateRegistration", async () => {
    const { result } = renderHook(() => useUpdateRegistration(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const updatedRegistration: Registration = {
      id: "1",
      employeeName: "John Doe Updated",
      email: "john.doe.updated@example.com",
      admissionDate: "2024-01-01",
      status: "REVIEW",
      cpf: "12345678909",
    };

    mockUpdateRegistration.mockResolvedValue(updatedRegistration);

    await act(async () => {
      await result.current(updatedRegistration);
    });

    expect(mockUpdateRegistration).toHaveBeenCalledWith(updatedRegistration);

    expect(mockInvalidateQueries).toHaveBeenCalledWith(["get-registrations"]);
  });
  it("should delete a registration and invalidate queries using useDeleteRegistration", async () => {
    const { result } = renderHook(() => useDeleteRegistration(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const registrationId = "1";

    await act(async () => {
      await result.current(registrationId);
    });

    expect(mockDeleteRegistration).toHaveBeenCalledWith(registrationId);

    expect(mockInvalidateQueries).toHaveBeenCalledWith(["get-registrations"]);
  });

  it("should search by key using useSearchByKey", async () => {
    const { result } = renderHook(() => useSearchByKey(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const searchParams = { key: "cpf", value: "12345678900" };

    await act(async () => {
      await result.current(searchParams);
    });

    expect(mockSearchByKey).toHaveBeenCalledWith("cpf", "12345678900");
  });

  it("should post a registration and invalidate queries using usePostRegistration", async () => {
    const { result } = renderHook(() => usePostRegistration(), {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const newRegistration: Omit<Registration, "id"> = {
      employeeName: "John Doe",
      email: "john.doe@example.com",
      admissionDate: "2024-01-01",
      status: "REVIEW",
      cpf: "12345678909",
    };

    mockPostRegistration.mockResolvedValue(newRegistration);

    await act(async () => {
      await result.current(newRegistration);
    });

    expect(mockPostRegistration).toHaveBeenCalledWith(newRegistration);

    expect(mockInvalidateQueries).toHaveBeenCalledWith(["get-registrations"]);
  });
});
