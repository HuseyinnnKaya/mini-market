function getProductImageUrl(photoId) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=400&q=80`;
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
    ],
    gorseller: [
      "photo-1622483767028-3f66f32aef97",
      "photo-1556679343-c7306c1976bc",
      "photo-1513558161293-cdaf765edfd7",
      "photo-1556679343-c7306c1976bc",
      "photo-1527761939622-911909b68b1f",
      "photo-1600271886742-f049cd451bba",
      "photo-1537640538966-79f369143f8f",
      "photo-1600271886742-f049cd451bba",
      "photo-1495474472287-4d71bcdd2085",
      "photo-1509042239860-f550ce710b93",
      "photo-1544787219-7f47ccb76574",
      "photo-1556679343-c7306c1976bc",
      "photo-1542990253-0b8be12b7022",
      "photo-1550583724-b2692b85b150",
      "photo-1622543925917-763c34d1a86e"
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
    ],
    gorseller: [
      "photo-1571877227200-a0d98ea607e9",
      "photo-1519676867240-f03562e64548",
      "photo-1533134242443-d4fd215305ad",
      "photo-1578985545062-69928b1d9587",
      "photo-1551024506-0bccd828d307",
      "photo-1571877227200-a0d98ea607e9",
      "photo-1571115177098-24ec42ed204d",
      "photo-1606313564200-e75d5e30476c",
      "photo-1499636136210-6f4ee915583e",
      "photo-1541783245831-57d6fb0926d3",
      "photo-1551024506-0bccd828d307",
      "photo-1541783245831-57d6fb0926d3",
      "photo-1541592106381-b31e9677c0e5",
      "photo-1519676867240-f03562e64548",
      "photo-1568571780765-9276ac8b75a0"
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
    ],
    gorseller: [
      "photo-1560806887-1e4cd0b6cbd6",
      "photo-1550258987-190a2d41a8ba",
      "photo-1571771894821-ce9b6c11b08e",
      "photo-1547514701-42782101795e",
      "photo-1546094096-0df4bcaaa337",
      "photo-1540420773420-3366772f4999",
      "photo-1518977676601-b53f82aba655",
      "photo-1518977676601-b53f82aba655",
      "photo-1445286978817-728615cc910a",
      "photo-1576045057995-568f588f82fb",
      "photo-1459411621453-7b03977f4bfc",
      "photo-1540420773420-3366772f4999",
      "photo-1523049673857-eb18f1d7b578",
      "photo-1464965911861-746a04b4bca6"
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
    ],
    gorseller: [
      "photo-1550583724-b2692b85b150",
      "photo-1571212515416-fef01fc43637",
      "photo-1486297678162-eb2a19b0a32d",
      "photo-1486297678162-eb2a19b0a32d",
      "photo-1517673132405-a56a62b18caf",
      "photo-1571212515416-fef01fc43637",
      "photo-1559561853-08451507cbe7",
      "photo-1622483767028-3f66f32aef97",
      "photo-1559561853-08451507cbe7",
      "photo-1550583724-b2692b85b150",
      "photo-1486297678162-eb2a19b0a32d",
      "photo-1517673132405-a56a62b18caf",
      "photo-1571212515416-fef01fc43637",
      "photo-1486297678162-eb2a19b0a32d"
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
    ],
    gorseller: [
      "photo-1509440159596-0249088772ff",
      "photo-1509440159596-0249088772ff",
      "photo-1555507036-ab1f4038808a",
      "photo-1555507036-ab1f4038808a",
      "photo-1509440159596-0249088772ff",
      "photo-1509440159596-0249088772ff",
      "photo-1509440159596-0249088772ff",
      "photo-1509440159596-0249088772ff",
      "photo-1555507036-ab1f4038808a",
      "photo-1555507036-ab1f4038808a",
      "photo-1509440159596-0249088772ff",
      "photo-1509440159596-0249088772ff",
      "photo-1509440159596-0249088772ff",
      "photo-1509440159596-0249088772ff"
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
    ],
    gorseller: [
      "photo-1515543237350-b3eea1ec8082",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1509358271058-acd22cc93898",
      "photo-1586201375761-83865001e31c",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1586201375761-83865001e31c",
      "photo-1509358271058-acd22cc93898",
      "photo-1509358271058-acd22cc93898"
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
    ],
    gorseller: [
      "photo-1566478989037-eec170784d0b",
      "photo-1499636136210-6f4ee915583e",
      "photo-1548907040-4d42faa7b890",
      "photo-1508061253366-f7da158b6d46",
      "photo-1578849278619-e73505e9610f",
      "photo-1499636136210-6f4ee915583e",
      "photo-1515543237350-b3eea1ec8082",
      "photo-1508061253366-f7da158b6d46",
      "photo-1490645935967-10de6ba17061",
      "photo-1548907040-4d42faa7b890",
      "photo-1498557850523-fd3d118b962e",
      "photo-1578849278619-e73505e9610f",
      "photo-1509440159596-0249088772ff",
      "photo-1498557850523-fd3d118b962e"
    ]
  }
];

const products = [];

productCatalog.forEach(({ kategori, baslangicFiyati, urunler, gorseller }) => {
  urunler.forEach((isim, index) => {
    const id = products.length + 1;
    const photoId = gorseller[index];
    if (!photoId) {
      throw new Error(`${kategori} kategorisindeki "${isim}" ürünü için görsel bulunamadı.`);
    }

    const image = getProductImageUrl(photoId);

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
