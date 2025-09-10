/*
  Warnings:

  - You are about to drop the column `ownerId` on the `File` table. All the data in the column will be lost.
  - Added the required column `userId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "file_uploader"."File" DROP CONSTRAINT "File_ownerId_fkey";

-- AlterTable
ALTER TABLE "file_uploader"."File" DROP COLUMN "ownerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "file_uploader"."File" ADD CONSTRAINT "File_userId_fkey" FOREIGN KEY ("userId") REFERENCES "file_uploader"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
