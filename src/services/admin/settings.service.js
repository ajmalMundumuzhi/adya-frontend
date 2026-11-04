
import adminApi from "./admin.api";

export async function getAllSettings() {
  const response = await adminApi.get("/settings");
  return response.data.data || [];
}

export async function getSetting(key) {
  const response = await adminApi.get(
    `/settings/${encodeURIComponent(key)}`
  );
  return response.data.data;
}

export async function saveSetting(key, value) {
  const response = await adminApi.put(
    `/settings/${encodeURIComponent(key)}`,
    { value }
  );
  return response.data.data;
}

export async function getSettingsMap() {
  const settings = await getAllSettings();

  return settings.reduce((result, setting) => {
    result[setting.key] = setting.value;
    return result;
  }, {});
}



export async function uploadSiteImage(file, assetType) {
  if (!(file instanceof File)) {
    throw new Error("Invalid image file selected.");
  }

  const formData = new FormData();

  formData.append("image", file, file.name);
  formData.append("assetType", assetType);

  console.log("FormData image:", formData.get("image"));
  console.log("FormData assetType:", formData.get("assetType"));

  const response = await adminApi.post(
    "/settings/upload",
    formData
  );

  return response.data.data;
}