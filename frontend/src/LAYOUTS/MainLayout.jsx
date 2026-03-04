import React from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "@/LAYOUTS/NAVBAR/FooterNav";
import NavbarApp from "@/LAYOUTS/NAVBAR/navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      {" "}
      {/* pb-24 supaya konten tidak tertutup */}
      <NavbarApp/>
      <Outlet />
      <FooterNav />
    </div>
  );
}
