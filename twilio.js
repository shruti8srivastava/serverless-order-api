const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendWhatsAppOrder(order) {
  const { merchantPhone, customerName, items, total } = order;
  const itemList = items.map(item => `• ${item.name} x${item.qty}`).join('\n');

  const messageBody = `🛒 *New Order Received!*\n\n👤 *Customer*: ${customerName}\n${itemList}\n💰 *Total*: $${total.toFixed(2)}`;

  const message = await client.messages.create({
    from: process.env.TWILIO_PHONE,
    to: `whatsapp:${merchantPhone}`,
    body: messageBody
  });

  return message.sid;
}

module.exports = { sendWhatsAppOrder };