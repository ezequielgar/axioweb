
export type Usuario = {
  IdUsuario: number;
  Nombre: string;
  Clave: string;
  Rol: string;
  Telefono: string;
  Email: string;
  Estado: string;
};

export type CrearUsuarioBody = Omit<Usuario, "IdUsuario">;

export type EditarUsuarioBody = Usuario;

export type EliminarUsuarioParams = {
  IdUsuario: string; 
};
