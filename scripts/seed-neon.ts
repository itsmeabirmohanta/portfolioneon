import dotenv from "dotenv";
import { seedPortfolioTables } from "../server/db";
import { getNeonSqlClient } from "../server/neon";

dotenv.config();

const run = async () => {
  const sql = getNeonSqlClient();
  await seedPortfolioTables(sql);
  console.log("Neon seed completed successfully.");
};

run().catch((error) => {
  console.error("Neon seed failed.", error);
  process.exit(1);
});
