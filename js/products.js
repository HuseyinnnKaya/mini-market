const productCatalog = [
  {
    kategori: "İçecekler",
    urunler: ["Kola", "Portakallı gazoz", "Limonata", "Soğuk çay", "Maden suyu", "Meyve suyu"],
    cesitler: ["250 ml", "330 ml", "500 ml", "1 L", "1,5 L", "2 L", "6'lı paket"],
    ekUrun: "Enerji içeceği",
    baslangicFiyati: 12,
    resimURL: "https://images.unsplash.com/photo-1544145945-f90425340c7e"
  },
  {
    kategori: "Tatlılar",
    urunler: ["Sütlaç", "Baklava", "Cheesecake", "Çikolatalı kek", "Profiterol", "Tiramisu"],
    cesitler: ["Klasik", "Fındıklı", "Çikolatalı", "Meyveli", "Karamelli", "Mini boy", "Büyük boy"],
    ekUrun: "Kazandibi",
    baslangicFiyati: 28,
    resimURL: "https://images.unsplash.com/photo-1551024506-0bccd828d307"
  },
  {
    kategori: "Meyve & Sebze",
    urunler: ["Elma", "Armut", "Muz", "Portakal", "Domates", "Salatalık"],
    cesitler: ["500 g", "1 kg", "1,5 kg", "2 kg", "Organik 500 g", "Organik 1 kg", "Mevsimlik paket"],
    ekUrun: "Avokado",
    baslangicFiyati: 18,
    resimURL: "https://images.unsplash.com/photo-1540420773420-3366772f4999"
  },
  {
    kategori: "Süt Ürünleri",
    urunler: ["Süt", "Yoğurt", "Kaşar peyniri", "Beyaz peynir", "Tereyağı", "Kefir"],
    cesitler: ["200 g", "500 g", "750 g", "1 kg", "Laktozsuz", "Az yağlı", "Tam yağlı"],
    ekUrun: "Labne peyniri",
    baslangicFiyati: 24,
    resimURL: "https://images.unsplash.com/photo-1550583724-b2692b85b150"
  },
  {
    kategori: "Unlu Mamuller",
    urunler: ["Ekmek", "Simit", "Poğaça", "Açma", "Baget ekmek", "Çavdar ekmeği"],
    cesitler: ["Sade", "Tam buğday", "Çavdarlı", "Susamlı", "Peynirli", "Zeytinli", "Taze günlük"],
    ekUrun: "Ekşi mayalı ekmek",
    baslangicFiyati: 10,
    resimURL: "https://images.unsplash.com/photo-1509440159596-0249088772ff"
  },
  {
    kategori: "Bakliyat",
    urunler: ["Kırmızı mercimek", "Yeşil mercimek", "Nohut", "Kuru fasulye", "Bulgur", "Pirinç"],
    cesitler: ["500 g", "1 kg", "1,5 kg", "2 kg", "Yerli mahsul", "Organik", "Pilavlık"],
    ekUrun: "Barbunya",
    baslangicFiyati: 20,
    resimURL: "https://images.unsplash.com/photo-1551462147-ff29053bfc14"
  },
  {
    kategori: "Atıştırmalıklar",
    urunler: ["Patates cipsi", "Kraker", "Çikolata", "Kuruyemiş", "Mısır patlağı", "Bisküvi"],
    cesitler: ["Küçük paket", "Orta paket", "Büyük paket", "Tuzlu", "Acılı", "Peynir aromalı", "Karışık"],
    baslangicFiyati: 14,
    resimURL: "https://images.unsplash.com/photo-1621939514649-280e2aa9f12"
  }
];

const products = [];

productCatalog.forEach((kategori, categoryIndex) => {
  kategori.urunler.forEach((urun, productIndex) => {
    kategori.cesitler.forEach((cesit, variantIndex) => {
      const isim = `${urun} - ${cesit}`;
      const id = products.length + 1;

      products.push({
        id,
        isim,
        fiyat: Number((kategori.baslangicFiyati + productIndex * 3.5 + variantIndex * 1.75).toFixed(2)),
        kategori: kategori.kategori,
        stok: ((id - 1) % 20) + 1,
        aciklama: `${isim}, ${kategori.kategori.toLocaleLowerCase("tr-TR")} kategorisinden özenle seçilmiş kaliteli bir üründür.`,
        resimURL: kategori.resimURL
      });
    });
  });

  if (kategori.ekUrun) {
    const id = products.length + 1;

    products.push({
      id,
      isim: kategori.ekUrun,
      fiyat: Number((kategori.baslangicFiyati + 42.5).toFixed(2)),
      kategori: kategori.kategori,
      stok: ((id - 1) % 20) + 1,
      aciklama: `${kategori.ekUrun}, ${kategori.kategori.toLocaleLowerCase("tr-TR")} kategorisinden özenle seçilmiş kaliteli bir üründür.`,
      resimURL: kategori.resimURL
    });
  }
});

globalThis.products = products;
