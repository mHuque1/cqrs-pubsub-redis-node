import { AppDataSource } from "../database";
import { DatosEntity } from "../entities/datosEntity";

export class DatosService {
  private repo = AppDataSource.getRepository(DatosEntity);

  async crear(dato: string): Promise<DatosEntity> {
    const nuevo = this.repo.create({ dato });
    return await this.repo.save(nuevo);
  }

  async obtenerTodos(): Promise<DatosEntity[]> {
    return await this.repo.find();
  }
}
