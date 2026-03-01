import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./folder/LOGIN/LoginPage";
import MainLayout from "./layouts/MainLayout";
import OverviewDashboard from "./folder/DASHBOARD/OverviewDashboard";
import DashboardPage from "./folder/DASHBOARD/UMKMDashboard";
import UmkmPage from "./folder/UMKM/UMKMPage";
import BantuanPage from "./folder/UMKM/BantuanPage";
import DuplikatPage from "./folder/UMKM/DuplikatPage";
import BantuanTidakTerdaftarPage from "./folder/UMKM/BantuanTidakTerdaftarPage";
import KoperasiPage from "./folder/KOPERASI/KoperasiPage";
import KoperasiDataPage from "./folder/KOPERASI/KoperasiDataPage";
import DuplikatKoperasi from "./folder/KOPERASI/DuplikatKoperasi";
import DuplikatKoperasiDetails from "./folder/KOPERASI/DuplikatKoperasiDetails";
import DokumenKesekretariatan from "./folder/DASHBOARD/SekretariatDashboard";
import SOTKPage from "./folder/SOTK/SOTKPage";

import RkaPage from "./folder/RKA/RkaPage";
import RenstraPage from "./folder/RENSTRA/RenstraPage";

import RenjaPage from "./folder/RENJA/RenjaPage";
import SopPage from "./folder/SOP/SopPage";
import LkpjPage from "./folder/LKPJ/LkpjPage";
import DpaPage from "./folder/DPA/DpaPage";
import KakPage from "./folder/KAK/KakPage";
import PerjanjianKinerjaPage from "./folder/PK/PerjanjianKinerjaPage";
import SpipPage from "./folder/SPIP/SpipPage";
import RiskRegisterPage from "./folder/RESIKO/RiskRegisterPage";
import ManajemenRisikoPage from "./folder/RESIKO/ManajemenRisikoPage";
import CascadingPage from "./folder/CASCADING/CascadingPage";
import LakipPage from "./folder/LAKIP/LakipPage";
import LhpPage from "./folder/LHP/LhpPage";
import LkePage from "./folder/LKE/LkePage";
import LppdPage from "./folder/LPPD/LppdPage";
import PohonKinerjaPage from "./folder/POHONKINERJA/PohonKinerjaPage";
import SkmPage from "./folder/SKM/SkmPage";
import PegawaiPage from "./folder/PEGAWAI/PegawaiPage";
import JabatanPage from "./folder/JABATAN/JabatanPage";
import CreateJabatanPage from "./folder/JABATAN/createJabatanPage";
import ModulCetakPK from "./folder/PK/components/ModulCetakCover";
import PKEselonII from "./folder/PK/components/PKEselonII";
import PKEselonIII from "./folder/PK/components/PKEselonIII";
import PKEselonIV from "./folder/PK/components/PKEselonIV";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* routes with footer */}
        <Route element={<MainLayout />}>
          <Route path="/overview" element={<OverviewDashboard />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/umkm" element={<UmkmPage />} />
          <Route path="/bantuan" element={<BantuanPage />} />
          <Route path="/duplikat" element={<DuplikatPage />} />
          <Route path="/bantuan-tidak-terdaftar" element={<BantuanTidakTerdaftarPage />} />
          <Route path="/koperasi" element={<KoperasiPage />} />
          <Route path="/koperasidata" element={<KoperasiDataPage />} />
          <Route path="/duplikat-koperasi" element={<DuplikatKoperasi />} />
          <Route path="/duplikat-koperasi/details" element={<DuplikatKoperasiDetails />} />
          <Route path="/sekretariat" element={<DokumenKesekretariatan />} />
          <Route path="/dokumen/sotk" element={<SOTKPage />} />
          <Route path="/dokumen/rka" element={<RkaPage />} />
          <Route path="/dokumen/renstra" element={<RenstraPage />} />
          <Route path="/dokumen/renja" element={<RenjaPage />} />
          <Route path="/dokumen/sop" element={<SopPage />} />
          <Route path="/dokumen/lkpj" element={<LkpjPage />} />
          <Route path="/dokumen/dpa" element={<DpaPage />} />
          <Route path="/dokumen/kak" element={<KakPage />} />
          <Route path="/dokumen/perjanjian-kinerja" element={<PerjanjianKinerjaPage />} />
          <Route path="/dokumen/spip" element={<SpipPage />} />
          <Route path="/dokumen/risk-register" element={<RiskRegisterPage />} />
          <Route path="/dokumen/manajemen-risiko" element={<ManajemenRisikoPage />} />
          <Route path="/dokumen/cascading" element={<CascadingPage />} />
          <Route path="/dokumen/lakip" element={<LakipPage />} />
          <Route path="/dokumen/lhp" element={<LhpPage />} />
          <Route path="/dokumen/lke" element={<LkePage />} />
          <Route path="/dokumen/lppd" element={<LppdPage />} />
          <Route path="/dokumen/pohon-kinerja" element={<PohonKinerjaPage />} />
          <Route path="/dokumen/skm" element={<SkmPage />} />
          <Route path="/dokumen/pegawai" element={<PegawaiPage />} />
          <Route path="/dokumen/jabatan" element={<JabatanPage />} />
          <Route path="/dokumen/create-jabatan-page" element={<CreateJabatanPage />} />
          <Route path="/dokumen/cetak-cover" element={<ModulCetakPK />} />
          <Route path="/dokumen/PKEselonII" element={<PKEselonII />} />
          <Route path="/dokumen/PKEselonIII" element={<PKEselonIII />} />
          <Route path="/dokumen/PKEselonIV" element={<PKEselonIV />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
