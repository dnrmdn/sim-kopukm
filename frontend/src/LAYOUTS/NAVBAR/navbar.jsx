import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import logo_baru from "@/assets/logo_baru.png";
import logo_kabkar from "@/assets/logo_karawang.png";
import NavUser from "./nav-user";
import { Link } from "react-router-dom";

export const DinkopLogo = () => (
  <Link to="/overview">
    <img
      src={logo_baru}
      alt="Logo DINKOPUKM"
      className="h-7 md:h-10 w-auto object-contain cursor-pointer"
    />
  </Link>
);

export const KabKarLogo = () => (
  <Link to="/overview">
    <img
      src={logo_kabkar}
      alt="Logo Kab.Karawang"
      className="h-7 md:h-10 w-auto object-contain cursor-pointer"
    />
  </Link>
);

export default function NavbarApp() {
  return (
    <div className="sticky top-0 z-50 px-3 md:px-6 pt-3 pb-2">
      <nav className="flex items-center justify-between px-4 md:px-6 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm">

        {/* Brand - Logos */}
        <div className="flex items-center gap-3">
          <KabKarLogo />
          {/* Divider */}
          <div className="w-px h-7 bg-slate-200" />
          <DinkopLogo />
        </div>

        {/* Right - NavUser */}
        <div>
          <NavUser />
        </div>

      </nav>
    </div>
  );
}