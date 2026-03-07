import React from "react";
import { useNavigate } from "react-router-dom";
import { createPegawai } from "../../../services/pegawaiService";
import FormPegawai from "./formPegawai";

export default function TambahPegawai() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      await createPegawai(data);
      navigate("/dokumen/pegawai");
    } catch (error) {
      console.error("Gagal menambahkan pegawai:", error);
    }
  };

  return <FormPegawai onSubmit={handleCreate} />;
}