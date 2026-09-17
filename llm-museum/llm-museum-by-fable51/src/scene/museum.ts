import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import type { ModelSpec } from "../content/types.ts";
import type { Locale } from "../i18n.ts";
import { Exhibit, type BlockView } from "./exhibit.ts";
import { PALETTE } from "./palette.ts";

export interface MuseumEvents {
  onSelect: (modelId: string, blockId: string) => void;
  onFocus: (modelId: string | null) => void;
  onHover: (view: BlockView | null) => void;
}

interface CameraTween {
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  start: number;
  duration: number;
}

const EXHIBIT_SPACING = 21;
const SELECTED_EDGE = 0xf2c14e;
const LABEL_GAP = 2;
const LABEL_MAX_SHIFT = 72;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Deterministic pseudo-random numbers so the procedural floor looks the same every visit. */
function lcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function makeFloorTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  if (!ctx) return texture;
  const rand = lcg(7);
  const rows = 8;
  const rowH = size / rows;
  for (let r = 0; r < rows; r++) {
    const shade = 0.88 + rand() * 0.24;
    ctx.fillStyle = `rgb(${Math.round(140 * shade)}, ${Math.round(111 * shade)}, ${Math.round(85 * shade)})`;
    ctx.fillRect(0, r * rowH, size, rowH);
    ctx.strokeStyle = "rgba(60, 40, 25, 0.16)";
    ctx.lineWidth = 1;
    for (let g = 0; g < 7; g++) {
      const y = r * rowH + 6 + rand() * (rowH - 12);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(size * 0.33, y + rand() * 8 - 4, size * 0.66, y + rand() * 8 - 4, size, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(45, 30, 20, 0.5)";
    ctx.fillRect(0, r * rowH, size, 2);
    ctx.fillRect(Math.floor(rand() * size), r * rowH, 2, rowH);
  }
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 7);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export class Museum {
  readonly renderer: THREE.WebGLRenderer;
  readonly labelRenderer: CSS2DRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  readonly exhibits: Exhibit[] = [];
  activeModelId: string | null = null;
  selected: BlockView | null = null;
  private hovered: BlockView | null = null;
  private tween: CameraTween | null = null;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private pointerDirty = false;
  private pointerInside = false;
  private downAt: { x: number; y: number; time: number } | null = null;
  private insets = { right: 0, bottom: 0 };
  private width = 1;
  private height = 1;
  private lastTime = 0;
  private flowVisible = true;
  private readonly resizeObserver: ResizeObserver;
  private pickables: THREE.Object3D[] = [];
  private readonly lastCameraMatrix = new THREE.Matrix4();
  private labelLayoutDirty = true;

  constructor(
    private readonly container: HTMLElement,
    models: ModelSpec[],
    locale: Locale,
    private readonly events: MuseumEvents,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.domElement.className = "webgl";
    container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.className = "labels";
    container.appendChild(this.labelRenderer.domElement);

    this.scene.background = new THREE.Color(PALETTE.background);
    this.scene.fog = new THREE.Fog(PALETTE.fog, 70, 190);

    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);
    this.camera.position.set(0, 12, 60);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = THREE.MathUtils.degToRad(88);
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 110;
    this.controls.target.set(0, 4, 0);

    this.buildLights();
    this.buildRoom(models.length);

    models.forEach((model, index) => {
      const x = (index - (models.length - 1) / 2) * EXHIBIT_SPACING;
      this.addSpot(x);
      const exhibit = new Exhibit(
        model,
        new THREE.Vector3(x, 0, 0),
        locale,
        (blockId) => this.events.onSelect(model.id, blockId),
        () => this.events.onFocus(model.id),
      );
      this.exhibits.push(exhibit);
      this.scene.add(exhibit.group);
    });
    this.pickables = this.exhibits.flatMap((e) => e.pickables);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
    canvas.addEventListener("pointerleave", () => {
      this.pointerInside = false;
      this.setHovered(null);
    });
    canvas.addEventListener("pointerdown", (e) => {
      this.downAt = { x: e.clientX, y: e.clientY, time: performance.now() };
      this.cancelTween();
    });
    canvas.addEventListener("wheel", () => this.cancelTween(), { passive: true });
    canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));
  }

  private buildLights(): void {
    const hemi = new THREE.HemisphereLight(0xfff5e6, 0x9a7f66, 0.8);
    this.scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffefd8, 1.9);
    key.position.set(18, 28, 22);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 5;
    key.shadow.camera.far = 110;
    key.shadow.camera.left = -46;
    key.shadow.camera.right = 46;
    key.shadow.camera.top = 30;
    key.shadow.camera.bottom = -24;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    this.scene.add(key);
    this.scene.add(key.target);

    const fill = new THREE.DirectionalLight(0xdfe8f0, 0.45);
    fill.position.set(-24, 14, -10);
    this.scene.add(fill);
  }

  /** A warm pool of light over each pedestal, like gallery spotlights. */
  private addSpot(x: number): void {
    const spot = new THREE.SpotLight(0xffe2bd, 140, 36, 0.55, 0.7, 1.8);
    spot.position.set(x + 2, 13, 7);
    spot.target.position.set(x, 1, 0);
    this.scene.add(spot);
    this.scene.add(spot.target);
  }

  private buildRoom(exhibitCount: number): void {
    const roomW = EXHIBIT_SPACING * exhibitCount + 40;
    const floorMaterial = new THREE.MeshStandardMaterial({ map: makeFloorTexture(), roughness: 0.92, metalness: 0 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, 70), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 8);
    floor.receiveShadow = true;
    this.scene.add(floor);

    const wallZ = -16;
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(roomW, 18), new THREE.MeshStandardMaterial({ color: PALETTE.wall, roughness: 0.95 }));
    wall.position.set(0, 9, wallZ);
    wall.receiveShadow = true;
    this.scene.add(wall);

    const trimMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.wallTrim, roughness: 0.7 });
    const wainscot = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.14, 0.22), trimMaterial);
    wainscot.position.set(0, 1.35, wallZ + 0.1);
    this.scene.add(wainscot);
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.28, 0.24), trimMaterial);
    baseboard.position.set(0, 0.14, wallZ + 0.1);
    this.scene.add(baseboard);
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(roomW, 0.3, 0.3), trimMaterial);
    cornice.position.set(0, 17.6, wallZ + 0.15);
    this.scene.add(cornice);

    // A lighter panel behind each exhibit frames it like a gallery wall.
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xf3ebdd, roughness: 0.95 });
    const frameMaterial = new THREE.LineBasicMaterial({ color: PALETTE.wallTrim, transparent: true, opacity: 0.6 });
    for (let i = 0; i < exhibitCount; i++) {
      const x = (i - (exhibitCount - 1) / 2) * EXHIBIT_SPACING;
      const panelGeometry = new THREE.BoxGeometry(17, 11, 0.12);
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(x, 7.6, wallZ + 0.12);
      panel.receiveShadow = true;
      this.scene.add(panel);
      const frame = new THREE.LineSegments(new THREE.EdgesGeometry(panelGeometry), frameMaterial);
      frame.position.copy(panel.position);
      this.scene.add(frame);
    }

    // Side walls close the room off softly.
    const sideMaterial = new THREE.MeshStandardMaterial({ color: PALETTE.wall, roughness: 0.95 });
    for (const sign of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.PlaneGeometry(70, 18), sideMaterial);
      side.position.set((sign * roomW) / 2, 9, 8);
      side.rotation.y = -sign * Math.PI / 2;
      this.scene.add(side);
    }
  }

  /** Pixels covered by overlaid UI, so framing centres on the uncovered area. */
  setInsets(right: number, bottom: number): void {
    this.insets = { right: Math.max(0, right), bottom: Math.max(0, bottom) };
    this.applyViewOffset();
  }

  private resize(): void {
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.renderer.setSize(this.width, this.height, false);
    this.labelRenderer.setSize(this.width, this.height);
    this.applyViewOffset();
  }

  private applyViewOffset(): void {
    const right = Math.min(this.insets.right, this.width * 0.7);
    const bottom = Math.min(this.insets.bottom, this.height * 0.7);
    const fullW = this.width + right;
    const fullH = this.height + bottom;
    this.camera.aspect = fullW / fullH;
    if (right > 0 || bottom > 0) this.camera.setViewOffset(fullW, fullH, right, bottom, this.width, this.height);
    else this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();
  }

  /** Distance at which a box of the given size fills the uncovered part of the view. */
  private frameDistance(widthNeeded: number, heightNeeded: number): number {
    const right = Math.min(this.insets.right, this.width * 0.7);
    const bottom = Math.min(this.insets.bottom, this.height * 0.7);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const visibleH = this.height - bottom;
    const visibleW = this.width - right;
    const fullH = this.height + bottom;
    const dv = (heightNeeded / (2 * tanHalf)) * (fullH / Math.max(1, visibleH));
    const dh = (widthNeeded * fullH) / (2 * tanHalf * Math.max(1, visibleW));
    return Math.max(dv, dh);
  }

  private orbitOffset(distance: number, azimuth: number, elevation: number): THREE.Vector3 {
    return new THREE.Vector3(
      Math.sin(azimuth) * Math.cos(elevation) * distance,
      Math.sin(elevation) * distance,
      Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
  }

  exhibitFor(modelId: string): Exhibit | undefined {
    return this.exhibits.find((e) => e.model.id === modelId);
  }

  focusOverview(duration = 1.6): void {
    this.activeModelId = null;
    this.labelLayoutDirty = true;
    for (const exhibit of this.exhibits) exhibit.setLabelsVisible(false);
    const bounds = new THREE.Box3();
    for (const exhibit of this.exhibits) bounds.union(exhibit.bounds);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const target = new THREE.Vector3(center.x, size.y * 0.45, 0);
    const distance = this.frameDistance(size.x * 1.02 + 2, size.y * 1.6 + 2);
    this.flyTo(target.clone().add(this.orbitOffset(distance, 0, 0.3)), target, duration);
  }

  focusModel(modelId: string, duration = 1.5): void {
    const exhibit = this.exhibitFor(modelId);
    if (!exhibit) return;
    this.activeModelId = modelId;
    this.labelLayoutDirty = true;
    for (const other of this.exhibits) other.setLabelsVisible(other === exhibit);
    const size = exhibit.bounds.getSize(new THREE.Vector3());
    const center = exhibit.bounds.getCenter(new THREE.Vector3());
    const target = new THREE.Vector3(center.x, size.y * 0.5 + 0.2, 0);
    // Labels hang outside the geometry on both sides; leave room for them.
    const distance = this.frameDistance(size.x * 1.0 + 4, size.y * 1.25 + 1.5);
    this.flyTo(target.clone().add(this.orbitOffset(distance, 0.38, 0.27)), target, duration);
  }

  /** Moves close to one block, keeping its neighbours and label in view. */
  focusBlock(modelId: string, blockId: string, duration = 1.1): void {
    const exhibit = this.exhibitFor(modelId);
    const view = exhibit?.blocks.get(blockId);
    if (!exhibit || !view) return;
    if (this.activeModelId !== modelId) {
      this.activeModelId = modelId;
      this.labelLayoutDirty = true;
      for (const other of this.exhibits) other.setLabelsVisible(other === exhibit);
    }
    const target = view.mesh.getWorldPosition(new THREE.Vector3());
    const distance = Math.max(5.5, this.frameDistance(view.size.x * 2.6 + 2, view.size.y * 6 + 2.5));
    const azimuth = view.column.labelSide === "left" ? -0.35 : 0.42;
    this.flyTo(target.clone().add(this.orbitOffset(distance, azimuth, 0.2)), target, duration);
  }

  /** Slides the orbit target onto a block without changing the viewing distance. */
  panToBlock(modelId: string, blockId: string, duration = 0.9): void {
    const exhibit = this.exhibitFor(modelId);
    const view = exhibit?.blocks.get(blockId);
    if (!exhibit || !view) return;
    const target = view.mesh.getWorldPosition(new THREE.Vector3());
    // If a flight is still in progress, pan from where it was heading, not from mid-air.
    const basePos = this.tween ? this.tween.toPos : this.camera.position;
    const baseTarget = this.tween ? this.tween.toTarget : this.controls.target;
    const delta = target.clone().sub(baseTarget);
    this.flyTo(basePos.clone().add(delta), target, duration);
  }

  private flyTo(position: THREE.Vector3, target: THREE.Vector3, duration: number): void {
    this.tween = {
      fromPos: this.camera.position.clone(),
      toPos: position,
      fromTarget: this.controls.target.clone(),
      toTarget: target,
      start: performance.now(),
      duration: Math.max(0.01, duration) * 1000,
    };
    this.controls.enabled = false;
  }

  private cancelTween(): void {
    if (!this.tween) return;
    this.tween = null;
    this.controls.enabled = true;
  }

  select(modelId: string, blockId: string | null): void {
    if (this.selected) {
      this.selected.material.emissiveIntensity = 0.06;
      this.selected.edgeMaterial.color.set(PALETTE.edge);
      this.selected.edgeMaterial.opacity = 0.5;
      this.selected.labelButton.classList.remove("is-selected");
      this.selected = null;
    }
    if (!blockId) return;
    const view = this.exhibitFor(modelId)?.blocks.get(blockId);
    if (!view) return;
    this.selected = view;
    view.edgeMaterial.color.set(SELECTED_EDGE);
    view.edgeMaterial.opacity = 1;
    view.labelButton.classList.add("is-selected");
    this.labelLayoutDirty = true;
  }

  setLocale(locale: Locale): void {
    for (const exhibit of this.exhibits) exhibit.applyLocale(locale);
    this.labelLayoutDirty = true;
  }

  /**
   * Keeps the 2D labels of the active exhibit from piling on top of each other:
   * labels are sorted by screen position and nudged downwards until they clear
   * earlier labels, column titles, repeat badges and link captions.
   */
  private layoutLabels(): void {
    if (!this.activeModelId) return;
    if (!this.labelLayoutDirty && this.camera.matrixWorld.equals(this.lastCameraMatrix)) return;
    this.lastCameraMatrix.copy(this.camera.matrixWorld);
    this.labelLayoutDirty = false;

    const root = this.labelRenderer.domElement;
    const placed: DOMRect[] = [];
    for (const el of root.querySelectorAll<HTMLElement>(".col-title, .repeat-badge, .link-label, .plaque")) {
      if (el.style.display === "none") continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0) placed.push(r);
    }

    const movable: { el: HTMLElement; base: DOMRect }[] = [];
    for (const anchor of root.querySelectorAll<HTMLElement>(".lbl-anchor")) {
      if (anchor.style.display === "none") continue;
      const button = anchor.firstElementChild as HTMLElement | null;
      if (!button) continue;
      const rect = button.getBoundingClientRect();
      if (rect.width === 0) continue;
      const previous = parseFloat(button.style.getPropertyValue("--dy")) || 0;
      movable.push({ el: button, base: new DOMRect(rect.x, rect.y - previous, rect.width, rect.height) });
    }
    movable.sort((a, b) => a.base.y - b.base.y);

    for (const item of movable) {
      let top = item.base.y;
      for (let pass = 0; pass < 6; pass++) {
        let moved = false;
        for (const other of placed) {
          const overlapsX = item.base.x < other.right - 1 && item.base.right > other.x + 1;
          const overlapsY = top < other.bottom + LABEL_GAP && top + item.base.height > other.y - LABEL_GAP;
          if (overlapsX && overlapsY) {
            top = other.bottom + LABEL_GAP;
            moved = true;
          }
        }
        if (!moved) break;
      }
      const dy = Math.min(LABEL_MAX_SHIFT, top - item.base.y);
      item.el.style.setProperty("--dy", dy > 0.5 ? `${dy.toFixed(1)}px` : "0px");
      placed.push(new DOMRect(item.base.x, item.base.y + dy, item.base.width, item.base.height));
    }
  }

  setFlowVisible(visible: boolean): void {
    this.flowVisible = visible;
    for (const exhibit of this.exhibits) exhibit.setFlowVisible(visible);
  }

  private onPointerMove(event: PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.pointerInside = true;
    this.pointerDirty = true;
  }

  private onPointerUp(event: PointerEvent): void {
    const down = this.downAt;
    this.downAt = null;
    if (!down || event.button !== 0) return;
    const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
    if (moved > 6 || performance.now() - down.time > 600) return;
    this.onPointerMove(event);
    const hit = this.pick();
    if (!hit) return;
    const data = hit.object.userData as { modelId?: string; blockId?: string; pedestal?: boolean };
    if (data.blockId && data.modelId) this.events.onSelect(data.modelId, data.blockId);
    else if (data.pedestal && data.modelId) this.events.onFocus(data.modelId);
  }

  private pick(): THREE.Intersection | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickables, false);
    return hits[0] ?? null;
  }

  private setHovered(view: BlockView | null): void {
    if (this.hovered === view) return;
    if (this.hovered && this.hovered !== this.selected) this.hovered.material.emissiveIntensity = 0.06;
    if (this.hovered) this.hovered.labelButton.classList.remove("is-hover");
    this.hovered = view;
    if (view) {
      if (view !== this.selected) view.material.emissiveIntensity = 0.28;
      view.labelButton.classList.add("is-hover");
    }
    this.events.onHover(view);
  }

  private updateHover(): void {
    if (!this.pointerDirty || !this.pointerInside) return;
    this.pointerDirty = false;
    const hit = this.pick();
    const data = hit?.object.userData as { modelId?: string; blockId?: string; pedestal?: boolean } | undefined;
    let view: BlockView | null = null;
    if (data?.blockId && data.modelId) view = this.exhibitFor(data.modelId)?.blocks.get(data.blockId) ?? null;
    this.setHovered(view);
    this.container.style.cursor = hit ? "pointer" : "";
  }

  start(): void {
    this.renderer.setAnimationLoop((timeMs) => this.frame(timeMs));
  }

  private frame(timeMs: number): void {
    const time = timeMs / 1000;
    const dt = Math.min(0.1, Math.max(0, time - this.lastTime));
    this.lastTime = time;

    if (this.tween) {
      const k = easeInOutCubic(Math.min(1, (performance.now() - this.tween.start) / this.tween.duration));
      this.camera.position.lerpVectors(this.tween.fromPos, this.tween.toPos, k);
      this.controls.target.lerpVectors(this.tween.fromTarget, this.tween.toTarget, k);
      if (k >= 1) {
        this.tween = null;
        this.controls.enabled = true;
      }
    }
    this.controls.update();

    for (const exhibit of this.exhibits) exhibit.update(time, dt);
    if (this.selected) this.selected.material.emissiveIntensity = 0.34 + 0.1 * Math.sin(time * 2.6);

    this.updateHover();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    this.layoutLabels();
  }

  dispose(): void {
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
  }
}
