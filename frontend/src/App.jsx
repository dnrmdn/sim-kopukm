import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/login/LoginPage";
import MainLayout from "./layouts/MainLayout";
import OverviewDashboard from "./pages/dashboard/OverviewDashboard";
import DashboardPage from "./pages/umkm/DashboardPage";
import UmkmPage from "./pages/umkm/UMKMPage";
import BantuanPage from "./pages/umkm/BantuanPage";
import DuplikatPage from "./pages/umkm/DuplikatPage";
import BantuanTidakTerdaftarPage from "./pages/umkm/BantuanTidakTerdaftarPage";
import KoperasiPage from "./pages/koperasi/KoperasiPage";
import KoperasiDataPage from "./pages/koperasi/KoperasiDataPage";
import DuplikatKoperasi from "./pages/koperasi/DuplikatKoperasi";
import DuplikatKoperasiDetails from "./pages/koperasi/DuplikatKoperasiDetails";
import DokumenKesekretariatan from "./pages/kesekretariatan/DokumenKesekretariatan";
import SOTKPage from "./pages/kesekretariatan/PPAKP/SOTKPage";
import RkaPage from "./pages/kesekretariatan/PPAKP/RkaPage";
import RenstraPage from "./pages/kesekretariatan/PPAKP/RenstraPage";
import RenjaPage from "./pages/kesekretariatan/PPAKP/RenjaPage";
import SopPage from "./pages/kesekretariatan/SopPage";
import LkpjPage from "./pages/kesekretariatan/PPAKP/LkpjPage";
import DpaPage from "./pages/kesekretariatan/PPAKP/DpaPage";
import KakPage from "./pages/kesekretariatan/PPAKP/KakPage";
import PerjanjianKinerjaPage from "./pages/kesekretariatan/PPAKP/PerjanjianKinerjaPage";
import RencanaAksiPage from "./pages/kesekretariatan/PPAKP/RencanaAksiPage";
import SpipPage from "./pages/kesekretariatan/PPAKP/SpipPage";
import RiskRegisterPage from "./pages/kesekretariatan/PPAKP/RiskRegisterPage";
import ManajemenRisikoPage from "./pages/kesekretariatan/PPAKP/ManajemenRisikoPage";
import CascadingPage from "./pages/kesekretariatan/PPAKP/CascadingPage";
import LakipPage from "./pages/kesekretariatan/PPAKP/LakipPage";
import LhpPage from "./pages/kesekretariatan/PPAKP/LhpPage";
import LkePage from "./pages/kesekretariatan/PPAKP/LkePage";
import LppdPage from "./pages/kesekretariatan/PPAKP/LppdPage";
import PohonKinerjaPage from "./pages/kesekretariatan/PPAKP/PohonKinerjaPage";
import SkmPage from "./pages/kesekretariatan/PPAKP/SkmPage";
import PegawaiPage from "./pages/kesekretariatan/UMPEG/PegawaiPage";
import JabatanPage from "./pages/kesekretariatan/UMPEG/JabatanPage";


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
          <Route path="/dokumen/rencana-aksi" element={<RencanaAksiPage />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
