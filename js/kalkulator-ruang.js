// ============ Kalkulator Bangun Ruang (jQuery) ============
// jQuery 3.7.1 dimuat secara lokal dari js/vendor/ — tanpa CDN, agar situs tetap
// berjalan saat dibuka offline maupun saat di-deploy.
//
// Pola: satu objek konfigurasi SHAPES mendefinisikan field input, rumus volume,
// rumus luas permukaan, dan catatan. Menambah bangun ruang baru cukup dengan
// menambah satu entri di sini — logika render dan perhitungan tidak perlu diubah.

const SHAPES = {
  kubus: {
    name: "Kubus",
    fields: [{ key: "sisi", label: "Sisi (s)", placeholder: "contoh: 5" }],
    volume: (p) => p.sisi ** 3,
    surface: (p) => 6 * p.sisi ** 2,
    volumeText: "V = s³",
    surfaceText: "L = 6 × s²",
    notes: ["s = panjang rusuk"],
  },
  balok: {
    name: "Balok",
    fields: [
      { key: "panjang", label: "Panjang (p)", placeholder: "contoh: 8" },
      { key: "lebar", label: "Lebar (l)", placeholder: "contoh: 5" },
      { key: "tinggi", label: "Tinggi (t)", placeholder: "contoh: 3" },
    ],
    volume: (p) => p.panjang * p.lebar * p.tinggi,
    surface: (p) => 2 * (p.panjang * p.lebar + p.panjang * p.tinggi + p.lebar * p.tinggi),
    volumeText: "V = p × l × t",
    surfaceText: "L = 2 × (pl + pt + lt)",
    notes: ["p = panjang, l = lebar, t = tinggi"],
  },
  tabung: {
    name: "Tabung",
    fields: [
      { key: "jari", label: "Jari-jari (r)", placeholder: "contoh: 7" },
      { key: "tinggi", label: "Tinggi (t)", placeholder: "contoh: 10" },
    ],
    volume: (p) => Math.PI * p.jari ** 2 * p.tinggi,
    surface: (p) => 2 * Math.PI * p.jari * (p.jari + p.tinggi),
    volumeText: "V = π × r² × t",
    surfaceText: "L = 2πr × (r + t)",
    notes: ["r = jari-jari alas, t = tinggi"],
  },
  bola: {
    name: "Bola",
    fields: [{ key: "jari", label: "Jari-jari (r)", placeholder: "contoh: 6" }],
    volume: (p) => (4 / 3) * Math.PI * p.jari ** 3,
    surface: (p) => 4 * Math.PI * p.jari ** 2,
    volumeText: "V = 4/3 × π × r³",
    surfaceText: "L = 4 × π × r²",
    notes: ["r = jari-jari bola"],
  },
  kerucut: {
    name: "Kerucut",
    fields: [
      { key: "jari", label: "Jari-jari (r)", placeholder: "contoh: 3" },
      { key: "tinggi", label: "Tinggi (t)", placeholder: "contoh: 4" },
    ],
    volume: (p) => (1 / 3) * Math.PI * p.jari ** 2 * p.tinggi,
    // garis pelukis s dihitung dari r dan t: s = √(r² + t²)
    surface: (p) => {
      const s = Math.sqrt(p.jari ** 2 + p.tinggi ** 2);
      return Math.PI * p.jari * (p.jari + s);
    },
    volumeText: "V = 1/3 × π × r² × t",
    surfaceText: "L = πr × (r + s), dengan s = √(r² + t²)",
    notes: ["r = jari-jari alas, t = tinggi", "s = garis pelukis, dihitung otomatis"],
  },
  limas_segiempat: {
    name: "Limas Segi Empat",
    fields: [
      { key: "sisi_alas", label: "Sisi Alas (a)", placeholder: "contoh: 6" },
      { key: "tinggi", label: "Tinggi Limas (t)", placeholder: "contoh: 4" },
    ],
    volume: (p) => (1 / 3) * p.sisi_alas ** 2 * p.tinggi,
    // tinggi segitiga sisi tegak: √(t² + (a/2)²)
    surface: (p) => {
      const tSisi = Math.sqrt(p.tinggi ** 2 + (p.sisi_alas / 2) ** 2);
      return p.sisi_alas ** 2 + 2 * p.sisi_alas * tSisi;
    },
    volumeText: "V = 1/3 × a² × t",
    surfaceText: "L = a² + 2 × a × t′",
    notes: ["a = sisi alas persegi, t = tinggi limas", "t′ = tinggi sisi tegak, dihitung otomatis"],
  },
  prisma_segitiga: {
    name: "Prisma Segitiga",
    fields: [
      { key: "alas", label: "Alas Segitiga (a)", placeholder: "contoh: 6" },
      { key: "tinggi_alas", label: "Tinggi Segitiga (ta)", placeholder: "contoh: 4" },
      { key: "tinggi", label: "Tinggi Prisma (t)", placeholder: "contoh: 10" },
    ],
    volume: (p) => 0.5 * p.alas * p.tinggi_alas * p.tinggi,
    // Diasumsikan segitiga siku-siku pada alas; sisi miring dari a dan ta
    surface: (p) => {
      const luasAlas = 0.5 * p.alas * p.tinggi_alas;
      const miring = Math.sqrt(p.alas ** 2 + p.tinggi_alas ** 2);
      const keliling = p.alas + p.tinggi_alas + miring;
      return 2 * luasAlas + keliling * p.tinggi;
    },
    volumeText: "V = (1/2 × a × ta) × t",
    surfaceText: "L = 2 × luas alas + keliling alas × t",
    notes: [
      "a = alas segitiga, ta = tinggi segitiga, t = tinggi prisma",
      "Luas permukaan mengasumsikan alas berupa segitiga siku-siku",
    ],
  },
};

// ============ Utilitas ============

// Menerima "3,5" maupun "3.5" — koma umum dipakai di Indonesia
function parseAngka(nilai) {
  const n = parseFloat(String(nilai).replace(",", "."));
  return isNaN(n) ? NaN : n;
}

function formatHasil(nilai, satuan, pangkat) {
  if (!isFinite(nilai)) return "—";
  const dibulatkan = Math.round(nilai * 1000) / 1000;
  const teks = dibulatkan.toLocaleString("id-ID", { maximumFractionDigits: 3 });
  return teks + " " + satuan + pangkat;
}

// Mencegah teks dari konfigurasi disisipkan mentah sebagai HTML
function escapeHtml(teks) {
  return $("<div>").text(teks).html();
}

// ============ Render & interaksi ============

$(function () {
  const $shape = $("#shape");
  if ($shape.length === 0) return; // halaman ini bukan halaman kalkulator

  const $satuan = $("#satuan");
  const $form = $("#param-form");
  const $notif = $("#notif");

  const $rumusVolume = $("#rumus-volume");
  const $rumusLuas = $("#rumus-luas");
  const $catatan = $("#catatan");
  const $hasilVolume = $("#hasil-volume");
  const $hasilLuas = $("#hasil-luas");
  const $detail = $("#detail-hasil");

  function sembunyikanNotif() {
    $notif.addClass("hidden").text("");
  }

  function tampilkanError(pesan) {
    $notif.removeClass("hidden").text(pesan);
  }

  function kosongkanHasil() {
    $hasilVolume.text("—");
    $hasilLuas.text("—");
    $detail.text("Isi parameter lalu tekan Hitung.");
  }

  function renderFields(shapeKey) {
    const cfg = SHAPES[shapeKey];
    $form.empty();

    $.each(cfg.fields, function (_, f) {
      const html = `
        <div>
          <label for="field-${f.key}" class="block text-sm font-medium mb-2">${escapeHtml(f.label)}</label>
          <input
            id="field-${f.key}"
            name="${f.key}"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder="${escapeHtml(f.placeholder)}"
            class="w-full border border-ink/20 bg-transparent px-4 py-3 focus:border-rice outline-none" />
        </div>`;
      $form.append(html);
    });

    $rumusVolume.text(cfg.volumeText);
    $rumusLuas.text(cfg.surfaceText);

    $catatan.empty();
    $.each(cfg.notes, function (_, n) {
      $catatan.append($("<li>").text(n));
    });

    kosongkanHasil();
    sembunyikanNotif();
  }

  function ambilParameter(shapeKey) {
    const cfg = SHAPES[shapeKey];
    const params = {};
    let labelTidakValid = null;

    $.each(cfg.fields, function (_, f) {
      const nilai = parseAngka($form.find('[name="' + f.key + '"]').val());
      if (!isFinite(nilai) || nilai <= 0) {
        labelTidakValid = labelTidakValid || f.label;
      }
      params[f.key] = nilai;
    });

    return { params: params, labelTidakValid: labelTidakValid };
  }

  function hitung() {
    const shapeKey = $shape.val();
    const satuan = $satuan.val();
    const cfg = SHAPES[shapeKey];
    const hasil = ambilParameter(shapeKey);

    if (hasil.labelTidakValid) {
      tampilkanError('Nilai pada "' + hasil.labelTidakValid + '" harus berupa angka lebih besar dari 0.');
      kosongkanHasil();
      return;
    }

    try {
      const volume = cfg.volume(hasil.params);
      const luas = cfg.surface(hasil.params);

      $hasilVolume.text(formatHasil(volume, satuan, "³"));
      $hasilLuas.text(formatHasil(luas, satuan, "²"));

      const detail = $.map(cfg.fields, function (f) {
        return f.label.replace(/\s*\(.*\)/, "") + " = " + hasil.params[f.key] + " " + satuan;
      }).join(", ");
      $detail.text(cfg.name + " — " + detail);

      sembunyikanNotif();
    } catch (err) {
      tampilkanError("Terjadi kesalahan saat menghitung.");
      console.error(err);
    }
  }

  // ============ Event ============
  $shape.on("change", function () {
    renderFields($(this).val());
  });

  $("#hitung-btn").on("click", function (e) {
    e.preventDefault();
    hitung();
  });

  $("#reset-btn").on("click", function () {
    renderFields($shape.val());
  });

  $form.on("submit", function (e) {
    e.preventDefault();
    hitung();
  });

  // Hapus pesan error begitu pengguna mengetik ulang (delegasi, karena input dinamis)
  $form.on("input", "input", sembunyikanNotif);

  // Tekan Enter di input mana pun langsung menghitung
  $form.on("keydown", "input", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      hitung();
    }
  });

  // Render awal
  renderFields($shape.val());
});
