import type { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
  type MutationFunction,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
export type SignUpDTO = {
  email: string;
  name: string;
  password: string;
  role: "passenger" | "driver";
};
export type CredentialsLoginDTO = {
  email: string;
  password: string;
};
export type JwtTokenDTO = {
  type?: "Bearer";
  token: string;
  expiryAt: string;
};
export type SessionDTO = {
  id: string;
  role: "passenger" | "driver";
  email: string;
  name: string;
  iss: string;
  iat: number;
  exp: number;
};
export type PublicUserDTO = {
  id: string;
  email: string;
  name: string;
  role: "passenger" | "driver";
};
export type EstimateRideDTO = {
  customer_id: string;
  origin: string;
  destination: string;
};
export type EstimateRideCreatedDTO = {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: {
    id: string;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
  }[];
  routeResponse: {
    [key: string]: any;
  };
};
export type ConfirmRideDTO = {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: string;
    name: string;
  };
  value: number;
};
export type ListRidesDTO = {
  customer_id: string;
  rides: {
    id: string;
    date: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
      id: string;
      name: string;
    };
    value: number;
  }[];
};
export type AxiosConfig = {
  paramsSerializer?: AxiosRequestConfig["paramsSerializer"];
};
export type Config = {
  mutations?: MutationConfigs;
  axios?: AxiosConfig;
};
export function initialize(axios: AxiosInstance, config?: Config) {
  const requests = makeRequests(axios, config?.axios);
  return {
    requests,
    queries: makeQueries(requests),
    mutations: makeMutations(requests, config?.mutations),
  };
}
function useRapiniMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  config?: (
    queryClient: QueryClient,
  ) => Pick<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "onSuccess" | "onSettled" | "onError"
  >,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { onSuccess, onError, onSettled, ...rest } = options ?? {};
  const queryClient = useQueryClient();
  const conf = config?.(queryClient);
  const mutationOptions: typeof options = {
    onSuccess: (data: TData, variables: TVariables, context: TContext) => {
      conf?.onSuccess?.(data, variables, context);
      onSuccess?.(data, variables, context);
    },
    onError: (error: TError, variables: TVariables, context?: TContext) => {
      conf?.onError?.(error, variables, context);
      onError?.(error, variables, context);
    },
    onSettled: (
      data: TData | undefined,
      error: TError | null,
      variables: TVariables,
      context?: TContext,
    ) => {
      conf?.onSettled?.(data, error, variables, context);
      onSettled?.(data, error, variables, context);
    },
    ...rest,
  };
  return useMutation({ mutationFn, ...mutationOptions });
}
function nullIfUndefined<T>(value: T): NonNullable<T> | null {
  return typeof value === "undefined" ? null : (value as NonNullable<T> | null);
}
export const queryKeys = {
  session: () => ["session"] as const,
  getAllUsers: (role?: "passenger" | "driver") =>
    ["getAllUsers", nullIfUndefined(role)] as const,
  getUserRides: (customer_id: string, driver_id?: string) =>
    ["getUserRides", customer_id, nullIfUndefined(driver_id)] as const,
  getAddress: (street: string) => ["getAddress", street] as const,
} as const;
export type QueryKeys = typeof queryKeys;
function makeRequests(axios: AxiosInstance, config?: AxiosConfig) {
  return {
    signUp: (payload: SignUpDTO) =>
      axios
        .request<unknown>({
          method: "post",
          url: `/api/auth/sign-up`,
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data),
    credentialsLogin: (payload: CredentialsLoginDTO) =>
      axios
        .request<JwtTokenDTO>({
          method: "post",
          url: `/api/auth/login/credentials`,
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data),
    session: () =>
      axios
        .request<SessionDTO>({
          method: "get",
          url: `/api/auth/session`,
        })
        .then((res) => res.data),
    getAllUsers: (role?: "passenger" | "driver") =>
      axios
        .request<PublicUserDTO[]>({
          method: "get",
          url: `/api/auth/users`,
          params: {
            ...(role !== undefined ? { role } : undefined),
          },
          paramsSerializer: config?.paramsSerializer,
        })
        .then((res) => res.data),
    logout: () =>
      axios
        .request<unknown>({
          method: "post",
          url: `/api/auth/logout`,
        })
        .then((res) => res.data),
    estimateRide: (payload: EstimateRideDTO) =>
      axios
        .request<EstimateRideCreatedDTO>({
          method: "post",
          url: `/api/ride/estimate`,
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data),
    confirmRide: (payload: ConfirmRideDTO) =>
      axios
        .request<unknown>({
          method: "patch",
          url: `/api/ride/confirm`,
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data),
    getUserRides: (customer_id: string, driver_id?: string) =>
      axios
        .request<ListRidesDTO>({
          method: "get",
          url: `/api/ride/ride/${customer_id}`,
          params: {
            ...(driver_id !== undefined ? { driver_id } : undefined),
          },
          paramsSerializer: config?.paramsSerializer,
        })
        .then((res) => res.data),
    getAddress: (street: string) =>
      axios
        .request<string[]>({
          method: "get",
          url: `/api/ride/address`,
          params: {
            street,
          },
          paramsSerializer: config?.paramsSerializer,
        })
        .then((res) => res.data),
  } as const;
}
export type Requests = ReturnType<typeof makeRequests>;
export type Response<T extends keyof Requests> = Awaited<
  ReturnType<Requests[T]>
>;
function makeQueries(requests: Requests) {
  return {
    useSession: (
      options?: Omit<
        UseQueryOptions<
          Response<"session">,
          unknown,
          Response<"session">,
          ReturnType<QueryKeys["session"]>
        >,
        "queryKey" | "queryFn"
      >,
    ): UseQueryResult<Response<"session">, unknown> =>
      useQuery({
        queryKey: queryKeys.session(),
        queryFn: () => requests.session(),
        ...options,
      }),
    useGetAllUsers: (
      role?: "passenger" | "driver",
      options?: Omit<
        UseQueryOptions<
          Response<"getAllUsers">,
          unknown,
          Response<"getAllUsers">,
          ReturnType<QueryKeys["getAllUsers"]>
        >,
        "queryKey" | "queryFn"
      >,
    ): UseQueryResult<Response<"getAllUsers">, unknown> =>
      useQuery({
        queryKey: queryKeys.getAllUsers(role),
        queryFn: () => requests.getAllUsers(role),
        ...options,
      }),
    useGetUserRides: (
      customer_id: string,
      driver_id?: string,
      options?: Omit<
        UseQueryOptions<
          Response<"getUserRides">,
          unknown,
          Response<"getUserRides">,
          ReturnType<QueryKeys["getUserRides"]>
        >,
        "queryKey" | "queryFn"
      >,
    ): UseQueryResult<Response<"getUserRides">, unknown> =>
      useQuery({
        queryKey: queryKeys.getUserRides(customer_id, driver_id),
        queryFn: () => requests.getUserRides(customer_id, driver_id),
        ...options,
      }),
    useGetAddress: (
      street: string,
      options?: Omit<
        UseQueryOptions<
          Response<"getAddress">,
          unknown,
          Response<"getAddress">,
          ReturnType<QueryKeys["getAddress"]>
        >,
        "queryKey" | "queryFn"
      >,
    ): UseQueryResult<Response<"getAddress">, unknown> =>
      useQuery({
        queryKey: queryKeys.getAddress(street),
        queryFn: () => requests.getAddress(street),
        ...options,
      }),
  } as const;
}
type MutationConfigs = {
  useSignUp?: (
    queryClient: QueryClient,
  ) => Pick<
    UseMutationOptions<
      Response<"signUp">,
      unknown,
      Parameters<Requests["signUp"]>[0],
      unknown
    >,
    "onSuccess" | "onSettled" | "onError"
  >;
  useCredentialsLogin?: (
    queryClient: QueryClient,
  ) => Pick<
    UseMutationOptions<
      Response<"credentialsLogin">,
      unknown,
      Parameters<Requests["credentialsLogin"]>[0],
      unknown
    >,
    "onSuccess" | "onSettled" | "onError"
  >;
  useLogout?: (
    queryClient: QueryClient,
  ) => Pick<
    UseMutationOptions<Response<"logout">, unknown, unknown, unknown>,
    "onSuccess" | "onSettled" | "onError"
  >;
  useEstimateRide?: (
    queryClient: QueryClient,
  ) => Pick<
    UseMutationOptions<
      Response<"estimateRide">,
      unknown,
      Parameters<Requests["estimateRide"]>[0],
      unknown
    >,
    "onSuccess" | "onSettled" | "onError"
  >;
  useConfirmRide?: (
    queryClient: QueryClient,
  ) => Pick<
    UseMutationOptions<
      Response<"confirmRide">,
      unknown,
      Parameters<Requests["confirmRide"]>[0],
      unknown
    >,
    "onSuccess" | "onSettled" | "onError"
  >;
};
function makeMutations(requests: Requests, config?: Config["mutations"]) {
  return {
    useSignUp: (
      options?: Omit<
        UseMutationOptions<
          Response<"signUp">,
          unknown,
          Parameters<Requests["signUp"]>[0],
          unknown
        >,
        "mutationFn"
      >,
    ) =>
      useRapiniMutation<
        Response<"signUp">,
        unknown,
        Parameters<Requests["signUp"]>[0]
      >((payload) => requests.signUp(payload), config?.useSignUp, options),
    useCredentialsLogin: (
      options?: Omit<
        UseMutationOptions<
          Response<"credentialsLogin">,
          unknown,
          Parameters<Requests["credentialsLogin"]>[0],
          unknown
        >,
        "mutationFn"
      >,
    ) =>
      useRapiniMutation<
        Response<"credentialsLogin">,
        unknown,
        Parameters<Requests["credentialsLogin"]>[0]
      >(
        (payload) => requests.credentialsLogin(payload),
        config?.useCredentialsLogin,
        options,
      ),
    useLogout: (
      options?: Omit<
        UseMutationOptions<Response<"logout">, unknown, unknown, unknown>,
        "mutationFn"
      >,
    ) =>
      useRapiniMutation<Response<"logout">, unknown, unknown>(
        () => requests.logout(),
        config?.useLogout,
        options,
      ),
    useEstimateRide: (
      options?: Omit<
        UseMutationOptions<
          Response<"estimateRide">,
          unknown,
          Parameters<Requests["estimateRide"]>[0],
          unknown
        >,
        "mutationFn"
      >,
    ) =>
      useRapiniMutation<
        Response<"estimateRide">,
        unknown,
        Parameters<Requests["estimateRide"]>[0]
      >(
        (payload) => requests.estimateRide(payload),
        config?.useEstimateRide,
        options,
      ),
    useConfirmRide: (
      options?: Omit<
        UseMutationOptions<
          Response<"confirmRide">,
          unknown,
          Parameters<Requests["confirmRide"]>[0],
          unknown
        >,
        "mutationFn"
      >,
    ) =>
      useRapiniMutation<
        Response<"confirmRide">,
        unknown,
        Parameters<Requests["confirmRide"]>[0]
      >(
        (payload) => requests.confirmRide(payload),
        config?.useConfirmRide,
        options,
      ),
  } as const;
}
