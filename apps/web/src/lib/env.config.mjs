import { z } from "zod";

export const EnvConfigSchema = z.object( {
  TZ: z
    .string()
    .default( 'America/Sao_Paulo' )
    .describe( 'The timezone the app is running in' ),
  DATABASE_URL: z
    .string()
    .url()
    .describe( "The URL of the Postgres database" )
    .default(
      "postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
    ),
  NEXT_PUBLIC_BACKEND_URL: z
    .string()
    .url()
    .describe( "The URL of the Backend Server" )
    .default( "http://localhost:8080" ),
  NEXT_PUBLIC_FRONTEND_URL: z
    .string()
    .url()
    .describe( "The URL of the Frontend Server" )
    .default( "http://localhost:3000" ),
} );


const parsed = EnvConfigSchema.safeParse( process.env );


if ( !parsed.success ) {
  console.error(
    `Some environment variables are invalid or not set: ${JSON.stringify(
      parsed.error.errors,
      null,
      2,
    )}`,
  );
}

export const env = parsed.data ?? EnvConfigSchema.parse( process.env );
