import { render, screen, fireEvent } from "@testing-library/react";
import TextField from ".";
import "@testing-library/jest-dom";
jest.mock("@mona-health/react-input-mask", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));
describe("TextField Component", () => {
  const defaultProps = {
    label: "Test Label",
    id: "test-input",
    value: "",
    onChange: jest.fn(),
    onBlur: jest.fn(),
  };

  it("should render the input field with a label", () => {
    render(<TextField {...defaultProps} />);

    const label = screen.getByLabelText("Test Label");
    expect(label).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should call onChange when the input value changes", () => {
    render(<TextField {...defaultProps} />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "123456" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("should display an error message when error prop is provided", () => {
    const errorMessage = "This field is required";
    render(<TextField {...defaultProps} error={errorMessage} />);

    const error = screen.getByText(errorMessage);
    expect(error).toBeInTheDocument();
  });

  it("should apply focus styles when the input is focused", () => {
    render(<TextField {...defaultProps} />);

    const input = screen.getByRole("textbox");

    fireEvent.focus(input);

    expect(input).toHaveStyle("border:  1px solid rgba(36, 28, 21, 0.3)");
  });

  it("should call onBlur when the input loses focus", () => {
    render(<TextField {...defaultProps} />);

    const input = screen.getByRole("textbox");

    fireEvent.blur(input);

    expect(defaultProps.onBlur).toHaveBeenCalled();
  });

  it("should render input value correctly", () => {
    const value = "Test value";
    render(<TextField {...defaultProps} value={value} />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveValue(value);
  });
});
