/*
  Warnings:

  - You are about to drop the column `destinationLatitude` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `destinationLongitude` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `originLatitude` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `originLongitude` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `destination` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "destinationLatitude",
DROP COLUMN "destinationLongitude",
DROP COLUMN "originLatitude",
DROP COLUMN "originLongitude",
ADD COLUMN     "destination" TEXT NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL;
