import { Router } from "express";
import {
  verPersonal,
  verPersonalActivo,
  crearPersonal,
  editarPersonal,
  eliminarPersonal,
  cambiarEstadoPersonal,
} from "../Controllers/Personal";

const router = Router();

router.get("/verPersonal", verPersonal);
router.get("/verPersonalActivo", verPersonalActivo);
router.post("/crearPersonal", crearPersonal);
router.put("/editarPersonal/:IdPersonal", editarPersonal);
router.patch("/cambiarEstadoPersonal/:IdPersonal/estado", cambiarEstadoPersonal);
router.delete("/eliminarPersonal/:IdPersonal", eliminarPersonal);

export default router;
