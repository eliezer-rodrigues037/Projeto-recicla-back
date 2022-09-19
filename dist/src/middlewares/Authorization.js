"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const consoleColors_1 = __importDefault(require("../helpers/consoleColors"));
const authConfig_1 = __importDefault(require("../config/authConfig"));
class Authorization {
    async ensureIsAuthenticated(req, res, next) {
        try {
            if (process.env.ENVIRONMENT === "dev") {
                const requestAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                const requestAgent = req.headers["user-agent"];
                const requestOrigin = `Request from: ${requestAddress} at ${requestAgent}`;
                console.log(consoleColors_1.default.Magenta, requestOrigin);
            }
            const authToken = req.headers.authorization;
            if (!authToken)
                return res.status(401).json({ message: "Token is missing." });
            const [, token] = authToken.split(" ");
            (0, jsonwebtoken_1.verify)(token, String(authConfig_1.default.secret));
            return next();
        }
        catch (e) {
            console.log(e);
            return res.status(401).json({ message: "Invalid token." });
        }
    }
}
exports.default = Authorization;
//# sourceMappingURL=Authorization.js.map