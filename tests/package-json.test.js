// Testing framework: Node.js built-in test runner (node:test) + node:assert/strict
// Scope: Validates package.json fields and constraints reflecting the PR changes.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pkgUrl = new URL('../package.json', import.meta.url);

async function loadPkg() {
  const raw = await readFile(pkgUrl, 'utf8');
  return JSON.parse(raw);
}

function isObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }
function isCaretSemver(s) { return /^\^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(s); }
function isPlainSemver(s) { return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(s); }
function baseVersion(s) { return s.replace(/^[\^~]/, '').split('-')[0]; }
function majorOf(s) {
  const ver = baseVersion(s);
  const m = ver.match(/^(\d+)\./);
  return m ? Number(m[1]) : NaN;
}
function partsOf(s) {
  const [maj, min, pat] = baseVersion(s).split('.').map(n => Number(n));
  return { maj, min, pat };
}
function parseMinEngine(range) {
  const m = /^>=\s*(\d+)\.(\d+)\.(\d+)/.exec(range || '');
  return m ? { maj: Number(m[1]), min: Number(m[2]), pat: Number(m[3]) } : null;
}

test('package.json: basic metadata matches expected values', async () => {
  const pkg = await loadPkg();
  assert.equal(pkg.name, 'medogram-modern');
  assert.ok(isPlainSemver(pkg.version), 'version must be a plain semver');
  assert.equal(pkg.version, '2.0.0');
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.description, 'Modern medical consultation platform with AI-powered chat interface');
  assert.equal(pkg.author, 'Medogram Team');
});

test('package.json: scripts are present and correct', async () => {
  const pkg = await loadPkg();
  assert.ok(isObject(pkg.scripts), 'scripts must be an object');
  assert.equal(pkg.scripts.dev, 'vite');
  assert.equal(pkg.scripts.build, 'vite build');
  assert.ok(typeof pkg.scripts.lint === 'string' && pkg.scripts.lint.includes('eslint .'), 'lint script must run eslint .');
  assert.ok(pkg.scripts.lint.includes('--report-unused-disable-directives'), 'lint: must include --report-unused-disable-directives');
  assert.ok(pkg.scripts.lint.includes('--max-warnings 0'), 'lint: must include --max-warnings 0');
  assert.equal(pkg.scripts.preview, 'vite preview');
});

test('package.json: dependencies include required packages with exact versions (caret ranges)', async () => {
  const expected = {
    "@headlessui/react": "^2.2.0",
    "@heroicons/react": "^2.1.5",
    "@hookform/resolvers": "^5.2.1",
    "@tailwindcss/postcss": "^4.1.12",
    "@tanstack/react-query": "^5.59.0",
    "axios": "^1.8.2",
    "clsx": "^2.1.1",
    "framer-motion": "^11.3.30",
    "lucide-react": "^0.539.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.53.0",
    "react-router-dom": "^7.8.1",
    "react-toastify": "^10.0.5",
    "tailwind-merge": "^3.3.1",
    "yup": "^1.4.0",
    "zustand": "^5.0.1"
  };
  const pkg = await loadPkg();
  assert.ok(isObject(pkg.dependencies), 'dependencies must be an object');
  for (const [name, version] of Object.entries(expected)) {
    assert.equal(pkg.dependencies?.[name], version, `Dependency ${name} must equal ${version}`);
    assert.ok(isCaretSemver(pkg.dependencies[name]), `Dependency ${name} must use caret semver`);
  }
});

test('package.json: devDependencies include required packages with exact versions (caret ranges)', async () => {
  const expected = {
    "@eslint/js": "^9.0.0",
    "@types/node": "^24.3.0",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^5.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.0.0",
    "eslint-plugin-react": "^7.36.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "globals": "^16.3.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^4.1.12",
    "vite": "^7.1.2"
  };
  const pkg = await loadPkg();
  assert.ok(isObject(pkg.devDependencies), 'devDependencies must be an object');
  for (const [name, version] of Object.entries(expected)) {
    assert.equal(pkg.devDependencies?.[name], version, `DevDependency ${name} must equal ${version}`);
    assert.ok(isCaretSemver(pkg.devDependencies[name]), `DevDependency ${name} must use caret semver`);
  }
});

test('package.json: engine constraints and major versions sanity', async () => {
  const pkg = await loadPkg();
  assert.ok(isObject(pkg.engines), 'engines must be an object');
  const minNode = parseMinEngine(pkg.engines.node);
  assert.ok(minNode, 'engines.node must be a >= semver range');
  assert.ok(minNode.maj >= 18, 'engines.node must be >= 18.0.0');

  // Major version expectations to guard PR-upgraded stacks
  assert.equal(majorOf(pkg.dependencies['react-router-dom']), 7, 'react-router-dom major should be 7');
  assert.equal(majorOf(pkg.devDependencies['tailwindcss']), 4, 'tailwindcss major should be 4');
  assert.equal(majorOf(pkg.devDependencies['vite']), 7, 'vite major should be 7');
  assert.equal(majorOf(pkg.devDependencies['eslint']), 9, 'eslint major should be 9');
});

test('package.json: keywords include essential tags and are unique', async () => {
  const required = ['react','vite','medical','healthcare','ai','chat','consultation','modern','responsive'];
  const pkg = await loadPkg();
  assert.ok(Array.isArray(pkg.keywords), 'keywords must be an array');
  for (const k of required) {
    assert.ok(pkg.keywords.includes(k), `keywords must include "${k}"`);
  }
  const unique = new Set(pkg.keywords);
  assert.equal(unique.size, pkg.keywords.length, 'keywords should not contain duplicates');
});

test('package.json: consistency checks (no dep duplication, React alignment)', async () => {
  const pkg = await loadPkg();

  // No overlap between deps and devDeps
  const deps = new Set(Object.keys(pkg.dependencies || {}));
  const devDeps = new Set(Object.keys(pkg.devDependencies || {}));
  const overlap = [...deps].filter(d => devDeps.has(d));
  assert.deepEqual(overlap, [], `No overlapping packages between dependencies and devDependencies: ${overlap.join(', ')}`);

  // React and ReactDOM versions aligned (major.minor.patch)
  assert.ok(pkg.dependencies?.react && pkg.dependencies?.['react-dom'], 'react and react-dom must be present');
  assert.deepEqual(
    partsOf(pkg.dependencies.react),
    partsOf(pkg.dependencies['react-dom']),
    'react and react-dom versions must match exactly (ignoring range prefix)'
  );
});

test('package.json: all dependency ranges use caret (stability guard)', async () => {
  const pkg = await loadPkg();
  for (const [name, ver] of Object.entries(pkg.dependencies || {})) {
    assert.ok(isCaretSemver(ver), `Dependency ${name} must use ^ range (found "${ver}")`);
  }
  for (const [name, ver] of Object.entries(pkg.devDependencies || {})) {
    assert.ok(isCaretSemver(ver), `DevDependency ${name} must use ^ range (found "${ver}")`);
  }
});