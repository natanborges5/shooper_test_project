/*
  Warnings:

  - You are about to alter the column `distance` on the `Ride` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Changed the type of `destinationLatitude` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `destinationLongitude` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `originLatitude` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `originLongitude` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "destinationLatitude",
ADD COLUMN     "destinationLatitude" INTEGER NOT NULL,
DROP COLUMN "destinationLongitude",
ADD COLUMN     "destinationLongitude" INTEGER NOT NULL,
ALTER COLUMN "distance" SET DATA TYPE INTEGER,
DROP COLUMN "originLatitude",
ADD COLUMN     "originLatitude" INTEGER NOT NULL,
DROP COLUMN "originLongitude",
ADD COLUMN     "originLongitude" INTEGER NOT NULL;
