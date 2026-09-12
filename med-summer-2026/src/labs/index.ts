import {
  articleBySlug,
  copyText,
  glowCircle,
  hitCircle,
  hitRect,
  label,
  paintLab,
  pointerOnCanvas,
  setNote,
  type LabState,
  type Point,
} from "./engine";

type LabApi = {
  draw: (ctx: CanvasRenderingContext2D, state: LabState, t: number) => void;
  hit: (p: Point, state: LabState) => string | null;
  down?: (id: string, p: Point, state: LabState) => void;
  move?: (p: Point, state: LabState) => void;
  up?: (p: Point, state: LabState) => void;
};

function active(state: LabState, id: string): boolean {
  return state.selected === id || state.hover === id;
}

function labs(): Record<string, LabApi> {
  return {
    "mrna-cell": {
      draw(ctx, state, t) {
        const delivered = state.flags.delivered === 1;
        const cx = 520;
        const cy = 270;
        ctx.strokeStyle = "#e8e8e8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 250, 190, 0, 0, Math.PI * 2);
        ctx.stroke();
        glowCircle(ctx, cx - 40, cy, 62, active(state, "nucleus"));
        ctx.beginPath();
        ctx.arc(cx - 40, cy, 18, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        label(ctx, "nucleus", cx - 70, cy + 86, active(state, "nucleus"));

        glowCircle(ctx, cx + 110, cy + 30, 28, active(state, "ribosome"));
        label(ctx, "ribosome", cx + 86, cy + 74, active(state, "ribosome"));

        const slip = state.drag?.id === "mrna"
          ? { x: state.drag.x, y: state.drag.y }
          : delivered
            ? { x: cx + 40, y: cy + 20 }
            : { x: 120, y: 160 };
        ctx.save();
        ctx.translate(slip.x, slip.y);
        ctx.rotate(-0.25);
        ctx.fillStyle = active(state, "mrna") ? "#fff" : "#cfcfcf";
        ctx.fillRect(-46, -10, 92, 20);
        ctx.restore();
        label(ctx, "mRNA", slip.x - 20, slip.y + 28, active(state, "mrna"));

        if (delivered) {
          const pulse = 10 + Math.sin(t / 300) * 3;
          glowCircle(ctx, cx + 170, cy - 70, 22 + pulse / 8, active(state, "ha"));
          label(ctx, "HA hat", cx + 150, cy - 36, active(state, "ha"));
        }
        label(ctx, "cytoplasm", cx + 150, cy + 150);
      },
      hit(p, state) {
        if (hitCircle(p, { x: 480, y: 270 }, 62)) return "nucleus";
        if (hitCircle(p, { x: 630, y: 300 }, 32)) return "ribosome";
        if (state.flags.delivered === 1 && hitCircle(p, { x: 690, y: 200 }, 36)) return "ha";
        const slip = state.drag?.id === "mrna"
          ? { x: state.drag.x, y: state.drag.y }
          : state.flags.delivered === 1
            ? { x: 560, y: 290 }
            : { x: 120, y: 160 };
        if (hitCircle(p, slip, 40)) return "mrna";
        return null;
      },
      down(id, p, state) {
        if (id === "mrna" && state.flags.delivered !== 1) state.drag = { id, x: p.x, y: p.y };
      },
      move(p, state) {
        if (state.drag?.id === "mrna") {
          state.drag.x = p.x;
          state.drag.y = p.y;
        }
      },
      up(p, state) {
        if (state.drag?.id === "mrna" && hitCircle(p, { x: 560, y: 300 }, 160)) {
          state.flags.delivered = 1;
          state.selected = "ha";
        }
        state.drag = null;
      },
    },
    fingerprint: {
      draw(ctx, state, t) {
        const dots = [
          { id: "m1", x: 220, y: 180 },
          { id: "m2", x: 280, y: 250 },
          { id: "m3", x: 190, y: 290 },
        ];
        glowCircle(ctx, 230, 240, 110, active(state, "tumor"));
        label(ctx, "tumor", 205, 370, active(state, "tumor"));
        dots.forEach((dot, i) => {
          const on = state.flags[dot.id] === 1;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y + Math.sin(t / 400 + i) * 2, 7, 0, Math.PI * 2);
          ctx.fillStyle = on ? "#fff" : "#888";
          ctx.fill();
        });
        ctx.strokeStyle = active(state, "print") ? "#fff" : "#777";
        ctx.strokeRect(500, 160, 130, 90);
        label(ctx, "printer", 530, 270, active(state, "print"));
        const posters = state.flags.printed ?? 0;
        glowCircle(ctx, 760, 280, 46, active(state, "tcell"));
        label(ctx, "T cell", 738, 346, active(state, "tcell"));
        if (posters) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(736, 250, 28, 36);
        }
      },
      hit(p) {
        if (hitCircle(p, { x: 230, y: 240 }, 110)) return "tumor";
        if (hitRect(p, 500, 160, 130, 90)) return "print";
        if (hitCircle(p, { x: 760, y: 280 }, 46)) return "tcell";
        return null;
      },
      down(id, _p, state) {
        if (id === "tumor") {
          state.flags.m1 = 1;
          state.flags.m2 = 1;
          state.flags.m3 = 1;
        }
        if (id === "print" && state.flags.m1 === 1) state.flags.printed = 1;
      },
    },
    "lock-key": {
      draw(ctx, state) {
        ctx.strokeStyle = active(state, "lock") ? "#fff" : "#888";
        ctx.lineWidth = 3;
        ctx.strokeRect(400, 180, 150, 190);
        ctx.beginPath();
        ctx.arc(475, 230, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(460, 250, 30, 70);
        label(ctx, "ACE2", 448, 400, active(state, "lock"));

        const oldP = state.drag?.id === "oldkey" ? state.drag : { x: 160, y: 240 };
        const newP = state.drag?.id === "newkey" ? state.drag : { x: 780, y: 240 };
        drawKey(ctx, oldP.x, oldP.y, false, active(state, "oldkey"));
        drawKey(ctx, newP.x, newP.y, true, active(state, "newkey"));
        label(ctx, "old spike", oldP.x - 30, oldP.y + 50, active(state, "oldkey"));
        label(ctx, "XFG", newP.x - 10, newP.y + 50, active(state, "newkey"));
        if (state.flags.fit === 1) {
          ctx.fillStyle = "#fff";
          ctx.font = "16px Geist, sans-serif";
          ctx.fillText("fit", 458, 160);
        }
      },
      hit(p, state) {
        const oldP = state.drag?.id === "oldkey" ? state.drag : { x: 160, y: 240 };
        const newP = state.drag?.id === "newkey" ? state.drag : { x: 780, y: 240 };
        if (hitCircle(p, oldP, 40)) return "oldkey";
        if (hitCircle(p, newP, 40)) return "newkey";
        if (hitRect(p, 400, 180, 150, 190)) return "lock";
        return null;
      },
      down(id, p, state) {
        if (id === "oldkey" || id === "newkey") state.drag = { id, x: p.x, y: p.y };
      },
      move(p, state) {
        if (state.drag) {
          state.drag.x = p.x;
          state.drag.y = p.y;
        }
      },
      up(p, state) {
        if (state.drag?.id === "newkey" && hitRect(p, 400, 180, 150, 190)) {
          state.flags.fit = 1;
          state.selected = "lock";
        }
        if (state.drag?.id === "oldkey" && hitRect(p, 400, 180, 150, 190)) {
          state.flags.fit = 0;
        }
        state.drag = null;
      },
    },
    "crispr-switch": {
      draw(ctx, state) {
        ctx.strokeStyle = "#666";
        ctx.strokeRect(180, 140, 220, 80);
        label(ctx, "BCL11A", 240, 130, active(state, "bcl11a"));
        const cut = state.flags.cut === 1;
        ctx.fillStyle = cut ? "#444" : "#fff";
        ctx.fillRect(cut ? 200 : 320, 155, 50, 50);
        glowCircle(ctx, 620, 180, 34, active(state, "scissors"));
        ctx.beginPath();
        ctx.moveTo(600, 168);
        ctx.lineTo(640, 192);
        ctx.moveTo(640, 168);
        ctx.lineTo(600, 192);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        label(ctx, "CRISPR", 592, 230, active(state, "scissors"));
        const round = cut;
        ctx.beginPath();
        if (round) ctx.arc(400, 380, 46, 0, Math.PI * 2);
        else {
          ctx.ellipse(400, 380, 54, 22, 0.7, 0, Math.PI * 2);
        }
        ctx.strokeStyle = active(state, "cell") ? "#fff" : "#aaa";
        ctx.lineWidth = 2;
        ctx.stroke();
        label(ctx, round ? "round RBC" : "sickle RBC", 350, 450, active(state, "cell"));
      },
      hit(p) {
        if (hitRect(p, 180, 140, 220, 80)) return "bcl11a";
        if (hitCircle(p, { x: 620, y: 180 }, 40)) return "scissors";
        if (hitCircle(p, { x: 400, y: 380 }, 60)) return "cell";
        return null;
      },
      down(id, _p, state) {
        if (id === "scissors" || id === "bcl11a") state.flags.cut = 1;
      },
    },
    "dengue-faces": {
      draw(ctx, state) {
        const faces = [
          { id: "d1", x: 180, y: 200, n: "1" },
          { id: "d2", x: 320, y: 200, n: "2" },
          { id: "d3", x: 180, y: 340, n: "3" },
          { id: "d4", x: 320, y: 340, n: "4" },
        ];
        faces.forEach((face) => {
          const on = state.flags[face.id] === 1;
          glowCircle(ctx, face.x, face.y, 42, on || active(state, "faces"));
          label(ctx, `DENV-${face.n}`, face.x - 24, face.y + 4, on);
        });
        glowCircle(ctx, 560, 180, 36, active(state, "mosquito"));
        ctx.beginPath();
        ctx.moveTo(540, 180);
        ctx.lineTo(590, 155);
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        label(ctx, "Aedes", 538, 236, active(state, "mosquito"));
        ctx.strokeStyle = active(state, "vial") ? "#fff" : "#777";
        ctx.strokeRect(700, 200, 70, 150);
        const loaded = faces.filter((f) => state.flags[f.id] === 1).length;
        ctx.fillStyle = "#fff";
        ctx.fillRect(704, 346 - loaded * 34, 62, loaded * 34);
        label(ctx, "Qdenga", 702, 370, active(state, "vial"));
      },
      hit(p) {
        if (hitCircle(p, { x: 250, y: 270 }, 150)) return "faces";
        if (hitCircle(p, { x: 560, y: 180 }, 40)) return "mosquito";
        if (hitRect(p, 700, 200, 70, 150)) return "vial";
        return null;
      },
      down(id, p, state) {
        const map = [
          { id: "d1", x: 180, y: 200 },
          { id: "d2", x: 320, y: 200 },
          { id: "d3", x: 180, y: 340 },
          { id: "d4", x: 320, y: 340 },
        ];
        if (id === "faces") {
          const near = map.find((item) => hitCircle(p, item, 44));
          if (near) state.flags[near.id] = 1;
          else map.forEach((item) => {
            state.flags[item.id] = 1;
          });
        }
        if (id === "vial") {
          ["d1", "d2", "d3", "d4"].forEach((key) => {
            state.flags[key] = 1;
          });
        }
      },
    },
    "ras-switch": {
      draw(ctx, state) {
        ctx.strokeStyle = "#555";
        ctx.beginPath();
        ctx.moveTo(80, 220);
        ctx.bezierCurveTo(200, 160, 400, 280, 880, 200);
        ctx.stroke();
        label(ctx, "membrane", 80, 200);
        const on = state.flags.off !== 1;
        ctx.save();
        ctx.translate(380, 210);
        ctx.rotate(on ? -0.7 : 0.15);
        ctx.fillStyle = on ? "#fff" : "#666";
        ctx.fillRect(-8, -46, 16, 70);
        ctx.restore();
        glowCircle(ctx, 380, 210, 26, active(state, "ras"));
        label(ctx, "RAS", 364, 260, active(state, "ras"));
        const pill = state.drag?.id === "pill" ? state.drag : { x: 720, y: 360 };
        ctx.fillStyle = active(state, "pill") ? "#fff" : "#bbb";
        roundRect(ctx, pill.x - 28, pill.y - 12, 56, 24, 12);
        ctx.fill();
        label(ctx, "pill", pill.x - 10, pill.y + 32, active(state, "pill"));
        if (on) {
          for (let i = 0; i < 4; i += 1) {
            ctx.beginPath();
            ctx.moveTo(430 + i * 50, 180 - i * 18);
            ctx.lineTo(460 + i * 50, 150 - i * 18);
            ctx.strokeStyle = "#fff";
            ctx.stroke();
          }
          label(ctx, "GROW", 620, 120, active(state, "arrows"));
        } else {
          label(ctx, "quiet", 600, 140, true);
        }
      },
      hit(p, state) {
        const pill = state.drag?.id === "pill" ? state.drag : { x: 720, y: 360 };
        if (hitCircle(p, pill, 36)) return "pill";
        if (hitCircle(p, { x: 380, y: 210 }, 36)) return "ras";
        if (hitRect(p, 430, 80, 280, 120)) return "arrows";
        return null;
      },
      down(id, p, state) {
        if (id === "pill") state.drag = { id, x: p.x, y: p.y };
      },
      move(p, state) {
        if (state.drag) {
          state.drag.x = p.x;
          state.drag.y = p.y;
        }
      },
      up(p, state) {
        if (state.drag?.id === "pill" && hitCircle(p, { x: 380, y: 210 }, 50)) {
          state.flags.off = 1;
          state.selected = "ras";
        }
        state.drag = null;
      },
    },
    "plaque-clean": {
      draw(ctx, state) {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(120, 300);
        ctx.bezierCurveTo(220, 180, 420, 180, 520, 300);
        ctx.bezierCurveTo(420, 260, 220, 260, 120, 300);
        ctx.stroke();
        glowCircle(ctx, 300, 240, 28, active(state, "neuron"));
        label(ctx, "neuron", 276, 160, active(state, "neuron"));
        const plaques = [
          { id: "p1", x: 210, y: 250 },
          { id: "p2", x: 340, y: 270 },
          { id: "p3", x: 400, y: 220 },
        ];
        plaques.forEach((pl) => {
          if (state.flags[pl.id] === 1) return;
          ctx.beginPath();
          ctx.arc(pl.x, pl.y, 16, 0, Math.PI * 2);
          ctx.fillStyle = active(state, "plaque") ? "#fff" : "#777";
          ctx.fill();
        });
        const ab = state.drag?.id === "ab" ? state.drag : { x: 760, y: 220 };
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(ab.x, ab.y);
        ctx.lineTo(ab.x - 18, ab.y - 28);
        ctx.moveTo(ab.x, ab.y);
        ctx.lineTo(ab.x + 18, ab.y - 28);
        ctx.stroke();
        label(ctx, "antibody", ab.x - 24, ab.y + 28, active(state, "ab"));
      },
      hit(p, state) {
        const ab = state.drag?.id === "ab" ? state.drag : { x: 760, y: 220 };
        if (hitCircle(p, ab, 36)) return "ab";
        if (hitCircle(p, { x: 300, y: 240 }, 34)) return "neuron";
        if (hitCircle(p, { x: 300, y: 250 }, 120)) return "plaque";
        return null;
      },
      down(id, p, state) {
        if (id === "ab") state.drag = { id, x: p.x, y: p.y };
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
            { id: "p1", x: 210, y: 250 },
            { id: "p2", x: 340, y: 270 },
            { id: "p3", x: 400, y: 220 },
          ].forEach((pl) => {
            if (hitCircle(p, pl, 28)) state.flags[pl.id] = 1;
          });
        }
        state.drag = null;
      },
    },
    oncolytic: {
      draw(ctx, state, t) {
        const burst = state.flags.burst === 1;
        glowCircle(ctx, 360, 250, burst ? 90 + Math.sin(t / 200) * 4 : 80, active(state, "tumor"));
        label(ctx, "tumor", 338, 360, active(state, "tumor"));
        glowCircle(ctx, 720, 300, 40, active(state, "healthy"));
        label(ctx, "healthy", 694, 360, active(state, "healthy"));
        const virus = state.drag?.id === "virus" ? state.drag : burst ? { x: 360, y: 250 } : { x: 140, y: 160 };
        ctx.beginPath();
        ctx.arc(virus.x, virus.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        for (let i = 0; i < 6; i += 1) {
          const a = (i / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(virus.x + Math.cos(a) * 16, virus.y + Math.sin(a) * 16);
          ctx.lineTo(virus.x + Math.cos(a) * 26, virus.y + Math.sin(a) * 26);
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }
        label(ctx, "virus", virus.x - 16, virus.y + 40, active(state, "virus"));
        if (burst) {
          glowCircle(ctx, 560, 140, 24, true);
          label(ctx, "T cell", 542, 180, true);
        }
      },
      hit(p, state) {
        const virus = state.drag?.id === "virus" ? state.drag : { x: 140, y: 160 };
        if (hitCircle(p, virus, 30)) return "virus";
        if (hitCircle(p, { x: 360, y: 250 }, 80)) return "tumor";
        if (hitCircle(p, { x: 720, y: 300 }, 40)) return "healthy";
        return null;
      },
      down(id, p, state) {
        if (id === "virus") state.drag = { id, x: p.x, y: p.y };
      },
      move(p, state) {
        if (state.drag) {
          state.drag.x = p.x;
          state.drag.y = p.y;
        }
      },
      up(p, state) {
        if (state.drag?.id === "virus" && hitCircle(p, { x: 360, y: 250 }, 80)) {
          state.flags.burst = 1;
          state.selected = "tumor";
        }
        state.drag = null;
      },
    },
    "shingles-nerve": {
      draw(ctx, state) {
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(160, 220);
        ctx.bezierCurveTo(360, 160, 560, 300, 820, 240);
        ctx.stroke();
        label(ctx, "axon", 480, 150, active(state, "axon"));
        glowCircle(ctx, 160, 220, 50, active(state, "ganglion"));
        label(ctx, "ganglion", 130, 290, active(state, "ganglion"));
        const awake = state.flags.awake === 1;
        const blocked = state.flags.blocked === 1;
        const vx = blocked ? 280 : awake ? 620 : 160;
        const vy = blocked ? 200 : awake ? 250 : 220;
        ctx.beginPath();
        ctx.arc(vx, vy, 10, 0, Math.PI * 2);
        ctx.fillStyle = awake && !blocked ? "#fff" : "#777";
        ctx.fill();
        ctx.strokeStyle = active(state, "vaccine") ? "#fff" : "#666";
        ctx.strokeRect(430, 360, 100, 70);
        label(ctx, "LZ901", 452, 450, active(state, "vaccine"));
        if (blocked) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(360, 190, 10, 40);
          label(ctx, "block", 344, 180, true);
        }
      },
      hit(p) {
        if (hitCircle(p, { x: 160, y: 220 }, 50)) return "ganglion";
        if (hitRect(p, 360, 140, 400, 160)) return "axon";
        if (hitRect(p, 430, 360, 100, 70)) return "vaccine";
        return null;
      },
      down(id, _p, state) {
        if (id === "ganglion" || id === "axon") state.flags.awake = 1;
        if (id === "vaccine") state.flags.blocked = 1;
      },
    },
    reprogram: {
      draw(ctx, state, t) {
        const changed = state.flags.changed === 1;
        const x = 360;
        const y = 250;
        ctx.strokeStyle = "#fff";
        if (!changed) {
          for (let i = 0; i < 8; i += 1) {
            const a = (i / 8) * Math.PI * 2 + t / 2000;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a) * 90, y + Math.sin(a) * 90);
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(x + 80, y - 20, x + 180, y + 10, x + 260, y - 40);
          ctx.stroke();
          glowCircle(ctx, x, y, 34, true);
        }
        glowCircle(ctx, x, y, changed ? 34 : 22, active(state, "astro"));
        label(ctx, changed ? "neuron" : "astrocyte", x - 28, y + 120, active(state, "astro"));
        if (!changed) {
          ctx.fillStyle = active(state, "ptbp1") ? "#fff" : "#888";
          ctx.fillRect(x - 16, y - 16, 32, 32);
          label(ctx, "PTBP1", x - 22, y + 56, active(state, "ptbp1"));
        }
        const nano = state.drag?.id === "nano" ? state.drag : changed ? { x, y } : { x: 760, y: 180 };
        ctx.beginPath();
        ctx.arc(nano.x, nano.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        label(ctx, "nano", nano.x - 14, nano.y + 28, active(state, "nano"));
      },
      hit(p, state) {
        const nano = state.drag?.id === "nano" ? state.drag : { x: 760, y: 180 };
        if (hitCircle(p, nano, 24)) return "nano";
        if (hitCircle(p, { x: 360, y: 250 }, 90)) return state.flags.changed === 1 ? "astro" : "ptbp1";
        if (hitCircle(p, { x: 360, y: 250 }, 110)) return "astro";
        return null;
      },
      down(id, p, state) {
        if (id === "nano") state.drag = { id, x: p.x, y: p.y };
      },
      move(p, state) {
        if (state.drag) {
          state.drag.x = p.x;
          state.drag.y = p.y;
        }
      },
      up(p, state) {
        if (state.drag?.id === "nano" && hitCircle(p, { x: 360, y: 250 }, 90)) {
          state.flags.changed = 1;
          state.selected = "astro";
        }
        state.drag = null;
      },
    },
  };
}

function drawKey(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  modern: boolean,
  on: boolean,
): void {
  ctx.strokeStyle = on ? "#fff" : "#999";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x - 20, y, 16, 0, Math.PI * 2);
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x + 36, y);
  ctx.lineTo(x + 36, y + (modern ? 14 : 8));
  ctx.lineTo(x + 24, y + (modern ? 14 : 8));
  ctx.stroke();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function mountLab(section: HTMLElement): void {
  const canvas = section.querySelector("canvas");
  const note = section.querySelector<HTMLElement>(".lab-note");
  const kind = section.dataset.lab ?? "";
  const slug = section.dataset.slug ?? "";
  if (!canvas || !note) return;
  const article = articleBySlug(slug);
  const api = labs()[kind];
  if (!api || !article) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const state: LabState = { hover: null, selected: null, flags: {}, drag: null };

  const explain = (id: string | null) => {
    if (!id) {
      setNote(note, article.lab.hint.zh, article.lab.hint.en);
      return;
    }
    const spot = article.lab.hotspots.find((item) => item.id === id);
    if (!spot) return;
    setNote(note, copyText(spot.label), copyText(spot.body));
  };

  const loop = (t: number) => {
    paintLab(ctx, canvas.width, canvas.height);
    api.draw(ctx, state, t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  explain(null);

  canvas.addEventListener("pointerdown", (event) => {
    const p = pointerOnCanvas(canvas, event);
    const id = api.hit(p, state);
    if (id) {
      state.selected = id;
      api.down?.(id, p, state);
      explain(id);
      canvas.setPointerCapture(event.pointerId);
    }
  });
  canvas.addEventListener("pointermove", (event) => {
    const p = pointerOnCanvas(canvas, event);
    state.hover = api.hit(p, state);
    api.move?.(p, state);
    if (!state.drag && state.hover && !state.selected) explain(state.hover);
    canvas.style.cursor = state.hover || state.drag ? "pointer" : "crosshair";
  });
  canvas.addEventListener("pointerup", (event) => {
    const p = pointerOnCanvas(canvas, event);
    api.up?.(p, state);
    if (state.selected) explain(state.selected);
  });
}

