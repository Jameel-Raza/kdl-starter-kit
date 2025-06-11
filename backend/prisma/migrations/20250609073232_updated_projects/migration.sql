/*
  Warnings:

  - You are about to drop the column `slug` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "slug",
DROP COLUMN "value",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "estimated_budget" TEXT,
ADD COLUMN     "pdf_attachment" TEXT;
