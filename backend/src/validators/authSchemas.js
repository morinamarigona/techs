import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6, 'Fjalekalimi duhet te kete se paku 6 karaktere.'),
  emri: z.string().min(2).trim(),
  mbiemri: z.string().min(2).trim(),
  roli: z.enum(['menaxher', 'punetor']).default('punetor'),
  numriTelefonit: z.string().optional().default(''),
});

export const loginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1),
});

export const resendVerificationSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
});
