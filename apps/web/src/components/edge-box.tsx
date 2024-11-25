import { Box, BoxProps } from "@mantine/core";
import { PropsWithChildren } from "react";

export const EdgeBox = ({
  children,
  className = "mx-auto w-full max-w-9xl 3xl:max-w-[140rem] py-4 px-4 md:px-16 gap-4 justify-center items-center flex-col",
  ...boxProps
}: PropsWithChildren<BoxProps>) => (
  <Box className="w-full flex-col justify-center items-center" bg={boxProps.bg}>
    <Box className={className} {...boxProps}>
      {children}
    </Box>
  </Box>
);
