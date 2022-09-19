import { Request, Response } from "express";
import UserService from "./user.service";
import generateToken from "../../helpers/generateToken";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const emailExists = await this.userService.findByEmail(data.email);
      const usernameExists = await this.userService.findByUserName(
        data.username
      );

      if (emailExists)
        return res.status(403).json({ message: "E-mail já cadastrado." });

      if (usernameExists)
        return res
          .status(403)
          .json({ message: "Nome de usuário já cadastrado." });

      const user = await this.userService.store(data);

      return res.status(201).json({
        message: "Usuário adicionado.",
        user,
        token: generateToken({ id: user?.id }),
      });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "Erro ao adicionar usuário." });
    }
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { page, pageSize, q } = req.query;

      let users;

      if (page && pageSize) {
        users = await this.userService.findAndCountAll(
          +page,
          +pageSize,
          String(q)
        );
      }

      return res.status(200).json(users);
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "Erro ao receber usuários." });
    }
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const user = await this.userService.findByPk(id);

      if (user === null) return res.status(204).json();

      return res.status(200).json(user);
    } catch (e) {
      console.log(e);

      return res
        .status(500)
        .json({ message: "Erro ao receber dados do usuário." });
    }
  }

  async updateAvatar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const avatar = req.file?.path;

      let user;

      user = await this.userService.findByPk(id);

      if (user === null) return res.status(204).json();

      if (avatar) user = await this.userService.updateAvatar(id, avatar);

      return res.status(200).json({
        message: "Avatar atualizado.",
        user,
      });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "Erro ao atualizar avatar." });
    }
  }

  async removeAvatar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      let user;

      user = await this.userService.findByPk(id);

      if (user === null) return res.status(204).json();

      await this.userService.removeAvatar(id);

      user = await this.userService.findByPk(id);

      return res.status(200).json({ message: "Avatar removido.", user });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "Erro ao remover avatar." });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;

      let user;

      user = await this.userService.findByPk(id);

      if (user === null) return res.status(204).json();

      if (data.email) {
        const emailChanged = data.email && user?.email !== data.email;
        const emailExists = await this.userService.findByEmail(data.email);

        if (emailChanged && emailExists)
          return res.status(403).json({ message: "E-mail já cadastrado." });
      }

      if (data.username) {
        const userNameChanged =
          data.username && user?.username !== data.username;
        const userNameExists = await this.userService.findByUserName(
          data.username
        );

        if (userNameChanged && userNameExists)
          return res
            .status(403)
            .json({ message: "Nome de usuário já cadastrado." });
      }

      await this.userService.update(id, data);

      user = await this.userService.findByPk(id);

      return res.status(200).json({
        message: "Usuário atualizado.",
        user,
      });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
  }

  async destroy(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const user = await this.userService.findByPk(id);

      if (user === null) return res.status(204).json();

      await this.userService.destroy(id);

      return res.status(200).json({ message: "Usuário removido." });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "Erro ao remover usuário." });
    }
  }
}

export default UserController;
