export type RolUsuario = "admin" | "usuario" | "superadmin";

export type EstadoUsuario = "Activo" | "Inactivo";

export type UsuarioAuth = {
  IdUsuario: number;
  Nombre: string;
  Rol: RolUsuario;        
  Telefono: string | null;
  Email: string | null;
  Estado: EstadoUsuario;
};

export type LoginResponse = {
  message: string;
  user: UsuarioAuth;
  token?: string;          
};
