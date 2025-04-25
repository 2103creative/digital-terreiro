-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "terreiro_1";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "terreiro_2";

-- AlterTable
ALTER TABLE "public"."Terreiro" ADD COLUMN     "theme" JSONB;
