// backend/utils/sendEmail.js

const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise}
 */
const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

/**
 * Send order confirmation email
 * @param {Object} order - Order object
 * @returns {Promise}
 */
const sendOrderConfirmation = async (order) => {
  const subject = `Confirmation de commande #${order.orderNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-details { background-color: #fff; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pavone Collection</h1>
        </div>
        <div class="content">
          <h2>Merci pour votre commande !</h2>
          <p>Bonjour ${order.customer.firstName},</p>
          <p>Nous avons bien reçu votre commande et nous la préparons avec soin.</p>
          
          <div class="order-details">
            <h3>Détails de la commande</h3>
            <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('fr-TN')}</p>
            
            <table>
              <thead>
                <tr>
                  <td><strong>Produit</strong></td>
                  <td><strong>Quantité</strong></td>
                  <td><strong>Prix</strong></td>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name} (${item.size}, ${item.color})</td>
                    <td>${item.quantity}</td>
                    <td>${item.subtotal} TND</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <table style="margin-top: 20px;">
              <tr>
                <td>Sous-total:</td>
                <td style="text-align: right;">${order.subtotal} TND</td>
              </tr>
              <tr>
                <td>Livraison:</td>
                <td style="text-align: right;">${order.shippingCost} TND</td>
              </tr>
              <tr class="total">
                <td>Total:</td>
                <td style="text-align: right;">${order.total} TND</td>
              </tr>
            </table>
            
            <h3 style="margin-top: 20px;">Adresse de livraison</h3>
            <p>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <p>Vous pouvez suivre votre commande en utilisant le numéro: <strong>${order.orderNumber}</strong></p>
          <p>Nous vous informerons dès que votre commande sera expédiée.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Pavone Collection. Tous droits réservés.</p>
          <p>Pour toute question, contactez-nous à contact@elegance.tn</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: order.customer.email,
    subject,
    html,
  });
};

/**
 * Send contact form auto-reply
 * @param {Object} contact - Contact object
 * @returns {Promise}
 */
const sendContactAutoReply = async (contact) => {
  const subject = 'Nous avons reçu votre message';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Pavone Collection</h1>
        </div>
        <div class="content">
          <h2>Merci de nous avoir contactés !</h2>
          <p>Bonjour ${contact.name},</p>
          <p>Nous avons bien reçu votre message et nous vous remercions de l'intérêt que vous portez à Pavone Collection.</p>
          <p>Notre équipe prendra connaissance de votre demande et vous répondra dans les plus brefs délais (généralement sous 24-48 heures).</p>
          <p><strong>Votre message:</strong></p>
          <p style="background-color: #fff; padding: 15px; border-left: 3px solid #000;">
            ${contact.message}
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Pavone Collection. Tous droits réservés.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: contact.email,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendContactAutoReply,
};
