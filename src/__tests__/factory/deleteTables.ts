import { Connection } from 'typeorm';

async function deleteTables(connection: Connection) {
  await connection.query('DELETE FROM addresses');
  await connection.query('DELETE FROM customers');
  await connection.query('DELETE FROM products');
  await connection.query('DELETE FROM categories');
}

export default deleteTables;
