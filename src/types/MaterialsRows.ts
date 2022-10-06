import { Materials } from "@prisma/client";

export type MaterialsRows = {
  count: number;
  rows: Materials[];
  pageSize: number;
  page: number;
};
