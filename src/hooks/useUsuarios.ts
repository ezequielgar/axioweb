import { useEffect, useState } from "react";
import type { Usuario, CrearUsuarioBody, EditarUsuarioBody } from "../types/usuarios";
import { usuariosApi } from "../api/usuarios";

export const useUsuario = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const verUsuarios = async () => {
    const resp = await usuariosApi.verUsuario();
    setUsuarios(resp.data);
  };

  const crearUsuario = async (body: CrearUsuarioBody) => {
    await usuariosApi.crearUsuarios(body);
    await verUsuarios();
  };

  const editarUsuario= async (body: EditarUsuarioBody) => {
    await usuariosApi.editarUsuario(body);
    await verUsuarios();
  };

  const eliminarUsuario = async (id: number) => {
    await usuariosApi.eliminarUsuario(id);
    await verUsuarios();
  };

  useEffect(() => {
    verUsuarios();
  }, []);

  return { usuarios, verUsuarios, crearUsuario, editarUsuario , eliminarUsuario };
};
