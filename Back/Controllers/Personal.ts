import type { Request, Response } from "express";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../DataBase/config";

type EstadoPersonal = "Activo" | "Inactivo";

type PersonalRow = RowDataPacket & {
  IdPersonal: number;
  NombreCompleto: string;
  Rol: string;
  Telefono: string;
  Estado: EstadoPersonal;
};

type PersonalBody = {
  NombreCompleto?: string;
  Rol?: string;
  Telefono?: string;
  Estado?: EstadoPersonal;
};

export const verPersonal = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT IdPersonal, NombreCompleto, Rol, Telefono, Estado
      FROM Personal
      ORDER BY Estado DESC, NombreCompleto ASC
    `;
    const [rows] = await pool.query<PersonalRow[]>(sql);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Error al listar personal" });
  }
};

export const verPersonalActivo = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT IdPersonal, NombreCompleto, Rol, Telefono, Estado
      FROM Personal
      WHERE Estado = 'Activo'
      ORDER BY NombreCompleto ASC
    `;
    const [rows] = await pool.query<PersonalRow[]>(sql);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Error al listar personal activo" });
  }
};

export const crearPersonal = async (req: Request<{}, any, PersonalBody>, res: Response) => {
  try {
    const { NombreCompleto, Rol, Telefono, Estado } = req.body;

    if (!NombreCompleto?.trim() || !Rol?.trim() || !Telefono?.trim()) {
      return res.status(400).json({ message: "NombreCompleto, Rol y Telefono son obligatorios." });
    }

    const sql = `
      INSERT INTO Personal (NombreCompleto, Rol, Telefono, Estado)
      VALUES (?, ?, ?, ?)
    `;

    const params = [
      NombreCompleto.trim(),
      Rol.trim(),
      Telefono.trim(),
      (Estado ?? "Activo") as EstadoPersonal,
    ];

    const [result] = await pool.query<ResultSetHeader>(sql, params);

    return res.json({ message: "Personal creado", IdPersonal: result.insertId });
  } catch (err) {
    return res.status(500).json({ message: "Error al crear personal" });
  }
};

export const editarPersonal = async (
  req: Request<{ IdPersonal: string }, any, PersonalBody>,
  res: Response
) => {
  try {
    const id = Number(req.params.IdPersonal);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "IdPersonal inválido." });

    const { NombreCompleto, Rol, Telefono, Estado } = req.body;

    if (!NombreCompleto?.trim() || !Rol?.trim() || !Telefono?.trim()) {
      return res.status(400).json({ message: "NombreCompleto, Rol y Telefono son obligatorios." });
    }

    const sql = `
      UPDATE Personal
      SET NombreCompleto = ?, Rol = ?, Telefono = ?, Estado = ?
      WHERE IdPersonal = ?
    `;

    const params = [
      NombreCompleto.trim(),
      Rol.trim(),
      Telefono.trim(),
      (Estado ?? "Activo") as EstadoPersonal,
      id,
    ];

    const [result] = await pool.query<ResultSetHeader>(sql, params);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Personal no encontrado." });

    return res.json({ message: "Personal actualizado" });
  } catch (err) {
    return res.status(500).json({ message: "Error al editar personal" });
  }
};

export const eliminarPersonal = async (req: Request<{ IdPersonal: string }>, res: Response) => {
  try {
    const id = Number(req.params.IdPersonal);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "IdPersonal inválido." });

    const sql = `DELETE FROM Personal WHERE IdPersonal = ?`;

    const [result] = await pool.query<ResultSetHeader>(sql, [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Personal no encontrado." });

    return res.json({ message: "Personal eliminado" });
  } catch (err) {
    return res.status(500).json({ message: "Error al eliminar personal" });
  }
};

export const cambiarEstadoPersonal = async (
  req: Request<{ IdPersonal: string }, any, { Estado?: EstadoPersonal }>,
  res: Response
) => {
  try {
    const id = Number(req.params.IdPersonal);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "IdPersonal inválido." });

    const { Estado } = req.body;

    if (Estado !== "Activo" && Estado !== "Inactivo") {
      return res.status(400).json({ message: "Estado inválido (Activo/Inactivo)." });
    }

    const sql = `UPDATE Personal SET Estado = ? WHERE IdPersonal = ?`;

    const [result] = await pool.query<ResultSetHeader>(sql, [Estado, id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Personal no encontrado." });

    return res.json({ message: "Estado actualizado" });
  } catch (err) {
    return res.status(500).json({ message: "Error al cambiar estado" });
  }
};
