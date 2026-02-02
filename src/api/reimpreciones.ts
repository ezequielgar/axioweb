import axios from "axios";
import type {
  ReimpresionOblea,
  CrearReimpresionBody,
  CambiarEstadoReimpresionBody,
  CrearReimpresionMasivoBody
} from "../types/reimpresiones";


// "http://localhost:3000/api"
// "/api"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";




export const reimpresionObleasApi = {

  verReimpresionObleas: () =>
    axios.get<ReimpresionOblea[]>(`${API_URL}/reimprecionObleas/verReimpresionObleas`),

  crearReimpresionOblea: (body: CrearReimpresionBody) =>
    axios.post(`${API_URL}/reimprecionObleas/crearReimpresionOblea`, body),

  cambiarEstadoReimpresion: (body: CambiarEstadoReimpresionBody) =>
    axios.put(`${API_URL}/reimprecionObleas/cambiarEstadoReimpresion`, body),


 crearReimpresionMasivo: (body: CrearReimpresionMasivoBody) =>
    axios.post(`${API_URL}/reimprecionObleas/crearReimpresionMasivo`, body),

};
