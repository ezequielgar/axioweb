import { Router } from "express";
import {
  verObleas,
  crearOblea,
  editarOblea,
  eliminarOblea,
  reservarNroOblea,
  cambiarEstadoOblea,
  proximoNroOblea,
} from "../Controllers/Obleas";

const router = Router();

router.get("/verObleas", verObleas);
router.get("/proximoNroOblea", proximoNroOblea);
router.post("/reservarNroOblea", reservarNroOblea);
router.post("/crearOblea", crearOblea);
router.put("/editarOblea", editarOblea);
router.patch("/cambiarEstado", cambiarEstadoOblea);
router.delete("/eliminarOblea/:IdOblea", eliminarOblea);

export default router;
