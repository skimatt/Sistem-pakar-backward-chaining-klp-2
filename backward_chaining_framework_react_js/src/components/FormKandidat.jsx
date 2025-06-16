import { useState } from "react";

function FormKandidat({ tambahKandidat }) {
  const [formData, setFormData] = useState({
    nama: "",
    ipk: "",
    aktif_organisasi: "ya",
    prestasi: "ya",
    kondisi_ekonomi: "lemah",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleTambah = () => {
    const { nama, ipk, aktif_organisasi, prestasi, kondisi_ekonomi } = formData;
    const ipkNum = parseFloat(ipk);

    if (!nama.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    if (isNaN(ipkNum) || ipkNum < 0 || ipkNum > 4) {
      setError("IPK harus antara 0 dan 4.");
      return;
    }

    tambahKandidat({
      nama,
      ipk: ipkNum,
      aktif_organisasi,
      prestasi,
      kondisi_ekonomi,
    });

    setFormData({
      nama: "",
      ipk: "",
      aktif_organisasi: "ya",
      prestasi: "ya",
      kondisi_ekonomi: "lemah",
    });
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg mb-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Masukkan Data Kandidat
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nama" className="block text-gray-700 font-medium">
            Nama
          </label>
          <input
            id="nama"
            type="text"
            value={formData.nama}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Ani"
          />
        </div>
        <div>
          <label htmlFor="ipk" className="block text-gray-700 font-medium">
            IPK (0.0 - 4.0)
          </label>
          <input
            id="ipk"
            type="number"
            step="0.1"
            min="0"
            max="4"
            value={formData.ipk}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: 3.8"
          />
        </div>
        <div>
          <label
            htmlFor="aktif_organisasi"
            className="block text-gray-700 font-medium"
          >
            Aktif Organisasi
          </label>
          <select
            id="aktif_organisasi"
            value={formData.aktif_organisasi}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>
        <div>
          <label htmlFor="prestasi" className="block text-gray-700 font-medium">
            Prestasi Non-Akademik
          </label>
          <select
            id="prestasi"
            value={formData.prestasi}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="kondisi_ekonomi"
            className="block text-gray-700 font-medium"
          >
            Kondisi Ekonomi
          </label>
          <select
            id="kondisi_ekonomi"
            value={formData.kondisi_ekonomi}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="lemah">Lemah</option>
            <option value="cukup">Cukup</option>
          </select>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleTambah}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Tambah Kandidat
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 error-msg show">{error}</p>}
    </section>
  );
}

export default FormKandidat;
