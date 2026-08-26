import 'dotenv/config';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { startKeepAlive } from './services/keepAlive.js';

const port = Number(process.env.PORT || 5000);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`TechStore Pro API running on http://localhost:${port}`);
      startKeepAlive();
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
