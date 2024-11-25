"use client"
import { Box } from "@mantine/core";
import { LoginForm } from "./login-form";
import { useLoginContext } from "./login-form-context";
import { SignUpForm } from "./signup-form";

export const LoginSession = () => {
  const {
    modalSelected
  } = useLoginContext();
  return (
    <Box>
      {modalSelected === "login" ? <LoginForm /> : <SignUpForm />}
    </Box>
  );
};
