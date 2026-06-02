/**
 * Поля совпадают с C# DTO в eUseControl.Domain:
 * CreateServiceDto / UpdateServiceDto / ServiceResponseDto
 * CreateServiceImageDto / ServiceImageResponseDto
 * ServiceCategoryResponseDto
 */

export function normalizeService(raw) {
  if (!raw) return null;

  return {
    id: raw.id ?? raw.Id ?? "",
    nameOfService: raw.nameOfService ?? raw.NameOfService ?? "",
    nameOfMaster: raw.nameOfMaster ?? raw.NameOfMaster ?? "",
    descriptionOfService:
      raw.descriptionOfService ?? raw.DescriptionOfService ?? "",
    durationOfService: Number(
      raw.durationOfService ?? raw.DurationOfService ?? 0,
    ),
    priceOfService: Number(raw.priceOfService ?? raw.PriceOfService ?? 0),
    categoryId: raw.categoryId ?? raw.CategoryId ?? "",
  };
}

export function normalizeServiceCategory(raw) {
  if (!raw) return null;

  return {
    id: raw.id ?? raw.Id ?? "",
    nameOfCategory: raw.nameOfCategory ?? raw.NameOfCategory ?? "",
    isActive: raw.isActive ?? raw.IsActive ?? true,
  };
}

export function normalizeServiceImage(raw) {
  if (!raw) return null;

  return {
    id: raw.id ?? raw.Id ?? "",
    imageUrl: raw.imageUrl ?? raw.ImageUrl ?? "",
    fileName: raw.fileName ?? raw.FileName ?? "",
    serviceName: raw.serviceName ?? raw.ServiceName ?? "",
    serviceId: raw.serviceId ?? raw.ServiceId ?? "",
    fileSize: Number(raw.fileSize ?? raw.FileSize ?? 0),
    uploadedAt: raw.uploadedAt ?? raw.UploadedAt ?? null,
  };
}

/** Тело POST/PUT для Services — как CreateServiceDto на бэке */
export function toCreateServiceDto(form) {
  return {
    NameOfService: String(form.nameOfService ?? "").trim(),
    NameOfMaster: String(form.nameOfMaster ?? "").trim(),
    DescriptionOfService: String(form.descriptionOfService ?? "").trim(),
    DurationOfService: parseInt(String(form.durationOfService), 10) || 0,
    PriceOfService: parseFloat(String(form.priceOfService)) || 0,
    CategoryId: String(form.categoryId ?? "").trim(),
  };
}

/** Тело POST для ServiceImages — как CreateServiceImageDto */
export function toCreateServiceImageDto({
  imageUrl,
  fileName,
  serviceName,
  serviceId,
  fileSize,
}) {
  return {
    ImageUrl: String(imageUrl ?? "").trim(),
    FileName: String(fileName ?? "").trim(),
    ServiceName: String(serviceName ?? "").trim(),
    ServiceId: String(serviceId ?? "").trim(),
    FileSize: Number(fileSize) || 0,
  };
}

export function toCreateServiceCategoryDto({ nameOfCategory, isActive = true }) {
  return {
    NameOfCategory: String(nameOfCategory ?? "").trim(),
    IsActive: Boolean(isActive),
  };
}
