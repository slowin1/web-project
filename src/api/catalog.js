import {
  servicesAPI,
  serviceImagesAPI,
  serviceCategoriesAPI,
  specialistsAPI,
} from "./admin";
import { normalizeService } from "./dtoMappers";

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&h=800&fit=crop";

export const FALLBACK_MINIMAP =
  "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=100&h=125&fit=crop";

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function mapApiServiceToUi(service, imageByServiceId = {}, specialistByName = {}) {
  const api = normalizeService(service);
  const images = imageByServiceId[api.id] || [];
  const image = images[0] || FALLBACK_IMAGE;
  const specialist = specialistByName[api.nameOfMaster] || null;

  return {
    id: api.id,
    name: api.nameOfService,
    price: String(api.priceOfService ?? ""),
    specialistId: specialist?.id || specialist?.Id || "",
    specialist: api.nameOfMaster || "Специалист не указан",
    specialistSlug: slugify(api.nameOfMaster || "specialist"),
    duration: `${api.durationOfService || 0} мин`,
    category: api.categoryId,
    image,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    minimap: image,
    description:
      api.descriptionOfService || "Описание пока не добавлено.",
    benefits: [
      "Индивидуальный подход",
      "Комфортная атмосфера",
      "Профессиональное выполнение",
      "Заметный результат",
    ],
  };
}

export function mapApiCategoryToUi(category) {
  return {
    id: category.id,
    name: category.nameOfCategory,
    styleKey: slugify(category.nameOfCategory || category.id),
  };
}

export function mapApiSpecialistToUi(specialist, services = []) {
  return {
    id: specialist.id,
    specialist: specialist.fullName,
    specialistSlug: slugify(specialist.fullName),
    specialistBio: specialist.bio,
    image: specialist.photoUrl || FALLBACK_IMAGE,
    services,
  };
}

export async function fetchCatalogBundle() {
  const [servicesRaw, categoriesRaw, imagesRaw, specialistsRaw] = await Promise.all([
    servicesAPI.getAll(),
    serviceCategoriesAPI.getAll(),
    serviceImagesAPI.getAll().catch(() => []),
    specialistsAPI.getAll().catch(() => []),
  ]);

  const servicesList = Array.isArray(servicesRaw) ? servicesRaw : [];
  const categoriesList = Array.isArray(categoriesRaw) ? categoriesRaw : [];
  const imagesList = Array.isArray(imagesRaw) ? imagesRaw : [];
  const specialistsList = Array.isArray(specialistsRaw) ? specialistsRaw : [];
  const specialistByName = specialistsList.reduce((acc, specialist) => {
    const name = specialist.fullName ?? specialist.FullName ?? "";
    if (name) {
      acc[name] = specialist;
    }
    return acc;
  }, {});

  const imageByServiceId = imagesList.reduce((acc, image) => {
    const sid = image.serviceId;
    if (sid) {
      if (!acc[sid]) {
        acc[sid] = [];
      }
      if (image.imageUrl) {
        acc[sid].push(image.imageUrl);
      }
    }
    return acc;
  }, {});

  return {
    services: servicesList.map((service) =>
      mapApiServiceToUi(service, imageByServiceId, specialistByName),
    ),
    categories: categoriesList.map(mapApiCategoryToUi),
  };
}

export async function fetchSpecialistsBundle() {
  const [specialistsRaw, servicesRaw] = await Promise.all([
    specialistsAPI.getAll(),
    servicesAPI.getAll(),
  ]);

  const specialistsList = Array.isArray(specialistsRaw) ? specialistsRaw : [];
  const servicesList = Array.isArray(servicesRaw) ? servicesRaw : [];

  const servicesByMaster = servicesList.reduce((acc, service) => {
    const api = normalizeService(service);
    const key = api.nameOfMaster || "";
    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push({
      id: api.id,
      name: api.nameOfService,
    });

    return acc;
  }, {});

  return specialistsList.map((specialist) =>
    mapApiSpecialistToUi(specialist, servicesByMaster[specialist.fullName] || []),
  );
}
