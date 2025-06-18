require('dotenv').config();
const express = require('express');
const { saveOrderToSQL } = require('./db.sql');
const { sendWhatsAppOrder } = require('./twilio');

const app = express();
app.use(express.json());

app.post('/order', async (req, res) => {
  try {
    const order = req.body;
    const orderId = await saveOrderToSQL(order);
    const msgId = await sendWhatsAppOrder(order);
    res.status(201).json({ status: 'Order saved and sent', orderId, msgId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing order');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API running on port ${port}`));