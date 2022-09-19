"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const authConfig_1 = __importDefault(require("../config/authConfig"));
const generateToken = (params = {}) => (0, jsonwebtoken_1.sign)(params, String(authConfig_1.default.secret), {
    expiresIn: "1d",
    algorithm: "HS512",
});
exports.default = generateToken;
//# sourceMappingURL=generateToken.js.map