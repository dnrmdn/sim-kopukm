-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 09, 2026 at 08:12 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kopukm`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_bantuan_umkm`
--

CREATE TABLE `data_bantuan_umkm` (
  `id` int NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nik` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_produk` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_umkm` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `kecamatan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_hp` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nib` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_pirt` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_halal` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_alat_bantu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tahun` year DEFAULT NULL,
  `keterangan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_koperasi`
--

CREATE TABLE `data_koperasi` (
  `id` int NOT NULL,
  `nomor_induk_koperasi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama_koperasi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nomor_badan_hukum` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bentuk_koperasi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_koperasi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pola_pengelolaan` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_koperasi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sektor_usaha` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelompok_koperasi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provinsi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kabupaten` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kecamatan` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kelurahan` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desa` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat_lengkap` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kode_pos` int DEFAULT NULL,
  `email_koperasi` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kuk` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `grade_koperasi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `data_umkm`
--

CREATE TABLE `data_umkm` (
  `id` int NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_kelamin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_usaha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kecamatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jenis_ukm` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nib` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_lakip`
--

CREATE TABLE `dokumen_lakip` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `mime` varchar(100) NOT NULL,
  `data` longblob NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_lkpj`
--

CREATE TABLE `dokumen_lkpj` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `mime` varchar(100) NOT NULL,
  `data` longblob NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_lppd`
--

CREATE TABLE `dokumen_lppd` (
  `id` int NOT NULL,
  `tahun` year NOT NULL,
  `name` varchar(255) NOT NULL,
  `mime` varchar(100) NOT NULL,
  `data` longblob NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_renja`
--

CREATE TABLE `dokumen_renja` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `mime` varchar(50) NOT NULL,
  `data` longblob NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_sop`
--

CREATE TABLE `dokumen_sop` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `mime` varchar(100) DEFAULT NULL,
  `data` longblob,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_sotk`
--

CREATE TABLE `dokumen_sotk` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` bigint UNSIGNED DEFAULT '0',
  `mime` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `created_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen_spip`
--

CREATE TABLE `dokumen_spip` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `mime` varchar(100) NOT NULL,
  `data` longblob NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hirarki`
--

CREATE TABLE `hirarki` (
  `id` int UNSIGNED NOT NULL,
  `tahun` varchar(20) NOT NULL COMMENT 'Contoh: 2025-2029',
  `parent_id` int UNSIGNED DEFAULT NULL COMMENT 'ID atasan/induk',
  `level` enum('visi','misi','tujuan','sasaran','indikator') NOT NULL,
  `uraian` text NOT NULL,
  `kode` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jabatan`
--

CREATE TABLE `jabatan` (
  `id_jabatan` int NOT NULL,
  `nama_jabatan` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `level` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lppd_files`
--

CREATE TABLE `lppd_files` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `tahun` year NOT NULL,
  `triwulan` tinyint NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pagu`
--

CREATE TABLE `pagu` (
  `id` int NOT NULL,
  `jenis` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pegawai`
--

CREATE TABLE `pegawai` (
  `id_pegawai` int NOT NULL,
  `id_user` int DEFAULT NULL,
  `nama_lengkap` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jabatan_definitif` int DEFAULT NULL,
  `jabatan_tambahan` int DEFAULT NULL,
  `level` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pegawai_hirarki`
--

CREATE TABLE `pegawai_hirarki` (
  `id` int NOT NULL,
  `id_pegawai` int NOT NULL,
  `id_atasan` int DEFAULT NULL,
  `valid_dari` date DEFAULT NULL,
  `valid_sampai` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_dokumen`
--

CREATE TABLE `renstra_dokumen` (
  `id` int NOT NULL,
  `nama_dokumen` varchar(255) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `uploaded_by` int UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_kegiatan`
--

CREATE TABLE `renstra_kegiatan` (
  `id` int NOT NULL,
  `program_id` int NOT NULL,
  `kodering` varchar(30) NOT NULL,
  `nama_kegiatan` text NOT NULL,
  `output_kegiatan` text,
  `indikator_kegiatan` text,
  `keterangan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_kegiatan_anggaran`
--

CREATE TABLE `renstra_kegiatan_anggaran` (
  `id` int NOT NULL,
  `kegiatan_id` int NOT NULL,
  `tahun_id` int NOT NULL,
  `target` decimal(15,2) DEFAULT '0.00',
  `pagu` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_program`
--

CREATE TABLE `renstra_program` (
  `id` int NOT NULL,
  `kodering` varchar(20) NOT NULL,
  `nama_program` text NOT NULL,
  `output_program` text,
  `indikator_program` text,
  `keterangan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_program_anggaran`
--

CREATE TABLE `renstra_program_anggaran` (
  `id` int NOT NULL,
  `program_id` int NOT NULL,
  `tahun_id` int NOT NULL,
  `target` decimal(15,2) DEFAULT '0.00',
  `pagu` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_sub_kegiatan`
--

CREATE TABLE `renstra_sub_kegiatan` (
  `id` int NOT NULL,
  `kegiatan_id` int NOT NULL,
  `kodering` varchar(40) NOT NULL,
  `nama_sub` text NOT NULL,
  `output_sub` text,
  `indikator_sub` text,
  `satuan` varchar(50) DEFAULT NULL,
  `keterangan` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_sub_kegiatan_anggaran`
--

CREATE TABLE `renstra_sub_kegiatan_anggaran` (
  `id` int NOT NULL,
  `sub_kegiatan_id` int NOT NULL,
  `tahun_id` int NOT NULL,
  `target` decimal(15,2) DEFAULT '0.00',
  `pagu` bigint DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `renstra_sub_kegiatan_anggaran`
--
DELIMITER $$
CREATE TRIGGER `trg_sub_anggaran_after_insert` AFTER INSERT ON `renstra_sub_kegiatan_anggaran` FOR EACH ROW BEGIN

  DECLARE v_keg_id INT;
  DECLARE v_prog_id INT;

  -- ambil kegiatan
  SELECT kegiatan_id INTO v_keg_id
  FROM renstra_sub_kegiatan
  WHERE id = NEW.sub_kegiatan_id;

  -- ambil program
  SELECT program_id INTO v_prog_id
  FROM renstra_kegiatan
  WHERE id = v_keg_id;

  -- update kegiatan
  INSERT INTO renstra_kegiatan_anggaran (kegiatan_id, tahun_id, target, pagu)
  SELECT v_keg_id, NEW.tahun_id, SUM(target), SUM(pagu)
  FROM renstra_sub_kegiatan_anggaran sa
  JOIN renstra_sub_kegiatan s ON sa.sub_kegiatan_id = s.id
  WHERE s.kegiatan_id = v_keg_id AND sa.tahun_id = NEW.tahun_id
  ON DUPLICATE KEY UPDATE
    target = VALUES(target),
    pagu = VALUES(pagu);

  -- update program
  INSERT INTO renstra_program_anggaran (program_id, tahun_id, target, pagu)
  SELECT v_prog_id, NEW.tahun_id, SUM(target), SUM(pagu)
  FROM renstra_kegiatan_anggaran ka
  JOIN renstra_kegiatan k ON ka.kegiatan_id = k.id
  WHERE k.program_id = v_prog_id AND ka.tahun_id = NEW.tahun_id
  ON DUPLICATE KEY UPDATE
    target = VALUES(target),
    pagu = VALUES(pagu);

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `renstra_tahun`
--

CREATE TABLE `renstra_tahun` (
  `id` int NOT NULL,
  `tahun` year NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rka_belanja`
--

CREATE TABLE `rka_belanja` (
  `id_belanja` int NOT NULL,
  `id_rka` int NOT NULL,
  `pagu_id` int NOT NULL,
  `uraian_belanja` varchar(255) NOT NULL,
  `koefisien` varchar(100) DEFAULT NULL,
  `volume` decimal(15,2) DEFAULT '0.00',
  `harga_satuan` decimal(15,2) DEFAULT '0.00',
  `total` decimal(15,2) GENERATED ALWAYS AS (((cast(nullif(`koefisien`,_utf8mb4'') as decimal(15,2)) * `volume`) * `harga_satuan`)) VIRTUAL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rka_header`
--

CREATE TABLE `rka_header` (
  `id_rka` int NOT NULL,
  `id_sub_kegiatan` int NOT NULL,
  `id_tahun` int NOT NULL,
  `pagu_id` int DEFAULT NULL,
  `id_pj` int DEFAULT NULL,
  `id_pelaksana` int DEFAULT NULL,
  `tgl_mulai` date DEFAULT NULL,
  `tgl_selesai` date DEFAULT NULL,
  `tw_mulai` varchar(10) DEFAULT NULL,
  `mg_mulai` int DEFAULT NULL,
  `tw_selesai` varchar(10) DEFAULT NULL,
  `mg_selesai` int DEFAULT NULL,
  `target_kinerja` text,
  `satuan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skm`
--

CREATE TABLE `skm` (
  `id` int NOT NULL,
  `nama_layanan` varchar(150) NOT NULL,
  `nilai` int NOT NULL,
  `tahun` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `nip` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin','sekdin','kadin','super_admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_monitoring_kinerja`
-- (See below for the actual view)
--
CREATE TABLE `v_monitoring_kinerja` (
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data_bantuan_umkm`
--
ALTER TABLE `data_bantuan_umkm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_koperasi`
--
ALTER TABLE `data_koperasi`
  ADD PRIMARY KEY (`nomor_induk_koperasi`);

--
-- Indexes for table `data_umkm`
--
ALTER TABLE `data_umkm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_lakip`
--
ALTER TABLE `dokumen_lakip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_lkpj`
--
ALTER TABLE `dokumen_lkpj`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_lppd`
--
ALTER TABLE `dokumen_lppd`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_renja`
--
ALTER TABLE `dokumen_renja`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_sop`
--
ALTER TABLE `dokumen_sop`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dokumen_sotk`
--
ALTER TABLE `dokumen_sotk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `dokumen_spip`
--
ALTER TABLE `dokumen_spip`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hirarki`
--
ALTER TABLE `hirarki`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jabatan`
--
ALTER TABLE `jabatan`
  ADD PRIMARY KEY (`id_jabatan`);

--
-- Indexes for table `lppd_files`
--
ALTER TABLE `lppd_files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pagu`
--
ALTER TABLE `pagu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`id_pegawai`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD KEY `jabatan_definitif` (`jabatan_definitif`),
  ADD KEY `jabatan_tambahan` (`jabatan_tambahan`);

--
-- Indexes for table `pegawai_hirarki`
--
ALTER TABLE `pegawai_hirarki`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pegawai` (`id_pegawai`),
  ADD KEY `id_atasan` (`id_atasan`);

--
-- Indexes for table `renstra_dokumen`
--
ALTER TABLE `renstra_dokumen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_renstra_uploader` (`uploaded_by`);

--
-- Indexes for table `renstra_kegiatan`
--
ALTER TABLE `renstra_kegiatan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `program_id` (`program_id`);

--
-- Indexes for table `renstra_kegiatan_anggaran`
--
ALTER TABLE `renstra_kegiatan_anggaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_kegiatan_tahun` (`kegiatan_id`,`tahun_id`),
  ADD KEY `tahun_id` (`tahun_id`);

--
-- Indexes for table `renstra_program`
--
ALTER TABLE `renstra_program`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `renstra_program_anggaran`
--
ALTER TABLE `renstra_program_anggaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_program_tahun` (`program_id`,`tahun_id`),
  ADD KEY `tahun_id` (`tahun_id`);

--
-- Indexes for table `renstra_sub_kegiatan`
--
ALTER TABLE `renstra_sub_kegiatan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kegiatan_id` (`kegiatan_id`);

--
-- Indexes for table `renstra_sub_kegiatan_anggaran`
--
ALTER TABLE `renstra_sub_kegiatan_anggaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_sub_tahun` (`sub_kegiatan_id`,`tahun_id`),
  ADD KEY `tahun_id` (`tahun_id`);

--
-- Indexes for table `renstra_tahun`
--
ALTER TABLE `renstra_tahun`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tahun` (`tahun`);

--
-- Indexes for table `rka_belanja`
--
ALTER TABLE `rka_belanja`
  ADD PRIMARY KEY (`id_belanja`),
  ADD KEY `fk_belanja_rka` (`id_rka`),
  ADD KEY `fk_belanja_pagu` (`pagu_id`);

--
-- Indexes for table `rka_header`
--
ALTER TABLE `rka_header`
  ADD PRIMARY KEY (`id_rka`),
  ADD KEY `fk_rka_sub` (`id_sub_kegiatan`),
  ADD KEY `fk_rka_pj` (`id_pj`),
  ADD KEY `fk_rka_pelaksana` (`id_pelaksana`),
  ADD KEY `idx_pagu_rka` (`pagu_id`);

--
-- Indexes for table `skm`
--
ALTER TABLE `skm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `nip` (`nip`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data_bantuan_umkm`
--
ALTER TABLE `data_bantuan_umkm`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `data_umkm`
--
ALTER TABLE `data_umkm`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_lakip`
--
ALTER TABLE `dokumen_lakip`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_lkpj`
--
ALTER TABLE `dokumen_lkpj`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_lppd`
--
ALTER TABLE `dokumen_lppd`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_renja`
--
ALTER TABLE `dokumen_renja`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_sop`
--
ALTER TABLE `dokumen_sop`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_sotk`
--
ALTER TABLE `dokumen_sotk`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dokumen_spip`
--
ALTER TABLE `dokumen_spip`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hirarki`
--
ALTER TABLE `hirarki`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jabatan`
--
ALTER TABLE `jabatan`
  MODIFY `id_jabatan` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lppd_files`
--
ALTER TABLE `lppd_files`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pagu`
--
ALTER TABLE `pagu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pegawai`
--
ALTER TABLE `pegawai`
  MODIFY `id_pegawai` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pegawai_hirarki`
--
ALTER TABLE `pegawai_hirarki`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_dokumen`
--
ALTER TABLE `renstra_dokumen`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_kegiatan`
--
ALTER TABLE `renstra_kegiatan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_kegiatan_anggaran`
--
ALTER TABLE `renstra_kegiatan_anggaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_program`
--
ALTER TABLE `renstra_program`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_program_anggaran`
--
ALTER TABLE `renstra_program_anggaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_sub_kegiatan`
--
ALTER TABLE `renstra_sub_kegiatan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_sub_kegiatan_anggaran`
--
ALTER TABLE `renstra_sub_kegiatan_anggaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `renstra_tahun`
--
ALTER TABLE `renstra_tahun`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rka_belanja`
--
ALTER TABLE `rka_belanja`
  MODIFY `id_belanja` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rka_header`
--
ALTER TABLE `rka_header`
  MODIFY `id_rka` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `skm`
--
ALTER TABLE `skm`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

-- --------------------------------------------------------

--
-- Structure for view `v_monitoring_kinerja`
--
DROP TABLE IF EXISTS `v_monitoring_kinerja`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_monitoring_kinerja`  AS SELECT `p`.`nama_program` AS `nama_program`, `k`.`nama_kegiatan` AS `nama_kegiatan`, `s`.`nama_sub` AS `nama_sub`, `t`.`tahun` AS `tahun`, `rsa`.`target` AS `target`, `rsa`.`pagu` AS `pagu_renstra`, `r`.`pagu_rka` AS `pagu_rka`, sum(`rb`.`realisasi`) AS `realisasi` FROM ((((((`renstra_sub_kegiatan` `s` join `renstra_kegiatan` `k` on((`s`.`kegiatan_id` = `k`.`id`))) join `renstra_program` `p` on((`k`.`program_id` = `p`.`id`))) join `renstra_sub_kegiatan_anggaran` `rsa` on((`rsa`.`sub_kegiatan_id` = `s`.`id`))) join `renstra_tahun` `t` on((`rsa`.`tahun_id` = `t`.`id`))) left join `rka` `r` on(((`r`.`sub_kegiatan_id` = `s`.`id`) and (`r`.`tahun_id` = `t`.`id`)))) left join `rka_belanja` `rb` on((`rb`.`rka_id` = `r`.`id`))) GROUP BY `s`.`id`, `t`.`id` ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pegawai`
--
ALTER TABLE `pegawai`
  ADD CONSTRAINT `pegawai_ibfk_1` FOREIGN KEY (`jabatan_definitif`) REFERENCES `jabatan` (`id_jabatan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pegawai_ibfk_2` FOREIGN KEY (`jabatan_tambahan`) REFERENCES `jabatan` (`id_jabatan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pegawai_hirarki`
--
ALTER TABLE `pegawai_hirarki`
  ADD CONSTRAINT `pegawai_hirarki_ibfk_1` FOREIGN KEY (`id_pegawai`) REFERENCES `pegawai` (`id_pegawai`) ON DELETE CASCADE,
  ADD CONSTRAINT `pegawai_hirarki_ibfk_2` FOREIGN KEY (`id_atasan`) REFERENCES `pegawai` (`id_pegawai`) ON DELETE SET NULL;

--
-- Constraints for table `renstra_dokumen`
--
ALTER TABLE `renstra_dokumen`
  ADD CONSTRAINT `fk_renstra_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `renstra_kegiatan`
--
ALTER TABLE `renstra_kegiatan`
  ADD CONSTRAINT `fk_kegiatan_program` FOREIGN KEY (`program_id`) REFERENCES `renstra_program` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `renstra_kegiatan_anggaran`
--
ALTER TABLE `renstra_kegiatan_anggaran`
  ADD CONSTRAINT `fk_keg_anggaran_kegiatan` FOREIGN KEY (`kegiatan_id`) REFERENCES `renstra_kegiatan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_keg_anggaran_tahun` FOREIGN KEY (`tahun_id`) REFERENCES `renstra_tahun` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `renstra_program_anggaran`
--
ALTER TABLE `renstra_program_anggaran`
  ADD CONSTRAINT `fk_prog_anggaran_program` FOREIGN KEY (`program_id`) REFERENCES `renstra_program` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_prog_anggaran_tahun` FOREIGN KEY (`tahun_id`) REFERENCES `renstra_tahun` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `renstra_sub_kegiatan`
--
ALTER TABLE `renstra_sub_kegiatan`
  ADD CONSTRAINT `fk_sub_kegiatan` FOREIGN KEY (`kegiatan_id`) REFERENCES `renstra_kegiatan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `renstra_sub_kegiatan_anggaran`
--
ALTER TABLE `renstra_sub_kegiatan_anggaran`
  ADD CONSTRAINT `fk_sub_anggaran_sub` FOREIGN KEY (`sub_kegiatan_id`) REFERENCES `renstra_sub_kegiatan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sub_anggaran_tahun` FOREIGN KEY (`tahun_id`) REFERENCES `renstra_tahun` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rka_belanja`
--
ALTER TABLE `rka_belanja`
  ADD CONSTRAINT `fk_belanja_pagu` FOREIGN KEY (`pagu_id`) REFERENCES `pagu` (`id`),
  ADD CONSTRAINT `fk_belanja_rka` FOREIGN KEY (`id_rka`) REFERENCES `rka_header` (`id_rka`) ON DELETE CASCADE;

--
-- Constraints for table `rka_header`
--
ALTER TABLE `rka_header`
  ADD CONSTRAINT `fk_pagu` FOREIGN KEY (`pagu_id`) REFERENCES `pagu` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_rka_pelaksana` FOREIGN KEY (`id_pelaksana`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `fk_rka_pj` FOREIGN KEY (`id_pj`) REFERENCES `pegawai` (`id_pegawai`),
  ADD CONSTRAINT `fk_rka_sub` FOREIGN KEY (`id_sub_kegiatan`) REFERENCES `renstra_sub_kegiatan` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
