import { readFileSync } from 'node:fs';
import https from 'node:https';

export const generateDbSchema = async (options?: { includeData?: boolean }) => {
  let schema = readFileSync('database/schema.sql', 'utf-8').toString();

  // Cargar los países desde un archivo externo si es necesario
  const urlCountries = 'https://gist.githubusercontent.com/brenes/1095110/raw/c8f208b03485ba28f97c500ab7271e8bce43b9c6/paises.csv';
  const countries = (await extractData(urlCountries)).map(x => {
    return {
      code: x[3],
      name: x[0],
      phone_code: x[5]
    }
  });

  // // Registra los países en el esquema
  
  schema += `\n\n-- Fuente: ${urlCountries}\n`;
  countries.forEach((row) => {
    schema += `INSERT INTO geo_countries ("code", "name", "phone_code") VALUES ('${row.code}', '${row.name}', '${row.phone_code}');\n`;
  });

  // División administrativa de Colombia (departamentos y municipios)
  const co = countries.find(c => c.code === 'CO');
  if (co) {
    const idDepartmentType = crypto.randomUUID();
    const idMunicipalityType = crypto.randomUUID();

    schema += `\n\n-- División administrativa de Colombia (departamentos y municipios)\n`;
    schema += `insert into geo_administrative_levels ("id", "country_code", "name", "name_plural", "level") values ('${idDepartmentType}', '${co.code}', 'Departamento', 'Departamentos', '1');\n`;
    schema += `insert into geo_administrative_levels ("id", "country_code", "name", "name_plural", "level") values ('${idMunicipalityType}', '${co.code}', 'Municipio', 'Municipios', '2');\n`;

    const urlDepartments = 'https://raw.githubusercontent.com/heilernova/colombia-data/refs/heads/main/geo/departments.csv';
    const departments = (await extractData(urlDepartments)).map(x => {
      return {
        id: crypto.randomUUID(),
        "level_id": idDepartmentType,
        code: x[0],
        name: x[1]
      }
    });
  
    departments.forEach((row) => {
      schema += `INSERT INTO geo_administrative_divisions ("id", "country_code", "level_id", "code", "name") values ('${row.id}', '${co.code}', '${row.level_id}', '${row.code}', '${row.name}');\n`;
    }); 

    const urlCities = 'https://raw.githubusercontent.com/heilernova/colombia-data/refs/heads/main/geo/municipalities.csv';
    const cities = (await extractData(urlCities)).map(x => {
      return {
        code: x[0],
        name: x[1],
        parentId: departments.find(d => d.code === x[0].substring(0, 2))?.id || null,
        is_capital: x[0].endsWith('01') ? 'TRUE' : 'FALSE' // Suponiendo que los municipios que terminan en '01' son capitales
      }
    });

    cities.forEach((row) => {
      if (row.parentId) {
        schema += `INSERT INTO geo_administrative_divisions ("id", "country_code", "level_id", "parent_id", "code", "name", "is_capital") values ('${crypto.randomUUID()}', '${co.code}', '${idMunicipalityType}', '${row.parentId}', '${row.code}', '${row.name}', ${row.is_capital});\n`;
      } 
    });
  }
  if (options?.includeData) {
    // Cargar los datos iniciales desde un archivo externo si es necesario
    schema += `\n\n-- Datos iniciales\n`;
    schema += '';
  }

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