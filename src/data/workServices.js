const fallbackGalleryImages = [
  "https://images.pexels.com/photos/37718775/pexels-photo-37718775.jpeg",
  "https://images.pexels.com/photos/21371133/pexels-photo-21371133.jpeg",
  "https://images.pexels.com/photos/3188/love-romantic-bath-candlelight.jpg",
];

export const workServices = [
  {
    slug: "thai-massage",
    name: "Тайский массаж",
    code: "9K4F2M7Q",
    image: fallbackGalleryImages[0],
    coverImage: fallbackGalleryImages[0],
    gallery: fallbackGalleryImages,
    price: "650 лей",
    duration: "60 минут",
    description:
      "Тайский массаж сочетает мягкие растяжки и надавливания по энергетическим линиям тела. Подходит для глубокой релаксации, снятия напряжения в спине и восстановления подвижности.",
  },
  {
    slug: "swedish-massage",
    name: "Шведский массаж",
    code: "A7L3Q9F2",
    image: fallbackGalleryImages[1],
    coverImage: fallbackGalleryImages[1],
    gallery: fallbackGalleryImages,
    price: "500 лей",
    duration: "30 минут",
    description:
      "Классический массаж для общего расслабления мышц и улучшения кровообращения. Отличный выбор при хронической усталости и после интенсивной рабочей недели.",
  },
  {
    slug: "oil-massage",
    name: "Массаж с использованием масла",
    code: "R1M9D4K7",
    image: fallbackGalleryImages[2],
    coverImage: fallbackGalleryImages[2],
    gallery: fallbackGalleryImages,
    price: "700 лей",
    duration: "60 минут",
    description:
      "Масляный массаж с плавными движениями и акцентом на восстановление и питание кожи. Помогает снизить стресс и вернуть ощущение лёгкости в теле.",
  },
  {
    slug: "hot-bath-tub",
    name: "Банный чан",
    code: "2F8Q7A9L",
    image: fallbackGalleryImages[0],
    coverImage: fallbackGalleryImages[0],
    gallery: fallbackGalleryImages,
    price: "900 лей",
    duration: "90 минут",
    description:
      "Ритуал прогревания в банном чане на открытом воздухе. Подходит для глубокого расслабления, восстановления после нагрузок и перезагрузки нервной системы.",
  },
  {
    slug: "sauna",
    name: "Сауна",
    code: "M4D9K7F2",
    image: fallbackGalleryImages[1],
    coverImage: fallbackGalleryImages[1],
    gallery: fallbackGalleryImages,
    price: "450 лей",
    duration: "45 минут",
    description:
      "Классическая сауна для мягкого прогрева и восстановления. Помогает расслабить мышцы, улучшить сон и поддержать общее самочувствие.",
  },
];

export function getWorkServiceBySlug(slug) {
  return workServices.find((service) => service.slug === slug);
}
