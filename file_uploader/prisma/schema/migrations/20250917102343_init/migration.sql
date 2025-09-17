-- CreateEnum
CREATE TYPE "file_uploader"."Privacy" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "file_uploader"."File" ADD COLUMN     "privacy" "file_uploader"."Privacy" NOT NULL DEFAULT 'PUBLIC';
