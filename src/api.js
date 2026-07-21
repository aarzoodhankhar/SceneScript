import axios from "axios";
import { API_BASE } from "./config";

export function moderateSingle(apiKey, imageFile, text) {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("text", text);
  return axios.post(`${API_BASE}/v1/moderate`, form, {
    headers: { "x-api-key": apiKey },
  });
}

export function explainSingle(apiKey, imageFile, text) {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("text", text);
  return axios.post(`${API_BASE}/v1/explain`, form, {
    headers: { "x-api-key": apiKey },
  });
}

export function moderateBatch(apiKey, items) {
  const form = new FormData();
  items.forEach((item) => {
    form.append("images", item.image);
    form.append("texts", item.text);
  });
  return axios.post(`${API_BASE}/v1/moderate/batch`, form, {
    headers: { "x-api-key": apiKey },
  });
}
