// console.log("Script para generar el esquema de la base de datos");
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { generateSchema } from './funcs/generate-schema';

const main = async () => {
  const schema = await generateSchema({ usersTest: process.argv.includes('users') }); 
  if (!existsSync('temp')) {
    mkdirSync('temp');
  }
  
  if (existsSync('temp/schema.sql')) {
    rmSync('temp/schema.sql', { force: true });
  }
  writeFileSync('temp/schema.sql', schema, 'utf-8');
};

main()
.then(() => {
  console.log('Database schema generated successfully in temp/schema.sql');
});
