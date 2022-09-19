"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const authConfig = {
    secret: process.env.SECRET_KEY,
    expiresIn: "7d",
};
exports.default = authConfig;
//# sourceMappingURL=authConfig.js.map