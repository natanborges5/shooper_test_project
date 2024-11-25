"use client"
import { LoginSession } from "../components/session";
import { LoginProvider } from "../components/session/login-form-context";
import { EdgeBox } from "../components/edge-box";
import { Box } from "@mantine/core";
import { useSession } from "../lib/session.store";

export default function Home() {
  const { authenticated } = useSession()
  return (
    <EdgeBox>

      {!authenticated ? <Box className="flex flex-col justify-center items-center">
        <LoginProvider>
          <LoginSession />
        </LoginProvider>
      </Box> : <></>}
    </EdgeBox>
  );
}
