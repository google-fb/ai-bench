import type { Article, Copy, LabHotspot, LabStep } from "../types";
import { breadFigures } from "../ui/bread-figures";

function img(name: keyof typeof breadFigures, alt: Copy) {
  return { svg: breadFigures[name], alt };
}

function steps(list: Array<[string, Copy, Copy]>): LabStep[] {
  return list.map(([id, title, how]) => ({ id, title, how }));
}

function spots(list: Array<[string, Copy, Copy]>): LabHotspot[] {
  return list.map(([id, label, body]) => ({ id, label, body }));
}

export const breadArticles: Article[] = [
  {
    unit: "bread",
    slug: "wild-yeast",
    rank: 1,
    dateLabel: { zh: "第 01 課", en: "Lesson 01" },
    tag: "starter",
    title: {
      zh: "酸種不是一包酵母，是兩伙微生物合伙做氣",
      en: "Sourdough is not a yeast packet. It’s two crews making gas",
    },
    dek: {
      zh: "罐子裡同時住著野生酵母和乳酸菌。酵母吐二氧化碳把麵團吹起來；乳酸菌做出酸味，也幫忙顧門。",
      en: "A jar holds wild yeast and lactic-acid bacteria. Yeast burps carbon dioxide. Bacteria make the tang and help guard the jar.",
    },
    images: [
      img("jar", { zh: "玻璃罐裡氣泡往上走，像兩伙人在上班。", en: "A jar with rising bubbles — two crews at work." }),
      img("bowl", { zh: "氣泡讓麵團變輕，不是魔法，是發酵。", en: "Bubbles lift dough. That’s fermentation, not magic." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "商業酵母是單一選手短跑；酸種是野生酵母加乳酸菌的接力賽，氣比較慢、味道比較深。",
          en: "Instant yeast is a sprinter. Sourdough is a relay: wild yeast plus bacteria, slower gas, deeper flavor.",
        },
      },
      {
        label: { zh: "罐子裡有誰", en: "Who lives in the jar" },
        body: {
          zh: "麵粉加水，空氣和麥粒上的微生物就會被選出來。常見是酵母屬、Kazachstania 這類酵母，以及乳酸桿菌。酵母吃糖，吐二氧化碳和一點酒精；乳酸菌做出乳酸，有時還有醋酸。酸味、香氣、比較長一點的保存，都從這裡來。",
          en: "Flour plus water selects microbes already on grain and in the air. Yeasts (often Saccharomyces or Kazachstania) eat sugars and exhale carbon dioxide. Lactic-acid bacteria make lactic acid, sometimes acetic acid. That’s the tang, the aroma, and why the loaf keeps a bit longer.",
        },
      },
      {
        label: { zh: "用廚房講", en: "Kitchen picture" },
        body: {
          zh: "把罐子想成一座小城堡：酵母是負責吹氣球的，乳酸菌是負責調味和趕壞菌的。你餵麵粉和水，等於開飯。開飯後氣泡變多、體積變高，就是「種熟了」。",
          en: "Treat the jar as a little castle. Yeast blows the balloons. Bacteria season the place and crowd out spoilage. Feeding flour and water is dinner. When the jar is tall and webby, the starter is ripe.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "第一次失敗通常不是「你沒天分」，是罐子還沒選出穩定的兩伙人，或你在它還沒熟時就拿去揉麵。下面動畫先認酵母和乳酸菌，再往下養種。",
          en: "First failures are usually an unstable jar, or mixing dough before the starter peaked — not a talent issue. The animation names the two crews before you learn to feed them.",
        },
      },
      {
        label: { zh: "常見誤會", en: "Common mix-up" },
        body: {
          zh: "酸種不是「比較健康所以能亂吃」的魔法麵包，也不是無麩質。它只是用野生菌發酵的麵包。發霉、奇怪的顏色、臭水要倒掉重來。",
          en: "Sourdough is not a health spell and it is not gluten-free. It is bread fermented by a wild culture. Mold, odd colors, or a rotten layer means toss it.",
        },
      },
    ],
    sources: [
      { label: "Wikipedia — Sourdough", href: "https://en.wikipedia.org/wiki/Sourdough" },
      { label: "Sourdough Talk — beginner loaf", href: "https://sourdoughtalk.com/beginners-sourdough-bread-recipe/" },
    ],
    lab: {
      kind: "yeast-lab",
      format: "svg",
      title: { zh: "認兩伙人", en: "Meet the two crews" },
      lesson: {
        zh: "酵母吐氣泡；乳酸菌做酸。兩伙都要吃飯，麵團才會又高又香。",
        en: "Yeast makes bubbles. Bacteria make acid. Both need dinner or the loaf stays flat and bland.",
      },
      how: {
        zh: "依序點酵母、乳酸菌、氣泡、酸滴。畫面會動。",
        en: "Tap yeast, bacteria, a bubble, then an acid drop. The drawing moves.",
      },
      hint: { zh: "下一步：點左邊圓圓的酵母。", en: "Next: tap the round yeast on the left." },
      steps: steps([
        ["yeast", { zh: "點酵母", en: "Tap yeast" }, { zh: "點左邊那顆圓。它負責吹氣。", en: "Tap the left circle. It blows gas." }],
        ["lab", { zh: "點乳酸菌", en: "Tap bacteria" }, { zh: "點右邊桿狀菌。它負責酸。", en: "Tap the rod on the right. It makes acid." }],
        ["gas", { zh: "看氣泡", en: "See the gas" }, { zh: "點往上走的泡。那是二氧化碳。", en: "Tap a rising bubble. That’s carbon dioxide." }],
        ["acid", { zh: "看酸滴", en: "See the acid" }, { zh: "點小酸滴。乳酸比較圓、醋酸比較尖。", en: "Tap an acid drop. Lactic is rounder; acetic is sharper." }],
      ]),
      hotspots: spots([
        ["yeast", { zh: "酵母", en: "Yeast" }, { zh: "吃糖，吐二氧化碳，麵團才膨。", en: "Eats sugar, exhales CO₂, dough lifts." }],
        ["lab", { zh: "乳酸菌", en: "LAB" }, { zh: "做乳酸／醋酸，給味道也比較能保存。", en: "Makes lactic/acetic acid — flavor and a bit of keeping quality." }],
        ["gas", { zh: "氣泡", en: "Bubble" }, { zh: "氣體被麵筋網兜住，才變成洞。", en: "Gas caught in gluten becomes the holes." }],
        ["acid", { zh: "酸", en: "Acid" }, { zh: "酸會改麵筋手感，也改風味。", en: "Acid changes gluten feel and taste." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "three-ingredients",
    rank: 2,
    dateLabel: { zh: "第 02 課", en: "Lesson 02" },
    tag: "ingredient",
    title: {
      zh: "材料其實很少：麵粉、水、鹽，再加約兩成你養的種",
      en: "Very few ingredients: flour, water, salt, plus about 20% starter",
    },
    dek: {
      zh: "經典鄉村麵包不加糖、油、奶。蛋白高一點的麵粉比較好拉網；水決定軟硬；鹽約麵粉重的 2%。",
      en: "A classic loaf skips sugar, oil, and milk. Stronger flour builds the net; water sets softness; salt is about 2% of flour weight.",
    },
    images: [
      img("scale", { zh: "電子秤比量杯準。烘焙用克。", en: "A scale beats cups. Bake in grams." }),
      img("mill", { zh: "麥粒磨成粉：胚乳是白、麩皮是褐。", en: "Grain to flour: endosperm is pale, bran is brown." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "秤克，不要用杯子。同一杯粉，壓緊或疏鬆可以差 20%，麵團就會從好摸變成膠水。",
          en: "Weigh grams. A packed cup of flour can swing 20%, and a friendly dough turns to glue.",
        },
      },
      {
        label: { zh: "麵粉在做什麼", en: "What flour does" },
        body: {
          zh: "小麥粉裡的蛋白質遇到水，會形成麵筋網，負責兜氣。高筋／麵包粉大約 11–13% 蛋白，新手比較好上手。全麥帶麩皮，會割網，吃起來香，但要多摺或稍低一點水。台灣中筋也能做，洞會比較密。",
          en: "Wheat proteins plus water make gluten, the net that holds gas. Bread flour around 11–13% protein is beginner-friendly. Whole-grain bran cuts the net — flavorful, but needs more folds or a little less water. Mid-protein flour still works; the crumb is tighter.",
        },
      },
      {
        label: { zh: "水與鹽", en: "Water and salt" },
        body: {
          zh: "水不是「隨便加到看起來對」。它用烘焙百分比算（下一課）。室溫清水即可；超氯的自來水可先放置。鹽約 2%：太少麵團黏、味道淡；太多會拖酵母的油門。",
          en: "Water is not “until it looks right.” It’s baker’s percent (next lesson). Room-temperature tap is fine; let highly chlorinated water sit. Salt near 2%: too little and the dough is slack and bland; too much and yeast slows down.",
        },
      },
      {
        label: { zh: "種也是材料", en: "Starter is an ingredient" },
        body: {
          zh: "100% 水合的種（等重粉與水）最常見。配方寫 20% 種，意思是種重＝粉重的兩成。種本身也帶粉和水，精算的人會把這份算進總水合；新手先記住：種要在高峰、有泡、有酸香。",
          en: "A 100%-hydration starter (equal flour and water) is the usual. “20% starter” means starter weighs a fifth of the flour. That jar also brings extra flour and water; advanced bakers count it. Beginners: use it at peak — bubbly, tangy, tall.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "同一品牌麵粉，季節吸水不同。先鎖一袋粉做三次，再換粉，比較知道是你的手變了，還是粉變了。",
          en: "The same bag drinks differently by season. Bake three times from one bag before you switch, so you know whether you changed or the flour did.",
        },
      },
    ],
    sources: [
      { label: "Sourdough Joe — first loaf formula", href: "https://www.sourdoughjoe.com/blog/first-sourdough-loaf-recipe" },
      { label: "Crosodo — beginner boule by the gram", href: "https://crosodo.com/blog/beginner-sourdough-boule" },
    ],
    lab: {
      kind: "pantry-lab",
      format: "svg",
      title: { zh: "點齊四樣東西", en: "Tap the four things" },
      lesson: {
        zh: "粉負責網，水負責軟，鹽負責味與筋，種負責氣與酸。",
        en: "Flour is the net, water is the softness, salt is taste and tightness, starter is gas and tang.",
      },
      how: { zh: "依序點麵粉、水、鹽、種罐。", en: "Tap flour, water, salt, then the starter jar." },
      hint: { zh: "下一步：點左邊那袋麵粉。", en: "Next: tap the flour sack on the left." },
      steps: steps([
        ["flour", { zh: "麵粉", en: "Flour" }, { zh: "點粉袋。蛋白幫忙結網。", en: "Tap the sack. Protein builds the net." }],
        ["water", { zh: "水", en: "Water" }, { zh: "點水瓶。水讓粉醒來。", en: "Tap the bottle. Water wakes the flour." }],
        ["salt", { zh: "鹽", en: "Salt" }, { zh: "點鹽碟。大約粉重 2%。", en: "Tap the salt dish. About 2% of flour." }],
        ["starter", { zh: "種", en: "Starter" }, { zh: "點罐子。它是活的材料。", en: "Tap the jar. It’s a living ingredient." }],
      ]),
      hotspots: spots([
        ["flour", { zh: "麵粉", en: "Flour" }, { zh: "小麥蛋白 + 水 = 麵筋網。", en: "Wheat protein + water = gluten." }],
        ["water", { zh: "水", en: "Water" }, { zh: "決定麵團軟硬，也讓微生物能游。", en: "Sets dough feel and lets microbes move." }],
        ["salt", { zh: "鹽", en: "Salt" }, { zh: "調味，也讓筋比較有精神。", en: "Seasons and tightens gluten." }],
        ["starter", { zh: "種", en: "Starter" }, { zh: "帶進酵母與乳酸菌。", en: "Brings yeast and bacteria." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "feed-the-jar",
    rank: 3,
    dateLabel: { zh: "第 03 課", en: "Lesson 03" },
    tag: "starter",
    title: {
      zh: "養種：1:1:1 開飯，等到它爬到高峰再揉麵",
      en: "Feeding: 1:1:1 dinner, then wait for peak before you mix",
    },
    dek: {
      zh: "常見餵法是種：粉：水 = 1:1:1 或 1:3:3、1:5:5。比例越大，爬高峰越慢、酸比較溫。高峰時體積高、表面像海綿、一勺能拉出網。",
      en: "Typical feeds are 1:1:1, or 1:3:3 / 1:5:5 starter:flour:water. A bigger ratio climbs slower and tastes milder. At peak it’s tall, spongy, and webby on a spoon.",
    },
    images: [
      img("jar", { zh: "餵完後體積爬高，再回落。高峰最好用。", en: "After a feed it rises, then falls. Use it at the top." }),
      img("scale", { zh: "丟掉一部分再餵，是為了讓微生物吃得完。", en: "Discard then feed so the crew can finish dinner." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "種不是「放著就會永遠熟」。它吃完就餓、餓了就酸、酸過頭就沒力。你要抓的是高峰。",
          en: "A starter is not ripe forever. After dinner it peaks, then starves and turns sharp. You want the peak.",
        },
      },
      {
        label: { zh: "怎麼餵", en: "How to feed" },
        body: {
          zh: "用乾淨罐。留下一份種，加入等重或更多的粉與水，攪到沒有乾粉，鬆蓋，放室溫。1:1:1 就是例如 50 g 舊種 + 50 g 粉 + 50 g 水；1:5:5 是 20 g 舊種 + 100 g 粉 + 100 g 水。夏天 1:3:3 或 1:5:5 比較不容易暴衝；冬天 1:1:1 比較快。丟掉的那份可以做鬆餅，不是垃圾。",
          en: "Use a clean jar. Keep some starter, add equal or larger weights of flour and water, stir out dry lumps, lid loose, room temp. 1:1:1 is e.g. 50 g starter + 50 g flour + 50 g water; 1:5:5 is 20 g starter + 100 g flour + 100 g water. In a hot kitchen 1:3:3 or 1:5:5 keeps it from racing; in the cold 1:1:1 is faster. Discard can become pancakes. It is not trash.",
        },
      },
      {
        label: { zh: "熟了沒", en: "Is it ready" },
        body: {
          zh: "看體積（常用橡筋做記號）、氣泡、氣味（酸奶、蘋果、沒有指甲油味）。浮水測試：一匙種丟進水裡，熟的常會浮——但不浮也可能只是粉太重。新種常要 5–7 天才穩定，前面臭、瀉、分層都常見。",
          en: "Watch volume (a rubber band helps), bubbles, and smell — yogurt or apple, not nail-polish. The float test: a spoonful often floats when ripe, but heavy flour can sink anyway. New jars often need 5–7 days. Stink, hooch, and layers are common early.",
        },
      },
      {
        label: { zh: "冰箱當遙控", en: "The fridge remote" },
        body: {
          zh: "一週烤一次的人，熟了可以進冰箱。用前一天拿出來回溫再餵一次，等高峰。罐口不要旋死，氣體要出得去。",
          en: "If you bake weekly, refrigerate after peak. The day before a mix, warm it up and feed once. Don’t screw the lid airtight — gas needs a door.",
        },
      },
      {
        label: { zh: "安全", en: "Safety" },
        body: {
          zh: "粉紅、綠、黑毛是霉，整罐丟。透明或深色的「餓水」（hooch）可以倒掉再餵。不要用發霉麵粉，也不要密封到爆罐。",
          en: "Pink, green, or black fuzz is mold — bin the jar. Dark hooch can be poured off and fed again. Don’t use moldy flour, and don’t seal a jar so tight it can burst.",
        },
      },
    ],
    sources: [
      { label: "Sourdough Archive — feeding before a mix", href: "https://sourdougharchive.com/sourdough-recipe-for-beginners/" },
      { label: "Sourdough Talk — 1:1:1 levain", href: "https://sourdoughtalk.com/beginners-sourdough-bread-recipe/" },
    ],
    lab: {
      kind: "feed-lab",
      format: "svg",
      title: { zh: "餵一次、看它爬高", en: "Feed once, watch it climb" },
      lesson: {
        zh: "倒掉一部分 → 加粉加水 → 等高峰。高峰再拿去揉麵。",
        en: "Discard some → add flour and water → wait for peak. Mix only at peak.",
      },
      how: { zh: "點舊種、粉、水，再點高峰記號。", en: "Tap old starter, flour, water, then the peak mark." },
      hint: { zh: "下一步：點罐裡那層舊種。", en: "Next: tap the old starter in the jar." },
      steps: steps([
        ["old", { zh: "留下舊種", en: "Keep some" }, { zh: "點罐底。留下種子就好。", en: "Tap the jar base. Keep a seed." }],
        ["flour", { zh: "加粉", en: "Add flour" }, { zh: "點粉勺。", en: "Tap the flour scoop." }],
        ["water", { zh: "加水", en: "Add water" }, { zh: "點水壺。", en: "Tap the jug." }],
        ["peak", { zh: "等高峰", en: "Wait for peak" }, { zh: "點橡筋高峰線，看罐子長高。", en: "Tap the rubber-band line and watch it rise." }],
      ]),
      hotspots: spots([
        ["old", { zh: "舊種", en: "Seed" }, { zh: "留下 20–50 g 就能帶菌。", en: "Keep 20–50 g. That’s enough culture." }],
        ["flour", { zh: "粉", en: "Flour" }, { zh: "開飯。", en: "Dinner." }],
        ["water", { zh: "水", en: "Water" }, { zh: "讓菌游得動。", en: "Lets the crew swim." }],
        ["peak", { zh: "高峰", en: "Peak" }, { zh: "最高、氣泡最多的時候。", en: "Tallest, most bubbles." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "bakers-math",
    rank: 4,
    dateLabel: { zh: "第 04 課", en: "Lesson 04" },
    tag: "ingredient",
    title: {
      zh: "烘焙百分比：粉永遠是 100%，水合決定好不好摸",
      en: "Baker’s percent: flour is always 100%. Hydration is how it feels",
    },
    dek: {
      zh: "水合 = 水重 ÷ 粉重。新手常從 68–75% 開始。再低像臉頰，再高像鼻涕，洞比較開但很難整型。",
      en: "Hydration is water weight ÷ flour weight. Beginners often start at 68–75%. Lower feels like a cheek; higher feels like snot — opener crumb, harder to shape.",
    },
    images: [
      img("scale", { zh: "500 g 粉、340 g 水，就是 68% 水合。", en: "500 g flour and 340 g water is 68% hydration." }),
      img("bowl", { zh: "同一團粉，水越多越攤、越黏。", en: "Same flour: more water, more spread and stick." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "先鎖粉重，其他都用它當分母。這樣換配方只是改百分比，不是猜。",
          en: "Lock flour weight first. Everything else is a percent of that, so a new formula is math, not vibes.",
        },
      },
      {
        label: { zh: "一顆新手球", en: "A beginner ballpark" },
        body: {
          zh: "常見家用：粉 500 g（100%）、水 340 g（68%）、鹽 10 g（2%）、種 100 g（20%）。這 68% 只算碗裡加的水；100 g 的 100% 種還帶約 50 g 水。總麵團大約 950 g，剛好進 5 夸脫鑄鐵鍋。水合可先 68%，熟了再爬到 72–75%。",
          en: "A common home loaf: 500 g flour (100%), 340 g water (68%), 10 g salt (2%), 100 g starter (20%). That 68% is bowl water only; 100 g of a 100% starter still brings ~50 g water. About 950 g dough — a 5-quart Dutch oven’s friend. Stay near 68% until shaping feels easy, then climb toward 72–75%.",
        },
      },
      {
        label: { zh: "用廚房講", en: "Kitchen picture" },
        body: {
          zh: "水合低，麵團像耳垂，好捏、洞較密。水合高，像濕髮，洞大，但整型會逃。全麥更渴，同樣百分比摸起來比較乾，有人會多加 3–5% 水。",
          en: "Low hydration feels like an earlobe — easy, tighter crumb. High hydration feels like wet hair — bigger holes, runaway shaping. Whole-grain is thirstier; the same percent feels drier, so some bakers add 3–5% more water.",
        },
      },
      {
        label: { zh: "種也佔水", en: "Starter brings water too" },
        body: {
          zh: "100 g 的 100% 種裡大約 50 g 粉、50 g 水。精算總水合要把這 50 g 水加進去。新手可先忽略，等手感穩了再算。",
          en: "100 g of a 100%-hydration starter is about 50 g flour and 50 g water. True dough hydration adds that water. Ignore it until your hands are calm, then count it.",
        },
      },
      {
        label: { zh: "常見誤會", en: "Common mix-up" },
        body: {
          zh: "「高水合比較高級」是社群濾鏡。先做得出形狀，再加水。秤比任何網紅配方重要。",
          en: "“Higher hydration is fancier” is a feed filter. Shape first, then add water. A scale beats any influencer formula.",
        },
      },
    ],
    sources: [
      { label: "Sourdough Talk — 68% beginner formula", href: "https://sourdoughtalk.com/beginners-sourdough-bread-recipe/" },
      { label: "proofit — 75% beginner loaf", href: "https://proofit-app.com/en/blog/sourdough-bread-for-beginners" },
    ],
    lab: {
      kind: "hydro-lab",
      format: "svg",
      title: { zh: "搬水，看麵團變軟", en: "Move water, watch dough slacken" },
      lesson: {
        zh: "水合是水除以粉。點 60%、70%、80%，看同一團粉變臉。",
        en: "Hydration is water over flour. Tap 60%, 70%, 80% and watch one dough change faces.",
      },
      how: { zh: "先點粉袋，再點三個水合按鈕。", en: "Tap the flour, then the three hydration buttons." },
      hint: { zh: "下一步：點 100% 的粉。", en: "Next: tap the 100% flour." },
      steps: steps([
        ["flour", { zh: "粉 = 100%", en: "Flour = 100%" }, { zh: "點粉。它是分母。", en: "Tap flour. It’s the denominator." }],
        ["h60", { zh: "60% 水", en: "60% water" }, { zh: "點 60。麵團偏硬。", en: "Tap 60. The dough stays stiff." }],
        ["h70", { zh: "70% 水", en: "70% water" }, { zh: "點 70。落在 68–75% 新手區間。", en: "Tap 70. Inside the 68–75% beginner range." }],
        ["h80", { zh: "80% 水", en: "80% water" }, { zh: "點 80。很黏，先別追。", en: "Tap 80. Very sticky. Don’t chase it yet." }],
      ]),
      hotspots: spots([
        ["flour", { zh: "粉", en: "Flour" }, { zh: "永遠當 100%。", en: "Always 100%." }],
        ["h60", { zh: "60%", en: "60%" }, { zh: "好捏，洞密。", en: "Easy hands, tight crumb." }],
        ["h70", { zh: "70%", en: "70%" }, { zh: "多數家用起點。", en: "A common home start." }],
        ["h80", { zh: "80%", en: "80%" }, { zh: "洞大，整型難。", en: "Open crumb, hard shaping." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "autolyse-mix",
    rank: 5,
    dateLabel: { zh: "第 05 課", en: "Lesson 05" },
    tag: "method",
    title: {
      zh: "先讓粉喝水，再把種和鹽揉進去",
      en: "Let flour drink first, then mix in starter and salt",
    },
    dek: {
      zh: "粉加水靜置 30–60 分鐘叫 autolyse。麵筋自己開始排整齊，之後比較好揉。家用可以手揉；攪拌機只是省力。",
      en: "Flour plus water, 30–60 minutes, is autolyse. Gluten starts lining up by itself. Hands are enough; a mixer only saves wrists.",
    },
    images: [
      img("bowl", { zh: "剛拌好像亂石，靜置後變滑。", en: "A shaggy mess turns smooth after a rest." }),
      img("tools", { zh: "家用攪拌機是行星式；麵包店常用螺旋缸。", en: "Home mixers are planetary; bakeries often use spiral bowls." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "不要一開始就猛揉。先讓水進粉，再加種與鹽，用手捏合就夠。",
          en: "Don’t knead like a fight. Water the flour first, then pinch in starter and salt.",
        },
      },
      {
        label: { zh: "工法", en: "The method" },
        body: {
          zh: "大碗裡把粉和大部分水拌到沒有乾粉，蓋著放 30–60 分鐘。再把熟種鋪上去，鹽用剩下的水化開倒入，手指捏、摺，3–5 分鐘到看不見種塊。黏是正常的，沾濕手，不要狂撒粉。",
          en: "In a big bowl, mix flour and most of the water until no dry dust remains. Cover 30–60 minutes. Add ripe starter, dissolve salt in the leftover water, then pinch and fold 3–5 minutes until the streaks vanish. Sticky is normal. Wet your hand instead of dumping extra flour.",
        },
      },
      {
        label: { zh: "手套膜", en: "Windowpane" },
        body: {
          zh: "酸種不一定要當下拉出透明膜。摺疊會在發酵裡繼續建網。如果你硬拉到膜，常常也把氣泡和溫度都弄過頭。",
          en: "Sourdough does not need an instant windowpane. Folds keep building the net during bulk. If you chase a pane now, you often knock out gas and overheat the dough.",
        },
      },
      {
        label: { zh: "機器", en: "Machines" },
        body: {
          zh: "家用 KitchenAid 那類行星攪拌機：鉤子、低速、短時間，免得割筋、升溫。麵包店螺旋攪拌機讓麵團自己翻，比較溫柔。新手沒機器也能做；刮板比機器重要。",
          en: "A home planetary mixer (KitchenAid-style): dough hook, low speed, short bursts, or you tear gluten and heat the dough. Bakery spiral mixers tumble the dough more gently. You can skip machines. A scraper matters more.",
        },
      },
      {
        label: { zh: "常見誤會", en: "Common mix-up" },
        body: {
          zh: "鹽不是敵人，只是晚一點加比較好化開。有人 autolyse 時就加種，也可以，只是發酵計時要從加種算起。",
          en: "Salt is not the enemy — it just mixes cleaner a bit later. Some bakers add starter during autolyse; that’s fine, but bulk time starts when the starter goes in.",
        },
      },
    ],
    sources: [
      { label: "Sourdough Joe — autolyse then salt", href: "https://www.sourdoughjoe.com/blog/first-sourdough-loaf-recipe" },
      { label: "proofit — reserved water for salt", href: "https://proofit-app.com/en/blog/sourdough-bread-for-beginners" },
    ],
    lab: {
      kind: "mix-lab",
      format: "svg",
      title: { zh: "喝水，再合伙", en: "Drink, then join forces" },
      lesson: {
        zh: "粉先喝水。種和鹽後進。機器可有可無。",
        en: "Flour drinks first. Starter and salt join later. A mixer is optional.",
      },
      how: { zh: "點粉水混合、靜置、加種鹽、最後點攪拌機比較。", en: "Tap the shaggy mix, the rest, starter+salt, then the mixer." },
      hint: { zh: "下一步：點碗裡的亂石麵團。", en: "Next: tap the shaggy dough in the bowl." },
      steps: steps([
        ["shaggy", { zh: "拌到沒乾粉", en: "No dry flour" }, { zh: "點碗。只要拌勻。", en: "Tap the bowl. Just combine." }],
        ["rest", { zh: "靜置", en: "Rest" }, { zh: "點時鐘。等 30–60 分。", en: "Tap the clock. Wait 30–60 min." }],
        ["add", { zh: "加種與鹽", en: "Add starter + salt" }, { zh: "點種和鹽，看它們被捏進去。", en: "Tap starter and salt and watch them mix in." }],
        ["mixer", { zh: "機器只是手臂", en: "A mixer is an arm" }, { zh: "點攪拌機。低速、短時間。", en: "Tap the mixer. Low and short." }],
      ]),
      hotspots: spots([
        ["shaggy", { zh: "亂石", en: "Shaggy" }, { zh: "看起來醜是對的。", en: "Ugly is correct." }],
        ["rest", { zh: "靜置", en: "Autolyse" }, { zh: "水自己去找蛋白。", en: "Water finds protein on its own." }],
        ["add", { zh: "種與鹽", en: "Starter + salt" }, { zh: "現在才開始真正發酵。", en: "True fermentation starts now." }],
        ["mixer", { zh: "攪拌機", en: "Mixer" }, { zh: "省力，不是必備。", en: "Saves effort, not required." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "bulk-folds",
    rank: 6,
    dateLabel: { zh: "第 06 課", en: "Lesson 06" },
    tag: "method",
    title: {
      zh: "主發酵像養小孩：溫度是油門，摺疊是把氣摺整齊",
      en: "Bulk is childcare: temperature is the throttle, folds tidy the gas",
    },
    dek: {
      zh: "加種之後到分割之前叫主發酵。室溫 22–24°C 常要 4–7 小時。前兩小時每 30 分鐘做一組拉伸摺疊，看到大約 50–75% 膨脹、會晃、有泡就停，不要死盯時鐘。",
      en: "Bulk is the time from starter-in to dividing. At 22–24°C it often takes 4–7 hours. Do stretch-and-folds every 30 minutes for the first two hours. Stop at about 50–75% rise, a jiggle, and bubbles — not at a round number on the clock.",
    },
    images: [
      img("fold", { zh: "拉開一邊，摺到中間，轉碗再做，一組四次。", en: "Stretch one side, fold to center, turn the bowl, four times." }),
      img("bowl", { zh: "結束時麵團會晃，邊緣有泡。", en: "At the end it jiggles and shows edge bubbles." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "時間是參考，麵團才是答案。太冷就拉長；太熱就縮短或減少種。",
          en: "Time is a hint. The dough is the answer. Colder rooms need longer; hotter rooms need less time or less starter.",
        },
      },
      {
        label: { zh: "摺疊怎麼做", en: "How to fold" },
        body: {
          zh: "濕手伸進碗邊，拉起一面，蓋到對面，轉 90 度再做，四面都做完叫一組。它在建網，也把溫度拌均。做完讓它躺著，不要每十分鐘翻一次。",
          en: "Wet a hand, lift one side, fold it over, turn 90°, repeat four sides. That’s one set. You are building the net and even the heat. Then leave it alone — not a fold every ten minutes.",
        },
      },
      {
        label: { zh: "熟了的樣子", en: "What “done” looks like" },
        body: {
          zh: "體積大約一半到四分之三的成長（不是一定要加倍）、表面圓、搖碗會波動、拉開有絲。沒到就繼續等；過了會塌、烤出來扁、酸尖。",
          en: "About 50–75% volume gain (not always a double), a domed top, a jiggle, and strands when you pull. Short bulk stays dense. Long bulk collapses, bakes flat, and tastes harsh.",
        },
      },
      {
        label: { zh: "溫度", en: "Temperature" },
        body: {
          zh: "麵團溫度大概 24–27°C 很好做事。夏天用冰水；冬天把碗放進關著的烤箱加一杯熱水當簡易發酵箱。專業店有發酵箱／冷藏醒發櫃，家用臉盆也能裝。",
          en: "Dough around 24–27°C is friendly. Use colder water in summer. In winter, a closed oven with a mug of hot water is a cheap proofer. Shops use cabinets; a home tub still works.",
        },
      },
      {
        label: { zh: "常見誤會", en: "Common mix-up" },
        body: {
          zh: "「沒加倍所以失敗」害很多人發過。酸種常在不到一倍時就該整形。",
          en: "“It didn’t double, so I failed” pushes people into overproofing. Many sourdough bulks want shaping before a full double.",
        },
      },
    ],
    sources: [
      { label: "Sourdough Joe — 50–75% bulk", href: "https://www.sourdoughjoe.com/blog/first-sourdough-loaf-recipe" },
      { label: "Crosodo — folds every 30 minutes", href: "https://crosodo.com/blog/beginner-sourdough-boule" },
    ],
    lab: {
      kind: "fold-lab",
      format: "svg",
      title: { zh: "拉起、蓋上、轉碗", en: "Stretch, cover, turn" },
      lesson: {
        zh: "摺疊建網。溫度決定快慢。看膨脹，不看死時鐘。",
        en: "Folds build the net. Heat sets the speed. Watch the rise, not only the clock.",
      },
      how: { zh: "點麵團四邊完成一組摺，再點溫度計。", en: "Tap all four sides for one set, then the thermometer." },
      hint: { zh: "下一步：點麵團上邊，把它拉起來。", en: "Next: tap the top edge and stretch it." },
      steps: steps([
        ["north", { zh: "上摺", en: "Top fold" }, { zh: "點上邊。", en: "Tap the top." }],
        ["east", { zh: "右摺", en: "Right fold" }, { zh: "點右邊。", en: "Tap the right." }],
        ["south", { zh: "下摺", en: "Bottom fold" }, { zh: "點下邊。", en: "Tap the bottom." }],
        ["west", { zh: "左摺", en: "Left fold" }, { zh: "點左邊。", en: "Tap the left." }],
        ["temp", { zh: "看溫度", en: "Check heat" }, { zh: "點溫度計。太熱就快，太冷就慢。", en: "Tap the thermometer. Hot is fast; cold is slow." }],
      ]),
      hotspots: spots([
        ["north", { zh: "上摺", en: "Top fold" }, { zh: "上邊拉起，蓋到中間。把氣留在裡面。", en: "Lift the top over the middle. Keeps gas in." }],
        ["east", { zh: "右摺", en: "Right fold" }, { zh: "右邊拉起，蓋到中間。", en: "Lift the right side over the middle." }],
        ["south", { zh: "下摺", en: "Bottom fold" }, { zh: "下邊拉起，蓋到中間。", en: "Lift the bottom over the middle." }],
        ["west", { zh: "左摺", en: "Left fold" }, { zh: "左邊拉起，蓋到中間。四面做完才叫一組。", en: "Lift the left side over. Four sides make one set." }],
        ["temp", { zh: "溫度", en: "Heat" }, { zh: "油門。太熱就快，太冷就慢。", en: "The throttle. Hot is fast; cold is slow." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "shape-skin",
    rank: 7,
    dateLabel: { zh: "第 07 課", en: "Lesson 07" },
    tag: "method",
    title: {
      zh: "整型是在做一件緊外套，不是把氣擠光",
      en: "Shaping is a tight coat, not a gas eviction",
    },
    dek: {
      zh: "預整型、休息、再終整型。圓形叫 boule，橢圓叫 batard。目標是表面張力：外皮緊、裡面還有氣。",
      en: "Preshape, rest, final shape. A boule is round; a batard is oval. You want surface tension: a tight skin, gas still inside.",
    },
    images: [
      img("batard", { zh: "橢圓麵包：先折再捲，接縫在下。", en: "A batard: fold, roll, seam down." }),
      img("tools", { zh: "刮板幫忙推，不要用掌心猛壓。", en: "A scraper pushes. Palms should not flatten it." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "整型失敗的麵包進烤箱會攤成餅。張力不夠，不是你少祈禱。",
          en: "A slack shape pancakes in the oven. That’s missing tension, not missing luck.",
        },
      },
      {
        label: { zh: "工法", en: "The method" },
        body: {
          zh: "把發酵好的麵團倒在薄粉檯上，輕輕收成圓，休息 20 分鐘。再翻開，左右摺、再捲成橢圓，或繼續收成圓。接縫朝下，放進撒米粉（或墊乾布）的發酵籃。刮板沿桌面推，讓外皮繃。",
          en: "Tip the dough onto a lightly floured bench, gather a loose round, rest 20 minutes. Flip, fold the sides, roll an oval — or tighten a round. Seam down into a rice-flour-dusted or cloth-lined banneton. A scraper drives along the bench so the skin tautens.",
        },
      },
      {
        label: { zh: "手感", en: "Feel" },
        body: {
          zh: "外皮要像充氣剛剛好的氣球，不要搓破。破了氣就跑，烤出來裂口亂。粉少一點比較有摩擦力；粉太多會打滑、收不緊。",
          en: "The skin should feel like a balloon that’s just full — don’t sand it open. A tear dumps gas and the bake splits where it wants. A little flour gives grip; too much and it skates, so you never tighten.",
        },
      },
      {
        label: { zh: "發酵籃", en: "Banneton" },
        body: {
          zh: "藤籃會印螺旋紋，也幫忙吸一點水、定型。沒有籃，可以用碗加布。布要乾、要有粉，不然會黏死。",
          en: "A cane banneton prints rings, wicks a little moisture, and holds shape. A bowl plus a towel works. The cloth must be dry and dusted or the dough welds on.",
        },
      },
      {
        label: { zh: "常見誤會", en: "Common mix-up" },
        body: {
          zh: "整型不是揉第二次。主發酵已經建網，你只是收形。",
          en: "Shaping is not a second knead. Bulk already built the net. You are only dressing it.",
        },
      },
    ],
    sources: [
      { label: "Crosodo — beginner boule handling", href: "https://crosodo.com/blog/beginner-sourdough-boule" },
      { label: "The Ferment Guide — bannetons", href: "https://thefermentguide.com/best/sourdough-tools" },
    ],
    lab: {
      kind: "shape-lab",
      format: "svg",
      title: { zh: "收一層皮", en: "Pull a skin" },
      lesson: {
        zh: "預整型 → 休息 → 終整型。外套緊，氣還在裡面。",
        en: "Preshape → rest → final shape. Tight coat, gas still inside.",
      },
      how: { zh: "點攤平、左右摺、捲、再點發酵籃。", en: "Tap flatten, side folds, the roll, then the basket." },
      hint: { zh: "下一步：點檯上那團，先輕輕攤開。", en: "Next: tap the blob and ease it open." },
      steps: steps([
        ["flat", { zh: "輕輕攤", en: "Ease flat" }, { zh: "點麵團。不要壓死。", en: "Tap the dough. Don’t crush it." }],
        ["sides", { zh: "左右摺", en: "Fold sides" }, { zh: "點兩側。", en: "Tap both sides." }],
        ["roll", { zh: "捲起來", en: "Roll" }, { zh: "點前端，看它捲成橢圓。", en: "Tap the front and watch it roll." }],
        ["basket", { zh: "進籃", en: "Into the basket" }, { zh: "點發酵籃，接縫朝下。", en: "Tap the banneton, seam down." }],
      ]),
      hotspots: spots([
        ["flat", { zh: "攤", en: "Open" }, { zh: "保留氣泡。", en: "Keep the bubbles." }],
        ["sides", { zh: "摺", en: "Folds" }, { zh: "做出長軸。", en: "Makes a long axis." }],
        ["roll", { zh: "捲", en: "Roll" }, { zh: "表面開始繃。", en: "The skin tightens." }],
        ["basket", { zh: "籃", en: "Basket" }, { zh: "定型、吸一點水。", en: "Holds shape, wicks a little water." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "cold-proof",
    rank: 8,
    dateLabel: { zh: "第 08 課", en: "Lesson 08" },
    tag: "method",
    title: {
      zh: "最後發酵可以進冰箱：慢，才好割、也好安排睡覺",
      en: "Final proof can go in the fridge: slow, easy to score, easy to sleep",
    },
    dek: {
      zh: "終發酵是整型之後、進爐之前。家用很愛冷藏 8–16 小時。冷麵團比較硬，割紋乾淨，也把酸味拉長。",
      en: "Final proof is after shaping, before the oven. Home bakers often cold-proof 8–16 hours. Cold dough is firmer, scores cleaner, and the tang stretches out.",
    },
    images: [
      img("fridge", { zh: "發酵籃連布進冰箱，袋子鬆套防乾。", en: "Basket plus cloth in the fridge, bag loose so it doesn’t dry." }),
      img("batard", { zh: "指壓回彈慢，就是差不多。", en: "A slow poke-spring means you’re close." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "冰箱不是暫停鍵，是慢速播放。還是會發酵，只是比較有禮。",
          en: "The fridge is not pause. It’s slow-motion. Fermentation continues, politely.",
        },
      },
      {
        label: { zh: "怎麼做", en: "How" },
        body: {
          zh: "整型進籃後，可以室溫再走 20–40 分鐘，再連籃進冷藏。蓋袋或盒，避免結皮。隔天直接從冰箱拿出來割、下鍋，通常不用回溫到軟掉。",
          en: "After shaping, you may give 20–40 minutes at room temp, then refrigerate the basket. Bag or box it so a skin doesn’t form. Next day, score and load from cold — you rarely need a full warm-up.",
        },
      },
      {
        label: { zh: "指壓", en: "The poke" },
        body: {
          zh: "輕輕按：立刻彈回偏生；坑留下不動偏過；慢慢回一點剛好。冷麵團回彈會比較慢，要輕一點判斷。",
          en: "Poke gently: instant spring-back is underdone; a dent that stays is over; a slow partial spring is close. Cold dough answers slowly, so poke lighter.",
        },
      },
      {
        label: { zh: "機器：醒發櫃", en: "Machines: proofers" },
        body: {
          zh: "店家用定溫定濕的發酵箱，或冷藏醒發櫃排行程。家用就是冰箱加個袋子。不要用暖氣直吹，外皮會乾、裡面還生。",
          en: "Shops use humidity-controlled cabinets or retarder-proofers. At home, a fridge plus a bag is the machine. Don’t aim a heater at the loaf — the skin dries while the core stays raw.",
        },
      },
      {
        label: { zh: "常見誤會", en: "Common mix-up" },
        body: {
          zh: "冷藏不能拯救已經發過的主發酵。籃子進冰箱前，主發酵就該幾乎做對。",
          en: "The fridge cannot rescue an overdone bulk. Get bulk almost right before the basket goes in.",
        },
      },
    ],
    sources: [
      { label: "Sourdough Talk — 14-hour cold proof", href: "https://sourdoughtalk.com/beginners-sourdough-bread-recipe/" },
      { label: "FLEX — cold dough scores cleanly", href: "https://flexsourdough.com/sourdough-bread-recipe/how-to-bake-sourdough-bread/" },
    ],
    lab: {
      kind: "proof-lab",
      format: "svg",
      title: { zh: "把時間放進冰箱", en: "Put time in the fridge" },
      lesson: {
        zh: "終發酵可冷可熱。冷的好割、好睡。指壓看回彈。",
        en: "Final proof can be warm or cold. Cold scores and sleeps better. Poke for spring.",
      },
      how: { zh: "點進籃、進冰箱、時鐘、再做指壓。", en: "Tap basket, fridge, clock, then the poke." },
      hint: { zh: "下一步：點發酵籃。", en: "Next: tap the banneton." },
      steps: steps([
        ["basket", { zh: "進籃", en: "In the basket" }, { zh: "點籃。", en: "Tap the basket." }],
        ["fridge", { zh: "進冰箱", en: "Into the fridge" }, { zh: "點冰箱門。", en: "Tap the fridge door." }],
        ["clock", { zh: "過夜", en: "Overnight" }, { zh: "點時鐘。8–16 小時常見。", en: "Tap the clock. 8–16 hours is common." }],
        ["poke", { zh: "指壓", en: "Poke test" }, { zh: "點麵團，看坑慢慢回。", en: "Tap the dough and watch a slow spring." }],
      ]),
      hotspots: spots([
        ["basket", { zh: "籃", en: "Basket" }, { zh: "定型。", en: "Holds the coat." }],
        ["fridge", { zh: "冰箱", en: "Fridge" }, { zh: "慢速遙控。", en: "Slow remote." }],
        ["clock", { zh: "時間", en: "Time" }, { zh: "還在發酵。", en: "Still fermenting." }],
        ["poke", { zh: "指壓", en: "Poke" }, { zh: "問麵團，不要只問鬧鐘。", en: "Ask the dough, not only the alarm." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "score-steam",
    rank: 9,
    dateLabel: { zh: "第 09 課", en: "Lesson 09" },
    tag: "bake",
    title: {
      zh: "割一刀，蓋上鍋：蒸氣讓麵包有機會長高",
      en: "One cut, lid on: steam gives the loaf a chance to grow",
    },
    dek: {
      zh: "專業烤爐會噴蒸氣。家用鑄鐵鍋把麵團自己的水關住。先蓋著烤約 20 分鐘長高，再揭蓋上色。割紋是預先裂開的路。",
      en: "Deck ovens inject steam. At home a Dutch oven traps the loaf’s own moisture. Covered heat ~20 minutes for spring, then lid off for color. The score is a planned crack.",
    },
    images: [
      img("lame", { zh: "麵包刀（lame）斜切，深度大約半公分。", en: "A lame cuts at an angle, about half a centimeter deep." }),
      img("oven", { zh: "鍋蓋關著時外皮還軟，才能 oven spring。", en: "Under a lid the skin stays soft — that’s oven spring." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "不割，它會自己找弱點爆開。不蒸，外皮太早硬，長不高。",
          en: "If you don’t score, it bursts where it wants. If you don’t steam, the skin sets early and the loaf stays short.",
        },
      },
      {
        label: { zh: "工法", en: "The method" },
        body: {
          zh: "鑄鐵鍋或 combo cooker 先在烤箱裡預熱到約 230°C，常要 30–45 分鐘。麵團倒出、割一刀（30–45 度、乾淨、不要來回鋸）、入鍋、立刻蓋蓋。約 20 分鐘後揭蓋再 20–25 分鐘。內部大約 96–99°C 就熟。揭蓋時鍋口會噴熱蒸氣，手和臉離遠，用隔熱手套。",
          en: "Preheat a Dutch oven or combo cooker near 230°C, often 30–45 minutes. Tip out the dough, one confident score (30–45°, no sawing), load, lid on at once. About 20 minutes covered, 20–25 uncovered. The crumb is usually done around 96–99°C inside. Steam rushes out when you uncover — keep face and hands back, use oven mitts.",
        },
      },
      {
        label: { zh: "沒有鑄鐵鍋", en: "No Dutch oven" },
        body: {
          zh: "用烤石或厚烤盤，底下再放鐵盤，進爐時倒開水或冰塊做蒸氣。比較不穩，但做得到。倒熱水時蒸汽會爆衝，站側邊。不要對熱玻璃門噴水。",
          en: "Use a stone or thick tray, plus a preheated metal pan. Pour boiling water or ice for steam as you load. Fiddlier, still real. Stand to the side — the burst can scald. Don’t spray a hot glass door.",
        },
      },
      {
        label: { zh: "店裡的爐", en: "Shop ovens" },
        body: {
          zh: "石板爐（deck oven）從底板傳熱，並在前段噴蒸氣。旋轉爐、風爐比較容易吹乾外皮，要另外補濕。家用一般烤箱不是壞工具，差在蒸氣要自己想辦法。",
          en: "Deck ovens heat from the stone and inject steam up front. Rack or convection ovens dry the skin faster unless you add moisture. A home oven is fine — you just have to invent the steam.",
        },
      },
      {
        label: { zh: "常見誤會", en: "Common mix-up" },
        body: {
          zh: "割很多花紋很好看，但第一顆先學一條直線。刀鈍會拖麵、癟氣。刀片用幾次就要換。",
          en: "Fancy scores look nice. Learn one straight cut first. A dull blade drags and deflates. Swap razors often.",
        },
      },
    ],
    sources: [
      { label: "FLEX — Dutch oven steam then brown", href: "https://flexsourdough.com/sourdough-bread-recipe/how-to-bake-sourdough-bread/" },
      { label: "Foodgeek — why the pot is steam", href: "https://foodgeek.io/en/dutch-oven-sourdough/" },
    ],
    lab: {
      kind: "bake-lab",
      format: "svg",
      title: { zh: "割、關蓋、長高、揭蓋", en: "Score, lid, spring, uncover" },
      lesson: {
        zh: "割是預留裂口。蒸氣讓皮軟。揭蓋才上色。",
        en: "The score is a planned seam. Steam keeps the skin soft. Color comes after the lid.",
      },
      how: { zh: "點刀、點鍋蓋、看彈升、再點揭蓋。", en: "Tap the lame, the lid, the spring, then uncover." },
      hint: { zh: "下一步：點麵包刀，割一條。", en: "Next: tap the lame and cut once." },
      steps: steps([
        ["score", { zh: "割紋", en: "Score" }, { zh: "點刀。一條就好。", en: "Tap the blade. One line." }],
        ["lid", { zh: "蓋上", en: "Lid on" }, { zh: "點鍋蓋，把蒸氣關住。", en: "Tap the lid and trap steam." }],
        ["spring", { zh: "烤箱彈升", en: "Oven spring" }, { zh: "點麵包，看它長高。", en: "Tap the loaf and watch it rise." }],
        ["uncover", { zh: "揭蓋上色", en: "Uncover" }, { zh: "點右邊「揭蓋」，不要再點鍋蓋。", en: "Tap Uncover on the right — not the lid again." }],
      ]),
      hotspots: spots([
        ["score", { zh: "割", en: "Score" }, { zh: "你選的裂口。", en: "The crack you chose." }],
        ["lid", { zh: "蓋", en: "Lid" }, { zh: "家用蒸氣室。", en: "A home steam chamber." }],
        ["spring", { zh: "彈升", en: "Spring" }, { zh: "氣體遇熱膨脹。", en: "Gas expands in the heat." }],
        ["uncover", { zh: "揭蓋", en: "Uncover" }, { zh: "乾熱把糖烤上色。", en: "Dry heat browns the sugars." }],
      ]),
    },
  },
  {
    unit: "bread",
    slug: "bench-machines",
    rank: 10,
    dateLabel: { zh: "第 10 課", en: "Lesson 10" },
    tag: "tools",
    title: {
      zh: "器材分兩層：五件就能烤，機器是後來才加的手",
      en: "Tools in two layers: five get you baking, machines are extra hands",
    },
    dek: {
      zh: "必備：電子秤、刮板、發酵籃（或碗+布）、鋒利刀片、厚鍋。後來才輪到磨粉機、攪拌機、發酵箱、石板爐。",
      en: "Need: scale, scraper, banneton (or bowl and cloth), a sharp blade, a heavy pot. Later: mill, mixer, proofer, deck oven.",
    },
    images: [
      img("tools", { zh: "秤、籃、鍋、攪拌缸：先買左邊，再羨慕右邊。", en: "Scale, basket, pot, mixer: buy the left side first." }),
      img("mill", { zh: "現磨香，但麩皮會割筋，新手先用現成麵包粉。", en: "Fresh flour smells great; bran cuts gluten. Start with bagged bread flour." }),
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "沒有秤，百分比是假的。沒有蒸氣，外皮是盔甲。其他都能湊。",
          en: "No scale, the percents are fiction. No steam, the crust is armor. Everything else can be improvised.",
        },
      },
      {
        label: { zh: "家用五件", en: "Five at home" },
        body: {
          zh: "電子秤（克）、刮板、發酵籃或碗加布、雙面刀片或 lame、5 夸脫左右鑄鐵鍋。總價常常低於一台華麗麵包機。麵包機揉麵很兇、也難做蒸汽，不適合作為酸種主場。",
          en: "Gram scale, bench scraper, banneton or a bowl plus cloth, razor or lame, ~5-quart Dutch oven. Often cheaper than a glossy bread machine. Those machines knead hard and steam poorly — a weak sourdough home.",
        },
      },
      {
        label: { zh: "後來的機器", en: "Later machines" },
        body: {
          zh: "家用磨粉機：香、營養標示好看，粉熱、吸水不穩。行星攪拌機：低速短打。螺旋攪拌機與分割滾圓機是店家產能。發酵箱管溫濕。石板爐管底板與蒸氣。都是「比較穩」，不是「沒有就不會發酵」。",
          en: "A home mill: perfume and bran, also heat and thirsty, moody dough. Planetary mixer: short and low. Spiral mixers and dividers are shop throughput. Proofers hold climate. Deck ovens hold hearth and steam. They stabilize. They are not required for fermentation.",
        },
      },
      {
        label: { zh: "失敗對照", en: "If it failed" },
        body: {
          zh: "扁：多半主發酵過或整型沒張力或沒蒸氣。酸尖：種過熟或發太久。洞全在一邊：氣被擠到一側。黏刀：麵還沒冷就切。重：種沒熟或太冷。先改一件，不要一次換配方、換粉、換爐。",
          en: "Flat: often over-bulk, slack shape, or no steam. Harsh sour: tired starter or too long a ferment. Holes all on one side: gas shoved aside. Gummy slice: you cut it hot. Dense: sleepy starter or a cold room. Change one variable, not formula and flour and oven at once.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "這十課的順序就是一顆麵包的順序。先把罐子養熟，再秤、再摺、再整、再蒸。機器可以等你烤膩了再買。",
          en: "These ten lessons follow one loaf. Ripe jar, then scale, folds, shape, steam. Buy machines after you’re bored, not before the first bubble.",
        },
      },
    ],
    sources: [
      { label: "FLEX — tools you actually need", href: "https://flexsourdough.com/sourdough-baking-tools/best-sourdough-baking-tools/" },
      { label: "Proven Kitchen — scale, banneton, lame, pot", href: "https://www.provenkitchentools.com/best-sourdough-tools/" },
    ],
    lab: {
      kind: "tools-lab",
      format: "svg",
      title: { zh: "先點必備，再點機器", en: "Tap needs first, machines later" },
      lesson: {
        zh: "秤與蒸氣最重要。磨粉機和發酵箱是加分，不是入場券。",
        en: "Scale and steam matter most. A mill and a proofer are extras, not tickets in.",
      },
      how: { zh: "依序點秤、刮板、籃、鍋，最後點攪拌機。", en: "Tap scale, scraper, basket, pot, then the mixer." },
      hint: { zh: "下一步：點電子秤。", en: "Next: tap the scale." },
      steps: steps([
        ["scale", { zh: "秤", en: "Scale" }, { zh: "點秤。沒有克就沒有百分比。", en: "Tap the scale. No grams, no percents." }],
        ["scraper", { zh: "刮板", en: "Scraper" }, { zh: "點刮板。它是你的第二隻手。", en: "Tap the scraper. It’s a second hand." }],
        ["banneton", { zh: "籃", en: "Banneton" }, { zh: "點籃。碗加布也能裝。", en: "Tap the basket. A bowl plus cloth also works." }],
        ["pot", { zh: "鑄鐵鍋", en: "Pot" }, { zh: "點鍋。這是家用蒸氣。", en: "Tap the pot. That’s home steam." }],
        ["mixer", { zh: "攪拌機", en: "Mixer" }, { zh: "點機器。可選，低速。", en: "Tap the mixer. Optional, keep it low." }],
      ]),
      hotspots: spots([
        ["scale", { zh: "秤", en: "Scale" }, { zh: "唯一不能用感覺替代的。", en: "The one tool vibes cannot replace." }],
        ["scraper", { zh: "刮板", en: "Scraper" }, { zh: "分割、摺、清潔。", en: "Divide, fold, clean." }],
        ["banneton", { zh: "籃", en: "Banneton" }, { zh: "定型。", en: "Holds the coat." }],
        ["pot", { zh: "鍋", en: "Pot" }, { zh: "蒸氣室。", en: "Steam room." }],
        ["mixer", { zh: "機器", en: "Machine" }, { zh: "手臂的替代，不是腦袋的替代。", en: "Replaces a wrist, not a brain." }],
      ]),
    },
  },
];
