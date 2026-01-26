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

app.use("/turnos", turnosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/auth", loginRoutes);
app.use("/obleas", obleasRoutes);
app.use("/reimprecionObleas", reimprecionObleas);
app.use("/personal", personal);


app.listen(port, () => {
  console.log("Estamos en el puerto", port);
});


