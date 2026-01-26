import { pool } from "../DataBase/config";
import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";

type EstadoReimpresion = "Pendiente" | "Reimprimida" | "Cancelada" | "Entregada";

type ReimpresionObleaRow = RowDataPacket & {
  IdReimpresion: number;
  IdOblea: number;
  Estado: EstadoReimpresion;
  Motivo: string | null;
  SolicitadaPor: string | null;
  fechaSolicitud: string;
  fechaReimpresion: string | null;
  fechaEntrega: string | null;
  fechaCancelacion: string | null;

  nroOblea: number;
  Dominio: string;
  Formato: string;
  Cliente: string;
};

type CrearReimpresionBody = {
  IdOblea: number;
  Motivo?: string | null;
  SolicitadaPor: string;
};

type CambiarEstadoBody = {
  IdReimpresion: number;
  nuevoEstado: EstadoReimpresion;
};


type CrearReimpresionMasivoBody = {
  IdObleas: number[];
  Motivo?: string | null;
  SolicitadaPor: string;
};


export const verReimpresionObleas = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<ReimpresionObleaRow[]>(
      `SELECT
          r.IdReimpresion, r.IdOblea, r.Estado, r.Motivo, r.SolicitadaPor,
          r.fechaSolicitud, r.fechaReimpresion, r.fechaEntrega, r.fechaCancelacion,
          o.nroOblea, o.Dominio, o.Formato, o.Cliente
        FROM reimpresionObleas r
        JOIN obleas o ON o.IdOblea = r.IdOblea
        ORDER BY r.fechaSolicitud DESC`
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener reimpresiones", error });
  }
};

export const crearReimpresionOblea = async (
  req: Request<{}, {}, CrearReimpresionBody>,
  res: Response
) => {
  try {
    const { IdOblea, Motivo = null, SolicitadaPor } = req.body;

    if (!IdOblea || !SolicitadaPor) {
      return res.status(400).json({ message: "Faltan campos requeridos (IdOblea, SolicitadaPor)" });
    }

    const [exist] = await pool.query<(RowDataPacket & { IdReimpresion: number })[]>(
      `SELECT IdReimpresion
       FROM reimpresionObleas
       WHERE IdOblea = ?
         AND Estado IN ('Pendiente','Reimprimida')
       LIMIT 1`,
      [IdOblea]
    );

    if (exist.length > 0) {
      return res.status(409).json({
        message: "Ya existe una reimpresión activa para esta oblea",
        IdReimpresionExistente: exist[0].IdReimpresion,
      });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO reimpresionObleas (IdOblea, Estado, Motivo, SolicitadaPor)
       VALUES (?, 'Pendiente', ?, ?)`,
      [IdOblea, Motivo, SolicitadaPor]
    );

    return res.json({
      message: "Reimpresión solicitada",
      IdReimpresion: result.insertId,
      IdOblea,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al solicitar reimpresión", error });
  }
};

export const cambiarEstadoReimpresion = async (
  req: Request<{}, {}, CambiarEstadoBody>,
  res: Response
) => {
  try {
    const { IdReimpresion, nuevoEstado } = req.body;

    if (!IdReimpresion || !nuevoEstado) {
      return res.status(400).json({ message: "Faltan datos" });
    }

    const [rows] = await pool.query<(RowDataPacket & { Estado: EstadoReimpresion })[]>(
      `SELECT Estado
       FROM reimpresionObleas
       WHERE IdReimpresion = ?`,
      [IdReimpresion]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Reimpresión no encontrada" });

    const estadoActual = rows[0].Estado;

    if (estadoActual === "Entregada") {
      return res.status(400).json({ message: "La reimpresión ya fue entregada y no puede modificarse" });
    }
    if (estadoActual === "Cancelada") {
      return res.status(400).json({ message: "La reimpresión está cancelada y no puede modificarse" });
    }

    let sql = `UPDATE reimpresionObleas SET Estado = ?`;
    const params: any[] = [nuevoEstado];

    if (nuevoEstado === "Reimprimida") sql += `, fechaReimpresion = NOW()`;
    if (nuevoEstado === "Entregada") sql += `, fechaEntrega = NOW()`;
    if (nuevoEstado === "Cancelada") sql += `, fechaCancelacion = NOW()`;

    sql += ` WHERE IdReimpresion = ?`;
    params.push(IdReimpresion);

    const [result] = await pool.query<ResultSetHeader>(sql, params);

    return res.json({ message: "Estado actualizado", affectedRows: result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: "Error al cambiar estado", error });
  }
};



export const crearReimpresionMasivo = async (
  req: Request<{}, {}, CrearReimpresionMasivoBody>,
  res: Response
) => {
  try {
    const { IdObleas, Motivo = null, SolicitadaPor } = req.body;

    if (!Array.isArray(IdObleas) || IdObleas.length === 0 || !SolicitadaPor) {
      return res.status(400).json({ message: "Faltan datos (IdObleas[], SolicitadaPor)" });
    }

    const idsValidos = IdObleas.filter((x) => Number.isFinite(x) && x > 0);
    if (idsValidos.length === 0) {
      return res.status(400).json({ message: "IdObleas inválidos" });
    }

    const creadas: number[] = [];
    const omitidas: number[] = [];

    for (const IdOblea of idsValidos) {
      // existe activa?
      const [exist] = await pool.query<(RowDataPacket & { IdReimpresion: number })[]>(
        `SELECT IdReimpresion
         FROM reimpresionObleas
         WHERE IdOblea = ?
           AND Estado IN ('Pendiente','Reimprimida')
         LIMIT 1`,
        [IdOblea]
      );

      if (exist.length > 0) {
        omitidas.push(IdOblea);
        continue;
      }

      await pool.query<ResultSetHeader>(
        `INSERT INTO reimpresionObleas (IdOblea, Estado, Motivo, SolicitadaPor)
         VALUES (?, 'Pendiente', ?, ?)`,
        [IdOblea, Motivo, SolicitadaPor]
      );

      creadas.push(IdOblea);
    }

    return res.json({
      message: "Reimpresiones procesadas",
      creadas,
      omitidas,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error masivo reimpresiones", error });
  }
};