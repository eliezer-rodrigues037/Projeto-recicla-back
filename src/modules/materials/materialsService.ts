import { Material } from "@prisma/client";
import { MaterialsRows } from "../../types/MaterialsRows";
import prismaClient from "../../database/index";
import { IMaterialsService } from "../../interfaces/IMaterialsService";

class MaterialsService implements IMaterialsService {
  async store(
    data: Pick<Material, "name" | "price" | "status">
  ): Promise<Material | null> {
    const material = await prismaClient.material.create({
      data: {
        ...data,
      },
    });
    return material;
  }

  async fidnAndCountAll(
    page: number,
    pageSize: number,
    query: string
  ): Promise<MaterialsRows> {
    const totalUsers = await prismaClient.material.count({
      where: {
        name: {
          contains: query,
        },
        OR: [
          {
            status: true,
          },
          {
            status: false,
          },
        ],
      },
    });
    const materials = await prismaClient.material.findMany({
      where: {
        name: {
          contains: query,
        },
        OR: [
          {
            status: true,
          },
          {
            status: false,
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
      rows: materials,
      pageSize: +pageSize || 5,
      page: +page || 0,
    };
  }

  async findByName(name: string): Promise<Material | null> {
    const material = await prismaClient.material.findUnique({
      where: {
        name,
      },
    });

    return material || null;
  }
}

export default MaterialsService;
