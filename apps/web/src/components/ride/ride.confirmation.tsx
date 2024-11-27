import { Box, Button, Stack, Text } from "@mantine/core"
import { useRideContext } from "./ride.context"
import MapWithRoute from "./ride.map"
import { FaStar } from "react-icons/fa";
import { ConfirmRideDTO } from "@web/src/lib/react-query";
import { notifications } from "@mantine/notifications";
import { useHomeContext } from "../home/home.context";
export const RideConfirmation = () => {
  const { setComponentSelected } = useHomeContext()
  const { rideSelected, confirmRideMutation, estimateRideForm } = useRideContext()
  return (
    <Stack className="justify-center items-center">
      <Text className="text-3xl text-white">Motoristas</Text>
      {rideSelected?.options.map((option) => (
        <Box className="w-full md:w-[40rem] bg-yellow-500 p-4 rounded-md" key={option.id}>
          <Box className="flex gap-3 justify-between">
            <Text className="text-black"><span className="font-medium text-xl">Nome: </span>{option.name}</Text>
            <Text className="text-black"><span className="font-medium text-xl">Veiculo: </span>{option.vehicle}</Text>
          </Box>
          <Text className="text-black font-medium text-xl">Descrição</Text>
          <Text className="p-1">{option.description}</Text>
          <Box className="flex gap-2 items-center">
            <Text className="text-black font-medium text-xl">Avaliação {option.review.rating}/5 </Text>
            <FaStar />
          </Box>
          <Text className="p-1">{option.review.comment}</Text>
          <Box className="flex justify-between items-center">
            <Text className="text-black text-xl"><span className="font-medium">Valor da viagem: </span>R${option.value}</Text>
            <Button onClick={() => {
              const data: ConfirmRideDTO = {
                customer_id: estimateRideForm.getValues().customer_id,
                destination: estimateRideForm.getValues().destination,
                origin: estimateRideForm.getValues().origin,
                distance: rideSelected.distance,
                driver: {
                  id: option.id,
                  name: option.name
                },
                duration: rideSelected.duration,
                value: option.value
              }
              confirmRideMutation.mutateAsync(data, {
                onSuccess(data, variables, context) {
                  notifications.show({
                    id: "estimateRide",
                    title: "Viagem confirmada!",
                    message: "",
                    color: "green",
                    className: "text-white",
                    withBorder: true,
                  });
                  setComponentSelected("history")
                },
                onError(error: any, variables, context) {
                  notifications.show({
                    id: "estimateRide",
                    title: "Falha ao confirmar viagem",
                    message: error?.response?.data?.message,
                    color: "red",
                    className: "text-white",
                    withBorder: true,
                  });
                  console.error(data, variables, context);
                },
              })
            }} color="dark">Escolher</Button>
          </Box>
        </Box>
      ))}
      {/* <MapWithRoute routeResponse={rideSelected?.routeResponse} /> */}
    </Stack>
  )
}