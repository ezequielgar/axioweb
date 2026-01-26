import { Router } from "express";
const router = Router();


import { verTurnos, crearTurnos, editarTurnos, eliminarTurnos } from "../Controllers/Turnos";


router.get("/verTurnos", verTurnos);

router.post("/crearTurnos", crearTurnos);

router.put("/editarTurnos", editarTurnos);

router.delete("/eliminarTurnos/:IdTurno", eliminarTurnos);

export default router;