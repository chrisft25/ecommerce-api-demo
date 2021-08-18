-- CreateTable
CREATE TABLE `descriptions_products` (
    `id` INTEGER NOT NULL,
    `id_product` INTEGER,
    `coverage` TEXT,
    `description` TEXT,

    INDEX `fk_descriptions_products`(`id_product`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prices_products` (
    `id` INTEGER NOT NULL,
    `id_product` INTEGER,
    `coverage` TEXT,
    `price` DECIMAL(10, 2),

    INDEX `fk_prices_products_products`(`id_product`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `descriptions_products` ADD FOREIGN KEY (`id_product`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `prices_products` ADD FOREIGN KEY (`id_product`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
