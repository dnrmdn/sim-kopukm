import React from "react";
import { Outlet } from "react-router-dom";
import FooterNav from "../components/dashboard/FooterNav";
import NavbarApp from "../components/navbar/navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen pb-24">
      {" "}
      {/* pb-24 supaya konten tidak tertutup */}
      <NavbarApp/>
      <Outlet />
      <FooterNav />
    </div>
  );
}
