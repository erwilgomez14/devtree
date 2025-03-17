import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import type { RegisterForm } from "../types";
import { toast } from "sonner";
import ErrorMessages from "../components/ErrorMessages";
import api from "../config/axios";

export default function RegisterView() {
  const initialValues: RegisterForm = {
    name: "",
    email: "",
    handle: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    formState: { errors },
    watch,
    reset,
    handleSubmit,
  } = useForm({ defaultValues: initialValues });

  const password = watch("password");

  // console.log(import.meta.env);
  const handleRegister = async (formData: RegisterForm) => {
    try {
      const {data} = await api.post(
        `/auth/register`,  // http://localhost:4000/auth/register
        formData
      );
      toast.success(data.message)
      reset();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
        
      }
    }
    // console.log(response);
    
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-white">Crear Cuenta</h1>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
      >
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="name" className="text-2xl text-slate-500">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu Nombre"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("name", { required: "El nombre es requerido" })}
          />
          {errors.name && <ErrorMessages>{errors.name.message}</ErrorMessages>}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="email" className="text-2xl text-slate-500">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("email", {
              required: "El email es requerido",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessages>{errors.email.message}</ErrorMessages>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="handle" className="text-2xl text-slate-500">
            Handle
          </label>
          <input
            id="handle"
            type="text"
            placeholder="Nombre de usuario: sin espacios"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("handle", { required: "El hanlde es requerido" })}
          />
          {errors.handle && (
            <ErrorMessages>{errors.handle.message}</ErrorMessages>
          )}
        </div>
        <div className="grid grid-cols-1 space-y-3">
          <label htmlFor="password" className="text-2xl text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password", {
              required: "El password es requerido",
              minLength: {
                value: 6,
                message: "El password debe tener al menos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessages>{errors.password.message}</ErrorMessages>
          )}
        </div>

        <div className="grid grid-cols-1 space-y-3">
          <label
            htmlFor="password_confirmation"
            className="text-2xl text-slate-500"
          >
            Repetir Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repetir Password"
            className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
            {...register("password_confirmation", {
              required: "El password es requerido",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessages>
              {errors.password_confirmation.message}
            </ErrorMessages>
          )}
        </div>

        <input
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
          value="Crear Cuenta"
        />
      </form>

      <nav className="mt-10">
        <Link className="text-center text-white text-lg block" to="/auth/login">
          Ya tienes una cuenta? Logueate
        </Link>
      </nav>
    </>
  );
}
