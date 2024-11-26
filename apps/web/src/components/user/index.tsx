"use client"
import { SignUpForm } from "./signup-form";
import { LoginProvider } from "./user.form.context";

export const UserComponent = () => {
  return (
    <LoginProvider>
      <SignUpForm />
    </LoginProvider>
  );
};
