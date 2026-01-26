import { useCallback, useEffect, useMemo, useState } from "react";
import { personalApi } from "../api/personal";
import type { CrearPersonalBody, EditarPersonalBody, EstadoPersonal, Personal } from "../types/personal";

function safeTrim(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export function usePersonal() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const refrescar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await personalApi.listar();
      setPersonal(data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Error al cargar personal");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  const obtenerPersonalActivo = useCallback(() => {
    return personal.filter((p) => p.Estado === "Activo");
  }, [personal]);

  const agregarPersonal = useCallback(async (body: Partial<CrearPersonalBody>) => {
    // ✅ Soportar por si te llega { nombre, rol, telefono } desde algún componente viejo
    const NombreCompleto = safeTrim((body as any)?.NombreCompleto ?? (body as any)?.nombre);
    const Rol = safeTrim((body as any)?.Rol ?? (body as any)?.rol);
    const Telefono = safeTrim((body as any)?.Telefono ?? (body as any)?.telefono);

    const Estado: EstadoPersonal =
      ((body as any)?.Estado ?? (body as any)?.estado) === "Inactivo" ? "Inactivo" : "Activo";

    if (!NombreCompleto || !Rol || !Telefono) {
      throw new Error("NombreCompleto, Rol y Telefono son obligatorios.");
    }

    const payload: CrearPersonalBody = { NombreCompleto, Rol, Telefono, Estado };

    await personalApi.crear(payload);
    await refrescar();
  }, [refrescar]);

  const actualizarPersonal = useCallback(async (IdPersonal: number, body: Partial<EditarPersonalBody>) => {
    const NombreCompleto = safeTrim((body as any)?.NombreCompleto ?? (body as any)?.nombre);
    const Rol = safeTrim((body as any)?.Rol ?? (body as any)?.rol);
    const Telefono = safeTrim((body as any)?.Telefono ?? (body as any)?.telefono);

    const Estado: EstadoPersonal =
      ((body as any)?.Estado ?? (body as any)?.estado) === "Inactivo" ? "Inactivo" : "Activo";

    if (!IdPersonal || !NombreCompleto || !Rol || !Telefono) {
      throw new Error("Datos inválidos para actualizar personal.");
    }

    const payload: EditarPersonalBody = { IdPersonal, NombreCompleto, Rol, Telefono, Estado };

    await personalApi.editar(IdPersonal, payload);
    await refrescar();
  }, [refrescar]);

  const eliminarPersonal = useCallback(async (IdPersonal: number) => {
    await personalApi.eliminar(IdPersonal);
    await refrescar();
  }, [refrescar]);

  const cambiarEstadoPersonal = useCallback(async (IdPersonal: number, Estado: EstadoPersonal) => {
    await personalApi.cambiarEstado(IdPersonal, Estado);
    await refrescar();
  }, [refrescar]);

  return useMemo(
    () => ({
      personal,
      loading,
      error,
      refrescar,
      obtenerPersonalActivo,
      agregarPersonal,
      actualizarPersonal,
      eliminarPersonal,
      cambiarEstadoPersonal,
    }),
    [personal, loading, error, refrescar, obtenerPersonalActivo, agregarPersonal, actualizarPersonal, eliminarPersonal, cambiarEstadoPersonal]
  );
}
