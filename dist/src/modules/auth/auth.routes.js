"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_schema_1 = require("./auth.schema");
const Validation_1 = __importDefault(require("../../middlewares/Validation"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const routes = (0, express_1.Router)();
const validation = new Validation_1.default();
const authController = new auth_controller_1.default();
routes.post("/auth/login", validation.validate(auth_schema_1.loginSchema), (req, res) => authController.login(req, res));
routes.post("/auth/forgot", validation.validate(auth_schema_1.forgotSchema), (req, res) => authController.forgot(req, res));
routes.post("/auth/reset", validation.validate(auth_schema_1.resetPasswordSchema), (req, res) => authController.reset(req, res));
routes.get("/auth/jwt/:token", (req, res) => authController.getUserByToken(req, res));
exports.default = routes;
//# sourceMappingURL=auth.routes.js.map