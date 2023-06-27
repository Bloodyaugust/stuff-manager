/*
  Warnings:

  - Added the required column `workspaceId` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Thing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Thing" ADD COLUMN     "workspaceId" TEXT NOT NULL;
