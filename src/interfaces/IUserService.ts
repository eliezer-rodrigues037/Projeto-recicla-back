/* eslint-disable no-unused-vars */
import { User, Banc } from "@prisma/client";
import { UserRows } from "../types/UserRows";

export interface IUserService {
  store(
    data: Pick<
      User,
      "name" | "cpf" | "email" | "cel" | "birthDate" | "password"
    >,
    bancData: Banc
  ): Promise<{ user: User; banc: Banc }>;
  findAndCountAll(page: number, pageSize: number, q: string): Promise<UserRows>;
  findByPk(id: User["id"]): Promise<User | null>;
  findByEmail(email: User["email"]): Promise<User | null>;
  updateAvatar(id: User["id"], avatar: User["avatar"]): Promise<User | null>;
  update(id: string, data: User): Promise<User | null>;
  updateForgottenPassword(
    id: string,
    data: Pick<User, "password_reset_token" & "password_reset_expires">
  ): Promise<User | null>;
  destroy(id: string): Promise<void>;
}
