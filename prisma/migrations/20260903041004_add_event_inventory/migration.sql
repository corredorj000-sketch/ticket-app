-- CreateTable
CREATE TABLE "EventInventory" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventInventory_eventId_idx" ON "EventInventory"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "EventInventory_eventId_zone_key" ON "EventInventory"("eventId", "zone");

-- AddForeignKey
ALTER TABLE "EventInventory" ADD CONSTRAINT "EventInventory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
