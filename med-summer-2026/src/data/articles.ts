import type { Article } from "../types";

export const articles: Article[] = [
  {
    slug: "mflusiva",
    rank: 1,
    date: "2026-08-05",
    dateLabel: { zh: "2026.08.05", en: "5 Aug 2026" },
    tag: "vaccine",
    stage: "approved",
    title: {
      zh: "流感疫苗第一次改用 mRNA：像傳簡訊給細胞",
      en: "The first mRNA flu shot: texting your cells a memo",
    },
    dek: {
      zh: "FDA 核准第一支 mRNA 流感疫苗，50 歲以上能打。它不帶病毒碎片，只傳一則簡訊，請你的細胞自己做出練習用的外皮。",
      en: "FDA cleared the first mRNA flu shot for adults 50+. It does not carry a virus chunk — it texts your cells to build a practice coat.",
    },
    images: [
      {
        src: "images/mflusiva-hero.png",
        alt: {
          zh: "黑白極簡圖：一條 mRNA 簡訊被送進細胞。",
          en: "Monochrome illustration of an mRNA memo entering a cell.",
        },
      },
      {
        src: "images/mflusiva-ribosome.png",
        alt: {
          zh: "核糖體像工廠，照著 mRNA 做出流感表面蛋白。",
          en: "A ribosome factory building flu surface protein from mRNA.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "以前流感疫苗多半是「把病毒的外皮碎片帶來給你看」；這次是「把一封說明書打進去，請你的細胞自己做出那層外皮給免疫系統練習」。",
          en: "Old flu shots mostly show your immune system a piece of the virus’s coat. This one delivers a short instruction so your own cells make that coat for practice.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "2026 年 8 月 5 日，美國 FDA 核准 mFLUSIVA（研發代號 mRNA-1010），給 50 歲以上使用。65 歲以上走加速核准，還要再做上市後研究確認效果。第三期試驗收了大約 4 萬人，跟一般劑量流感疫苗比，相對保護力大約多 26.6%。聽起來數字不大，但流感每年都有，而且這是第一支過關的 mRNA 流感針。",
          en: "On 5 August 2026 the FDA approved mFLUSIVA (mRNA-1010) for people 50 and older. The 65+ indication is accelerated, so a follow-up study still has to confirm benefit. A phase 3 trial of about 40,800 adults found roughly 26.6% better protection than a standard-dose flu shot. Not a miracle number — but flu comes every year, and this is the first licensed mRNA flu vaccine.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "細胞核像圖書館，DNA 是館藏。mRNA 比較像一張影印出來的便條，細胞質裡的核糖體照著便條組氨基酸。這支疫苗給的便條寫著「流感病毒帽子上的 HA 蛋白長這樣」。細胞做出帽子之後，免疫細胞就記住臉孔。便條用完會被拆掉，不會改寫圖書館裡的書。",
          en: "Think of the nucleus as a library and DNA as the books. mRNA is a photocopy. Ribosomes in the cytoplasm read that slip and assemble amino acids. This vaccine’s slip says “here is flu’s HA hat protein.” After the cell builds the hat, immune cells remember the face. The slip is shredded. It does not rewrite the books.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "如果你或家裡長輩在美國、又滿 50 歲，2026–27 流感季有機會打到。臺灣與其他地方還在審查。副作用大致像其他針：手臂痛、疲倦、發燒。它不是治療已經感冒的藥，是開學前的防災演練。",
          en: "If you or an older relative in the U.S. is 50+, this may be on offer for the 2026–27 flu season. Other countries are still reviewing. Side effects look familiar: sore arm, tiredness, fever. It does not treat a flu you already have. It’s a fire drill before the season.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "65 歲以上的臨床好處還要再驗證。mRNA 流感針比傳統針更容易紅腫。它也還沒證明能一次解決「每年都要重打」這件事，病毒明年還是會變臉。",
          en: "Benefit in people 65+ still needs confirmatory data. The mRNA shot caused more local reactions than the old one. It also does not end yearly updates — flu will keep changing its face.",
        },
      },
    ],
    sources: [
      {
        label: "FDA approval letter — MFLUSIVA (5 Aug 2026)",
        href: "https://www.fda.gov/media/194121/download",
      },
      {
        label: "Healthcare Dive — FDA approves Moderna’s mRNA flu vaccine",
        href: "https://www.healthcaredive.com/news/moderna-fda-approve-mflusiva-seasonal-influenza/827180/",
      },
      {
        label: "AJMC — FDA approves Moderna’s mRNA flu vaccine",
        href: "https://www.ajmc.com/view/fda-approves-moderna-s-mrna-flu-vaccine-after-phase-3-success",
      },
    ],
    lab: {
      kind: "mrna-cell",
      title: { zh: "把說明書推進細胞", en: "Slide the memo into the cell" },
      lesson: {
        zh: "流感 mRNA 針送 HA 便條進細胞質；核糖體做出練習用外皮，DNA 不動。",
        en: "Flu mRNA sends an HA memo to the cytoplasm; ribosomes build a practice coat — DNA stays untouched.",
      },
      how: {
        zh: "先把左邊便條拖進虛線圈。再依序點核糖體、HA 帽子、細胞核、免疫細胞。畫面上會寫「拖我／點我」。",
        en: "Drag the slip into the dashed ring. Then tap the ribosome, HA hat, nucleus, and immune cell. Follow the “Drag me / Tap me” tags.",
      },
      hint: {
        zh: "下一步：把 mRNA 便條拖進細胞質的虛線圈。",
        en: "Next: drag the mRNA slip into the dashed ring inside the cell.",
      },
      steps: [
        { id: "deliver", title: { zh: "送進便條", en: "Deliver the slip" }, how: { zh: "按住左邊 mRNA，拖進細胞裡的虛線圈再放開。", en: "Hold the left mRNA slip, drop it on the dashed ring, then release." } },
        { id: "ribosome", title: { zh: "看工廠開工", en: "Start the factory" }, how: { zh: "點核糖體。氨基酸會一顆顆接起來。", en: "Tap the ribosome. Amino-acid beads start to chain." } },
        { id: "ha", title: { zh: "認 HA 帽子", en: "Meet the HA hat" }, how: { zh: "點做出來的 HA 帽子，那是免疫系統要記的臉。", en: "Tap the new HA hat — the face the immune system remembers." } },
        { id: "nucleus", title: { zh: "確認沒改 DNA", en: "Check the DNA" }, how: { zh: "點細胞核。便條不進圖書館，也不改書。", en: "Tap the nucleus. The slip never enters the library or edits the books." } },
        { id: "immune", title: { zh: "交給巡警", en: "Show the patrol" }, how: { zh: "點左邊出現的免疫細胞。它靠這頂帽子認流感。", en: "Tap the immune cell that appears. It uses the hat as a wanted face." } },
      ],
      hotspots: [
        {
          id: "nucleus",
          label: { zh: "細胞核", en: "Nucleus" },
          body: {
            zh: "圖書館。這支疫苗不進去這裡，也不改 DNA。",
            en: "The library. This shot does not go in here and does not edit DNA.",
          },
        },
        {
          id: "mrna",
          label: { zh: "mRNA 便條", en: "mRNA slip" },
          body: {
            zh: "一張臨時說明書，告訴工廠要做哪種蛋白。用完會被拆掉。",
            en: "A temporary instruction telling the factory which protein to build. It gets shredded.",
          },
        },
        {
          id: "ribosome",
          label: { zh: "核糖體", en: "Ribosome" },
          body: {
            zh: "細胞質裡的組裝臺。氨基酸一顆一顆接成 HA。",
            en: "The assembly bench in the cytoplasm. Amino acids click into HA.",
          },
        },
        {
          id: "ha",
          label: { zh: "HA 帽子", en: "HA hat" },
          body: {
            zh: "流感病毒用來抓住細胞的表面蛋白。免疫系統靠它認臉。",
            en: "The surface protein flu uses to grab cells. The immune system uses it as a face.",
          },
        },
        {
          id: "immune",
          label: { zh: "免疫細胞", en: "Immune cell" },
          body: {
            zh: "看到這頂練習用的帽子，以後真的流感來了比較認得出來。",
            en: "After this practice hat, real flu is easier to recognize.",
          },
        },
      ],
    },
  },
  {
    slug: "intismeran",
    rank: 2,
    date: "2026-08-19",
    dateLabel: { zh: "2026.08.19", en: "19 Aug 2026" },
    tag: "vaccine",
    stage: "phase3",
    title: {
      zh: "黑色素瘤疫苗不是學校預防針，是術後客製通緝令",
      en: "Not a school shot: a custom wanted poster after melanoma surgery",
    },
    dek: {
      zh: "默沙東 + Moderna 的個人化 mRNA 療法第一次在第三期達標：手術拿掉黑色素瘤之後，復發跟遠端轉移都比單用 K 藥更好。",
      en: "Merck + Moderna’s personalized mRNA therapy hit phase 3: after melanoma surgery, it beat Keytruda alone on recurrence and distant spread.",
    },
    images: [
      {
        src: "images/intismeran-hero.png",
        alt: {
          zh: "從腫瘤讀出突變指紋，印成客製 mRNA。",
          en: "Reading a tumor’s mutation fingerprint to print custom mRNA.",
        },
      },
      {
        src: "images/intismeran-tcell.png",
        alt: {
          zh: "T 細胞拿著通緝令辨認癌細胞。",
          en: "A T cell holding a wanted poster that matches a cancer cell.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "先把你的腫瘤拿去「讀指紋」，再做一支只認你這顆癌的 mRNA。它不是給健康人預防皮膚癌的針，是手術後幫免疫系統繼續盯梢。",
          en: "Doctors sequence your tumor’s fingerprint, then build an mRNA that only hunts that tumor. This is not a shot to stop melanoma in healthy people. It’s a follow-up after surgery.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "8 月 19 日，兩家公司公布 INTerpath-001：1137 位高風險、腫瘤已切乾淨的黑色素瘤病人。個人化療法 intismeran（mRNA-4157 / V940）加上 pembrolizumab（K 藥），無復發存活與無遠端轉移都比單用 K 藥好。這是第一個個人化新抗原療法、也是第一個 mRNA 癌症療法走到第三期還達標的。完整風險比跟總存活還沒公開，不要把比較早的第二期 b 數字當成這一期的成績。還沒上市，接下來才跟藥證單位談。",
          en: "On 19 August the companies reported INTerpath-001: 1,137 people with high-risk melanoma that had already been fully removed. Personalized intismeran (mRNA-4157 / V940) plus pembrolizumab beat Keytruda alone on recurrence-free and distant-metastasis-free survival. First positive phase 3 for an individualized neoantigen therapy and for an mRNA cancer treatment. Hazard ratios and overall survival were not released — do not treat earlier phase 2b numbers as this readout. Not approved yet; filings come next.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "癌細胞是「自己人變壞」。表面會出現突變做出來的怪蛋白，叫新抗原，像寫錯字的名牌。這支療法最多選 34 個錯字，寫進 mRNA，訓練 T 細胞：看到這排錯字就攻擊。K 藥則是把 T 細胞的剎車鬆掉。兩個一起，比較不容易漏網。",
          en: "Cancer cells are body cells gone wrong. Mutations make odd proteins — neoantigens — like name tags with typos. This therapy picks up to 34 typos, writes them into mRNA, and trains T cells to attack those tags. Keytruda lifts the T cell’s brake. Together they miss fewer escapees.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "現在全球都還買不到。製作要先做腫瘤基因檢測，時間跟價錢都會是門檻。如果家人在追黑色素瘤術後治療，這是值得問腫瘤科的新方向，不是明天就能在診所排隊的針。",
          en: "Nobody can buy this yet. It needs tumor sequencing, so time and cost will matter. If someone you love is in post-surgery melanoma care, it’s a question for oncology — not a walk-in clinic shot tomorrow.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "完整數字與總存活還要等醫學會發表。肺癌、腎癌等其他癌別的試驗還在跑。客製化量產能不能穩、健保會不會付，都還沒答案。",
          en: "Full numbers and overall survival still need a medical-meeting dump. Lung, kidney and other trials are running. Manufacturing and who pays are unsolved.",
        },
      },
    ],
    sources: [
      {
        label: "Merck — INTerpath-001 topline (19 Aug 2026)",
        href: "https://www.merck.com/news/merck-and-moderna-announce-phase-3-interpath-001-trial-of-intismeran-autogene-plus-keytruda-met-endpoints-of-recurrence-free-survival-rfs-and-distant-metastasis-free-survival-dmfs-in-patient/",
      },
      {
        label: "ASCO Post — phase 3 individualized neoantigen therapy",
        href: "https://ascopost.com/news/august-2026/interpath-001-trial-of-mrna-based-individualized-neoantigen-therapy-meets-primary-and-key-secondary-endpoints-in-patients-with-high-risk-resected-melanoma/",
      },
    ],
    lab: {
      kind: "fingerprint",
      title: { zh: "掃描腫瘤指紋，印通緝令", en: "Scan the tumor, print the poster" },
      lesson: {
        zh: "術後個人化，不是預防針：先讀這顆腫瘤的突變指紋，再印通緝令給 T 細胞。",
        en: "After surgery, personalized — not a prevention shot. It reads this tumor’s fingerprint, then prints a wanted poster for T cells.",
      },
      how: {
        zh: "點齊三個錯字 → 點印表機 → 把通緝令拖給 T 細胞 → 再點 T 細胞出擊。",
        en: "Tap all three typos → tap the printer → drag the poster to the T cell → tap the T cell to hunt.",
      },
      hint: {
        zh: "下一步：點腫瘤上的三個突變點（錯字 1、2、3）。",
        en: "Next: tap the three mutation dots (typos 1, 2, 3).",
      },
      steps: [
        { id: "scan", title: { zh: "讀三個錯字", en: "Read three typos" }, how: { zh: "分別點錯字 1、2、3。每個人的組合都不一樣。", en: "Tap typos 1, 2, and 3. Everyone’s set is different." } },
        { id: "print", title: { zh: "印通緝令", en: "Print the poster" }, how: { zh: "點中間的 mRNA 印表機。", en: "Tap the mRNA printer in the middle." } },
        { id: "arm", title: { zh: "交給 T 細胞", en: "Arm the T cell" }, how: { zh: "把印出來的通緝令拖到右邊 T 細胞上。", en: "Drag the printed poster onto the T cell." } },
        { id: "hunt", title: { zh: "出擊認人", en: "Send it hunting" }, how: { zh: "點拿到通緝令的 T 細胞，看它走向腫瘤。", en: "Tap the armed T cell and watch it move toward the tumor." } },
      ],
      hotspots: [
        {
          id: "tumor",
          label: { zh: "腫瘤", en: "Tumor" },
          body: {
            zh: "一堆突變細胞。每個人的錯字組合都不一樣。",
            en: "A cluster of mutated cells. Everyone’s typo set is different.",
          },
        },
        {
          id: "m1",
          label: { zh: "錯字 1", en: "Typo 1" },
          body: { zh: "一個突變做出來的怪蛋白，叫新抗原。", en: "A mutant protein — a neoantigen." },
        },
        {
          id: "m2",
          label: { zh: "錯字 2", en: "Typo 2" },
          body: { zh: "第二個可被 T 細胞認的標籤。", en: "A second tag T cells can learn." },
        },
        {
          id: "m3",
          label: { zh: "錯字 3", en: "Typo 3" },
          body: { zh: "療法最多能選幾十個錯字寫進同一支 mRNA。", en: "The therapy can pack dozens of typos into one mRNA." },
        },
        {
          id: "print",
          label: { zh: "mRNA 印表機", en: "mRNA printer" },
          body: {
            zh: "把選出來的錯字印成客製便條。",
            en: "Prints the chosen typos onto a custom slip.",
          },
        },
        {
          id: "poster",
          label: { zh: "通緝令", en: "Wanted poster" },
          body: { zh: "給 T 細胞看的臉孔清單，只適用這位病人。", en: "A face list for T cells, unique to this patient." },
        },
        {
          id: "tcell",
          label: { zh: "T 細胞", en: "T cell" },
          body: {
            zh: "免疫系統的巡警。拿到通緝令才認得出混在人群裡的癌。",
            en: "The immune patrol. The poster helps it spot cancer in a crowd.",
          },
        },
      ],
    },
  },
  {
    slug: "covid-xfg",
    rank: 3,
    date: "2026-08-27",
    dateLabel: { zh: "2026.08.27", en: "27 Aug 2026" },
    tag: "vaccine",
    stage: "approved",
    title: {
      zh: "新冠棘蛋白又換齒：今年流行株叫 XFG",
      en: "COVID’s spike key changed teeth again. This season’s strain is XFG",
    },
    dek: {
      zh: "Pfizer、Moderna、Novavax/Sanofi 的 2026–27 新冠針通過 FDA。病毒流行株換了，疫苗就像每年重配的流感針。",
      en: "FDA cleared 2026–27 COVID shots from Pfizer, Moderna and Novavax/Sanofi. The circulating strain moved, so the recipe moved — like flu.",
    },
    images: [
      {
        src: "images/covid-hero.png",
        alt: {
          zh: "病毒棘蛋白像一串會換齒的鑰匙。",
          en: "Spike proteins drawn as keys that change their teeth.",
        },
      },
      {
        src: "images/covid-lock.png",
        alt: {
          zh: "細胞上的 ACE2 像鎖孔；病毒棘蛋白是鑰匙。疫苗更新的是給免疫系統看的棘蛋白齒形，不是去改鎖。",
          en: "ACE2 as the lock; XFG spike as the key — and why the shot’s recipe updates the practice spike shape.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "病毒表面的棘蛋白一直變，疫苗就要跟著改配方。今年美國指定的流行株是 XFG，一種重組出來的 Omicron 後代。",
          en: "Spike keeps mutating, so the shot’s formula has to follow. This U.S. season’s pick is XFG, a recombinant Omicron grandchild.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "8 月 27 日前後，FDA 核准針對 XFG 的更新針：Pfizer/BioNTech 的 COMIRNATY XFG、Moderna 的 Spikevax 與 mNEXSPIKE，還有 Novavax/Sanofi 的 NUVAXOVID 蛋白疫苗。美國標籤縮在 65 歲以上，以及有高風險慢性病的較年輕族群（各廠年齡下限不同）。歐盟 7 月底就先核准同配方，而且年齡寫得比較寬。",
          en: "Around 27 August the FDA cleared XFG-updated shots: Pfizer/BioNTech COMIRNATY XFG, Moderna Spikevax and mNEXSPIKE, plus Novavax/Sanofi’s NUVAXOVID protein shot. U.S. labels focus on ages 65+ and younger people with high-risk conditions (age floors differ by brand). The EU authorized the same formula in late July with a wider age band.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "棘蛋白是病毒插進細胞的鑰匙，細胞上的 ACE2 是鎖。鑰匙齒形變了，舊抗體就比較對不太準。更新疫苗改成讓免疫系統練習認新款齒形的棘蛋白鑰匙。ACE2 鎖沒換，是病毒鑰匙變了。你不會因此「得一次疫苗裡的新冠」，mRNA 與蛋白疫苗都只是展示零件。",
          en: "Spike is the key; ACE2 on cells is the lock. When the teeth change, old antibodies miss. An updated shot shows your immune system the new spike teeth to practice on. ACE2 stays the same lock; the virus’s key is what changed. You do not catch COVID from the memo or the protein piece.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "這比較像每年流感針，不是 2021 年那種全民第一劑。高齡、有慢性病、免疫比較弱的人，問家庭醫師這季要不要補打最實在。沒保險的補助方案比疫情初期少，費用要想一下。",
          en: "Treat it like an annual flu shot, not 2021’s first-dose campaign. Older adults, people with chronic illness, and anyone immunocompromised should ask their clinician. Public safety-net programs are thinner than early pandemic years, so cost matters.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "XFG 之後一定還會再變。這季針對住院與死亡的真實世界數據，要等冬天過後才看得到。",
          en: "XFG will not be the last rename. Real-world data on hospital stays and deaths arrive after winter.",
        },
      },
    ],
    sources: [
      {
        label: "Pfizer / BioNTech — XFG-adapted COVID vaccine FDA approval",
        href: "https://www.biontech.com/us/en/home/mediaroom/news/press-releases/2026/08/Pfizer-and-BioNTech-Receive-U-S-FDA-Approval-for-XFG-adapted-COVID-19-Vaccine.html",
      },
      {
        label: "ABC News — what to know after FDA approval",
        href: "https://abcnews.com/Health/fda-approves-updated-covid-vaccines/story?id=136026783",
      },
      {
        label: "Moderna — 2026–2027 Spikevax / mNEXSPIKE approval",
        href: "https://www.biospace.com/press-releases/moderna-receives-u-s-fda-approval-for-updated-2026-2027-covid-19-vaccines",
      },
    ],
    lab: {
      kind: "lock-key",
      title: { zh: "認鎖、試鑰匙、對今年的針", en: "Same lock, new teeth, new shot" },
      lesson: {
        zh: "病毒棘蛋白（鑰匙）換齒，舊抗體對不準；更新疫苗改成教免疫系統認新齒形。ACE2 鎖在細胞上沒換。",
        en: "When spike (the key) changes teeth, old antibodies miss. The updated shot teaches your immune system the new teeth. ACE2 (the lock) does not change.",
      },
      how: {
        zh: "先點鎖。把舊鑰匙拖上去會顯示「齒不對」。再把右邊 XFG 新鑰匙拖上去。",
        en: "Tap the lock first. The old key will fail. Then drag the XFG key onto the lock.",
      },
      hint: {
        zh: "下一步：先點中間的 ACE2 鎖，搞懂病毒要開哪扇門。",
        en: "Next: tap the ACE2 lock and see which door the virus wants.",
      },
      steps: [
        { id: "lock", title: { zh: "認識這把鎖", en: "Meet the lock" }, how: { zh: "點 ACE2。那是呼吸道細胞門上的受體。", en: "Tap ACE2. It’s a receptor on airway-cell doors." } },
        { id: "old", title: { zh: "試舊鑰匙", en: "Try the old key" }, how: { zh: "把左邊舊棘蛋白拖到鎖上。它會對不準。", en: "Drag last year’s spike onto the lock. It will miss." } },
        { id: "neu", title: { zh: "換 XFG 齒", en: "Fit XFG" }, how: { zh: "把右邊 XFG 鑰匙拖到鎖上，看它對上。", en: "Drag the XFG key onto the lock and watch it fit." } },
        { id: "shot", title: { zh: "對上今年的針", en: "This year’s shot" }, how: { zh: "點右下角「今年的針」。這是給免疫系統看的鑰匙模型，不是去改 ACE2 鎖。", en: "Tap this year’s shot badge. It’s a practice key model for the immune system — not a new ACE2 lock." } },
      ],
      hotspots: [
        {
          id: "oldkey",
          label: { zh: "舊棘蛋白", en: "Old spike" },
          body: {
            zh: "去年的齒形。對同一把 ACE2 鎖還勉強插得進，但比較鬆，舊抗體也比較對不準。",
            en: "Last year’s teeth. Still a little useful on the same ACE2 lock, but sloppy; old antibodies miss more too.",
          },
        },
        {
          id: "newkey",
          label: { zh: "XFG 鑰匙", en: "XFG key" },
          body: {
            zh: "今年指定的流行株齒形。",
            en: "This season’s official tooth pattern.",
          },
        },
        {
          id: "lock",
          label: { zh: "ACE2 鎖", en: "ACE2 lock" },
          body: {
            zh: "許多呼吸道細胞門上的受體。病毒靠它進屋。",
            en: "A receptor on many airway cells. The virus uses it as a door.",
          },
        },
        {
          id: "shot",
          label: { zh: "今年的針", en: "This year’s shot" },
          body: {
            zh: "2026–27 新冠針改成教免疫系統認 XFG 棘蛋白齒形（練習用鑰匙模型），不是去改 ACE2 鎖。",
            en: "The 2026–27 shot teaches your immune system XFG spike teeth (a practice key model) — not a change to the ACE2 lock.",
          },
        },
      ],
    },
  },
  {
    slug: "casgevy",
    rank: 4,
    date: "2026-07-01",
    dateLabel: { zh: "2026.07.01", en: "1 Jul 2026" },
    tag: "gene",
    stage: "approved",
    title: {
      zh: "CRISPR 剪刀開放給 2 歲：把胎兒血紅素重新打開",
      en: "CRISPR scissors for age 2+: turn fetal hemoglobin back on",
    },
    dek: {
      zh: "Casgevy 從 12 歲降到 2 歲。鐮刀型紅血球與重型地中海貧血的小孩，有機會在器官被一次次疼痛摧殘之前就改基因。",
      en: "Casgevy’s label dropped from 12 to 2. Kids with sickle cell or transfusion-dependent thalassemia may get a gene edit before years of crises wreck organs.",
    },
    images: [
      {
        src: "images/casgevy-hero.png",
        alt: {
          zh: "圓潤紅血球與彎成鐮刀的紅血球並排。",
          en: "A round red cell beside a sickle-shaped one.",
        },
      },
      {
        src: "images/casgevy-crispr.png",
        alt: {
          zh: "CRISPR 在骨髓幹細胞上剪開 BCL11A 開關。",
          en: "CRISPR cutting the BCL11A switch on a marrow stem cell.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "醫生抽出自己的骨髓幹細胞，用 CRISPR 剪掉一個「關掉胎兒血紅素」的開關，再把細胞輸回去。血就比較不容易彎成鐮刀、比較不那麼痛。",
          en: "Doctors take your own marrow stem cells, CRISPR-cut a switch that had silenced fetal hemoglobin, and put the cells back. Blood is less likely to sickle and scream.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "7 月 1 日，FDA 把 Casgevy（exagamglogene autotemcel）適應症擴大到 2 歲以上，涵蓋反覆疼痛危機的鐮刀型血球疾病，以及需要輸血的 β 地中海貧血。2 到 4 歲是外推，不是直接收進試驗。Vertex 說美國大約再多 5500 名小孩符合資格。這仍是一次住院等級的治療，不是社區診所的針。",
          en: "On 1 July the FDA expanded Casgevy (exagamglogene autotemcel) to ages 2+ for sickle cell with repeated pain crises and transfusion-dependent beta thalassemia. Ages 2–4 rest on extrapolation, not a direct toddler trial. Vertex says about 5,500 extra U.S. children become eligible. It is still a hospital-scale one-time therapy, not a clinic shot.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "紅血球靠血紅素搬氧。出生後身體會關掉「胎兒版」血紅素，改用成人版。鐮刀型貧血是成人版基因寫錯，血球缺氧時會彎、卡住血管。BCL11A 像牆上的電燈開關，負責關掉胎兒版。CRISPR 剪這個開關，胎兒版重新亮起，血球比較圓、比較滑。",
          en: "Hemoglobin hauls oxygen. After birth we switch off the fetal version and use the adult one. Sickle cell is a typo in the adult gene, so cells bend and jam. BCL11A is the wall switch that killed fetal hemoglobin. CRISPR nicks that switch. Fetal hemoglobin comes back. Cells stay rounder.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "這是少數已經上市的基因編輯藥，現在連幼兒都進標籤。代價很高，還要先做清髓化療，不是每個家庭都走得下去。但它證明 CRISPR 不再只是新聞標題。",
          en: "One of the few CRISPR medicines already on the market, now labeled for toddlers. The price is huge and conditioning chemo is brutal, so not every family can walk this road. It still proves CRISPR is not just a headline.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "長期安不安全、多少治療中心真的做得出來、怎麼付錢，都還在磨。更便宜、不必大劑量化療的做法，是下一題。",
          en: "Long-term safety, how many centers can actually deliver it, and who pays are still grinding. Cheaper approaches that skip heavy chemo are the next exam.",
        },
      },
    ],
    sources: [
      {
        label: "Vertex — FDA expands CASGEVY to ages 2+ (1 Jul 2026)",
        href: "https://investors.vrtx.com/news-releases/news-release-details/vertex-announces-us-fda-approval-expanded-use-casgevyr-treatment",
      },
      {
        label: "Medical Daily — CRISPR therapy for children as young as 2",
        href: "https://www.medicaldaily.com/casgevy-crispr-sickle-cell-fda-approval-children-age-2-2026-476304",
      },
    ],
    lab: {
      kind: "crispr-switch",
      title: { zh: "打開胎兒血紅素開關", en: "Flip the fetal-hemoglobin switch" },
      lesson: {
        zh: "Casgevy 不是去修壞掉的成人血紅素，而是剪掉 BCL11A 開關，讓胎兒血紅素重新上班。",
        en: "Casgevy does not repair adult hemoglobin. It cuts the BCL11A switch so fetal hemoglobin can come back to work.",
      },
      how: {
        zh: "先點 BCL11A。把 CRISPR 剪刀拖到開關上。再點 HbF 計量表與鐮刀血球。",
        en: "Tap BCL11A, drag the CRISPR scissors onto it, then tap the HbF meter and the sickle cell.",
      },
      hint: {
        zh: "下一步：點左邊的 BCL11A 開關，看它在壓什麼。",
        en: "Next: tap the BCL11A switch and see what it is holding down.",
      },
      steps: [
        { id: "switch", title: { zh: "找到開關", en: "Find the switch" }, how: { zh: "點 BCL11A。出生後它把胎兒血紅素關掉。", en: "Tap BCL11A. After birth it shut fetal hemoglobin off." } },
        { id: "cut", title: { zh: "剪開開關", en: "Cut the switch" }, how: { zh: "把右邊 CRISPR 剪刀拖到 BCL11A 的虛線圈。", en: "Drag the CRISPR scissors onto the dashed ring on BCL11A." } },
        { id: "hbf", title: { zh: "看 HbF 回來", en: "Watch HbF return" }, how: { zh: "點胎兒血紅素計量表，看它從低變高。", en: "Tap the fetal-hemoglobin meter and watch it rise." } },
        { id: "cell", title: { zh: "血球變圓", en: "Round the cell" }, how: { zh: "點鐮刀型紅血球，看它比較像扁圓碟。", en: "Tap the sickle cell and watch it become a biconcave disc." } },
      ],
      hotspots: [
        {
          id: "bcl11a",
          label: { zh: "BCL11A 開關", en: "BCL11A switch" },
          body: {
            zh: "出生後把胎兒血紅素關掉的基因開關。",
            en: "The gene switch that shut fetal hemoglobin off after birth.",
          },
        },
        {
          id: "scissors",
          label: { zh: "CRISPR 剪刀", en: "CRISPR scissors" },
          body: {
            zh: "帶著導航 RNA 的分子剪刀，只剪指定位置。",
            en: "Molecular scissors with a GPS RNA, cutting one address.",
          },
        },
        {
          id: "hbf",
          label: { zh: "胎兒血紅素", en: "Fetal hemoglobin" },
          body: {
            zh: "小時候用的血紅素。重新打開，比較不容易聚成鐮刀。",
            en: "The childhood version. Turned back on, it is less likely to sickle.",
          },
        },
        {
          id: "cell",
          label: { zh: "紅血球", en: "Red cell" },
          body: {
            zh: "沒改之前像彎刀，卡住血管就痛。改完比較像扁圓碟。",
            en: "Before the edit it bends like a blade. After, it is more like a biconcave disc.",
          },
        },
      ],
    },
  },
  {
    slug: "qdenga",
    rank: 5,
    date: "2026-07-21",
    dateLabel: { zh: "2026.07.21", en: "21 Jul 2026" },
    tag: "vaccine",
    stage: "approved",
    title: {
      zh: "登革熱有四張臉，印度第一次核准四價疫苗",
      en: "Dengue has four faces. India just licensed a four-in-one shot",
    },
    dek: {
      zh: "印度藥證單位核准武田 Qdenga，4 到 60 歲都能打。這是該國第一支登革熱疫苗，兩劑隔三個月。",
      en: "India cleared Takeda’s Qdenga for ages 4–60 — the country’s first dengue vaccine, two doses three months apart.",
    },
    images: [
      {
        src: "images/qdenga-hero.png",
        alt: {
          zh: "一隻蚊子與四種登革熱血清型圖騰。",
          en: "A mosquito beside four dengue serotype emblems.",
        },
      },
      {
        src: "images/qdenga-tetra.png",
        alt: {
          zh: "減毒疫苗同時帶著四種弱化病毒。",
          en: "A live-attenuated vaccine carrying four weakened dengue types.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "登革熱不是一種病毒那麼簡單，有四個血清型。只防一種，下次遇到另一種有時反而更嚴重。Qdenga 一次帶四種弱化版本讓身體預習。",
          en: "Dengue is four serotypes, not one virus. Immunity to only one can make a later type worse. Qdenga previews all four in weakened form.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "7 月 21 日，印度 CDSCO / DCGI 核發 Qdenga（TAK-003）上市許可，這是重組減毒四價活疫苗，適用 4–60 歲，不管以前有沒有得過。它在歐盟等地早已核准，也有 WHO 預認證；印度是登革熱負擔很重的國家，這次等於把門打開。",
          en: "On 21 July India’s CDSCO / DCGI licensed Qdenga (TAK-003), a recombinant live-attenuated tetravalent vaccine, for ages 4–60 with or without prior infection. It was already approved in the EU and WHO-prequalified. India carries a huge dengue burden, so this opens a very large door.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "蚊子是注射器。病毒進血管後，免疫系統做出抗體。第二次遇到「長得很像但不一樣」的型，舊抗體可能幫病毒搭便車進細胞，叫做抗體依賴性增強。所以登革熱疫苗一定要想辦法顧到四張臉。Qdenga 用第二型當骨架，再掛上其他型的外表基因。",
          en: "Mosquitoes are syringes. After infection you make antibodies. A second, lookalike type can hitch a ride on old antibodies — antibody-dependent enhancement. A dengue vaccine has to cover four faces. Qdenga uses a type-2 backbone and hangs the other types’ coat genes on it.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "東南亞、南亞、中南美很多地方夏天就是登革熱季。這支針不是驅蚊液的替代品，防蚊還是第一線。臺灣會不會引進、給誰打，要看本地疫情與藥證，不是印度核准你明天就能打。",
          en: "A lot of South and Southeast Asia, plus Latin America, treat dengue as a summer fact of life. This shot does not replace repellent. Whether Taiwan or other places import it depends on local burden and regulators — India’s license is not your appointment.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "WHO 比較建議高流行區的 6–16 歲。對從沒得過的人、對每一型的保護力並不一樣。疫苗不是把登革熱從地球刪掉。",
          en: "WHO still leans toward ages 6–16 in high-transmission areas. Protection is not identical for never-infected people or for every serotype. The vaccine does not delete dengue from the planet.",
        },
      },
    ],
    sources: [
      {
        label: "PIB India — CDSCO clears Qdenga (21 Jul 2026)",
        href: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2286883",
      },
      {
        label: "Hindustan Times — India’s first dengue vaccine",
        href: "https://www.hindustantimes.com/ht-explainers/india-approves-first-dengue-vaccine-qdenga-what-it-protects-against-and-why-it-isnt-a-silver-bullet-101784622817447.html",
      },
    ],
    lab: {
      kind: "dengue-faces",
      title: { zh: "幫四張臉都做預習", en: "Preview all four faces" },
      lesson: {
        zh: "登革熱有四張臉。只預習一張，下一張有時更兇；四價疫苗一次給四張弱化臉。",
        en: "Dengue has four faces. Learning only one can make the next meaner. A tetravalent shot previews all four, weakened.",
      },
      how: {
        zh: "分別點 DENV-1～4，再點蚊子，接著點跳出的風險字條，最後點疫苗瓶把四型裝進去。",
        en: "Tap DENV-1 to 4, tap the mosquito, tap the risk slip, then tap the vial to load all four.",
      },
      hint: {
        zh: "下一步：先點左上 DENV-1，一張一張認臉。",
        en: "Next: tap DENV-1 at top left, then the other three faces.",
      },
      steps: [
        { id: "faces", title: { zh: "認齊四張臉", en: "Meet four faces" }, how: { zh: "分別點 DENV-1、2、3、4。圖案不一樣，代表不同血清型。", en: "Tap DENV-1, 2, 3, and 4. Different patterns mean different serotypes." } },
        { id: "mosquito", title: { zh: "看傳播者", en: "See the vector" }, how: { zh: "點埃及斑蚊。防蚊還是比任何針都先做。", en: "Tap the Aedes mosquito. Nets still come before any shot." } },
        { id: "ade", title: { zh: "讀風險字條", en: "Read the risk slip" }, how: { zh: "點蚊子後會跳出字條：只認一張臉，下一張可能更兇。", en: "After the mosquito, a slip appears: one face only can make the next worse." } },
        { id: "vial", title: { zh: "裝進四價針", en: "Load the shot" }, how: { zh: "點 Qdenga 瓶子，四種弱化病毒會裝進同一支針。", en: "Tap the Qdenga vial. Four weakened copies load into one shot." } },
      ],
      hotspots: [
        {
          id: "mosquito",
          label: { zh: "埃及斑蚊", en: "Aedes mosquito" },
          body: {
            zh: "會叮人的移動注射器。防蚊比任何針都先做。",
            en: "A flying syringe. Netting and repellent still come first.",
          },
        },
        {
          id: "d1",
          label: { zh: "DENV-1", en: "DENV-1" },
          body: { zh: "第一張臉。只打過這一型，還不算真正預習完。", en: "Face one. Seeing only this one is not a full preview." },
        },
        {
          id: "d2",
          label: { zh: "DENV-2", en: "DENV-2" },
          body: { zh: "第二張臉。血清型不同，抗體不一定互相夠用。", en: "Face two. A different serotype; antibodies may not fully cover it." },
        },
        {
          id: "d3",
          label: { zh: "DENV-3", en: "DENV-3" },
          body: { zh: "第三張臉。四價的意思就是四張都要出現在針裡。", en: "Face three. Tetravalent means all four belong in the shot." },
        },
        {
          id: "d4",
          label: { zh: "DENV-4", en: "DENV-4" },
          body: { zh: "第四張臉。漏掉任何一張，預習就不完整。", en: "Face four. Skip any one and the preview is incomplete." },
        },
        {
          id: "ade",
          label: { zh: "偏心風險", en: "One-sided risk" },
          body: {
            zh: "只認識一張臉時，下次遇到另一型，有時病情反而比較重。",
            en: "If you only know one face, the next type can sometimes hit harder.",
          },
        },
        {
          id: "vial",
          label: { zh: "Qdenga", en: "Qdenga" },
          body: {
            zh: "四價減毒活疫苗。病毒還活著，但力氣被調弱。",
            en: "A live tetravalent shot. The viruses are alive, but turned down.",
          },
        },
      ],
    },
  },
  {
    slug: "daraxonrasib",
    rank: 6,
    date: "2026-08-26",
    dateLabel: { zh: "2026.08.26", en: "26 Aug 2026" },
    tag: "cancer",
    stage: "approved",
    title: {
      zh: "胰臟癌那顆卡死的 RAS 開關，終於有藥能掰回來",
      en: "Pancreatic cancer’s stuck RAS switch finally has a pill",
    },
    dek: {
      zh: "FDA 核准口服 daraxonrasib（商品名 Rasonque）。第三期裡，已治療過的轉移胰臟癌中位存活從 6.7 個月拉到 13.2 個月。",
      en: "FDA approved oral daraxonrasib (Rasonque). In phase 3, median survival in treated metastatic pancreatic cancer rose from 6.7 to 13.2 months.",
    },
    images: [
      {
        src: "images/ras-hero.png",
        alt: {
          zh: "癌細胞膜上卡住的 RAS 開關。",
          en: "A RAS switch jammed on a cancer-cell membrane.",
        },
      },
      {
        src: "images/ras-pill.png",
        alt: {
          zh: "一顆口服藥楔進開關，生長訊號關掉。",
          en: "A daily pill wedging the switch so growth signals stop.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "超過九成常見胰臟癌都有 RAS 家族突變，等於生長開關黏在「開」。這是第一個核准用在轉移胰臟癌的口服 RAS 抑制劑。",
          en: "More than 90% of common pancreatic cancers carry a RAS-family mutation — a growth switch glued on. This is the first approved oral RAS blocker for metastatic disease.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "8 月 26 日 FDA 核准 Rasonque（daraxonrasib），給已經打過全身治療、或不能再承受多藥化療的轉移胰臟癌成人。RASolute 302 收了 500 人：單獨吃藥對上再做化療，中位總存活 13.2 對 6.7 個月，無惡化存活 7.2 對 3.6 個月。《NEJM》同期登出試驗。",
          en: "On 26 August the FDA approved Rasonque (daraxonrasib) for adults with metastatic pancreatic cancer after prior systemic therapy, or who cannot take multi-drug chemo. RASolute 302 randomized 500 people: pill alone versus more chemo. Median overall survival 13.2 vs 6.7 months; progression-free 7.2 vs 3.6. NEJM published the trial.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "接收器在細胞膜上。RAS 漂在膜內側：接到「可以長」就亮一下再關掉。突變之後開關黏住，下游一路喊「繼續分裂」。舊的 KRAS 藥多半只打得中少見的 G12C。daraxonrasib 瞄的是打開狀態的多種 RAS，覆蓋面比較寬。",
          en: "Receptors sit in the membrane. RAS floats just inside: it should blink on, then off. A mutation glues it on, so the cell never stops dividing. Older KRAS drugs mostly hit rare G12C. Daraxonrasib goes after many RAS proteins in the ON state.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "胰臟癌一直是存活很差的癌。這不是治癒，是把時間拉開。皮疹、腸胃不適是較常見的反應。有家人在打胰臟癌二線治療，可以問有沒有 RAS 檢測與這類新藥。",
          en: "Pancreatic cancer has stayed brutally hard. This is more time, not a cure. Rash and gut upset showed up often. If someone you love is on second-line care, ask about RAS testing and this new class.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "抗藥性幾乎一定會來。第一線能不能用、和其他藥怎麼搭，都還要新試驗。",
          en: "Resistance will almost certainly arrive. First-line use and combinations need new trials.",
        },
      },
    ],
    sources: [
      {
        label: "FDA — daraxonrasib for metastatic pancreatic adenocarcinoma",
        href: "https://www.fda.gov/drugs/resources-information-approved-drugs/fda-approves-daraxonrasib-metastatic-pancreatic-adenocarcinoma",
      },
      {
        label: "NEJM — Daraxonrasib or chemotherapy in metastatic pancreatic cancer",
        href: "https://www.nejm.org/doi/full/10.1056/NEJMoa2605555",
      },
      {
        label: "National Geographic — a new pill for pancreatic cancer",
        href: "https://www.nationalgeographic.com/health/article/pancreatic-cancer-kras-drug-daraxonrasib-trial-results",
      },
    ],
    lab: {
      kind: "ras-switch",
      title: { zh: "把黏住的開關掰回去", en: "Unstick the switch" },
      lesson: {
        zh: "胰臟癌常見 RAS 黏在 ON；口服藥把開關掰回 OFF，分裂訊號才停。",
        en: "In this cancer RAS sticks ON; the pill forces it OFF so “divide!” mail slows.",
      },
      how: {
        zh: "點卡住的 RAS 與生長箭頭，再把藥丸拖到開關上，最後點細胞核。",
        en: "Tap jammed RAS and the growth arrows, drag the pill onto the switch, then tap the nucleus.",
      },
      hint: {
        zh: "下一步：點中間那個翹起來的 RAS 開關。",
        en: "Next: tap the tilted RAS switch in the middle.",
      },
      steps: [
        { id: "ras", title: { zh: "看開關卡住", en: "See it jammed" }, how: { zh: "點 RAS。正常該亮一下，這裡卻常年開著。", en: "Tap RAS. It should blink; here it stays on." } },
        { id: "arrows", title: { zh: "看生長訊號", en: "See the signal" }, how: { zh: "點「分裂！」箭頭，那是一路傳到細胞核的指令。", en: "Tap the “divide!” arrows — orders heading for the nucleus." } },
        { id: "pill", title: { zh: "藥掰回去", en: "Force it quiet" }, how: { zh: "把右下藥丸拖到 RAS 的虛線圈上。", en: "Drag the pill onto the dashed ring on RAS." } },
        { id: "quiet", title: { zh: "核安靜了", en: "Nucleus goes quiet" }, how: { zh: "點右上細胞核，確認它不再一直聽到「分裂」。", en: "Tap the nucleus and confirm it stopped hearing “divide.”" } },
      ],
      hotspots: [
        {
          id: "ras",
          label: { zh: "RAS 開關", en: "RAS switch" },
          body: {
            zh: "正常會亮一下。胰臟癌裡它常年開著。",
            en: "It should blink. In this cancer it stays on all year.",
          },
        },
        {
          id: "pill",
          label: { zh: "daraxonrasib", en: "daraxonrasib" },
          body: {
            zh: "口服小分子，卡進「打開」的 RAS。",
            en: "An oral small molecule that jams RAS while it is ON.",
          },
        },
        {
          id: "arrows",
          label: { zh: "生長訊號", en: "Growth signals" },
          body: {
            zh: "開關打開就一路往核傳「分裂」。",
            en: "When the switch is on, the nucleus keeps hearing “divide.”",
          },
        },
        {
          id: "nucleus",
          label: { zh: "細胞核", en: "Nucleus" },
          body: {
            zh: "接到 RAS 的信就安排細胞分裂。信停了，它才安靜。",
            en: "It schedules division when RAS writes. When the mail stops, it quiets down.",
          },
        },
      ],
    },
  },
  {
    slug: "leqembi",
    rank: 7,
    date: "2026-07-13",
    dateLabel: { zh: "2026.07.13", en: "13 Jul 2026" },
    tag: "brain",
    stage: "approved",
    title: {
      zh: "阿茲海默的起始劑量，可以在家自己打了",
      en: "Alzheimer’s start-up doses can now begin at home",
    },
    dek: {
      zh: "FDA 核准 LEQEMBI IQLIK 皮下注射當起始劑量。早期病人不必每兩週跑一趟輸液室，改成一週一次在家打針。",
      en: "FDA approved LEQEMBI IQLIK as a subcutaneous start-up dose. Early Alzheimer’s care can begin as a weekly home shot instead of biweekly infusions.",
    },
    images: [
      {
        src: "images/leqembi-hero.png",
        alt: {
          zh: "家用注射筆與腦中類澱粉斑塊。",
          en: "A home injector pen beside amyloid plaques in a brain.",
        },
      },
      {
        src: "images/leqembi-plaque.png",
        alt: {
          zh: "抗體像清潔人員清掉神經元旁的斑塊。",
          en: "Antibodies as cleaners lifting plaque off a neuron.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "Lecanemab 是抓腦裡類澱粉蛋白的抗體。以前開始治療常要靜脈滴注，現在起始也能改成皮下，對病人跟家人都少跑幾趟醫院。",
          en: "Lecanemab is an antibody that grabs amyloid in the brain. Starting treatment used to mean IV drips. Now initiation can be a subcutaneous shot, which means fewer hospital trips.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "7 月 13 日，Eisai 與 Biogen 宣布 FDA 核准 LEQEMBI IQLIK 作為早期阿茲海默的起始劑量，預計 8 月底在美國由特藥藥局供貨。維持劑量的皮下針 2025 年就過了。Clarity AD 裡，靜脈治療 18 個月讓疾病進展大約慢 27%，不是讓記憶倒帶。",
          en: "On 13 July Eisai and Biogen said FDA approved LEQEMBI IQLIK as an initiation dose for early Alzheimer’s, expected in the U.S. via specialty pharmacy in late August. Subcutaneous maintenance was already approved in 2025. In Clarity AD, 18 months of IV treatment slowed decline by about 27%. It does not rewind memory.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "神經元彼此靠突觸說話。阿茲海默早期，類澱粉蛋白會在細胞外面堆成斑塊，像插座積一層灰。抗體是特製的 Y 形蛋白，專門黏這層灰，再請微膠細胞來清。藥能減慢變差，清斑塊也不等於變回 20 歲。",
          en: "Neurons talk at synapses. Early on, amyloid piles up outside cells like dust on a socket. The antibody is a Y-shaped sticker for that dust; microglia help haul it away. Slowing the slide is not a rewind to age 20.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "適用在早期，不是已經很重度的失智。要做影像與基因等檢查，也有腦水腫、出血這類 ARIA 風險，必須在專科追蹤下用。在家打比較方便，不是比較隨便。",
          en: "This is for early disease, not late-stage dementia. Imaging and other tests still matter, and ARIA (brain swelling or bleeding) is a real risk, so specialty follow-up stays. Home shots are more convenient, not more casual.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "價錢、哪些人真正用得到、長期會不會改變照護負擔，都還在看。Tau 蛋白那條線也還沒被這支藥單獨解決。",
          en: "Price, access, and whether home dosing really changes caregiver load are open. Tau is still a separate problem this drug does not solve alone.",
        },
      },
    ],
    sources: [
      {
        label: "Eisai / Biogen — LEQEMBI IQLIK initiation dose (13 Jul 2026)",
        href: "https://media-us.eisai.com/2026-07-13-FDA-Approves-LEQEMBI-IQLIK-R-lecanemab-irmb-Subcutaneous-Injection-as-an-Initiation-Dose-for-Early-Alzheimers-Disease",
      },
    ],
    lab: {
      kind: "plaque-clean",
      title: { zh: "擦掉神經元旁邊的灰", en: "Dust the neuron" },
      lesson: {
        zh: "類澱粉是神經元外面的垃圾。在這個模型裡，擦掉斑塊後訊號比較清楚；但不能把忘記的記憶自動還回來。",
        en: "Amyloid is junk outside the neuron. In this model, less plaque → a clearer signal. It does not restore lost memories by itself.",
      },
      how: {
        zh: "先點神經元與一塊灰。再把右邊 Y 形抗體拖到每一塊斑塊上。清完點突觸火花。",
        en: "Tap the neuron and one plaque. Drag the Y-shaped antibody onto each plaque. Then tap the synapse spark.",
      },
      hint: {
        zh: "下一步：先點神經元，搞懂這是電線不是肌肉。",
        en: "Next: tap the neuron — it’s a wire, not a muscle.",
      },
      steps: [
        { id: "neuron", title: { zh: "認神經元", en: "Meet the neuron" }, how: { zh: "點細胞本體。它會發電、傳訊。", en: "Tap the cell body. It fires and talks." } },
        { id: "plaque", title: { zh: "認斑塊", en: "Meet a plaque" }, how: { zh: "點一塊灰色圓點。那是堆在外面的蛋白垃圾。", en: "Tap a grey dot. Protein junk stacked outside." } },
        { id: "clean", title: { zh: "擦掉三塊灰", en: "Wipe three plaques" }, how: { zh: "把抗體拖到每一塊斑塊上，可重複拖。", en: "Drag the antibody onto each plaque. You can reuse it." } },
        { id: "spark", title: { zh: "看突觸說話", en: "See the synapse talk" }, how: { zh: "三塊都清完，點右邊火花。訊號會變亮。", en: "After all three are gone, tap the spark. The signal brightens." } },
      ],
      hotspots: [
        {
          id: "neuron",
          label: { zh: "神經元", en: "Neuron" },
          body: {
            zh: "會發電、會傳訊的細胞。不是肌肉，是電線。",
            en: "A cell that fires and talks. Not a muscle — a wire.",
          },
        },
        {
          id: "plaque",
          label: { zh: "類澱粉斑塊", en: "Amyloid plaque" },
          body: {
            zh: "堆在細胞外的蛋白垃圾。",
            en: "Protein junk stacked outside the cell.",
          },
        },
        {
          id: "ab",
          label: { zh: "lecanemab", en: "lecanemab" },
          body: {
            zh: "Y 形抗體，專門認這層灰。擦完可再去下一塊。",
            en: "A Y-shaped antibody that recognizes this dust. Reuse it on the next lump.",
          },
        },
        {
          id: "spark",
          label: { zh: "突觸", en: "Synapse" },
          body: {
            zh: "兩顆神經元說話的縫。灰少一點，訊號比較清楚；不是時光機。",
            en: "The gap where two neurons talk. Less dust, clearer signal — not a time machine.",
          },
        },
      ],
    },
  },
  {
    slug: "tudriqev",
    rank: 8,
    date: "2026-08-06",
    dateLabel: { zh: "2026.08.06", en: "6 Aug 2026" },
    tag: "cancer",
    stage: "approved",
    title: {
      zh: "改造過的病毒直接打進黑色素瘤，再叫醒免疫",
      en: "A remixed virus goes into melanoma and wakes the immune system",
    },
    dek: {
      zh: "FDA 加速核准 Tudriqev 搭配 nivolumab，給抗 PD-1 之後又惡化的晚期皮膚黑色素瘤。這是溶瘤病毒：只想在腫瘤裡複製、炸開。",
      en: "FDA accelerated Tudriqev plus nivolumab for advanced skin melanoma that progressed after PD-1 blockade. An oncolytic virus: copy itself inside the tumor, then burst.",
    },
    images: [
      {
        src: "images/tudriqev-hero.png",
        alt: {
          zh: "改造疱疹病毒進入腫瘤細胞。",
          en: "An engineered herpes virus entering a tumor cell.",
        },
      },
      {
        src: "images/tudriqev-burst.png",
        alt: {
          zh: "腫瘤裂開，警報分子召來 T 細胞。",
          en: "A tumor bursting and alarm signals calling T cells.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "把單純疱疹病毒改到「愛在癌細胞裡繁殖」。腫瘤裂開時會發出警報，再搭配鬆剎車的免疫藥，讓原本沒反應的病人有機會重新打。",
          en: "Rewrite a herpes virus so it prefers cancer cells. When the tumor bursts it sounds an alarm; an immune-brake drug helps people who had stopped responding.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "8 月 6 日 FDA 加速核准 Tudriqev（vusolimogene oderparepvec-wtpg）合併 nivolumab，用於不可切除、抗 PD-1 後進展的成人晚期皮膚黑色素瘤。單臂試驗 140 人，可評估的 91 人裡客觀緩解率 24%，緩解持續中位 14.1 個月。加速核准代表還要做確認性試驗，成績不好標籤可能被拿掉。",
          en: "On 6 August FDA accelerated Tudriqev (vusolimogene oderparepvec-wtpg) with nivolumab for unresectable advanced cutaneous melanoma after PD-1 therapy. In a 140-person single-arm study, 24% of 91 evaluable patients responded; median duration 14.1 months. Accelerated approval means a confirmatory trial still has to land, or the label can go away.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "病毒本來就會進細胞複製。科學家改它的基因，讓它比較不會搞健康細胞、比較會在腫瘤裡開分店。細胞裂開時，腫瘤碎片與警報分子跑出來，樹突細胞撿起來去訓練 T 細胞。Nivolumab 把 PD-1 這道剎車鬆開。",
          en: "Viruses already break into cells to copy themselves. Engineers retune the genes so healthy cells are less interesting and tumors become the franchise. Burst fragments plus alarm molecules train T cells via dendritic cells. Nivolumab lifts the PD-1 brake.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "這給「免疫治療失效」的晚期病人多一條路，而且腫瘤必須能被注射到。不是早期皮膚病變的第一線，也不是可以口服帶回家的糖漿。",
          en: "It is another door after immunotherapy stops working, and the tumor has to be injectable. Not first-line for a new mole, and not a syrup you take home.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "單臂試驗沒有對照組，加速核准的確認數據還沒出來。哪些腫瘤夠「打得到」，實務上會卡關。",
          en: "No randomized control arm yet, and confirmatory data are pending. In clinic, “can we inject this tumor?” will be a real filter.",
        },
      },
    ],
    sources: [
      {
        label: "FDA — Tudriqev (RP1) with nivolumab for advanced melanoma",
        href: "https://www.fda.gov/drugs/resources-information-approved-drugs/fda-grants-accelerated-approval-vusolimogene-oderparepvec-wtpg-combination-nivolumab-melanoma",
      },
    ],
    lab: {
      kind: "oncolytic",
      title: { zh: "讓病毒在腫瘤裡開分店", en: "Let the virus open a shop in the tumor" },
      lesson: {
        zh: "改造病毒偏愛在腫瘤複製→腫瘤裂開→釋出警報；加 PD-1 鬆剎讓 T 細胞跟上。",
        en: "Engineered virus copies in tumors → burst → alarm; plus PD-1 brake off so T cells join.",
      },
      how: {
        zh: "先點腫瘤。把病毒拖到健康細胞會彈開；再拖進腫瘤等它裂開，最後點趕來的 T 細胞。",
        en: "Tap the tumor. Drop the virus on a healthy cell to see it bounce, then drop it in the tumor and tap the arriving T cell.",
      },
      hint: {
        zh: "下一步：先點中間的腫瘤，認清楚工廠在哪。",
        en: "Next: tap the tumor so you know where the factory is.",
      },
      steps: [
        { id: "tumor", title: { zh: "認腫瘤工廠", en: "Find the factory" }, how: { zh: "點中間大圓。病毒想在這裡開分店。", en: "Tap the big circle. That’s where the virus wants a shop." } },
        { id: "bounce", title: { zh: "健康細胞彈開", en: "Bounce off healthy" }, how: { zh: "把左邊病毒拖到右邊健康細胞，看它不住。", en: "Drag the virus onto the healthy cell. It will not stay." } },
        { id: "infect", title: { zh: "在腫瘤裡裂開", en: "Burst in the tumor" }, how: { zh: "再把病毒拖進中間腫瘤，看它複製後炸開。", en: "Drag the virus into the tumor. It copies, then bursts." } },
        { id: "tcell", title: { zh: "叫醒巡警", en: "Wake the patrol" }, how: { zh: "點裂開後出現的 T 細胞。警報就是裂開本身。", en: "Tap the T cell that appears. The burst is the alarm." } },
      ],
      hotspots: [
        {
          id: "virus",
          label: { zh: "改造 HSV", en: "Engineered HSV" },
          body: {
            zh: "單純疱疹病毒的改裝版，導航改成愛腫瘤。",
            en: "A remixed herpes simplex virus steered toward tumors.",
          },
        },
        {
          id: "tumor",
          label: { zh: "腫瘤", en: "Tumor" },
          body: {
            zh: "病毒的工廠。裂開時會發出警報。",
            en: "The factory. Bursting is the alarm.",
          },
        },
        {
          id: "healthy",
          label: { zh: "健康細胞", en: "Healthy cell" },
          body: {
            zh: "不是完美零傷害，但病毒比較不想在這裡住。",
            en: "Not zero risk — just a much worse neighborhood for this virus.",
          },
        },
        {
          id: "tcell",
          label: { zh: "T 細胞", en: "T cell" },
          body: {
            zh: "被裂開的腫瘤叫醒。這支藥常跟鬆剎車的免疫藥一起用。",
            en: "Woken by the burst. This drug is often paired with a brake-lifting checkpoint drug.",
          },
        },
      ],
    },
  },
  {
    slug: "lz901",
    rank: 9,
    date: "2026-08-07",
    dateLabel: { zh: "2026.08.07", en: "7 Aug 2026" },
    tag: "vaccine",
    stage: "phase3",
    title: {
      zh: "帶狀皰疹：病毒在神經裡裝睡，LZ901 試著攔路",
      en: "Shingles: virus naps in nerves — LZ901’s big phase 3 head count",
    },
    dek: {
      zh: "2.6 萬人試驗：兩劑後一年，帶狀皰疹少很多；還在等中國藥證。",
      en: "Phase 3 in 26,000 adults: two doses, far fewer shingles in a year — license still pending in China.",
    },
    images: [
      {
        src: "images/lz901-hero.png",
        alt: {
          zh: "水痘病毒躲在神經節裡休眠。",
          en: "Varicella-zoster virus sleeping in a nerve ganglion.",
        },
      },
      {
        src: "images/lz901-nerve.png",
        alt: {
          zh: "病毒沿神經醒來變成皮帶狀水泡。",
          en: "The virus waking and traveling a nerve into a belt of blisters.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "小時候的水痘病毒會在神經節裡睡幾十年。免疫一鬆，它沿神經爬出來，就是帶狀皰疹，痛起來能痛很久。LZ901 用蛋白加佐劑，叫免疫系統不要忘記。",
          en: "The childhood chickenpox virus can nap for decades in a nerve ganglion. When immunity slips it walks the nerve — shingles, sometimes with months of pain. LZ901 is a protein-plus-adjuvant reminder.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "8 月 7 日，綠竹生物宣布第三期結果刊登。超過 2.6 萬名 40 歲以上成人，兩劑間隔 30 天。一年內實驗室確診帶狀皰疹：疫苗組 15 人、安慰劑 178 人，保護力 91.6%；對疱疹後神經痛約 95%。第三級不良反應兩邊都很少。BLA 2025 年初已送中國藥監，這篇論文是公開證據，不是核准本身。",
          en: "On 7 August Luzhu said the phase 3 paper was out. More than 26,000 adults 40+ got two doses 30 days apart. Lab-confirmed shingles in a year: 15 vs 178, efficacy 91.6%; about 95% against post-herpetic neuralgia. Grade-3 reactions were rare on both sides. A BLA has sat with China’s NMPA since early 2025. A paper is evidence, not a license.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "水痘－帶狀皰疹病毒是疱疹病毒家族，擅長躲在神經細胞體裡。疫苗的 gE 蛋白是病毒外套上很好認的一塊。免疫細胞記住這塊，病毒想沿著軸突爬出來時比較容易被攔。40 歲就收進試驗，比很多國家只推 50 歲以上更早。",
          en: "Varicella-zoster is a herpesvirus that hides in nerve-cell bodies. The vaccine’s gE protein is an easy-to-spot piece of the coat. Memory cells waiting on that piece can intercept the climb down the axon. The trial started at age 40, younger than many 50+ national programs.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "得過水痘的人，理論上都有「以後長蛇」的風險。現成已上市的帶狀皰疹疫苗在很多國家已經有了；LZ901 是另一個候選，特別跟中國供應有關。痛過的人會跟你說，預防比止痛重要。",
          en: "If you had chickenpox, you already carry the future-shingles risk. Licensed shingles shots already exist in many countries; LZ901 is another candidate, especially for China. People who have had the pain will tell you prevention beats painkillers.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "70 歲以上保護力看起來比較低。追蹤目前是一年，更久以後還要不要補打不知道。中國以外能不能用，得另走藥證。",
          en: "Efficacy looked lower at 70+. Follow-up is one year so far, so boosters are unknown. Use outside China needs other regulators.",
        },
      },
    ],
    sources: [
      {
        label: "Nature Communications — LZ901 phase 3",
        href: "https://www.nature.com/articles/s41467-026-76313-w",
      },
      {
        label: "HKEX — Luzhu announcement (7–9 Aug 2026)",
        href: "https://www1.hkexnews.hk/listedco/listconews/sehk/2026/0809/2026080900097.pdf",
      },
    ],
    lab: {
      kind: "shingles-nerve",
      title: { zh: "病毒在神經裡睡醒", en: "The virus wakes in the nerve" },
      lesson: {
        zh: "水痘病毒會在神經節裝睡，醒來沿著軸突爬到皮膚就是帶狀皰疹。疫苗把攔截部隊提前放在路上。",
        en: "Chickenpox virus naps in a ganglion, then walks the axon to the skin as shingles. The vaccine stations blockers on that road.",
      },
      how: {
        zh: "先點神經節宿舍，再點一次叫醒病毒，看它沿電線爬。點軸突認識路，最後點疫苗攔截。",
        en: "Tap the ganglion, tap again to wake the virus, tap the axon, then tap the vaccine to block the road.",
      },
      hint: {
        zh: "下一步：點左邊神經節，看病毒在宿舍裝睡。",
        en: "Next: tap the ganglion on the left — the virus is napping there.",
      },
      steps: [
        { id: "ganglion", title: { zh: "找到宿舍", en: "Find the dorm" }, how: { zh: "點左邊神經節。水痘病毒最會在這裡裝睡。", en: "Tap the ganglion. That’s the favorite nap spot." } },
        { id: "wake", title: { zh: "叫醒病毒", en: "Wake it" }, how: { zh: "再點同一顆神經節，看白點沿電線爬向皮膚。", en: "Tap the same ganglion again and watch the white dot walk the wire." } },
        { id: "axon", title: { zh: "認軸突", en: "Meet the axon" }, how: { zh: "點中間那條粗線。那是神經的長電線。", en: "Tap the thick line. That’s the nerve’s long wire." } },
        { id: "vax", title: { zh: "路上攔截", en: "Block the road" }, how: { zh: "點下方 LZ901。抗體會擋在半路。", en: "Tap LZ901. Antibodies step onto the road." } },
      ],
      hotspots: [
        {
          id: "ganglion",
          label: { zh: "神經節", en: "Ganglion" },
          body: {
            zh: "一串神經細胞體聚在一起。病毒最會在這裡裝睡。",
            en: "A bundle of nerve-cell bodies. The favorite nap spot.",
          },
        },
        {
          id: "virus",
          label: { zh: "水痘／帶狀皰疹病毒", en: "Varicella-zoster virus" },
          body: {
            zh: "小時候是水痘，裝睡多年後醒來就變帶狀皰疹。",
            en: "Chickenpox in childhood. Years later the same virus can wake as shingles.",
          },
        },
        {
          id: "axon",
          label: { zh: "軸突", en: "Axon" },
          body: {
            zh: "神經的長電線。病毒醒了就沿著它爬到皮膚。",
            en: "The long wire. Once awake, the virus walks it to the skin.",
          },
        },
        {
          id: "vaccine",
          label: { zh: "gE 蛋白疫苗", en: "gE protein shot" },
          body: {
            zh: "給免疫系統看外套碎片，提前部署攔截。",
            en: "Shows the coat fragment so patrols are already in place.",
          },
        },
        {
          id: "skin",
          label: { zh: "皮膚疹", en: "Skin rash" },
          body: {
            zh: "病毒爬到皮膚末端就起疹、會痛。攔截愈早，愈不容易走到這裡。",
            en: "When the virus reaches the skin it rashes and hurts. Earlier blockers help.",
          },
        },
      ],
    },
  },
  {
    slug: "nano-eraser",
    rank: 10,
    date: "2026-08-26",
    dateLabel: { zh: "2026.08.26", en: "26 Aug 2026" },
    tag: "brain",
    stage: "early",
    title: {
      zh: "星狀膠細胞被勸去轉行當神經元——還在老鼠與類器官",
      en: "Star-shaped support cells talked into becoming neurons — in mice, for now",
    },
    dek: {
      zh: "Nano-ERASER 奈米粒子讓星狀膠細胞轉成神經元，老鼠記憶任務變好。這是實驗室突破，不是醫院處方。",
      en: "Nano-ERASER nanoparticles nudged astrocytes into neurons and helped mice on memory tasks. Lab breakthrough, not a prescription.",
    },
    images: [
      {
        src: "images/nano-hero.png",
        alt: {
          zh: "星狀膠細胞與神經元並排，像轉職前後。",
          en: "An astrocyte and a neuron side by side, like a career change.",
        },
      },
      {
        src: "images/nano-particle.png",
        alt: {
          zh: "奈米粒子穿過血腦屏障進入膠細胞。",
          en: "A nanoparticle crossing the blood–brain barrier into a glia cell.",
        },
      },
    ],
    sections: [
      {
        label: { zh: "一句話", en: "One line" },
        body: {
          zh: "成人大腦不太會再長新的神經元。這篇研究用奈米粒子關掉膠細胞裡一個叫 PTBP1 的剎車，讓支援細胞改行當神經元。人身上還沒試。",
          en: "Adult brains barely grow new neurons. This paper used nanoparticles to ease off a brake called PTBP1 in glia, so support cells retrained as neurons. No human trial yet.",
        },
      },
      {
        label: { zh: "發生了什麼", en: "What happened" },
        body: {
          zh: "8 月 26 日《Cell Biomaterials》報告：Nano-ERASER 在人類星狀膠細胞與阿茲海默類器官裡，讓膠細胞轉成會放電的神經元；在小鼠身上，築巢與水迷宮表現變好，神經元密度上升、發炎與類澱粉下降。作者說下一步是更長追蹤與靈長類，這不是治癒宣告。",
          en: "On 26 August Cell Biomaterials reported that Nano-ERASER turned human astrocytes and Alzheimer’s organoids into firing neurons. Mice nested better and solved a water maze faster; neuron density rose, inflammation and amyloid fell. The authors want longer follow-up and primates. This is not a cure announcement.",
        },
      },
      {
        label: { zh: "用國中生物講", en: "Like year-9 biology" },
        body: {
          zh: "大腦不只神經元。星狀膠細胞像後勤：餵養、修血腦屏障、清垃圾。PTBP1 有點像「你不要改行」的管理員。奈米粒子把管理員的量降下來，細胞重寫自己的工作內容。跟 CRISPR 不同，它號稱不改 DNA，比較像暫時關蛋白。轉行會不會轉過頭、長錯地方，正是下一題。",
          en: "The brain is not only neurons. Astrocytes are logistics: food, barrier repair, trash. PTBP1 is a manager saying “do not change jobs.” The particle turns that manager down so the cell rewrites its job description. Unlike CRISPR it claims not to edit DNA — more like pausing a protein. Whether cells retrain too far, or in the wrong place, is the next worry.",
        },
      },
      {
        label: { zh: "跟你有什麼關係", en: "Why you might care" },
        body: {
          zh: "現有阿茲海默藥多半是減速。如果支援細胞真能補位，想像空間很大。但從老鼠到人，失敗率很高。把它當「方向」，不要當「下個月的藥」。",
          en: "Today’s Alzheimer’s drugs mostly slow the slide. If support cells can really fill in, the imagination gets loud. Mouse-to-human failure is still the default. Treat this as a direction, not next month’s prescription.",
        },
      },
      {
        label: { zh: "還沒做完的事", en: "Still open" },
        body: {
          zh: "沒有人體試驗。把膠細胞轉成神經元這條路，過去就有人質疑能不能穩穩重現。新神經元會不會接到正確迴路、會不會致瘤、能不能穩定過血腦屏障，全都不知道。",
          en: "No human trial. Turning glia into neurons already has a reproducibility argument in the field. We also do not know if new neurons wire correctly, whether tumors appear, or if barrier delivery stays reliable.",
        },
      },
    ],
    sources: [
      {
        label: "Cell Biomaterials — Nano-ERASER / PTBP1 (26 Aug 2026)",
        href: "https://www.cell.com/cell-biomaterials/fulltext/S3050-5623(26)00231-X",
      },
      {
        label: "Phys.org — nanoparticles induce neuroregeneration",
        href: "https://phys.org/news/2026-08-nanoparticles-neuroregeneration-alzheimer-disease.html",
      },
    ],
    lab: {
      kind: "reprogram",
      title: { zh: "勸星狀細胞轉行", en: "Talk the star cell into a new job" },
      lesson: {
        zh: "星狀膠細胞是後勤，不是電線。實驗室用奈米粒子關掉 PTBP1，勸它轉行當神經元——現在只在老鼠與類器官。",
        en: "Astrocytes are logistics, not wires. A nanoparticle turns PTBP1 down so they try a neuron job — in mice and organoids, not clinics.",
      },
      how: {
        zh: "點星星細胞，再點中間 PTBP1 剎車。把奈米粒子拖進去，點轉行後的神經元，最後一定要點右下警告牌。",
        en: "Tap the star cell, tap the PTBP1 brake, drag the nanoparticle in, tap the new neuron, then tap the warning stamp.",
      },
      hint: {
        zh: "下一步：點中間的星狀膠細胞，它是後勤不是電線。",
        en: "Next: tap the star-shaped astrocyte. Support, not sparks.",
      },
      steps: [
        { id: "astro", title: { zh: "認後勤細胞", en: "Meet the support cell" }, how: { zh: "點星星。形狀像星星，工作是支援。", en: "Tap the star. Star-shaped. Support, not sparks." } },
        { id: "ptbp1", title: { zh: "找到剎車", en: "Find the brake" }, how: { zh: "再點正中間的方塊 PTBP1。", en: "Tap the square in the middle: PTBP1." } },
        { id: "nano", title: { zh: "送進粒子", en: "Send the particle" }, how: { zh: "把右邊白點拖進虛線圈，剎車會消失。", en: "Drag the white dot into the dashed ring. The brake fades." } },
        { id: "neuron", title: { zh: "看它轉行", en: "See the new job" }, how: { zh: "點長出軸突的細胞。它開始比較像神經元。", en: "Tap the cell with a new axon. It is trying a neuron job." } },
        { id: "caveat", title: { zh: "讀實驗警告", en: "Read the warning" }, how: { zh: "點右下「老鼠／類器官，不是處方」。這還不能給病人用。", en: "Tap the stamp: mice / organoids, not a prescription." } },
      ],
      hotspots: [
        {
          id: "astro",
          label: { zh: "星狀膠細胞", en: "Astrocyte" },
          body: {
            zh: "大腦後勤。形狀像星星，工作是支援不是發電。",
            en: "Brain logistics. Star-shaped. Support, not sparks.",
          },
        },
        {
          id: "ptbp1",
          label: { zh: "PTBP1", en: "PTBP1" },
          body: {
            zh: "勸細胞「維持原職」的蛋白剎車。",
            en: "A protein brake that says “stay in your lane.”",
          },
        },
        {
          id: "nano",
          label: { zh: "Nano-ERASER", en: "Nano-ERASER" },
          body: {
            zh: "過血腦屏障的粒子，去降低 PTBP1。",
            en: "A particle that can cross the barrier and turn PTBP1 down.",
          },
        },
        {
          id: "neuron",
          label: { zh: "轉行後的神經元", en: "New neuron" },
          body: {
            zh: "後勤細胞被勸去發電。這是實驗室畫面，不是醫院常規。",
            en: "A support cell talked into firing. Lab picture, not hospital routine.",
          },
        },
        {
          id: "caveat",
          label: { zh: "還不能開藥", en: "Not a prescription" },
          body: {
            zh: "老鼠記憶任務變好，不代表明年診所就有。再現性也還在吵。",
            en: "Better mouse memory is not a clinic product. Reproducibility is still argued.",
          },
        },
      ],
    },
  },
];

export const tagCopy: Record<Article["tag"], { zh: string; en: string }> = {
  vaccine: { zh: "疫苗", en: "Vaccine" },
  gene: { zh: "基因", en: "Gene" },
  cancer: { zh: "癌症", en: "Cancer" },
  brain: { zh: "大腦", en: "Brain" },
};

export const stageCopy: Record<Article["stage"], { zh: string; en: string }> = {
  approved: { zh: "已核准", en: "Approved" },
  phase3: { zh: "第三期", en: "Phase 3" },
  early: { zh: "實驗室", en: "Early lab" },
};
