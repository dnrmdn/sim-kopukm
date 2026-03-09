import { useNavigate } from 'react-router-dom';

import logoDinkopNew from '@/assets/logo_baru.png';
import logoKarawang from '@/assets/logo_karawang.png';
import logoKoperasi from '@/assets/logo_koperasi.png';
import DecorativeBackground from './components/decorativeBg';
import BrandingSection from './components/brandingSection';
import LoginCard from './components/loginCard';

const BRANDING_DATA = {
  title: 'Selamat Datang',
  description: 'Masuk untuk mengelola data umkm, koperasi, pelayanan, dan laporan.',
  features: [
    'Akses laporan real-time',
    'Kelola pengaduan dan layanan',
    'Dashboard analisa'
  ]
};

const LOGIN_CARD_DATA = {
  title: 'Login DISPERINDAG KOPUKM',
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

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    console.log('Login success:', user);
    navigate('/overview');
  };

  const handleNavigateRegister = () => {
    navigate('/register');
  };

  const handleNavigateForgot = () => {
    navigate('/forgot-password');
  };

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

        {/* Right: Login Card */}
        <LoginCard
          logos={LOGIN_CARD_DATA.logos}
          title={LOGIN_CARD_DATA.title}
          onLoginSuccess={handleLoginSuccess}
          onNavigateRegister={handleNavigateRegister}
          onNavigateForgot={handleNavigateForgot}
        />
      </div>
    </div>
  );
};