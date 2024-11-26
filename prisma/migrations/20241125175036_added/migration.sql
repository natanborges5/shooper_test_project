/*
  Warnings:

  - You are about to drop the column `rating` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ride` table. All the data in the column will be lost.
  - Added the required column `avgRating` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_userId_fkey";

-- DropIndex
DROP INDEX "Driver_userId_key";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "rating",
DROP COLUMN "userId",
ADD COLUMN     "avgRating" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "price",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "userId" UUID NOT NULL,
    "rideId" UUID NOT NULL,
    "authorRole" "Role" NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
