import './style.css';
import { concepts, glossary } from './data/concepts';
import { benchmarks, categories, indexComponents, type Benchmark } from './data/benchmarks';

const app = document.querySelector<HTMLDivElement>('#app')!;

function benchmarkArticle(b: Benchmark): string {
  const badges = b.badges.map((x) => `<span class="badge ${x.includes('退役') || x.includes('取代') ? 'badge-retired' : x.includes('智慧指數') ? 'badge-index' : ''}">${x}</span>`).join('');
  const facts = b.facts
    .map((f) => `<div class="fact"><dt>${f.label}</dt><dd>${f.value}</dd></div>`)
    .join('');
  const list = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
  return `
    <article class="entry" id="${b.id}" data-search="${escapeAttr([b.name, b.zhName, b.oneLiner, ...b.keywords].join(' '))}">
      <header class="entry-header">
        <div class="entry-title-row">
          <h3><a href="#${b.id}" class="anchor-link">${b.name}</a></h3>
          <div class="badges">${badges}</div>
        </div>
        <p class="entry-zh-name">${b.zhName}</p>
        <p class="entry-oneliner">${b.oneLiner}</p>
      </header>
      <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>${b.analogy}</div>
      <div class="entry-body">
        <section><h4><span class="h4-icon">🎯</span>測什麼?</h4><p>${b.whatItTests}</p></section>
        <section><h4><span class="h4-icon">📚</span>測試集是什麼?</h4>${list(b.dataset)}</section>
        <section><h4><span class="h4-icon">🧪</span>怎麼測?</h4>${list(b.method)}</section>
        <section><h4><span class="h4-icon">📊</span>分數怎麼算、代表什麼?</h4>${list(b.scoring)}</section>
      </div>
      <dl class="facts">${facts}</dl>
    </article>
  `;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function render() {
  const conceptNav = concepts
    .map((c) => `<li><a href="#${c.id}">${c.icon} ${c.title}</a></li>`)
    .join('');

  const categoryNav = categories
    .map((cat) => {
      const items = benchmarks
        .filter((b) => b.category === cat.id)
        .map((b) => `<li><a href="#${b.id}">${b.name}</a></li>`)
        .join('');
      return `<li class="nav-group"><a href="#cat-${cat.id}" class="nav-group-title">${cat.icon} ${cat.title}</a><ul>${items}</ul></li>`;
    })
    .join('');

  const conceptSections = concepts
    .map(
      (c) => `
      <article class="entry concept" id="${c.id}" data-search="${escapeAttr([c.title, ...c.keywords].join(' '))}">
        <header class="entry-header"><div class="entry-title-row"><h3><a href="#${c.id}" class="anchor-link">${c.icon} ${c.title}</a></h3></div></header>
        <div class="entry-body">${c.html}</div>
      </article>`
    )
    .join('');

  const indexRows = indexComponents
    .map(
      (r) => `
      <tr>
        <td>${r.category}<span class="cat-weight">${r.categoryWeight}</span></td>
        <td><a href="#${r.evalId}">${r.eval_}</a></td>
        <td class="td-weight">${r.weight}</td>
        <td class="td-desc">${r.desc}</td>
      </tr>`
    )
    .join('');

  const categorySections = categories
    .map((cat) => {
      const entries = benchmarks.filter((b) => b.category === cat.id).map(benchmarkArticle).join('');
      return `
        <section class="category-section" id="cat-${cat.id}">
          <div class="category-head">
            <h2>${cat.icon} ${cat.title}</h2>
            <p class="category-intro">${cat.intro}</p>
          </div>
          ${entries}
        </section>`;
    })
    .join('');

  const glossaryItems = glossary
    .map(
      (g) => `
      <div class="glossary-item" data-search="${escapeAttr(`${g.term} ${g.en} ${g.def}`)}">
        <dt>${g.term}<span class="glossary-en">${g.en}</span></dt>
        <dd>${g.def}</dd>
      </div>`
    )
    .join('');

  app.innerHTML = `
    <div class="layout">
      <header class="topbar">
        <button class="menu-btn" id="menuBtn" aria-label="開啟目錄">☰</button>
        <a class="brand" href="#top">
          <span class="brand-mark">AI</span>
          <span class="brand-text">Benchmark 小百科</span>
        </a>
        <div class="search-wrap">
          <input id="search" type="search" placeholder="搜尋條目,例如:GPQA、幻覺、Elo…" autocomplete="off" />
          <span class="search-count" id="searchCount"></span>
        </div>
      </header>

      <div class="body-wrap">
        <aside class="sidebar" id="sidebar">
          <nav>
            <p class="nav-section-title">入門必讀</p>
            <ul>${conceptNav}</ul>
            <p class="nav-section-title">綜合指數</p>
            <ul><li><a href="#intelligence-index">🏆 AA 智慧指數</a></li></ul>
            <p class="nav-section-title">各項評測</p>
            <ul class="nav-cats">${categoryNav}</ul>
            <p class="nav-section-title">附錄</p>
            <ul><li><a href="#glossary">📖 名詞解釋</a></li></ul>
          </nav>
        </aside>
        <div class="sidebar-backdrop" id="sidebarBackdrop"></div>

        <main id="top">
          <section class="hero">
            <p class="hero-kicker">給高中生的 AI 評測指南</p>
            <h1>AI 模型是怎麼「考試」的?</h1>
            <p class="hero-lead">
              新聞常說「某某 AI 模型又刷新紀錄」——但那些分數是怎麼來的?這個小百科整理了
              <a href="https://artificialanalysis.ai/evaluations" target="_blank" rel="noopener">Artificial Analysis</a>
              網站上的主要 AI benchmark(基準測試),用高中生也能懂的方式,說明每個測試<strong>考什麼、題庫是什麼、怎麼測、分數代表什麼</strong>。
            </p>
            <div class="hero-stats">
              <div class="stat"><span class="stat-num">${benchmarks.length}</span><span class="stat-label">個 benchmark 條目</span></div>
              <div class="stat"><span class="stat-num">${categories.length}</span><span class="stat-label">大能力分類</span></div>
              <div class="stat"><span class="stat-num">${glossary.length}</span><span class="stat-label">則名詞解釋</span></div>
            </div>
          </section>

          <section class="category-section" id="concepts">
            <div class="category-head">
              <h2>🚀 入門必讀:六個核心觀念</h2>
              <p class="category-intro">看懂任何 benchmark 之前,先弄懂這六件事。讀完你就能自己看懂排行榜了。</p>
            </div>
            ${conceptSections}
          </section>

          <section class="category-section" id="cat-composite">
            <div class="category-head">
              <h2>🏆 綜合指數</h2>
              <p class="category-intro">單一考試只能看單一能力,綜合指數把多個 benchmark 的成績加權平均,像「學測總級分」一樣,提供一個總體的聰明程度指標。</p>
            </div>
            <article class="entry" id="intelligence-index" data-search="Intelligence Index 智慧指數 綜合 加權 總分">
              <header class="entry-header">
                <div class="entry-title-row">
                  <h3><a href="#intelligence-index" class="anchor-link">Artificial Analysis Intelligence Index</a></h3>
                  <div class="badges"><span class="badge badge-index">v4.1.1・綜合指數</span></div>
                </div>
                <p class="entry-zh-name">AA 智慧指數:AI 界的「總級分」</p>
                <p class="entry-oneliner">把 9 個高難度 benchmark 的成績加權平均成一個 0~100 的總分,是目前比較各家模型「綜合智力」最常被引用的指標之一。</p>
              </header>
              <div class="callout callout-analogy"><span class="callout-label">白話比喻</span>就像學測總級分由國英數自社各科加權組成,智慧指數由「代理 34%+程式 24%+科學推理 24%+通用 18%」四大類、共 9 個測試加權組成——而且刻意把「實作能力(Agents)」的權重調到最高。</div>
              <div class="entry-body">
                <section>
                  <h4><span class="h4-icon">🧩</span>組成與權重(v4.1.1)</h4>
                  <div class="table-wrap">
                    <table class="index-table">
                      <thead><tr><th>類別(權重)</th><th>評測</th><th>權重</th><th>內容</th></tr></thead>
                      <tbody>${indexRows}</tbody>
                    </table>
                  </div>
                </section>
                <section>
                  <h4><span class="h4-icon">📊</span>分數怎麼看?</h4>
                  <ul>
                    <li>分數範圍 0~100,越高越聰明;它是<strong>相對比較</strong>用的,不是「及格/不及格」的絕對門檻。</li>
                    <li>整體誤差(95% 信賴區間)控制在約 ±1 分內——兩個模型差不到 1 分,基本上算平手。</li>
                    <li>指數以英文文字題為主;圖片、語音、多語言能力另外用獨立的指數衡量(例如以 Global-MMLU-Lite 為基礎的多語言指數)。</li>
                    <li>版本會演進:當某個成分測試「飽和」(大家都考很高),就會換上更難的測試——所以不同版本(v4.0、v4.1.1)的分數不能直接互比。</li>
                  </ul>
                </section>
              </div>
            </article>
          </section>

          ${categorySections}

          <section class="category-section" id="glossary">
            <div class="category-head">
              <h2>📖 名詞解釋</h2>
              <p class="category-intro">讀 benchmark 文章時常見的術語,一次弄懂。</p>
            </div>
            <dl class="glossary">${glossaryItems}</dl>
          </section>

          <div class="no-results" id="noResults" hidden>
            <p>找不到符合「<span id="noResultsQuery"></span>」的條目。</p>
            <p class="no-results-hint">試試其他關鍵字,例如:GPQA、數學、客服、幻覺、Elo。</p>
          </div>

          <footer class="footer">
            <p>內容整理自 <a href="https://artificialanalysis.ai/evaluations" target="_blank" rel="noopener">Artificial Analysis — AI Model Evaluations</a> 及其公開評測方法論(Intelligence Index v4.1.1,2026 年)。</p>
            <p>本站為教育用途的中文介紹,各 benchmark 的權利屬於原開發團隊;最新分數與排行榜請以原網站為準。</p>
          </footer>
        </main>
      </div>
    </div>
  `;

  setupSearch();
  setupSidebar();
  setupActiveNav();
}

function setupSearch() {
  const input = document.querySelector<HTMLInputElement>('#search')!;
  const count = document.querySelector<HTMLSpanElement>('#searchCount')!;
  const noResults = document.querySelector<HTMLDivElement>('#noResults')!;
  const noResultsQuery = document.querySelector<HTMLSpanElement>('#noResultsQuery')!;
  const searchables = Array.from(document.querySelectorAll<HTMLElement>('[data-search]'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('.category-section'));
  const hero = document.querySelector<HTMLElement>('.hero')!;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      searchables.forEach((el) => (el.hidden = false));
      sections.forEach((s) => (s.hidden = false));
      hero.hidden = false;
      count.textContent = '';
      noResults.hidden = true;
      return;
    }
    let matches = 0;
    searchables.forEach((el) => {
      const haystack = (el.dataset.search + ' ' + el.textContent).toLowerCase();
      const hit = haystack.includes(q);
      el.hidden = !hit;
      if (hit) matches++;
    });
    sections.forEach((s) => {
      const visible = s.querySelectorAll<HTMLElement>('[data-search]:not([hidden])').length;
      s.hidden = visible === 0;
    });
    hero.hidden = true;
    count.textContent = `${matches} 筆`;
    noResultsQuery.textContent = input.value.trim();
    noResults.hidden = matches !== 0;
  });
}

function setupSidebar() {
  const btn = document.querySelector<HTMLButtonElement>('#menuBtn')!;
  const sidebar = document.querySelector<HTMLElement>('#sidebar')!;
  const backdrop = document.querySelector<HTMLElement>('#sidebarBackdrop')!;
  const close = () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  };
  btn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('show');
  });
  backdrop.addEventListener('click', close);
  sidebar.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).tagName === 'A') close();
  });
}

function setupActiveNav() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.sidebar a[href^="#"]'));
  const byId = new Map(links.map((a) => [a.getAttribute('href')!.slice(1), a]));
  const targets = Array.from(document.querySelectorAll<HTMLElement>('.entry[id], .category-section[id]'));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const link = byId.get(entry.target.id);
        if (!link) continue;
        links.forEach((a) => a.classList.remove('active'));
        link.classList.add('active');
      }
    },
    { rootMargin: '-15% 0px -70% 0px' }
  );
  targets.forEach((t) => observer.observe(t));
}

render();
