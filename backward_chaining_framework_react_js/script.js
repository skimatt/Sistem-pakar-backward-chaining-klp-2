// Data kandidat awal (konsisten dengan makalah dan perhitungan manual)
const kandidatData = [
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
    ipk: 2.2,
    aktif_organisasi: "tidak",
    prestasi: "tidak",
    kondisi_ekonomi: "cukup",
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

// Aturan logika (sama dengan makalah)
const aturan = [
  {
    id: 1,
    kondisi: (kandidat) =>
      kandidat.ipk >= 3.5 && kandidat.aktif_organisasi === "ya",
    kesimpulan: "layak",
    deskripsi: "IPK >= 3.5 DAN aktif_organisasi = ya → layak",
  },
  {
    id: 2,
    kondisi: (kandidat) =>
      kandidat.kondisi_ekonomi === "lemah" && kandidat.prestasi === "ya",
    kesimpulan: "layak",
    deskripsi: "kondisi_ekonomi = lemah DAN prestasi = ya → layak",
  },
  {
    id: 3,
    kondisi: (kandidat) =>
      kandidat.ipk >= 3.5 && kandidat.aktif_organisasi === "tidak",
    kesimpulan: "dipertimbangkan",
    deskripsi: "IPK >= 3.5 DAN aktif_organisasi = tidak → dipertimbangkan",
  },
  {
    id: 4,
    kondisi: (kandidat) =>
      kandidat.kondisi_ekonomi === "lemah" && kandidat.prestasi === "tidak",
    kesimpulan: "dipertimbangkan",
    deskripsi: "kondisi_ekonomi = lemah DAN prestasi = tidak → dipertimbangkan",
  },
  {
    id: 5,
    kondisi: (kandidat) => kandidat.ipk < 3.5,
    kesimpulan: "tidak_layak",
    deskripsi: "IPK < 3.5 → tidak_layak",
  },
];

// Fungsi Backward Chaining
function backwardChaining(kandidat) {
  let proses = [];
  let status = null;

  // Tujuan 1: Cek status = layak
  proses.push("Tujuan: status = layak");
  for (let aturanItem of aturan.filter((a) => a.kesimpulan === "layak")) {
    proses.push(`Periksa Aturan ${aturanItem.id}: ${aturanItem.deskripsi}`);
    if (aturanItem.kondisi(kandidat)) {
      status = "layak";
      proses.push(`Aturan ${aturanItem.id} terpenuhi → status = layak`);
      break;
    } else {
      proses.push(`Aturan ${aturanItem.id} tidak terpenuhi`);
    }
  }

  // Tujuan 2: Jika tidak layak, cek status = dipertimbangkan
  if (!status) {
    proses.push("Tujuan: status = dipertimbangkan");
    for (let aturanItem of aturan.filter(
      (a) => a.kesimpulan === "dipertimbangkan"
    )) {
      proses.push(`Periksa Aturan ${aturanItem.id}: ${aturanItem.deskripsi}`);
      if (aturanItem.kondisi(kandidat)) {
        status = "dipertimbangkan";
        proses.push(
          `Aturan ${aturanItem.id} terpenuhi → status = dipertimbangkan`
        );
        break;
      } else {
        proses.push(`Aturan ${aturanItem.id} tidak terpenuhi`);
      }
    }
  }

  // Tujuan 3: Jika tidak dipertimbangkan, cek status = tidak_layak
  if (!status) {
    let aturanItem = aturan.find((a) => a.kesimpulan === "tidak_layak");
    proses.push(`Periksa Aturan ${aturanItem.id}: ${aturanItem.deskripsi}`);
    if (aturanItem.kondisi(kandidat)) {
      status = "tidak_layak";
      proses.push(`Aturan ${aturanItem.id} terpenuhi → status = tidak_layak`);
    }
  }

  return { status, proses };
}

// Fungsi untuk memperbarui tabel
function updateTabel() {
  const tbody = document.getElementById("tbodyKandidat");
  tbody.innerHTML = "";

  kandidatData.forEach((kandidat, index) => {
    const { status, proses } = backwardChaining(kandidat);
    kandidat.status = status;
    kandidat.proses = proses;

    const row = document.createElement("tr");
    row.className = "hover:bg-gray-50";
    row.innerHTML = `
            <td class="border p-3">${kandidat.nama}</td>
            <td class="border p-3">${kandidat.ipk}</td>
            <td class="border p-3">${kandidat.aktif_organisasi}</td>
            <td class="border p-3">${kandidat.prestasi}</td>
            <td class="border p-3">${kandidat.kondisi_ekonomi}</td>
            <td class="border p-3 ${
              status === "layak"
                ? "text-green-600 font-medium"
                : status === "dipertimbangkan"
                ? "text-yellow-600 font-medium"
                : "text-red-600 font-medium"
            }">
                ${status}
            </td>
            <td class="border p-3">
                <button class="text-blue-600 hover:underline prosesBtn" data-index="${index}">Lihat Proses</button>
            </td>
        `;
    tbody.appendChild(row);
  });

  // Tambahkan event listener untuk tombol proses
  document.querySelectorAll(".prosesBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      const proses = kandidatData[index].proses;
      showModal(proses);
    });
  });
}

// Fungsi untuk menampilkan modal
function showModal(proses) {
  const modal = document.getElementById("prosesModal");
  const prosesList = document.getElementById("prosesList");
  prosesList.innerHTML = "";
  proses.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    prosesList.appendChild(li);
  });
  modal.classList.remove("hidden");
  modal.classList.add("show");
}

// Fungsi untuk menutup modal
function closeModal() {
  const modal = document.getElementById("prosesModal");
  modal.classList.remove("show");
  setTimeout(() => modal.classList.add("hidden"), 300);
}

// Event listener untuk tombol Tambah
document.getElementById("tambahBtn").addEventListener("click", () => {
  const nama = document.getElementById("nama").value.trim();
  const ipk = parseFloat(document.getElementById("ipk").value);
  const aktif_organisasi = document.getElementById("aktif_organisasi").value;
  const prestasi = document.getElementById("prestasi").value;
  const kondisi_ekonomi = document.getElementById("kondisi_ekonomi").value;
  const errorMsg = document.getElementById("errorMsg");

  // Validasi input
  if (!nama) {
    errorMsg.textContent = "Nama tidak boleh kosong.";
    errorMsg.classList.add("show");
    return;
  }
  if (isNaN(ipk) || ipk < 0 || ipk > 4) {
    errorMsg.textContent = "IPK harus antara 0 dan 4.";
    errorMsg.classList.add("show");
    return;
  }
  errorMsg.classList.remove("show");

  // Tambah kandidat baru
  kandidatData.push({
    nama,
    ipk,
    aktif_organisasi,
    prestasi,
    kondisi_ekonomi,
    status: null,
    proses: [],
  });

  // Reset form
  document.getElementById("nama").value = "";
  document.getElementById("ipk").value = "";
  document.getElementById("aktif_organisasi").value = "ya";
  document.getElementById("prestasi").value = "ya";
  document.getElementById("kondisi_ekonomi").value = "lemah";

  // Perbarui tabel
  updateTabel();
});

// Event listener untuk tombol Tutup Modal
document.getElementById("tutupModal").addEventListener("click", closeModal);

// Inisialisasi tabel dengan data awal
updateTabel();
