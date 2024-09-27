export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  storage: {
    url: process.env.STORAGE_URL,
    bucket: process.env.BUCKET,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
  },
  bull: {
    host: process.env.QUEUE_HOST,
    port: parseInt(process.env.QUEUE_PORT, 10) || 6379,
    username: process.env.QUEUE_USER,
    password: process.env.QUEUE_PASSWORD,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
});
