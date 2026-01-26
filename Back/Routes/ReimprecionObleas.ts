import { Router } from "express";
const router = Router();


import { verReimpresionObleas, crearReimpresionOblea, cambiarEstadoReimpresion,crearReimpresionMasivo } from "../Controllers/ReimpresionObleas";


router.get("/verReimpresionObleas", verReimpresionObleas);

router.post("/crearReimpresionOblea", crearReimpresionOblea);
router.post("/crearReimpresionMasivo", crearReimpresionMasivo);


router.put("/cambiarEstadoReimpresion", cambiarEstadoReimpresion);


export default router;