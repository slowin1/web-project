import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  formatAnalyticsLabel,
  formatAnalyticsPageName,
  formatAnalyticsVisitTime,
  useDashboardData,
} from '../hooks/useDashboardData';
import { useSettings } from '../hooks/useSettings';
import ServicesManager from '../components/Admin/ServicesManager';
import UsersManager from '../components/Admin/UsersManager';
import { ADMIN_LANGUAGES, getStoredAdminLanguage, setStoredAdminLanguage, useAdminText } from '../components/Admin/adminI18n';
import { useEffect, useState } from 'react';
import { CONTENT_TYPES, composeArticleBody, contentItemsAPI, parseArticleBody } from '../api/contentItems';

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const { t } = useAdminText();

  const {
    stats,
    visitorData,
    hourlyData,
    deviceData,
    trafficSources,
    pageData,
    recentVisits,
    completedServices,
    loading: dashboardLoading,
    refreshData,
  } = useDashboardData();

  const COLORS = ['#007aff', '#34c759', '#ff9500', '#af52de'];
  const hasVisitorActivity = visitorData.some(
    (item) => Number(item.visitors) > 0 || Number(item.unique) > 0,
  );

  const formatStatNumber = (value) => {
    if (typeof value === 'number') {
      if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
      if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
      return value.toString();
    }
    return value;
  };

  if (dashboardLoading) {
    return (
      <div className="admin-section">
          <div className="admin-header">
          <h3>{t.dashboard.title}</h3>
        </div>
        <p className="loading-text">{t.dashboard.loading}</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-hero-panel">
        <div>
          <p className="admin-panel-eyebrow">{t.dashboard.eyebrow}</p>
          <h3>{t.dashboard.title}</h3>
          <p className="admin-panel-copy">
            {t.dashboard.copy}
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => refreshData(selectedPeriod)}
        >
          {t.dashboard.refresh}
        </button>
      </div>

      <div className="admin-header">
        <h4 className="admin-subtitle">{t.dashboard.period}</h4>
        <div className="date-range-picker">
          <select
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value);
              refreshData(e.target.value);
            }}
          >
            <option value="7d">{t.dashboard.periods["7d"]}</option>
            <option value="30d">{t.dashboard.periods["30d"]}</option>
            <option value="90d">{t.dashboard.periods["90d"]}</option>
          </select>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card gradient-1">
          <div className="stat-icon">VIS</div>
          <div className="stat-info">
            <h4>{t.dashboard.totalVisitors}</h4>
            <p className="stat-number">{formatStatNumber(stats?.totalVisitors ?? 0)}</p>
            <span className="stat-change positive">Live</span>
          </div>
        </div>
        <div className="admin-stat-card gradient-2">
          <div className="stat-icon">UNI</div>
          <div className="stat-info">
            <h4>{t.dashboard.uniqueVisitors}</h4>
            <p className="stat-number">{formatStatNumber(stats?.uniqueVisitors ?? 0)}</p>
            <span className="stat-change positive">Live</span>
          </div>
        </div>
        <div className="admin-stat-card gradient-3">
          <div className="stat-icon">AVG</div>
          <div className="stat-info">
            <h4>{t.dashboard.avgSession}</h4>
            <p className="stat-number">{stats?.avgSession || '0m'}</p>
            <span className="stat-change positive">Logs</span>
          </div>
        </div>
        <div className="admin-stat-card gradient-4">
          <div className="stat-icon">REV</div>
          <div className="stat-info">
            <h4>{t.dashboard.revenue}</h4>
            <p className="stat-number">{formatStatNumber(stats?.revenue ?? 0)} ₽</p>
            <span className="stat-change positive">Completed</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h4>{t.dashboard.visitorAnalytics}</h4>
        </div>

        {visitorData && visitorData.length > 0 && hasVisitorActivity ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007aff" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#007aff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34c759" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#34c759" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border-soft)" />
              <XAxis dataKey="name" stroke="var(--admin-muted)" tick={{ fill: 'var(--admin-muted)', fontSize: 12 }} />
              <YAxis allowDecimals={false} stroke="var(--admin-muted)" tick={{ fill: 'var(--admin-muted)', fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="visitors" stroke="#007aff" fillOpacity={1} fill="url(#colorVisitors)" name="Visitors" />
              <Area type="monotone" dataKey="unique" stroke="#34c759" fillOpacity={1} fill="url(#colorUnique)" name="Unique" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="loading-text">{t.dashboard.noVisitors}</p>
        )}
      </div>

      <div className="charts-row">
        <div className="chart-container half">
          <div className="chart-header">
            <h4>{t.dashboard.hourlyTraffic}</h4>
          </div>

          {hourlyData && hourlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--fg)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                  }}
                />
                <Bar dataKey="visitors" fill="#007aff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="loading-text">{t.dashboard.noHourly}</p>
          )}
        </div>

        <div className="chart-container half">
          <div className="chart-header">
            <h4>{t.dashboard.devices}</h4>
          </div>

          {deviceData && deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--fg)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="loading-text">{t.dashboard.noDevices}</p>
          )}
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h4>{t.dashboard.trafficSources}</h4>
        </div>

        <div className="traffic-sources">
          {trafficSources.map((source, index) => (
            <div key={source.name} className="traffic-source-item">
              <div className="source-info">
                <span className="source-dot" style={{ backgroundColor: COLORS[index] }} />
                <span className="source-name">{source.name}</span>
              </div>
              <div className="source-bar">
                <div
                  className="source-progress"
                  style={{ width: `${source.value}%`, backgroundColor: COLORS[index] }}
                />
              </div>
              <span className="source-value">{source.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container half">
          <div className="chart-header">
            <h4>Страницы</h4>
          </div>

          <div className="traffic-sources">
            {pageData.length > 0 ? (
              pageData.map((page, index) => {
                const maxValue = Math.max(...pageData.map((item) => item.value), 1);
                return (
                  <div key={page.name} className="traffic-source-item">
                    <div className="source-info">
                      <span className="source-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="source-name">{page.label}</span>
                    </div>
                    <div className="source-bar">
                      <div
                        className="source-progress"
                        style={{
                          width: `${Math.max((page.value / maxValue) * 100, 8)}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                    <span className="source-value">{page.value}</span>
                  </div>
                );
              })
            ) : (
              <p className="loading-text">Пока нет данных по страницам</p>
            )}
          </div>
        </div>

        <div className="chart-container half">
          <div className="chart-header">
            <h4>Последние визиты</h4>
          </div>

          {recentVisits.length > 0 ? (
            <div className="analytics-visits-list">
              {recentVisits.map((visit) => (
                <div className="analytics-visit-row" key={visit.id}>
                  <div>
                    <strong>{formatAnalyticsPageName(visit.page)}</strong>
                    <span>{visit.visitor}</span>
                  </div>
	                  <div>
	                    <span>{formatAnalyticsLabel(visit.device)}</span>
	                    <span>{formatAnalyticsLabel(visit.source)}</span>
	                    <span>{visit.duration ? `${visit.duration}s` : 'Live'}</span>
	                    <span>{formatAnalyticsVisitTime(visit.date)}</span>
	                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="loading-text">Пока нет визитов</p>
          )}
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h4>Проведенные услуги</h4>
        </div>

        {completedServices.length > 0 ? (
          <div className="analytics-visits-list">
            {completedServices.slice(0, 10).map((service) => (
              <div className="analytics-visit-row" key={service.id ?? service.Id}>
                <div>
                  <strong>{service.serviceName ?? service.ServiceName}</strong>
                  <span>{service.specialistName ?? service.SpecialistName}</span>
                </div>
                <div>
                  <span>{(service.clientName ?? service.ClientName) || "Клиент"}</span>
                  <span>{Number(service.price ?? service.Price ?? 0)} ₽</span>
                  <span>{formatAnalyticsVisitTime(new Date(service.completedOn ?? service.CompletedOn))}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="loading-text">Пока нет завершенных услуг за выбранный период</p>
        )}
      </div>
    </div>
  );
}

export function AdminUsers() {
  return <UsersManager />;
}

export function AdminServices() {
  return <ServicesManager />;
}

export function AdminContent() {
  const { t } = useAdminText();
  const [activeType, setActiveType] = useState(CONTENT_TYPES.gallery);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(createEmptyContentForm(CONTENT_TYPES.gallery));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tabs = [
    {
      type: CONTENT_TYPES.gallery,
      title: "Галерея",
      caption: "Фото персонала, салона и атмосферы для /work",
    },
    {
      type: CONTENT_TYPES.blog,
      title: "Блог",
      caption: "Статьи и материалы для /project",
    },
    {
      type: CONTENT_TYPES.contact,
      title: "Контакты",
      caption: "Поля контактной страницы /contact",
    },
  ];

  const activeTab = tabs.find((tab) => tab.type === activeType) || tabs[0];

  useEffect(() => {
    setEditingItem(null);
    setForm(createEmptyContentForm(activeType));
    loadItems(activeType);
  }, [activeType]);

  async function loadItems(type = activeType) {
    setLoading(true);
    setError("");

    try {
      const data = await contentItemsAPI.getAll(type);
      setItems(data);
    } catch (loadError) {
      console.error("Content load error:", loadError);
      setError("Не удалось загрузить контент");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(activeType === CONTENT_TYPES.blog && name === "title" && !editingItem
        ? { slug: slugify(value) }
        : {}),
    }));
  }

  function startEdit(item) {
    const articleBody = parseArticleBody(item.body);

    setEditingItem(item);
    setForm({
      title: item.title,
      slug: item.slug,
      subtitle: item.subtitle,
      body: articleBody.text,
      articleImages: articleBody.images.join("\n"),
      imageUrl: item.imageUrl,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
  }

  function resetForm() {
    setEditingItem(null);
    setForm(createEmptyContentForm(activeType));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload =
        activeType === CONTENT_TYPES.blog
          ? {
              ...form,
              body: composeArticleBody(form.body, form.articleImages.split(/\r?\n/)),
            }
          : form;

      if (editingItem) {
        await contentItemsAPI.update(editingItem.id, payload, activeType);
      } else {
        await contentItemsAPI.create(payload, activeType);
      }

      resetForm();
      await loadItems(activeType);
    } catch (saveError) {
      console.error("Content save error:", saveError);
      setError("Не удалось сохранить контент");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Удалить "${item.title}"?`)) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await contentItemsAPI.delete(item.id);
      if (editingItem?.id === item.id) {
        resetForm();
      }
      await loadItems(activeType);
    } catch (deleteError) {
      console.error("Content delete error:", deleteError);
      setError("Не удалось удалить контент");
    } finally {
      setSaving(false);
    }
  }

  const needsSlug = activeType === CONTENT_TYPES.blog;
  const needsImage = activeType !== CONTENT_TYPES.contact;
  const needsBody = activeType === CONTENT_TYPES.blog;
  const titleLabel = activeType === CONTENT_TYPES.contact ? "Название поля" : "Название";
  const subtitleLabel =
    activeType === CONTENT_TYPES.contact
      ? "Значение"
      : activeType === CONTENT_TYPES.blog
        ? "Короткое описание для /project"
        : "Короткое описание";
  const imageLabel = activeType === CONTENT_TYPES.blog ? "Баннер статьи URL" : "Изображение URL";
  const articlePreviewPath =
    activeType === CONTENT_TYPES.blog && (form.slug || form.id || form.title)
      ? `/project/${encodeURIComponent(form.slug || form.id || form.title)}`
      : "";

  return (
    <div className="admin-section">
      <div className="admin-hero-panel">
        <div>
          <p className="admin-panel-eyebrow">Content studio</p>
          <h3>{t.content.title}</h3>
          <p className="admin-panel-copy">
            Управляй галереей, блогом и контактными полями без изменения кода.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => loadItems(activeType)}>
          Обновить
        </button>
      </div>

      <div className="content-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            type="button"
            className={activeType === tab.type ? "active" : ""}
            onClick={() => setActiveType(tab.type)}
          >
            <span>{tab.title}</span>
            <small>{tab.caption}</small>
          </button>
        ))}
      </div>

      {error && <p className="admin-error-text">{error}</p>}

      <div className="content-editor-layout">
        <form className="admin-form content-editor-form" onSubmit={handleSubmit}>
          <div className="content-editor-heading">
            <h4>{editingItem ? "Редактирование" : `Новый элемент: ${activeTab.title}`}</h4>
            <p>{activeTab.caption}</p>
          </div>

          <div className="form-group">
            <label htmlFor="content-title">{titleLabel}</label>
            <input
              id="content-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleFieldChange}
              required
              placeholder={activeType === CONTENT_TYPES.contact ? "Например: Телефон" : "Название"}
            />
          </div>

          {needsSlug && (
            <div className="form-group">
              <label htmlFor="content-slug">Slug</label>
              <input
                id="content-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleFieldChange}
                placeholder="kak-vybrat-massazh"
              />
              <small className="content-field-hint">
                URL статьи: /project/{form.slug || "slug-stati"}
              </small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="content-subtitle">{subtitleLabel}</label>
            <input
              id="content-subtitle"
              name="subtitle"
              type="text"
              value={form.subtitle}
              onChange={handleFieldChange}
              placeholder={activeType === CONTENT_TYPES.contact ? "+373 123 456" : "Короткая подпись"}
            />
          </div>

          {needsImage && (
            <div className="form-group">
              <label htmlFor="content-image">{imageLabel}</label>
              <input
                id="content-image"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleFieldChange}
                placeholder="https://..."
              />
            </div>
          )}

          {needsBody && (
            <>
              <div className="form-group">
                <label htmlFor="content-body">Текст статьи</label>
                <textarea
                  id="content-body"
                  name="body"
                  className="services-textarea"
                  value={form.body}
                  onChange={handleFieldChange}
                  placeholder="Полный текст статьи, который откроется на странице /project/slug"
                  rows={10}
                />
                <small className="content-field-hint">
                  Это поле показывается на отдельной странице статьи. На /project показывается короткое описание выше.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="content-article-images">Дополнительные изображения статьи</label>
                <textarea
                  id="content-article-images"
                  name="articleImages"
                  className="services-textarea"
                  value={form.articleImages}
                  onChange={handleFieldChange}
                  placeholder="Один URL на строку: https://..."
                  rows={5}
                />
                <small className="content-field-hint">
                  Эти изображения появятся ниже текста на странице отдельной статьи.
                </small>
              </div>
            </>
          )}

          <div className="services-row">
            <div className="form-group">
              <label htmlFor="content-sort">Порядок</label>
              <input
                id="content-sort"
                name="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={handleFieldChange}
              />
            </div>
            <label className="content-checkbox">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleFieldChange}
              />
              Показывать на сайте
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Сохраняю..." : editingItem ? "Сохранить" : "Добавить"}
            </button>
            {articlePreviewPath && (
              <a className="btn-secondary" href={articlePreviewPath} target="_blank" rel="noreferrer">
                Открыть статью
              </a>
            )}
            <button type="button" className="btn-secondary" onClick={resetForm} disabled={saving}>
              Очистить
            </button>
          </div>
        </form>

        <div className="content-items-panel">
          <div className="content-editor-heading">
            <h4>{activeTab.title}</h4>
            <p>{items.length} элементов</p>
          </div>

          {loading ? (
            <p className="loading-text">{t.content.loading}</p>
          ) : items.length === 0 ? (
            <p className="loading-text">Пока ничего не добавлено</p>
          ) : (
            <div className="content-items-list">
              {items.map((item) => (
                <div className="content-item-row" key={item.id}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" />
                  )}
                  <div className="content-item-main">
                    <div className="content-item-title">
                      <strong>{item.title}</strong>
                      {!item.isActive && <span>Скрыто</span>}
                    </div>
                    <p>{item.subtitle || item.slug || "Без подписи"}</p>
                  </div>
                  <div className="content-item-actions">
                    {activeType === CONTENT_TYPES.blog && (
                      <a
                        className="btn-secondary"
                        href={`/project/${encodeURIComponent(item.slug || item.id || item.title)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    )}
                    <button type="button" className="btn-secondary" onClick={() => startEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="btn-secondary danger" onClick={() => handleDelete(item)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function createEmptyContentForm(type) {
  return {
    title: "",
    slug: "",
    subtitle: "",
    body: "",
    articleImages: "",
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
    contentType: type,
  };
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ё/g, "e")
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminSettings() {
  const { settings, loading: settingsLoading, saving, updateSettings } = useSettings();
  const { t } = useAdminText();

  return (
    <div className="admin-section">
      <h3>{t.settings.title}</h3>

      {settingsLoading ? (
        <p className="loading-text">{t.settings.loading}</p>
      ) : (
        <form
          className="admin-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            setStoredAdminLanguage(data.language);
            await updateSettings(data);
          }}
        >
          <div className="form-group">
            <label htmlFor="siteName">{t.settings.siteName}</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              defaultValue={settings?.siteName || 'MassageSalon'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="adminEmail">{t.settings.adminEmail}</label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              defaultValue={settings?.adminEmail || 'admin@example.com'}
            />
          </div>
          <div className="form-group">
            <label htmlFor="language">{t.settings.language}</label>
            <select
              id="language"
              name="language"
              defaultValue={settings?.language || getStoredAdminLanguage()}
              onChange={(event) => setStoredAdminLanguage(event.target.value)}
            >
              {ADMIN_LANGUAGES.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="timezone">{t.settings.timezone}</label>
            <select
              id="timezone"
              name="timezone"
              defaultValue={settings?.timezone || 'europe/chisinau'}
            >
              <option value="europe/chisinau">Chisinau (EET)</option>
              <option value="utc">UTC</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? t.settings.saving : t.settings.save}
            </button>
            <button type="reset" className="btn-secondary">{t.settings.reset}</button>
          </div>
        </form>
      )}
    </div>
  );
}
