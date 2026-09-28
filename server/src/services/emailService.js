/**
 * Brevo-ready Email Service
 * Easily dispatches email notifications via Brevo API when BREVO_API_KEY is supplied in environment variables.
 * Falls back to structured console logging during local development when credentials are unset.
 */
class EmailService {
  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
    this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@foodie.com';
    this.senderName = process.env.BREVO_SENDER_NAME || 'Foodie App';
  }

  async sendMail({ to, subject, htmlContent, textContent }) {
    if (!this.apiKey) {
      console.log(`\n--- [Brevo Email Service Mock Dispatch] ---`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body Snippet: ${textContent || (htmlContent ? htmlContent.substring(0, 100) : '')}`);
      console.log(`-------------------------------------------\n`);
      return { success: true, mock: true };
    }

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': this.apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: this.senderName, email: this.senderEmail },
          to: [{ email: to }],
          subject: subject,
          htmlContent: htmlContent || `<p>${textContent}</p>`
        })
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error('[Brevo Email Error]:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    return this.sendMail({
      to: user.email,
      subject: 'Welcome to Foodie!',
      htmlContent: `<h2>Welcome to Foodie, ${user.name}!</h2><p>Explore top rated restaurants and place your first food order today.</p>`
    });
  }

  async sendOrderConfirmationEmail(user, order) {
    return this.sendMail({
      to: user.email,
      subject: `Order #${order.orderId || order._id} Confirmed!`,
      htmlContent: `<h2>Your order has been placed successfully!</h2><p>Total: ₹${order.grandTotal}</p><p>Delivery Status: ${order.orderStatus}</p>`
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    return this.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      htmlContent: `<p>Click the link below to reset your password:</p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}">Reset Password</a>`
    });
  }
}

module.exports = new EmailService();
