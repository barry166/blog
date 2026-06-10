import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

const tutorialDir = process.env.TINY_CLAW_TUTORIAL_DIR
  || '/Users/barry/Documents/domain/code/release/tiny-claw/docs/tutorial';

const postsOutDir = join(projectRoot, 'source', '_posts', 'harness-agent');
const dataOutDir = join(projectRoot, 'source', '_data');
const manifestPath = join(dataOutDir, 'harness-agent-import.json');

const seriesName = '从零实现Harness Agent';
const displaySeriesName = '从零实现 Harness Agent';
const projectRepoUrl = 'https://github.com/barry166/tiny-claw';
const baseDate = '2026-06-09';
const tags = ['Agent', 'Python', 'tiny-claw', 'Harness Agent'];

const slugSuffixOverrides = new Map([
  [1, 'python-agent-cli-framework'],
  [2, 'provider-neutral-react-main-loop'],
  [3, 'provider-adapter-layer'],
  [4, 'controlled-tool-system'],
  [5, 'safe-local-edit-tool'],
  [6, 'parallel-tool-executor'],
  [7, 'skill-aware-context-engine'],
  [8, 'session-isolated-memory'],
  [9, 'resumable-plan-mode'],
  [10, 'feishu-event-service'],
  [11, 'context-compactor'],
  [12, 'tool-error-sop-fallback'],
  [13, 'agent-cli-testing-strategy'],
  [14, 'edit-degraded-matching-pipeline'],
  [15, 'real-provider-edit-demo'],
  [16, 'tool-middleware-chain'],
  [17, 'tool-policy-allowlist-denylist'],
  [18, 'human-approval-middleware'],
  [19, 'approval-checkpoint-resume'],
  [20, 'feishu-approval-adapter'],
  [21, 'approval-flow-testing'],
  [22, 'mainloop-approval-resume-refactor']
]);

main();

function main() {
  if (!existsSync(tutorialDir)) {
    throw new Error(`Tutorial directory does not exist: ${tutorialDir}`);
  }

  const articles = readDirSorted(tutorialDir)
    .filter(name => /^\d{2}-.+\.md$/.test(name))
    .map(name => {
      const file = join(tutorialDir, name);
      if (!statSync(file).isFile()) return null;
      const order = Number(name.slice(0, 2));
      return { order, sourceName: name, sourcePath: file, ...parseMarkdown(file) };
    })
    .filter(Boolean)
    .sort((left, right) => left.order - right.order);

  if (articles.length === 0) {
    throw new Error(`No tutorial articles found in ${tutorialDir}.`);
  }

  for (let index = 0; index < articles.length; index += 1) {
    const expectedOrder = index + 1;
    if (articles[index].order !== expectedOrder) {
      throw new Error(`Missing tutorial article ${String(expectedOrder).padStart(2, '0')}.`);
    }
  }

  rmSync(postsOutDir, { recursive: true, force: true });
  mkdirSync(postsOutDir, { recursive: true });
  mkdirSync(dataOutDir, { recursive: true });

  const manifest = {
    sourceDir: tutorialDir,
    importedAt: new Date().toISOString(),
    series: seriesName,
    importedCount: articles.length,
    posts: []
  };

  for (const article of articles) {
    const slug = makeSlug(article.order, article.sourceName);
    const targetRelPath = normalizePath(join('source/_posts/harness-agent', `${slug}.md`));
    const targetPath = join(projectRoot, targetRelPath);
    const output = buildPost(article);
    writeFileSync(targetPath, output, 'utf8');

    manifest.posts.push({
      order: article.order,
      title: article.title,
      displayTitle: makeDisplayTitle(article),
      source: normalizePath(relative(tutorialDir, article.sourcePath)),
      target: targetRelPath,
      slug,
      date: makeDate(article.order)
    });
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Imported ${articles.length} Harness Agent tutorial articles.`);
  console.log(`Posts: ${normalizePath(relative(projectRoot, postsOutDir))}`);
  console.log(`Manifest: ${normalizePath(relative(projectRoot, manifestPath))}`);
}

function readDirSorted(root) {
  return readdirSync(root).sort();
}

function parseMarkdown(file) {
  const raw = readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const h1Match = raw.match(/^#\s+(.+?)\s*$/m);
  const title = h1Match ? h1Match[1].trim() : basename(file, '.md').replace(/^\d{2}-/, '');
  const body = raw.replace(/^#\s+.+?\s*\n+/, '').trim();
  return { title, body };
}

function buildPost(article) {
  const frontmatter = {
    title: makeDisplayTitle(article),
    date: makeDate(article.order),
    categories: ['AI', seriesName],
    tags,
    author: 'Barry',
    series: seriesName,
    series_order: article.order,
    tiny_claw_source: normalizePath(join('docs/tutorial', article.sourceName))
  };
  const sourceNote = [
    '---',
    '',
    `> 来源：本文整理自 \`tiny-claw/${normalizePath(join('docs/tutorial', article.sourceName))}\`。`,
    `> 项目地址：[barry166/tiny-claw](${projectRepoUrl})。`
  ].join('\n');

  return `${dumpFrontmatter(frontmatter)}\n${article.body}\n\n${sourceNote}\n`;
}

function makeDisplayTitle(article) {
  const orderName = formatChineseOrder(article.order);
  return `${orderName}、${displaySeriesName}：${article.title}`;
}

function makeSlug(order, sourceName = '') {
  const suffix = slugSuffixOverrides.get(order) || slugFromSourceName(sourceName);
  if (!suffix) throw new Error(`Missing slug suffix for article ${order}.`);
  return `harness-agent-${String(order).padStart(2, '0')}-${suffix}`;
}

function slugFromSourceName(sourceName) {
  return sourceName
    .replace(/\.md$/i, '')
    .replace(/^\d{2}-/, '')
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function formatChineseOrder(value) {
  if (!Number.isInteger(value) || value <= 0 || value > 99) {
    throw new Error(`Unsupported Chinese order value: ${value}.`);
  }

  const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  if (value <= 10) return value === 10 ? '十' : digits[value];
  if (value < 20) return `十${digits[value % 10]}`;
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return `${digits[tens]}十${digits[ones]}`;
}

function makeDate(order) {
  const hour = 9 + Math.floor((order - 1) / 60);
  const minute = (order - 1) % 60;
  return `${baseDate} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
}

function dumpFrontmatter(frontmatter) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(frontmatter)) {
    writeYamlValue(lines, key, value);
  }
  lines.push('---');
  return `${lines.join('\n')}\n`;
}

function writeYamlValue(lines, key, value) {
  if (Array.isArray(value)) {
    lines.push(`${key}:`);
    for (const item of value) lines.push(`  - ${quoteYamlScalar(item)}`);
    return;
  }

  lines.push(`${key}: ${quoteYamlScalar(value)}`);
}

function quoteYamlScalar(value) {
  const scalar = String(value ?? '');
  if (scalar === '') return "''";
  if (/[:{}\[\],&*#?|<>=!%@`'"]|\s$|^\s|^-|^(true|false|null|~)$/i.test(scalar)) {
    return JSON.stringify(scalar);
  }
  return scalar;
}

function normalizePath(path) {
  return path.replace(/\\/g, '/');
}
