import { useState } from "react";
import FormKandidat from "./components/FormKandidat.jsx";
import TabelKandidat from "./components/TabelKandidat.jsx";
import ModalProses from "./components/ModalProses.jsx";
import { backwardChaining } from "./utils/backwardChaining.js";

const initialKandidat = [
  {
    nama: "Ani",
    ipk: 3.8,
    aktif_organisasi: "ya",
    prestasi: "tidak",
    kondisi_ekonomi: "lemah",
    status: null,
    proses: [],
  },
  {
    nama: "Budi",
    ipk: 3.2,
    aktif_organisasi: "tidak",
    prestasi: "ya",
    kondisi_ekonomi: "lemah",
    status: null,
    proses: [],
  },
  {
    nama: "Chandra",
    ipk: 3.6,
    aktif_organisasi: "tidak",
    prestasi: "tidak",
    kondisi_ekonomi: "cukup",
    status: null,
    proses: [],
  },
];

function App() {
  const [kandidatData, setKandidatData] = useState(initialKandidat);
  const [modalProses, setModalProses] = useState({ show: false, proses: [] });

  const tambahKandidat = (kandidatBaru) => {
    const { status, proses } = backwardChaining(kandidatBaru);
    setKandidatData([...kandidatData, { ...kandidatBaru, status, proses }]);
  };

  const hapusKandidat = (index) => {
    setKandidatData(kandidatData.filter((_, i) => i !== index));
  };

  const bukaModal = (proses) => {
    setModalProses({ show: true, proses });
  };

  const tutupModal = () => {
    setModalProses({ show: false, proses: [] });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700">
          Sistem Pakar Penilaian Beasiswa
        </h1>
        <p className="text-gray-600 mt-2">
          Simulasi backward chaining untuk menentukan kelayakan beasiswa
          berdasarkan kriteria akademik dan non-akademik.
        </p>
      </header>

      <FormKandidat tambahKandidat={tambahKandidat} />
      <TabelKandidat
        kandidatData={kandidatData}
        hapusKandidat={hapusKandidat}
        bukaModal={bukaModal}
      />
      <ModalProses
        show={modalProses.show}
        proses={modalProses.proses}
        tutupModal={tutupModal}
      />
    </div>
  );
}

export default App;
