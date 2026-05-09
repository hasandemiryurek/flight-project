-- CreateTable
CREATE TABLE `city` (
    `id` VARCHAR(191) NOT NULL,
    `city_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `City_city_name_key`(`city_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flight` (
    `id` VARCHAR(191) NOT NULL,
    `from_city_id` VARCHAR(191) NOT NULL,
    `to_city_id` VARCHAR(191) NOT NULL,
    `departure_time` DATETIME(3) NOT NULL,
    `arrival_time` DATETIME(3) NOT NULL,
    `price` DOUBLE NOT NULL,
    `seats_total` INTEGER NOT NULL,
    `seats_available` INTEGER NOT NULL,

    INDEX `Flight_from_city_id_fkey`(`from_city_id`),
    INDEX `Flight_to_city_id_fkey`(`to_city_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket` (
    `id` VARCHAR(191) NOT NULL,
    `passenger_name` VARCHAR(191) NOT NULL,
    `passenger_surname` VARCHAR(191) NOT NULL,
    `passenger_email` VARCHAR(191) NOT NULL,
    `flight_id` VARCHAR(191) NOT NULL,
    `seat_number` VARCHAR(191) NULL,

    INDEX `Ticket_flight_id_fkey`(`flight_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `flight` ADD CONSTRAINT `Flight_from_city_id_fkey` FOREIGN KEY (`from_city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flight` ADD CONSTRAINT `Flight_to_city_id_fkey` FOREIGN KEY (`to_city_id`) REFERENCES `city`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket` ADD CONSTRAINT `Ticket_flight_id_fkey` FOREIGN KEY (`flight_id`) REFERENCES `flight`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
