import { Material } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import MaterialsService from "./materialsService";

class MaterialsController {
  private materialsService: MaterialsService;

  constructor() {
    this.materialsService = new MaterialsService();
  }

  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { page, pageSize, searchQuery } = req.query;

      let materials;

      if (page && pageSize) {
        materials = await this.materialsService.fidnAndCountAll(
          +page,
          +pageSize,
          String(searchQuery)
        );
      }
      return res.status(StatusCodes.OK).json(materials);
    } catch (e) {
      console.log(e);
      return res
        .status(404)
        .json({ message: "Erro ao receber materiais.", error: e });
    }
  }

  async store(req: Request, res: Response): Promise<Response> {
    try {
      const { name, price, status } = req.body;

      const materialExists = await this.materialsService.findByName(name);

      const materialData: Pick<Material, "name" | "price" | "status"> = {
        name,
        price: new Decimal(Number(price)),
        status,
      };

      if (materialExists)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Material ja cadastrado." });

      const material = await this.materialsService.store(materialData);

      return res
        .status(StatusCodes.OK)
        .json({ message: "Material adicionado.", material });
    } catch (e) {
      console.log(e);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Erro ao adicionar material.", error: e });
    }
  }
}

export default MaterialsController;
