import nodemailer from "nodemailer";
import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USERNAME } from "../Utils/constant/constant";

export const mailTransporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
});
