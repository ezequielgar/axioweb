import type { Request, Response } from "express";
import { pool } from "../DataBase/config";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

type TurnoRow = RowDataPacket & {
  IdTurno: number;
  Fecha: string;  
  Usuario: string;
  Estado: string;
};

type CrearTurnoBody = {
  Fecha: string;
  Usuario: string;
  Estado: string;
};

type EditarTurnoBody = {
  IdTurno: number;
  Fecha: string;
  Usuario: string;
  Estado: string;
};

type EliminarTurnoParams = {
  IdTurno: string;
};


export const verTurnos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<TurnoRow[]>("SELECT * FROM turnos");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener turnos", error });
  }
};

export const crearTurnos = async (
  req: Request<{}, {}, CrearTurnoBody>,
  res: Response
) => {
  try {
    const { Fecha, Usuario, Estado } = req.body;
    if (!Fecha || !Usuario || !Estado) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO turnos (Fecha, Usuario, Estado) VALUES (?, ?, ?)",
      [Fecha, Usuario, Estado]
    );

    return res.json({
      message: "Turno creado",
      insertId: result.insertId,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear turno", error });
  }
};

export const editarTurnos = async (
  req: Request<{}, {}, EditarTurnoBody>,
  res: Response
) => {
  try {
    const { IdTurno, Fecha, Usuario, Estado } = req.body;

    if (!IdTurno || !Fecha || !Usuario || !Estado) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE turnos
       SET Fecha = ?, Usuario = ?, Estado = ?
       WHERE IdTurno = ?`,
      [Fecha, Usuario, Estado, IdTurno]
    );

    return res.json({
      message: "Turno editado",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al editar turno", error });
  }
};

export const eliminarTurnos = async (
  req: Request<EliminarTurnoParams>,
  res: Response
) => {
  try {
    const idNum = Number(req.params.IdTurno);

    if (!Number.isFinite(idNum)) {
      return res.status(400).json({ message: "IdTurno inválido" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM turnos WHERE IdTurno = ?",
      [idNum]
    );

    return res.json({
      message: "Turno eliminado",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar turno", error });
  }
};
