import {
  dashedCircle,
  drawVirus,
  drawY,
  fillRound,
  glowCircle,
  hitCircle,
  hitRect,
  L,
  nameAt,
  type Coach,
  type LabApi,
  type LabState,
  type Point,
} from "./engine";

function on(state: LabState, id: string): boolean {
  return state.selected === id || state.hover === id;
}

function mark(state: LabState, key: string): void {
  if (!state.flags[key]) state.flags[key] = 1;
}

export const scenes: Record<string, LabApi> = {
  "mrna-cell": {
    draw(ctx, state, t) {
      const delivered = state.flags.delivered === 1;
      const cx = 560;
      const cy = 300;
      ctx.strokeStyle = "#ececec";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 270, 198, 0, 0, Math.PI * 2);
      ctx.stroke();
      nameAt(ctx, "細胞膜", "membrane", cx + 160, cy + 186);

      glowCircle(ctx, cx - 70, cy - 10, 68, on(state, "nucleus"));
      ctx.beginPath();
      ctx.arc(cx - 70, cy - 10, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#888";
      ctx.beginPath();
      ctx.moveTo(cx - 88, cy - 18);
      ctx.bezierCurveTo(cx - 70, cy - 40, cx - 50, cy, cx - 52, cy + 8);
      ctx.stroke();
      nameAt(ctx, "細胞核（DNA 圖書館）", "nucleus (DNA library)", cx - 150, cy + 82, on(state, "nucleus"));

      glowCircle(ctx, cx + 90, cy + 36, 30, on(state, "ribosome"));
      ctx.beginPath();
      ctx.arc(cx + 80, cy + 30, 12, 0, Math.PI * 2);
      ctx.arc(cx + 100, cy + 42, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#d9d9d9";
      ctx.fill();
      nameAt(ctx, "核糖體工廠", "ribosome factory", cx + 64, cy + 80, on(state, "ribosome"));

      if (!delivered) dashedCircle(ctx, cx + 40, cy + 24, 52, t);

      const slip = state.drag?.id === "mrna"
        ? { x: state.drag.x, y: state.drag.y }
        : delivered
          ? { x: cx + 40, y: cy + 20 }
          : { x: 118, y: 200 };
      ctx.save();
      ctx.translate(slip.x, slip.y);
      ctx.rotate(-0.22);
      fillRound(ctx, -50, -12, 100, 24, 4, on(state, "mrna") ? "#fff" : "#d8d8d8");
      ctx.fillStyle = "#111";
      ctx.font = "11px Geist, sans-serif";
      ctx.fillText("mRNA", -20, 5);
      ctx.restore();
      nameAt(ctx, "mRNA 便條", "mRNA slip", slip.x - 28, slip.y + 34, on(state, "mrna"));

      if (delivered) {
        const beads = Math.min(6, 2 + Math.floor(((t / 280) % 8)));
        for (let i = 0; i < beads; i += 1) {
          ctx.beginPath();
          ctx.arc(cx + 118 + i * 12, cy + 8 - i * 3, 4, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 ? "#fff" : "#999";
          ctx.fill();
        }
        const pulse = 8 + Math.sin(t / 260) * 3;
        glowCircle(ctx, cx + 188, cy - 78, 24 + pulse / 10, on(state, "ha"));
        ctx.beginPath();
        ctx.moveTo(cx + 188, cy - 54);
        ctx.lineTo(cx + 188, cy - 20);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        nameAt(ctx, "HA 帽子蛋白", "HA hat protein", cx + 154, cy - 42, on(state, "ha"));

        glowCircle(ctx, 150, 400, 34, on(state, "immune"));
        ctx.beginPath();
        ctx.arc(150, 400, 16, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        nameAt(ctx, "免疫細胞", "immune cell", 118, 450, on(state, "immune"));
      }
      nameAt(ctx, "細胞質", "cytoplasm", cx + 150, cy + 150);
    },
    hit(p, state) {
      if (hitCircle(p, { x: 490, y: 290 }, 68)) return "nucleus";
      if (hitCircle(p, { x: 650, y: 336 }, 36)) return "ribosome";
      if (state.flags.delivered === 1 && hitCircle(p, { x: 748, y: 222 }, 40)) return "ha";
      if (state.flags.delivered === 1 && hitCircle(p, { x: 150, y: 400 }, 40)) return "immune";
      const slip = state.drag?.id === "mrna"
        ? { x: state.drag.x, y: state.drag.y }
        : state.flags.delivered === 1
          ? { x: 600, y: 320 }
          : { x: 118, y: 200 };
      if (hitCircle(p, slip, 46)) return "mrna";
      return null;
    },
    down(id, p, state) {
      if (id === "mrna" && state.flags.delivered !== 1) state.drag = { id, x: p.x, y: p.y };
      if (id === "ribosome") mark(state, "sawRibo");
      if (id === "nucleus") mark(state, "sawNuc");
      if (id === "ha") mark(state, "sawHa");
      if (id === "immune") mark(state, "sawImmune");
    },
    move(p, state) {
      if (state.drag?.id === "mrna") {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "mrna" && hitCircle(p, { x: 600, y: 324 }, 170)) {
        state.flags.delivered = 1;
        state.selected = "ribosome";
      }
      state.drag = null;
    },
    done(state) {
      return {
        deliver: state.flags.delivered === 1,
        ribosome: state.flags.sawRibo === 1,
        ha: state.flags.sawHa === 1,
        nucleus: state.flags.sawNuc === 1,
        immune: state.flags.sawImmune === 1,
      };
    },
    coach(state) {
      if (state.flags.delivered !== 1) {
        if (state.drag?.id === "mrna") return { x: 600, y: 324, kind: "drop", zh: "細胞質", en: "cytoplasm" };
        return { x: 118, y: 200, kind: "drag", zh: "mRNA 便條", en: "mRNA slip" };
      }
      if (!state.flags.sawRibo) return { x: 650, y: 336, kind: "tap", zh: "核糖體", en: "ribosome" };
      if (!state.flags.sawHa) return { x: 748, y: 222, kind: "tap", zh: "HA 帽子", en: "HA hat" };
      if (!state.flags.sawNuc) return { x: 490, y: 290, kind: "tap", zh: "細胞核", en: "nucleus" };
      if (!state.flags.sawImmune) return { x: 150, y: 400, kind: "tap", zh: "免疫細胞", en: "immune cell" };
      return null;
    },
  },

  fingerprint: {
    draw(ctx, state, t) {
      const dots = [
        { id: "m1", x: 210, y: 210, n: "1" },
        { id: "m2", x: 268, y: 268, n: "2" },
        { id: "m3", x: 188, y: 312, n: "3" },
      ];
      glowCircle(ctx, 230, 260, 118, on(state, "tumor"));
      nameAt(ctx, "腫瘤", "tumor", 208, 400, on(state, "tumor"));
      dots.forEach((dot, i) => {
        const lit = state.flags[dot.id] === 1;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y + Math.sin(t / 380 + i) * 2, 9, 0, Math.PI * 2);
        ctx.fillStyle = lit ? "#fff" : "#777";
        ctx.fill();
        nameAt(ctx, `錯字 ${dot.n}`, `typo ${dot.n}`, dot.x + 14, dot.y + 4, lit);
        if (lit) {
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(520, 200);
          ctx.stroke();
        }
      });

      ctx.strokeStyle = on(state, "print") ? "#fff" : "#777";
      ctx.strokeRect(500, 150, 140, 100);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(512, 162, 116, 54);
      nameAt(ctx, "mRNA 印表機", "mRNA printer", 514, 274, on(state, "print"));

      const printed = state.flags.printed === 1;
      const poster = state.drag?.id === "poster"
        ? { x: state.drag.x, y: state.drag.y }
        : printed && state.flags.armed !== 1
          ? { x: 570, y: 200 }
          : printed
            ? { x: 760, y: 250 }
            : null;
      if (poster) {
        ctx.fillStyle = on(state, "poster") ? "#fff" : "#e8e8e8";
        ctx.fillRect(poster.x - 18, poster.y - 24, 36, 48);
        ctx.fillStyle = "#111";
        ctx.fillRect(poster.x - 12, poster.y - 16, 24, 6);
        nameAt(ctx, "通緝令", "wanted poster", poster.x - 24, poster.y + 40, on(state, "poster"));
      }

      const hunt = state.flags.hunt === 1;
      const tx = hunt ? 340 : 760;
      glowCircle(ctx, tx, 280, 44, on(state, "tcell"));
      ctx.beginPath();
      ctx.arc(tx, 280, 16, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      nameAt(ctx, "T 細胞", "T cell", tx - 22, 346, on(state, "tcell"));
      if (state.flags.armed === 1) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(tx - 10, 250, 20, 26);
      }
      if (hunt) nameAt(ctx, "認出癌了", "cancer spotted", 300, 180, true);
    },
    hit(p, state) {
      const dots = [
        { id: "m1", x: 210, y: 210 },
        { id: "m2", x: 268, y: 268 },
        { id: "m3", x: 188, y: 312 },
      ];
      const near = dots.find((dot) => hitCircle(p, dot, 22));
      if (near) return near.id;
      if (hitCircle(p, { x: 230, y: 260 }, 118)) return "tumor";
      if (hitRect(p, 500, 150, 140, 100)) return "print";
      const printed = state.flags.printed === 1;
      const poster = state.drag?.id === "poster"
        ? state.drag
        : printed && state.flags.armed !== 1
          ? { x: 570, y: 200 }
          : null;
      if (poster && hitCircle(p, poster, 34)) return "poster";
      const tx = state.flags.hunt === 1 ? 340 : 760;
      if (hitCircle(p, { x: tx, y: 280 }, 48)) return "tcell";
      return null;
    },
    down(id, p, state) {
      if (id === "m1" || id === "m2" || id === "m3") mark(state, id);
      if (id === "tumor") {
        mark(state, "m1");
        mark(state, "m2");
        mark(state, "m3");
      }
      if (id === "print" && state.flags.m1 && state.flags.m2 && state.flags.m3) mark(state, "printed");
      if (id === "poster" && state.flags.printed === 1 && state.flags.armed !== 1) {
        state.drag = { id: "poster", x: p.x, y: p.y };
      }
      if (id === "tcell" && state.flags.armed === 1) mark(state, "hunt");
    },
    move(p, state) {
      if (state.drag?.id === "poster") {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "poster" && hitCircle(p, { x: 760, y: 280 }, 56)) {
        state.flags.armed = 1;
        state.selected = "tcell";
      }
      state.drag = null;
    },
    done(state) {
      return {
        scan: !!(state.flags.m1 && state.flags.m2 && state.flags.m3),
        print: state.flags.printed === 1,
        arm: state.flags.armed === 1,
        hunt: state.flags.hunt === 1,
      };
    },
    coach(state) {
      if (!state.flags.m1) return { x: 210, y: 210, kind: "tap", zh: "突變 1", en: "typo 1" };
      if (!state.flags.m2) return { x: 268, y: 268, kind: "tap", zh: "突變 2", en: "typo 2" };
      if (!state.flags.m3) return { x: 188, y: 312, kind: "tap", zh: "突變 3", en: "typo 3" };
      if (!state.flags.printed) return { x: 570, y: 200, kind: "tap", zh: "印表機", en: "printer" };
      if (!state.flags.armed) {
        if (state.drag?.id === "poster") return { x: 760, y: 280, kind: "drop", zh: "T 細胞", en: "T cell" };
        return { x: 570, y: 200, kind: "drag", zh: "通緝令", en: "poster" };
      }
      if (!state.flags.hunt) return { x: 760, y: 280, kind: "tap", zh: "T 細胞出擊", en: "send T cell" };
      return null;
    },
  },

  "lock-key": {
    draw(ctx, state) {
      ctx.strokeStyle = "#666";
      ctx.beginPath();
      ctx.moveTo(280, 430);
      ctx.bezierCurveTo(360, 250, 600, 250, 700, 430);
      ctx.stroke();
      nameAt(ctx, "呼吸道細胞", "airway cell", 430, 450);

      ctx.strokeStyle = on(state, "lock") ? "#fff" : "#8a8a8a";
      ctx.lineWidth = 3;
      ctx.strokeRect(410, 188, 140, 176);
      ctx.beginPath();
      ctx.arc(480, 236, 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(466, 250, 28, 64);
      nameAt(ctx, "ACE2 鎖", "ACE2 lock", 444, 390, on(state, "lock"));

      const oldP = state.drag?.id === "oldkey" ? state.drag : { x: 150, y: 250 };
      const newP = state.drag?.id === "newkey" ? state.drag : state.flags.fit === 1 ? { x: 480, y: 236 } : { x: 800, y: 250 };
      drawKey(ctx, oldP.x, oldP.y, false, on(state, "oldkey"));
      drawKey(ctx, newP.x, newP.y, true, on(state, "newkey"));
      nameAt(ctx, "舊棘蛋白", "old spike", oldP.x - 28, oldP.y + 52, on(state, "oldkey"));
      nameAt(ctx, "XFG 新鑰匙", "XFG key", newP.x - 18, newP.y + 52, on(state, "newkey"));

      if (state.flags.miss === 1 && state.flags.fit !== 1) {
        ctx.fillStyle = "#fff";
        ctx.font = "16px Geist, sans-serif";
        ctx.fillText(L("齒不對，轉不開", "Wrong teeth — no fit"), 400, 170);
      }
      if (state.flags.fit === 1) {
        ctx.fillStyle = "#fff";
        ctx.font = "16px Geist, sans-serif";
        ctx.fillText(L("對上了", "It fits"), 448, 168);
        glowCircle(ctx, 780, 400, 32, on(state, "shot"));
        nameAt(ctx, "今年的針", "this year’s shot", 740, 450, on(state, "shot"));
      }
    },
    hit(p, state) {
      const oldP = state.drag?.id === "oldkey" ? state.drag : { x: 150, y: 250 };
      const newP = state.drag?.id === "newkey" ? state.drag : state.flags.fit === 1 ? { x: 480, y: 236 } : { x: 800, y: 250 };
      if (hitCircle(p, oldP, 42)) return "oldkey";
      if (hitCircle(p, newP, 42)) return "newkey";
      if (hitRect(p, 410, 188, 140, 176)) return "lock";
      if (state.flags.fit === 1 && hitCircle(p, { x: 780, y: 400 }, 36)) return "shot";
      return null;
    },
    down(id, p, state) {
      if (id === "oldkey" || id === "newkey") state.drag = { id, x: p.x, y: p.y };
      if (id === "lock") mark(state, "sawLock");
      if (id === "shot") mark(state, "sawShot");
    },
    move(p, state) {
      if (state.drag) {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "newkey" && hitRect(p, 410, 188, 140, 176)) {
        state.flags.fit = 1;
        state.selected = "lock";
      }
      if (state.drag?.id === "oldkey" && hitRect(p, 410, 188, 140, 176)) {
        state.flags.fit = 0;
        state.flags.miss = 1;
        mark(state, "triedOld");
      }
      state.drag = null;
    },
    done(state) {
      return {
        lock: state.flags.sawLock === 1,
        old: state.flags.triedOld === 1,
        neu: state.flags.fit === 1,
        shot: state.flags.sawShot === 1,
      };
    },
    coach(state) {
      if (!state.flags.sawLock) return { x: 480, y: 260, kind: "tap", zh: "ACE2 鎖", en: "ACE2 lock" };
      if (!state.flags.triedOld) {
        if (state.drag?.id === "oldkey") return { x: 480, y: 250, kind: "drop", zh: "試試舊鑰匙", en: "try old key" };
        return { x: 150, y: 250, kind: "drag", zh: "舊棘蛋白", en: "old spike" };
      }
      if (!state.flags.fit) {
        if (state.drag?.id === "newkey") return { x: 480, y: 250, kind: "drop", zh: "XFG 對鎖", en: "fit XFG" };
        return { x: 800, y: 250, kind: "drag", zh: "XFG 鑰匙", en: "XFG key" };
      }
      if (!state.flags.sawShot) return { x: 780, y: 400, kind: "tap", zh: "今年的針", en: "this year’s shot" };
      return null;
    },
  },

  "crispr-switch": {
    draw(ctx, state, t) {
      const cut = state.flags.cut === 1;
      ctx.strokeStyle = on(state, "bcl11a") ? "#fff" : "#777";
      ctx.strokeRect(170, 150, 240, 88);
      ctx.fillStyle = cut ? "#2a2a2a" : "#fff";
      ctx.fillRect(cut ? 188 : 330, 166, 52, 56);
      nameAt(ctx, "BCL11A 開關", "BCL11A switch", 220, 140, on(state, "bcl11a"));
      nameAt(ctx, cut ? "已剪開，關不了胎兒血紅素" : "正把胎兒血紅素壓住", cut ? "cut — fetal Hb can return" : "holding fetal Hb off", 170, 258);

      if (!cut) dashedCircle(ctx, 290, 194, 46, t);
      const scissors = state.drag?.id === "scissors" ? state.drag : cut ? { x: 290, y: 194 } : { x: 720, y: 190 };
      glowCircle(ctx, scissors.x, scissors.y, 34, on(state, "scissors"));
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scissors.x - 16, scissors.y - 12);
      ctx.lineTo(scissors.x + 16, scissors.y + 12);
      ctx.moveTo(scissors.x + 16, scissors.y - 12);
      ctx.lineTo(scissors.x - 16, scissors.y + 12);
      ctx.stroke();
      nameAt(ctx, "CRISPR 剪刀", "CRISPR scissors", scissors.x - 36, scissors.y + 52, on(state, "scissors"));

      const hbf = cut ? 0.86 : 0.12;
      ctx.strokeStyle = on(state, "hbf") ? "#fff" : "#666";
      ctx.strokeRect(170, 300, 240, 22);
      ctx.fillStyle = "#fff";
      ctx.fillRect(172, 302, 236 * hbf, 18);
      nameAt(ctx, "胎兒血紅素 HbF", "fetal hemoglobin HbF", 170, 344, on(state, "hbf"));

      const round = cut && state.flags.sawCell === 1;
      ctx.save();
      ctx.translate(620, 320);
      if (!round) ctx.rotate(0.55);
      ctx.strokeStyle = on(state, "cell") ? "#fff" : "#bbb";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      if (round) ctx.arc(0, 0, 48, 0, Math.PI * 2);
      else ctx.ellipse(0, 0, 58, 22, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      nameAt(ctx, round ? "變圓的紅血球" : "鐮刀型紅血球", round ? "round red cell" : "sickle red cell", 560, 400, on(state, "cell"));
    },
    hit(p, state) {
      if (hitRect(p, 170, 150, 240, 88)) return "bcl11a";
      if (hitRect(p, 170, 300, 240, 44)) return "hbf";
      const scissors = state.drag?.id === "scissors" ? state.drag : state.flags.cut === 1 ? { x: 290, y: 194 } : { x: 720, y: 190 };
      if (hitCircle(p, scissors, 42)) return "scissors";
      if (hitCircle(p, { x: 620, y: 320 }, 64)) return "cell";
      return null;
    },
    down(id, p, state) {
      if (id === "bcl11a") mark(state, "sawSwitch");
      if (id === "hbf") mark(state, "sawHbf");
      if (id === "cell") mark(state, "sawCell");
      if (id === "scissors" && state.flags.cut !== 1) state.drag = { id, x: p.x, y: p.y };
    },
    move(p, state) {
      if (state.drag) {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "scissors" && hitRect(p, 170, 150, 240, 88)) {
        state.flags.cut = 1;
        state.selected = "bcl11a";
      }
      state.drag = null;
    },
    done(state) {
      return {
        switch: state.flags.sawSwitch === 1,
        cut: state.flags.cut === 1,
        hbf: state.flags.sawHbf === 1,
        cell: state.flags.sawCell === 1,
      };
    },
    coach(state) {
      if (!state.flags.sawSwitch) return { x: 290, y: 194, kind: "tap", zh: "BCL11A", en: "BCL11A" };
      if (!state.flags.cut) {
        if (state.drag?.id === "scissors") return { x: 290, y: 194, kind: "drop", zh: "剪這個開關", en: "cut this switch" };
        return { x: 720, y: 190, kind: "drag", zh: "CRISPR", en: "CRISPR" };
      }
      if (!state.flags.sawHbf) return { x: 290, y: 311, kind: "tap", zh: "HbF 計量表", en: "HbF meter" };
      if (!state.flags.sawCell) return { x: 620, y: 320, kind: "tap", zh: "紅血球", en: "red cell" };
      return null;
    },
  },

  "dengue-faces": {
    draw(ctx, state, t) {
      const faces = [
        { id: "d1", x: 170, y: 200, n: "1", pat: 0 },
        { id: "d2", x: 320, y: 200, n: "2", pat: 1 },
        { id: "d3", x: 170, y: 350, n: "3", pat: 2 },
        { id: "d4", x: 320, y: 350, n: "4", pat: 3 },
      ];
      faces.forEach((face) => {
        const lit = state.flags[face.id] === 1;
        glowCircle(ctx, face.x, face.y, 44, lit || on(state, face.id));
        drawFace(ctx, face.x, face.y, face.pat, lit);
        nameAt(ctx, `DENV-${face.n}`, `DENV-${face.n}`, face.x - 26, face.y + 62, lit);
      });

      glowCircle(ctx, 540, 190, 38, on(state, "mosquito"));
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(518, 190);
      ctx.lineTo(568, 160);
      ctx.moveTo(518, 190);
      ctx.lineTo(568, 220);
      ctx.stroke();
      nameAt(ctx, "埃及斑蚊", "Aedes mosquito", 504, 248, on(state, "mosquito"));

      const loaded = faces.filter((f) => state.flags[f.id] === 1).length;
      ctx.strokeStyle = on(state, "vial") ? "#fff" : "#777";
      ctx.strokeRect(720, 200, 74, 160);
      ctx.fillStyle = "#fff";
      ctx.fillRect(724, 356 - loaded * 38, 66, loaded * 38);
      nameAt(ctx, "Qdenga 四價", "Qdenga 4-in-1", 704, 384, on(state, "vial"));
      if (loaded < 4) {
        const next = faces.find((face) => state.flags[face.id] !== 1);
        if (next) dashedCircle(ctx, next.x, next.y, 50, t);
      }

      if (state.flags.ade === 1) {
        fillRound(ctx, 430, 300, 260, 54, 4, "#fff");
        ctx.fillStyle = "#111";
        ctx.font = "13px Geist, sans-serif";
        ctx.fillText(
          loaded < 4
            ? L("只認識一張臉，下一張可能更兇", "One face only can make the next worse")
            : L("四張都預習，比較不會偏心", "All four faces: less one-sided risk"),
          442,
          332,
        );
      }
    },
    hit(p) {
      const faces = [
        { id: "d1", x: 170, y: 200 },
        { id: "d2", x: 320, y: 200 },
        { id: "d3", x: 170, y: 350 },
        { id: "d4", x: 320, y: 350 },
      ];
      const face = faces.find((item) => hitCircle(p, item, 48));
      if (face) return face.id;
      if (hitCircle(p, { x: 540, y: 190 }, 42)) return "mosquito";
      if (hitRect(p, 720, 200, 74, 160)) return "vial";
      if (hitRect(p, 470, 300, 210, 54)) return "ade";
      return null;
    },
    down(id, _p, state) {
      if (id.startsWith("d")) mark(state, id);
      if (id === "mosquito") {
        mark(state, "sawMos");
        mark(state, "ade");
      }
      if (id === "ade") mark(state, "ade");
      if (id === "vial") {
        ["d1", "d2", "d3", "d4"].forEach((key) => mark(state, key));
        mark(state, "loaded");
      }
    },
    done(state) {
      return {
        faces: !!(state.flags.d1 && state.flags.d2 && state.flags.d3 && state.flags.d4),
        mosquito: state.flags.sawMos === 1,
        ade: state.flags.ade === 1,
        vial: state.flags.loaded === 1,
      };
    },
    coach(state) {
      if (!state.flags.d1) return { x: 170, y: 200, kind: "tap", zh: "第一張臉", en: "face 1" };
      if (!state.flags.d2) return { x: 320, y: 200, kind: "tap", zh: "第二張臉", en: "face 2" };
      if (!state.flags.d3) return { x: 170, y: 350, kind: "tap", zh: "第三張臉", en: "face 3" };
      if (!state.flags.d4) return { x: 320, y: 350, kind: "tap", zh: "第四張臉", en: "face 4" };
      if (!state.flags.sawMos) return { x: 540, y: 190, kind: "tap", zh: "蚊子", en: "mosquito" };
      if (!state.flags.loaded) return { x: 757, y: 280, kind: "tap", zh: "疫苗瓶", en: "vial" };
      return null;
    },
  },

  "ras-switch": {
    draw(ctx, state) {
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, 230);
      ctx.bezierCurveTo(220, 160, 420, 290, 900, 210);
      ctx.stroke();
      nameAt(ctx, "細胞膜", "membrane", 80, 200);

      const stuckOn = state.flags.off !== 1;
      ctx.save();
      ctx.translate(380, 220);
      ctx.rotate(stuckOn ? -0.72 : 0.18);
      ctx.fillStyle = stuckOn ? "#fff" : "#666";
      ctx.fillRect(-8, -50, 16, 78);
      ctx.restore();
      glowCircle(ctx, 380, 220, 28, on(state, "ras"));
      nameAt(ctx, "RAS 開關", "RAS switch", 350, 270, on(state, "ras"));
      nameAt(ctx, stuckOn ? "卡住：常亮" : "被藥掰回安靜", stuckOn ? "jammed ON" : "forced quiet", 320, 292);

      glowCircle(ctx, 780, 160, 36, on(state, "nucleus"));
      nameAt(ctx, "細胞核", "nucleus", 752, 214, on(state, "nucleus"));

      if (stuckOn) {
        for (let i = 0; i < 5; i += 1) {
          ctx.beginPath();
          ctx.moveTo(430 + i * 48, 188 - i * 16);
          ctx.lineTo(458 + i * 48, 160 - i * 16);
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }
        nameAt(ctx, "生長訊號：分裂！", "growth: divide!", 560, 118, on(state, "arrows"));
      } else {
        nameAt(ctx, "訊號停了", "signal off", 560, 130, true);
      }

      const pill = state.drag?.id === "pill" ? state.drag : state.flags.off === 1 ? { x: 380, y: 220 } : { x: 720, y: 380 };
      fillRound(ctx, pill.x - 30, pill.y - 13, 60, 26, 13, on(state, "pill") ? "#fff" : "#c8c8c8");
      nameAt(ctx, "口服藥丸", "oral pill", pill.x - 24, pill.y + 36, on(state, "pill"));
      if (state.flags.off !== 1) dashedCircle(ctx, 380, 220, 40, 900);
    },
    hit(p, state) {
      const pill = state.drag?.id === "pill" ? state.drag : state.flags.off === 1 ? { x: 380, y: 220 } : { x: 720, y: 380 };
      if (hitCircle(p, pill, 36)) return "pill";
      if (hitCircle(p, { x: 380, y: 220 }, 36)) return "ras";
      if (hitRect(p, 430, 70, 300, 130)) return "arrows";
      if (hitCircle(p, { x: 780, y: 160 }, 40)) return "nucleus";
      return null;
    },
    down(id, p, state) {
      if (id === "pill" && state.flags.off !== 1) state.drag = { id, x: p.x, y: p.y };
      if (id === "ras") mark(state, "sawRas");
      if (id === "arrows") mark(state, "sawArrows");
      if (id === "nucleus") {
        mark(state, "sawNuc");
        if (state.flags.off === 1) mark(state, "sawQuiet");
      }
    },
    move(p, state) {
      if (state.drag) {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "pill" && hitCircle(p, { x: 380, y: 220 }, 52)) {
        state.flags.off = 1;
        state.selected = "ras";
      }
      state.drag = null;
    },
    done(state) {
      return {
        ras: state.flags.sawRas === 1,
        arrows: state.flags.sawArrows === 1,
        pill: state.flags.off === 1,
        quiet: state.flags.sawQuiet === 1,
      };
    },
    coach(state) {
      if (!state.flags.sawRas) return { x: 380, y: 220, kind: "tap", zh: "RAS", en: "RAS" };
      if (!state.flags.sawArrows) return { x: 560, y: 140, kind: "tap", zh: "生長箭頭", en: "growth arrows" };
      if (!state.flags.off) {
        if (state.drag?.id === "pill") return { x: 380, y: 220, kind: "drop", zh: "放到開關上", en: "onto the switch" };
        return { x: 720, y: 380, kind: "drag", zh: "藥丸", en: "pill" };
      }
      if (!state.flags.sawNuc) return { x: 780, y: 160, kind: "tap", zh: "細胞核", en: "nucleus" };
      return null;
    },
  },

  "plaque-clean": {
    draw(ctx, state, t) {
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(110, 320);
      ctx.bezierCurveTo(220, 170, 430, 170, 540, 320);
      ctx.bezierCurveTo(430, 270, 220, 270, 110, 320);
      ctx.stroke();
      glowCircle(ctx, 300, 236, 30, on(state, "neuron"));
      nameAt(ctx, "神經元", "neuron", 274, 160, on(state, "neuron"));

      const plaques = [
        { id: "p1", x: 210, y: 252 },
        { id: "p2", x: 338, y: 274 },
        { id: "p3", x: 408, y: 222 },
      ];
      plaques.forEach((pl) => {
        if (state.flags[pl.id] === 1) return;
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, 17, 0, Math.PI * 2);
        ctx.fillStyle = on(state, "plaque") || on(state, pl.id) ? "#fff" : "#7a7a7a";
        ctx.fill();
      });
      const left = plaques.filter((pl) => state.flags[pl.id] !== 1).length;
      nameAt(ctx, `斑塊還有 ${left} 塊`, `${left} plaques left`, 200, 360, on(state, "plaque"));

      const cleaned = left === 0;
      const spark = cleaned ? 1 : 0.25;
      ctx.strokeStyle = `rgba(255,255,255,${0.35 + spark * 0.6})`;
      ctx.lineWidth = cleaned ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(540, 300);
      ctx.lineTo(640 + Math.sin(t / 180) * 8 * spark, 250);
      ctx.stroke();
      glowCircle(ctx, 700, 240, 22, on(state, "spark"));
      nameAt(ctx, cleaned ? "突觸：訊號清楚了" : "突觸：被灰擋住", cleaned ? "synapse: clear" : "synapse: muffled", 620, 290, on(state, "spark"));

      const home = { x: 820, y: 210 };
      const ab = state.drag?.id === "ab" ? state.drag : home;
      drawY(ctx, ab.x, ab.y, on(state, "ab"));
      nameAt(ctx, "抗體抹布", "antibody cloth", ab.x - 28, ab.y + 36, on(state, "ab"));
      if (left) dashedCircle(ctx, plaques.find((pl) => state.flags[pl.id] !== 1)?.x ?? 210, plaques.find((pl) => state.flags[pl.id] !== 1)?.y ?? 252, 26, t);
    },
    hit(p, state) {
      const home = { x: 820, y: 210 };
      const ab = state.drag?.id === "ab" ? state.drag : home;
      if (hitCircle(p, ab, 36)) return "ab";
      if (hitCircle(p, { x: 300, y: 236 }, 34)) return "neuron";
      const plaques = [
        { id: "p1", x: 210, y: 252 },
        { id: "p2", x: 338, y: 274 },
        { id: "p3", x: 408, y: 222 },
      ];
      const pl = plaques.find((item) => state.flags[item.id] !== 1 && hitCircle(p, item, 22));
      if (pl) return "plaque";
      if (hitCircle(p, { x: 700, y: 240 }, 28)) return "spark";
      return null;
    },
    down(id, p, state) {
      if (id === "ab") state.drag = { id, x: p.x, y: p.y };
      if (id === "neuron") mark(state, "sawNeuron");
      if (id === "plaque") mark(state, "sawPlaque");
      if (id === "spark" && state.flags.p1 && state.flags.p2 && state.flags.p3) mark(state, "sawSpark");
    },
    move(p, state) {
      if (state.drag) {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "ab") {
        [
          { id: "p1", x: 210, y: 252 },
          { id: "p2", x: 338, y: 274 },
          { id: "p3", x: 408, y: 222 },
        ].forEach((pl) => {
          if (hitCircle(p, pl, 28)) {
            state.flags[pl.id] = 1;
            mark(state, "sawPlaque");
          }
        });
      }
      state.drag = null;
    },
    done(state) {
      const clean = !!(state.flags.p1 && state.flags.p2 && state.flags.p3);
      return {
        neuron: state.flags.sawNeuron === 1,
        plaque: state.flags.sawPlaque === 1,
        clean,
        spark: state.flags.sawSpark === 1 && clean,
      };
    },
    coach(state): Coach | null {
      if (!state.flags.sawNeuron) return { x: 300, y: 236, kind: "tap", zh: "神經元", en: "neuron" };
      if (!state.flags.sawPlaque) return { x: 210, y: 252, kind: "tap", zh: "斑塊", en: "plaque" };
      if (!(state.flags.p1 && state.flags.p2 && state.flags.p3)) {
        const next = [
          { id: "p1", x: 210, y: 252 },
          { id: "p2", x: 338, y: 274 },
          { id: "p3", x: 408, y: 222 },
        ].find((pl) => state.flags[pl.id] !== 1);
        if (state.drag?.id === "ab" && next) return { x: next.x, y: next.y, kind: "drop", zh: "擦這塊灰", en: "wipe this dust" };
        return { x: 820, y: 210, kind: "drag", zh: "抗體", en: "antibody" };
      }
      if (!state.flags.sawSpark) return { x: 700, y: 240, kind: "tap", zh: "突觸火花", en: "synapse spark" };
      return null;
    },
  },

  oncolytic: {
    draw(ctx, state, t) {
      const burst = state.flags.burst === 1;
      const copies = burst ? 5 : state.flags.infect === 1 ? 3 : 0;
      glowCircle(ctx, 360, 260, burst ? 96 + Math.sin(t / 200) * 5 : 82, on(state, "tumor"));
      nameAt(ctx, "腫瘤", "tumor", 336, 370, on(state, "tumor"));
      glowCircle(ctx, 760, 300, 40, on(state, "healthy"));
      nameAt(ctx, "健康細胞", "healthy cell", 724, 360, on(state, "healthy"));

      const virus = state.drag?.id === "virus"
        ? state.drag
        : burst
          ? { x: 360, y: 260 }
          : { x: 140, y: 180 };
      if (!burst) drawVirus(ctx, virus.x, virus.y, 14);
      nameAt(ctx, "改造病毒", "engineered virus", virus.x - 30, virus.y + 40, on(state, "virus"));

      if (state.flags.bounce === 1 && !burst) {
        nameAt(ctx, "這裡不好住，彈開", "won’t stay here", 700, 230, true);
      }
      if (copies) {
        for (let i = 0; i < copies; i += 1) {
          const a = (i / copies) * Math.PI * 2 + t / 700;
          drawVirus(ctx, 360 + Math.cos(a) * 40, 260 + Math.sin(a) * 28, 8, 6);
        }
      }
      if (burst) {
        glowCircle(ctx, 560, 150, 26, on(state, "tcell"));
        nameAt(ctx, "趕來的 T 細胞", "arriving T cell", 520, 196, on(state, "tcell"));
        nameAt(ctx, "腫瘤裂開＝警報", "burst = alarm", 300, 140, true);
      } else if (!state.flags.infect) {
        dashedCircle(ctx, 360, 260, 90, t);
      }
    },
    hit(p, state) {
      const virus = state.drag?.id === "virus" ? state.drag : { x: 140, y: 180 };
      if (state.flags.burst !== 1 && hitCircle(p, virus, 32)) return "virus";
      if (hitCircle(p, { x: 360, y: 260 }, 82)) return "tumor";
      if (hitCircle(p, { x: 760, y: 300 }, 42)) return "healthy";
      if (state.flags.burst === 1 && hitCircle(p, { x: 560, y: 150 }, 30)) return "tcell";
      return null;
    },
    down(id, p, state) {
      if (id === "virus" && state.flags.burst !== 1) state.drag = { id, x: p.x, y: p.y };
      if (id === "tumor") mark(state, "sawTumor");
      if (id === "healthy") mark(state, "sawHealthy");
      if (id === "tcell") mark(state, "sawT");
    },
    move(p, state) {
      if (state.drag) {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "virus" && hitCircle(p, { x: 760, y: 300 }, 48)) {
        mark(state, "bounce");
        mark(state, "sawHealthy");
      }
      if (state.drag?.id === "virus" && hitCircle(p, { x: 360, y: 260 }, 86)) {
        state.flags.infect = 1;
        state.flags.burst = 1;
        state.selected = "tumor";
      }
      state.drag = null;
    },
    done(state) {
      return {
        tumor: state.flags.sawTumor === 1,
        bounce: state.flags.bounce === 1,
        infect: state.flags.burst === 1,
        tcell: state.flags.sawT === 1,
      };
    },
    coach(state) {
      if (!state.flags.sawTumor) return { x: 360, y: 260, kind: "tap", zh: "腫瘤", en: "tumor" };
      if (!state.flags.bounce) {
        if (state.drag?.id === "virus") return { x: 760, y: 300, kind: "drop", zh: "先試試健康細胞", en: "try a healthy cell" };
        return { x: 140, y: 180, kind: "drag", zh: "病毒", en: "virus" };
      }
      if (!state.flags.burst) {
        if (state.drag?.id === "virus") return { x: 360, y: 260, kind: "drop", zh: "放進腫瘤", en: "into the tumor" };
        return { x: 140, y: 180, kind: "drag", zh: "病毒", en: "virus" };
      }
      if (!state.flags.sawT) return { x: 560, y: 150, kind: "tap", zh: "T 細胞", en: "T cell" };
      return null;
    },
  },

  "shingles-nerve": {
    draw(ctx, state, t) {
      ctx.strokeStyle = "#8a8a8a";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(150, 230);
      ctx.bezierCurveTo(360, 150, 560, 310, 820, 220);
      ctx.stroke();
      nameAt(ctx, "軸突（神經電線）", "axon (nerve wire)", 430, 140, on(state, "axon"));

      glowCircle(ctx, 150, 230, 52, on(state, "ganglion"));
      nameAt(ctx, "神經節宿舍", "ganglion dorm", 110, 304, on(state, "ganglion"));

      const awake = state.flags.awake === 1;
      const blocked = state.flags.blocked === 1;
      const u = awake ? Math.min(1, (t - (state.flags.t0 || t)) / 4000) : 0;
      const path = bezierPoint(150, 230, 360, 150, 560, 310, 820, 220, blocked ? Math.min(u, 0.28) : u);
      ctx.beginPath();
      ctx.arc(path.x, path.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = awake && !blocked ? "#fff" : "#777";
      ctx.fill();
      nameAt(ctx, awake ? (blocked ? "被擋住了" : "水痘病毒在爬") : "zzz 裝睡", awake ? (blocked ? "blocked" : "virus walking") : "zzz asleep", path.x - 20, path.y + 32, on(state, "virus"));
      if (!awake) nameAt(ctx, "Zzz", "Zzz", 132, 200, true);

      ctx.strokeStyle = on(state, "vaccine") ? "#fff" : "#666";
      ctx.strokeRect(420, 380, 110, 72);
      nameAt(ctx, "LZ901 疫苗", "LZ901 shot", 430, 472, on(state, "vaccine"));
      if (blocked) {
        drawY(ctx, 360, 200, true);
        drawY(ctx, 400, 230, true);
        nameAt(ctx, "抗體攔截", "antibody block", 330, 176, true);
      }
      if (awake && !blocked && u > 0.85) {
        for (let i = 0; i < 6; i += 1) {
          ctx.beginPath();
          ctx.arc(800 + (i % 3) * 16, 210 + Math.floor(i / 3) * 18, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        }
        nameAt(ctx, "皮膚上的疹", "skin rash", 760, 270, on(state, "skin"));
      }
    },
    hit(p, state) {
      if (hitCircle(p, { x: 150, y: 230 }, 54)) {
        if (state.flags.sawGanglion !== 1) return "ganglion";
        if (state.flags.awake !== 1) return "virus";
        return "ganglion";
      }
      if (hitRect(p, 360, 130, 420, 170)) return "axon";
      if (hitRect(p, 420, 380, 110, 72)) return "vaccine";
      if (state.flags.awake === 1 && hitCircle(p, { x: 820, y: 220 }, 50)) return "skin";
      return null;
    },
    down(id, _p, state) {
      if (id === "ganglion") mark(state, "sawGanglion");
      if (id === "virus") {
        mark(state, "sawGanglion");
        state.flags.awake = 1;
        state.flags.t0 = performance.now();
      }
      if (id === "axon") mark(state, "sawAxon");
      if (id === "vaccine") {
        state.flags.blocked = 1;
        mark(state, "vax");
      }
      if (id === "skin") mark(state, "sawSkin");
    },
    done(state) {
      return {
        ganglion: state.flags.sawGanglion === 1,
        wake: state.flags.awake === 1,
        axon: state.flags.sawAxon === 1,
        vax: state.flags.vax === 1,
      };
    },
    coach(state) {
      if (!state.flags.sawGanglion && state.flags.awake !== 1) {
        return { x: 150, y: 230, kind: "tap", zh: "神經節／病毒", en: "ganglion / virus" };
      }
      if (!state.flags.awake) return { x: 150, y: 230, kind: "tap", zh: "叫醒病毒", en: "wake the virus" };
      if (!state.flags.sawAxon) return { x: 500, y: 200, kind: "tap", zh: "軸突", en: "axon" };
      if (!state.flags.vax) return { x: 475, y: 416, kind: "tap", zh: "疫苗", en: "vaccine" };
      return null;
    },
  },

  reprogram: {
    draw(ctx, state, t) {
      const changed = state.flags.changed === 1;
      const x = 360;
      const y = 270;
      ctx.strokeStyle = "#fff";
      if (!changed) {
        for (let i = 0; i < 8; i += 1) {
          const a = (i / 8) * Math.PI * 2 + t / 2400;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(a) * 96, y + Math.sin(a) * 96);
          ctx.stroke();
        }
      } else {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + 90, y - 24, x + 200, y + 16, x + 280, y - 46);
        ctx.stroke();
        glowCircle(ctx, x + 280, y - 46, 10, true);
      }
      glowCircle(ctx, x, y, changed ? 36 : 24, on(state, "astro") || on(state, "neuron"));
      nameAt(ctx, changed ? "轉行後的神經元" : "星狀膠細胞（後勤）", changed ? "new neuron" : "astrocyte (support)", x - 40, y + 128, on(state, "astro") || on(state, "neuron"));

      if (!changed) {
        ctx.fillStyle = on(state, "ptbp1") ? "#fff" : "#888";
        ctx.fillRect(x - 18, y - 18, 36, 36);
        nameAt(ctx, "PTBP1 剎車", "PTBP1 brake", x - 28, y + 60, on(state, "ptbp1"));
        dashedCircle(ctx, x, y, 50, t);
      }

      const nano = state.drag?.id === "nano" ? state.drag : changed ? { x, y } : { x: 780, y: 190 };
      ctx.beginPath();
      ctx.arc(nano.x, nano.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      nameAt(ctx, "奈米粒子", "nanoparticle", nano.x - 24, nano.y + 30, on(state, "nano"));

      fillRound(ctx, 700, 400, 220, 44, 3, on(state, "caveat") ? "#fff" : "#2a2a2a");
      ctx.fillStyle = on(state, "caveat") ? "#111" : "#eee";
      ctx.font = "13px Geist, sans-serif";
      ctx.fillText(L("⚠ 老鼠／類器官，不是處方", "⚠ mice / organoids, not a prescription"), 712, 428);
    },
    hit(p, state) {
      const nano = state.drag?.id === "nano" ? state.drag : { x: 780, y: 190 };
      if (state.flags.changed !== 1 && hitCircle(p, nano, 26)) return "nano";
      if (hitRect(p, 700, 400, 220, 44)) return "caveat";
      if (hitCircle(p, { x: 360, y: 270 }, 110)) {
        if (state.flags.changed === 1) return "neuron";
        if (state.flags.sawAstro === 1 && hitCircle(p, { x: 360, y: 270 }, 46)) return "ptbp1";
        return "astro";
      }
      return null;
    },
    down(id, p, state) {
      if (id === "nano") state.drag = { id, x: p.x, y: p.y };
      if (id === "astro") mark(state, "sawAstro");
      if (id === "ptbp1") mark(state, "sawPtbp");
      if (id === "neuron") mark(state, "sawNeuron");
      if (id === "caveat") mark(state, "sawCaveat");
    },
    move(p, state) {
      if (state.drag) {
        state.drag.x = p.x;
        state.drag.y = p.y;
      }
    },
    up(p, state) {
      if (state.drag?.id === "nano" && hitCircle(p, { x: 360, y: 270 }, 90)) {
        state.flags.changed = 1;
        state.selected = "neuron";
      }
      state.drag = null;
    },
    done(state) {
      return {
        astro: state.flags.sawAstro === 1,
        ptbp1: state.flags.sawPtbp === 1,
        nano: state.flags.changed === 1,
        neuron: state.flags.sawNeuron === 1,
        caveat: state.flags.sawCaveat === 1,
      };
    },
    coach(state) {
      if (!state.flags.sawAstro) return { x: 360, y: 270, kind: "tap", zh: "星狀細胞", en: "astrocyte" };
      if (!state.flags.sawPtbp) return { x: 360, y: 270, kind: "tap", zh: "PTBP1", en: "PTBP1" };
      if (!state.flags.changed) {
        if (state.drag?.id === "nano") return { x: 360, y: 270, kind: "drop", zh: "送進細胞", en: "into the cell" };
        return { x: 780, y: 190, kind: "drag", zh: "奈米粒子", en: "nanoparticle" };
      }
      if (!state.flags.sawNeuron) return { x: 360, y: 270, kind: "tap", zh: "新神經元", en: "new neuron" };
      if (!state.flags.sawCaveat) return { x: 810, y: 422, kind: "tap", zh: "實驗警告", en: "lab warning" };
      return null;
    },
  },
};

function drawKey(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  modern: boolean,
  active: boolean,
): void {
  ctx.strokeStyle = active ? "#fff" : "#999";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 20, y, 16, 0, Math.PI * 2);
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x + 36, y);
  ctx.lineTo(x + 36, y + (modern ? 16 : 8));
  ctx.lineTo(x + 22, y + (modern ? 16 : 8));
  ctx.stroke();
}

function drawFace(ctx: CanvasRenderingContext2D, x: number, y: number, pat: number, lit: boolean): void {
  ctx.strokeStyle = lit ? "#fff" : "#888";
  ctx.lineWidth = 1.4;
  if (pat === 0) {
    ctx.beginPath();
    ctx.arc(x - 10, y - 6, 3, 0, Math.PI * 2);
    ctx.arc(x + 10, y - 6, 3, 0, Math.PI * 2);
    ctx.fillStyle = lit ? "#fff" : "#888";
    ctx.fill();
  } else if (pat === 1) {
    ctx.beginPath();
    ctx.moveTo(x - 14, y - 8);
    ctx.lineTo(x + 14, y + 8);
    ctx.stroke();
  } else if (pat === 2) {
    ctx.strokeRect(x - 12, y - 10, 24, 20);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
}

function bezierPoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  u: number,
): Point {
  const it = 1 - u;
  return {
    x: it ** 3 * x1 + 3 * it ** 2 * u * x2 + 3 * it * u ** 2 * x3 + u ** 3 * x4,
    y: it ** 3 * y1 + 3 * it ** 2 * u * y2 + 3 * it * u ** 2 * y3 + u ** 3 * y4,
  };
}
