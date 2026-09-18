import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import type { Block, Column, Group, Link, ModelSpec } from "../content/types.ts";
import { pick, type L, type Locale } from "../i18n.ts";
import { KIND_COLOR, PALETTE } from "./palette.ts";

const BLOCK_W = 3.0;
const BLOCK_D = 1.9;
const BLOCK_H = 0.5;
const GAP = 0.18;
const MIN_H = 0.22;
const PEDESTAL_H = 0.45;

export interface BlockView {
  modelId: string;
  block: Block;
  column: Column;
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  edges: THREE.LineSegments;
  edgeMaterial: THREE.LineBasicMaterial;
  label: CSS2DObject;
  labelButton: HTMLButtonElement;
  labelText: HTMLElement;
  size: THREE.Vector3;
  scale: number;
}

interface LocalizedLabel {
  element: HTMLElement;
  text: L;
}

interface MoeGrid {
  mesh: THREE.InstancedMesh;
  count: number;
  active: number;
  lit: Set<number>;
  target: Set<number>;
  blend: number;
  nextSwitch: number;
}

interface Particle {
  mesh: THREE.Mesh;
  curve: THREE.Curve<THREE.Vector3>;
  offset: number;
  period: number;
  /** Example tokens that ride this particle, one per loop. */
  tokens?: { zh: string[]; en: string[] };
  tokenIndex: number;
  labelEl?: HTMLElement;
  lastT: number;
}

const _tmpColor = new THREE.Color();
const _dim = new THREE.Color();
const _lit = new THREE.Color(PALETTE.expertActive);

/**
 * One exhibit: a pedestal carrying the stacked modules of a single model.
 * The returned group lives in world space at `origin`.
 */
export class Exhibit {
  readonly model: ModelSpec;
  readonly group = new THREE.Group();
  readonly blocks = new Map<string, BlockView>();
  readonly pickables: THREE.Object3D[] = [];
  readonly pedestal: THREE.Mesh;
  readonly plaque: CSS2DObject;
  readonly bounds = new THREE.Box3();
  /** Height of the tallest column above the floor (world units). */
  height = 0;
  /** Horizontal footprint of the exhibit in world units. */
  width = 0;
  private readonly labels: CSS2DObject[] = [];
  private readonly localized: LocalizedLabel[] = [];
  private readonly moeGrids: MoeGrid[] = [];
  private readonly particles: Particle[] = [];
  private readonly particleGroup = new THREE.Group();
  private labelsVisible = false;
  private locale: Locale;

  constructor(model: ModelSpec, origin: THREE.Vector3, locale: Locale, private readonly onSelect: (blockId: string) => void, onPlaque: () => void) {
    this.model = model;
    this.locale = locale;
    this.group.position.copy(origin);

    const columnTops: number[] = [];
    for (const column of model.columns) {
      const top = this.buildColumn(column);
      columnTops.push(top);
    }
    this.height = Math.max(...columnTops);

    for (const link of model.links ?? []) this.buildLink(link);

    this.group.add(this.particleGroup);

    // Pedestal sized from the block footprint (group-local coordinates).
    const local = new THREE.Box3();
    const half = new THREE.Vector3();
    for (const view of this.blocks.values()) {
      half.copy(view.size).multiplyScalar(0.5);
      local.expandByPoint(view.mesh.position.clone().sub(half));
      local.expandByPoint(view.mesh.position.clone().add(half));
    }
    const size = local.getSize(new THREE.Vector3());
    const center = local.getCenter(new THREE.Vector3());
    const pedW = Math.max(size.x + 3.2, 8);
    const pedD = Math.max(size.z + 3.4, 6.5);
    this.width = pedW;

    const pedestalGeometry = new THREE.BoxGeometry(pedW, PEDESTAL_H, pedD);
    const pedestalMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.pedestal, roughness: 0.85, metalness: 0.05 });
    this.pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    this.pedestal.position.set(center.x, PEDESTAL_H / 2, center.z);
    this.pedestal.castShadow = true;
    this.pedestal.receiveShadow = true;
    this.pedestal.userData = { modelId: model.id, pedestal: true };
    this.group.add(this.pedestal);
    this.pickables.push(this.pedestal);

    const topGeometry = new THREE.BoxGeometry(pedW - 0.3, 0.06, pedD - 0.3);
    const topMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.pedestalTop, roughness: 0.7 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.set(center.x, PEDESTAL_H + 0.03, center.z);
    top.receiveShadow = true;
    this.group.add(top);

    // Blocks were laid out from y = 0; lift them onto the pedestal.
    for (const child of this.group.children) {
      if (child !== this.pedestal && child !== top) child.position.y += PEDESTAL_H + 0.06;
    }

    // Plaque in front of the pedestal.
    const plaqueEl = document.createElement("button");
    plaqueEl.type = "button";
    plaqueEl.className = "plaque";
    plaqueEl.dataset.modelId = model.id;
    plaqueEl.addEventListener("click", (e) => {
      e.stopPropagation();
      onPlaque();
    });
    // Front-centre of the pedestal, hanging below the top edge: away from the side labels.
    this.plaque = new CSS2DObject(plaqueEl);
    this.plaque.position.set(center.x, PEDESTAL_H + 0.02, center.z + pedD / 2 + 0.05);
    this.plaque.center.set(0.5, 0);
    this.group.add(this.plaque);
    this.applyLocale(locale);

    this.group.updateMatrixWorld(true);
    this.bounds.setFromObject(this.group);
    this.setLabelsVisible(false);
  }

  get center(): THREE.Vector3 {
    return this.bounds.getCenter(new THREE.Vector3());
  }

  private renderPlaque(el: HTMLElement, locale: Locale): void {
    el.innerHTML = "";
    const year = document.createElement("span");
    year.className = "plaque-year";
    year.textContent = String(this.model.year);
    const name = document.createElement("strong");
    name.className = "plaque-name";
    name.textContent = pick(this.model.name, locale);
    const org = document.createElement("span");
    org.className = "plaque-org";
    org.textContent = pick(this.model.org, locale);
    el.append(year, name, org);
  }

  private buildColumn(column: Column): number {
    const s = column.scale ?? 1;
    const w = BLOCK_W * s;
    const d = BLOCK_D * s;
    const gap = GAP * s;
    let y = column.baseY ?? 0;
    let labelIndex = 0;
    const tops = new Map<string, { bottom: number; top: number }>();

    // Raised side columns stand on a slim post so they do not appear to float.
    if (y > 0.2) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05 * s, 0.07 * s, y, 10),
        new THREE.MeshStandardMaterial({ color: PALETTE.pedestal, roughness: 0.8 }),
      );
      post.position.set(column.x, y / 2, column.z);
      post.castShadow = true;
      this.group.add(post);
    }

    column.blocks.forEach((block) => {
      const h = Math.max(MIN_H * s, BLOCK_H * s * (block.height ?? 1));
      const view = this.buildBlock(block, column, w, h, d, s);
      view.mesh.position.set(column.x, y + h / 2, column.z);
      this.group.add(view.mesh);
      this.blocks.set(block.id, view);
      this.pickables.push(view.mesh);
      tops.set(block.id, { bottom: y, top: y + h });

      // Label anchored beside (or above) the block; alternate connector length to avoid overlaps.
      if (!block.hideLabel) {
        const side = column.labelSide;
        const stagger = labelIndex % 2 === 0 ? 0.45 : 1.3;
        labelIndex += 1;
        const anchor = new THREE.Vector3(column.x, y + h / 2, column.z);
        if (side === "left") anchor.x -= w / 2 + stagger * s;
        else if (side === "right") anchor.x += w / 2 + stagger * s;
        else anchor.y = y + h + 0.22 * s;
        view.label.position.copy(anchor);
        this.group.add(view.label);
        this.labels.push(view.label);

        if (side !== "top") {
          const from = new THREE.Vector3(column.x + (side === "left" ? -w / 2 : w / 2), y + h / 2, column.z);
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([from, anchor]),
            new THREE.LineBasicMaterial({ color: PALETTE.bracket, transparent: true, opacity: 0.55 }),
          );
          this.group.add(line);
        }
      }

      y += h + gap;
    });

    const columnTop = y - gap;

    // Column title above the stack.
    const titleEl = document.createElement("div");
    titleEl.className = `col-title${s < 1 ? " col-title-sm" : ""}`;
    const title = new CSS2DObject(titleEl);
    title.position.set(column.x, columnTop + 0.7 * s, column.z);
    this.group.add(title);
    this.labels.push(title);
    this.localized.push({ element: titleEl, text: column.title });

    // Repeat brackets.
    const groups = column.groups ?? [];
    for (const group of groups) {
      const range = this.groupRange(column, group, tops);
      if (!range) continue;
      // Outer brackets (those containing other groups) get a wider margin.
      const nesting = groups.filter((other) => other !== group && this.contains(column, group, other)).length;
      const m = (0.14 + 0.16 * nesting) * s;
      const bw = w + 2 * (0.32 + 0.3 * nesting) * s;
      const bd = d + 2 * (0.32 + 0.3 * nesting) * s;
      const bh = range.top - range.bottom + 2 * m;
      const box = new THREE.BoxGeometry(bw, bh, bd);
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(box),
        new THREE.LineBasicMaterial({ color: PALETTE.bracket, transparent: true, opacity: 0.6 }),
      );
      edges.position.set(column.x, range.bottom - m + bh / 2, column.z);
      this.group.add(edges);
      box.dispose();

      const badge = document.createElement("div");
      badge.className = "repeat-badge";
      const badgeObj = new CSS2DObject(badge);
      // Sit the badge on the bracket's bottom-front edge, like a caption on a display case.
      badgeObj.position.set(column.x, range.bottom - m, column.z + bd / 2);
      badgeObj.center.set(0.5, 1);
      this.group.add(badgeObj);
      this.labels.push(badgeObj);
      this.localized.push({
        element: badge,
        text: {
          zh: group.label ? `×${group.repeat} · ${group.label.zh}` : `×${group.repeat}`,
          en: group.label ? `×${group.repeat} · ${group.label.en}` : `×${group.repeat}`,
        },
      });
    }

    // Token flow along main columns, carrying the running example's tokens.
    if (column.main && column.blocks.length > 1) {
      const start = new THREE.Vector3(column.x, (column.baseY ?? 0) + 0.05, column.z);
      const end = new THREE.Vector3(column.x, columnTop, column.z);
      const curve = new THREE.LineCurve3(start, end);
      for (let i = 0; i < 2; i++) this.addParticle(curve, i / 2, 7, PALETTE.token, 0.1 * s, column.flowTokens, i);
    }

    return columnTop;
  }

  private groupRange(column: Column, group: Group, tops: Map<string, { bottom: number; top: number }>) {
    const a = tops.get(group.from);
    const b = tops.get(group.to);
    if (!a || !b) return null;
    return { bottom: Math.min(a.bottom, b.bottom), top: Math.max(a.top, b.top) };
  }

  private contains(column: Column, outer: Group, inner: Group): boolean {
    const idx = (id: string) => column.blocks.findIndex((b) => b.id === id);
    const [o1, o2] = [idx(outer.from), idx(outer.to)];
    const [i1, i2] = [idx(inner.from), idx(inner.to)];
    if (o1 < 0 || o2 < 0 || i1 < 0 || i2 < 0) return false;
    const strictlyLarger = o1 < i1 || o2 > i2;
    return o1 <= i1 && o2 >= i2 && strictlyLarger;
  }

  private buildBlock(block: Block, column: Column, w: number, h: number, d: number, s: number): BlockView {
    const color = KIND_COLOR[block.kind];
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.42,
      metalness: 0.04,
      transparent: true,
      opacity: 0.84,
      emissive: color,
      emissiveIntensity: 0.06,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.userData = { modelId: this.model.id, blockId: block.id };

    const edgeMaterial = new THREE.LineBasicMaterial({ color: PALETTE.edge, transparent: true, opacity: 0.5 });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
    mesh.add(edges);

    this.decorate(block, mesh, w, h, d, s);

    const anchor = document.createElement("div");
    anchor.className = `lbl-anchor side-${column.labelSide}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lbl kind-${block.kind}${s < 1 ? " lbl-sm" : ""}`;
    button.dataset.blockId = block.id;
    button.dataset.modelId = this.model.id;
    const dot = document.createElement("span");
    dot.className = "lbl-dot";
    dot.style.background = `#${color.toString(16).padStart(6, "0")}`;
    const text = document.createElement("span");
    text.className = "lbl-text";
    button.append(dot, text);
    anchor.append(button);
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onSelect(block.id);
    });
    const label = new CSS2DObject(anchor);

    const view: BlockView = {
      modelId: this.model.id,
      block,
      column,
      mesh,
      material,
      edges,
      edgeMaterial,
      label,
      labelButton: button,
      labelText: text,
      size: new THREE.Vector3(w, h, d),
      scale: s,
    };
    this.localized.push({ element: text, text: block.short ?? block.label });
    return view;
  }

  /** Small unlit geometry inside each slab that hints at what the module does. */
  private decorate(block: Block, mesh: THREE.Mesh, w: number, h: number, d: number, s: number): void {
    const base = new THREE.Color(KIND_COLOR[block.kind]);
    const light = base.clone().offsetHSL(0, -0.05, 0.22);
    const dark = base.clone().offsetHSL(0, 0.02, -0.18);
    const deco = block.deco ?? {};
    const innerW = w * 0.82;
    const innerD = d * 0.7;

    switch (block.kind) {
      case "attention": {
        const count = Math.min(deco.count ?? 8, 32);
        const barW = Math.min(0.09 * s, (innerW / count) * 0.55);
        const geo = new THREE.BoxGeometry(barW, h * 0.62, innerD * 0.5);
        const inst = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff }), count);
        const groups = deco.groups ?? 0;
        const m = new THREE.Matrix4();
        for (let i = 0; i < count; i++) {
          const x = -innerW / 2 + (i + 0.5) * (innerW / count);
          m.makeTranslation(x, 0, 0);
          inst.setMatrixAt(i, m);
          const groupIndex = groups ? Math.floor(i / (count / groups)) : 0;
          inst.setColorAt(i, groupIndex % 2 === 0 ? light : dark);
        }
        mesh.add(inst);
        break;
      }
      case "ffn":
      case "memory":
      case "moe": {
        const count = deco.count ?? 24;
        const cols = Math.min(count, block.kind === "memory" ? 8 : 12);
        const rows = Math.ceil(count / cols);
        const cell = Math.min(innerW / cols, innerD / rows) * 0.62;
        const geo = block.kind === "memory" ? new THREE.BoxGeometry(cell, h * 0.18, cell) : new THREE.BoxGeometry(cell, h * 0.5, cell);
        const inst = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff }), count);
        const m = new THREE.Matrix4();
        for (let i = 0; i < count; i++) {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const x = -innerW / 2 + (c + 0.5) * (innerW / cols);
          const z = -innerD / 2 + (r + 0.5) * (innerD / rows);
          m.makeTranslation(x, block.kind === "memory" ? -h * 0.15 : 0, z);
          inst.setMatrixAt(i, m);
          inst.setColorAt(i, block.kind === "moe" ? dark : light);
        }
        mesh.add(inst);
        if (block.kind === "moe") {
          const active = deco.active ?? 6;
          const grid: MoeGrid = { mesh: inst, count, active, lit: new Set(), target: new Set(), blend: 1, nextSwitch: 0 };
          this.pickExperts(grid);
          grid.lit = new Set(grid.target);
          this.paintExperts(grid);
          this.moeGrids.push(grid);
        }
        break;
      }
      case "embedding": {
        const count = Math.min(deco.count ?? 8, 12);
        const cube = Math.min(0.22 * s, (innerW / count) * 0.7);
        const geo = new THREE.BoxGeometry(cube, cube, cube);
        const inst = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff }), count);
        const m = new THREE.Matrix4();
        for (let i = 0; i < count; i++) {
          const x = -innerW / 2 + (i + 0.5) * (innerW / count);
          m.makeTranslation(x, 0, 0);
          inst.setMatrixAt(i, m);
          inst.setColorAt(i, base.clone().offsetHSL((i / count) * 0.08 - 0.04, 0, 0.1 + 0.12 * ((i % 3) / 2)));
        }
        mesh.add(inst);
        break;
      }
      case "position": {
        for (let k = 0; k < 2; k++) {
          const pts: THREE.Vector3[] = [];
          for (let i = 0; i <= 48; i++) {
            const t = i / 48;
            const x = -innerW / 2 + t * innerW;
            const phase = k === 0 ? 0 : Math.PI / 2;
            pts.push(new THREE.Vector3(x, Math.sin(t * Math.PI * (2 + k * 2) + phase) * h * 0.28, (k - 0.5) * innerD * 0.4));
          }
          const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: k === 0 ? light : dark }));
          mesh.add(line);
        }
        break;
      }
      case "output": {
        const count = Math.min(deco.count ?? 10, 16);
        const barW = (innerW / count) * 0.6;
        const heights = Array.from({ length: count }, (_, i) => 0.25 + 0.75 * Math.exp(-((i - count * 0.35) ** 2) / (count * 0.6)));
        const best = heights.indexOf(Math.max(...heights));
        const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(barW, 1, innerD * 0.45), new THREE.MeshBasicMaterial({ color: 0xffffff }), count);
        const m = new THREE.Matrix4();
        for (let i = 0; i < count; i++) {
          const x = -innerW / 2 + (i + 0.5) * (innerW / count);
          const bh = (heights[i] ?? 0.3) * h * 0.72;
          m.makeScale(1, bh, 1).setPosition(x, -h * 0.36 + bh / 2, 0);
          inst.setMatrixAt(i, m);
          inst.setColorAt(i, i === best ? _lit : light);
        }
        mesh.add(inst);
        break;
      }
      case "vision": {
        const n = 3;
        const cell = Math.min(innerW, innerD) / n * 0.72;
        const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(cell, h * 0.16, cell), new THREE.MeshBasicMaterial({ color: 0xffffff }), n * n);
        const m = new THREE.Matrix4();
        for (let i = 0; i < n * n; i++) {
          const c = i % n;
          const r = Math.floor(i / n);
          m.makeTranslation(-innerW / 2 + (c + 0.5) * (innerW / n), 0, -innerD / 2 + (r + 0.5) * (innerD / n));
          inst.setMatrixAt(i, m);
          inst.setColorAt(i, (c + r) % 2 === 0 ? light : dark);
        }
        mesh.add(inst);
        break;
      }
      case "spec": {
        const count = deco.count ?? 5;
        const barW = (innerW / count) * 0.55;
        const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(barW, 1, innerD * 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff }), count);
        const m = new THREE.Matrix4();
        for (let i = 0; i < count; i++) {
          const bh = h * (0.7 - i * 0.1);
          m.makeScale(1, bh, 1).setPosition(-innerW / 2 + (i + 0.5) * (innerW / count), -h * 0.36 + bh / 2, 0);
          inst.setMatrixAt(i, m);
          inst.setColorAt(i, i === 0 ? _lit : light);
        }
        mesh.add(inst);
        break;
      }
      case "residual": {
        const streams = deco.count ?? 1;
        const rod = new THREE.CylinderGeometry(0.035 * s, 0.035 * s, h * 0.9, 8);
        for (let i = 0; i < streams; i++) {
          const r = new THREE.Mesh(rod, new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? light : dark }));
          r.position.set(streams === 1 ? 0 : -innerW * 0.25 + (i / (streams - 1)) * innerW * 0.5, 0, 0);
          mesh.add(r);
        }
        if (streams === 1) {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(h * 0.32, 0.03 * s, 8, 24), new THREE.MeshBasicMaterial({ color: light }));
          ring.rotation.x = Math.PI / 2;
          mesh.add(ring);
        }
        break;
      }
      case "io": {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16 * s, h * 0.7, 12), new THREE.MeshBasicMaterial({ color: light }));
        cone.position.set(0, 0, 0);
        mesh.add(cone);
        break;
      }
      case "norm": {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(innerW, h * 0.25, innerD), new THREE.MeshBasicMaterial({ color: light }));
        mesh.add(plate);
        break;
      }
    }
  }

  private buildLink(link: Link): void {
    const a = this.blocks.get(link.from);
    const b = this.blocks.get(link.to);
    if (!a || !b) return;
    const pa = a.mesh.position.clone();
    const pb = b.mesh.position.clone();
    const dir = Math.sign(pb.x - pa.x) || 1;
    const start = pa.clone().add(new THREE.Vector3((dir * a.size.x) / 2, 0, 0));
    const end = pb.clone().add(new THREE.Vector3((-dir * b.size.x) / 2, 0, 0));
    const bulge = Math.max(0.6, Math.abs(end.x - start.x) * 0.3);
    const c1 = start.clone().add(new THREE.Vector3(dir * bulge, 0, 0));
    const c2 = end.clone().add(new THREE.Vector3(-dir * bulge, 0, 0));
    const curve = new THREE.CubicBezierCurve3(start, c1, c2, end);
    const color = link.style === "kv" ? PALETTE.linkKv : link.style === "flow" ? PALETTE.linkFlow : PALETTE.linkMemory;
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 24, 0.035, 6, false),
      new THREE.MeshStandardMaterial({ color, roughness: 0.6, emissive: color, emissiveIntensity: 0.25 }),
    );
    this.group.add(tube);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 10), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25 }));
    head.position.copy(end);
    const tangent = curve.getTangent(1);
    head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.normalize());
    this.group.add(head);

    if (link.label) {
      const el = document.createElement("div");
      el.className = "link-label";
      const obj = new CSS2DObject(el);
      obj.position.copy(curve.getPoint(0.5)).add(new THREE.Vector3(0, 0.18, 0));
      this.group.add(obj);
      this.labels.push(obj);
      this.localized.push({ element: el, text: link.label });
    }

    this.addParticle(curve, 0.5, 5, color, 0.08);
  }

  private addParticle(
    curve: THREE.Curve<THREE.Vector3>,
    offset: number,
    period: number,
    color: number,
    radius: number,
    tokens?: { zh: string[]; en: string[] },
    tokenStart = 0,
  ): void {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 12, 12),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.2, roughness: 0.3 }),
    );
    mesh.visible = false;
    this.particleGroup.add(mesh);
    const particle: Particle = { mesh, curve, offset, period, tokens, tokenIndex: tokenStart, lastT: 0 };
    if (tokens) {
      const el = document.createElement("span");
      el.className = "flow-token";
      el.setAttribute("aria-hidden", "true");
      const label = new CSS2DObject(el);
      label.position.set(0, radius + 0.12, 0);
      label.center.set(0.5, 1);
      mesh.add(label);
      this.labels.push(label);
      particle.labelEl = el;
      this.paintToken(particle);
    }
    this.particles.push(particle);
  }

  private paintToken(p: Particle): void {
    if (!p.tokens || !p.labelEl) return;
    const list = p.tokens[this.locale];
    const text = list[p.tokenIndex % Math.max(1, list.length)] ?? "";
    p.labelEl.textContent = text;
  }

  private pickExperts(grid: MoeGrid): void {
    grid.target = new Set();
    while (grid.target.size < Math.min(grid.active, grid.count)) grid.target.add(Math.floor(Math.random() * grid.count));
  }

  private paintExperts(grid: MoeGrid): void {
    _dim.set(KIND_COLOR.moe).offsetHSL(0, 0.02, -0.18);
    for (let i = 0; i < grid.count; i++) {
      const wasLit = grid.lit.has(i);
      const willBeLit = grid.target.has(i);
      const t = grid.blend;
      if (wasLit && willBeLit) _tmpColor.copy(_lit);
      else if (wasLit) _tmpColor.copy(_lit).lerp(_dim, t);
      else if (willBeLit) _tmpColor.copy(_dim).lerp(_lit, t);
      else _tmpColor.copy(_dim);
      grid.mesh.setColorAt(i, _tmpColor);
    }
    if (grid.mesh.instanceColor) grid.mesh.instanceColor.needsUpdate = true;
  }

  setLabelsVisible(visible: boolean): void {
    this.labelsVisible = visible;
    for (const label of this.labels) label.visible = visible;
  }

  get areLabelsVisible(): boolean {
    return this.labelsVisible;
  }

  applyLocale(locale: Locale): void {
    this.locale = locale;
    for (const item of this.localized) item.element.textContent = pick(item.text, locale);
    for (const p of this.particles) this.paintToken(p);
    this.renderPlaque(this.plaque.element, locale);
  }

  setFlowVisible(visible: boolean): void {
    this.particleGroup.visible = visible;
  }

  update(time: number, dt: number): void {
    if (this.particleGroup.visible) {
      for (const p of this.particles) {
        const t = ((time / p.period + p.offset) % 1 + 1) % 1;
        if (t < p.lastT && p.tokens) {
          // Looped back to the bottom: the next example token rides up.
          p.tokenIndex += 2;
          this.paintToken(p);
        }
        p.lastT = t;
        p.mesh.visible = true;
        p.curve.getPointAt(t, p.mesh.position);
        const fade = Math.min(1, Math.min(t, 1 - t) * 8);
        p.mesh.scale.setScalar(0.6 + 0.4 * fade);
        if (p.labelEl) p.labelEl.style.opacity = String(Math.min(1, fade * 1.2));
      }
    }
    for (const grid of this.moeGrids) {
      if (time >= grid.nextSwitch) {
        grid.lit = new Set(grid.target);
        this.pickExperts(grid);
        grid.blend = 0;
        grid.nextSwitch = time + 2.4 + Math.random() * 0.8;
      }
      if (grid.blend < 1) {
        grid.blend = Math.min(1, grid.blend + dt * 2.5);
        this.paintExperts(grid);
      }
    }
  }

  worldPositionOf(blockId: string): THREE.Vector3 | null {
    const view = this.blocks.get(blockId);
    if (!view) return null;
    return view.mesh.getWorldPosition(new THREE.Vector3());
  }
}
