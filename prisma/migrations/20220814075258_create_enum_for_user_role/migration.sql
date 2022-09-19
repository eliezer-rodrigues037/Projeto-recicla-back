/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum("users_role")`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('Admin', 'User') NULL DEFAULT 'User';
