"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mailConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
};
exports.default = mailConfig;
//# sourceMappingURL=mailConfig.js.map