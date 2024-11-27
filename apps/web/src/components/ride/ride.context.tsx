"use client";
import { createFormContext } from "@mantine/form";
import { ApiClients, useApiClients } from "@web/src/app/api-clients";
import { EstimateRideCreatedDTO, EstimateRideDTO, PublicUserDTO } from "@web/src/lib/react-query";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";


const [EstimateRideFormProvider, useEstimateRideFormFormContext, useEstimateRideFormForm] =
  createFormContext<EstimateRideDTO>();
type RideContext = {
  estimateRideMutation: ReturnType<
    ApiClients["reactQuery"]["mutations"]["useEstimateRide"]
  >;
  confirmRideMutation: ReturnType<
    ApiClients["reactQuery"]["mutations"]["useConfirmRide"]
  >;
  estimateRideForm: ReturnType<typeof useEstimateRideFormForm>;
  rideSelected: EstimateRideCreatedDTO | null
  setRideSelected: Dispatch<SetStateAction<EstimateRideCreatedDTO | null>>
  users?: PublicUserDTO[]
};

const rideContext = createContext<RideContext>({} as RideContext);

type RideProviderProps = PropsWithChildren<{
}>;

export const RideProvider = ({
  children,
}: RideProviderProps) => {
  const { reactQuery } = useApiClients();
  const estimateRideMutation = reactQuery.mutations.useEstimateRide()
  const confirmRideMutation = reactQuery.mutations.useConfirmRide()
  const getAllPassengersQuery = reactQuery.queries.useGetAllUsers("passenger")
  const users = useMemo(() => getAllPassengersQuery.data, [getAllPassengersQuery.data])
  const [rideSelected, setRideSelected] = useState<EstimateRideCreatedDTO | null>(null)
  const estimateRideForm = useEstimateRideFormForm({
    validate: {
      customer_id: (value) =>
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)
          ? null
          : "ID inválido",

      destination: (value, values) =>
        !value
          ? "Digite o destino"
          : value === values.origin
            ? "Destino não pode ser igual à origem"
            : null,

      origin: (value, values) =>
        !value
          ? "Digite a origem"
          : value === values.destination
            ? "Origem não pode ser igual ao destino"
            : null,
    },
    mode: "uncontrolled",
  });
  useEffect(() => {
    console.log(rideSelected)
  }, [rideSelected])
  const contextValue = useMemo(
    () => ({
      estimateRideForm,
      rideSelected,
      setRideSelected,
      estimateRideMutation,
      confirmRideMutation,
      users
    }),
    [
      estimateRideForm,
      rideSelected,
      setRideSelected,
      estimateRideMutation,
      confirmRideMutation,
      users
    ],
  );

  return (
    <rideContext.Provider value={contextValue}>
      <EstimateRideFormProvider form={estimateRideForm}>
        {children}
      </EstimateRideFormProvider>

    </rideContext.Provider>
  );
};

export const useRideContext = () => useContext(rideContext);
