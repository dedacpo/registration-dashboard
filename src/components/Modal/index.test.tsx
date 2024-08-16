import { render, fireEvent } from "@testing-library/react";
import  Modal  from ".";
import "@testing-library/jest-dom"; 

jest.mock("react-modal", () => {
  const MockReactModal = ({ isOpen, children }: any) =>
    isOpen ? <div>{children}</div> : null;
  MockReactModal.setAppElement = jest.fn();
  return MockReactModal;
});

describe("Modal Component", () => {
  it("should render correctly when open", () => {
    const { getByText } = render(
      <Modal
        isOpen={true}
        onRequestClose={jest.fn()}
        title="Test Modal"
        actions={[]}
      >
        Modal Content
      </Modal>
    );

    expect(getByText("Test Modal")).toBeInTheDocument();
    expect(getByText("Modal Content")).toBeInTheDocument();
  });

  it("should change the close button style on hover", () => {
    const { getByRole } = render(
      <Modal
        isOpen={true}
        onRequestClose={jest.fn()}
        title="Test Modal"
        actions={[]}
      >
        Modal Content
      </Modal>
    );

    const closeButton = getByRole("button");

    fireEvent.mouseEnter(closeButton);
    expect(closeButton).toHaveStyle("background-color: hoverColor");

    fireEvent.mouseLeave(closeButton);
    expect(closeButton).toHaveStyle("background-color: normalColor");
  });
});
