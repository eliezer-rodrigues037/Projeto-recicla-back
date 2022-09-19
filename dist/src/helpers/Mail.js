"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const mailConfig_1 = __importDefault(require("../config/mailConfig"));
class Mail {
    sendEmail(params = { to: "", subject: "", message: "" }) {
        if (params.to === "" || params.subject === "" || params.message === "")
            throw new Error("Invalid mailer parameters.");
        const mailOptions = {
            from: mailConfig_1.default.user,
            to: params.to,
            subject: params.subject,
            html: params.message,
        };
        const transporter = (0, nodemailer_1.createTransport)({
            host: mailConfig_1.default.host,
            port: Number(mailConfig_1.default.port),
            secure: true,
            auth: {
                user: mailConfig_1.default.user,
                pass: mailConfig_1.default.password,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        transporter.sendMail(mailOptions, (e, info) => {
            if (e)
                console.log(e);
            else
                console.log(`E-mail sent: ${info.response}`);
        });
    }
}
exports.default = Mail;
//# sourceMappingURL=Mail.js.map