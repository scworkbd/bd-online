-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "max_withdraw" INTEGER NOT NULL DEFAULT 25000,
ADD COLUMN     "min_deposit" INTEGER NOT NULL DEFAULT 500,
ADD COLUMN     "min_withdraw" INTEGER NOT NULL DEFAULT 500;