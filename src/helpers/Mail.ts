import { createTransport } from "nodemailer";
import mailConfig from "../config/mailConfig";

class Mail {
  sendEmail(params = { to: "", subject: "", message: "" }) {
    if (params.to === "" || params.subject === "" || params.message === "")
      throw new Error("Invalid mailer parameters.");

    const mailOptions = {
      from: mailConfig.user,
      to: params.to,
      subject: params.subject,
      html: params.message,
    };

    const transporter = createTransport({
      host: mailConfig.host,
      port: Number(mailConfig.port),
      secure: true,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.sendMail(mailOptions, (e, info) => {
      if (e) console.log(e);
      else console.log(`E-mail sent: ${info.response}`);
    });
  }
}

export default Mail;
