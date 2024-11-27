import { Box, Button, Center, Loader, Select, Stack, Text } from "@mantine/core"
import { useHistoryContext } from "./history.context"
import { useEffect } from "react"

export const HistoryComponent = () => {
  const { passengers, userRides, drivers, filters, setFilters, setApplyFilters, getUserRidesQuery } = useHistoryContext()
  useEffect(() => {
    console.log("filters", filters)
  }, [filters])
  return (
    <Box className="w-full grid grid-cols-4">
      <Stack className="w-full items-center col-span-4 md:col-span-1">
        <Text className="text-2xl text-white">Filtros</Text>
        <Select
          clearable
          label="Selecione o passageiro"
          data={passengers?.map((user) => {
            return {
              value: user.id,
              label: user.email
            }
          })}
          value={filters.customer_id}
          onChange={(_value, option) => setFilters({ driver_id: "", customer_id: option.value })}
          defaultValue={filters.customer_id}
          allowDeselect={false}
          className="text-white"
        />
        <Select
          label="Selecione o motorista"
          data={[{ value: "", label: "Todos" }, ...drivers?.map((user) => {
            return {
              value: user?.id ?? "",
              label: user?.name ?? ""
            }
          }) ?? []]}
          onChange={(_value, option) => setFilters({ ...filters, driver_id: option.value })}
          defaultValue={filters.driver_id}
          className="text-white"
          allowDeselect={false}
        />
        <Button color="yellow" styles={{
          label: {
            color: "black"
          }
        }} onClick={() => setApplyFilters(true)}>Aplicar Filtros</Button>
      </Stack>
      <Stack className="col-span-4 md:col-span-3">
        <Text className="mt-10 md:mt-0 text-2xl font-medium text-white text-center">Viagens</Text>
        {getUserRidesQuery.isLoading ? <Center className="h-96"><Loader color="yellow" /></Center> : userRides?.rides.map((ride) => (
          <Box className="bg-yellow-500 p-4 rounded-md" key={ride.id}>
            <Box className="flex justify-between">
              <Text><span className="font-medium">Motorista: </span>{ride.driver.name}</Text>
              <Text><span className="font-medium">Data e hora: </span>{new Date(ride.date).toLocaleString()}</Text>
            </Box>
            <Box className="flex justify-between">
              <Text><span className="font-medium">Origem: </span>{ride.origin}</Text>
              <Text><span className="font-medium">Tempo de Viagem: </span>{ride.duration}</Text>
            </Box>
            <Box className="flex justify-between">
              <Text><span className="font-medium">Destino: </span>{ride.destination}</Text>
              <Text><span className="font-medium">Distância: </span>{ride.distance / 1000} Km</Text>
            </Box>
            <Text className="text-center text-lg"><span className="font-medium">Valor da Viagem: </span>R${ride.value}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}