import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../DataBase/config";

type EstadoOblea = "Pendiente" | "Creada" | "Cancelada" | "Entregada";

type Oblea = {
  IdOblea: number;
  Dominio: string;
  Formato: string;
  Cliente: string;
  Item: string | null;
  Reparticion: string | null;
  Modelo: string | null;
  Estado: EstadoOblea;

  nroOblea: number;

  fechaPedido: string;
  fechaCreacion: string | null;
  creadaPor: string;

  fechaEntrega: string | null;
  fechaCancelacion: string | null;
};

type ObleaRow = Oblea & RowDataPacket;

type CrearObleaBody = {
  Dominio: string;
  Formato: string;
  Cliente: string;
  Item?: string;
  Reparticion?: string;
  Modelo?: string;
  creadaPor: string;
  nroOblea: number; 
};

type EditarObleaBody = {
  IdOblea: number;
  Dominio: string;
  Formato: string;
  Cliente: string;
  Item?: string;
  Reparticion?: string;
  Modelo?: string;
  nroOblea: number;
};

type CambiarEstadoBody = {
  IdOblea: number;
  nuevoEstado: EstadoOblea;
};

export const verObleas = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<ObleaRow[]>("SELECT * FROM obleas");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener obleas", error });
  }
};


export const proximoNroOblea = async (_req: Request, res: Response) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT COALESCE(MAX(nroOblea), 1001350109) + 1 AS nroOblea FROM obleas"
  );
  return res.json({ nroOblea: Number(rows[0].nroOblea) });
};


export const reservarNroOblea = async (_req: Request, res: Response) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query<(RowDataPacket & { last_nro: number })[]>(
      "SELECT last_nro FROM obleas_seq WHERE id = 1 FOR UPDATE"
    );

    if (rows.length === 0) {
      await conn.rollback();
      return res.status(500).json({ message: "No existe obleas_seq (id=1)" });
    }

    const next = Number(rows[0].last_nro) + 1;

    await conn.query<ResultSetHeader>(
      "UPDATE obleas_seq SET last_nro = ? WHERE id = 1",
      [next]
    );
    await conn.commit();
    return res.json({ nroOblea: next });
  } catch (error) {
    await conn.rollback();
    return res.status(500).json({ message: "Error reservando nroOblea", error });
  } finally {
    conn.release();
  }
};

export const crearOblea = async (req: Request<{}, {}, CrearObleaBody>, res: Response) => {
  try {
    const { Dominio, Formato, Cliente, Item, Reparticion, Modelo, creadaPor, nroOblea } = req.body;

    if (!Dominio || !Formato || !Cliente || !creadaPor || !nroOblea) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const fechaPedido = new Date().toISOString().split("T")[0];

    await pool.query<ResultSetHeader>(
      `INSERT INTO obleas 
        (nroOblea, Dominio, Formato, Cliente, Item, Reparticion, Modelo, Estado, fechaPedido, creadaPor)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente', ?, ?)`,
      [
        nroOblea,
        Dominio,
        Formato,
        Cliente,
        Item ?? null,
        Reparticion ?? null,
        Modelo ?? null,
        fechaPedido,
        creadaPor,
      ]
    );

    return res.json({ message: "Oblea creada", nroOblea });
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      const msg = String(error?.sqlMessage || "");
      if (msg.includes("ux_obleas_dominio")) {
        const [rows] = await pool.query<RowDataPacket[]>(
          "SELECT nroOblea FROM obleas WHERE Dominio = ? LIMIT 1",
          [req.body.Dominio]
        );
        return res.status(409).json({
          message: `Ya existe una oblea con Dominio ${req.body.Dominio}`,
          nroObleaExistente: rows?.[0]?.nroOblea ?? null,
        });
      }

      if (msg.includes("ux_obleas_nroOblea")) {
        return res.status(409).json({ message: `El nroOblea ${req.body.nroOblea} ya existe` });
      }

      return res.status(409).json({ message: "Dominio o nroOblea ya existe" });
    }

    return res.status(500).json({ message: "Error al crear oblea", error });
  }
};



export const editarOblea = async (req: Request<{}, {}, EditarObleaBody>, res: Response) => {
  try {
    const { IdOblea, Dominio, Formato, Cliente, Item, Reparticion, Modelo, nroOblea } = req.body;

    if (!IdOblea) return res.status(400).json({ message: "Falta IdOblea" });

 
    const [rowEstado] = await pool.query<(RowDataPacket & { Estado: EstadoOblea })[]>(
      "SELECT Estado FROM obleas WHERE IdOblea = ?",
      [IdOblea]
    );

    if (rowEstado.length === 0) return res.status(404).json({ message: "Oblea no encontrada" });
    if (rowEstado[0].Estado === "Entregada") {
      return res.status(400).json({ message: "No se puede editar una oblea Entregada" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE obleas SET
        Dominio = ?,
        Formato = ?,
        Cliente = ?,
        Item = ?,
        Reparticion = ?,
        Modelo = ?,
        nroOblea = ?,
        creadaPor = ?
       WHERE IdOblea = ?`,
      [
        Dominio,
        Formato,
        Cliente,
        Item ?? "",
        Reparticion ?? "",
        Modelo ?? "",
        nroOblea,
        Cliente,
        IdOblea,
      ]
    );
    return res.json({ message: "Oblea actualizada", affectedRows: result.affectedRows });
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Dominio o nroOblea ya existe en otro registro" });
    }
    return res.status(500).json({ message: "Error al editar oblea", error });
  }
};

/**
 * Cambiar estado con fechas automáticas:
 * - Creada => fechaCreacion = CURDATE()
 * - Entregada => fechaEntrega = CURDATE()
 * - Cancelada => fechaCancelacion = CURDATE()
 * Regla: NO permitir Entregada -> Pendiente (y por seguridad, si está Entregada no permitir ningún cambio)
 */
export const cambiarEstadoOblea = async (req: Request<{}, {}, CambiarEstadoBody>, res: Response) => {
  try {
    const { IdOblea, nuevoEstado } = req.body;
    if (!IdOblea || !nuevoEstado) return res.status(400).json({ message: "Faltan datos" });

    const [rows] = await pool.query<(RowDataPacket & { Estado: EstadoOblea })[]>(
      "SELECT Estado FROM obleas WHERE IdOblea = ?",
      [IdOblea]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Oblea no encontrada" });

    const estadoActual = rows[0].Estado;

      if (estadoActual === "Entregada" && nuevoEstado === "Pendiente") {
          return res.status(400).json({
            message: "No se puede pasar de Entregada a Pendiente",
          });
    }

    let sql = "UPDATE obleas SET Estado = ?";
    const params: any[] = [nuevoEstado];

    if (nuevoEstado === "Creada") sql += ", fechaCreacion = CURDATE()";
    if (nuevoEstado === "Entregada") sql += ", fechaEntrega = CURDATE()";
    if (nuevoEstado === "Cancelada") sql += ", fechaCancelacion = CURDATE()";

    sql += " WHERE IdOblea = ?";
    params.push(IdOblea);

    const [result] = await pool.query<ResultSetHeader>(sql, params);

    return res.json({ message: "Estado actualizado", affectedRows: result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: "Error al cambiar estado", error });
  }
};

export const eliminarOblea = async (req: Request<{ IdOblea: string }>, res: Response) => {
  try {
    const { IdOblea } = req.params;
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM obleas WHERE IdOblea = ?",
      [IdOblea]
    );
    return res.json({ message: "Oblea eliminada", affectedRows: result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar oblea", error });
  }
};
