"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const generateToken_1 = __importDefault(require("../../helpers/generateToken"));
const Mail_1 = __importDefault(require("../../helpers/Mail"));
const user_service_1 = __importDefault(require("../user/user.service"));
class AuthController {
    userService;
    constructor() {
        this.userService = new user_service_1.default();
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.findByEmail(email);
            if (user) {
                if (!(await bcrypt_1.default.compare(password, user.password)))
                    return res.status(400).json({ message: "Credenciais inválidas." });
                const newUser = {
                    id: user.id,
                    email: user.email,
                };
                return res.status(200).json({
                    message: "Login realizado.",
                    user,
                    token: (0, generateToken_1.default)(newUser),
                });
            }
            return res.status(200).json({ user });
        }
        catch (e) {
            console.log(e);
            return res
                .status(500)
                .json({ message: "Erro ao realizar login na aplicação." });
        }
    }
    async getUserByToken(req, res) {
        try {
            const { token } = req.params;
            const userInfo = jsonwebtoken_1.default.decode(token);
            const user = await this.userService.findByPk(userInfo.id);
            return res.status(200).json({ token, user });
        }
        catch (e) {
            console.log(e);
            return res
                .status(500)
                .json({ message: "Erro ao receber dados do usuário." });
        }
    }
    async forgot(req, res) {
        try {
            const { email } = req.body;
            const user = await this.userService.findByEmail(email);
            const mailer = new Mail_1.default();
            if (user) {
                const recoverPasswordCode = crypto_1.default
                    .randomBytes(4)
                    .toString("hex")
                    .toUpperCase();
                const now = new Date();
                now.setHours(now.getHours() + 1); // code expires in 1 hour
                await this.userService.updateForgottenPassword(user.id, {
                    password_reset_token: recoverPasswordCode,
                    password_reset_expires: now,
                });
                mailer.sendEmail({
                    to: email,
                    subject: "Recuperação de senha",
                    message: `Olá, ${user.name}. Entre com o código de recuperação: ${recoverPasswordCode} para cadastrar uma nova senha.`,
                });
                return res.status(200).json({ message: "Token enviado com sucesso." });
            }
            return res.status(204).json({ message: "Usuário não encontrado." });
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                message: "Erro ao enviar token de recuperação para o usuário.",
            });
        }
    }
    async reset(req, res) {
        try {
            const { email, token, password } = req.body;
            const user = await this.userService.findByEmail(email);
            if (token !== user?.password_reset_token)
                return res.status(400).json({ message: "Token inválido." });
            const now = new Date();
            if (user?.id && user?.password_reset_expires) {
                if (now > user.password_reset_expires)
                    return res
                        .status(400)
                        .json({ message: "Token expirado. Gere um novo" });
                await this.userService.update(user?.id, {
                    ...user,
                    password,
                });
            }
            return res
                .status(200)
                .json({ message: "Nova senha cadastrada com sucesso." });
        }
        catch (e) {
            console.log(e);
            return res
                .status(500)
                .json({ message: "Erro ao enviar a nova senha para o usuário." });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map