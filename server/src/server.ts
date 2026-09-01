import "dotenv/config";
import app from "./app.js";
import { testConnection } from "./config/database.js";
import { env } from "./config/env.js";

async function start() {
  try {
    await testConnection();
    console.log("✓ MySQL connected");
  } catch (err) {
    console.error("✗ MySQL connection failed:", err);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`✓ Server running on http://localhost:${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
    console.log(`  Health:      http://localhost:${env.port}/api/v1/health`);
  });
}

start();
