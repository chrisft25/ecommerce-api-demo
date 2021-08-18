-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER NOT NULL,
    `street` TEXT,
    `street_2` TEXT,
    `id_city` INTEGER,
    `reference` VARCHAR(255),
    `zip_code` INTEGER,
    `latitude` VARCHAR(45),
    `longitude` VARCHAR(45),
    `user_default` BOOLEAN,

    INDEX `fk_addresses_cities`(`id_city`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(100),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(100),
    `id_state` INTEGER,

    INDEX `fk_cities_states`(`id_state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(100),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images_products` (
    `id` INTEGER NOT NULL,
    `id_product` INTEGER,
    `url_image` TEXT,

    INDEX `fk_images_products_products`(`id_product`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(100),
    `id_category` INTEGER,
    `price` DECIMAL(10, 2),
    `coverage` TEXT,
    `description` TEXT,

    UNIQUE INDEX `products.id_unique`(`id`),
    INDEX `fk_products_categories`(`id_category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `states` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(100),
    `id_country` INTEGER,

    INDEX `fk_states_countries`(`id_country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addresses` ADD FOREIGN KEY (`id_city`) REFERENCES `cities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cities` ADD FOREIGN KEY (`id_state`) REFERENCES `states`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images_products` ADD FOREIGN KEY (`id_product`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD FOREIGN KEY (`id_category`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `states` ADD FOREIGN KEY (`id_country`) REFERENCES `countries`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
