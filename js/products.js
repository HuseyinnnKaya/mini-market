const productCatalog = [
  {
    kategori: "İçecekler",
    baslangicFiyati: 12,
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=640&q=80",
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
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=640&q=80",
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
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=640&q=80",
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
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=640&q=80",
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
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=80",
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
    image: "https://images.unsplash.com/photo-1515543904379-3d757f8f6b6?auto=format&fit=crop&w=640&q=80",
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
    image: "https://images.unsplash.com/photo-1621939514649-280e2aa9f12?auto=format&fit=crop&w=640&q=80",
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

    products.push({
      id,
      isim,
      kategori,
      fiyat: Number((baslangicFiyati + index * 2.5).toFixed(2)),
      stok: ((id - 1) % 20) + 1,
      aciklama: `${isim}, ${kategori.toLocaleLowerCase("tr-TR")} kategorisinden taze ve özenle seçilmiş bir üründür.`,
      image: productCatalog.find((item) => item.kategori === kategori).image,
      resimURL: productCatalog.find((item) => item.kategori === kategori).image
    });
  });
});

globalThis.products = products;
