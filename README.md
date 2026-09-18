# Portofolio — Ketut Agus Suardita

Website portofolio multi-halaman: HTML5 statis, Tailwind CSS v4 (CLI lokal,
tanpa CDN), dan Vanilla JavaScript (ES6+).

## Struktur folder

```
portfolio/
├── index.html            Beranda
├── about.html             Tentang Saya & Pendidikan
├── projects.html          Daftar Proyek (filter + modal detail)
├── achievements.html      Prestasi, Sertifikasi, LinkedIn highlights
├── contact.html            Formulir Kontak & Sosial Media
├── project-detail.html    TEMPLATE kosong — duplikat kalau menambah proyek baru nanti
├── sangket-desa.html                   Studi kasus: Sangket Desa
├── kerobokan-beach-adventure.html      Studi kasus: Kerobokan Beach Adventure
├── siwita-buleleng.html                Studi kasus: SI WITA BULELENG
├── demo-kalkulator-bangun-ruang.html   Demo interaktif: kalkulator bangun ruang
├── medallion-lks-nasional.html   Detail prestasi: Medallion For Excellence (LKS Nasional 2025)
├── juara1-lks-provinsi.html      Detail prestasi: Juara 1 (LKS Provinsi Bali 2025)
├── juara2-eytho.html             Detail prestasi: Juara 2 Web Craft (EYTHO 2025)
├── harapan1-epim.html            Detail prestasi: Harapan 1 Web Programming (EPIM 2024)
├── magang-timedoor.html          Detail prestasi: Magang PT. Timedoor Indonesia
├── package.json
├── src/
│   └── input.css          Sumber Tailwind + token desain kustom (@theme)
├── dist/
│   └── output.css         CSS hasil build (sudah di-generate, siap pakai)
├── assets/
│   ├── portrait-main-duotone.jpg   Foto profil (dipakai di hero & about), diberi treatment
│   │                               duotone agar senada dengan palet situs
│   ├── portrait-main-color.jpg     Versi warna asli (belum dipakai) — tinggal ganti
│   │                               src gambar di index.html/about.html jika lebih suka ini
│   └── certificates/               5 sertifikat asli (dikompres untuk web), dipakai di
│                                    halaman detail prestasi
└── js/
    ├── main.js            Menu mobile, tahun footer, dsb — dipakai semua halaman
    ├── projects.js         Filter kategori + modal detail proyek
    ├── contact.js          Validasi form + kirim via mailto:
    ├── kalkulator-ruang.js Logika kalkulator bangun ruang (jQuery)
    └── vendor/
        └── jquery-3.7.1.min.js   jQuery lokal (bukan CDN)
```

## Menjalankan / build ulang CSS

`dist/output.css` sudah di-build sehingga situs bisa langsung dibuka. Untuk
mengembangkan lebih lanjut (menambah kelas Tailwind baru), instal Tailwind CLI
secara lokal lalu build ulang:

```bash
npm install
npm run build     # build sekali (minified)
npm run watch      # rebuild otomatis saat src/input.css atau file HTML berubah
```

## Kalkulator Bangun Ruang

Buka `demo-kalkulator-bangun-ruang.html` (langsung double-click, tanpa server).
Menghitung volume dan luas permukaan untuk: kubus, balok, tabung, bola, kerucut,
limas segi empat, dan prisma segitiga.

Logikanya ada di `js/kalkulator-ruang.js`, ditulis dengan **jQuery 3.7.1** yang
dimuat dari berkas lokal `js/vendor/jquery-3.7.1.min.js` (bukan CDN), supaya
halaman tetap berfungsi saat dibuka offline.

Semua bangun didefinisikan dalam satu objek `SHAPES`, jadi menambah bangun baru
cukup menambah satu entri:

```js
limas_segitiga: {
  name: "Limas Segitiga",
  fields: [
    { key: "alas", label: "Alas (a)", placeholder: "contoh: 6" },
    { key: "tinggi", label: "Tinggi (t)", placeholder: "contoh: 9" }
  ],
  volume:  (p) => (1/3) * (0.5 * p.alas * p.alas) * p.tinggi,
  surface: (p) => /* rumus luas permukaan */ 0,
  volumeText:  "V = 1/3 × luas alas × t",
  surfaceText: "L = luas alas + jumlah luas sisi tegak",
  notes: ["a = sisi alas, t = tinggi limas"]
}
```

Lalu tambahkan satu `<option value="limas_segitiga">` di `<select id="shape">`
pada halaman demo. Formulir inputnya dibuat otomatis — tidak perlu menulis HTML
input secara manual.

Catatan:
- Rumus luas permukaan prisma segitiga mengasumsikan alasnya segitiga siku-siku,
  dan limas segi empat mengasumsikan alas persegi. Kalau butuh bentuk yang lebih
  umum, tambahkan field untuk sisi-sisi alasnya.
- Input memakai `type="text"` + `inputmode="decimal"`, bukan `type="number"`,
  supaya angka berkoma ala Indonesia ("2,5") tetap terbaca — `type="number"`
  membuang nilai berkoma menjadi string kosong.

## Halaman studi kasus proyek

Tiga proyek di `projects.html` punya halaman studi kasus sendiri (bukan lagi
menunjuk ke satu template yang sama):

- `sangket-desa.html`
- `kerobokan-beach-adventure.html`
- `siwita-buleleng.html`

Kalkulator Bangun Ruang tidak punya halaman studi kasus terpisah — tautannya
langsung ke demo interaktifnya sendiri (`demo-kalkulator-bangun-ruang.html`).

Isinya (Masalah / Pendekatan / Hasil / Yang saya pelajari) sudah ditulis
lengkap. **Yang perlu Anda lakukan hanya mengganti foto**: tiap halaman memakai
`./assets/project-placeholder.svg` sebagai gambar sampul dan galeri — cukup
timpa file itu dengan screenshot asli bernama sama, atau ganti atribut `src`
pada tiap `<img>` (ditandai komentar `<!-- GANTI src ... -->` di HTML) agar
tiap proyek punya gambar sendiri-sendiri.

Halaman-halaman ini saling terhubung lewat kartu "Proyek sebelumnya / berikutnya"
di bagian bawah, melingkar di antara ketiganya.

`project-detail.html` masih ada sebagai **template kosong** kalau nanti Anda
menambah proyek baru — tinggal duplikat dan isi bagian yang ditandai
`<!-- GANTI: ... -->`.

## Halaman detail prestasi

Lima sertifikat asli yang Anda kirim sudah dipasang, masing-masing di halaman
detailnya sendiri (bukan cuma dideskripsikan dengan teks):

- `medallion-lks-nasional.html`
- `juara1-lks-provinsi.html`
- `juara2-eytho.html`
- `harapan1-epim.html`
- `magang-timedoor.html`

Gambar sertifikatnya sendiri disimpan di `assets/certificates/` (sudah
dikompres untuk web, resolusi asli tetap ada di berkas yang Anda unggah kalau
sewaktu-waktu perlu cetak). Tiap halaman menampilkan sertifikat asli, tanggal,
penyelenggara, nomor sertifikat, dan konteks singkat acaranya. Kelimanya saling
terhubung lewat kartu "Sebelumnya / Berikutnya", melingkar sesuai urutan di
atas, dan `achievements.html` sudah ditautkan ke masing-masing lewat tombol
"Lihat sertifikat →".

**Catatan koreksi:** sertifikat EPIM ternyata bertuliskan **Harapan 1**
(setara honorable mention), bukan "1st Runner-Up" seperti yang tertulis di
CV/versi sebelumnya situs ini. Saya sudah perbaiki teksnya di `achievements.html`
dan `harapan1-epim.html`, dan menambahkan catatan koreksi kecil di halaman
detailnya supaya transparan.

## Yang masih perlu Anda isi

Kontak, LinkedIn, GitHub, dan sertifikat sudah terisi dengan data asli. Yang
tersisa hanya:

- **Foto proyek** — kelima halaman studi kasus/demo di atas masih memakai
  `./assets/project-placeholder.svg` untuk gambar sampul dan galeri.
- **Tautan live demo/repo** pada tiap halaman studi kasus proyek (`<!-- GANTI
  href tombol -->`) — saat ini masih `#`.
- **Peran/Periode/Jenis/Tim** pada blok meta tiap studi kasus proyek adalah
  perkiraan yang wajar, bukan angka yang pernah Anda konfirmasi — cek ulang
  kalau meleset.

## Deploy

Karena ini situs statis murni, bisa langsung di-deploy ke Vercel, Netlify,
atau Railway tanpa build step tambahan (drag-and-drop folder ini, atau
hubungkan repo Git-nya).

## Catatan tentang foto

Dari dua foto yang dikirim, saya hanya memasang foto dengan jas/kemeja (di depan
meja kerja) ke situs — sudah di-crop dan diberi treatment duotone agar senada
dengan palet warna. Foto kedua (selfie cermin, kaos tanpa lengan) terasa terlalu
kasual untuk portofolio profesional, jadi saya tidak sertakan. Kalau Anda tetap
ingin memakainya (misalnya di bagian "di luar layar" yang lebih personal), tinggal
minta — saya bisa crop dan proses foto itu juga.
