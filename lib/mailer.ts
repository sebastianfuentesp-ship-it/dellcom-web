import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "mail.dellcom-sac.com";
const port = parseInt(process.env.SMTP_PORT || "465", 10);
const user = process.env.SMTP_USER || "ventas@dellcom-sac.com";
const pass = process.env.SMTP_PASS || "";

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // true para 465, false para otros puertos como 587
  auth: {
    user,
    pass,
  },
  tls: {
    // No fallar en certificados autofirmados que a veces tienen los hostings locales
    rejectUnauthorized: false
  }
});

export const FROM = `DELLCOM SAC <${user}>`;

