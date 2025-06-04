import { AppDataSource } from "../database";
import { DatosEntity } from "../entities/datosEntity";

export class DatosService {
  async crear(dato: string): Promise<DatosEntity> {
    const repo = AppDataSource.getRepository(DatosEntity);
    const nuevo = repo.create({ dato });
    return await repo.save(nuevo);
  }

  async obtenerTodos(): Promise<DatosEntity[]> {
    const repo = AppDataSource.getRepository(DatosEntity);
    return await repo.find();
  }
}