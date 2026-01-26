import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type {
  CrearReimpresionBody,
  CrearReimpresionMasivoBody,
  EstadoReimpresion,
  ReimpresionOblea,
} from "../types/reimpresiones";
import { reimpresionObleasApi } from "../api/reimpreciones";

export const useReimpresionObleas = () => {
  const [reimpresiones, setReimpresiones] = useState<ReimpresionOblea[]>([]);
  const [loading, setLoading] = useState(false);

  const verReimpresiones = async () => {
    setLoading(true);
    try {
      const resp = await reimpresionObleasApi.verReimpresionObleas();
      setReimpresiones(resp.data);
    } finally {
      setLoading(false);
    }
  };

  const crearReimpresion = async (body: CrearReimpresionBody) => {
    await reimpresionObleasApi.crearReimpresionOblea(body);
    await verReimpresiones();
    Swal.fire({ icon: "success", title: "Reimpresión solicitada", timer: 1200, showConfirmButton: false });
  };

  const crearReimpresionMasivo = async (body: CrearReimpresionMasivoBody) => {
    const resp = await reimpresionObleasApi.crearReimpresionMasivo(body);
    await verReimpresiones();

    Swal.fire({
      icon: "success",
      title: "Reimpresiones solicitadas",
      text: `Creadas: ${resp.data?.creadas ?? "?"} | Ignoradas: ${resp.data?.ignoradas ?? 0}`,
      timer: 1600,
      showConfirmButton: false,
    });

    return resp.data; 
  };

  const cambiarEstado = async (IdReimpresion: number, nuevoEstado: EstadoReimpresion) => {
    await reimpresionObleasApi.cambiarEstadoReimpresion({ IdReimpresion, nuevoEstado });
    await verReimpresiones();
  };

  useEffect(() => {
    verReimpresiones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reimpresiones,
    loading,
    verReimpresiones,
    crearReimpresion,
    crearReimpresionMasivo,
    cambiarEstado,
  };
};
