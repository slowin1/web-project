import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  servicesAPI,
  serviceCategoriesAPI,
  serviceImagesAPI,
  specialistsAPI,
} from "../../api/admin";
import { FALLBACK_IMAGE } from "../../api/catalog";
import { toCreateServiceDto } from "../../api/dtoMappers";
import { useAdminText } from "./adminI18n";

const EMPTY_FORM = {
  nameOfService: "",
  nameOfMaster: "",
  descriptionOfService: "",
  durationOfService: 60,
  priceOfService: 0,
  categoryId: "",
};

function normalizeSpecialist(raw) {
  if (!raw) return null;
  return {
    id: raw.id ?? raw.Id ?? "",
    fullName: raw.fullName ?? raw.FullName ?? "",
    phoneNumber: raw.phoneNumber ?? raw.PhoneNumber ?? "",
    bio: raw.bio ?? raw.Bio ?? "",
    photoUrl: raw.photoUrl ?? raw.PhotoUrl ?? "",
    isActive: raw.isActive ?? raw.IsActive ?? true,
  };
}

function readImageUrlFromService(serviceImagesByServiceId, serviceId) {
  return serviceImagesByServiceId[serviceId]?.imageUrl || "";
}

function getFileNameFromUrl(url) {
  if (!url) return "external-link";
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    return segments.pop() || parsedUrl.hostname || "external-link";
  } catch {
    return "external-link";
  }
}

function buildImagePayload({ imageUrl, serviceName, serviceId, fileName }) {
  return {
    imageUrl,
    fileName: fileName || getFileNameFromUrl(imageUrl),
    serviceName,
    serviceId,
    fileSize: 1,
  };
}

function stopScrollPropagation(event) {
  event.stopPropagation();
}

export default function ServicesManager() {
  const { t } = useAdminText();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [serviceImagesByServiceId, setServiceImagesByServiceId] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSpecialistDropdownOpen, setIsSpecialistDropdownOpen] = useState(false);
  const imageInputRef = useRef(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [servicesRaw, categoriesRaw, imagesRaw, specialistsRaw] =
        await Promise.all([
          servicesAPI.getAll(),
          serviceCategoriesAPI.getAll().catch(() => []),
          serviceImagesAPI.getAll().catch(() => []),
          specialistsAPI.getAll().catch(() => []),
        ]);

      const servicesList = Array.isArray(servicesRaw) ? servicesRaw : [];
      const categoriesList = Array.isArray(categoriesRaw) ? categoriesRaw : [];
      const imagesList = Array.isArray(imagesRaw) ? imagesRaw : [];
      const specialistsList = Array.isArray(specialistsRaw)
        ? specialistsRaw
            .map(normalizeSpecialist)
            .filter((specialist) => specialist && specialist.id)
        : [];

      const imagesMap = imagesList.reduce((acc, image) => {
        const serviceId = image.serviceId;
        if (serviceId && !acc[serviceId]) {
          acc[serviceId] = image;
        }
        return acc;
      }, {});

      setServices(servicesList);
      setCategories(categoriesList);
      setSpecialists(specialistsList);
      setServiceImagesByServiceId(imagesMap);
    } catch (err) {
      console.error(err);
      setError(
        "Не удалось загрузить данные. Проверьте, что бэкенд запущен и доступен.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const specialistOptions = useMemo(
    () => specialists.filter((specialist) => specialist.isActive !== false),
    [specialists],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "priceOfService" || name === "durationOfService"
          ? Number(value)
          : value,
    }));
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const validateForm = () => {
    const dto = toCreateServiceDto(formData);

    if (dto.NameOfService.length < 5) {
      return "Название услуги — минимум 5 символов.";
    }
    if (!selectedSpecialistId || dto.NameOfMaster.length < 5) {
      return "Выберите мастера из списка специалистов.";
    }
    if (dto.DescriptionOfService.length < 30) {
      return "Описание — минимум 30 символов (требование API).";
    }
    if (!dto.CategoryId) {
      return "Выберите категорию. Если список пуст — создайте категорию в базе.";
    }
    if (dto.DurationOfService <= 0) {
      return "Укажите длительность в минутах.";
    }
    if (dto.PriceOfService <= 0) {
      return "Укажите цену больше 0.";
    }
    return null;
  };

  const upsertServiceImage = async (service) => {
    const nextImageUrl = imageUrl.trim();
    const existingImage = serviceImagesByServiceId[service.id];
    if (!nextImageUrl) {
      if (existingImage?.id) {
        await serviceImagesAPI.delete(existingImage.id);
      }
      return;
    }
    const payload = buildImagePayload({
      imageUrl: nextImageUrl,
      serviceName: service.nameOfService,
      serviceId: service.id,
      fileName: existingImage?.fileName,
    });
    if (existingImage?.id) {
      await serviceImagesAPI.update(existingImage.id, payload);
      return;
    }
    await serviceImagesAPI.create(payload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    try {
      let savedService;
      if (editingService) {
        savedService = await servicesAPI.update(editingService.id, formData);
      } else {
        savedService = await servicesAPI.create(formData);
      }
      if (savedService?.id) {
        await upsertServiceImage(savedService);
      }
      await loadData();
      closeModal();
    } catch (err) {
      console.error(err);
      setError(
        editingService
          ? "Не удалось обновить услугу. Проверьте права администратора."
          : "Не удалось создать услугу. Проверьте права администратора.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm("Удалить эту услугу?")) return;
    setError("");
    try {
      const image = serviceImagesByServiceId[service.id];
      if (image?.id) {
        await serviceImagesAPI.delete(image.id).catch(() => null);
      }
      await servicesAPI.delete(service.id);
      setServices((prev) => prev.filter((item) => item.id !== service.id));
    } catch (err) {
      console.error(err);
      setError("Не удалось удалить услугу.");
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        nameOfService: service.nameOfService || "",
        nameOfMaster: service.nameOfMaster || "",
        descriptionOfService: service.descriptionOfService || "",
        durationOfService: service.durationOfService || 60,
        priceOfService: service.priceOfService || 0,
        categoryId: service.categoryId || categories[0]?.id || "",
      });
      const matchedSpecialist = specialistOptions.find(
        (specialist) => specialist.fullName === service.nameOfMaster,
      );
      setSelectedSpecialistId(matchedSpecialist?.id || "");
      setImageUrl(readImageUrlFromService(serviceImagesByServiceId, service.id));
    } else {
      setEditingService(null);
      setFormData({
        ...EMPTY_FORM,
        categoryId: categories[0]?.id || "",
      });
      setSelectedSpecialistId("");
      setImageUrl("");
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
    setIsSpecialistDropdownOpen(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setSelectedSpecialistId("");
    setImageUrl("");
    setIsSpecialistDropdownOpen(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const getCategoryName = (categoryId) =>
    categories.find((c) => c.id === categoryId)?.nameOfCategory || categoryId;

  if (loading) {
    return <p className="services-loading-text">{t.services.loading}</p>;
  }

  return (
    <div className="services-root services-manager">
      <div className="admin-services-header">
        <div>
          <p className="admin-panel-eyebrow">{t.services.eyebrow}</p>
          <h3>{t.services.title}</h3>
        </div>
        <button
          type="button"
          className="services-add-btn"
          onClick={() => openModal()}
        >
          {t.services.add}
        </button>
      </div>

      <div className="admin-mini-metrics">
        <div className="admin-mini-card">
          <span>{t.services.services}</span>
          <strong>{services.length}</strong>
        </div>
        <div className="admin-mini-card">
          <span>{t.services.categories}</span>
          <strong>{categories.length}</strong>
        </div>
        <div className="admin-mini-card">
          <span>{t.services.masters}</span>
          <strong>{specialistOptions.length}</strong>
        </div>
      </div>

      {error && (
        <p className="services-error" role="alert">
          {error}
        </p>
      )}

      {categories.length === 0 && (
        <p className="services-hint">
          {t.services.noCategories} <code>/api/ServiceCategories</code>.
        </p>
      )}

      {specialistOptions.length === 0 && (
        <p className="services-hint">
          {t.services.noSpecialists}
        </p>
      )}

      {isModalOpen && (
        <div
          className="services-modal-overlay"
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          onWheel={stopScrollPropagation}
          onTouchMove={stopScrollPropagation}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            className="services-modal-card"
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
          >
            <div className="services-modal-top">
              <h4 className="services-modal-title">
                {editingService ? t.services.editService : t.services.newService}
              </h4>
              <button
                type="button"
                className="services-modal-close"
                onClick={closeModal}
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>

            <div
              className="services-modal-body"
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              onWheel={stopScrollPropagation}
              onTouchMove={stopScrollPropagation}
            >
              <form id="service-manager-form" className="services-form" onSubmit={handleSubmit} noValidate>
                <div className="services-field">
                  <label className="services-label" htmlFor="specialistId">{t.services.masterFromDb}</label>

                  <div className="services-select-wrapper">
                    <button
                      type="button"
                      className="services-select-trigger"
                      onClick={() => setIsSpecialistDropdownOpen((v) => !v)}
                      aria-haspopup="listbox"
                      aria-expanded={isSpecialistDropdownOpen}
                    >
                      <span className="services-select-value">
                        {selectedSpecialistId
                          ? specialistOptions.find((s) => s.id === selectedSpecialistId)
                              ?.fullName
                          : t.services.chooseMaster}
                      </span>
                      <span className="services-caret">▾</span>
                    </button>

                    {isSpecialistDropdownOpen && (
                      <div className="services-select-menu" role="listbox" aria-label="Выбор мастера">
                        <button
                          type="button"
                          className="services-select-option"
                          onClick={() => {
                            setSelectedSpecialistId("");
                            setFormData((prev) => ({ ...prev, nameOfMaster: "" }));
                            setIsSpecialistDropdownOpen(false);
                          }}
                        >
                          {t.services.chooseMaster}
                        </button>

                        <div className="services-select-scroll">
                          {specialistOptions.map((specialist) => (
                            <button
                              key={specialist.id}
                              type="button"
                              className={"services-select-option" + (specialist.id === selectedSpecialistId ? " is-active" : "")}
                              onClick={() => {
                                setSelectedSpecialistId(specialist.id);
                                setFormData((prev) => ({ ...prev, nameOfMaster: specialist.fullName }));
                                setIsSpecialistDropdownOpen(false);
                              }}
                            >
                              {specialist.fullName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="services-hint-small">{t.services.chooseMasterHint}</p>
                </div>

                <div className="services-field">
                  <label className="services-label" htmlFor="nameOfService">{t.services.serviceName}</label>
                  <input
                    id="nameOfService"
                    type="text"
                    name="nameOfService"
                    className="services-input"
                    value={formData.nameOfService}
                    onChange={handleChange}
                    required
                    placeholder="Классический массаж"
                  />
                </div>

                <div className="services-field">
                  <label className="services-label" htmlFor="nameOfMaster">{t.services.masterName}</label>
                  <input
                    id="nameOfMaster"
                    type="text"
                    name="nameOfMaster"
                    className="services-input"
                    value={formData.nameOfMaster}
                    readOnly
                    required
                    placeholder="Выберите мастера"
                  />
                  <p className="services-hint-small">{t.services.masterAuto}</p>
                </div>

                <div className="services-row">
                  <div className="services-field">
                    <label className="services-label" htmlFor="priceOfService">{t.services.priceRub}</label>
                    <input
                      id="priceOfService"
                      type="number"
                      name="priceOfService"
                      className="services-input"
                      min="1"
                      step="1"
                      value={formData.priceOfService}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="services-field">
                    <label className="services-label" htmlFor="durationOfService">{t.services.durationMin}</label>
                    <input
                      id="durationOfService"
                      type="number"
                      name="durationOfService"
                      className="services-input"
                      min="1"
                      value={formData.durationOfService}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="services-field">
                  <label className="services-label" htmlFor="categoryId">{t.services.category}</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="services-select"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t.services.chooseCategory}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nameOfCategory}</option>
                    ))}
                  </select>
                </div>

                <div className="services-field">
                  <label className="services-label" htmlFor="descriptionOfService">{t.services.description}</label>
                  <textarea
                    id="descriptionOfService"
                    name="descriptionOfService"
                    className="services-textarea"
                    value={formData.descriptionOfService}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Минимум 30 символов — опишите услугу подробнее..."
                  />
                </div>

                <div className="services-field">
                  <label className="services-label" htmlFor="imageUrl">{t.services.image}</label>
                  <input
                    id="imageUrl"
                    ref={imageInputRef}
                    type="text"
                    className="services-input"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="Вставьте ссылку на изображение"
                  />
                  <p className="services-hint-small">{t.services.publicLink}</p>
                  {imageUrl && (
                    <div className="services-image-preview">
                      <img src={imageUrl} alt="Превью услуги" onError={(e)=>{e.currentTarget.src = FALLBACK_IMAGE}} />
                    </div>
                  )}
                </div>

              </form>
            </div>
            <div className="services-modal-actions">
              <button type="submit" form="service-manager-form" className="services-action-save" disabled={saving}>
                {saving ? t.services.saving : editingService ? t.services.save : t.services.create}
              </button>
              <button type="button" className="services-action-cancel" onClick={closeModal}>{t.services.cancel}</button>
            </div>
          </div>
        </div>
      )}

      <div className="services-table-wrap">
        <table className="services-table">
          <thead>
            <tr>
              <th>{t.services.photo}</th>
              <th>{t.services.name}</th>
              <th>{t.services.master}</th>
              <th>{t.services.price}</th>
              <th>{t.services.duration}</th>
              <th>{t.services.category}</th>
              <th>{t.services.actions}</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  {t.services.empty}
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div className="services-thumb">
                      <img src={readImageUrlFromService(serviceImagesByServiceId, service.id) || FALLBACK_IMAGE} alt={service.nameOfService} />
                    </div>
                  </td>
                  <td>{service.nameOfService}</td>
                  <td>{service.nameOfMaster}</td>
                  <td>{service.priceOfService} ₽</td>
                  <td>{service.durationOfService} мин</td>
                  <td><span className="services-category-badge">{getCategoryName(service.categoryId)}</span></td>
                  <td>
                    <div className="services-table-actions">
                      <button type="button" className="services-icon-btn" onClick={() => openModal(service)} title={t.services.edit}>{t.services.edit}</button>
                      <button type="button" className="services-icon-btn danger" onClick={() => handleDelete(service)} title={t.services.del}>{t.services.del}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
