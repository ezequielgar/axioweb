import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import { pool } from "../DataBase/config";


 type LoginBody = {
  Nombre: string;
  Clave: string;
};

 type UsuarioAuth = {
  IdUsuario: number;
  Nombre: string;
  Rol: string;
  Telefono: string | null;
  Email: string | null;
  Estado: "Activo" | "Inactivo";
};

type UsuarioRow = RowDataPacket & {
  IdUsuario: number;
  Nombre: string;
  Clave: string;
  Rol: string;
  Telefono: string | null;
  Email: string | null;
  Estado: "Activo" | "Inactivo";
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  try {
    const { Nombre, Clave } = req.body;

    if (!Nombre || !Clave) {
      return res.status(400).json({
        message: "Nombre y Clave son obligatorios",
      });
    }

    const [rows] = await pool.query<UsuarioRow[]>(
      `
      SELECT IdUsuario, Nombre, Clave, Rol, Telefono, Email, Estado
      FROM usuarios
      WHERE Nombre = ?
      LIMIT 1
      `,
      [Nombre]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Usuario o clave incorrectos",
      });
    }

    const usuario = rows[0];

    if (usuario.Estado === "Inactivo") {
      return res.status(403).json({
        message: "El usuario está inactivo",
      });
    }

    if (usuario.Clave !== Clave) {
      return res.status(401).json({
        message: "Usuario o clave incorrectos",
      });
    }

    const user: UsuarioAuth = {
      IdUsuario: usuario.IdUsuario,
      Nombre: usuario.Nombre,
      Rol: usuario.Rol,
      Telefono: usuario.Telefono,
      Email: usuario.Email,
      Estado: usuario.Estado,
    };

    return res.json({
      message: "Login exitoso",
      user,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      message: "Error interno en login",
    });
  }
};
