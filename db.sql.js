const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.SQL_URL,
});

async function saveOrderToSQL(order) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { merchantId, customerName, total, items } = order;

    const result = await client.query(
      `INSERT INTO orders (merchant_id, customer_name, total) VALUES ($1, $2, $3) RETURNING id`,
      [merchantId, customerName, total]
    );
    const orderId = result.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, item_name, quantity) VALUES ($1, $2, $3)`,
        [orderId, item.name, item.qty]
      );
    }

    await client.query('COMMIT');
    return orderId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { saveOrderToSQL };