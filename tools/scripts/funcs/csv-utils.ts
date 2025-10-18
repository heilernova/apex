const parseCSVLine = <T>(line: string): T[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  line = line.trim();
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

export const extractData = <T = string[]>(csv: string): T[] => {
  const lines = csv.trim().split('\n');
  const header = lines[0].trim().split(',').map(x => x.trim()); //.map(h => h.replace(/^"|"$/g, ''));
  const list: unknown[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine<T>(lines[i]);
    const entry = Object.fromEntries(header.map((h, idx) => [h, row[idx]]));
    list.push(entry);
  }

  return list as T[];
}

// const extractData = <T = string[]>(urlCodes: string): Promise<T[]> => {
//   return new Promise((resolve, reject) => {
//     https.get(urlCodes, (res) => {
//       let data = '';
//       res.on('data', (chunk) => {
//         data += chunk;
//       });
//       res.on('end', () => {
//         const lines = data.trim().split('\n');
//         lines.splice(0, 1); // Eliminar la primera línea (encabezados)
//         const result = lines.map(x => parseCSVLine<T>(x));
//         resolve(result as any);
//       });
//     }).on('error', (err) => {
//       reject(err);
//     });
//   });
// }