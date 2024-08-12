import * as S from "./styles";

export function Loader() {
  return (
    <S.Backdrop>
      <S.Loader>
        <img src="/loading-buffering.gif" />
      </S.Loader>
    </S.Backdrop>
  );
}

import { createContext, useState, ReactNode } from "react";

interface LoaderContextProps {
  showLoader: () => void;
  hideLoader: () => void;
}

export const LoaderContext = createContext<LoaderContextProps | undefined>(
  undefined
);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && <Loader></Loader>}
    </LoaderContext.Provider>
  );
};
