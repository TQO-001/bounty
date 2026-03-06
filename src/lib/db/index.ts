import postgres from 'postgres';

if (typeof window !== 'undefined') {
  throw new Error('Database client cannot be used in the browser');
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL environment variable is not set');

declare global { var __db: ReturnType<typeof postgres> | undefined; }

let sql: ReturnType<typeof postgres>;

if (process.env.NODE_ENV === 'production') {
  sql = postgres(connectionString, { max: 10, idle_timeout: 30, connect_timeout: 10 });
} else {
  if (!global.__db) {
    global.__db = postgres(connectionString, { max: 5, idle_timeout: 30 });
  }
  sql = global.__db;
}

export default sql;
