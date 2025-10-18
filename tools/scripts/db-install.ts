import { Pool } from 'pg';
import { generateSchema } from './funcs/generate-schema';

const main = async () => {
  process.loadEnvFile('.env')
  const pool = new Pool();
  const schema = await generateSchema({ usersTest: true }); 
  await pool.query(schema);
  pool.end();
};

main()
.then(() => {
  console.log('Base de datos instalada correctamente');
})
.catch((error) => {
  console.error('Error al instalar la base de datos:', error.message);
});