import { ActionIcon, AppShell, Box, Divider, Text } from "@mantine/core";
import { EdgeBox } from "../edge-box";
import Link from "next/link";
import { useSession } from "@web/src/lib/session.store";
import { CiLogout } from "react-icons/ci";
export const AppHeader = () => {
  const { authenticated, session } = useSession()
  return (
    <AppShell.Header className="w-full bg-yellow-500 items-center">
      <EdgeBox>
        <Box className="justify-between items-center flex">
          <Link href="/" className="min-w-15">
            <Text className="text-4xl font-light text-gray-900">Shooper Travel NMB</Text>
          </Link>
          {authenticated && <Box className="flex gap-2 items-center">
            <Text className="font-normal text-sm text-gray-800"> {session?.name.toUpperCase()}</Text>
            <Divider orientation="vertical" color="dark" />
            <ActionIcon color="dark" variant="transparent" aria-label="Settings">
              <CiLogout className="text-5xl" />
            </ActionIcon>
          </Box>}
        </Box>
      </EdgeBox>
    </AppShell.Header>
  );
};
