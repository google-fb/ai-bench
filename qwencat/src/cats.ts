export type CatPhoto = {
  id: string;
  sourceUrl: string;
  blob: Blob;
  objectUrl: string;
};

const CAT_API = "https://api.thecatapi.com/v1/images/search?limit=1";
const CATAAS = "https://cataas.com/cat?json=true";

async function blobFromUrl(url: string): Promise<Blob> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`下載圖片失敗：${response.status}`);
  }
  return response.blob();
}

async function fromTheCatApi(): Promise<CatPhoto> {
  const response = await fetch(CAT_API, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Cat API 失敗：${response.status}`);
  }
  const payload = (await response.json()) as Array<{ id?: string; url: string }>;
  const item = payload[0];
  if (!item?.url) {
    throw new Error("Cat API 沒有回傳圖片");
  }
  const blob = await blobFromUrl(item.url);
  return {
    id: item.id ?? item.url,
    sourceUrl: item.url,
    blob,
    objectUrl: URL.createObjectURL(blob),
  };
}

async function fromCataas(): Promise<CatPhoto> {
  const response = await fetch(CATAAS, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`CATAAS 失敗：${response.status}`);
  }
  const payload = (await response.json()) as { url?: string; _id?: string };
  const path = payload.url ?? "";
  const sourceUrl = path.startsWith("http") ? path : `https://cataas.com${path}`;
  const blob = await blobFromUrl(sourceUrl);
  return {
    id: payload._id ?? sourceUrl,
    sourceUrl,
    blob,
    objectUrl: URL.createObjectURL(blob),
  };
}

export async function fetchCatPhoto(): Promise<CatPhoto> {
  try {
    return await fromTheCatApi();
  } catch (first) {
    try {
      return await fromCataas();
    } catch {
      throw first;
    }
  }
}
