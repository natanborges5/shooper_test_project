/*
  Warnings:

  - You are about to drop the column `endPoint` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `startPoint` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `destinationLatitude` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationLongitude` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originLatitude` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originLongitude` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "endPoint",
DROP COLUMN "startPoint",
ADD COLUMN     "destinationLatitude" TEXT NOT NULL,
ADD COLUMN     "destinationLongitude" TEXT NOT NULL,
ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "duration" TEXT NOT NULL,
ADD COLUMN     "originLatitude" TEXT NOT NULL,
ADD COLUMN     "originLongitude" TEXT NOT NULL;
