const BASE = "http://localhost:8000";

export async function request(
  path,
  { method = "GET", body, token, isForm = false } = {}
) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let payload;
  if (body) {
    if (isForm) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      payload = new URLSearchParams(body);
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  const res = await fetch(BASE + path, { method, headers, body: payload });
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof data?.detail === "string" ? data.detail : "Something went wrong";
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}