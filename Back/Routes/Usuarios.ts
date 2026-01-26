import { Router } from "express";
const router = Router();


import { verUsuarios, crearUsuarios, editarUsuarios, eliminarUsuario } from "../Controllers/Usuarios";


router.get("/verUsuarios", verUsuarios);

router.post("/crearUsuarios", crearUsuarios);

router.put("/editarUsuarios", editarUsuarios);

router.delete("/eliminarUsuario/:IdUsuario", eliminarUsuario);

export default router;