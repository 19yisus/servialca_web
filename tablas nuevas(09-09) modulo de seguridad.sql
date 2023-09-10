-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 10, 2023 at 01:38 AM
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
-- Database: `servialc_db2`
--

-- --------------------------------------------------------

--
-- Table structure for table `codigos_recuperacion`
--

CREATE TABLE `codigos_recuperacion` (
  `id_code` bigint NOT NULL,
  `created` datetime NOT NULL,
  `status_code` tinyint(1) NOT NULL DEFAULT '1',
  `char_code` char(12) COLLATE utf8mb4_spanish_ci NOT NULL,
  `id_user` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `preguntas_user`
--

CREATE TABLE `preguntas_user` (
  `id_pregunta` int NOT NULL,
  `des_pregunta` varchar(120) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `respuestas_user`
--

CREATE TABLE `respuestas_user` (
  `id_respuesta` int NOT NULL,
  `user_id_respuesta` bigint NOT NULL,
  `pregunta_id_respuesta` int NOT NULL,
  `des_respuesta` varchar(120) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  ADD PRIMARY KEY (`id_code`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `preguntas_user`
--
ALTER TABLE `preguntas_user`
  ADD PRIMARY KEY (`id_pregunta`);

--
-- Indexes for table `respuestas_user`
--
ALTER TABLE `respuestas_user`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `user_id_respuesta` (`user_id_respuesta`),
  ADD KEY `pregunta_id_respuesta` (`pregunta_id_respuesta`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  MODIFY `id_code` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `preguntas_user`
--
ALTER TABLE `preguntas_user`
  MODIFY `id_pregunta` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `respuestas_user`
--
ALTER TABLE `respuestas_user`
  MODIFY `id_respuesta` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `codigos_recuperacion`
--
ALTER TABLE `codigos_recuperacion`
  ADD CONSTRAINT `codigos_recuperacion_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `usuario` (`usuario_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `respuestas_user`
--
ALTER TABLE `respuestas_user`
  ADD CONSTRAINT `respuestas_user_ibfk_1` FOREIGN KEY (`pregunta_id_respuesta`) REFERENCES `preguntas_user` (`id_pregunta`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `respuestas_user_ibfk_2` FOREIGN KEY (`user_id_respuesta`) REFERENCES `usuario` (`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
