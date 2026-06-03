import { apiRequest } from "./admin";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const CONTENT_TYPES = {
  gallery: "gallery",
  blog: "blog",
  contact: "contact",
};

const ARTICLE_IMAGES_START = "[[articleImages]]";
const ARTICLE_IMAGES_END = "[[/articleImages]]";

export function parseArticleBody(value = "") {
  const body = String(value || "");
  const startIndex = body.indexOf(ARTICLE_IMAGES_START);
  const endIndex = body.indexOf(ARTICLE_IMAGES_END);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    return {
      text: body.trim(),
      images: [],
    };
  }

  const text = `${body.slice(0, startIndex)}${body.slice(endIndex + ARTICLE_IMAGES_END.length)}`.trim();
  const images = body
    .slice(startIndex + ARTICLE_IMAGES_START.length, endIndex)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return { text, images };
}

export function composeArticleBody(text = "", images = []) {
  const cleanText = String(text || "").trim();
  const cleanImages = images.map((image) => String(image || "").trim()).filter(Boolean);

  if (cleanImages.length === 0) {
    return cleanText;
  }

  return [
    cleanText,
    "",
    ARTICLE_IMAGES_START,
    cleanImages.join("\n"),
    ARTICLE_IMAGES_END,
  ].join("\n");
}

export function normalizeContentItem(item) {
  if (!item) return null;

  return {
    id: item.id,
    contentType: item.contentType,
    title: item.title || "",
    slug: item.slug || "",
    subtitle: item.subtitle || "",
    body: item.body || "",
    imageUrl: item.imageUrl || "",
    sortOrder: Number(item.sortOrder ?? 0),
    isActive: Boolean(item.isActive),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function toContentItemDto(item, contentType) {
  return {
    contentType,
    title: item.title || "",
    slug: item.slug || "",
    subtitle: item.subtitle || "",
    body: item.body || "",
    imageUrl: item.imageUrl || "",
    sortOrder: Number(item.sortOrder || 0),
    isActive: Boolean(item.isActive),
  };
}

export const contentItemsAPI = {
  getPublic: async (type) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    const response = await fetch(`${API_BASE_URL}/ContentItems${query}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data)
      ? data.map(normalizeContentItem).filter(Boolean)
      : [];
  },
  getAll: async (type) => {
    const query = type ? `?type=${encodeURIComponent(type)}` : "";
    const data = await apiRequest(`/ContentItems${query}`);
    return Array.isArray(data)
      ? data.map(normalizeContentItem).filter(Boolean)
      : [];
  },
  create: async (item, type) => {
    const data = await apiRequest("/ContentItems", {
      method: "POST",
      body: JSON.stringify(toContentItemDto(item, type)),
    });
    return normalizeContentItem(data);
  },
  update: async (id, item, type) => {
    const data = await apiRequest(`/ContentItems/${id}`, {
      method: "PUT",
      body: JSON.stringify(toContentItemDto(item, type)),
    });
    return normalizeContentItem(data);
  },
  delete: (id) => apiRequest(`/ContentItems/${id}`, { method: "DELETE" }),
};
