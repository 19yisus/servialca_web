-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 28, 2023 at 04:30 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `servialca2`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversacion`
--

CREATE TABLE `conversacion` (
  `id_con` bigint NOT NULL,
  `fecha_hora_con` datetime NOT NULL,
  `user_1_id` bigint NOT NULL,
  `user_2_id` bigint NOT NULL,
  `estatus_con` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Dumping data for table `conversacion`
--

INSERT INTO `conversacion` (`id_con`, `fecha_hora_con`, `user_1_id`, `user_2_id`, `estatus_con`) VALUES
(1, '2023-08-27 23:33:18', 57, 58, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sms_conversacion`
--

CREATE TABLE `sms_conversacion` (
  `sms_id` bigint NOT NULL,
  `conversacion_id` bigint NOT NULL,
  `remitente` bigint NOT NULL,
  `fecha_hora_sms` datetime NOT NULL,
  `content_sms` varchar(120) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Dumping data for table `sms_conversacion`
--

INSERT INTO `sms_conversacion` (`sms_id`, `conversacion_id`, `remitente`, `fecha_hora_sms`, `content_sms`) VALUES
(1, 1, 57, '2023-08-27 23:38:14', 'hola como estas?'),
(2, 1, 58, '2023-08-27 23:42:23', 'bien y tu?'),
(3, 1, 57, '2023-08-27 23:50:54', 'excelente'),
(4, 1, 58, '2023-08-27 23:51:55', 'maravilloso, biba chabes');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversacion`
--
ALTER TABLE `conversacion`
  ADD PRIMARY KEY (`id_con`),
  ADD KEY `user_1_id` (`user_1_id`),
  ADD KEY `user_2_id` (`user_2_id`);

--
-- Indexes for table `sms_conversacion`
--
ALTER TABLE `sms_conversacion`
  ADD PRIMARY KEY (`sms_id`),
  ADD KEY `conservacion_id` (`conversacion_id`),
  ADD KEY `remitente` (`remitente`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conversacion`
--
ALTER TABLE `conversacion`
  MODIFY `id_con` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sms_conversacion`
--
ALTER TABLE `sms_conversacion`
  MODIFY `sms_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sms_conversacion`
--
ALTER TABLE `sms_conversacion`
  ADD CONSTRAINT `sms_conversacion_ibfk_1` FOREIGN KEY (`conversacion_id`) REFERENCES `conversacion` (`id_con`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `sms_conversacion_ibfk_2` FOREIGN KEY (`remitente`) REFERENCES `usuario` (`usuario_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
