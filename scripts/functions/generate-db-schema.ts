import { readFileSync } from 'node:fs';
import https from 'node:https';

export const generateDbSchema = async () => {
  let schema = readFileSync('database/schema.sql', 'utf-8').toString();

  // Cargar los países desde un archivo externo si es necesario
  const urlCountries = 'https://gist.githubusercontent.com/brenes/1095110/raw/c8f208b03485ba28f97c500ab7271e8bce43b9c6/paises.csv';
  const countries: [string, string, string, string, string, string][] = await extractData(urlCountries);

  // Registra los países en el esquema
  
  schema += `\n\n-- Fuente: ${urlCountries}\n`;
  countries.forEach((row) => {
    schema += `INSERT INTO geo_countries ("code", "name", "phone_code") VALUES ('${row[3]}', '${row[0]}', '${row[5]}');\n`;
  });

  // Realiza las modificaciones necesarias en el esquema
  const urlDepartments = 'https://raw.githubusercontent.com/heilernova/colombia-data/refs/heads/main/geo/departments.csv';
  const departments: [string, string, string][] = (await extractData(urlDepartments)).map(x => [crypto.randomUUID() as string, ...x]) as [string, string, string][];
  
  const urlCities = 'https://raw.githubusercontent.com/heilernova/colombia-data/refs/heads/main/geo/municipalities.csv';
  const cities: [string, string][] = await extractData(urlCities);

  schema += '\n\n-- Departamentos\n';
  schema += `\n\n-- Fuente: ${urlDepartments}\n`;
  departments.forEach((row) => {
    schema += `INSERT INTO geo_states ("id", "code", "name", "country_code") VALUES ('${row[0]}', '${row[1]}', '${row[2]}', 'CO');\n`;
    cities.filter(c => {
      return c[0].startsWith(row[1]);
    }).map(item => {
      schema += `INSERT INTO geo_cities ("code", "state_id", "name") VALUES ('${item[0]}', '${row[0]}', '${item[1]}');\n`;
    });
  });

  return schema;
}

const parseCSVLine = <T>(line: string): T[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result as unknown as T[];
}

const extractData = <T = string[]>(urlCodes: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    https.get(urlCodes, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const lines = data.trim().split('\n');
        lines.splice(0, 1); // Eliminar la primera línea (encabezados)
        const result = lines.map(x => parseCSVLine<T>(x));
        resolve(result as any);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}