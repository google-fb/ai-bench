import "./style.css";
import { mountLab } from "./labs/index";
import { findArticle, unitOf } from "./data/catalog";
import { onRoute, parseHash, type Route } from "./router";
import { applyPrefs } from "./store";
import { bindChrome, renderFooter, renderHeader } from "./ui/chrome";
import { bindHome, renderHome, renderUnitHome } from "./views/home";
import { renderArticle } from "./views/article";
import type { UnitId } from "./types";

function routeKey(route: Route): string {
  if (route.name === "home") return "home";
  if (route.name === "unit") return `unit:${route.unit}`;
  return `article:${route.slug}`;
}

function routeUnit(route: Route): UnitId | undefined {
  if (route.name === "unit") return route.unit;
  if (route.name === "article") {
    const article = findArticle(route.slug);
    return article ? unitOf(article) : undefined;
  }
  return undefined;
}

let lastRouteKey = "";

function render(opts: { scroll?: boolean } = {}): void {
  applyPrefs();
  const app = document.querySelector("#app");
  if (!app) return;
  const route = parseHash();
  const key = routeKey(route);
  const unit = routeUnit(route);
  const body =
    route.name === "home" ? renderHome() : route.name === "unit" ? renderUnitHome(route.unit) : renderArticle(route.slug);
  app.innerHTML = `${renderHeader(unit)}${body}${renderFooter(unit)}`;
  bindChrome(app as HTMLElement, { onLangChange: () => render({ scroll: false }) });
  if (route.name === "unit") bindHome(app as HTMLElement);
  app.querySelectorAll<HTMLElement>("[data-lab]").forEach(mountLab);
  if (opts.scroll !== false && key !== lastRouteKey) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const heading = document.querySelector<HTMLElement>(".article-title, .hero h1");
    heading?.focus({ preventScroll: true });
  }
  lastRouteKey = key;
}

onRoute(() => render({ scroll: true }));
if (!location.hash) location.hash = "/";
else render({ scroll: true });
