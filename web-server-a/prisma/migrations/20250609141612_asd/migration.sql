/*
  Warnings:

  - You are about to drop the column `dato` on the `Datos` table. All the data in the column will be lost.
  - You are about to drop the `Equipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proyecto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tarea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountFrom` to the `Datos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountTo` to the `Datos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Datos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorizationNumber` to the `Datos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Datos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationBank` to the `Datos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `movementDate` to the `Datos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceBank` to the `Datos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Proyecto` DROP FOREIGN KEY `Proyecto_equipoId_fkey`;

-- DropForeignKey
ALTER TABLE `Tarea` DROP FOREIGN KEY `Tarea_proyectoId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_equipoId_fkey`;

-- AlterTable
ALTER TABLE `Datos` DROP COLUMN `dato`,
    ADD COLUMN `accountFrom` VARCHAR(191) NOT NULL,
    ADD COLUMN `accountTo` VARCHAR(191) NOT NULL,
    ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `authorizationNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `destinationBank` VARCHAR(191) NOT NULL,
    ADD COLUMN `movementDate` DATETIME(3) NOT NULL,
    ADD COLUMN `sourceBank` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Equipo`;

-- DropTable
DROP TABLE `Proyecto`;

-- DropTable
DROP TABLE `Tarea`;

-- DropTable
DROP TABLE `User`;
