import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
//esta haciendo global la intefaz de user para tomarlo en el request

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(result);
    if (typeof result === "object" && result.id) {
      // console.log(result.id);
      const user = await User.findById(result.id).select("-password");
      // console.log(user);
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      //   res.status(200).json(user);
      req.user = user;
      next();
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: "Token no valido" });
  }
};
