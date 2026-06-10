import { useEffect, useMemo, useState } from "react";

export const ADMIN_LANGUAGE_STORAGE_KEY = "adminLanguage";

export const ADMIN_LANGUAGES = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
  { value: "ro", label: "Română" },
];

const FALLBACK_LANGUAGE = "ru";

function normalizeLanguage(language) {
  const value = String(language || "").toLowerCase();
  return ADMIN_LANGUAGES.some((item) => item.value === value)
    ? value
    : FALLBACK_LANGUAGE;
}

export function getStoredAdminLanguage() {
  return normalizeLanguage(localStorage.getItem(ADMIN_LANGUAGE_STORAGE_KEY));
}

export function setStoredAdminLanguage(language) {
  const nextLanguage = normalizeLanguage(language);
  localStorage.setItem(ADMIN_LANGUAGE_STORAGE_KEY, nextLanguage);
  window.dispatchEvent(
    new CustomEvent("admin-language-change", { detail: nextLanguage }),
  );
  return nextLanguage;
}

export function useAdminLanguage() {
  const [language, setLanguage] = useState(() => getStoredAdminLanguage());

  useEffect(() => {
    const handleLanguageChange = (event) => {
      setLanguage(normalizeLanguage(event.detail || getStoredAdminLanguage()));
    };
    const handleStorage = (event) => {
      if (event.key === ADMIN_LANGUAGE_STORAGE_KEY) {
        setLanguage(normalizeLanguage(event.newValue));
      }
    };

    window.addEventListener("admin-language-change", handleLanguageChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("admin-language-change", handleLanguageChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return language;
}

const ADMIN_TRANSLATIONS = {
  ru: {
    layout: {
      product: "Массажный салон",
      title: "Панель администратора",
      connected: "Бэкенд подключён",
      admin: "Админ",
      room: "Центр управления",
      workspace: "Рабочая область",
      navigation: "Навигация",
      window: "Рабочая область",
      live: "Активно",
      nav: {
        dashboard: ["Обзор", "Аналитика"],
        users: ["Пользователи", "Роли и доступ"],
        content: ["Контент", "Страницы и медиа"],
        services: ["Услуги", "Каталог"],
        settings: ["Настройки", "Система"],
      },
    },
    dashboard: {
      title: "Обзор",
      loading: "Загрузка панели...",
      eyebrow: "Рабочая область",
      copy: "Сводка посещаемости, источников трафика и активности салона.",
      refresh: "Обновить данные",
      period: "Период аналитики",
      periods: {
        "7d": "Последние 7 дней",
        "30d": "Последние 30 дней",
        "90d": "Последние 90 дней",
      },
      totalVisitors: "Всего посетителей",
      uniqueVisitors: "Уникальные посетители",
      avgSession: "Средняя сессия",
      revenue: "Доход",
      visitorAnalytics: "Аналитика посетителей",
      noVisitors: "Данных о посетителях пока нет",
      hourlyTraffic: "Трафик по часам",
      noHourly: "Почасовых данных пока нет",
      devices: "Устройства",
      noDevices: "Данных об устройствах пока нет",
      trafficSources: "Источники трафика",
    },
    content: {
      title: "Контент",
      create: "Создать",
      loading: "Загрузка контента...",
      pages: "Страницы",
      pagesCount: "страниц опубликовано",
      managePages: "Управлять",
      posts: "Записи блога",
      postsCount: "записей опубликовано",
      managePosts: "Управлять",
      media: "Медиа",
      mediaCount: "файлов загружено",
      browseMedia: "Открыть",
      analytics: "Аналитика",
      performance: "Показатели",
      viewStats: "Смотреть",
    },
    settings: {
      title: "Настройки",
      loading: "Загрузка настроек...",
      siteName: "Название сайта",
      adminEmail: "Email администратора",
      language: "Язык админки",
      timezone: "Часовой пояс",
      save: "Сохранить",
      saving: "Сохранение...",
      reset: "Сбросить",
    },
    users: {
      title: "Пользователи",
      eyebrow: "Управление доступом",
      refresh: "Обновить",
      total: "Всего",
      admins: "Админы",
      restricted: "Ограничены",
      directory: "Список пользователей",
      searchPlaceholder: "Поиск по имени, логину, почте",
      searchEmpty: "Пользователи по этому запросу не найдены.",
      details: "Профиль",
      empty: "Пользователей пока нет.",
      select: "Выберите пользователя слева.",
      email: "Email",
      phone: "Телефон",
      registered: "Регистрация",
      role: "Роль",
      rights: "Права:",
      ban: "Забанить",
      unban: "Разбанить",
      delete: "Удалить",
      loading: "Загрузка пользователей...",
    },
    services: {
      title: "Управление услугами",
      eyebrow: "Каталог услуг",
      add: "+ Добавить услугу",
      services: "Услуги",
      categories: "Категории",
      masters: "Мастера",
      edit: "Редактировать",
      del: "Удалить",
      photo: "Фото",
      name: "Название",
      master: "Мастер",
      price: "Цена",
      duration: "Длительность",
      category: "Категория",
      actions: "Действия",
      empty: "Услуг пока нет. Нажмите «Добавить услугу».",
      newService: "Новая услуга",
      editService: "Редактировать услугу",
      masterFromDb: "Мастер из базы",
      chooseMaster: "— выберите мастера —",
      chooseMasterHint: "Можно выбрать мастера или вписать вручную ниже.",
      serviceName: "Название услуги",
      masterName: "Имя мастера",
      masterAuto: "Имя мастера автоматически заполняется по выбранному специалисту.",
      priceRub: "Цена (₽)",
      durationMin: "Длительность (мин)",
      chooseCategory: "— выберите категорию —",
      description: "Описание",
      image: "Фото услуги",
      publicLink: "Ссылка должна быть публичной.",
      save: "Сохранить",
      create: "Создать услугу",
      saving: "Сохранение...",
      cancel: "Отмена",
      loading: "Загрузка услуг и мастеров...",
      noCategories: "Категории не найдены. Добавьте их через API",
      noSpecialists: "В базе пока нет специалистов.",
    },
  },
};

ADMIN_TRANSLATIONS.en = {
  ...ADMIN_TRANSLATIONS.ru,
  layout: {
    product: "Massage Salon",
    title: "Admin Panel",
    connected: "Backend connected",
    admin: "Admin",
    room: "Control Room",
    workspace: "Operations workspace",
    navigation: "Navigation",
    window: "Admin Workspace",
    live: "Live",
    nav: {
      dashboard: ["Dashboard", "Overview"],
      users: ["Users", "Roles & access"],
      content: ["Content", "Pages & media"],
      services: ["Services", "Catalog"],
      settings: ["Settings", "System"],
    },
  },
  dashboard: {
    ...ADMIN_TRANSLATIONS.ru.dashboard,
    title: "Dashboard",
    loading: "Loading dashboard data...",
    eyebrow: "Live workspace",
    refresh: "Refresh Data",
    period: "Analytics period",
    periods: {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
    },
    totalVisitors: "Total Visitors",
    uniqueVisitors: "Unique Visitors",
    avgSession: "Avg. Session",
    revenue: "Revenue",
    visitorAnalytics: "Visitor Analytics",
    noVisitors: "No visitor data available",
    hourlyTraffic: "Hourly Traffic",
    noHourly: "No hourly data available",
    devices: "Device Distribution",
    noDevices: "No device data available",
    trafficSources: "Traffic Sources",
  },
  content: {
    title: "Content Management",
    create: "+ Create New",
    loading: "Loading content...",
    pages: "Pages",
    pagesCount: "pages published",
    managePages: "Manage Pages",
    posts: "Blog Posts",
    postsCount: "posts published",
    managePosts: "Manage Posts",
    media: "Media Library",
    mediaCount: "files uploaded",
    browseMedia: "Browse Media",
    analytics: "Analytics",
    performance: "View performance",
    viewStats: "View Stats",
  },
  settings: {
    title: "Settings",
    loading: "Loading settings...",
    siteName: "Site Name",
    adminEmail: "Admin Email",
    language: "Admin Language",
    timezone: "Timezone",
    save: "Save Changes",
    saving: "Saving...",
    reset: "Reset",
  },
  users: {
    ...ADMIN_TRANSLATIONS.ru.users,
    title: "Users",
    eyebrow: "Access control",
    refresh: "Refresh",
    total: "Total users",
    admins: "Admins",
    restricted: "Restricted",
    directory: "User directory",
    searchPlaceholder: "Search by name, username, email",
    searchEmpty: "No users match this search.",
    details: "Profile details",
    empty: "No users yet.",
    select: "Choose a user on the left.",
    phone: "Phone",
    registered: "Registered",
    role: "Role",
    rights: "Rights:",
    ban: "Ban",
    unban: "Unban",
    delete: "Delete",
    loading: "Loading users...",
  },
  services: {
    ...ADMIN_TRANSLATIONS.ru.services,
    title: "Services Management",
    eyebrow: "Service catalog",
    add: "+ Add service",
    services: "Services",
    categories: "Categories",
    masters: "Masters",
    edit: "Edit",
    del: "Del",
    photo: "Photo",
    name: "Name",
    master: "Master",
    price: "Price",
    duration: "Duration",
    category: "Category",
    actions: "Actions",
    empty: "No services yet. Click “Add service”.",
    newService: "New service",
    editService: "Edit service",
    masterFromDb: "Master from database",
    chooseMaster: "— choose master —",
    serviceName: "Service name",
    masterName: "Master name",
    priceRub: "Price (₽)",
    durationMin: "Duration (min)",
    chooseCategory: "— choose category —",
    description: "Description",
    image: "Service photo",
    save: "Save",
    create: "Create service",
    saving: "Saving...",
    cancel: "Cancel",
    loading: "Loading services and masters...",
  },
};

ADMIN_TRANSLATIONS.ro = {
  ...ADMIN_TRANSLATIONS.ru,
  layout: {
    ...ADMIN_TRANSLATIONS.ru.layout,
    product: "Salon de masaj",
    title: "Panou admin",
    connected: "Backend conectat",
    room: "Centru de control",
    navigation: "Navigare",
    window: "Spațiu de lucru",
    live: "Activ",
    nav: {
      dashboard: ["Prezentare", "Analitică"],
      users: ["Utilizatori", "Roluri și acces"],
      content: ["Conținut", "Pagini și media"],
      services: ["Servicii", "Catalog"],
      settings: ["Setări", "Sistem"],
    },
  },
  settings: {
    ...ADMIN_TRANSLATIONS.ru.settings,
    title: "Setări",
    language: "Limba panoului",
    save: "Salvează",
    saving: "Se salvează...",
    reset: "Resetează",
  },
  users: {
    ...ADMIN_TRANSLATIONS.ru.users,
    title: "Utilizatori",
    eyebrow: "Control acces",
    refresh: "Reîncarcă",
    total: "Total utilizatori",
    admins: "Administratori",
    restricted: "Restricționați",
    directory: "Director utilizatori",
    searchPlaceholder: "Caută după nume, utilizator, email",
    searchEmpty: "Nu există utilizatori pentru această căutare.",
    details: "Detalii profil",
    empty: "Nu există utilizatori încă.",
    select: "Alege un utilizator din stânga.",
    phone: "Telefon",
    registered: "Înregistrat",
    role: "Rol",
    rights: "Drepturi:",
    ban: "Blochează",
    unban: "Deblochează",
    delete: "Șterge",
    loading: "Se încarcă utilizatorii...",
  },
};

export function useAdminText() {
  const language = useAdminLanguage();
  return useMemo(
    () => ({
      language,
      t: ADMIN_TRANSLATIONS[language] || ADMIN_TRANSLATIONS[FALLBACK_LANGUAGE],
    }),
    [language],
  );
}
