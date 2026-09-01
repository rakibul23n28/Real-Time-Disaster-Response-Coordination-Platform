import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "5000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",

  db: {
    host:     process.env.DB_HOST     ?? "localhost",
    port:     parseInt(process.env.DB_PORT ?? "3306", 10),
    user:     process.env.DB_USER     ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    name:     process.env.DB_NAME     ?? "disaster_response",
  },

  jwt: {
    secret:    required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },

  frontendUrl:  process.env.CLIENT_URL  ?? "http://localhost:8443",
  maxFileSize:  parseInt(process.env.MAX_FILE_SIZE ?? "5242880", 10),
};
