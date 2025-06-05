import { PrismaClient } from "@prisma/client";
import redis from "../lib/redis";
import { publishDato } from "../lib/rabbitmq";

const prisma = new PrismaClient();
const CACHE_KEY = "datos:all";
const CACHE_TTL_SECONDS = 60;

export class DatosService {
  async crear(dato: string) {
    const nuevo = await prisma.datos.create({ data: { dato } });

    await this.invalidateCache();

    // Publish to RabbitMQ
    await publishDato(nuevo);

    return nuevo;
  }

  async obtenerTodos() {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    const datos = await prisma.datos.findMany();
    await this.cacheDatos(datos);
    return datos;
  }

  private async invalidateCache() {
    await redis.del(CACHE_KEY);
  }

  private async cacheDatos(datos: unknown) {
    await redis.set(CACHE_KEY, JSON.stringify(datos), {
      EX: CACHE_TTL_SECONDS,
    });
  }
}
