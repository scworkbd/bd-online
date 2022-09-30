-- CreateEnum
CREATE TYPE "DepositMethod" AS ENUM ('bkash', 'nagad', 'upay', 'referral');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "referrer" TEXT,
    "current_pack" TEXT,
    "started_at" TIMESTAMP(3),
    "valid_till" TIMESTAMP(3),
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "is_banned" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "DepositMethod" NOT NULL,
    "tnx_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdraw" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fees" DOUBLE PRECISION NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "method" "DepositMethod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Withdraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "bkash" TEXT NOT NULL DEFAULT '+8801700000000',
    "nagad" TEXT NOT NULL DEFAULT '+8801700000000',
    "upay" TEXT NOT NULL DEFAULT '+8801700000000',
    "whatsapp_number" TEXT NOT NULL DEFAULT '+8801642442091',
    "telegram_link" TEXT NOT NULL DEFAULT 'https://t.me/+wR65AULzIFQyZTg9',
    "registration_bonus" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "referral_commision" DOUBLE PRECISION NOT NULL DEFAULT 3,
    "bkash_percentage" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "cashout_enabled" BOOLEAN NOT NULL DEFAULT true,
    "cashout_notice" TEXT DEFAULT 'Withdraw is disabled. Please try again after some time',
    "app_download_link" TEXT DEFAULT 'https://google.com',

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "daily_limit" INTEGER NOT NULL,
    "per_click" DOUBLE PRECISION NOT NULL,
    "validity" INTEGER NOT NULL,

    CONSTRAINT "Packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ads" (
    "videoId" TEXT NOT NULL,

    CONSTRAINT "Ads_pkey" PRIMARY KEY ("videoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_tnx_id_key" ON "Deposit"("tnx_id");

-- CreateIndex
CREATE UNIQUE INDEX "Packages_id_key" ON "Packages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ads_videoId_key" ON "Ads"("videoId");

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdraw" ADD CONSTRAINT "Withdraw_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Work" ADD CONSTRAINT "Work_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
