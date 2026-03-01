import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LOGIN/LoginPage";
import MainLayout from "./LAYOUTS/MainLayout";
import OverviewDashboard from "./DASHBOARD/OverviewDashboard";
import DashboardPage from "./DASHBOARD/DashboardUMKM";
import UmkmPage from "./UMKM/UMKMPage";
import BantuanPage from "./UMKM/BantuanPage";
import DuplikatPage from "./UMKM/DuplikatPage";
import BantuanTidakTerdaftarPage from "./UMKM/BantuanTidakTerdaftarPage";
import KoperasiPage from "./KOPERASI/KoperasiPage";
import KoperasiDataPage from "./KOPERASI/KoperasiDataPage";
import DuplikatKoperasi from "./KOPERASI/DuplikatKoperasi";
import DuplikatKoperasiDetails from "./KOPERASI/DuplikatKoperasiDetails";
import DokumenKesekretariatan from "./DASHBOARD/Sekretariat";
import SOTKPage from "./SOTK/SOTKPage";

import RkaPage from "./RKA/RkaPage";
import RenstraPage from "./RENSTRA/RenstraPage";

import RenjaPage from "./RENJA/RenjaPage";
import SopPage from "./SOP/SopPage";
import LkpjPage from "./LKPJ/LkpjPage";
import DpaPage from "./DPA/DpaPage";
import KakPage from "./KAK/KakPage";
import PerjanjianKinerjaPage from "./PK/PerjanjianKinerjaPage";
import SpipPage from "./SPIP/SpipPage";
import RiskRegisterPage from "./RESIKO/RiskRegisterPage";
import ManajemenRisikoPage from "./RESIKO/ManajemenRisikoPage";
import CascadingPage from "./CASCADING/CascadingPage";
import LakipPage from "./LAKIP/LakipPage";
import LhpPage from "./LHP/LhpPage";
import LkePage from "./LKE/LkePage";
import LppdPage from "./LPPD/LppdPage";
import PohonKinerjaPage from "./POHONKINERJA/PohonKinerjaPage";
import SkmPage from "./SKM/SkmPage";
import PegawaiPage from "./PEGAWAI/PegawaiPage";
import JabatanPage from "./JABATAN/JabatanPage";
import CreateJabatanPage from "./JABATAN/createJabatanPage";
import ModulCetakPK from "./PK/components/ModulCetakCover";
import PKEselonII from "./PK/components/PKEselonII";
import PKEselonIII from "./PK/components/PKEselonIII";
import PKEselonIV from "./PK/components/PKEselonIV";



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
