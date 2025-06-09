import { PrismaClient } from "@prisma/client";
import redis from "../lib/redis";
import { publishDato } from "../lib/rabbitmq";

const prisma = new PrismaClient();
const CACHE_KEY = "datos:all";
const CACHE_TTL_SECONDS = 60;

export class DatosService {
  async crear(data: {
    authorizationNumber: string;
    movementDate: Date;
    accountFrom: string;
    accountTo: string;
    destinationBank: string;
    sourceBank: string;
    currency: string;
    amount: number;
  }) {
    const nuevo = await prisma.datos.create({ data });

    //Publicar a RabbitMQ
    await publishDato(nuevo);

    return nuevo;
  }

  async obtenerPorAuthorizationNumber(authorizationNumber: string) {
    const cacheKey = `${CACHE_KEY}:${authorizationNumber}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      const dato = JSON.parse(cached);
      console.log("Dato obtenido del caché:", dato);
      return { ...dato, status: "obtenido del caché" };
    }

    const dato = await prisma.datos.findFirst({
      where: { authorizationNumber },
    });

    if (!dato) {
      return null; // lo manejamos en el controller
    }

    console.log("Dato obtenido de la base de datos:", dato);

    // Cachear el dato individual
    await redis.set(cacheKey, JSON.stringify(dato), {
      EX: CACHE_TTL_SECONDS,
    });

    return { ...dato, status: "obtenido de base de datos" };
  }

}
