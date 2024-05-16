-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: farm
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `farm_data`
--

DROP TABLE IF EXISTS `farm_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `farm_data` (
  `id` varchar(45) NOT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `lot_size` varchar(45) DEFAULT NULL,
  `establish_date` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'PENDING',
  `polygon` json DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `farm_data`
--

LOCK TABLES `farm_data` WRITE;
/*!40000 ALTER TABLE `farm_data` DISABLE KEYS */;
INSERT INTO `farm_data` VALUES ('2d32d9912b58','347666cb8463',NULL,NULL,'2','2024-05-08','APPROVED','[\"[{\\\"lat\\\":8.169086987288294,\\\"lng\\\":126.21598001810699},{\\\"lat\\\":8.1595713798976,\\\"lng\\\":126.22009989115386},{\\\"lat\\\":8.167183881876081,\\\"lng\\\":126.23300882879622}]\"]',NULL,'2024-05-15 07:19:24','2024-05-15 14:59:28','CORN'),('ad73c2222c53','1d79220503db',NULL,NULL,'3','2024-05-02','APPROVED','[\"[{\\\"lat\\\":8.13549804191887,\\\"lng\\\":126.26979331253625},{\\\"lat\\\":8.134138569163367,\\\"lng\\\":126.26181105850793},{\\\"lat\\\":8.128785600379219,\\\"lng\\\":126.26498679398156},{\\\"lat\\\":8.130060123237358,\\\"lng\\\":126.27502898453332},{\\\"lat\\\":8.133288896349901,\\\"lng\\\":126.27417067764856}]\"]',NULL,'2024-05-15 07:22:15','2024-05-15 15:21:54','RICE'),('b9dbacafc751','347666cb8463',NULL,NULL,'2','2024-05-16','APPROVED','[\"[{\\\"lat\\\":8.149171926969156,\\\"lng\\\":126.25723239275604},{\\\"lat\\\":8.140335573231235,\\\"lng\\\":126.24487277361541},{\\\"lat\\\":8.13863625208087,\\\"lng\\\":126.25791903826385},{\\\"lat\\\":8.143054472076264,\\\"lng\\\":126.26341220232635}]\"]',NULL,'2024-05-15 08:06:28','2024-05-15 16:04:59','CORN'),('cf2ca78e4b36','347666cb8463',NULL,NULL,'3','2024-05-09','PROCESSING','[\"[{\\\"lat\\\":8.161678430938412,\\\"lng\\\":126.23045321795135},{\\\"lat\\\":8.150803230925035,\\\"lng\\\":126.22358676287323},{\\\"lat\\\":8.15250250042585,\\\"lng\\\":126.2328564772287}]\"]',NULL,'2024-05-15 17:02:07','2024-05-15 16:55:31','RICE');
/*!40000 ALTER TABLE `farm_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subsidy`
--

DROP TABLE IF EXISTS `subsidy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subsidy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `farm_id` varchar(45) DEFAULT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `area_planted` varchar(45) DEFAULT NULL,
  `number_bags` double DEFAULT NULL,
  `variety_received` varchar(45) DEFAULT NULL,
  `quantity_received` varchar(45) DEFAULT NULL,
  `month` varchar(45) DEFAULT NULL,
  `year` varchar(45) DEFAULT NULL,
  `received_date` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subsidy`
--

LOCK TABLES `subsidy` WRITE;
/*!40000 ALTER TABLE `subsidy` DISABLE KEYS */;
/*!40000 ALTER TABLE `subsidy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` varchar(45) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `middle_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `suffix` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  `birth_date` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'inactive',
  `province` varchar(45) DEFAULT 'Agusan del Sur',
  `city` varchar(45) DEFAULT 'Trento',
  `barangay` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('05968b140f99','sinoda',NULL,'suico',NULL,'sinodabaladon1@gmail.com','$2b$13$aVLXa5bTD9C7bbXr6VF3jusH60NEZhm4dJUbI6Nzi9f4KrbOiHXZy','male',NULL,'2024-01-29','member','active','Agusan del Sur','Trento','Cuevas','2024-05-07 03:25:10','2024-02-11 18:30:08'),('1d79220503db','Aurelio','Duron','Alaan',NULL,'aurelio@gmail.com','$2b$13$kbfDDMPxvxfFe.1bU29hDO0iDG8/TUrCVKXfd4iE47rZswAkzn1ZW','male',NULL,'2024-05-03','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:48:50','2024-05-07 10:48:46'),('347666cb8463','Romeo','Geronimo','Albutra',NULL,'romeo@gmail.com','$2b$13$khDUeN6R42N3YLGAEkfqq.fp1PZ64lhhFpvT3s7abHN8WiQQIAJkK','male',NULL,'2024-05-08','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:49:25','2024-05-07 10:49:21'),('3c017e5ff3b8','Michael','Joan','Agua',NULL,'michaelagua@gmail.com','$2b$13$EF4SmoH4idvIMxMZPRp0BODF9P5VBk.2g5uS5ucD3Tx77p20jtBcq','male',NULL,'2024-05-04','member','active','Agusan del Sur','Trento',NULL,'2024-05-07 02:46:19','2024-05-07 10:46:13'),('48d294bbfa49','Marife','Lumantas','Abuloc',NULL,'marife@gmail.com','$2b$13$UGD0Maz.aAVAljQA6wLJlux1T5wYc2lHoQtRj6shVHOMVIWjK6R1a','female',NULL,'2024-05-08','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:40:36','2024-05-07 10:40:30'),('6083562ae608','admin',NULL,'sample',NULL,'admin@gmail.com','$2b$13$lDHS/.mBe62Gq2km1rbalun7pd29pakwUroU8ZaWkRH..c6s4N9KS','male','09121793542',NULL,'admin','active','Agusan del Sur','Trento',NULL,'2024-05-06 14:56:33','2024-01-21 17:11:57'),('6083562ke603','super','','admin',NULL,'superadmin@gmail.com','$2b$13$lDHS/.mBe62Gq2km1rbalun7pd29pakwUroU8ZaWkRH..c6s4N9KS','male',NULL,'2024-01-10','super admin','active','Agusan del Sur','Trento','Poblacion','2024-02-11 09:28:40','2024-01-22 14:46:35'),('67c2a8541c3b','Eduardo','Danila','Alfarero',NULL,'eduardo@gmail.com','$2b$13$aOhbASWT9PTWOAK0m8Tvuer/Coe2Gj54j.OfXzm3HfwY.Zhz/8VwO','male',NULL,NULL,'member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:50:01','2024-05-07 10:49:56'),('6eb7263f25a6','Anastacico','Magallon','Abuloc',NULL,'anastacico@gmail.com','$2b$13$ngcZ7m8JG1nypVTaNU64eOamdhYHMu9cTCL9FJvVA7.Su.Cm.Ohgm','male',NULL,'2024-05-08','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:42:53','2024-05-07 10:42:49'),('70ee52876603','Susan','Luces','Abellaja',NULL,'susan@gmail.com','$2b$13$pHmj2AVHCW9YMnl0TmPl4.rIa1C8YU08RsiJnp92S.lCRxjaRW7we','female',NULL,'2024-05-08','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:39:42','2024-05-07 10:39:35'),('7365aa5c167d','Normelita','Laspinas','Aga',NULL,'normelita@gmail.com','$2b$13$EyNyXXe/eGVRdkxWaPyA5O2SPN0ePrEw.aBFTIH2JQOJRMYpF2mj.','female',NULL,'2024-05-09','member','inactive','Agusan del Sur','Trento','Salvacion','2024-05-15 08:42:34','2024-05-07 10:43:45'),('7c794ddaae5a','Lorenza','Cuevas','Ambia',NULL,'lorenza@gmail.com','$2b$13$.alRqQJOXYpiI60fA0bfYOgpy5e9VxSbhJFjWsaZ9HeqrqJS3ITCi','female',NULL,'2024-05-03','member','active','Agusan del Sur','Trento','Cuevas','2024-05-07 03:27:31','2024-05-07 11:27:05'),('83c81ce9cf57','EFREN','AREVALO','SEVERINO',NULL,'efren.arevalo@gmail.com','$2b$13$URLZ9sRJLzGqvm/12s4bE.dJr/XAXmFnfMjqUfMV73rOvPg2n3lbG','male',NULL,'2024-01-09','member','active','Agusan del Sur','Trento','Poblacion','2024-05-07 03:25:32','2024-01-22 14:45:15'),('85705eb0f895','ALBERTO','TUSTADO','DURON',NULL,'alberto.tustado@gmail.com','$2b$13$0MrHO1njRns6rgvDsTXO7.gu3LkasBEjYeHzzCM294hKU2elxhNJS','male',NULL,'2024-01-01','member','active','Agusan del Sur','Trento','Poblacion','2024-05-07 03:25:22','2024-01-22 14:47:22'),('a627fca4c04d','Rosel','Dogelio','Alaan',NULL,'rosel@gmail.com','$2b$13$7h7uUNuXTLEmk.vwwwgj1ejebgTZHjx8gTqcV5FLF8MFXsCzRTEYC','female',NULL,'2024-05-01','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:48:05','2024-05-07 10:48:00'),('a6521f4c3ea9','User',NULL,'Sample',NULL,'user@gmail.com','$2b$13$Y0ZGh88hQAG/b0vdiAj92ur51Lw5/t1xA/Si.DlRTq/lSOfsF5Alu','male','09775421542','2024-02-01','member','active','Agusan del Sur','Trento','Cuevas','2024-05-07 03:25:45','2024-01-21 17:14:08'),('b047ac23bece','DOLPHY','ANDAW','ENGAY',NULL,'dolphy.andaw@gmail.com','$2b$13$ZesLuXroRdhDHhB6BqlgRu6yf5tSlQyfGlSI7ZU3YJ/O6jqRvUXQW','male',NULL,'2024-01-16','member','active','Agusan del Sur','Trento','Poblacion','2024-05-07 03:25:15','2024-01-22 16:21:32'),('b8d6af60211b','Alberto','Magallon','Abuloc',NULL,'alberto@gmail.com','$2b$13$HEw5qIAAVjizMQOqo8deBeM5Nd7iyj9KTKvy.4XLjxNwNQnnnWzZ6','male',NULL,'2024-05-01','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:41:25','2024-05-07 10:41:19'),('d43ad8683ec2','Adelia','Alaan','Aguilar',NULL,'adelia@gmail.com','$2b$13$u3PB/3KbEBnWG7E55eNcleEzu9IyMFtcANFIvJ8a7XQAUnYNTVVIq','female',NULL,'2024-05-08','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:47:26','2024-05-07 10:47:21'),('d7bad3143d58','sample','123','123',NULL,'sample@gmail.com','$2b$13$wng.NYz24tNN5IvI8lRpgu7ORejX6tTfKM/sVNJlgFRQ9H22dJ1xq','male',NULL,'2024-05-15','super admin','active','Agusan del Sur','Trento','Cuevas','2024-05-06 15:01:05','2024-05-06 23:00:13'),('ded50d94caac','RUMOLO','TUSTADO','DURON',NULL,'rumolo.tustado@gmail.com','$2b$13$jMHdV97IGtecuDCnki.QyeHcEWKFqy.sl9/nba3ywdZngbXyIM/j6','male',NULL,'2024-01-09','member','active','Agusan del Sur','Trento','Poblacion','2024-05-07 03:25:39','2024-01-22 14:14:37'),('e2fa146cc722','ROSEMARIE','GASAPO','SUSPEÑE',NULL,'rosemarie.gasapo@gmail.com','$2b$13$CSmIS6SVuom/wcjIHlL9te4wQt4jJYD.4Srb5nTz8QNOYIVqODgLO','female',NULL,'2024-01-10','member','active','Agusan del Sur','Trento','Poblacion','2024-05-07 03:26:00','2024-01-22 14:46:35'),('e48ad4723394','Michael',NULL,'Aga',NULL,'michael@gmail.com','$2b$13$7MwoHI9mfTSDZGLTP.oPPubIYoNsAgVrzMRDbJ9clv3ZSq2IzPruq','male',NULL,'2024-05-21','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:44:31','2024-05-07 10:44:27'),('eb327d903d31','Alexander','Antogon','Agdahan',NULL,'alexander@gmail.com','$2b$13$33U3K5SCbqOYC6j/11jLGekr9KLyez1mdUndM4/CQwGqZAs8UWr.i','male',NULL,NULL,'member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:45:34','2024-05-07 10:45:29'),('f497e95f2c11','Jasie','Montanez','Alsada',NULL,'jasie@gmail.com','$2b$13$Bnm5N4u2TDo/CO9o6RZqc.sSBY.KbSsZHf3wJd7A2d0zb/7hc8JPK','male',NULL,'2024-05-04','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:50:40','2024-05-07 10:50:35'),('fed6ed026a75','Pedro','Magallon','Abuloc',NULL,'pedro@gmail.com','$2b$13$efhlnpNoaawDU9gHpKuL7OSbc9SVyYM1db4.2HGeS3aDeazRQ6prS','male',NULL,'2024-05-02','member','active','Agusan del Sur','Trento','Salvacion','2024-05-07 02:42:06','2024-05-07 10:42:01');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subsidy`
--

DROP TABLE IF EXISTS `user_subsidy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subsidy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subsidy_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subsidy`
--

LOCK TABLES `user_subsidy` WRITE;
/*!40000 ALTER TABLE `user_subsidy` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_subsidy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `validation`
--

DROP TABLE IF EXISTS `validation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `validation` (
  `id` int NOT NULL,
  `user_id` varchar(45) DEFAULT NULL,
  `place_birth` varchar(45) DEFAULT NULL,
  `nationality` varchar(45) DEFAULT NULL,
  `profession` varchar(45) DEFAULT NULL,
  `source_income` varchar(45) DEFAULT NULL,
  `mother_name` varchar(45) DEFAULT NULL,
  `no_parcel` varchar(45) DEFAULT NULL,
  `remarks` varchar(200) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `validation`
--

LOCK TABLES `validation` WRITE;
/*!40000 ALTER TABLE `validation` DISABLE KEYS */;
/*!40000 ALTER TABLE `validation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-16 10:36:55
