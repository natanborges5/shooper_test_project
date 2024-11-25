import {
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Text
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSession } from "@web/src/lib/session.store";
import { CredentialsLoginDTO } from "@web/src/lib/react-query";
import { BsArrowRight } from "react-icons/bs";
import { useLoginContext } from "./login-form-context";

export const LoginForm = () => {
  const {
    loginForm,
    credentialsLoginMutation,
    isLoading,
    setModalSelected
  } = useLoginContext();
  const { query: sessionQuery } = useSession();
  return (
    <Stack>
      <Text className="text-5xl font-light">Seja Bem Vindo</Text>
      <Text className="text-xl text-center">Realize o login</Text>
      <TextInput
        size="md"
        labelProps={{ className: "my-2" }}
        label="Email"
        variant="filled"
        {...loginForm.getInputProps("email")}
      />
      <PasswordInput
        size="md"
        labelProps={{ className: "my-2 text-white" }}
        label="Senha"
        variant="filled"
        type="password"
        {...loginForm.getInputProps("password")}
      />
      <Button
        variant="outline"
        color="yellow"
        onClick={async () => {
          const data = loginForm.getValues() as CredentialsLoginDTO;
          credentialsLoginMutation.mutate(data, {
            onSuccess(data, variables, context) {
              notifications.show({
                id: "login",
                message: "Seja bem vindo",
                color: "green",
                className: " text-white",
                autoClose: 6000,
                withCloseButton: true,
                withBorder: true,
              });
              console.log(data, variables, context);
              close();
              loginForm.reset();
              sessionQuery.refetch().then();
            },
            onError(error: any, variables, context) {
              notifications.show({
                id: "login",
                title: "Email ou senha inválidos",
                message: error?.response?.data?.message,
                color: "red",
                className: " text-white",
                withBorder: true,
              });
              console.error(data, variables, context);
            },
          });
        }}
        loading={isLoading}
        rightSection={<BsArrowRight className="text-xl" />}
      >
        Entrar
      </Button>
      <Button
        variant="outline"
        color="yellow"
        onClick={() => setModalSelected("signup")}
      >
        Criar Conta
      </Button>
    </Stack >
  );
};
