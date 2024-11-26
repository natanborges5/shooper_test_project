import { Box, Button, OptionsFilter, Select, Stack, Text } from "@mantine/core";
import { useRideContext } from "./ride.context";
import { useApiClients } from "@web/src/app/api-clients";
import { useMemo, useState } from "react";
import { useLoadingOverlayStore } from "@web/src/lib/loading-overlay.store";
import { notifications } from "@mantine/notifications";
const optionsFilter: OptionsFilter = ({ options, search }) => {
  return options
};
export const RideForm = () => {
  const { reactQuery } = useApiClients();
  const { users, estimateRideForm, estimateRideMutation, setRideSelected } = useRideContext()
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");

  const originAddressesQuery = reactQuery.queries.useGetAddress(originSearch, { retry: 1, enabled: originSearch.length >= 6 });
  const destinationAddressesQuery = reactQuery.queries.useGetAddress(destinationSearch, { retry: 1, enabled: originSearch.length >= 6 });

  const originAddresses = useMemo(() => originAddressesQuery.data, [originAddressesQuery.data]);
  const destinationAddresses = useMemo(() => destinationAddressesQuery.data, [destinationAddressesQuery.data]);
  const loadingOverlay = useLoadingOverlayStore();
  return (
    <Box className="w-full" component={"form"} onSubmit={estimateRideForm.onSubmit((data) => {
      loadingOverlay.toggleOn()
      estimateRideMutation.mutateAsync(data, {
        onSuccess(data, variables, context) {
          notifications.show({
            id: "estimateRide",
            title: "Motoristas encontrados",
            message:
              "Confirme sua viagem",
            color: "green",
            className: "text-white",
            withBorder: true,
          });
          console.log("NO SUCCESS", data)
          setRideSelected(data)
          loadingOverlay.toggleOff()
        },
        onError(error: any, variables, context) {
          notifications.show({
            id: "estimateRide",
            title: "Falha ao encontrar motorista",
            message: error?.response?.data?.message,
            color: "red",
            className: "text-white",
            withBorder: true,
          });
          console.error(data, variables, context);
          loadingOverlay.toggleOff()
        },
      })
    })}>
      <Stack className="w-1/2 justify-center mx-auto">
        <Text className="text-3xl font-light">Solicitar Viagem</Text>
        <Select
          clearable
          label="Selecione o passageiro"
          {...estimateRideForm.getInputProps("customer_id")}
          data={users?.map((user) => {
            return {
              value: user.id,
              label: user.email
            }
          })}
          styles={{
            option: {
              color: "black", // Altera a cor do texto dos itens do dropdown
            },
          }}
        />
        <Select
          clearable
          label="Local de Origem"
          searchValue={originSearch}
          searchable
          filter={optionsFilter}
          onSearchChange={setOriginSearch}
          data={[...originAddresses ?? [], originSearch + " "]}
          {...estimateRideForm.getInputProps("origin")}
          styles={{
            option: {
              color: "black", // Altera a cor do texto dos itens do dropdown
            },
          }}
        />
        <Select
          clearable
          label="Destino"
          searchValue={destinationSearch}
          searchable
          filter={optionsFilter}
          onSearchChange={setDestinationSearch}
          data={[...destinationAddresses ?? [], destinationSearch + " "]}
          {...estimateRideForm.getInputProps("destination")}
          styles={{
            option: {
              color: "black", // Altera a cor do texto dos itens do dropdown
            },
          }}
        />
        <Button type="submit" color="yellow" styles={{
          label: {
            color: "black",
            fontWeight: 400,
          }
        }}>
          Buscar Motorista
        </Button>
      </Stack>
    </Box>
  );
};
