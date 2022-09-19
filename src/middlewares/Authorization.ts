import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import consoleColors from "../helpers/consoleColors";
import authConfig from "../config/authConfig";

class Authorization {
  async ensureIsAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
      if (process.env.ENVIRONMENT === "dev") {
        const requestAddress =
          req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const requestAgent = req.headers["user-agent"];

        const requestOrigin = `Request from: ${requestAddress} at ${requestAgent}`;

        console.log(consoleColors.Magenta, requestOrigin);
      }

      const authToken = req.headers.authorization;

      if (!authToken)
        return res.status(401).json({ message: "Token is missing." });

      const [, token] = authToken.split(" ");

      verify(token, String(authConfig.secret));

      return next();
    } catch (e) {
      console.log(e);
      return res.status(401).json({ message: "Invalid token." });
    }
  }
}

export default Authorization;
