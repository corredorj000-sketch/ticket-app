/*
  Warnings:

  - You are about to drop the `EventInventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventInventory" DROP CONSTRAINT "EventInventory_eventId_fkey";

-- DropTable
DROP TABLE "EventInventory";

-- CreateTable
CREATE TABLE "EventZone" (
    "id" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventZone_eventId_zone_key" ON "EventZone"("eventId", "zone");

-- AddForeignKey
ALTER TABLE "EventZone" ADD CONSTRAINT "EventZone_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
