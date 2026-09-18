function svgShell(inner: string): string {
  return `<svg class="svg-lab-art" viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="960" height="540" fill="#0a0a0a"/>
    ${inner}
  </svg>`;
}

export const svgScenes: Record<string, string> = {
  "yeast-lab": svgShell(`
    <text x="40" y="48" fill="#8d8d8d" font-size="13">LESSON</text>
    <g data-hit="yeast" class="hit">
      <circle cx="220" cy="260" r="54" fill="#1a1a1a" stroke="#fff" stroke-width="2"/>
      <circle cx="206" cy="248" r="8" fill="#fff"/>
      <circle cx="232" cy="248" r="8" fill="#fff"/>
      <text x="220" y="340" text-anchor="middle" fill="#fff" font-size="16">酵母</text>
    </g>
    <g data-hit="lab" class="hit">
      <rect x="400" y="220" width="28" height="80" rx="12" fill="#fff"/>
      <rect x="438" y="236" width="22" height="64" rx="10" fill="#cfcfcf"/>
      <text x="430" y="340" text-anchor="middle" fill="#fff" font-size="16">乳酸菌</text>
    </g>
    <g data-hit="gas" class="hit">
      <circle class="anim-bubble" cx="640" cy="300" r="16" fill="none" stroke="#fff" stroke-width="2"/>
      <circle class="anim-bubble d2" cx="680" cy="250" r="10" fill="none" stroke="#fff"/>
      <circle class="anim-bubble d3" cx="700" cy="310" r="8" fill="none" stroke="#fff"/>
      <text x="670" y="380" text-anchor="middle" fill="#fff" font-size="16">CO₂</text>
    </g>
    <g data-hit="acid" class="hit">
      <circle cx="820" cy="250" r="18" fill="#fff"/>
      <path d="M800 320 l20 36 20-36" fill="#888"/>
      <text x="820" y="400" text-anchor="middle" fill="#fff" font-size="16">酸</text>
    </g>
  `),
  "pantry-lab": svgShell(`
    <g data-hit="flour" class="hit">
      <path d="M140 180 h140 l20 180 h-180 z" fill="#222" stroke="#fff"/>
      <text x="210" y="400" text-anchor="middle" fill="#fff">麵粉</text>
    </g>
    <g data-hit="water" class="hit">
      <rect x="340" y="170" width="70" height="190" rx="8" fill="none" stroke="#fff" stroke-width="2"/>
      <rect class="anim-fill" x="348" y="240" width="54" height="110" fill="#444"/>
      <text x="375" y="400" text-anchor="middle" fill="#fff">水</text>
    </g>
    <g data-hit="salt" class="hit">
      <ellipse cx="520" cy="300" rx="50" ry="18" fill="none" stroke="#fff"/>
      <circle cx="508" cy="292" r="4" fill="#fff"/>
      <circle cx="528" cy="296" r="3" fill="#fff"/>
      <text x="520" y="400" text-anchor="middle" fill="#fff">鹽 2%</text>
    </g>
    <g data-hit="starter" class="hit">
      <rect x="640" y="180" width="100" height="170" rx="8" fill="#1a1a1a" stroke="#fff"/>
      <rect x="655" y="250" width="70" height="90" fill="#333"/>
      <circle class="anim-bubble" cx="680" cy="280" r="6" fill="#fff"/>
      <text x="690" y="400" text-anchor="middle" fill="#fff">種</text>
    </g>
  `),
  "feed-lab": svgShell(`
    <rect x="380" y="120" width="160" height="300" rx="10" fill="#161616" stroke="#fff" stroke-width="2"/>
    <line x1="370" y1="200" x2="550" y2="200" stroke="#666" stroke-dasharray="6 6"/>
    <g data-hit="old" class="hit">
      <rect x="400" y="300" width="120" height="100" fill="#2a2a2a"/>
      <text x="460" y="450" text-anchor="middle" fill="#fff">舊種</text>
    </g>
    <g data-hit="flour" class="hit">
      <path d="M140 180 h90 l12 90 h-114 z" fill="#2a2a2a" stroke="#fff"/>
      <text x="185" y="310" text-anchor="middle" fill="#fff">粉</text>
    </g>
    <g data-hit="water" class="hit">
      <rect x="140" y="340" width="80" height="100" fill="none" stroke="#fff"/>
      <text x="180" y="470" text-anchor="middle" fill="#fff">水</text>
    </g>
    <g data-hit="peak" class="hit">
      <rect class="anim-rise" x="400" y="260" width="120" height="40" fill="#fff" opacity="0.2"/>
      <text x="700" y="210" fill="#fff">高峰線</text>
    </g>
  `),
  "hydro-lab": svgShell(`
    <g data-hit="flour" class="hit">
      <rect x="80" y="180" width="160" height="180" fill="#1c1c1c" stroke="#fff"/>
      <text x="160" y="400" text-anchor="middle" fill="#fff">粉 100%</text>
    </g>
    <ellipse class="dough-blob" cx="560" cy="280" rx="90" ry="80" fill="#2a2a2a" stroke="#fff" stroke-width="2"/>
    <g data-hit="h60" class="hit"><rect x="780" y="120" width="120" height="70" fill="#111" stroke="#fff"/><text x="840" y="162" text-anchor="middle" fill="#fff">60%</text></g>
    <g data-hit="h70" class="hit"><rect x="780" y="220" width="120" height="70" fill="#111" stroke="#fff"/><text x="840" y="262" text-anchor="middle" fill="#fff">70%</text></g>
    <g data-hit="h80" class="hit"><rect x="780" y="320" width="120" height="70" fill="#111" stroke="#fff"/><text x="840" y="362" text-anchor="middle" fill="#fff">80%</text></g>
  `),
  "mix-lab": svgShell(`
    <g data-hit="shaggy" class="hit">
      <path d="M180 160 Q360 120 500 170 Q480 360 330 380 Q170 350 180 160" fill="#1a1a1a" stroke="#fff"/>
      <circle cx="280" cy="240" r="7" fill="#666"/>
      <circle cx="340" cy="260" r="9" fill="#555"/>
      <text x="330" y="430" text-anchor="middle" fill="#fff">亂石</text>
    </g>
    <g data-hit="rest" class="hit">
      <circle cx="620" cy="200" r="40" fill="none" stroke="#fff"/>
      <line x1="620" y1="200" x2="620" y2="172" stroke="#fff"/>
      <line x1="620" y1="200" x2="644" y2="200" stroke="#fff"/>
      <text x="620" y="270" text-anchor="middle" fill="#fff">30–60 min</text>
    </g>
    <g data-hit="add" class="hit">
      <rect x="560" y="300" width="50" height="70" fill="#fff"/>
      <circle cx="660" cy="340" r="18" fill="#888"/>
      <text x="620" y="420" text-anchor="middle" fill="#fff">種 + 鹽</text>
    </g>
    <g data-hit="mixer" class="hit">
      <circle cx="820" cy="250" r="60" fill="none" stroke="#fff" stroke-width="2"/>
      <rect class="anim-spin" x="812" y="200" width="16" height="100" fill="#fff"/>
      <text x="820" y="360" text-anchor="middle" fill="#fff">攪拌機</text>
    </g>
  `),
  "fold-lab": svgShell(`
    <rect x="260" y="140" width="360" height="260" fill="#161616" stroke="#444"/>
    <polygon class="dough-sheet" points="300,180 580,180 560,360 320,360" fill="#2a2a2a" stroke="#fff"/>
    <g data-hit="north" class="hit"><rect x="390" y="150" width="100" height="40" fill="transparent" stroke="#fff"/><text x="440" y="176" text-anchor="middle" fill="#fff">上</text></g>
    <g data-hit="east" class="hit"><rect x="560" y="230" width="40" height="100" fill="transparent" stroke="#fff"/><text x="580" y="286" text-anchor="middle" fill="#fff">右</text></g>
    <g data-hit="south" class="hit"><rect x="390" y="350" width="100" height="40" fill="transparent" stroke="#fff"/><text x="440" y="376" text-anchor="middle" fill="#fff">下</text></g>
    <g data-hit="west" class="hit"><rect x="270" y="230" width="40" height="100" fill="transparent" stroke="#fff"/><text x="290" y="286" text-anchor="middle" fill="#fff">左</text></g>
    <g data-hit="temp" class="hit">
      <rect x="760" y="180" width="36" height="160" rx="18" fill="#111" stroke="#fff"/>
      <rect class="anim-rise" x="768" y="250" width="20" height="80" fill="#fff"/>
      <text x="778" y="380" text-anchor="middle" fill="#fff">°C</text>
    </g>
  `),
  "shape-lab": svgShell(`
    <g data-hit="flat" class="hit">
      <ellipse cx="240" cy="260" rx="110" ry="70" fill="#2a2a2a" stroke="#fff"/>
      <text x="240" y="380" text-anchor="middle" fill="#fff">攤</text>
    </g>
    <g data-hit="sides" class="hit">
      <path d="M400 220 h140 v80 h-140 z" fill="#222" stroke="#fff"/>
      <path d="M400 220 L470 260 L400 300" fill="none" stroke="#fff"/>
      <path d="M540 220 L470 260 L540 300" fill="none" stroke="#fff"/>
      <text x="470" y="380" text-anchor="middle" fill="#fff">左右摺</text>
    </g>
    <g data-hit="roll" class="hit">
      <ellipse class="anim-roll" cx="680" cy="250" rx="90" ry="40" fill="#2a2a2a" stroke="#fff" stroke-width="2"/>
      <text x="680" y="330" text-anchor="middle" fill="#fff">捲</text>
    </g>
    <g data-hit="basket" class="hit">
      <ellipse cx="800" cy="400" rx="70" ry="28" fill="none" stroke="#fff"/>
      <path d="M740 400 v-50 h120 v50" fill="none" stroke="#fff"/>
      <text x="800" y="480" text-anchor="middle" fill="#fff">籃</text>
    </g>
  `),
  "proof-lab": svgShell(`
    <g data-hit="basket" class="hit">
      <ellipse cx="220" cy="300" rx="90" ry="36" fill="none" stroke="#fff"/>
      <ellipse cx="220" cy="250" rx="70" ry="40" fill="#2a2a2a" stroke="#fff"/>
      <text x="220" y="380" text-anchor="middle" fill="#fff">籃</text>
    </g>
    <g data-hit="fridge" class="hit">
      <rect x="380" y="140" width="180" height="280" fill="#141414" stroke="#fff" stroke-width="2"/>
      <line x1="380" y1="260" x2="560" y2="260" stroke="#fff"/>
      <text x="470" y="450" text-anchor="middle" fill="#fff">冰箱</text>
    </g>
    <g data-hit="clock" class="hit">
      <circle cx="700" cy="220" r="50" fill="none" stroke="#fff"/>
      <line class="anim-spin" x1="700" y1="220" x2="700" y2="180" stroke="#fff"/>
      <text x="700" y="300" text-anchor="middle" fill="#fff">8–16 h</text>
    </g>
    <g data-hit="poke" class="hit">
      <ellipse cx="780" cy="380" rx="80" ry="36" fill="#2a2a2a" stroke="#fff"/>
      <circle class="anim-poke" cx="780" cy="370" r="10" fill="#fff"/>
      <text x="780" y="450" text-anchor="middle" fill="#fff">指壓</text>
    </g>
  `),
  "bake-lab": svgShell(`
    <g data-hit="score" class="hit">
      <line x1="80" y1="280" x2="220" y2="180" stroke="#fff" stroke-width="5"/>
      <text x="150" y="330" text-anchor="middle" fill="#fff">刀</text>
    </g>
    <g data-hit="lid" class="hit">
      <rect x="300" y="200" width="220" height="140" fill="#1a1a1a" stroke="#fff"/>
      <rect class="pot-lid" x="310" y="150" width="200" height="40" fill="#fff"/>
      <text x="410" y="380" text-anchor="middle" fill="#fff">鍋蓋</text>
    </g>
    <g data-hit="spring" class="hit">
      <ellipse class="anim-spring" cx="650" cy="280" rx="80" ry="28" fill="#2a2a2a" stroke="#fff" stroke-width="2"/>
      <path class="anim-steam" d="M620 200 q10 -30 0 -50" fill="none" stroke="#888"/>
      <path class="anim-steam d2" d="M650 190 q10 -34 0 -56" fill="none" stroke="#888"/>
      <text x="650" y="360" text-anchor="middle" fill="#fff">彈升</text>
    </g>
    <g data-hit="uncover" class="hit">
      <rect x="800" y="200" width="100" height="80" fill="#111" stroke="#fff"/>
      <text x="850" y="320" text-anchor="middle" fill="#fff">揭蓋</text>
    </g>
  `),
  "tools-lab": svgShell(`
    <g data-hit="scale" class="hit"><rect x="60" y="200" width="140" height="80" fill="#1a1a1a" stroke="#fff"/><text x="130" y="320" text-anchor="middle" fill="#fff">秤</text></g>
    <g data-hit="scraper" class="hit"><rect x="240" y="190" width="70" height="100" fill="#fff"/><text x="275" y="320" text-anchor="middle" fill="#fff">刮板</text></g>
    <g data-hit="banneton" class="hit"><ellipse cx="430" cy="250" rx="60" ry="70" fill="none" stroke="#fff" stroke-width="2"/><text x="430" y="360" text-anchor="middle" fill="#fff">籃</text></g>
    <g data-hit="pot" class="hit"><rect x="540" y="180" width="130" height="110" fill="#1a1a1a" stroke="#fff"/><rect x="555" y="150" width="100" height="28" fill="#fff"/><text x="605" y="330" text-anchor="middle" fill="#fff">鍋</text></g>
    <g data-hit="mixer" class="hit"><circle cx="800" cy="230" r="54" fill="none" stroke="#fff" stroke-width="2"/><rect class="anim-spin" x="792" y="186" width="16" height="88" fill="#fff"/><text x="800" y="330" text-anchor="middle" fill="#fff">機器</text></g>
  `),
};
