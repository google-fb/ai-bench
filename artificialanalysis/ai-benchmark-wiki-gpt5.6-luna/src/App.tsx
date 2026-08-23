import { useMemo, useState } from 'react'

type IconName =
  | 'arrow'
  | 'book'
  | 'check'
  | 'chevron'
  | 'close'
  | 'code'
  | 'external'
  | 'eye'
  | 'flask'
  | 'layers'
  | 'menu'
  | 'minus'
  | 'search'
  | 'spark'
  | 'target'
  | 'tool'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" /><path d="M4 5.5v16m4-14h8m-8 4h8" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    code: <><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-12-2 16" /></>,
    external: <><path d="M14 4h6v6m-1-5L11 13" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></>,
    eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
    flask: <><path d="M9 3h6m-5 0v5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8V3" /><path d="M7 16h10" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    minus: <path d="M5 12h14" />,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    spark: <><path d="m12 3-1.5 6.5L4 11l6.5 1.5L12 19l1.5-6.5L20 11l-6.5-1.5L12 3Z" /><path d="m19 17-.5 2.5L16 20l2.5.5L19 23l.5-2.5L22 20l-2.5-.5" /></>,
    target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
    tool: <><path d="m14.7 6.3 3-3a4 4 0 0 0-5.2 5.9L4.2 17.5a2 2 0 1 0 2.8 2.8l8.3-8.3a4 4 0 0 0 5.9-5.2l-3 3-3.5-0.5-.5-3.5Z" /></>,
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

const categories = ['全部', '知識與推理', '程式設計', '多模態', 'Agent 任務', '長文件']

const benchmarks = [
  {
    category: '知識與推理',
    eyebrow: '綜合指標',
    title: 'Artificial Analysis Intelligence Index',
    description: '把數學、科學、程式與推理等 9 項挑戰整合，快速看模型的整體能力。',
    metric: '合成分數',
    color: 'orange',
    icon: 'spark' as IconName,
  },
  {
    category: '知識與推理',
    eyebrow: '學術推理',
    title: 'GPQA Diamond',
    description: '198 道由專家設計的高難度科學問題，測試模型能否進行真正的專業推理。',
    metric: '答對率（%）',
    color: 'blue',
    icon: 'flask' as IconName,
  },
  {
    category: '知識與推理',
    eyebrow: '多學科知識',
    title: 'MMLU-Pro',
    description: '涵蓋 14 個學科、約 12,000 題的進階版測驗，選項更多，也更難靠猜測得分。',
    metric: '答對率（%）',
    color: 'purple',
    icon: 'book' as IconName,
  },
  {
    category: '程式設計',
    eyebrow: '持續更新',
    title: 'LiveCodeBench',
    description: '從競賽平台持續加入新題目，讓模型寫程式、修正錯誤，再實際執行驗證。',
    metric: '通過率（%）',
    color: 'green',
    icon: 'code' as IconName,
  },
  {
    category: '多模態',
    eyebrow: '文字＋圖片',
    title: 'MMMU-Pro',
    description: '同時理解圖像與文字的跨學科題目，並設計機制降低只靠選項猜答案的機會。',
    metric: '答對率（%）',
    color: 'pink',
    icon: 'eye' as IconName,
  },
  {
    category: '長文件',
    eyebrow: '長上下文',
    title: 'Long Context Reasoning',
    description: '在 10,000 到 100,000 tokens 的長文件中找線索、思考並整理出答案。',
    metric: '任務分數',
    color: 'teal',
    icon: 'layers' as IconName,
  },
  {
    category: 'Agent 任務',
    eyebrow: '使用工具',
    title: 'Terminal-Bench',
    description: '讓 AI 在終端機環境處理軟體工程、系統管理、資料處理等真實工作。',
    metric: '任務完成率',
    color: 'yellow',
    icon: 'tool' as IconName,
  },
  {
    category: 'Agent 任務',
    eyebrow: '職業工作',
    title: 'GDPval-AA',
    description: '涵蓋 44 種職業、9 大產業的實際工作任務，透過盲測比較產生 Elo 評分。',
    metric: 'Elo 評分',
    color: 'navy',
    icon: 'target' as IconName,
  },
  {
    category: '知識與推理',
    eyebrow: '可靠性',
    title: 'AA-Omniscience',
    description: '檢查模型能否正確回憶事實，也觀察它在不知道時會不會自信地胡說。',
    metric: '正確／幻覺',
    color: 'red',
    icon: 'check' as IconName,
  },
  {
    category: '知識與推理',
    eyebrow: '精準遵循',
    title: 'IFBench',
    description: '用 58 種可驗證的限制，測試 AI 是否真的照指定格式與條件完成回答。',
    metric: '通過率（%）',
    color: 'indigo',
    icon: 'check' as IconName,
  },
]

const scoreRows = [
  {
    type: 'Accuracy',
    zh: '答對率',
    description: '固定答案的題目中，答對題數 ÷ 題目總數。',
    example: '80 / 100 題 = 80%',
    icon: 'target' as IconName,
    color: 'blue',
  },
  {
    type: 'Pass rate',
    zh: '通過率',
    description: '常用於程式題或多步驟任務：結果通過測試，才算完成。',
    example: '7 個任務通過 5 個 = 71%',
    icon: 'code' as IconName,
    color: 'green',
  },
  {
    type: 'Elo',
    zh: '相對評分',
    description: '兩個答案讓評審盲選，再依勝負更新分數；像棋類排名，重點是相對強弱。',
    example: '不是百分比，不能當成答對率',
    icon: 'layers' as IconName,
    color: 'purple',
  },
  {
    type: 'Judge',
    zh: '評審評分',
    description: '由人類或另一個 AI 依規準檢查答案的品質、完整度與是否符合要求。',
    example: '先確認評分規準，再看結果',
    icon: 'eye' as IconName,
    color: 'orange',
  },
]

function App() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const visibleBenchmarks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return benchmarks.filter((benchmark) => {
      const matchesCategory = activeCategory === '全部' || benchmark.category === activeCategory
      const searchable = `${benchmark.title} ${benchmark.description} ${benchmark.eyebrow}`.toLowerCase()
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [activeCategory, query])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" onClick={() => scrollTo('top')}>
          <span className="brand-mark"><Icon name="spark" size={18} /></span>
          <span>AI benchmark <em>入門 Wiki</em></span>
        </a>
        <button className="menu-toggle" aria-label={menuOpen ? '關閉選單' : '開啟選單'} onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主要導覽">
          <button onClick={() => scrollTo('what')}>先懂概念</button>
          <button onClick={() => scrollTo('types')}>Benchmark 類型</button>
          <button onClick={() => scrollTo('scores')}>看懂分數</button>
          <button onClick={() => scrollTo('method')}>怎麼測試</button>
          <a className="nav-source" href="https://artificialanalysis.ai/evaluations" target="_blank" rel="noreferrer">
            原始資料 <Icon name="external" size={15} />
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy">
            <div className="kicker"><span className="kicker-dot" />給高中生的 AI 世界導覽</div>
            <h1>AI 也要考試。<br /><span>但分數怎麼看？</span></h1>
            <p className="hero-lead">Benchmark 就像 AI 的考卷：用一組大家事先準備好的題目，公平比較不同模型會什麼、哪裡還不會。</p>
            <div className="hero-actions">
              <button className="button button-dark" onClick={() => scrollTo('what')}>從第一課開始 <Icon name="arrow" size={17} /></button>
              <span className="read-time"><Icon name="book" size={16} /> 6 分鐘讀懂</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Benchmark 將能力轉換成可比較的分數">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="score-card">
              <div className="score-card-top"><span>MODEL / A</span><span className="live-dot">● LIVE</span></div>
              <div className="score-number">82<span>.4</span></div>
              <div className="score-label">overall index</div>
              <div className="mini-bars">
                <span style={{ '--bar': '89%' } as React.CSSProperties}><i>推理</i></span>
                <span style={{ '--bar': '76%' } as React.CSSProperties}><i>程式</i></span>
                <span style={{ '--bar': '68%' } as React.CSSProperties}><i>知識</i></span>
              </div>
              <div className="score-card-bottom"><span>updated today</span><strong>↑ 4.2%</strong></div>
            </div>
            <div className="floating-note note-top"><Icon name="check" size={14} /> 不是越大越好？</div>
            <div className="floating-note note-bottom"><span className="tiny-graph">↗</span> 先看測什麼</div>
            <div className="visual-caption">把抽象的「聰明」<br />拆成可觀察的能力</div>
          </div>
        </section>

        <div className="marquee-strip" aria-hidden="true">
          <span>測試不是魔法，是設計好的問題</span><b>✳</b><span>分數不是全部，方法才是線索</span><b>✳</b><span>同一把尺，才有公平比較</span><b>✳</b>
        </div>

        <section className="section-wrap intro-section" id="what">
          <div className="section-heading">
            <div>
              <span className="section-label">01 / 先懂概念</span>
              <h2>Benchmark 到底是什麼？</h2>
            </div>
            <p>先把它想成一場有規則的考試。<br />只是考生換成了 AI。</p>
          </div>
          <div className="definition-grid">
            <article className="definition-card definition-main">
              <div className="number-tag">A</div>
              <div>
                <h3>一組標準化的題目與規則</h3>
                <p>Benchmark（基準測試）會先準備好題目、正確答案或評分規準，再讓不同 AI 在相同條件下作答。這樣我們比較的是能力，而不是「這次題目剛好比較簡單」。</p>
                <div className="analogy"><span>學生</span><Icon name="arrow" size={16} /><strong>考卷</strong><Icon name="arrow" size={16} /><span>成績</span></div>
                <div className="analogy ai-analogy"><span>AI 模型</span><Icon name="arrow" size={16} /><strong>Benchmark</strong><Icon name="arrow" size={16} /><span>分數</span></div>
              </div>
            </article>
            <article className="definition-card definition-side">
              <div className="icon-disc orange-disc"><Icon name="target" /></div>
              <h3>它測的不是「智商」</h3>
              <p>AI 沒有一個單一的聰明分數。它可能數學很強，卻不會讀圖；會寫程式，卻不遵守格式。</p>
              <a href="#types" onClick={(event) => { event.preventDefault(); scrollTo('types') }}>看看不同考科 <Icon name="arrow" size={15} /></a>
            </article>
            <article className="definition-card definition-side dark-card">
              <div className="icon-disc dark-disc"><Icon name="spark" /></div>
              <h3>所以要看「它考什麼」</h3>
              <p>一個高分只代表在那一種題目、那一種規則下表現好，不能直接代表所有事情都做得好。</p>
              <span className="card-footnote">Different test. Different story.</span>
            </article>
          </div>
        </section>

        <section className="section-wrap types-section" id="types">
          <div className="section-heading">
            <div>
              <span className="section-label">02 / Benchmark 類型</span>
              <h2>AI 的考科，比你想的更多</h2>
            </div>
            <p>每一張卡都是一種「能力切片」。<br />搜尋或選分類，開始探索。</p>
          </div>
          <div className="benchmark-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Benchmark 類型篩選">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => setActiveCategory(category)}
                  role="tab"
                  aria-selected={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
            <label className="search-box">
              <Icon name="search" size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋測試名稱…" aria-label="搜尋測試名稱" />
              {query && <button aria-label="清除搜尋" onClick={() => setQuery('')}><Icon name="close" size={15} /></button>}
            </label>
          </div>
          <div className="benchmark-grid">
            {visibleBenchmarks.map((benchmark, index) => (
              <article className={`benchmark-card ${benchmark.color}`} key={benchmark.title}>
                <div className="benchmark-card-head">
                  <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="card-icon"><Icon name={benchmark.icon} size={18} /></span>
                </div>
                <span className="card-eyebrow">{benchmark.eyebrow}</span>
                <h3>{benchmark.title}</h3>
                <p>{benchmark.description}</p>
                <div className="card-metric"><span>主要看</span><strong>{benchmark.metric}</strong><Icon name="arrow" size={15} /></div>
              </article>
            ))}
          </div>
          {visibleBenchmarks.length === 0 && (
            <div className="empty-state"><Icon name="search" size={24} /><strong>找不到這個 benchmark</strong><span>試試看「程式」、「知識」或清除搜尋。</span></div>
          )}
          <p className="source-note"><span>↳</span> 以上為 Artificial Analysis 評測頁中的代表性例子；名稱與內容會隨版本更新。<a href="https://artificialanalysis.ai/evaluations" target="_blank" rel="noreferrer">查看完整清單 <Icon name="external" size={13} /></a></p>
        </section>

        <section className="section-wrap score-section" id="scores">
          <div className="section-heading">
            <div>
              <span className="section-label">03 / 看懂分數</span>
              <h2>分數不是只有 0 到 100</h2>
            </div>
            <p>不同 benchmark 使用不同尺。<br />先認識單位，再解讀高低。</p>
          </div>
          <div className="score-intro">
            <div className="score-intro-copy">
              <div className="quote-mark">“</div>
              <h3>看到 82 分，<br /><em>先別急著說它很強。</em></h3>
              <p>你要先問三件事：考的是什麼？分數怎麼算？有沒有跟相同條件的模型比較？</p>
              <div className="ask-list">
                <div><span>01</span><strong>考科</strong><small>它在測哪項能力？</small></div>
                <div><span>02</span><strong>尺</strong><small>百分比、Elo 還是評審分？</small></div>
                <div><span>03</span><strong>條件</strong><small>有沒有用工具或看過題目？</small></div>
              </div>
            </div>
            <div className="score-table-wrap">
              <div className="table-head"><span>常見指標</span><span>怎麼算／怎麼讀</span></div>
              {scoreRows.map((row) => (
                <div className="score-row" key={row.type}>
                  <div className={`score-row-icon ${row.color}`}><Icon name={row.icon} size={18} /></div>
                  <div className="score-row-title"><strong>{row.type}</strong><span>{row.zh}</span></div>
                  <p>{row.description}</p>
                  <span className="score-example">{row.example}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="warning-box">
            <div className="warning-symbol">!</div>
            <div><strong>重要提醒：不要把不同 benchmark 的分數直接相加或排名。</strong><p>就像數學 90 分和體育 90 分，不一定代表同一件事。要比較模型，盡量看同一測試、同一版本、同一工具設定。</p></div>
            <Icon name="arrow" size={20} />
          </div>
        </section>

        <section className="method-section" id="method">
          <div className="section-wrap">
            <div className="section-heading method-heading">
              <div>
                <span className="section-label light-label">04 / 怎麼測試</span>
                <h2>一場 AI 考試的四個步驟</h2>
              </div>
              <p>從出題到公布分數，<br />每一步都會影響結果。</p>
            </div>
            <div className="steps">
              <article className="step-card">
                <span className="step-number">01</span><div className="step-icon"><Icon name="flask" /></div>
                <h3>設計題目</h3><p>準備問題、答案或評分規準，並決定要測哪一項能力。</p><span className="step-note">題目要能代表真實能力</span>
              </article>
              <article className="step-card">
                <span className="step-number">02</span><div className="step-icon"><Icon name="tool" /></div>
                <h3>設定考場</h3><p>決定 AI 能不能上網、使用計算機、執行程式或呼叫其他工具。</p><span className="step-note">條件不同，結果就不同</span>
              </article>
              <article className="step-card">
                <span className="step-number">03</span><div className="step-icon"><Icon name="code" /></div>
                <h3>執行測驗</h3><p>讓模型回答題目；程式或 agent 任務還要真的執行並檢查最後狀態。</p><span className="step-note">不能只看它說得像不像</span>
              </article>
              <article className="step-card">
                <span className="step-number">04</span><div className="step-icon"><Icon name="target" /></div>
                <h3>計算與比較</h3><p>按照規則算出分數，和其他模型在相同設定下比較，才有意義。</p><span className="step-note">讀懂方法，才讀懂排名</span>
              </article>
            </div>
            <div className="method-bottom">
              <div className="dataset-card">
                <div className="dataset-top"><span className="pill pill-orange">關鍵名詞</span><span>DATASET</span></div>
                <h3>那「測試集」又是什麼？</h3>
                <p>測試集（test set）就是考試時真正拿來出題的那一批資料。它最好是 AI 之前沒看過的題目，才能測出「遇到新問題時」的能力。</p>
                <div className="dataset-rule"><Icon name="check" size={16} /><span>看過考古題 ≠ 真的學會</span></div>
              </div>
              <div className="split-card">
                <div><span className="split-label">TRAINING SET</span><strong>練習題</strong><small>用來學習規則</small></div>
                <div className="split-arrow"><Icon name="arrow" size={18} /></div>
                <div><span className="split-label orange-text">TEST SET</span><strong>正式考題</strong><small>用來檢驗能力</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap takeaway-section">
          <div className="takeaway-copy">
            <span className="section-label">最後一頁 / 帶走這些</span>
            <h2>會看分數，<br /><span>比背排名更重要。</span></h2>
            <p>下一次你看到 AI 排行榜，可以用這張小抄檢查一下：這個數字，究竟在告訴你什麼？</p>
          </div>
          <div className="checklist-card">
            <div className="checklist-head"><span>QUICK CHECKLIST</span><Icon name="spark" size={19} /></div>
            <div className="check-item"><span>01</span><Icon name="check" size={16} /><strong>先看測試什麼</strong><small>考科比排名更先</small></div>
            <div className="check-item"><span>02</span><Icon name="check" size={16} /><strong>再看分數怎麼算</strong><small>不同單位不能硬比</small></div>
            <div className="check-item"><span>03</span><Icon name="check" size={16} /><strong>最後看測試條件</strong><small>工具、版本、資料都重要</small></div>
            <div className="checklist-foot">Curiosity is a good benchmark. <span>↗</span></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <div className="footer-brand"><span className="brand-mark"><Icon name="spark" size={17} /></span><span>AI benchmark <em>入門 Wiki</em></span></div>
          <p>把 AI 的「聰明」拆開來看，才知道它真正會什麼。</p>
          <div className="footer-links"><a href="https://artificialanalysis.ai/evaluations" target="_blank" rel="noreferrer">資料來源 Artificial Analysis <Icon name="external" size={13} /></a><span>教育用途整理・2026</span></div>
        </div>
      </footer>
    </div>
  )
}

export default App
