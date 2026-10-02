-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed the default categories
INSERT INTO `Category` (`name`, `updatedAt`) VALUES
    ('TECH', CURRENT_TIMESTAMP(3)),
    ('MUSIC', CURRENT_TIMESTAMP(3)),
    ('ART', CURRENT_TIMESTAMP(3)),
    ('DESIGN', CURRENT_TIMESTAMP(3)),
    ('TALKS', CURRENT_TIMESTAMP(3));

-- AlterTable: enum -> plain text (existing values are kept)
ALTER TABLE `Event` MODIFY `category` VARCHAR(191) NOT NULL;

-- Any category already used by an event must exist before adding the FK
INSERT IGNORE INTO `Category` (`name`, `updatedAt`)
    SELECT DISTINCT `category`, CURRENT_TIMESTAMP(3) FROM `Event`;

-- CreateIndex
CREATE INDEX `Event_category_idx` ON `Event`(`category`);

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_category_fkey` FOREIGN KEY (`category`) REFERENCES `Category`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
