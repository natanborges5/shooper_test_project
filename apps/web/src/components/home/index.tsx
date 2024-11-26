import { Box } from "@mantine/core"
import { homeComponents, useHomeContext } from "./home.context"

export const HomepageComponent = () => {
  const { componentSelected } = useHomeContext()
  return (
    <Box>
      {homeComponents[componentSelected].element}
    </Box>
  )
}