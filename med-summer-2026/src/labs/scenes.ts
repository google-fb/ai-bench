import {
  dashedCircle,
  drawArrow,
  drawVirus,
  drawY,
  dropZone,
  fillRound,
  glowCircle,
  hitCircle,
  hitRect,
  L,
  leaderLine,
  nameAt,
  organelleFill,
  wrapLabel,
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
      organelleFill(ctx, "cytoplasm", cx, cy, 270, { ry: 184 });
      organelleFill(ctx, "membrane", cx, cy, 270, { ry: 184 });
      leaderLine(ctx, 790, 420, 800, 430, "細胞膜", "membrane");
      leaderLine(ctx, 680, 340, 800, 350, "細胞質", "cytoplasm");

      organelleFill(ctx, "nucleus", cx - 70, cy - 10, 68);
      glowCircle(ctx, cx - 70, cy - 10, 68, on(state, "nucleus"));
      ctx.strokeStyle = "#888";
      ctx.beginPath();
      ctx.moveTo(cx - 88, cy - 18);
      ctx.bezierCurveTo(cx - 70, cy - 40, cx - 50, cy, cx - 52, cy + 8);
      ctx.stroke();
      ctx.strokeStyle = "#aaa";
      ctx.beginPath();
      ctx.moveTo(cx - 96, cy - 4);
      ctx.bezierCurveTo(cx - 80, cy - 28, cx - 62, cy + 10, cx - 48, cy - 6);
      ctx.bezierCurveTo(cx - 38, cy - 18, cx - 28, cy + 8, cx - 44, cy + 12);
      ctx.stroke();
      leaderLine(ctx, 430, 280, 36, 280, "細胞核（DNA 圖書館）", "nucleus (DNA library)", on(state, "nucleus"));

      organelleFill(ctx, "ribosome", cx + 90, cy + 36, 16);
      organelleFill(ctx, "ribosome", cx + 36, cy + 88, 10);
      organelleFill(ctx, "ribosome", cx + 128, cy + 78, 9);
      glowCircle(ctx, cx + 90, cy + 36, 30, on(state, "ribosome"));
      leaderLine(ctx, 670, 340, 800, 270, "核糖體工廠", "ribosome factory", on(state, "ribosome"));
      wrapLabel(ctx, "≈ 1 個細胞", "≈ 1 cell", 36, 470, 110);

      if (!delivered) dropZone(ctx, cx + 40, cy + 24, 52, t, "細胞質", "cytoplasm");

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
      if (!delivered && !state.drag) {
        leaderLine(ctx, slip.x, slip.y, 36, 200, "mRNA 便條", "mRNA slip", on(state, "mrna"));
      }

      if (delivered) {
        const beads = Math.min(6, 2 + Math.floor(((t / 280) % 8)));
        for (let i = 0; i < beads; i += 1) {
          ctx.beginPath();
          ctx.arc(cx + 118 + i * 12, cy + 8 - i * 3, 5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 ? "#fff" : "#999";
          ctx.fill();
          if (i) {
            ctx.strokeStyle = "#888";
            ctx.beginPath();
            ctx.moveTo(cx + 106 + i * 12, cy + 11 - (i - 1) * 3);
            ctx.lineTo(cx + 118 + i * 12, cy + 8 - i * 3);
            ctx.stroke();
          }
        }
        const pulse = 8 + Math.sin(t / 260) * 3;
        ctx.beginPath();
        ctx.ellipse(cx + 188, cy - 82, 22, 12 + pulse / 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 188, cy - 70);
        ctx.lineTo(cx + 188, cy - 20);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();
        glowCircle(ctx, cx + 188, cy - 78, 24 + pulse / 10, on(state, "ha"));
        drawArrow(ctx, cx + 54, cy + 12, cx + 160, cy - 58);
        leaderLine(ctx, 760, 200, 800, 120, "HA 帽子蛋白", "HA hat protein", on(state, "ha"));

        organelleFill(ctx, "lymphocyte", 150, 400, 34);
        glowCircle(ctx, 150, 400, 34, on(state, "immune"));
        leaderLine(ctx, 150, 400, 36, 430, "免疫細胞", "immune cell", on(state, "immune"));
      }
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
      organelleFill(ctx, "tumor", 230, 260, 118);
      glowCircle(ctx, 230, 260, 118, on(state, "tumor"));
      leaderLine(ctx, 200, 330, 36, 400, "腫瘤", "tumor", on(state, "tumor"));
      dots.forEach((dot, i) => {
        const lit = state.flags[dot.id] === 1;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y + Math.sin(t / 380 + i) * 2, 9, 0, Math.PI * 2);
        ctx.fillStyle = lit ? "#fff" : "#777";
        ctx.fill();
        if (lit) {
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(dot.x, 118);
          ctx.lineTo(500, 200);
          ctx.stroke();
        }
      });
      leaderLine(ctx, 210, 210, 36, 120, "錯字 1", "typo 1", state.flags.m1 === 1);
      leaderLine(ctx, 268, 268, 36, 200, "錯字 2", "typo 2", state.flags.m2 === 1);
      leaderLine(ctx, 188, 312, 36, 280, "錯字 3", "typo 3", state.flags.m3 === 1);

      ctx.fillStyle = "#141414";
      ctx.fillRect(500, 150, 140, 100);
      ctx.strokeStyle = on(state, "print") ? "#fff" : "#777";
      ctx.strokeRect(500, 150, 140, 100);
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(512, 162, 116, 54);
      if (state.flags.printed === 1) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(520, 176, 28, 8);
        ctx.fillRect(552, 176, 18, 8);
        ctx.fillRect(574, 176, 22, 8);
      }
      ctx.fillStyle = "#0f0f0f";
      ctx.fillRect(500, 252, 140, 22);
      ctx.strokeStyle = "#444";
      ctx.strokeRect(500, 252, 140, 22);
      wrapLabel(ctx, "讀序儀 → 三個錯字", "sequencer → 3 typos", 800, 200, 150);
      leaderLine(ctx, 640, 170, 800, 120, "mRNA 印表機", "mRNA printer", on(state, "print"));

      const printed = state.flags.printed === 1;
      const hunt = state.flags.hunt === 1;
      const tx = hunt ? 340 : 760;
      const poster = state.drag?.id === "poster"
        ? { x: state.drag.x, y: state.drag.y }
        : printed && state.flags.armed !== 1
          ? { x: 570, y: 330 }
          : printed
            ? { x: tx - 28, y: 248 }
            : null;
      if (poster) {
        ctx.fillStyle = on(state, "poster") ? "#fff" : "#e8e8e8";
        ctx.fillRect(poster.x - 18, poster.y - 24, 36, 48);
        ctx.fillStyle = "#111";
        ctx.fillRect(poster.x - 12, poster.y - 16, 24, 6);
        nameAt(ctx, "通緝令", "wanted poster", poster.x - 24, poster.y + 40, on(state, "poster"));
      }

      organelleFill(ctx, "lymphocyte", tx, 280, 44);
      glowCircle(ctx, tx, 280, 44, on(state, "tcell"));
      leaderLine(ctx, tx, 280, 800, 360, "T 細胞", "T cell", on(state, "tcell"));
      if (state.flags.armed === 1) {
        drawY(ctx, tx, 248, true);
      }
      if (printed && state.flags.armed !== 1 && !state.drag) {
        dropZone(ctx, 760, 280, 56, t, "T 細胞", "T cell");
      }
      if (hunt) wrapLabel(ctx, "認出癌了", "cancer spotted", 230, 96, 160, true);
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
      const printed = state.flags.printed === 1;
      const poster = state.drag?.id === "poster"
        ? state.drag
        : printed && state.flags.armed !== 1
          ? { x: 570, y: 330 }
          : null;
      if (poster && hitCircle(p, poster, 36)) return "poster";
      if (hitRect(p, 500, 150, 140, 100)) return "print";
      const tx = state.flags.hunt === 1 ? 340 : 760;
      if (hitCircle(p, { x: tx, y: 280 }, 48)) return "tcell";
      return null;
    },
    down(id, p, state) {
      if (id === "m1" || id === "m2" || id === "m3") mark(state, id);
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
      if (!state.flags.m1) return { x: 210, y: 210, kind: "tap", zh: "錯字 1", en: "typo 1" };
      if (!state.flags.m2) return { x: 268, y: 268, kind: "tap", zh: "錯字 2", en: "typo 2" };
      if (!state.flags.m3) return { x: 188, y: 312, kind: "tap", zh: "錯字 3", en: "typo 3" };
      if (!state.flags.printed) return { x: 570, y: 200, kind: "tap", zh: "印表機", en: "printer" };
      if (!state.flags.armed) {
        if (state.drag?.id === "poster") return { x: 760, y: 280, kind: "drop", zh: "T 細胞", en: "T cell" };
        return { x: 570, y: 330, kind: "drag", zh: "通緝令", en: "poster" };
      }
      if (!state.flags.hunt) return { x: 760, y: 280, kind: "tap", zh: "T 細胞出擊", en: "send T cell" };
      return null;
    },
  },

  "lock-key": {
    draw(ctx, state, t) {
      ctx.fillStyle = "#141414";
      ctx.beginPath();
      ctx.moveTo(120, 470);
      ctx.lineTo(840, 470);
      ctx.lineTo(780, 400);
      ctx.bezierCurveTo(600, 250, 360, 250, 200, 400);
      ctx.closePath();
      ctx.fill();
      for (let i = 0; i < 6; i += 1) {
        ctx.strokeStyle = "#555";
        ctx.strokeRect(160 + i * 90, 410, 70, 48);
        for (let c = 0; c < 4; c += 1) {
          ctx.beginPath();
          ctx.moveTo(175 + i * 90 + c * 12, 410);
          ctx.lineTo(175 + i * 90 + c * 12, 396);
          ctx.strokeStyle = "#aaa";
          ctx.stroke();
        }
      }
      leaderLine(ctx, 200, 430, 36, 430, "呼吸道細胞", "airway cell");

      ctx.fillStyle = "#141414";
      ctx.fillRect(410, 188, 140, 176);
      ctx.strokeStyle = on(state, "lock") ? "#fff" : "#8a8a8a";
      ctx.lineWidth = 3;
      ctx.strokeRect(410, 188, 140, 176);
      ctx.beginPath();
      ctx.arc(480, 236, 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(466, 250, 28, 64);
      for (let i = 0; i < 6; i += 1) {
        ctx.fillStyle = "#2a2a2a";
        ctx.fillRect(452 + i * 8, 268, 5, 36);
      }
      leaderLine(ctx, 480, 188, 36, 120, "ACE2 鎖（沒換）", "ACE2 lock (unchanged)", on(state, "lock"));
      wrapLabel(ctx, "這把鎖在細胞上，季節不會換", "This lock stays on the cell", 36, 80, 170);
      if (state.drag?.id === "oldkey" || state.drag?.id === "newkey") {
        dropZone(ctx, 480, 250, 70, t, "試鑰匙", "try key");
      }

      const oldP = state.drag?.id === "oldkey" ? state.drag : { x: 150, y: 250 };
      const newP = state.drag?.id === "newkey" ? state.drag : state.flags.fit === 1 ? { x: 480, y: 236 } : { x: 800, y: 250 };
      drawKey(ctx, oldP.x, oldP.y, false, on(state, "oldkey"));
      drawKey(ctx, newP.x, newP.y, true, on(state, "newkey"));
      nameAt(ctx, "舊棘蛋白鑰匙", "old spike key", oldP.x - 36, oldP.y + 52, on(state, "oldkey"));
      nameAt(ctx, "XFG 新鑰匙", "XFG key", newP.x - 18, newP.y + 52, on(state, "newkey"));
      wrapLabel(ctx, "棘蛋白＝病毒鑰匙", "Spike = viral key", 800, 120, 150);

      if (state.flags.miss === 1 && state.flags.fit !== 1) {
        ctx.fillStyle = "#fff";
        ctx.font = "16px Geist, sans-serif";
        ctx.fillText(L("齒不對，轉不開", "Wrong teeth — no fit"), 400, 170);
      }
      if (state.flags.fit === 1) {
        ctx.fillStyle = "#fff";
        ctx.font = "16px Geist, sans-serif";
        ctx.fillText(L("對上了", "It fits"), 448, 168);
        ctx.fillStyle = "#fff";
        ctx.fillRect(772, 388, 14, 44);
        ctx.fillRect(776, 376, 6, 14);
        ctx.beginPath();
        ctx.moveTo(779, 432);
        ctx.lineTo(779, 456);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        glowCircle(ctx, 780, 400, 32, on(state, "shot"));
        leaderLine(ctx, 780, 400, 800, 430, "今年的針＝練習鑰匙模型", "shot = practice key model", on(state, "shot"));
        wrapLabel(ctx, "抗體學的是齒形，不是去改鎖", "Antibodies learn teeth, not a new lock", 560, 430, 190);
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
      ctx.fillStyle = "#141414";
      ctx.fillRect(170, 150, 240, 88);
      ctx.strokeStyle = on(state, "bcl11a") ? "#fff" : "#777";
      ctx.strokeRect(170, 150, 240, 88);
      for (let i = 0; i < 12; i += 1) {
        ctx.beginPath();
        ctx.arc(186 + i * 18, 156, 3, 0, Math.PI);
        ctx.strokeStyle = "#666";
        ctx.stroke();
      }
      ctx.fillStyle = cut ? "#2a2a2a" : "#fff";
      ctx.fillRect(cut ? 188 : 330, 166, 52, 56);
      if (cut) {
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(284, 150, 12, 88);
      }
      leaderLine(ctx, 220, 150, 36, 120, "BCL11A 開關", "BCL11A switch", on(state, "bcl11a"));
      wrapLabel(
        ctx,
        cut ? "已剪開，關不了胎兒血紅素" : "正把胎兒血紅素壓住",
        cut ? "cut — fetal Hb can return" : "holding fetal Hb off",
        430,
        160,
        220,
        cut,
      );

      if (!cut) dropZone(ctx, 290, 194, 46, t, "BCL11A", "BCL11A");
      const scissors = state.drag?.id === "scissors" ? state.drag : cut ? { x: 290, y: 194 } : { x: 720, y: 190 };
      glowCircle(ctx, scissors.x, scissors.y, 34, on(state, "scissors"));
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(scissors.x - 10, scissors.y + 10, 8, 0, Math.PI * 2);
      ctx.arc(scissors.x + 10, scissors.y + 10, 8, 0, Math.PI * 2);
      ctx.moveTo(scissors.x - 6, scissors.y + 4);
      ctx.lineTo(scissors.x + 16, scissors.y - 16);
      ctx.moveTo(scissors.x + 6, scissors.y + 4);
      ctx.lineTo(scissors.x - 16, scissors.y - 16);
      ctx.stroke();
      leaderLine(ctx, scissors.x, scissors.y, 800, 200, "CRISPR 剪刀", "CRISPR scissors", on(state, "scissors"));

      const hbf = cut ? 0.86 : 0.12;
      ctx.strokeStyle = on(state, "hbf") ? "#fff" : "#666";
      ctx.strokeRect(170, 292, 240, 36);
      ctx.fillStyle = "#fff";
      ctx.fillRect(172, 294, 236 * hbf, 32);
      ctx.fillStyle = "#888";
      ctx.font = "11px Geist, sans-serif";
      ctx.fillText("0", 172, 344);
      ctx.fillText("100", 384, 344);
      leaderLine(ctx, 290, 310, 36, 360, "胎兒血紅素 HbF", "fetal hemoglobin HbF", on(state, "hbf"));

      const round = cut && state.flags.sawCell === 1;
      organelleFill(ctx, "rbc", 560, 340, 28, { sickle: true });
      organelleFill(ctx, "rbc", 680, 320, 48, { sickle: !round });
      glowCircle(ctx, 680, 320, 48, on(state, "cell"));
      wrapLabel(ctx, "對照：鐮刀", "control: sickle", 500, 400, 120);
      leaderLine(ctx, 680, 320, 800, 400, round ? "變圓的紅血球" : "鐮刀型紅血球", round ? "round red cell" : "sickle red cell", on(state, "cell"));
    },
    hit(p, state) {
      if (hitRect(p, 170, 150, 240, 88)) return "bcl11a";
      if (hitRect(p, 170, 300, 240, 44)) return "hbf";
      const scissors = state.drag?.id === "scissors" ? state.drag : state.flags.cut === 1 ? { x: 290, y: 194 } : { x: 720, y: 190 };
      if (hitCircle(p, scissors, 42)) return "scissors";
      if (hitCircle(p, { x: 680, y: 320 }, 64)) return "cell";
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
      if (!state.flags.sawCell) return { x: 680, y: 320, kind: "tap", zh: "紅血球", en: "red cell" };
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
        ctx.strokeStyle = lit ? "#fff" : "#444";
        ctx.strokeRect(face.x - 58, face.y - 58, 116, 132);
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.fillRect(face.x - 58, face.y - 58, 116, 132);
        glowCircle(ctx, face.x, face.y, 44, lit || on(state, face.id));
        drawVirus(ctx, face.x, face.y, 16, 8);
        drawFace(ctx, face.x, face.y, face.pat, lit);
        wrapLabel(ctx, `通緝 DENV-${face.n}`, `Wanted DENV-${face.n}`, face.x - 46, face.y + 52, 100, lit);
      });

      ctx.fillStyle = "#2a2a2a";
      ctx.beginPath();
      ctx.ellipse(540, 196, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(524, 196);
      ctx.lineTo(575, 168);
      ctx.moveTo(528, 190);
      ctx.quadraticCurveTo(560, 150, 590, 170);
      ctx.moveTo(528, 202);
      ctx.quadraticCurveTo(560, 240, 590, 210);
      ctx.stroke();
      glowCircle(ctx, 540, 190, 38, on(state, "mosquito"));
      leaderLine(ctx, 560, 170, 800, 120, "埃及斑蚊", "Aedes mosquito", on(state, "mosquito"));

      const loaded = faces.filter((f) => state.flags[f.id] === 1).length;
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(720, 200, 74, 160);
      ctx.fillStyle = "#444";
      ctx.fillRect(728, 188, 58, 16);
      ctx.strokeStyle = on(state, "vial") ? "#fff" : "#777";
      ctx.strokeRect(720, 200, 74, 160);
      ctx.fillStyle = "#fff";
      ctx.fillRect(724, 356 - loaded * 38, 66, loaded * 38);
      leaderLine(ctx, 757, 188, 800, 200, "Qdenga 四價", "Qdenga 4-in-1", on(state, "vial"));
      if (loaded < 4) {
        const next = faces.find((face) => state.flags[face.id] !== 1);
        if (next) dashedCircle(ctx, next.x, next.y, 50, t);
      }

      if (state.flags.sawMos === 1) {
        fillRound(ctx, 480, 420, 260, 54, 4, state.flags.ade === 1 ? "#fff" : "#2a2a2a");
        ctx.fillStyle = state.flags.ade === 1 ? "#111" : "#eee";
        ctx.font = "13px Geist, sans-serif";
        ctx.fillText(
          loaded < 4
            ? L("只認識一張臉，下一張可能更兇", "One face only can make the next worse")
            : L("四張都預習，比較不會偏心", "All four faces: less one-sided risk"),
          492,
          452,
        );
      }
    },
    hit(p, state) {
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
      if (state.flags.sawMos === 1 && hitRect(p, 480, 420, 260, 54)) return "ade";
      return null;
    },
    down(id, _p, state) {
      if (id.startsWith("d")) mark(state, id);
      if (id === "mosquito") mark(state, "sawMos");
      if (id === "ade") mark(state, "ade");
      if (id === "vial") mark(state, "loaded");
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
      if (!state.flags.ade) return { x: 610, y: 447, kind: "tap", zh: "ADE 警語", en: "ADE warning" };
      if (!state.flags.loaded) return { x: 757, y: 280, kind: "tap", zh: "疫苗瓶", en: "vial" };
      return null;
    },
  },

  "ras-switch": {
    draw(ctx, state, t) {
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(500, 250, 420, 160, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(70, 230);
      ctx.bezierCurveTo(220, 160, 420, 290, 900, 210);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(70, 244);
      ctx.bezierCurveTo(220, 174, 420, 304, 900, 224);
      ctx.stroke();
      leaderLine(ctx, 90, 220, 36, 200, "細胞膜（RAS 在內側）", "membrane (RAS inside)");

      const stuckOn = state.flags.off !== 1;
      ctx.save();
      ctx.translate(380, 220);
      ctx.rotate(stuckOn ? -0.72 : 0.18);
      ctx.fillStyle = stuckOn ? "#fff" : "#666";
      ctx.fillRect(-8, -50, 16, 78);
      ctx.restore();
      ctx.beginPath();
      ctx.arc(380, 220, 22, 0, Math.PI * 2);
      ctx.fillStyle = stuckOn ? "#fff" : "#444";
      ctx.fill();
      glowCircle(ctx, 380, 220, 28, on(state, "ras"));
      leaderLine(ctx, 380, 220, 36, 280, "RAS 開關", "RAS switch", on(state, "ras"));
      wrapLabel(ctx, stuckOn ? "卡住：常亮" : "被藥掰回安靜", stuckOn ? "jammed ON" : "forced quiet", 36, 360, 140, !stuckOn);

      organelleFill(ctx, "nucleus", 780, 160, 36);
      glowCircle(ctx, 780, 160, 36, on(state, "nucleus"));
      leaderLine(ctx, 780, 160, 800, 120, "細胞核", "nucleus", on(state, "nucleus"));

      if (stuckOn) {
        for (let i = 0; i < 5; i += 1) {
          ctx.beginPath();
          ctx.moveTo(430 + i * 48, 188 - i * 16);
          ctx.lineTo(458 + i * 48, 160 - i * 16);
          ctx.lineTo(446 + i * 48, 178 - i * 16);
          ctx.closePath();
          ctx.fillStyle = "#fff";
          ctx.fill();
        }
        wrapLabel(ctx, "生長訊號：分裂！", "growth: divide!", 500, 96, 180, on(state, "arrows"));
      } else {
        wrapLabel(ctx, "訊號停了", "signal off", 500, 96, 140, true);
      }

      const pill = state.drag?.id === "pill" ? state.drag : state.flags.off === 1 ? { x: 380, y: 220 } : { x: 720, y: 380 };
      fillRound(ctx, pill.x - 30, pill.y - 13, 30, 26, 13, "#fff");
      fillRound(ctx, pill.x, pill.y - 13, 30, 26, 13, "#888");
      if (state.flags.off !== 1) {
        if (!state.drag) leaderLine(ctx, pill.x, pill.y, 800, 400, "口服藥丸", "oral pill", on(state, "pill"));
        dropZone(ctx, 380, 220, 40, t, "RAS", "RAS");
      }
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
      if (!state.flags.sawQuiet) return { x: 780, y: 160, kind: "tap", zh: "細胞核安靜了", en: "nucleus quiet" };
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
      ctx.beginPath();
      ctx.moveTo(300, 236);
      ctx.lineTo(240, 140);
      ctx.moveTo(300, 236);
      ctx.lineTo(300, 120);
      ctx.moveTo(300, 236);
      ctx.lineTo(360, 140);
      ctx.stroke();
      organelleFill(ctx, "nucleus", 300, 236, 30);
      glowCircle(ctx, 300, 236, 30, on(state, "neuron"));
      leaderLine(ctx, 300, 236, 36, 120, "神經元", "neuron", on(state, "neuron"));

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
      wrapLabel(ctx, `細胞外斑塊還有 ${left} 塊`, `${left} extracellular plaques`, 36, 360, 170, on(state, "plaque"));
      wrapLabel(ctx, "突觸前 → 突觸後", "pre → post synapse", 540, 360, 150);

      const cleaned = left === 0;
      const spark = cleaned ? 1 : 0.25;
      ctx.strokeStyle = `rgba(255,255,255,${0.35 + spark * 0.6})`;
      ctx.lineWidth = cleaned ? 3 : 1;
      ctx.beginPath();
      ctx.moveTo(540, 300);
      ctx.lineTo(640 + Math.sin(t / 180) * 8 * spark, 250);
      ctx.stroke();
      glowCircle(ctx, 700, 240, 22, on(state, "spark"));
      leaderLine(ctx, 700, 240, 800, 120, cleaned ? "突觸：訊號清楚了" : "突觸：被灰擋住", cleaned ? "synapse: clear" : "synapse: muffled", on(state, "spark"));

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
      organelleFill(ctx, "tumor", 360, 260, 82);
      glowCircle(ctx, 360, 260, burst ? 96 + Math.sin(t / 200) * 5 : 82, on(state, "tumor"));
      leaderLine(ctx, 360, 340, 36, 400, "腫瘤", "tumor", on(state, "tumor"));
      organelleFill(ctx, "nucleus", 760, 300, 22);
      glowCircle(ctx, 760, 300, 40, on(state, "healthy"));
      leaderLine(ctx, 760, 300, 800, 400, "健康細胞（缺受體）", "healthy (no receptor)", on(state, "healthy"));
      wrapLabel(ctx, "選擇性：只在腫瘤複製", "SELECTIVE: copies in tumor", 36, 120, 180);

      const virus = state.drag?.id === "virus"
        ? state.drag
        : burst
          ? { x: 360, y: 260 }
          : { x: 140, y: 180 };
      if (!burst) drawVirus(ctx, virus.x, virus.y, 14);
      nameAt(ctx, "改造病毒", "engineered virus", virus.x - 30, virus.y + 40, on(state, "virus"));

      if (state.flags.bounce === 1 && !burst) {
        wrapLabel(ctx, "這裡不好住，彈開", "won’t stay here", 760, 210, 150, true);
      }
      if (copies) {
        for (let i = 0; i < copies; i += 1) {
          const a = (i / copies) * Math.PI * 2 + t / 700;
          drawVirus(ctx, 360 + Math.cos(a) * 40, 260 + Math.sin(a) * 28, 8, 6);
        }
      }
      if (burst) {
        organelleFill(ctx, "lymphocyte", 560, 150, 26);
        glowCircle(ctx, 560, 150, 26, on(state, "tcell"));
        leaderLine(ctx, 560, 150, 800, 120, "趕來的 T 細胞", "arriving T cell", on(state, "tcell"));
        wrapLabel(ctx, "腫瘤裂開＝警報", "burst = alarm", 36, 120, 160, true);
      } else if (!state.flags.infect) {
        if (state.flags.bounce === 1) dropZone(ctx, 360, 260, 90, t, "腫瘤", "tumor");
        else dropZone(ctx, 760, 300, 48, t, "健康細胞", "healthy");
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
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0a0a0a";
      for (let i = 1; i < 6; i += 1) {
        const p = bezierPoint(150, 230, 360, 150, 560, 310, 820, 220, i / 6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      leaderLine(ctx, 500, 200, 36, 120, "軸突（神經電線）", "axon (nerve wire)", on(state, "axon"));

      for (let i = 0; i < 5; i += 1) {
        const a = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(150 + Math.cos(a) * 18, 230 + Math.sin(a) * 18, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1a1a";
        ctx.fill();
        ctx.strokeStyle = "#888";
        ctx.stroke();
      }
      glowCircle(ctx, 150, 230, 52, on(state, "ganglion"));
      leaderLine(ctx, 150, 260, 36, 360, "神經節宿舍", "ganglion dorm", on(state, "ganglion"));

      const awake = state.flags.awake === 1;
      const blocked = state.flags.blocked === 1;
      const u = awake ? Math.min(1, (t - (state.flags.t0 || t)) / 4000) : 0;
      const path = bezierPoint(150, 230, 360, 150, 560, 310, 820, 220, blocked ? Math.min(u, 0.28) : u);
      ctx.beginPath();
      ctx.arc(path.x, path.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = awake && !blocked ? "#fff" : "#777";
      ctx.fill();
      wrapLabel(ctx, awake ? (blocked ? "被擋住了" : "水痘病毒在爬") : "zzz 裝睡", awake ? (blocked ? "blocked" : "virus walking") : "zzz asleep", Math.min(760, Math.max(160, path.x - 20)), path.y + 24, 140, on(state, "virus"));
      if (!awake) wrapLabel(ctx, "Zzz　再點一次叫醒", "Zzz — tap again to wake", 36, 200, 150, true);
      ctx.strokeStyle = "#555";
      ctx.strokeRect(780, 170, 90, 90);
      wrapLabel(ctx, "皮膚皮節", "skin dermatome", 800, 280, 120);

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
        organelleFill(ctx, "astrocyte", x, y, 96);
      } else {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x + 90, y - 24, x + 200, y + 16, x + 280, y - 46);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 40, y - 50);
        ctx.moveTo(x, y);
        ctx.lineTo(x - 20, y - 70);
        ctx.stroke();
        glowCircle(ctx, x + 280, y - 46, 10, true);
      }
      glowCircle(ctx, x, y, changed ? 36 : 24, on(state, "astro") || on(state, "neuron"));
      leaderLine(ctx, x, y, 36, 280, changed ? "轉行後的神經元" : "星狀膠細胞（後勤）", changed ? "new neuron" : "astrocyte (support)", on(state, "astro") || on(state, "neuron"));

      if (!changed) {
        ctx.strokeStyle = on(state, "ptbp1") ? "#fff" : "#888";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0.4, Math.PI * 1.6);
        ctx.stroke();
        leaderLine(ctx, x, y - 8, 36, 120, "PTBP1 剎車踏板", "PTBP1 brake pedal", on(state, "ptbp1"));
        dropZone(ctx, x, y, 50, t, "送進細胞", "into the cell");
      }

      const nano = state.drag?.id === "nano" ? state.drag : changed ? { x, y } : { x: 780, y: 190 };
      ctx.beginPath();
      ctx.arc(nano.x, nano.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nano.x, nano.y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.stroke();
      if (!changed && !state.drag) {
        leaderLine(ctx, nano.x, nano.y, 800, 200, "奈米粒子", "nanoparticle", on(state, "nano"));
      }

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
        if (state.flags.sawAstro === 1 && hitCircle(p, { x: 360, y: 270 }, 56)) return "ptbp1";
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
