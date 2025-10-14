import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendConfirmationEmail = async (to, order) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `Order Confirmation #${order._id}`,
      html: `<h2>Thank you for your order!</h2>
             <p>Your order #${order._id} has been successfully paid.</p>
             <p>Total Amount: ${order.totalAmount}</p>`,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
};

export { sendConfirmationEmail };
