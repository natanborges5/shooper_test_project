import {
  Box,
  Button,
  TextInput,
  PasswordInput,
  Stack,
  Text
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { BsArrowRight } from "react-icons/bs";
import { useLoginContext } from "./login-form-context";
import { useLoadingOverlayStore } from "@web/src/lib/loading-overlay.store";
export const SignUpForm = () => {
  const {
    signUpForm,
    isLoading,
    setModalSelected,
    signUpMutation
  } = useLoginContext();
  const loadingOverlay = useLoadingOverlayStore();
  return (
    <Box component={"form"} onSubmit={signUpForm.onSubmit((data) => {
      loadingOverlay.toggleOn()
      const response = signUpMutation.mutate(data, {
        onSuccess(data, variables, context) {
          notifications.show({
            id: "sign-up",
            title: "Conta criada com sucesso",
            message:
              "Realize o seu login",
            color: "green",
            className: "text-white",
            withBorder: true,
          });
          loadingOverlay.toggleOff()
          setModalSelected("login")
        },
        onError(error: any, variables, context) {
          notifications.show({
            id: "sign-up",
            title: "Falha ao criar conta",
            message: error?.response?.data?.message,
            color: "red",
            className: "text-white",
            withBorder: true,
          });
          console.error(data, variables, context);
          loadingOverlay.toggleOff()
        },
      });
      console.log(response);
    })}>
      <Stack>
        <Text className="text-5xl font-light">Crie sua conta!</Text>
        <TextInput
          size="md"
          labelProps={{ className: "font-light my-2" }}
          label="Email"
          variant="filled"
          {...signUpForm.getInputProps("email")}
        />
        <TextInput
          size="md"
          labelProps={{ className: "font-light my-2" }}
          label="Nome"
          variant="filled"
          {...signUpForm.getInputProps("name")}
        />
        <PasswordInput
          size="md"
          labelProps={{ className: "font-light my-2" }}
          label="Senha"
          variant="filled"
          type="password"
          {...signUpForm.getInputProps("password")}
        />
        <Button
          className="w-full"
          variant="outline"
          type="submit"
          color="yellow"
          loading={isLoading}
          rightSection={<BsArrowRight className="text-xl" />}
        >
          Criar conta
        </Button>
      </Stack>
    </Box >
  );
};
