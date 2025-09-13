/*
  Warnings:

  - Added the required column `profitMargin` to the `business_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `businesses` table without a default value. This is not possible if the table is not empty.
  - Made the column `color` on table `expense_categories` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."BusinessType" AS ENUM ('SALAO', 'MAQUIAGEM', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."GoalPriority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'TRANSFERENCIA', 'OUTRO');

-- AlterTable
ALTER TABLE "public"."business_clients" ADD COLUMN     "address" TEXT,
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "public"."business_expenses" ADD COLUMN     "category" TEXT,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurringInterval" TEXT;

-- AlterTable
ALTER TABLE "public"."business_incomes" ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'DINHEIRO';

-- AlterTable
ALTER TABLE "public"."business_materials" ADD COLUMN     "minStock" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "supplier" TEXT;

-- AlterTable
ALTER TABLE "public"."business_services" ADD COLUMN     "laborHours" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "materialCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "profitMargin" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."businesses" ADD COLUMN     "type" "public"."BusinessType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."expense_categories" ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "color" SET DEFAULT '#3B82F6';

-- AlterTable
ALTER TABLE "public"."personal_budgets" ADD COLUMN     "emergencyFund" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "savings" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."personal_expenses" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurringInterval" TEXT;

-- AlterTable
ALTER TABLE "public"."personal_incomes" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurringInterval" TEXT;

-- CreateTable
CREATE TABLE "public"."financial_goals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "priority" "public"."GoalPriority" NOT NULL DEFAULT 'MEDIA',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."business_budgets" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "totalIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_budgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_budgets_businessId_month_year_key" ON "public"."business_budgets"("businessId", "month", "year");

-- AddForeignKey
ALTER TABLE "public"."financial_goals" ADD CONSTRAINT "financial_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_budgets" ADD CONSTRAINT "business_budgets_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "public"."businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
