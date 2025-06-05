import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. (Equipo A) Buscar o Crear
  let equipoA = await prisma.equipo.findFirst({
    where: { nombre: "Equipo A" },
  });
  if (!equipoA) {
    equipoA = await prisma.equipo.create({
      data: { nombre: "Equipo A" },
    });
  }

  // 2. (Equipo B) Buscar o Crear
  let equipoB = await prisma.equipo.findFirst({
    where: { nombre: "Equipo B" },
  });
  if (!equipoB) {
    equipoB = await prisma.equipo.create({
      data: { nombre: "Equipo B" },
    });
  }

  // 3. Hash de contraseñas
  const saltRounds = 10;
  const password1 = await bcrypt.hash("Password123!", saltRounds);
  const password2 = await bcrypt.hash("Secret456!", saltRounds);

  // 4. Usuario Alice → equipoA
  const existingAlice = await prisma.user.findUnique({
    where: { email: "alice@example.com" },
  });
  if (!existingAlice) {
    await prisma.user.create({
      data: {
        email: "alice@example.com",
        password: password1,
        equipoId: equipoA.id,
      },
    });
  }

  // 5. Usuario Bob → equipoB
  const existingBob = await prisma.user.findUnique({
    where: { email: "bob@example.com" },
  });
  if (!existingBob) {
    await prisma.user.create({
      data: {
        email: "bob@example.com",
        password: password2,
        equipoId: equipoB.id,
      },
    });
  }

  let proyectoA = await prisma.proyecto.findFirst({
    where: { nombre: "Proyecto A" },
  });
  if (!proyectoA) {
    proyectoA = await prisma.proyecto.create({
      data: {
        nombre: "Proyecto A",
        descripcion: "Proyecto inicial para Equipo A",
        equipoId: equipoA.id,
      },
    });
  }

  console.log("✅ Seed completado: Equipos y Usuarios creados (o existentes).");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
