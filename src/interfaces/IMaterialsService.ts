/* eslint-disable no-unused-vars */
import { Material } from "@prisma/client";
import { MaterialsRows } from "../types/MaterialsRows";

export interface IMaterialsService {
  store(
    data: Pick<Material, "name" | "price" | "status">
  ): Promise<Material | null>;
  fidnAndCountAll(
    page: number,
    pageSize: number,
    query: string
  ): Promise<MaterialsRows>;
  findByName(name: Material["name"]): Promise<Material | null>;
  findByPk(id: Material["id"]): Promise<Material | null>;
  update(id: string, data: Material): Promise<Material | null>;
  destroy(id: string): Promise<void>;
}
