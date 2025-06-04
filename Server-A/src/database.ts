import "reflect-metadata";
import { DataSource } from "typeorm";
import { DatosEntity } from "./entities/datosEntity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "tu_contraseña",
  database: "webserva",
  synchronize: true,
  logging: false,
  entities: [DatosEntity],
});
