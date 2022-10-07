import { Router, Request, Response } from "express";
import Validation from "../../middlewares/Validation";
import MaterialsController from "./materials.controller";
import addMaterialSchema from "./materials.schema";

const routes = Router();
const materialsController = new MaterialsController();
const validation = new Validation();

routes.get("/materials", (req: Request, res: Response) =>
  materialsController.index(req, res)
);

routes.post(
  "/materials",
  validation.validate(addMaterialSchema),
  (req: Request, res: Response) => materialsController.store(req, res)
);

routes.put("/materials/:id", (req: Request, res: Response) =>
  materialsController.update(req, res)
);

routes.delete("/materials/:id", (req: Request, res: Response) =>
  materialsController.destroy(req, res)
);

export default routes;
