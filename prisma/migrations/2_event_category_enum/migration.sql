-- Normalize existing values ("Tech" -> "TECH") so they fit the enum
UPDATE `Event` SET `category` = UPPER(TRIM(`category`));

-- Anything outside the list falls back to TALKS instead of failing the migration
UPDATE `Event` SET `category` = 'TALKS'
WHERE `category` NOT IN ('TECH', 'MUSIC', 'ART', 'DESIGN', 'TALKS');

-- AlterTable
ALTER TABLE `Event` MODIFY `category` ENUM('TECH', 'MUSIC', 'ART', 'DESIGN', 'TALKS') NOT NULL;
