"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multerConfig_1 = __importDefault(require("../../config/multerConfig"));
const user_schema_1 = require("./user.schema");
const Validation_1 = __importDefault(require("../../middlewares/Validation"));
const user_controller_1 = __importDefault(require("./user.controller"));
const Authorization_1 = __importDefault(require("../../middlewares/Authorization"));
const routes = (0, express_1.Router)();
const validation = new Validation_1.default();
const authorization = new Authorization_1.default();
const userController = new user_controller_1.default();
routes.post("/users", authorization.ensureIsAuthenticated, validation.validate(user_schema_1.createUserSchema), (req, res) => userController.store(req, res));
routes.get("/users", authorization.ensureIsAuthenticated, (req, res) => userController.index(req, res));
routes.get("/users/:id", authorization.ensureIsAuthenticated, (req, res) => userController.findOne(req, res));
routes.patch("/users/:id/avatar", authorization.ensureIsAuthenticated, (0, multer_1.default)(multerConfig_1.default).single("avatar"), (req, res) => userController.updateAvatar(req, res));
routes.patch("/users/:id/remove-avatar", authorization.ensureIsAuthenticated, (req, res) => userController.removeAvatar(req, res));
routes.put("/users/:id", authorization.ensureIsAuthenticated, validation.validate(user_schema_1.updateUserSchema), (req, res) => userController.update(req, res));
routes.delete("/users/:id", authorization.ensureIsAuthenticated, (req, res) => userController.destroy(req, res));
exports.default = routes;
//# sourceMappingURL=user.routes.js.map