export const sqlInsert = (table: string, object: { [key: string]: string | number | object | null | boolean }) => {
  const keys = Object.keys(object)
  const values = Object.values(object);
  return `INSERT INTO ${table} ("${keys.join('", "')}") VALUES (${values.map(x => parseObjectValue(x)).join(', ')});\n`;
}

const parseObjectValue = (value: unknown) => {
  const type = typeof value;
  if (Array.isArray(value)) {
    // Lógica
    const typeFirst = typeof value[0];
    if (value.length === 0) {
      return 'DEFAULT';
    }
    if (typeFirst === 'string') {
      return `array[${value.map(x => `'${x}'`).join(',')}]::text[]`;
    }
    if (typeFirst === 'object') {
      return `array[${value.map(x => `'${JSON.stringify(x)}'`).join(',')}]::jsonb[]`;
    }
    return 'DEFAULT';
  } else {
    switch (type) {
      case 'string':
        return `'${value}'`;
      case 'number':
        return value;
      case 'boolean':
        return value ? 'TRUE' : 'FALSE';
      case 'object':
        if (value === null) {
          return 'NULL';
        }
        return `'${JSON.stringify(value)}'::jsonb`;
      default:
        return 'DEFAULT';
    }
  }
  return 'DEFAULT';
}
