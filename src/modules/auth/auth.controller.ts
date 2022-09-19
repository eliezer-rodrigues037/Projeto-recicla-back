import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";
import generateToken from "../../helpers/generateToken";
import Mail from "../../helpers/Mail";
import UserService from "../user/user.service";

class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user = await this.userService.findByEmail(email);

      if (user) {
        if (!(await bcrypt.compare(password, user.password)))
          return res.status(400).json({ message: "Credenciais inválidas." });

        const newUser = {
          id: user.id,
          email: user.email,
        };

        return res.status(200).json({
          message: "Login realizado.",
          user,
          token: generateToken(newUser),
        });
      }

      return res.status(200).json({ user });
    } catch (e) {
      console.log(e);

      return res
        .status(500)
        .json({ message: "Erro ao realizar login na aplicação." });
    }
  }

  async getUserByToken(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.params;

      const userInfo = jwt.decode(token) as {
        id: string;
        email: string;
      };

      const user = await this.userService.findByPk(userInfo.id);

      return res.status(200).json({ token, user });
    } catch (e) {
      console.log(e);

      return res
        .status(500)
        .json({ message: "Erro ao receber dados do usuário." });
    }
  }

  async forgot(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      const user = await this.userService.findByEmail(email);
      const mailer = new Mail();

      if (user) {
        const recoverPasswordCode = crypto
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
    } catch (e) {
      console.log(e);

      return res.status(500).json({
        message: "Erro ao enviar token de recuperação para o usuário.",
      });
    }
  }

  async reset(req: Request, res: Response): Promise<Response> {
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
    } catch (e) {
      console.log(e);

      return res
        .status(500)
        .json({ message: "Erro ao enviar a nova senha para o usuário." });
    }
  }
}

export default AuthController;
