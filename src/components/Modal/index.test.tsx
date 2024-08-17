import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import {ActionModal} from "../../components/Modal";

jest.mock("react-modal", () => {
  const MockReactModal = ({ isOpen, children }: any) =>
    isOpen ? <div>{children}</div> : null;
  MockReactModal.setAppElement = jest.fn();
  return MockReactModal;
});

describe("Modal Component", () => {
  it("should render correctly when open", () => {
    const { getByText } = render(
      <ActionModal
        isOpen={true}
        onRequestClose={jest.fn()}
        title="Test Modal"
        actions={[]}
      >
        Modal Content
      </ActionModal>
    );

    expect(getByText("Test Modal")).toBeInTheDocument();
    expect(getByText("Modal Content")).toBeInTheDocument();
  });

  it("should change the close button style on hover", () => {
    const { getByRole } = render(
      <ActionModal
        isOpen={true}
        onRequestClose={jest.fn()}
        title="Test Modal"
        actions={[]}
      >
        Modal Content
      </ActionModal>
    );

    const closeButton = getByRole("button");

    fireEvent.mouseEnter(closeButton);
    expect(closeButton).toHaveStyle("background-color: hoverColor");

    fireEvent.mouseLeave(closeButton);
    expect(closeButton).toHaveStyle("background-color: normalColor");
  });
});
