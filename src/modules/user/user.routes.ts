import { Request, Response, Router } from "express";
import multer from "multer";
import multerConfig from "../../config/multerConfig";
import { createUserSchema, updateUserSchema } from "./user.schema";
import Validation from "../../middlewares/Validation";
import UserController from "./user.controller";
import Authorization from "../../middlewares/Authorization";

const routes = Router();
const validation = new Validation();
const authorization = new Authorization();
const userController = new UserController();

routes.post(
  "/users",
  authorization.ensureIsAuthenticated,
  validation.validate(createUserSchema),
  (req: Request, res: Response) => userController.store(req, res)
);

routes.get(
  "/users",
  authorization.ensureIsAuthenticated,
  (req: Request, res: Response) => userController.index(req, res)
);

routes.get(
  "/users/:id",
  authorization.ensureIsAuthenticated,
  (req: Request, res: Response) => userController.findOne(req, res)
);

routes.patch(
  "/users/:id/avatar",
  authorization.ensureIsAuthenticated,
  multer(multerConfig).single("avatar"),
  (req: Request, res: Response) => userController.updateAvatar(req, res)
);

routes.patch(
  "/users/:id/remove-avatar",
  authorization.ensureIsAuthenticated,
  (req: Request, res: Response) => userController.removeAvatar(req, res)
);

routes.put(
  "/users/:id",
  authorization.ensureIsAuthenticated,
  validation.validate(updateUserSchema),
  (req: Request, res: Response) => userController.update(req, res)
);

routes.delete(
  "/users/:id",
  authorization.ensureIsAuthenticated,
  (req: Request, res: Response) => userController.destroy(req, res)
);

export default routes;
