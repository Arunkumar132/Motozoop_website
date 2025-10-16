import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmation = async (
  customerEmail: string,
  orderDetails: {
    id: string;
    total: number;
    items: { name: string; quantity: number }[];
  }
) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `MOTOZOOP Order Confirmation - #${orderDetails.id}`,
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
        <!-- Responsive Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img 
            src="cid:companylogo" 
            alt="MOTOZOOP Logo" 
            style="max-width: 100%; width: 150px; height: auto; display: inline-block;" 
          />
        </div>

        <p style="text-align: center; color: #6b7280;">Thank you for your order!</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0;" />

        <h3 style="color: #111827;">Order Details</h3>
        <p><strong>Order ID:</strong> ${orderDetails.id}</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e0e0e0;">Item</th>
              <th style="text-align: center; padding: 8px; border-bottom: 1px solid #e0e0e0;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${item.name}</td>
                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #f3f4f6;">${item.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <p style="margin-top: 20px; font-size: 16px;">
          <strong>Total:</strong> ₹${orderDetails.total.toFixed(2)}
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
          We appreciate your business. Your order will be processed and shipped shortly. 
          If you have any questions, feel free to contact us at <a href="mailto:support@motozoop.com">2025.motozoop@gmail.com</a>.
        </p>

        <p style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          &copy; ${new Date().getFullYear()} MOTOZOOP. All rights reserved.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(process.cwd(), "public/Untitled_design-removebg-preview.png"),
        cid: "companylogo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation sent to ${customerEmail}`);
  } catch (error) {
    console.error("Error sending order email:", error);
  }
};
