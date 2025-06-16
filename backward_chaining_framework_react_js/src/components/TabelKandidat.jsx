import { backwardChaining } from "../utils/backwardChaining.js";

function TabelKandidat({ kandidatData, hapusKandidat, bukaModal }) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Hasil Evaluasi Kandidat
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Nama</th>
              <th className="border p-3 text-left">IPK</th>
              <th className="border p-3 text-left">Aktif Organisasi</th>
              <th className="border p-3 text-left">Prestasi</th>
              <th className="border p-3 text-left">Kondisi Ekonomi</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kandidatData.map((kandidat, index) => {
              const { status, proses } = backwardChaining(kandidat);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-3">{kandidat.nama}</td>
                  <td className="border p-3">{kandidat.ipk}</td>
                  <td className="border p-3">{kandidat.aktif_organisasi}</td>
                  <td className="border p-3">{kandidat.prestasi}</td>
                  <td className="border p-3">{kandidat.kondisi_ekonomi}</td>
                  <td
                    className={`border p-3 font-medium ${
                      status === "layak"
                        ? "text-green-600"
                        : status === "dipertimbangkan"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {status}
                  </td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => bukaModal(proses)}
                      className="text-blue-600 hover:underline"
                    >
                      Lihat Proses
                    </button>
                    <button
                      onClick={() => hapusKandidat(index)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TabelKandidat;
