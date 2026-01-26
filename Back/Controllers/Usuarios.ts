import {pool} from "../DataBase/config"
import {Response,Request} from "express"
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

type usuarioRow = RowDataPacket & {
IdUsuario : number,
Nombre: string,
Clave: string,
Rol: string,
Telefono: string,
Email: string,
Estado: string,
}

type CrearUsuarioBody = {
Nombre: string,
Clave: string,
Rol: string,
Telefono: string,
Email: string,
Estado: string,
}

type EditarUsuarioBody = {
IdUsuario: number, 
Nombre: string,
Clave: string,
Rol: string,
Telefono: string,
Email: string,
Estado: string,
}

type EliminarUsuarioParams = {
IdUsuario : number
}



export const verUsuarios = async (req:Request,res:Response)=>{
    try {
       const [rows] = await pool.query<usuarioRow[]>("SELECT * FROM usuarios")
       return res.json(rows);
    } catch (error) {
         return res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
}

export const crearUsuarios = async (req: Request<{}, {}, CrearUsuarioBody>,res:Response) =>{
    try {
        const {Nombre,Clave,Rol,Telefono,Email,Estado} = req.body
       if (!Nombre || !Clave || !Rol || !Telefono || !Email || !Estado){
            return res.status(400).json({ message: "Faltan campos requeridos" }); 
        }

        const [results] = await pool.query<ResultSetHeader>(
            "INSERT INTO usuarios (Nombre, Clave, Rol, Telefono, Email, Estado) VALUES (?, ?, ?,?, ?, ?)",
            [Nombre, Clave,Rol,Telefono,Email,Estado]
            );
        return res.json({
        message: "Usuario creado",
        insertId: results.insertId,
        affectedRows: results.affectedRows,
        });
    } catch (error) {
        return res.status(500).json({message:"Error al crear los usuarios", error})
    }
}


export const editarUsuarios = async (req: Request<{}, {}, EditarUsuarioBody>,res:Response)=>{
    try {
        const {IdUsuario,Nombre,Clave,Rol,Telefono,Email,Estado} = req.body
      
        if(!IdUsuario || !Nombre || !Clave || !Rol || !Telefono || !Email || !Estado){
            return res.status(400).json({ message: "Faltan campos requeridos" }); 
        }

        const [results] = await pool.query<ResultSetHeader>(
             `  UPDATE usuarios

                SET Nombre = ?, Clave = ?, Rol = ?, Telefono = ?, Email = ?, Estado = ?

                WHERE IdUsuario = ?`,
        [Nombre,Clave,Rol,Telefono,Email,Estado,IdUsuario]

        )
        return res.json({
            message: "Usuario editado",
            insertId: results.insertId,
            affectedRows: results.affectedRows,
        });

    } catch (error) {
        return res.status(500).json({message: "Error al editar el usuario", error})
    }
}


export const eliminarUsuario = async (
  req: Request<EliminarUsuarioParams>,
  res: Response
) => {
  try {
    const idNum = Number(req.params.IdUsuario);

    if (!Number.isFinite(idNum)) {
      return res.status(400).json({ message: "IdUsuario inválido" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM usuarios WHERE IdUsuario = ?",
      [idNum]
    );

    return res.json({
      message: "Usuario eliminado",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar usuario", error });
  }
};