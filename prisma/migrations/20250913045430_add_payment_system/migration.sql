-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."IncomeType" ADD VALUE 'FREELANCE';
ALTER TYPE "public"."IncomeType" ADD VALUE 'BONUS';

-- CreateTable
CREATE TABLE "public"."business_payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT,
    "incomeId" TEXT,
    "businessId" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'DINHEIRO',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."business_payments" ADD CONSTRAINT "business_payments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."business_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_payments" ADD CONSTRAINT "business_payments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."business_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_payments" ADD CONSTRAINT "business_payments_incomeId_fkey" FOREIGN KEY ("incomeId") REFERENCES "public"."business_incomes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_payments" ADD CONSTRAINT "business_payments_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
