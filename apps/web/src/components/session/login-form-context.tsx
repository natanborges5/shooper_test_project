"use client";
import { createFormContext } from "@mantine/form";
import { ApiClients, useApiClients } from "@web/src/app/api-clients";
import { CredentialsLoginDTO, SignUpDTO } from "@web/src/lib/react-query";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useMemo, useState } from "react";


const [LoginFormProvider, useLoginFormContext, useLoginForm] =
  createFormContext<CredentialsLoginDTO>();
const [signUpFormProvider, useSignUpFormFormContext, useSignUpFormForm] =
  createFormContext<SignUpDTO>();
type LoginContext = {
  credentialsLoginMutation: ReturnType<
    ApiClients["reactQuery"]["mutations"]["useCredentialsLogin"]
  >;
  signUpMutation: ReturnType<
    ApiClients["reactQuery"]["mutations"]["useSignUp"]
  >;
  isLoading: boolean;
  loginForm: ReturnType<typeof useLoginForm>;
  signUpForm: ReturnType<typeof useSignUpFormForm>;
  modalSelected: "login" | "signup"
  setModalSelected: Dispatch<SetStateAction<"login" | "signup">>
};

const loginContext = createContext<LoginContext>({} as LoginContext);

type LoginProviderProps = PropsWithChildren<{
}>;

export const LoginProvider = ({
  children,
}: LoginProviderProps) => {
  const { reactQuery } = useApiClients();
  const credentialsLoginMutation = reactQuery.mutations.useCredentialsLogin();
  const signUpMutation = reactQuery.mutations.useSignUp()
  const [modalSelected, setModalSelected] = useState<"login" | "signup">("login")
  const loginForm = useLoginForm({
    initialValues: {
      email: '',
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 0 ? null : "Digite a senha"),
    },
    mode: "uncontrolled",
  });
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
  const isLoading = useMemo(
    () => credentialsLoginMutation.isPending,
    [credentialsLoginMutation.isPending],
  );

  const contextValue = useMemo(
    () => ({
      credentialsLoginMutation,
      loginForm,
      signUpForm,
      isLoading,
      modalSelected,
      setModalSelected,
      signUpMutation
    }),
    [
      credentialsLoginMutation,
      loginForm,
      signUpForm,
      isLoading,
      modalSelected,
      setModalSelected,
      signUpMutation
    ],
  );

  return (
    <loginContext.Provider value={contextValue}>
      <LoginFormProvider form={loginForm}>{children}</LoginFormProvider>
    </loginContext.Provider>
  );
};

export const useLoginContext = () => useContext(loginContext);
