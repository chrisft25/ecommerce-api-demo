-- AlterTable
ALTER TABLE `countries` ADD COLUMN `iso_code` VARCHAR(45);

-- CreateTable
CREATE TABLE `reviews_products` (
    `id` INTEGER NOT NULL,
    `id_product` INTEGER,
    `id_user` INTEGER,
    `review` DECIMAL(10, 2),

    INDEX `fk_reviews_products_products`(`id_product`),
    INDEX `fk_reviews_products_user`(`id_user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviews_products` ADD FOREIGN KEY (`id_product`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews_products` ADD FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
