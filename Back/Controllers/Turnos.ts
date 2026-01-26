import type { Request, Response } from "express";
import { pool } from "../DataBase/config";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

type EstadoTurno = "Activo" | "Inactivo";

type TurnoRow = RowDataPacket & {
  IdTurno: number;
  Fecha: string; // YYYY-MM-DD
  IdPersonal: number | null;
  Usuario?: string | null; // legado
  Estado: EstadoTurno;
};

type CrearTurnoBody = {
  Fecha: string;
  IdPersonal: number;          // ✅ nuevo
  Estado?: EstadoTurno;        // default Activo
};

type EditarTurnoBody = {
  IdTurno: number;
  Fecha: string;
  IdPersonal: number;          // ✅ nuevo
  Estado?: EstadoTurno;
};

type EliminarTurnoParams = { IdTurno: string };

export const verTurnos = async (req: Request, res: Response) => {
  try {
    // ✅ mejor: traer el turno + datos del personal en 1 query
    const sql = `
      SELECT
        t.IdTurno,
        t.Fecha,
        t.IdPersonal,
        t.Estado,
        p.NombreCompleto,
        p.Rol,
        p.Telefono,
        p.Estado AS EstadoPersonal
      FROM turnos t
      LEFT JOIN Personal p ON p.IdPersonal = t.IdPersonal
      ORDER BY t.Fecha ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(sql);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener turnos", error });
  }
};

export const crearTurnos = async (req: Request<{}, {}, CrearTurnoBody>, res: Response) => {
  try {
    const { Fecha, IdPersonal, Estado } = req.body;

    if (!Fecha || !IdPersonal) {
      return res.status(400).json({ message: "Faltan campos requeridos (Fecha, IdPersonal)" });
    }

    const sql = `INSERT INTO turnos (Fecha, IdPersonal, Estado) VALUES (?, ?, ?)`;
    const params = [Fecha, Number(IdPersonal), Estado ?? "Activo"];

    const [result] = await pool.query<ResultSetHeader>(sql, params);

    return res.json({
      message: "Turno creado",
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear turno", error });
  }
};

export const editarTurnos = async (req: Request<{}, {}, EditarTurnoBody>, res: Response) => {
  try {
    const { IdTurno, Fecha, IdPersonal, Estado } = req.body;

    if (!IdTurno || !Fecha || !IdPersonal) {
      return res.status(400).json({ message: "Faltan campos requeridos (IdTurno, Fecha, IdPersonal)" });
    }

    const sql = `
      UPDATE turnos
      SET Fecha = ?, IdPersonal = ?, Estado = ?
      WHERE IdTurno = ?
    `;
    const params = [Fecha, Number(IdPersonal), Estado ?? "Activo", Number(IdTurno)];

    const [result] = await pool.query<ResultSetHeader>(sql, params);

    return res.json({
      message: "Turno editado",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al editar turno", error });
  }
};

export const eliminarTurnos = async (req: Request<EliminarTurnoParams>, res: Response) => {
  try {
    const idNum = Number(req.params.IdTurno);
    if (!Number.isFinite(idNum)) return res.status(400).json({ message: "IdTurno inválido" });

    const [result] = await pool.query<ResultSetHeader>("DELETE FROM turnos WHERE IdTurno = ?", [idNum]);

    return res.json({
      message: "Turno eliminado",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar turno", error });
  }
};
