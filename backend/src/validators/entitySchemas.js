import { z } from 'zod';

export const productSchema = z.object({
  emri: z.string().min(1).trim(),
  sku: z.string().min(1).trim().transform((v) => v.toUpperCase()),
  kategoria: z.enum([
    'Telefonë & Tabletë',
    'Telefone & Tablete',
    'Laptops & Kompjutere',
    'Laptops & Kompjuterë',
    'Audio & Degjuese',
    'Audio & Dëgjuese',
    'TV & Video',
    'Pajisje Shtepiake',
    'Pajisje Shtëpiake',
    'Aksesore & Tjera',
    'Aksesorë & Tjera',
  ]),
  cmimi: z.coerce.number().min(0),
  cmimiBlerjes: z.coerce.number().min(0).optional(),
  stoku: z.coerce.number().int().min(0).default(0),
  stokuMin: z.coerce.number().int().min(0).default(2),
  pershkrimi: z.string().optional().default(''),
  imazhi: z.string().optional().default(''),
});

export const userCreateSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()),
  password: z.string().min(6, 'Fjalekalimi duhet te kete se paku 6 karaktere.'),
  emri: z.string().min(2).trim(),
  mbiemri: z.string().min(2).trim(),
  roli: z.enum(['menaxher', 'punetor']).default('punetor'),
  statusi: z.enum(['Aktiv', 'Jo-aktiv']).default('Aktiv'),
  numriTelefonit: z.string().optional().default(''),
});

export const userUpdateSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase().trim()).optional(),
  emri: z.string().min(2).trim().optional(),
  mbiemri: z.string().min(2).trim().optional(),
  roli: z.enum(['menaxher', 'punetor']).optional(),
  statusi: z.enum(['Aktiv', 'Jo-aktiv']).optional(),
  numriTelefonit: z.string().optional(),
  password: z.string().min(6).optional(),
});


export const stockAdjustSchema = z.object({
  productId: z.string().min(1),
  sasiaNdryshuar: z.coerce.number().int(),
  lloji: z.enum(['Hyrje Furnizimi', 'Korigjim Stokut']),
  shenime: z.string().optional().default(''),
});

const saleItemSchema = z.object({
  productId: z.string().min(1),
  sasia: z.coerce.number().int().min(1),
});

export const saleCreateSchema = z.object({
  items: z.array(saleItemSchema).min(1),
  zbritja: z.coerce.number().min(0).default(0),
  menyraPageses: z.string().min(1),
  klientEmri: z.string().optional().default(''),
});
