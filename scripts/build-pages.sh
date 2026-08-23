#!/usr/bin/env bash
# Build every gallery project into _site/ for GitHub Pages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="${ROOT}/_site"
SKIP_DIRS='^(\.git|\.github|\.cursor|scripts|node_modules|_site|dist|build|out|\.next)$'

if [[ -n "${GITHUB_REPOSITORY:-}" ]]; then
  REPO_NAME="${GITHUB_REPOSITORY##*/}"
else
  REPO_NAME="${REPO_NAME:-ai-bench}"
fi

if [[ "${REPO_NAME}" == *.github.io ]]; then
  BASE_PREFIX=""
else
  BASE_PREFIX="/${REPO_NAME}"
fi

rm -rf "${SITE}"
mkdir -p "${SITE}"
touch "${SITE}/.nojekyll"

is_skipped() {
  local name="$1"
  [[ "${name}" =~ ${SKIP_DIRS} ]]
}

detect_package_manager() {
  local dir="$1"
  if [[ -f "${dir}/pnpm-lock.yaml" ]]; then
    echo pnpm
  elif [[ -f "${dir}/yarn.lock" ]]; then
    echo yarn
  elif [[ -f "${dir}/bun.lockb" || -f "${dir}/bun.lock" ]]; then
    echo bun
  else
    echo npm
  fi
}

install_deps() {
  local dir="$1"
  local pm
  pm="$(detect_package_manager "${dir}")"
  case "${pm}" in
    pnpm) (cd "${dir}" && corepack enable >/dev/null 2>&1 || true; pnpm install --frozen-lockfile || pnpm install) ;;
    yarn) (cd "${dir}" && yarn install --frozen-lockfile || yarn install) ;;
    bun)  (cd "${dir}" && bun install) ;;
    *)    (cd "${dir}" && { [[ -f package-lock.json ]] && npm ci || npm install; }) ;;
  esac
}

find_output_dir() {
  local dir="$1"
  for candidate in dist build out; do
    if [[ -f "${dir}/${candidate}/index.html" ]]; then
      echo "${candidate}"
      return 0
    fi
  done
  return 1
}

build_next_static() {
  local src="$1"
  local base="$2"
  local bp="${base%/}"
  local cfg=""
  local f

  for f in next.config.ts next.config.mjs next.config.js next.config.mts; do
    if [[ -f "${src}/${f}" ]]; then
      cfg="${f}"
      break
    fi
  done

  if [[ -n "${cfg}" ]]; then
    mv "${src}/${cfg}" "${src}/${cfg}.pages-bak"
  fi

  # Use .mjs so Next 16 does not typecheck this overlay.
  cat > "${src}/next.config.mjs" <<'EOF'
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
};

if (basePath) {
  nextConfig.basePath = basePath;
  nextConfig.assetPrefix = basePath;
}

export default nextConfig;
EOF

  local status=0
  if ! (cd "${src}" && PAGES_BASE_PATH="${bp}" npm run build); then
    echo "Turbopack build failed for ${src}; retrying with webpack" >&2
    (cd "${src}" && PAGES_BASE_PATH="${bp}" npx next build --webpack) || status=$?
  fi

  rm -f "${src}/next.config.mjs"
  if [[ -n "${cfg}" && -f "${src}/${cfg}.pages-bak" ]]; then
    mv "${src}/${cfg}.pages-bak" "${src}/${cfg}"
  fi

  return "${status}"
}

build_react_project() {
  local src="$1"
  local dest="$2"
  local base="$3"

  mkdir -p "${dest}"

  if out_dir="$(find_output_dir "${src}")"; then
    echo "Using existing static output: ${src}/${out_dir}"
    cp -a "${src}/${out_dir}/." "${dest}/"
    return 0
  fi

  if [[ ! -f "${src}/package.json" ]]; then
    return 1
  fi

  echo "Building ${src} with base ${base}"
  install_deps "${src}"

  if grep -q '"next"' "${src}/package.json" && compgen -G "${src}/next.config.*" > /dev/null; then
    build_next_static "${src}" "${base}"
  elif grep -q '"vite"' "${src}/package.json"; then
    (cd "${src}" && npx vite build --base "${base}")
  elif grep -q '"react-scripts"' "${src}/package.json"; then
    (cd "${src}" && PUBLIC_URL="${base%/}" npm run build)
  else
    (cd "${src}" && npm run build)
  fi

  if out_dir="$(find_output_dir "${src}")"; then
    cp -a "${src}/${out_dir}/." "${dest}/"
  else
    echo "Build finished but no dist/build/out/index.html in ${src}" >&2
    return 1
  fi
}

copy_static_project() {
  local src="$1"
  local dest="$2"
  mkdir -p "${dest}"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --exclude node_modules --exclude .git --exclude dist --exclude build --exclude out "${src}/" "${dest}/"
  else
    cp -a "${src}/." "${dest}/"
    rm -rf "${dest}/node_modules" "${dest}/.git"
  fi
}

write_index() {
  local dest="$1"
  local title="$2"
  local heading="$3"
  local blurb="$4"
  local home_href="$5"
  shift 5

  local cards=""
  local name href
  if (($#)); then
    while (($#)); do
      name="$1"
      href="$2"
      shift 2
      cards+="<a class=\"card\" href=\"${href}\"><strong>${name}</strong><span>開啟這個版本</span></a>"
    done
  else
    cards='<p class="empty">還沒有專案。把 zip 解壓縮進這個資料夾後重新部署即可。</p>'
  fi

  local nav=""
  if [[ "${home_href}" != "${BASE_PREFIX}/" || "${dest}" != "${SITE}" ]]; then
    nav="<nav><a href=\"${home_href}\">← 回首頁</a></nav>"
  fi

  cat > "${dest}/index.html" <<EOF
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0; font-family: ui-sans-serif, system-ui, sans-serif;
      background: #0b1220; color: #e8eefc; line-height: 1.5;
    }
    main { max-width: 880px; margin: 0 auto; padding: 48px 20px; }
    a { color: #8cb4ff; }
    h1 { font-size: 1.8rem; margin: 0 0 8px; }
    .blurb { color: #b7c2d8; margin: 0 0 28px; }
    .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
    .card {
      display: flex; flex-direction: column; gap: 6px;
      padding: 16px; border-radius: 12px; text-decoration: none;
      background: #162033; border: 1px solid #2a3b5a; color: inherit;
    }
    .card span { color: #9aabc8; font-size: 0.9rem; }
    .card:hover { border-color: #6d8cff; }
    .empty { color: #9aabc8; }
    nav { margin-bottom: 24px; }
  </style>
</head>
<body>
  <main>
    ${nav}
    <h1>${heading}</h1>
    <p class="blurb">${blurb}</p>
    <div class="grid">${cards}</div>
  </main>
</body>
</html>
EOF
}

gallery_entries=()

shopt -s nullglob
for gallery in "${ROOT}"/*/; do
  gallery_name="$(basename "${gallery}")"
  if is_skipped "${gallery_name}"; then
    continue
  fi

  project_pairs=()
  for project in "${gallery}"*/; do
    project_name="$(basename "${project}")"
    if is_skipped "${project_name}"; then
      continue
    fi

    dest="${SITE}/${gallery_name}/${project_name}"
    base="${BASE_PREFIX}/${gallery_name}/${project_name}/"

    if [[ -f "${project}/package.json" ]] || find_output_dir "${project}" >/dev/null; then
      if ! build_react_project "${project%/}" "${dest}" "${base}"; then
        echo "WARN: failed to build ${project_name}; writing placeholder" >&2
        mkdir -p "${dest}"
        printf '<!doctype html><meta charset="utf-8"><title>Build failed</title><body style="font-family:sans-serif;padding:32px"><h1>這個版本目前建置失敗</h1><p>%s</p></body>' "${project_name}" > "${dest}/index.html"
      fi
    elif [[ -f "${project}/index.html" ]]; then
      echo "Copying static site ${project}"
      copy_static_project "${project%/}" "${dest}"
    else
      echo "Skipping ${project} (no package.json or index.html)"
      continue
    fi

    if [[ -f "${dest}/index.html" && ! -f "${dest}/404.html" ]]; then
      cp "${dest}/index.html" "${dest}/404.html"
    fi

    project_pairs+=("${project_name}" "${BASE_PREFIX}/${gallery_name}/${project_name}/")
  done

  mkdir -p "${SITE}/${gallery_name}"
  write_index \
    "${SITE}/${gallery_name}" \
    "${gallery_name} · ai-bench" \
    "${gallery_name}" \
    "這個實驗裡各個 agent / 專案的靜態站。" \
    "${BASE_PREFIX}/" \
    "${project_pairs[@]+"${project_pairs[@]}"}"

  gallery_entries+=("${gallery_name}" "${BASE_PREFIX}/${gallery_name}/")
done

write_index \
  "${SITE}" \
  "ai-bench" \
  "ai-bench" \
  "比較多個 agent 做出來的網頁。" \
  "${BASE_PREFIX}/" \
  "${gallery_entries[@]+"${gallery_entries[@]}"}"

echo "Built site into ${SITE} (base prefix: '${BASE_PREFIX}')"
