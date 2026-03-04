import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import logo_baru from "@/assets/logo_baru.png";
import logo_kabkar from "@/assets/logo_karawang.png";
import NavUser from "./nav-user";
import { Link } from "react-router-dom";

export const DinkopLogo = () => {
  return (
    <Link to="/overview">
      <img src={logo_baru} alt="Logo DINKOPUKM" className="h-6 md:h-12 w-auto object-contain cursor-pointer" />
    </Link>
  );
};

export const KabKarLogo = () => {
  return (
    <Link to="/overview">
      <img src={logo_kabkar} alt="Logo Kab.Karawang" className="h-6 md:h-10 w-auto object-contain cursor-pointer" />
    </Link>
  );
};

export default function NavbarApp() {
  return (
    <Navbar className="pb-2 pt-2 md:pb-4 md:pt-4 rounded-b-4xl bg-[#8c9fcc]">
      <NavbarBrand>
        <KabKarLogo />
        <DinkopLogo />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center"></NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <NavUser />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
