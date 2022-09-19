import "express";
import { User } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    export interface Request {
      id?: User["id"];
      email?: User["email"];
    }
  }
}
