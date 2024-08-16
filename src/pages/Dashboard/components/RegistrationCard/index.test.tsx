import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegistrationCard, { Action } from ".";
import {
  Registration,
  useDeleteRegistration,
  useUpdateRegistration,
} from "~/api";
import { LoaderContext } from "~/components/Loader";
import { useSnackbar } from "notistack";
import "@testing-library/jest-dom";

jest.mock("~/api", () => ({
  useDeleteRegistration: jest.fn(),
  useUpdateRegistration: jest.fn(),
}));

jest.mock("notistack", () => ({
  useSnackbar: jest.fn(),
}));

jest.mock("../../../../components/Modal", () => ({
  Modal: jest.fn(({ isOpen, title, onRequestClose, actions, children }) => {
    if (!isOpen) return null;
    return (
      <div>
        <h1>{title}</h1>
        <button onClick={onRequestClose}>Close</button>
        {actions.map((action: Action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            style={{ backgroundColor: action.bgcolor }}
          >
            {action.label}
          </button>
        ))}
        <p>{children}</p>
      </div>
    );
  }),
}));

const queryClient = new QueryClient();

describe("RegistrationCard Component", () => {
  const mockDeleteRegistration = jest.fn();
  const mockUpdateRegistration = jest.fn();
  const mockShowLoader = jest.fn();
  const mockHideLoader = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSnackbar as jest.Mock).mockReturnValue({
      enqueueSnackbar: jest.fn(),
    });
    (useDeleteRegistration as jest.Mock).mockReturnValue(
      mockDeleteRegistration
    );
    (useUpdateRegistration as jest.Mock).mockReturnValue(
      mockUpdateRegistration
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (registration: Registration) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LoaderContext.Provider
          value={{ showLoader: mockShowLoader, hideLoader: mockHideLoader }}
        >
          <RegistrationCard data={registration} />
        </LoaderContext.Provider>
      </QueryClientProvider>
    );
  };

  it("should render the registration details", () => {
    const registration: Registration = {
      id: "1",
      employeeName: "John Doe",
      email: "john.doe@example.com",
      admissionDate: "2024-01-01",
      status: "REVIEW",
      cpf: "12345678900",
    };

    renderComponent(registration);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });

  it("should open the modal and call updateRegistration on confirm", async () => {
    const mockRegistration: Registration = {
      id: "1",
      employeeName: "John Doe",
      email: "john.doe@example.com",
      admissionDate: "2023-01-01",
      status: "REVIEW",
      cpf: "12345678900",
    };
    const mockLoaderContext = {
      showLoader: mockShowLoader,
      hideLoader: mockHideLoader,
    };
    const { getByText } = render(
      <LoaderContext.Provider value={mockLoaderContext}>
        <RegistrationCard data={mockRegistration} />
      </LoaderContext.Provider>
    );

    fireEvent.click(getByText("Aprovar"));

    fireEvent.click(getByText("Confirmar"));

    await waitFor(() => {
      expect(mockUpdateRegistration).toHaveBeenCalledWith({
        ...mockRegistration,
        status: "APPROVED",
      });
    });
  });

  it("should close the modal on cancel", async () => {
    const registration: Registration = {
      id: "1",
      employeeName: "John Doe",
      email: "john.doe@example.com",
      admissionDate: "2024-01-01",
      status: "REVIEW",
      cpf: "12345678900",
    };

    renderComponent(registration);

    fireEvent.click(screen.getByText("Aprovar"));

    await waitFor(() =>
      expect(
        screen.getByText("Alterar status para Aprovado")
      ).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Cancelar"));

    await waitFor(() => {
      expect(
        screen.queryByText("Alterar status para Aprovado")
      ).not.toBeInTheDocument();
    });
  });
});
