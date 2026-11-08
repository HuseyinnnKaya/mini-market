function getProductImageUrl(productId) {
  return `https://picsum.photos/seed/${productId}/300/200`;
}

const productCatalog = [
  {
    kategori: "İçecekler",
    baslangicFiyati: 12,
    urunler: [
      "Kola",
      "Portakallı gazoz",
      "Limonata",
      "Soğuk çay",
      "Maden suyu",
      "Elma suyu",
      "Üzüm suyu",
      "Şeftali suyu",
      "Türk kahvesi",
      "Filtre kahve",
      "Siyah çay",
      "Yeşil çay",
      "Sıcak çikolata",
      "Ayran",
      "Enerji içeceği"
    ]
  },
  {
    kategori: "Tatlılar",
    baslangicFiyati: 28,
    urunler: [
      "Sütlaç",
      "Fıstıklı baklava",
      "Cheesecake",
      "Çikolatalı kek",
      "Profiterol",
      "Tiramisu",
      "Kazandibi",
      "Revani",
      "Şekerpare",
      "Magnolia",
      "Ekler",
      "Supangle",
      "İrmik helvası",
      "Künefe",
      "Elmalı turta"
    ]
  },
  {
    kategori: "Meyve & Sebze",
    baslangicFiyati: 18,
    urunler: [
      "Elma",
      "Armut",
      "Muz",
      "Portakal",
      "Domates",
      "Salatalık",
      "Patates",
      "Soğan",
      "Havuç",
      "Ispanak",
      "Brokoli",
      "Kabak",
      "Avokado",
      "Çilek"
    ]
  },
  {
    kategori: "Süt Ürünleri",
    baslangicFiyati: 24,
    urunler: [
      "Süt",
      "Yoğurt",
      "Kaşar peyniri",
      "Beyaz peynir",
      "Tereyağı",
      "Kefir",
      "Labne peyniri",
      "Krema",
      "Lor peyniri",
      "Ayran",
      "Mozzarella peyniri",
      "Kaymak",
      "Süzme yoğurt",
      "Parmesan peyniri"
    ]
  },
  {
    kategori: "Unlu Mamuller",
    baslangicFiyati: 10,
    urunler: [
      "Ekmek",
      "Simit",
      "Poğaça",
      "Açma",
      "Baget ekmek",
      "Çavdar ekmeği",
      "Lavaş",
      "Pide",
      "Kruvasan",
      "Çörek",
      "Tost ekmeği",
      "Galeta",
      "Bazlama",
      "Yufka"
    ]
  },
  {
    kategori: "Bakliyat",
    baslangicFiyati: 20,
    urunler: [
      "Kırmızı mercimek",
      "Yeşil mercimek",
      "Nohut",
      "Kuru fasulye",
      "Bulgur",
      "Pirinç",
      "Barbunya",
      "Maş fasulyesi",
      "Kuru börülce",
      "Bezelye",
      "Bakla",
      "Kinoa",
      "Yarma buğday",
      "Mısır unu"
    ]
  },
  {
    kategori: "Atıştırmalıklar",
    baslangicFiyati: 14,
    urunler: [
      "Patates cipsi",
      "Kraker",
      "Sütlü çikolata",
      "Kaju",
      "Mısır patlağı",
      "Bisküvi",
      "Leblebi",
      "Kabak çekirdeği",
      "Granola bar",
      "Gofret",
      "Kuru üzüm",
      "Pirinç patlağı",
      "Grissini",
      "Meyve kurusu"
    ]
  }
];

const products = [];

productCatalog.forEach(({ kategori, baslangicFiyati, urunler }) => {
  urunler.forEach((isim, index) => {
    const id = products.length + 1;
    const image = getProductImageUrl(id);

    products.push({
      id,
      isim,
      kategori,
      fiyat: Number((baslangicFiyati + index * 2.5).toFixed(2)),
      stok: ((id - 1) % 20) + 1,
      aciklama: `${isim}, ${kategori.toLocaleLowerCase("tr-TR")} kategorisinden taze ve özenle seçilmiş bir üründür.`,
      image,
      resimURL: image
    });
  });
});

globalThis.products = products;
