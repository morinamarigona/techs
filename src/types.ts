export type UserRole = 'menaxher' | 'punetor';

export interface User {
  id: string;
  email: string;
  password?: string;
  emri: string;
  mbiemri: string;
  roli: UserRole;
  statusi: 'Aktiv' | 'Jo-aktiv';
  numriTelefonit: string;
  dataKrijimit: string;
}

export type Category = 
  | 'Telefonë & Tabletë'
  | 'Laptops & Kompjuterë'
  | 'Audio & Dëgjuese'
  | 'TV & Video'
  | 'Pajisje Shtëpiake'
  | 'Aksesorë & Tjera';

export interface Product {
  id: string;
  emri: string;
  sku: string;
  kategoria: Category;
  cmimi: number; // Euro €
  cmimiBlerjes: number;
  stoku: number;
  stokuMin: number;
  pershkrimi: string;
  imazhi: string;
  dataShtimit: string;
}

export interface CartItem {
  product: Product;
  sasia: number;
  cmimiTotal: number;
}

export interface SaleItem {
  productId: string;
  produktEmri: string;
  sku: string;
  sasia: number;
  cmimiNjesi: number;
  total: number;
}

export interface Sale {
  id: string;
  nrFatures: string;
  punetoriId: string;
  punetoriEmri: string;
  items: SaleItem[];
  shumaBruto: number;
  zbritja: number; // përqindje ose vlerë në euro
  tvsh: number; // 18% standard
  shumaNeto: number;
  menyraPageses: 'Kesh' | 'Kartelë' | 'Me Këste';
  klientEmri?: string;
  data: string;
}

export interface StockLog {
  id: string;
  productId: string;
  produktEmri: string;
  lloji: 'Hyrje Furnizimi' | 'Dalje (Shitje)' | 'Korigjim Stokut';
  sasia: number;
  sasiaVjetra: number;
  sasiaRe: number;
  perdoruesi: string;
  data: string;
  shenime?: string;
}
