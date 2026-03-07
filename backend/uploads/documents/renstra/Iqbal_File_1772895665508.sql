-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Waktu pembuatan: 07 Feb 2026 pada 15.57
-- Versi server: 11.8.3-MariaDB-log
-- Versi PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u725234155_bakesbangpol`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `pegawai`
--

CREATE TABLE `pegawai` (
  `id_pegawai` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `nama_lengkap` varchar(150) NOT NULL,
  `nip` varchar(30) DEFAULT NULL,
  `jabatan_definitif` int(11) DEFAULT NULL,
  `jabatan_tambahan` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pegawai`
--

INSERT INTO `pegawai` (`id_pegawai`, `id_user`, `nama_lengkap`, `nip`, `jabatan_definitif`, `jabatan_tambahan`, `level`) VALUES
(1, 12, 'Drs. MAHPUDIN, M.Si', '196910021990091001', 1, NULL, 1),
(4, 10, 'SYARIFAH LENNY M, AKS', '197302031999032004', 3, NULL, 2),
(5, 15, 'TIKA SARTIKA, SE, MM', '197703032006042018', 4, NULL, 2),
(6, 18, 'MAHESA AGNI, SH', '198611302005011002', 6, NULL, 3),
(7, 9, 'EKA SUKARTA, S.E., M.M.', '197006261996011001', 33, 18, 0),
(8, 7, 'AEP SYAEPUDIN, S.Kom', '197602152006041006', 19, 17, 4),
(12, 16, 'YOSEP NICOLAS S.Sos', '198511052023211014', 12, NULL, 4),
(13, 1, 'IQBAL ALFIAN, M.Kom', '198706102023211034', 13, NULL, 4),
(15, 14, 'HERWIN ALI NURDINI, S.Sos', '199212152022031004', 33, NULL, 0),
(17, 13, 'HENNRY ANDHIE RISCH, S.IP', '198306092010011002', 33, NULL, 0),
(29, 23, 'ALI KUSMIRAN', NULL, 28, NULL, 5),
(37, 38, 'ASEP JAENUDIN', '197804032009061001', 34, NULL, 0),
(38, 39, 'SUKANDI', '197904152025211061', 31, NULL, 4),
(39, 40, 'PAUJAN HUDORI', '199101012025211371', 32, NULL, 4),
(40, 41, 'FAHMI YULIANSYAH', '198307312025211050', 32, NULL, 4),
(42, 46, 'MOCHAMAD RIZKON  MAULANA', '199407162025211081', 30, NULL, 4),
(43, 47, 'KARLINA JUNIAWATI', '199706282025212059', 31, NULL, 4),
(44, 48, 'AHMAD BAEDILAH', '200003122025211026', 31, NULL, 4),
(45, 49, 'ENDANG SAEPUL AZIS', '197208072025211058', 32, NULL, 4),
(46, 50, 'RANGGA SIGIT SUGIANTO', '198512212012121002', 34, NULL, 0),
(47, 51, 'ADI AGUSTIAN', '198208022010011001', 35, NULL, 0),
(48, 52, 'SUJANA PRIATNA, SE', '198102022010011002', 33, NULL, 0),
(49, 53, 'H. SAMUD', '197007021998031007', 33, NULL, 0),
(50, 54, 'M. CHOIRUL AGUS TJANDRA, S.T., M.T.', '197608182002121011', 2, NULL, 2),
(51, 63, 'Hj. NURHAYATI, SH.,MH', '197205201998032005', 19, 22, 4),
(52, 64, 'ABDUROHMAN, SH', '197309012010011005', 19, 23, 4),
(57, 65, 'HERMAN SUGIANA', NULL, 29, NULL, 5),
(58, 66, 'HALILI RIDWAN', NULL, 29, NULL, 5),
(59, 67, 'ABDUL ROJAK', NULL, 29, NULL, 5),
(60, 68, 'NASARUDDIN', NULL, 29, NULL, 5),
(61, 69, 'EVA VERAWATY, SH.,MM', '198206302009012003', 19, 27, 4);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  ADD PRIMARY KEY (`id_pegawai`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD KEY `jabatan_definitif` (`jabatan_definitif`),
  ADD KEY `jabatan_tambahan` (`jabatan_tambahan`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  MODIFY `id_pegawai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `pegawai`
--
ALTER TABLE `pegawai`
  ADD CONSTRAINT `pegawai_ibfk_1` FOREIGN KEY (`jabatan_definitif`) REFERENCES `jabatan` (`id_jabatan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pegawai_ibfk_2` FOREIGN KEY (`jabatan_tambahan`) REFERENCES `jabatan` (`id_jabatan`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
