import { User } from "@prisma/client";

export type UserRows = {
  count: number;
  rows: User[];
  pageSize: number;
  page: number;
};
