import z from "zod";
import { env, EnvConfigSchema } from "./env.config.mjs";

export type EnvConfig = z.infer<typeof EnvConfigSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {}
  }
}

export default { env };
