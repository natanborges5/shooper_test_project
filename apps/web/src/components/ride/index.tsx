import { Box } from "@mantine/core";
import { RideConfirmation } from "./ride.confirmation";
import { RideProvider, useRideContext } from "./ride.context";
import { RideForm } from "./ride.form";

export const RideHome = () => {
  const { rideSelected } = useRideContext()
  return (
    <Box>
      {rideSelected ? <RideConfirmation /> : <RideForm />}
    </Box>
  );
};
