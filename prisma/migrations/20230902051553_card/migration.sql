/*
  Warnings:

  - Added the required column `label` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "label" TEXT NOT NULL;
