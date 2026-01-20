import { Router } from "express";
import { login } from "../Controllers/Login";

const router = Router();

router.post("/login", login);

export default router;
