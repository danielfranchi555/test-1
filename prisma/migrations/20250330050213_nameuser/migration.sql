-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "resetAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;
