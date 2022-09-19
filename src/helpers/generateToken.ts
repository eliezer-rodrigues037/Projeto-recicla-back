import { sign } from "jsonwebtoken";
import authConfig from "../config/authConfig";

const generateToken = (params = {}) =>
  sign(params, String(authConfig.secret), {
    expiresIn: "1d", // 1 day
    algorithm: "HS512",
  });

export default generateToken;
