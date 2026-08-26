import 'dotenv/config';
import { connectDb } from '../config/db.js';
import { User } from '../models/User.js';

async function upsertUsers() {
  await connectDb();

  const users = [
    {
      email: 'admin@gmail.com',
      password: 'admin123',
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
      password: 'test123',
      emri: 'Test',
      mbiemri: 'User',
      roli: 'punetor',
      statusi: 'Aktiv',
      numriTelefonit: '',
      dataKrijimit: '2026-08-07',
      emailVerified: true,
    },
  ];

  for (const user of users) {
    const passwordHash = await User.hashPassword(user.password);
    const { password, ...payload } = user;

    await User.findOneAndUpdate(
      { email: user.email },
      { ...payload, passwordHash },
      { upsert: true, runValidators: true, new: true }
    );
  }

  console.log('Requested users upserted.');
  process.exit(0);
}

upsertUsers().catch((error) => {
  console.error(error);
  process.exit(1);
});
