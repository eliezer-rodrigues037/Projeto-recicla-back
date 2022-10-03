import { Request, Response, Router } from "express";
import { loginSchema, forgotSchema, resetPasswordSchema } from "./auth.schema";
import Validation from "../../middlewares/Validation";
import AuthController from "./auth.controller";

const routes = Router();
const validation = new Validation();
const authController = new AuthController();

routes.post(
  "/auth/login",
  validation.validate(loginSchema),
  (req: Request, res: Response) => authController.login(req, res)
);

routes.post(
  "/auth/forgot",
  validation.validate(forgotSchema),
  (req: Request, res: Response) => authController.forgot(req, res)
);

routes.post(
  "/auth/reset",
  validation.validate(resetPasswordSchema),
  (req: Request, res: Response) => authController.reset(req, res)
);

routes.get("/auth/jwt/:token", (req: Request, res: Response) =>
  authController.getUserByToken(req, res)
);

routes.post("/auth/register", (req: Request, res: Response) =>
  authController.register(req, res)
);

export default routes;
