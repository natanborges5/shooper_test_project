"use client"
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useMemo, useState } from "react";
import { RideHome } from "../ride";
import { UserComponent } from "../user";
import { RideProvider } from "../ride/ride.context";

type HomeContext = {
  componentSelected: ComponentNames
  setComponentSelected: Dispatch<SetStateAction<ComponentNames>>
};

const homeContext = createContext<HomeContext>({} as HomeContext);

type HomeProviderProps = PropsWithChildren<{
}>;

export const HomeProvider = ({
  children,
}: HomeProviderProps) => {
  const [componentSelected, setComponentSelected] = useState<ComponentNames>("ride")


  const contextValue = useMemo(
    () => ({
      componentSelected,
      setComponentSelected,
    }),
    [
      componentSelected,
      setComponentSelected,
    ],
  );

  return (
    <homeContext.Provider value={contextValue}>
      {children}
    </homeContext.Provider>
  );
};

export const useHomeContext = () => useContext(homeContext);
type ComponentNames = "ride" | "user";

interface ComponentProps {
  name: ComponentNames;
  element: JSX.Element;
}

export const homeComponents: Record<ComponentNames, ComponentProps> = {
  ride: {
    name: "ride",
    element: <RideProvider><RideHome /></RideProvider>
  },
  user: {
    name: "user",
    element: <UserComponent />,
  },
};