import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import { join } from 'node:path';
import { hash } from 'argon2';
import { extractData } from './csv-utils';
import { sqlInsert } from './parse-sql';


interface UserTest {
  first_name: string;
  last_name: string;
  alias: string;
  gender: string;
  birthdate: string;
  height: number;
  weight: number;
  nationality: string;
  category: string;
  username: string;
  email: string;
  password_hash: string;
  [key: string]: string | number | boolean | object | null;
}

const getCountries = async () => {
  const path = join('temp', 'countries.csv');
  const urlCountries = 'https://gist.githubusercontent.com/brenes/1095110/raw/c8f208b03485ba28f97c500ab7271e8bce43b9c6/paises.csv';
  let data = '';
  if (!existsSync(path)) {
    data = await fetchData(urlCountries);
    writeFileSync(path, data, 'utf-8');
  }
  data = readFileSync(path, 'utf-8');
  const list = extractData<{ nombre: string; iso2: string; phone_code: string }>(data);
  return list
}

const getDepartmentsOfColombia = async () => {
  const path = join('temp', 'colombia-departments.csv');
  const urlDepartments = 'https://raw.githubusercontent.com/heilernova/colombia-data/refs/heads/main/geo/departments.csv';
  let data = '';
  if (!existsSync(path)) {
    data = await fetchData(urlDepartments);
    writeFileSync(path, data, 'utf-8');
  } else {
    data = readFileSync(path, 'utf-8');
  }
  const list = extractData<{ name: string; code: string }>(data);
  return list;
}

const getCitiesOfColombia = async () => {
  const path = join('temp', 'colombia-cities.csv');
  const urlCities = 'https://raw.githubusercontent.com/heilernova/colombia-data/refs/heads/main/geo/municipalities.csv';
  let data = '';
  if (!existsSync(path)) {
    data = await fetchData(urlCities);
    writeFileSync(path, data, 'utf-8');
  } else {
    data = readFileSync(path, 'utf-8');
  }
  const list = extractData<{ name: string; code: string; }>(data);
  return list;
}

export const generateSchema = async (options?: { usersTest?: boolean }) => {
  let schema = readFileSync("database/schema.sql", "utf-8").toString();

  const countries = await getCountries();
  for (const country of countries)  {
  // countries.forEach(country => {
    schema += sqlInsert('geo_countries', {
      code: country.iso2,
      name: country.nombre,
      phone_code: country.phone_code
    });
  }

  // Divisiones administrativas de Colombia
  const idDepartmentType = crypto.randomUUID();
  const idMunicipalityType = crypto.randomUUID();
  schema += `\n\n-- División administrativa de Colombia (departamentos y municipios)\n`;
  schema += `insert into geo_administrative_levels ("id", "country_code", "name", "name_plural", "level") values ('${idDepartmentType}', 'CO', 'Departamento', 'Departamentos', '1');\n`;
  schema += `insert into geo_administrative_levels ("id", "country_code", "name", "name_plural", "level") values ('${idMunicipalityType}', 'CO', 'Municipio', 'Municipios', '2');\n`;

  // Agregar departamentos de Colombia
  const departments = (await getDepartmentsOfColombia()).map(dep => {
    const val = {
      id: crypto.randomUUID(),
      country_code: 'CO',
      name: dep.name,
      code: dep.code,
      level_id: idDepartmentType
    };

    schema += sqlInsert('geo_administrative_divisions', val);

    return val;
  });

  schema += `\n-- Municipios de Colombia\n`;
  const cities = (await getCitiesOfColombia()).map(city => {
    const department = departments.find(dep => city.code.startsWith(dep.code));
    const val: { [key: string]: string | number | boolean | object | null; } = {
      id: crypto.randomUUID(),
      name: city.name,
      code: city.code,
      parent_id: department?.id || null, 
      is_city: true,
      is_capital: city.code.endsWith('001'),
      country_code: 'CO',
      level_id: idMunicipalityType
    };
    schema += sqlInsert('geo_administrative_divisions', val);
    return val;
  });

  if (options?.usersTest) {
    // Lógica para procesar el esquema
    schema += '\n\n-- Usuarios de prueba\n';
    const csv = readFileSync("database/test-users.csv", "utf-8").toString();
    const list = extractData<UserTest>(csv);
    const cityId = cities.find(c => c['code'] === '95001')?.['id'] ?? null; // Bogotá D.C.
    for (const item of list) {
      item.password_hash = await hash(item.password_hash);
      schema += sqlInsert('users', { ...item, location_id: cityId });
    } 
  }

  return schema
}

const fetchData = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`Fetching data from ${url}`);
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {

        resolve(data)
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}