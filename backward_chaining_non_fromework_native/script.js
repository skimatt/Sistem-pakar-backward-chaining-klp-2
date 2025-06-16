// Opsi valid untuk validasi
const validOptions = {
  aktif_organisasi: ["ya", "tidak"],
  prestasi: ["ya", "tidak"],
  kondisi_ekonomi: ["lemah", "cukup"],
};

// Aturan dengan prioritas
const aturan = [
  {
    id: "R0",
    kondisi: (kandidat) =>
      kandidat.ipk < 1 &&
      kandidat.aktif_organisasi === "ya" &&
      kandidat.prestasi === "ya" &&
      kandidat.kondisi_ekonomi === "lemah",
    kesimpulan: "dipertimbangkan",
    prioritas: 1,
    deskripsi:
      "IPK < 1 DAN aktif_organisasi = ya DAN prestasi = ya DAN kondisi_ekonomi = lemah → dipertimbangkan",
  },
  {
    id: "R1",
    kondisi: (kandidat) =>
      kandidat.ipk >= 3.5 && kandidat.aktif_organisasi === "ya",
    kesimpulan: "layak",
    prioritas: 2,
    deskripsi: "IPK >= 3.5 DAN aktif_organisasi = ya → layak",
  },
  {
    id: "R2",
    kondisi: (kandidat) =>
      kandidat.ipk >= 2.0 &&
      kandidat.kondisi_ekonomi === "lemah" &&
      kandidat.prestasi === "ya",
    kesimpulan: "layak",
    prioritas: 3,
    deskripsi:
      "IPK >= 2.0 DAN kondisi_ekonomi = lemah DAN prestasi = ya → layak",
  },
  {
    id: "R3",
    kondisi: (kandidat) =>
      kandidat.ipk >= 3.5 && kandidat.aktif_organisasi === "tidak",
    kesimpulan: "dipertimbangkan",
    prioritas: 4,
    deskripsi: "IPK >= 3.5 DAN aktif_organisasi = tidak → dipertimbangkan",
  },
  {
    id: "R4",
    kondisi: (kandidat) =>
      kandidat.ipk >= 2.0 &&
      kandidat.kondisi_ekonomi === "lemah" &&
      kandidat.prestasi === "tidak",
    kesimpulan: "dipertimbangkan",
    prioritas: 5,
    deskripsi:
      "IPK >= 2.0 DAN kondisi_ekonomi = lemah DAN prestasi = tidak → dipertimbangkan",
  },
  {
    id: "R5",
    kondisi: () => true,
    kesimpulan: "tidak_layak",
    prioritas: 6,
    deskripsi: "Default: Tidak memenuhi aturan lain → tidak_layak",
  },
];

// Data kandidat awal
let kandidatData = [
  {
    id: "K1",
    nama: "Ani",
    ipk: 3.8,
    aktif_organisasi: "ya",
    prestasi: "tidak",
    kondisi_ekonomi: "lemah",
    status: null,
    proses: [],
  },
  {
    id: "K2",
    nama: "Budi",
    ipk: 2.2,
    aktif_organisasi: "tidak",
    prestasi: "tidak",
    kondisi_ekonomi: "cukup",
    status: null,
    proses: [],
  },
  {
    id: "K3",
    nama: "Chandra",
    ipk: 3.6,
    aktif_organisasi: "tidak",
    prestasi: "tidak",
    kondisi_ekonomi: "cukup",
    status: null,
    proses: [],
  },
];

// Fungsi untuk menghasilkan ID unik
function generateId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

// Fungsi validasi input
function validateInput({
  nama,
  ipk,
  aktif_organisasi,
  prestasi,
  kondisi_ekonomi,
}) {
  const errors = [];
  if (!nama || nama.trim() === "") errors.push("Nama tidak boleh kosong.");
  if (isNaN(ipk) || ipk < 0 || ipk > 4)
    errors.push("IPK harus antara 0 dan 4.");
  if (!validOptions.aktif_organisasi.includes(aktif_organisasi))
    errors.push("Aktif organisasi harus 'ya' atau 'tidak'.");
  if (!validOptions.prestasi.includes(prestasi))
    errors.push("Prestasi harus 'ya' atau 'tidak'.");
  if (!validOptions.kondisi_ekonomi.includes(kondisi_ekonomi))
    errors.push("Kondisi ekonomi harus 'lemah' atau 'cukup'.");
  return errors;
}

// Fungsi untuk menambah kandidat
function tambahKandidat(data) {
  const errors = validateInput(data);
  const errorMsg = document.getElementById("errorMsg");
  if (errors.length > 0) {
    errorMsg.textContent = errors.join(" ");
    errorMsg.classList.remove("hidden");
    return false;
  }
  errorMsg.classList.add("hidden");
  data.id = generateId("K");
  data.status = null;
  data.proses = [];
  kandidatData.push(data);
  updateTabel();
  return true;
}

// Fungsi Backward Chaining
function backwardChaining(kandidat) {
  const proses = ["Memulai backward chaining"];
  let status = null;

  const sortedAturan = aturan.sort((a, b) => a.prioritas - b.prioritas);
  for (const aturanItem of sortedAturan) {
    proses.push(`Periksa Aturan ${aturanItem.id}: ${aturanItem.deskripsi}`);
    try {
      if (aturanItem.kondisi(kandidat)) {
        status = aturanItem.kesimpulan;
        proses.push(`Aturan ${aturanItem.id} terpenuhi → status = ${status}`);
        break;
      } else {
        proses.push(`Aturan ${aturanItem.id} tidak terpenuhi`);
      }
    } catch (error) {
      proses.push(`Error pada Aturan ${aturanItem.id}: ${error.message}`);
    }
  }

  return { status, proses };
}

// Fungsi untuk memperbarui tabel
function updateTabel() {
  const tbody = document.getElementById("tbodyKandidat");
  if (!tbody) {
    console.error("Tabel kandidat tidak ditemukan.");
    return;
  }
  tbody.innerHTML = "";

  kandidatData.forEach((kandidat, index) => {
    try {
      const { status, proses } = backwardChaining(kandidat);
      kandidat.status = status;
      kandidat.proses = proses;

      const row = document.createElement("tr");
      row.className = "hover:bg-gray-100 dark:hover:bg-gray-700 transition";
      const statusColor =
        kandidat.status === "layak"
          ? "text-green-600 dark:text-green-400"
          : kandidat.status === "dipertimbangkan"
          ? "text-yellow-600 dark:text-yellow-400"
          : "text-red-600 dark:text-red-400";
      row.innerHTML = `
        <td class="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white">${
          kandidat.nama
        }</td>
        <td class="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white">${
          kandidat.ipk
        }</td>
        <td class="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white">${
          kandidat.aktif_organisasi
        }</td>
        <td class="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white">${
          kandidat.prestasi
        }</td>
        <td class="border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white">${
          kandidat.kondisi_ekonomi
        }</td>
        <td class="border border-gray-300 dark:border-gray-600 p-3 ${statusColor} font-medium" title="${
        proses.slice(-1)[0] || "Tidak ada keterangan"
      }">${kandidat.status}</td>
        <td class="border border-gray-300 dark:border-gray-600 p-3">
          <button class="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition prosesBtn" data-index="${index}">Lihat Proses</button>
        </td>
      `;
      tbody.appendChild(row);
    } catch (error) {
      console.error(
        `Error saat memproses kandidat ${kandidat.nama}: ${error.message}`
      );
    }
  });

  document.querySelectorAll(".prosesBtn").forEach((btn) => {
    btn.removeEventListener("click", handleProsesClick);
    btn.addEventListener("click", handleProsesClick);
  });
}

function handleProsesClick(event) {
  const index = event.target.getAttribute("data-index");
  const proses = kandidatData[index]?.proses || ["Tidak ada proses tersedia"];
  showModal(proses);
}

// Fungsi untuk menampilkan modal
function showModal(proses) {
  const modal = document.getElementById("prosesModal");
  const prosesList = document.getElementById("prosesList");
  prosesList.innerHTML = "";
  proses.forEach((step, index) => {
    const li = document.createElement("li");
    li.textContent = `Langkah ${index + 1}: ${step}`;
    li.className = "mb-2";
    prosesList.appendChild(li);
  });
  modal.classList.remove("hidden");
  setTimeout(() => modal.classList.add("show"), 10);
  modal.setAttribute("aria-hidden", "false");
}

// Fungsi untuk menutup modal
function closeModal() {
  const modal = document.getElementById("prosesModal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }, 500);
}

// Inisialisasi tema
function initializeTheme() {
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
  console.log(`Tema awal: ${savedTheme}`); // Debug
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  if (theme === "dark") {
    icon.innerHTML = `
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21.752 15.002A9.35 9.375 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      ></path>
    `;
  } else {
    icon.innerHTML = `
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      ></path>
    `;
  }
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  const newTheme = isDark ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  console.log(`Tema baru: ${newTheme}, Class dark aktif: ${isDark}`); // Debug
  updateThemeIcon(newTheme);
});

// Event listener untuk tombol Tambah
document.getElementById("tambahBtn").addEventListener("click", () => {
  const kandidat = {
    nama: document.getElementById("nama").value.trim(),
    ipk: parseFloat(document.getElementById("ipk").value),
    aktif_organisasi: document.getElementById("aktif_organisasi").value,
    prestasi: document.getElementById("prestasi").value,
    kondisi_ekonomi: document.getElementById("kondisi_ekonomi").value,
  };
  if (tambahKandidat(kandidat)) {
    document.getElementById("nama").value = "";
    document.getElementById("ipk").value = "";
    document.getElementById("aktif_organisasi").value = "ya";
    document.getElementById("prestasi").value = "ya";
    document.getElementById("kondisi_ekonomi").value = "lemah";
  }
});

// Event listener untuk tombol Tutup
document.getElementById("tutupModal").addEventListener("click", closeModal);
document.getElementById("prosesModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Inisialisasi
initializeTheme();
updateTabel();
