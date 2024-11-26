"use client";
import { createFormContext } from "@mantine/form";
import { ApiClients, useApiClients } from "@web/src/app/api-clients";
import { SignUpDTO } from "@web/src/lib/react-query";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";


const [SignUpFormProvider, useSignUpFormFormContext, useSignUpFormForm] =
  createFormContext<SignUpDTO>();
type UserContext = {
  signUpMutation: ReturnType<
    ApiClients["reactQuery"]["mutations"]["useSignUp"]
  >;
  signUpForm: ReturnType<typeof useSignUpFormForm>;
};

const userContext = createContext<UserContext>({} as UserContext);

export const LoginProvider = ({
  children,
}: PropsWithChildren) => {
  const { reactQuery } = useApiClients();
  const signUpMutation = reactQuery.mutations.useSignUp()
  const signUpForm = useSignUpFormForm({
    initialValues: {
      email: '',
      password: "",
      name: "",
      role: "passenger"
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalido'),
      password: (value) => (value.length > 0 ? null : "Digite a senha"),
      name: (value) => (value.length > 0 ? null : "Digite o nome"),
    },
    mode: "uncontrolled",
  });

  const contextValue = useMemo(
    () => ({
      signUpForm,
      signUpMutation
    }),
    [
      signUpForm,
      signUpMutation
    ],
  );

  return (
    <userContext.Provider value={contextValue}>
      <SignUpFormProvider form={signUpForm}>{children}</SignUpFormProvider>
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
