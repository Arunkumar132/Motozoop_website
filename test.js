const nodemailer = require("nodemailer");
const path = require("path");

// Main test function
async function testOrderEmail() {
  // 1. Create Ethereal test account
  const testAccount = await nodemailer.createTestAccount();

  // 2. Create transporter using Ethereal
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // 3. Test order details
  const orderDetails = {
    id: "TEST123",
    total: 2499.99,
    items: [
      { name: "Motorcycle Helmet", quantity: 1, price: 1499.99 },
      { name: "Riding Gloves", quantity: 2, price: 500.0 },
    ],
  };

  // 4. Generate items table HTML
  const itemsHtml = orderDetails.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${item.name}</td>
        <td style="text-align: center; padding: 8px; border-bottom: 1px solid #f3f4f6;">${item.quantity}</td>
        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #f3f4f6;">₹${item.price.toFixed(2)}</td>
        <td style="text-align: right; padding: 8px; border-bottom: 1px solid #f3f4f6;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  // 5. Mail options
  const mailOptions = {
    from: '"MOTOZOOP" <no-reply@motozoop.com>',
    to: "customer@example.com",
    subject: `MOTOZOOP Order Confirmation - #${orderDetails.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
        
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:companylogo" alt="MOTOZOOP Logo" style="max-width: 100%; width: 150px; display: inline-block;" />
        </div>

        <h2 style="text-align: center; color: #111827;">Thank you for your order!</h2>
        <p style="text-align: center; color: #6b7280;">We’re excited to get your items to you. Below are your order details.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />

        <h3 style="color: #111827;">Order Summary</h3>
        <p><strong>Order ID:</strong> ${orderDetails.id}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e0e0e0;">Item</th>
              <th style="text-align: center; padding: 8px; border-bottom: 1px solid #e0e0e0;">Qty</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e0e0e0;">Price</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e0e0e0;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p style="text-align: right; margin-top: 20px; font-size: 16px;">
          <strong>Total:</strong> ₹${orderDetails.total.toFixed(2)}
        </p>

        <div style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          <p>Your order is being processed and will be shipped shortly. Contact <a href="mailto:2025.motozoop@gmail.com">2025.motozoop@gmail.com</a> for questions.</p>
          <p>We appreciate your business and hope to serve you again soon!</p>
        </div>

        <p style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          &copy; ${new Date().getFullYear()} MOTOZOOP. All rights reserved.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "public/Untitled_design-removebg-preview.png"), // make sure logo exists
        cid: "companylogo",
      },
    ],
  };

  // 6. Send email
  const info = await transporter.sendMail(mailOptions);
  console.log("Test email sent!");
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}

// Run the test
testOrderEmail();
