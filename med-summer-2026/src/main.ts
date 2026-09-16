import "./style.css";
import { mountLab } from "./labs/index";
import { onRoute, parseHash, type Route } from "./router";
import { applyPrefs } from "./store";
import { bindChrome, renderFooter, renderHeader } from "./ui/chrome";
import { bindHome, renderHome } from "./views/home";
import { renderArticle } from "./views/article";

function routeKey(route: Route): string {
  return route.name === "home" ? "home" : `article:${route.slug}`;
}

let lastRouteKey = "";

function render(opts: { scroll?: boolean } = {}): void {
  applyPrefs();
  const app = document.querySelector("#app");
  if (!app) return;
  const route = parseHash();
  const key = routeKey(route);
  const body = route.name === "home" ? renderHome() : renderArticle(route.slug);
  app.innerHTML = `${renderHeader()}${body}${renderFooter()}`;
  bindChrome(app as HTMLElement, { onLangChange: () => render({ scroll: false }) });
  if (route.name === "home") bindHome(app as HTMLElement);
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
