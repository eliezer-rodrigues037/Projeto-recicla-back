/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthDate` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `identificador` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `phone`,
    DROP COLUMN `username`,
    ADD COLUMN `birthDate` DATETIME(3) NOT NULL,
    ADD COLUMN `cel` VARCHAR(191) NULL,
    ADD COLUMN `cpf` VARCHAR(191) NOT NULL,
    ADD COLUMN `identificador` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`identificador`);

-- CreateTable
CREATE TABLE `Banc` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `accountOwner` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `entity` ENUM('fisica', 'juridica') NOT NULL DEFAULT 'fisica',
    `banc` VARCHAR(191) NOT NULL,
    `agencyNumber` VARCHAR(191) NOT NULL,
    `agencyDg` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `accountDg` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_cpf_key` ON `users`(`cpf`);

-- AddForeignKey
ALTER TABLE `Banc` ADD CONSTRAINT `Banc_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`identificador`) ON DELETE RESTRICT ON UPDATE CASCADE;
