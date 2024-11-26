import { AppShell, Box, Text } from "@mantine/core";
import { EdgeBox } from "../edge-box";
import Link from "next/link";
import { useHomeContext } from "../home/home.context";
export const AppHeader = () => {
  const { setComponentSelected } = useHomeContext()
  return (
    <AppShell.Header className="w-full bg-yellow-500 items-center">
      <EdgeBox>
        <Box className="justify-start gap-10 items-center flex">
          <Link href="/" className="min-w-15">
            <Text className="text-4xl font-light text-gray-900">Shooper Travel NMB</Text>
          </Link>
          <Box className="flex items-center gap-3">
            <Text className="text-black text-xl font-light hover:font-normal cursor-pointer" onClick={() => setComponentSelected("ride")}>Ride</Text>
            <Text className="text-black text-xl font-light hover:font-normal cursor-pointer" onClick={() => setComponentSelected("user")}>Users</Text>
          </Box>
        </Box>
      </EdgeBox>
    </AppShell.Header>
  );
};
