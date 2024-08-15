import "@testing-library/jest-dom";
import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoaderProvider, LoaderContext, LoaderContextProps } from "./";
import * as S from "./styles";

jest.mock("./styles", () => ({
  Backdrop: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Loader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Loader Component", () => {
  it("should render the loader with the correct image", () => {
    render(
      <S.Loader>
        <img src="/loading-buffering.gif" alt="Loading" />
      </S.Loader>
    );
    expect(screen.getByAltText("Loading")).toBeInTheDocument();
  });
});

describe("LoaderProvider Component", () => {
  it("should show the loader when showLoader is called", () => {
    const TestComponent: React.FC = () => {
      const { showLoader } = useContext(LoaderContext) as LoaderContextProps;
      return <button onClick={showLoader}>Show Loader</button>;
    };

    render(
      <LoaderProvider>
        <TestComponent />
      </LoaderProvider>
    );

    fireEvent.click(screen.getByText("Show Loader"));
    expect(screen.getByAltText("Loading")).toBeInTheDocument();
  });

  it("should hide the loader when hideLoader is called", () => {
    const TestComponent: React.FC = () => {
      const { showLoader, hideLoader } = useContext(
        LoaderContext
      ) as LoaderContextProps;
      return (
        <>
          <button onClick={showLoader}>Show Loader</button>
          <button onClick={hideLoader}>Hide Loader</button>
        </>
      );
    };

    render(
      <LoaderProvider>
        <TestComponent />
      </LoaderProvider>
    );

    fireEvent.click(screen.getByText("Show Loader"));
    expect(screen.getByAltText("Loading")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hide Loader"));
    expect(screen.queryByAltText("Loading")).not.toBeInTheDocument();
  });
});
