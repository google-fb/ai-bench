export type Route = { name: "home" } | { name: "article"; slug: string };

export function parseHash(): Route {
  const hash = location.hash.replace(/^#/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "article" && parts[1]) {
    return { name: "article", slug: decodeURIComponent(parts[1]) };
  }
  return { name: "home" };
}

export function hrefHome(): string {
  return "#/";
}

export function hrefArticle(slug: string): string {
  return `#/article/${slug}`;
}

export function onRoute(fn: () => void): void {
  window.addEventListener("hashchange", fn);
}
