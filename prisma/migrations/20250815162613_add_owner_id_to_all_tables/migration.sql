/*
  Warnings:

  - Added the required column `owner_id` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `complaints` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `discounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `payment_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `rent_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `rents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create a default admin if none exists
INSERT INTO `admins` (`name`, `phone`, `password`, `createdAt`, `updatedAt`) 
SELECT 'Default Admin', 'default', '$2b$10$default', NOW(), NOW() 
WHERE NOT EXISTS (SELECT 1 FROM `admins`);

-- Step 2: Get the default admin ID
SET @default_admin_id = (SELECT id FROM `admins` LIMIT 1);

-- Step 3: Add owner_id columns with default values
ALTER TABLE `admins` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `categories` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `complaints` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `discounts` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `payment_requests` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `payments` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `rent_history` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `rents` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;
ALTER TABLE `students` ADD COLUMN `owner_id` INTEGER NOT NULL DEFAULT @default_admin_id;

-- Step 4: Remove default constraints
ALTER TABLE `admins` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `categories` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `complaints` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `discounts` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `payment_requests` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `payments` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `rent_history` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `rents` ALTER COLUMN `owner_id` DROP DEFAULT;
ALTER TABLE `students` ALTER COLUMN `owner_id` DROP DEFAULT;

-- Step 5: Update existing records to use the default admin
UPDATE `admins` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `categories` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `complaints` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `discounts` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `payment_requests` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `payments` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `rent_history` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `rents` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;
UPDATE `students` SET `owner_id` = @default_admin_id WHERE `owner_id` IS NULL;

-- Step 6: Add foreign key constraints
ALTER TABLE `categories` ADD CONSTRAINT `categories_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `students` ADD CONSTRAINT `students_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `rents` ADD CONSTRAINT `rents_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `rent_history` ADD CONSTRAINT `rent_history_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `payments` ADD CONSTRAINT `payments_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `discounts` ADD CONSTRAINT `discounts_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
