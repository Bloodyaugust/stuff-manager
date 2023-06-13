/*
  Warnings:

  - Added the required column `createdBy` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Thing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Thing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Thing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Thing" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL;
