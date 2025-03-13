import { Router } from "express";
// import User from "./models/User";
import { body } from "express-validator";
import { createAccount, login } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
const routes = Router();

routes.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no pued ir vacio"),
  body("name").notEmpty().withMessage("El nombre no pued ir vacio"),
  body("email").isEmail().withMessage("Email no valido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleInputErrors,
  createAccount
);

routes.post(
  "/auth/login",

  body("email").isEmail().withMessage("Email no valido"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleInputErrors,
  login
);

export default routes;
