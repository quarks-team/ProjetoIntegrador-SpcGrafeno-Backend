export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  storage: {
    url: process.env.STORAGE_URL,
    bucket: process.env.BUCKET,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
});