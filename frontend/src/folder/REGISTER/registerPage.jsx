import { useNavigate } from 'react-router-dom';

import logoDinkopNew from '@/assets/logo_baru.png';
import logoKarawang from '@/assets/logo_karawang.png';
import logoKoperasi from '@/assets/logo_koperasi.png';
import RegisterCard from './components/cardRegister';
import BrandingSection from '../LOGIN/components/brandingSection';
import DecorativeBackground from '../LOGIN/components/decorativeBg';

const BRANDING_DATA = {
  title: 'Bergabunglah dengan Kami',
  description: 'Daftar akun baru untuk mengelola data umkm, koperasi, pelayanan, dan laporan.',
  features: [
    'Akses laporan real-time',
    'Kelola pengaduan dan layanan',
    'Dashboard analisa',
    'Integrasi data lengkap'
  ]
};

const REGISTER_CARD_DATA = {
  title: 'Daftar SIM-KOPUKM',
  logos: [
    {
      src: logoKarawang,
      alt: 'Logo Kabupaten Karawang'
    },
    {
      src: logoKoperasi,
      alt: 'Logo Koperasi'
    }
  ]
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (userData) => {
    console.log('Register success:', userData);
    // Tampilkan success message atau redirect
    alert('Registrasi berhasil! Silakan login dengan akun Anda.');
    navigate('/login');
  };

  const handleNavigateLogin = () => {
    navigate('/login');
  };

//   const handleNavigateTerms = () => {
//     navigate('/terms');
//   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-50 via-white to-rose-50 p-6">
      {/* Decorative Elements */}
      <DecorativeBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Branding Section */}
        <BrandingSection
          logoSrc={logoDinkopNew}
          title={BRANDING_DATA.title}
          description={BRANDING_DATA.description}
          features={BRANDING_DATA.features}
        />

        {/* Right: Register Card */}
        <RegisterCard
          logos={REGISTER_CARD_DATA.logos}
          title={REGISTER_CARD_DATA.title}
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateLogin={handleNavigateLogin}
        //   onNavigateTerms={handleNavigateTerms}
        />
      </div>
    </div>
  );
}