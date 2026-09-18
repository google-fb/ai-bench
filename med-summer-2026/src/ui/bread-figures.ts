function frame(inner: string): string {
  return `<svg viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg" role="img">
    <rect width="960" height="540" fill="#f6f6f6"/>
    <rect x="24" y="24" width="912" height="492" fill="none" stroke="#111" stroke-width="1.2"/>
    ${inner}
  </svg>`;
}

export const breadFigures: Record<string, string> = {
  jar: frame(`
    <ellipse cx="480" cy="430" rx="70" ry="16" fill="none" stroke="#111"/>
    <rect x="410" y="160" width="140" height="270" rx="8" fill="#fff" stroke="#111"/>
    <rect x="430" y="250" width="100" height="160" fill="#ececec"/>
    <circle cx="460" cy="290" r="6" fill="#111"><animate attributeName="cy" values="310;250;310" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="500" cy="310" r="5" fill="#111"><animate attributeName="cy" values="330;260;330" dur="3.6s" repeatCount="indefinite"/></circle>
    <rect x="430" y="148" width="100" height="16" fill="#111"/>
  `),
  mill: frame(`
    <circle cx="360" cy="270" r="90" fill="none" stroke="#111" stroke-width="2"/>
    <circle cx="360" cy="270" r="18" fill="#111"/>
    <g>
      <rect x="350" y="180" width="20" height="70" fill="#111"/>
      <animateTransform attributeName="transform" type="rotate" from="0 360 270" to="360 360 270" dur="6s" repeatCount="indefinite"/>
    </g>
    <path d="M500 200 h180 v220 h-180 z" fill="none" stroke="#111"/>
    <path d="M520 380 L640 220 L660 380 Z" fill="#ececec" stroke="#111"/>
  `),
  scale: frame(`
    <rect x="280" y="300" width="400" height="80" fill="#fff" stroke="#111"/>
    <rect x="300" y="220" width="360" height="80" fill="#ececec" stroke="#111"/>
    <text x="480" y="270" text-anchor="middle" font-size="42" font-family="ui-sans-serif">500 g</text>
    <circle cx="320" cy="420" r="10" fill="#111"/>
    <circle cx="640" cy="420" r="10" fill="#111"/>
  `),
  bowl: frame(`
    <path d="M240 180 Q480 120 720 180 Q700 400 480 430 Q260 400 240 180" fill="#fff" stroke="#111" stroke-width="2"/>
    <path d="M300 240 Q480 210 660 250" fill="none" stroke="#bbb"/>
    <circle cx="420" cy="280" r="8" fill="#111"/>
    <circle cx="510" cy="300" r="6" fill="#111"/>
  `),
  fold: frame(`
    <path d="M280 160 h400 v280 h-400 z" fill="#fff" stroke="#111"/>
    <path d="M280 160 L480 300 L680 160" fill="none" stroke="#111" stroke-width="2">
      <animate attributeName="d" values="M280 160 L480 180 L680 160;M280 160 L480 300 L680 160;M280 160 L480 180 L680 160" dur="4s" repeatCount="indefinite"/>
    </path>
  `),
  batard: frame(`
    <ellipse cx="480" cy="280" rx="220" ry="90" fill="#fff" stroke="#111" stroke-width="2"/>
    <path d="M300 250 Q480 200 660 260" fill="none" stroke="#111"/>
    <path d="M320 280 L640 280" stroke="#111" stroke-dasharray="8 10"/>
  `),
  fridge: frame(`
    <rect x="330" y="80" width="300" height="380" fill="#fff" stroke="#111" stroke-width="2"/>
    <line x1="330" y1="240" x2="630" y2="240" stroke="#111"/>
    <rect x="360" y="270" width="160" height="70" fill="#ececec" stroke="#111"/>
    <circle cx="590" cy="160" r="8" fill="#111"/>
    <circle cx="590" cy="360" r="8" fill="#111"/>
  `),
  oven: frame(`
    <rect x="220" y="120" width="520" height="320" fill="#fff" stroke="#111" stroke-width="2"/>
    <rect x="260" y="170" width="440" height="200" fill="#111"/>
    <ellipse cx="480" cy="270" rx="90" ry="36" fill="#f6f6f6"/>
    <path d="M390 250 q90 -40 180 0" fill="none" stroke="#111">
      <animate attributeName="d" values="M390 250 q90 -10 180 0;M390 230 q90 -50 180 0;M390 250 q90 -10 180 0" dur="2.4s" repeatCount="indefinite"/>
    </path>
  `),
  lame: frame(`
    <line x1="220" y1="360" x2="740" y2="180" stroke="#111" stroke-width="6"/>
    <rect x="200" y="340" width="90" height="28" fill="#111"/>
    <path d="M700 160 l80 40 -12 18 -80 -40 z" fill="#ececec" stroke="#111"/>
  `),
  tools: frame(`
    <rect x="160" y="160" width="140" height="220" fill="#fff" stroke="#111"/>
    <ellipse cx="400" cy="280" rx="70" ry="90" fill="#fff" stroke="#111"/>
    <rect x="520" y="200" width="120" height="160" fill="#fff" stroke="#111"/>
    <circle cx="760" cy="270" r="70" fill="#fff" stroke="#111"/>
    <text x="230" y="430" text-anchor="middle" font-size="16" font-family="ui-sans-serif">scale</text>
    <text x="400" y="430" text-anchor="middle" font-size="16" font-family="ui-sans-serif">banneton</text>
    <text x="580" y="430" text-anchor="middle" font-size="16" font-family="ui-sans-serif">pot</text>
    <text x="760" y="430" text-anchor="middle" font-size="16" font-family="ui-sans-serif">mixer</text>
  `),
};
