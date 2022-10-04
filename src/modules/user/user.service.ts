import { Banc, User } from "@prisma/client";
/* eslint-disable prefer-destructuring */
import bcrypt from "bcrypt";
import { platform } from "process";
import { unlink } from "fs";
import { UserRows } from "../../types/UserRows";
import { IUserService } from "../../interfaces/IUserService";
import prismaClient from "../../database/index";

const updateImage = async (avatar: string, id: string) => {
  let newAvatar = avatar;

  if (platform === "win32") newAvatar = avatar.split("\\")[3];
  else if (platform === "linux") newAvatar = avatar.split("/")[3];

  const newData = {
    avatar: `${process.env.APP_URL}/avatars/${newAvatar}`,
  };

  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: newData,
  });

  return updatedUser;
};

class UserService implements IUserService {
  async store(
    data: Pick<
      User,
      "email" | "name" | "cpf" | "password" | "cel" | "birthDate"
    >,
    bancData: Banc
  ): Promise<{ user: User; banc: Banc }> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(data.password, salt);
    const birthDate = new Date(data.birthDate);

    const user = await prismaClient.user.create({
      data: {
        ...data,
        password: hashedPassword,
        birthDate,
      },
    });

    const banc = await prismaClient.banc.create({
      data: {
        ...bancData,
        userId: user.id,
      },
    });

    return { user, banc };
  }

  async findAndCountAll(
    page: number,
    pageSize: number,
    q: string
  ): Promise<UserRows> {
    const totalUsers = await prismaClient.user.count({
      where: {
        role: {
          equals: "User",
        },
        OR: [
          {
            name: {
              contains: q,
            },
          },
          {
            email: {
              contains: q,
            },
          },
        ],
      },
    });

    const users = await prismaClient.user.findMany({
      where: {
        role: {
          equals: "User",
        },
        OR: [
          {
            name: {
              contains: q,
            },
          },
          {
            email: {
              contains: q,
            },
          },
        ],
      },
      take: +pageSize || 5,
      skip: +pageSize ? page * pageSize : 0,
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      count: totalUsers,
      rows: users,
      pageSize: +pageSize || 5,
      page: +page || 0,
    };
  }

  async findByPk(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    return user;
  }

  async updateAvatar(id: string, avatar: User["avatar"]): Promise<User | null> {
    const user = await this.findByPk(id);

    const oldAvatarPath = user?.avatar?.split("/avatars/")[1];

    unlink(`./src/tmp/avatars/${oldAvatarPath}`, (e) => {
      if (e) console.log(e);
    });

    const updatedUser = updateImage(String(avatar), id);

    return updatedUser;
  }

  async removeAvatar(id: string): Promise<User | null> {
    const user = await this.findByPk(id);

    const oldAvatarPath = user?.avatar?.split("/avatars/")[1];

    unlink(`./src/tmp/avatars/${oldAvatarPath}`, (e) => {
      if (e) console.log(e);
    });

    await prismaClient.user.update({
      where: { id },
      data: {
        avatar: null,
      },
    });

    return user;
  }

  async updateForgottenPassword(
    id: string,
    data: Pick<User, "password_reset_token" & "password_reset_expires">
  ): Promise<User | null> {
    const user = await this.findByPk(id);

    await prismaClient.user.update({ where: { id }, data });

    return user;
  }

  async update(id: string, data: User): Promise<User | null> {
    const user = await this.findByPk(id);

    if (data.password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(data.password, salt);

      await prismaClient.user.update({
        where: { id },
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return user;
    }

    await prismaClient.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return user;
  }

  async destroy(id: string): Promise<void> {
    const user = await this.findByPk(id);

    if (user) {
      await this.removeAvatar(user.id);
      await prismaClient.user.delete({ where: { id } });
    }
  }
}

export default UserService;
