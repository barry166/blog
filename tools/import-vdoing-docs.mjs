import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const sourceRepo = 'https://github.com/xugaoyi/vuepress-theme-vdoing.git';
const sourceCommit = 'd77b42053c1f139cd7de39555eb282041fba747f';
const sourceShortCommit = sourceCommit.slice(0, 7);
const defaultSourceDir = '/tmp/vuepress-theme-vdoing-inspect';
const sourceDir = process.env.VDOING_SOURCE_DIR || defaultSourceDir;
const docsDir = join(sourceDir, 'docs');
const importCount = 100;
const seed = 'd50ad623f6831e8fec43f54c424c8abf5e6ecbdd10d0be97d7fcc79704017ffd';

const postsOutDir = join(projectRoot, 'source', '_posts', 'vdoing');
const imageOutRoot = join(projectRoot, 'source', 'img', 'vdoing');
const dataOutDir = join(projectRoot, 'source', '_data');
const manifestPath = join(dataOutDir, 'vdoing-import.json');

const imageExts = new Set(['.apng', '.avif', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const vuepressFields = new Set(['permalink', 'sidebar', 'article']);

main().catch(error => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});

async function main() {
  ensureSourceRepo();

  const sourceHead = git(['-C', sourceDir, 'rev-parse', 'HEAD']).trim();
  if (sourceHead !== sourceCommit) {
    throw new Error(`Unexpected source commit ${sourceHead}; expected ${sourceCommit}.`);
  }

  const allMarkdown = walk(docsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => normalizePath(relative(docsDir, file)))
    .sort();
  const fileListHash = sha256(`${allMarkdown.join('\n')}\n`);
  if (fileListHash !== seed) {
    throw new Error(`Unexpected docs file list hash ${fileListHash}; expected ${seed}.`);
  }

  const candidates = allMarkdown
    .map(relPath => {
      const absolutePath = join(docsDir, relPath);
      const parsed = parseMarkdownFile(absolutePath);
      return { relPath, absolutePath, ...parsed };
    })
    .filter(candidate => isArticleCandidate(candidate));

  if (candidates.length < importCount) {
    throw new Error(`Only ${candidates.length} importable documents found; need ${importCount}.`);
  }

  const selected = shuffleDeterministically(candidates, seed).slice(0, importCount);
  const usedSlugs = new Set();

  rmSync(postsOutDir, { recursive: true, force: true });
  rmSync(imageOutRoot, { recursive: true, force: true });
  mkdirSync(postsOutDir, { recursive: true });
  mkdirSync(imageOutRoot, { recursive: true });
  mkdirSync(dataOutDir, { recursive: true });

  const manifest = {
    sourceRepo,
    sourceCommit,
    seed,
    importedAt: new Date().toISOString(),
    candidateCount: candidates.length,
    importedCount: selected.length,
    posts: []
  };

  for (const document of selected) {
    const slug = uniqueSlug(makeSlug(document.frontmatter, document.relPath), usedSlugs);
    const postImageDir = join(imageOutRoot, slug);
    mkdirSync(postImageDir, { recursive: true });

    const imageRecords = [];
    const skippedImageReferences = [];
    const transformedBody = await transformMarkdownBody(document.body, {
      sourceFile: document.absolutePath,
      sourceRelPath: document.relPath,
      slug,
      postImageDir,
      imageRecords,
      skippedImageReferences
    });

    const outputFrontmatter = buildFrontmatter(document.frontmatter, document.relPath);
    const sourceNote = buildSourceNote(document.frontmatter, document.relPath);
    const output = `${dumpFrontmatter(outputFrontmatter)}\n${transformedBody.trim()}\n\n${sourceNote}\n`;
    const targetRelPath = normalizePath(join('source/_posts/vdoing', `${slug}.md`));
    const targetPath = join(projectRoot, targetRelPath);
    writeFileSync(targetPath, output, 'utf8');

    manifest.posts.push({
      source: normalizePath(join('docs', document.relPath)),
      target: targetRelPath,
      slug,
      title: outputFrontmatter.title,
      date: outputFrontmatter.date,
      categories: outputFrontmatter.categories,
      tags: outputFrontmatter.tags,
      images: imageRecords,
      skippedImageReferences
    });
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Imported ${manifest.posts.length} Vdoing documents.`);
  console.log(`Manifest: ${normalizePath(relative(projectRoot, manifestPath))}`);
}

function ensureSourceRepo() {
  if (existsSync(join(sourceDir, '.git'))) {
    return;
  }

  rmSync(sourceDir, { recursive: true, force: true });
  mkdirSync(sourceDir, { recursive: true });
  git(['init', sourceDir]);
  git(['-C', sourceDir, 'remote', 'add', 'origin', sourceRepo]);
  git(['-C', sourceDir, 'fetch', '--depth', '1', 'origin', sourceCommit]);
  git(['-C', sourceDir, 'checkout', '--detach', 'FETCH_HEAD']);
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function walk(root) {
  const entries = [];
  for (const name of readDirSorted(root)) {
    const file = join(root, name);
    const stats = statSync(file);
    if (stats.isDirectory()) {
      entries.push(...walk(file));
    } else if (stats.isFile()) {
      entries.push(file);
    }
  }
  return entries;
}

function readDirSorted(root) {
  return existsSync(root) ? readdirSync(root).sort() : [];
}

function parseMarkdownFile(file) {
  const raw = readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return { frontmatter: {}, body: raw };
  }
  return {
    frontmatter: parseFrontmatter(match[1]),
    body: raw.slice(match[0].length)
  };
}

function parseFrontmatter(input) {
  const result = {};
  const lines = input.replace(/\r\n/g, '\n').split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const pair = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!pair) continue;

    const key = pair[1];
    const rest = pair[2] ?? '';
    if (rest.trim()) {
      result[key] = parseScalar(rest.trim());
      continue;
    }

    const childLines = [];
    while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) {
      index += 1;
      childLines.push(lines[index]);
    }

    if (childLines.some(child => /^\s*-\s*/.test(child))) {
      result[key] = childLines
        .filter(child => /^\s*-\s*/.test(child))
        .map(child => parseScalar(child.replace(/^\s*-\s*/, '').trim()))
        .filter(value => value !== '');
    } else if (childLines.length > 0) {
      const nested = {};
      for (const child of childLines) {
        const nestedPair = child.match(/^\s+([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
        if (nestedPair) nested[nestedPair[1]] = parseScalar((nestedPair[2] ?? '').trim());
      }
      result[key] = nested;
    } else {
      result[key] = '';
    }
  }

  return result;
}

function parseScalar(value) {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function isArticleCandidate(candidate) {
  if (candidate.relPath === 'index.md') return false;
  if (candidate.relPath.startsWith('@pages/')) return false;
  if (candidate.relPath.startsWith('00.目录页/')) return false;
  if (candidate.frontmatter.article === false) return false;
  return Boolean(candidate.frontmatter.title);
}

function shuffleDeterministically(items, seedValue) {
  const copy = [...items];
  const random = seededRandom(seedValue);
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function seededRandom(seedValue) {
  let state = parseInt(createHash('sha256').update(seedValue).digest('hex').slice(0, 8), 16);
  return () => {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSlug(frontmatter, relPath) {
  const permalink = typeof frontmatter.permalink === 'string' ? frontmatter.permalink : '';
  const fromPermalink = permalink.split('/').filter(Boolean).at(-1);
  const source = fromPermalink || basename(relPath, '.md') || sha256(relPath).slice(0, 8);
  const sanitized = sanitizeFilename(source.replace(/^\d+\./, ''));
  return `vdoing-${sanitized || sha256(relPath).slice(0, 8)}`;
}

function uniqueSlug(slug, usedSlugs) {
  let candidate = slug;
  let suffix = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(candidate);
  return candidate;
}

function sanitizeFilename(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .toLowerCase();
}

function buildFrontmatter(sourceFrontmatter, relPath) {
  const title = String(sourceFrontmatter.title || basename(relPath, '.md')).trim();
  const sourceCategories = normalizeList(sourceFrontmatter.categories);
  const derivedCategories = sourceCategories.length > 0 ? sourceCategories : deriveCategoriesFromPath(relPath);
  const sourceTags = normalizeList(sourceFrontmatter.tags);

  const frontmatter = {
    title,
    date: normalizeDate(sourceFrontmatter.date),
    categories: uniqueValues(derivedCategories),
    author: normalizeAuthor(sourceFrontmatter.author),
    vdoing_source: normalizePath(join('docs', relPath)),
    vdoing_repo: `https://github.com/xugaoyi/vuepress-theme-vdoing/tree/${sourceShortCommit}`
  };

  if (sourceTags.length > 0) {
    frontmatter.tags = sourceTags;
  }

  for (const [key, value] of Object.entries(sourceFrontmatter)) {
    if (!vuepressFields.has(key) && !(key in frontmatter) && value !== '') {
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return uniqueValues(value.map(item => String(item).trim()).filter(item => item && item.toLowerCase() !== 'null'));
  }
  if (typeof value === 'string' && value.trim() && value.trim().toLowerCase() !== 'null') return [value.trim()];
  return [];
}

function deriveCategoriesFromPath(relPath) {
  return relPath
    .split('/')
    .slice(0, -1)
    .map(part => part.replace(/^\d+\./, '').trim())
    .filter(Boolean)
    .slice(0, 2);
}

function uniqueValues(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const normalized = String(value).trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return result;
}

function normalizeDate(value) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  return '2020-01-01 00:00:00';
}

function normalizeAuthor(author) {
  if (typeof author === 'string' && author.trim()) return author.trim();
  if (author && typeof author === 'object') {
    if (typeof author.name === 'string' && author.name.trim()) return author.name.trim();
  }
  return 'xugaoyi';
}

function dumpFrontmatter(frontmatter) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(frontmatter)) {
    writeYamlValue(lines, key, value);
  }
  lines.push('---');
  return lines.join('\n');
}

function writeYamlValue(lines, key, value) {
  if (Array.isArray(value)) {
    lines.push(`${key}:`);
    for (const item of value) lines.push(`  - ${quoteYamlScalar(item)}`);
  } else if (value && typeof value === 'object') {
    lines.push(`${key}:`);
    for (const [nestedKey, nestedValue] of Object.entries(value)) {
      lines.push(`  ${nestedKey}: ${quoteYamlScalar(nestedValue)}`);
    }
  } else {
    lines.push(`${key}: ${quoteYamlScalar(value)}`);
  }
}

function quoteYamlScalar(value) {
  const scalar = String(value ?? '');
  if (scalar === '') return "''";
  if (/[:{}\[\],&*#?|<>=!%@`'"]|\s$|^\s|^-|^(true|false|null|~)$/i.test(scalar)) {
    return JSON.stringify(scalar);
  }
  return scalar;
}

async function transformMarkdownBody(body, context) {
  const normalized = sanitizeResidualVuePressTokens(convertVuePressSyntax(body));
  const lines = normalized.replace(/\r\n/g, '\n').split('\n');
  const output = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      output.push(line);
      continue;
    }
    if (inFence) {
      output.push(line);
      continue;
    }
    output.push(await rewriteImageReferences(line, context));
  }

  return output.join('\n').replace(/\n{4,}/g, '\n\n\n');
}

function convertVuePressSyntax(body) {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const output = [];
  let inFence = false;
  let admonition = null;
  let passthroughContainer = false;
  let demoFence = false;
  let htmlFence = null;

  for (const line of lines) {
    if (htmlFence) {
      output.push(line);
      if (new RegExp(`</${htmlFence}>`, 'i').test(line) || (htmlFence === 'script' && /<\/script>/i.test(line))) {
        output.push('```');
        htmlFence = null;
      }
      continue;
    }

    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      output.push(line);
      continue;
    }

    if (inFence) {
      output.push(line);
      continue;
    }

    if (demoFence) {
      if (/^:{3,4}\s*$/.test(line)) {
        output.push('```');
        demoFence = false;
      } else {
        output.push(line);
      }
      continue;
    }

    if (admonition) {
      if (/^:{3,4}\s*$/.test(line)) {
        admonition = null;
      } else {
        output.push(line.trim() ? `> ${line}` : '>');
      }
      continue;
    }

    if (passthroughContainer) {
      if (/^:{3,4}\s*$/.test(line)) {
        passthroughContainer = false;
      } else {
        output.push(line);
      }
      continue;
    }

    const container = line.match(/^:{3,4}\s*([A-Za-z]+)?\s*(.*?)\s*$/);
    if (container) {
      const type = (container[1] || '').toLowerCase();
      const title = container[2] || '';
      if (['tip', 'warning', 'danger', 'details', 'note', 'theorem'].includes(type)) {
        const label = type === 'danger' ? '注意' : type === 'warning' ? '警告' : type === 'details' ? '详情' : type === 'theorem' ? '引述' : '提示';
        output.push(`> **${label}${title ? `：${title}` : ''}**`);
        admonition = type;
      } else if (type === 'demo') {
        output.push('```html');
        demoFence = true;
      } else if (['center', 'right'].includes(type)) {
        passthroughContainer = true;
      } else if (!type) {
        output.push(line);
      } else {
        output.push(`> **${title || type}**`);
        admonition = type;
      }
      continue;
    }

    if (/^\s*\[TOC\]\s*$/i.test(line)) {
      continue;
    }

    const htmlBlock = line.match(/^\s*<(template|style|script)(\s|>|$)/i);
    if (htmlBlock) {
      const tag = htmlBlock[1].toLowerCase();
      output.push(tag === 'style' ? '```css' : tag === 'script' ? '```html' : '```html');
      output.push(line);
      if (new RegExp(`</${tag}>`, 'i').test(line)) {
        output.push('```');
      } else {
        htmlFence = tag;
      }
      continue;
    }

    output.push(line);
  }

  if (htmlFence || demoFence) output.push('```');
  return output.join('\n');
}

function sanitizeResidualVuePressTokens(body) {
  return body
    .replace(/\[TOC\]/gi, 'TOC')
    .replace(/:::/g, '---')
    .replace(/<script/gi, '&lt;script')
    .replace(/<\/script>/gi, '&lt;/script>')
    .replace(/<template/gi, '&lt;template')
    .replace(/<\/template>/gi, '&lt;/template>')
    .replace(/<style scoped/gi, '&lt;style scoped');
}

async function rewriteImageReferences(line, context) {
  let rewritten = line;
  const markdownMatches = [...rewritten.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(\s+(['"]).*?\4)?\)/g)];
  for (let index = markdownMatches.length - 1; index >= 0; index -= 1) {
    const match = markdownMatches[index];
    const original = match[0];
    const alt = match[1];
    const rawTarget = match[2];
    const title = match[3] || '';
    const processed = await processImageTarget(rawTarget, context);
    const replacement = processed
      ? `![${alt}](${processed.publicPath}${title})`
      : `\\${original}`;
    rewritten = replaceAt(rewritten, match.index, original.length, replacement);
  }

  const htmlMatches = [...rewritten.matchAll(/<img\b[^>]*\bsrc=(['"])(.*?)\1[^>]*>/gi)];
  for (let index = htmlMatches.length - 1; index >= 0; index -= 1) {
    const match = htmlMatches[index];
    const original = match[0];
    const rawTarget = match[2];
    const processed = await processImageTarget(rawTarget, context);
    const replacement = processed ? original.replace(rawTarget, processed.publicPath) : escapeHtmlImage(original);
    rewritten = replaceAt(rewritten, match.index, original.length, replacement);
  }

  return rewritten;
}

async function processImageTarget(rawTarget, context) {
  if (!rawTarget || rawTarget.startsWith('#') || rawTarget.startsWith('data:')) {
    return null;
  }

  const target = rawTarget.replace(/^<|>$/g, '').trim();
  const source = resolveImageSource(target, context.sourceFile);
  if (!source) {
    context.skippedImageReferences.push({ original: rawTarget, reason: 'unresolved-placeholder' });
    return null;
  }

  const hash = sha256(source.identity).slice(0, 10);
  const base = sanitizeFilename(source.basename || 'image');
  const extension = normalizeImageExtension(source.extension) || '.png';
  const fileName = `${base || 'image'}-${hash}${extension}`;
  const targetPath = join(context.postImageDir, fileName);
  const publicPath = `/img/vdoing/${context.slug}/${fileName}`;

  if (!existsSync(targetPath)) {
    if (source.kind === 'local') {
      copyFileSync(source.path, targetPath);
    } else {
      await downloadRemoteImage(source.url, targetPath);
    }
  }

  const record = {
    original: rawTarget,
    target: publicPath,
    kind: source.kind
  };
  context.imageRecords.push(record);
  return { publicPath };
}

function resolveImageSource(target, sourceFile) {
  const normalizedTarget = target.startsWith('//') ? `https:${target}` : target;

  if (/^https?:\/\//i.test(normalizedTarget)) {
    const parsed = new URL(normalizedTarget);
    const rawBase = basename(parsed.pathname) || 'image';
    return {
      kind: 'remote',
      url: normalizedTarget,
      identity: normalizedTarget,
      basename: rawBase.replace(extname(rawBase), ''),
      extension: extname(rawBase)
    };
  }

  if (normalizedTarget.startsWith('/img/')) {
    const localPath = join(docsDir, '.vuepress', 'public', normalizedTarget);
    if (existsSync(localPath)) return localImageSource(localPath, normalizedTarget);
    return null;
  }

  if (normalizedTarget.startsWith('/')) {
    const localPath = join(docsDir, '.vuepress', 'public', normalizedTarget);
    if (existsSync(localPath)) return localImageSource(localPath, normalizedTarget);
    return null;
  }

  const localPath = resolve(dirname(sourceFile), decodeURI(normalizedTarget));
  if (existsSync(localPath) && statSync(localPath).isFile()) {
    return localImageSource(localPath, normalizedTarget);
  }

  return null;
}

function localImageSource(localPath, identity) {
  const rawBase = basename(localPath) || 'image';
  return {
    kind: 'local',
    path: localPath,
    identity,
    basename: rawBase.replace(extname(rawBase), ''),
    extension: extname(rawBase)
  };
}

function normalizeImageExtension(extension) {
  const normalized = extension.split('?')[0].toLowerCase();
  return imageExts.has(normalized) ? normalized : '';
}

async function downloadRemoteImage(url, targetPath) {
  let lastError;
  for (const candidateUrl of remoteUrlCandidates(url)) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      let timeout;
      try {
        const controller = new AbortController();
        timeout = setTimeout(() => controller.abort(), 30000);
        const response = await fetch(candidateUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 Vdoing Hexo Importer'
          }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        writeFileSync(targetPath, buffer);
        return;
      } catch (error) {
        lastError = error;
        await sleep(500 * attempt);
      } finally {
        if (timeout) clearTimeout(timeout);
      }
    }
  }
  throw new Error(`Failed to download image ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

function remoteUrlCandidates(url) {
  const candidates = [url];
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:') {
      const httpsUrl = new URL(url);
      httpsUrl.protocol = 'https:';
      candidates.push(httpsUrl.toString());
    }

    const rawFromCdn = githubCdnToRawUrl(parsed);
    if (rawFromCdn) candidates.push(rawFromCdn);

    const rawFromGithub = githubRawPageToRawUrl(parsed);
    if (rawFromGithub) candidates.push(rawFromGithub);
  } catch {
    // Keep the original URL as the only candidate.
  }
  return uniqueValues(candidates);
}

function githubCdnToRawUrl(parsed) {
  if (!['jsd.cdn.zzko.cn', 'cdn.jsdelivr.net'].includes(parsed.hostname)) return '';
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments[0] !== 'gh' || segments.length < 4) return '';

  const owner = segments[1];
  const repoAndRef = segments[2];
  const atIndex = repoAndRef.indexOf('@');
  const repo = atIndex >= 0 ? repoAndRef.slice(0, atIndex) : repoAndRef;
  const ref = atIndex >= 0 ? repoAndRef.slice(atIndex + 1) : 'master';
  const filePath = segments.slice(3).join('/');
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${filePath}`;
}

function githubRawPageToRawUrl(parsed) {
  if (parsed.hostname !== 'github.com') return '';
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length < 5 || segments[2] !== 'raw') return '';

  const [owner, repo, , ref, ...fileSegments] = segments;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${fileSegments.join('/')}`;
}

function sleep(ms) {
  return new Promise(resolveSleep => setTimeout(resolveSleep, ms));
}

function replaceAt(input, index, length, replacement) {
  return `${input.slice(0, index)}${replacement}${input.slice(index + length)}`;
}

function escapeHtmlImage(value) {
  return `\`${value.replace(/`/g, '\\`')}\``;
}

function buildSourceNote(frontmatter, relPath) {
  const sourcePath = normalizePath(join('docs', relPath));
  const sourceUrl = `https://github.com/xugaoyi/vuepress-theme-vdoing/blob/${sourceShortCommit}/${sourcePath.split('/').map(encodeURIComponent).join('/')}`;
  const author = normalizeAuthor(frontmatter.author);
  return [
    '---',
    '',
    `> 来源：本文导入自 [xugaoyi/vuepress-theme-vdoing](${sourceUrl}) 的 \`${sourcePath}\`。`,
    `> 原作者：${author}。许可证：[MIT](https://github.com/xugaoyi/vuepress-theme-vdoing/blob/${sourceShortCommit}/LICENSE)。`
  ].join('\n');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizePath(value) {
  return value.split('\\').join('/');
}
