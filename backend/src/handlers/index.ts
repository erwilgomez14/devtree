// import { Request, Response } from "express";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {
  // console.log(req.body);

  // console.log(errores);
  // return
  const { email, password } = req.body;
  const userExists = await User.findOne({
    email,
  });
  if (userExists) {
    const error = new Error("El correo ya está registrado");
    res.status(409).json({
      error: error.message,
    });
    return;
  }

  const user = new User(req.body);
  const hash = await hashPassword(password);
  // console.log(hash);
  user.password = hash;
  const handle = slug(req.body.handle, "");
  const hanldeExist = await User.findOne({
    handle,
  });
  if (hanldeExist) {
    const error = new Error("El handle ya está registrado");
    res.status(409).json({
      error: error.message,
    });
    return;
  }
  user.handle = handle;

  // console.log(slug(handle));

  await user.save();

  res.status(201).json({ message: "Cuenta creada exitosamente" });

  // const user = new User(req.body);
  // await user.save();

  //manejo errores

  // await User.create(req.body);

  // res.status(201).send('Registro creado correctamente');
};

export const login = async (req: Request, res: Response) => {
  // console.log("login");
  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    // const error = new Error("No puede estar vacio el handle");
    res.status(400).json({
      errores: errores.array(),
    });
    return;
  }

  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    const error = new Error("El correo no esta registrado");
    res.status(404).json({
      error: error.message,
    });
    return;
  }

  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("La contraseña no es correcta");
    res.status(401).json({
      error: error.message,
    });
    return;
  }
  const token = generateJWT({id: user._id});
};
