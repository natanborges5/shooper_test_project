/// <reference types="@suites/doubles.jest/unit" />
import type { SessionDTO } from './auth/session/session.dto';
declare global {
  declare namespace Express {
    export interface Request {
      session?: SessionDTO;
    }
  }
}
