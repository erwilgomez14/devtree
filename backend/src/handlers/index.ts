// import { Request, Response } from "express";
import type { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from "slug";
import formidable from "formidable";
import { v4 as uuid } from "uuid";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

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
  const token = generateJWT({ id: user._id });
  res.send(token);
  // res.status(200).json(token);
  // res.status(200).json({ message: token });
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Aquí puedes agregar lógica para actualizar el perfil en la base de datos
    const { description } = req.body; // Ejemplo: datos enviados en el cuerpo de la solicitud
    const handle = slug(req.body.handle, "");
    const hanldeExist = await User.findOne({
      handle,
    });
    if (hanldeExist && hanldeExist.email !== req.user.email) {
      const error = new Error("El handle ya está registrado");
      res.status(409).json({
        error: error.message,
      });
      return;
    }
    req.user.description = description;
    req.user.handle = handle;
    await req.user.save();
    res.status(200).json("Perfil actualizado correctamente");
  } catch (e) {
    // Manejo de errores
    const error = new Error("Error al actualizar el perfil");
    res.status(500).json({
      error: error.message,
    });
  }
};

export const updateImage = async (req: Request, res: Response) => {
  const form = formidable({ multiples: false });
  try {
    form.parse(req, (error, fields, files) => {
      // console.log(files.file[0].filepath);
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuid()},
        async function (error, result) {
          //   console.log(result);
          //   console.log(error);
          if (error) {
            const error = new Error("Hubo un error al subir la imagen");
            res.status(500).json({
              error: error.message,
            });
          }
          if(result){
            // console.log(result);
            req.user.image = result.secure_url;
            await req.user.save();
            res.json(result.secure_url);
          }
        }
      );
    });
    // console.log("updateImage");
  } catch (e) {
    const error = new Error("Error al actualizar el perfil");
    // res.status(500).json({
    //   error: error.message,
    // });
    console.log(e);
  }
};
