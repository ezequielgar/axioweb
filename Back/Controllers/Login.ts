import type { Request, Response } from "express";
import type { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import { pool } from "../DataBase/config";
import type { ResultSetHeader } from "mysql2/promise";

type LoginBody = {
  Nombre: string;
  Clave: string;
};

type UsuarioRow = RowDataPacket & {
  IdUsuario: number;
  Nombre: string;
  Clave: string; // puede ser texto plano (viejo) o hash bcrypt (nuevo)
  Rol: string;
  Telefono: string | null;
  Email: string | null;
  Estado: "Activo" | "Inactivo";
};

const isBcryptHash = (value: string) =>
  typeof value === "string" && /^\$2[aby]\$\d{2}\$/.test(value);

const SALT_ROUNDS = 10;

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { Nombre, Clave } = req.body;

    if (!Nombre || !Clave) {
      return res.status(400).json({ message: "Nombre y Clave son obligatorios" });
    }

    const [rows] = await pool.query<UsuarioRow[]>(
      `SELECT IdUsuario, Nombre, Clave, Rol, Telefono, Email, Estado
       FROM usuarios
       WHERE Nombre = ?
       LIMIT 1`,
      [Nombre]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o clave incorrectos" });
    }

    const usuario = rows[0];

    if (usuario.Estado === "Inactivo") {
      return res.status(403).json({ message: "El usuario está inactivo" });
    }

    let okPassword = false;

    // ✅ Caso 1: ya es hash bcrypt
    if (isBcryptHash(usuario.Clave)) {
      okPassword = await bcrypt.compare(Clave, usuario.Clave);
    } else {
      // ✅ Caso 2: usuario viejo (texto plano)
      okPassword = usuario.Clave === Clave;

      // 🔁 Migración automática: si coincide, lo convertimos a hash
      if (okPassword) {
        const newHash = await bcrypt.hash(Clave, SALT_ROUNDS);
        await pool.query<ResultSetHeader>(
          `UPDATE usuarios SET Clave = ? WHERE IdUsuario = ?`,
          [newHash, usuario.IdUsuario]
        );
      }
    }

    if (!okPassword) {
      return res.status(401).json({ message: "Usuario o clave incorrectos" });
    }

    return res.json({
      message: "Login exitoso",
      user: {
        IdUsuario: usuario.IdUsuario,
        Nombre: usuario.Nombre,
        Rol: usuario.Rol,
        Telefono: usuario.Telefono,
        Email: usuario.Email,
        Estado: usuario.Estado,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno en login" });
  }
};
