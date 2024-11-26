import { Stack, Text } from "@mantine/core"
import { useRideContext } from "./ride.context"
import MapWithRoute from "./ride.map"

export const RideConfirmation = () => {
  const { rideSelected } = useRideContext()
  return (
    <Stack>
      <Text>CONFIRM</Text>
      {/* <MapWithRoute routeResponse={rideSelected?.routeResponse} /> */}
    </Stack>
  )
}