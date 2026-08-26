import 'dotenv/config';
import { connectDb } from './config/db.js';
import { Product } from './models/Product.js';
import { Sale } from './models/Sale.js';
import { StockLog } from './models/StockLog.js';
import { User } from './models/User.js';

const productsSeed = [
  {
    emri: 'iPhone 15 Pro Max 256GB Titanium',
    sku: 'APL-IP15PM-256',
    kategoria: 'Telefonë & Tabletë',
    cmimi: 1299.99,
    cmimiBlerjes: 1050,
    stoku: 12,
    stokuMin: 3,
    pershkrimi: 'Smartphone me procesor A17 Pro, trup nga titani dhe kamere profesionale 48MP.',
    imazhi: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    dataShtimit: '2025-01-15',
  },
  {
    emri: 'Samsung Galaxy S24 Ultra 512GB',
    sku: 'SAM-S24U-512',
    kategoria: 'Telefonë & Tabletë',
    cmimi: 1189,
    cmimiBlerjes: 940,
    stoku: 8,
    stokuMin: 3,
    pershkrimi: 'Me stilograf S-Pen, kamere 200MP dhe AI te integruar Galaxy AI.',
    imazhi: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    dataShtimit: '2025-01-18',
  },
  {
    emri: 'MacBook Air M3 15" 16GB 512GB',
    sku: 'APL-MBA15-M3',
    kategoria: 'Laptops & Kompjuterë',
    cmimi: 1499,
    cmimiBlerjes: 1220,
    stoku: 5,
    stokuMin: 2,
    pershkrimi: 'Laptop ultra i holle me cip Apple M3 dhe bateri deri ne 18 ore.',
    imazhi: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    dataShtimit: '2025-02-01',
  },
  {
    emri: 'Sony WH-1000XM5 Noise Canceling',
    sku: 'SNY-WH1000XM5',
    kategoria: 'Audio & Dëgjuese',
    cmimi: 349,
    cmimiBlerjes: 260,
    stoku: 15,
    stokuMin: 4,
    pershkrimi: 'Degjuese me izolim maksimal te zhurmes dhe bateri 30 ore.',
    imazhi: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    dataShtimit: '2025-02-12',
  },
  {
    emri: 'PlayStation 5 Slim Digital Edition',
    sku: 'SNY-PS5-SLIM',
    kategoria: 'TV & Video',
    cmimi: 479,
    cmimiBlerjes: 390,
    stoku: 0,
    stokuMin: 3,
    pershkrimi: 'Konzole lojrash me SSD ultra te shpejte 1TB dhe pult DualSense.',
    imazhi: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    dataShtimit: '2025-03-01',
  },
];

async function seed() {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Sale.deleteMany({}),
    StockLog.deleteMany({}),
  ]);

  const passwordHash = await User.hashPassword('123456');
  const adminPasswordHash = await User.hashPassword('admin123');
  const testPasswordHash = await User.hashPassword('test123');
  const users = await User.insertMany([
    {
      email: 'menaxher@techstore.al',
      passwordHash,
      emri: 'Arben',
      mbiemri: 'Hoxha',
      roli: 'menaxher',
      statusi: 'Aktiv',
      numriTelefonit: '+383 44 111 222',
      dataKrijimit: '2025-01-10',
      emailVerified: true,
    },
    {
      email: 'punetor1@techstore.al',
      passwordHash,
      emri: 'Yllka',
      mbiemri: 'Rama',
      roli: 'punetor',
      statusi: 'Aktiv',
      numriTelefonit: '+383 49 333 444',
      dataKrijimit: '2025-02-01',
      emailVerified: true,
    },
    {
      email: 'punetor2@techstore.al',
      passwordHash,
      emri: 'Blerim',
      mbiemri: 'Krasniqi',
      roli: 'punetor',
      statusi: 'Aktiv',
      numriTelefonit: '+383 45 555 666',
      dataKrijimit: '2025-03-15',
      emailVerified: true,
    },
    {
      email: 'admin@gmail.com',
      passwordHash: adminPasswordHash,
      emri: 'Admin',
      mbiemri: 'User',
      roli: 'menaxher',
      statusi: 'Aktiv',
      numriTelefonit: '',
      dataKrijimit: '2026-08-07',
      emailVerified: true,
    },
    {
      email: 'test@gmail.com',
      passwordHash: testPasswordHash,
      emri: 'Test',
      mbiemri: 'User',
      roli: 'punetor',
      statusi: 'Aktiv',
      numriTelefonit: '',
      dataKrijimit: '2026-08-07',
      emailVerified: true,
    },
  ]);

  const products = await Product.insertMany(productsSeed);
  const p = Object.fromEntries(products.map((product) => [product.sku, product]));
  const worker = users[1];

  await Sale.create({
    nrFatures: 'TS-2026-00101',
    punetoriId: worker._id,
    punetoriEmri: `${worker.emri} ${worker.mbiemri}`,
    items: [
      {
        productId: p['APL-IP15PM-256']._id,
        produktEmri: p['APL-IP15PM-256'].emri,
        sku: p['APL-IP15PM-256'].sku,
        sasia: 1,
        cmimiNjesi: 1299.99,
        total: 1299.99,
      },
    ],
    shumaBruto: 1299.99,
    zbritja: 0,
    tvsh: 234,
    shumaNeto: 1299.99,
    menyraPageses: 'Kartele',
    klientEmri: 'Filan Fisteku',
    data: '2026-08-05T14:30:00.000Z',
  });

  await StockLog.insertMany([
    {
      productId: p['APL-IP15PM-256']._id,
      produktEmri: p['APL-IP15PM-256'].emri,
      lloji: 'Hyrje Furnizimi',
      sasia: 15,
      sasiaVjetra: 0,
      sasiaRe: 15,
      perdoruesi: 'Arben Hoxha',
      data: '2025-01-15T10:00:00.000Z',
      shenime: 'Furnizim i ri nga distributori zyrtar',
    },
    {
      productId: p['APL-IP15PM-256']._id,
      produktEmri: p['APL-IP15PM-256'].emri,
      lloji: 'Dalje (Shitje)',
      sasia: 1,
      sasiaVjetra: 13,
      sasiaRe: 12,
      perdoruesi: 'Yllka Rama',
      data: '2026-08-05T14:30:00.000Z',
      shenime: 'Shitje fature #TS-2026-00101',
    },
  ]);

  console.log('Seed completed.');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
