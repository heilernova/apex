import { Pool } from 'pg';
import { generateDbSchema } from "./functions/generate-db-schema";

const main = async () => {
  process.loadEnvFile('.env');
  const schema = await generateDbSchema();
  const pool = new Pool();

  await pool.query(schema);
  await pool.end();
}

main()
.then(() => {
  console.log('Database schema created successfully.');
})
.catch((error) => {
  console.error('Error creating database schema:', error);
  process.exit(1);
});