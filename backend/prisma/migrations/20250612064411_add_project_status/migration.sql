-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING';
