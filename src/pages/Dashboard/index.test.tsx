import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '.';
import { useGetRegistrations, useSearchByKey } from '~/api/hooks';
import { Registration } from '~/api';
import "@testing-library/jest-dom"; 

// Mock dos hooks
jest.mock('~/api/hooks', () => ({
  useGetRegistrations: jest.fn(),
  useSearchByKey: jest.fn(),
  useUpdateRegistration: jest.fn(),
  useDeleteRegistration: jest.fn(),
}));

jest.mock('./components/Searchbar', () => {
  return {
    __esModule: true,
    default: () => <input type="text" />,
  };
});

// Dados e funções de mock
const mockRegistrations: Registration[] = [
  {
    id: "1",
    employeeName: "John Doe",
    email: "john.doe@example.com",
    admissionDate: "2024-01-01",
    status: "REVIEW",
    cpf: "12345678900",
  },
  {
    id: "2",
    employeeName: "Jane Doe",
    email: "john.doe@example.com",
    admissionDate: "2024-01-01",
    status: "REVIEW",
    cpf: "12345678901",
  },
];

const mockSearchByKey = jest.fn();

beforeEach(() => {
  (useGetRegistrations as jest.Mock).mockReturnValue({ data: mockRegistrations });
  (useSearchByKey as jest.Mock).mockReturnValue(mockSearchByKey);
});

it('should call searchByKey when searching by CPF', async () => {
  mockSearchByKey({ key: 'cpf', value: '12345678909' });

  render(<DashboardPage />);

  fireEvent.change(screen.getByRole('textbox'), { target: { value: '123.456.789-09' } });
  await waitFor(() =>
    expect(mockSearchByKey).toHaveBeenCalledWith({
      key: 'cpf',
      value: '12345678909',
    })
  );
});

it('should update columns with search results', async () => {
  mockSearchByKey.mockResolvedValue(mockRegistrations);

  render(<DashboardPage />);

  fireEvent.change(screen.getByRole('textbox'), { target: { value: '123.456.789-09' } });

  await waitFor(() =>
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  );
});
