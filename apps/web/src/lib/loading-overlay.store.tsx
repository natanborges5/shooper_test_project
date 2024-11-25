"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
  PropsWithChildren,
  useMemo,
  useContext,
} from "react";

interface LoadingOverlayStore {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  toggleOn: () => void;
  toggleOff: () => void;
}

const loadingOverlayContext = createContext({} as LoadingOverlayStore);

export const LoadingOverlayProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setLoading] = useState(false);

  const toggle = () => setLoading(!isLoading);

  const toggleOn = () => setLoading(true);

  const toggleOff = () => setLoading(false);

  return (
    <loadingOverlayContext.Provider
      value={useMemo(
        () => ({ isLoading, toggle, toggleOn, toggleOff, setLoading }),
        [isLoading, toggle, toggleOn, toggleOff, setLoading],
      )}
    >
      {children}
    </loadingOverlayContext.Provider>
  );
};

export const useLoadingOverlayStore = () => useContext(loadingOverlayContext);
