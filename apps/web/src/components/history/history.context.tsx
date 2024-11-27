"use client";
import { ApiClients, useApiClients } from "@web/src/app/api-clients";
import { ListRidesDTO, PublicUserDTO } from "@web/src/lib/react-query";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useMemo, useState } from "react";

type HistoryContext = {
  filters: FilterProps
  setFilters: Dispatch<SetStateAction<FilterProps>>
  passengers?: PublicUserDTO[]
  userRides?: ListRidesDTO
  drivers?: PublicUserDTO[]
  setApplyFilters: Dispatch<SetStateAction<boolean>>
  getUserRidesQuery: ReturnType<
    ApiClients["reactQuery"]["queries"]["useGetUserRides"]
  >;
};
type FilterProps = {
  customer_id: string,
  driver_id: string
}

const historyContext = createContext<HistoryContext>({} as HistoryContext);

type HistoryProviderProps = PropsWithChildren<{
}>;

export const HistoryProvider = ({
  children,
}: HistoryProviderProps) => {
  const { reactQuery } = useApiClients();
  const [filters, setFilters] = useState<FilterProps>({
    customer_id: "",
    driver_id: ""
  })
  const [applyFilters, setApplyFilters] = useState(false);
  const getAllPassengersQuery = reactQuery.queries.useGetAllUsers("passenger")
  const getAllDriversQuery = reactQuery.queries.useGetAllUsers("driver")
  const getUserRidesQuery = reactQuery.queries.useGetUserRides(
    filters.customer_id,
    filters.driver_id.length > 0 ? filters.driver_id : undefined,
    { enabled: applyFilters && filters.customer_id.length > 1 },
  );
  useMemo(() => {
    setApplyFilters(false)
  }, [getUserRidesQuery.isSuccess])
  const userRides = useMemo(() => getUserRidesQuery.data, [getUserRidesQuery.data])
  const passengers = useMemo(() => getAllPassengersQuery.data, [getAllPassengersQuery.data])
  const drivers = useMemo(() => getAllDriversQuery.data, [getAllDriversQuery.data])
  const contextValue = useMemo(
    () => ({
      filters,
      setFilters,
      passengers,
      userRides,
      drivers,
      setApplyFilters,
      getUserRidesQuery
    }),
    [
      filters,
      setFilters,
      passengers,
      userRides,
      drivers,
      setApplyFilters,
      getUserRidesQuery
    ],
  );

  return (
    <historyContext.Provider value={contextValue}>
      {children}

    </historyContext.Provider>
  );
};

export const useHistoryContext = () => useContext(historyContext);
