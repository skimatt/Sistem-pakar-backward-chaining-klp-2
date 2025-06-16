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

export function backwardChaining(kandidat) {
  let proses = [];
  let status = null;

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
