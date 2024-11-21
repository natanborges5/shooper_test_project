import { z } from 'zod';

export const StrToIntNumberSchema = z
  .any()
  .transform((val) => parseInt(`${val}`));

export const StrToFloatNumberSchema = z
  .any()
  .transform((val) => parseFloat(`${val}`));

export const StrToDateSchema = z
  .union([z.string().datetime(), z.date()])
  .transform((val) => {
    return (typeof val === 'string' ? new Date(val) : val).toISOString();
  });

export const StringBooleanSchema = z
  .union([z.boolean(), z.string()])
  .transform((val) => `${val}`.toLowerCase() === 'true');
