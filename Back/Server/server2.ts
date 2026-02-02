import express from "express";
import { config as dotenvConfig } from "dotenv";
import morgan from "morgan";
import cors from "cors";

import turnosRoutes from "../Routes/Turnos"; 
import usuariosRoutes from "../Routes/Usuarios"; 
import loginRoutes from "../Routes/Login";
import obleasRoutes from "../Routes/Obleas";
import reimprecionObleas from "../Routes/ReimprecionObleas";
import personal from "../Routes/Peronsal";

dotenvConfig();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/turnos", turnosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/obleas", obleasRoutes);
app.use("/api/reimprecionObleas", reimprecionObleas);
app.use("/api/personal", personal);


app.listen(port, () => {
  console.log("Estamos en el puerto", port);
});


