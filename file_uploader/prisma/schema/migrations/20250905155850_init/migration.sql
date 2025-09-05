-- CreateEnum
CREATE TYPE "file_uploader"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "file_uploader"."User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "username" VARCHAR(30),
    "email" VARCHAR(254) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "role" "file_uploader"."Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "file_uploader"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "file_uploader"."User"("email");
