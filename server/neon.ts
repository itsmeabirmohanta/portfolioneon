import { neon } from "@neondatabase/serverless";

export const getNeonSqlClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing. Add it to your environment variables.");
  }

  return neon(connectionString);
};
