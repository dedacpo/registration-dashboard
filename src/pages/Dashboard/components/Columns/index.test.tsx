import { render, screen } from "@testing-library/react";
import Collumns from ".";
import { QueryProvider, Registration } from "~/api";
import "@testing-library/jest-dom"; 



describe("Collumns Component", () => {
  const registrations: Registration[] = [
    { id: '1', status: 'REVIEW', employeeName: 'Registration 1', admissionDate: '01/01/2024', email: 'a1@a.com', cpf: '12345678900' },
    { id: '2', status: 'APPROVED', employeeName: 'Registration 2', admissionDate: '02/01/2024', email: 'a2@a.com', cpf: '12345678901' },
    { id: '3', status: 'REPROVED', employeeName: 'Registration 3', admissionDate: '03/01/2024', email: 'a3@a.com', cpf: '12345678920' },
    { id: '4', status: 'REVIEW', employeeName: 'Registration 4', admissionDate: '04/01/2024', email: 'a4@a.com', cpf: '12345678930' },
  ];

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryProvider>
        {component}
      </QueryProvider>
    );
  };

  it("should render the correct column titles", () => {
    renderWithQueryClient(<Collumns registrations={[]} />);

    expect(screen.getByText("Pronto para revisar")).toBeInTheDocument();
    expect(screen.getByText("Aprovado")).toBeInTheDocument();
    expect(screen.getByText("Reprovado")).toBeInTheDocument();
  });

  it("should render RegistrationCard components in the correct columns", () => {
    renderWithQueryClient(<Collumns registrations={registrations} />);

    expect(screen.getAllByText("Registration 1")).toHaveLength(1);
    expect(screen.getAllByText("Registration 2")).toHaveLength(1);
    expect(screen.getAllByText("Registration 3")).toHaveLength(1);
    expect(screen.getAllByText("Registration 4")).toHaveLength(1);

    expect(screen.getByText("Pronto para revisar")).toBeInTheDocument();
    expect(screen.getByText("Aprovado")).toBeInTheDocument();
    expect(screen.getByText("Reprovado")).toBeInTheDocument();
  });

});
