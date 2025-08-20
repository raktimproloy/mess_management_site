-- AlterTable
ALTER TABLE `admins` ADD COLUMN `otp` VARCHAR(191) NULL,
    ADD COLUMN `otp_expire` DATETIME(3) NULL,
    ADD COLUMN `sms_activation` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `sms_amount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    ADD COLUMN `subdomain` VARCHAR(191) NULL;
