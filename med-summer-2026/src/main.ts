import "./style.css";
import { mountLab } from "./labs/index";
import { onRoute, parseHash } from "./router";
import { applyPrefs } from "./store";
import { bindChrome, renderFooter, renderHeader } from "./ui/chrome";
import { bindHome, renderHome } from "./views/home";
import { renderArticle } from "./views/article";

function render(): void {
  applyPrefs();
  const app = document.querySelector("#app");
  if (!app) return;
  const route = parseHash();
  const body = route.name === "home" ? renderHome() : renderArticle(route.slug);
  app.innerHTML = `${renderHeader()}${body}${renderFooter()}`;
  bindChrome(app as HTMLElement);
  if (route.name === "home") bindHome(app as HTMLElement);
  app.querySelectorAll<HTMLElement>("[data-lab]").forEach(mountLab);
}

onRoute(render);
if (!location.hash) location.hash = "/";
else render();
