import type { UnitId } from "./types";

export type Route =
  | { name: "home" }
  | { name: "unit"; unit: UnitId }
  | { name: "article"; slug: string };

export function parseHash(): Route {
  const hash = location.hash.replace(/^#/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "article" && parts[1]) {
    return { name: "article", slug: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "med" || parts[0] === "bread") {
    return { name: "unit", unit: parts[0] };
  }
  return { name: "home" };
}

export function hrefHome(): string {
  return "#/";
}

export function hrefUnit(unit: UnitId): string {
  return `#/${unit}`;
}

export function hrefArticle(slug: string): string {
  return `#/article/${slug}`;
}

export function onRoute(fn: () => void): void {
  window.addEventListener("hashchange", fn);
}
