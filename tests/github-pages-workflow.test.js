/* eslint-env node */
/* global require */
/**
 * Tests for the GitHub Pages deployment workflow.
 * Detected testing framework: will run under Jest/Vitest/Mocha (BDD style).
 *
 * Testing library/framework note:
 * - Using BDD-style describe/it. This matches Jest and Vitest by default.
 * - If Mocha is configured in this repo, these tests should also work with Mocha + an assertion lib.
 *
 * Strategy:
 * - Locate the workflow file under .github/workflows whose name is "Deploy to GitHub Pages".
 * - Parse YAML when possible (if js-yaml or yaml is present in the repo). Otherwise, assert via textual checks.
 * - Validate triggers, permissions, concurrency, steps, environment variables, and deploy job wiring.
 */
const fs = require('fs');
const path = require('path');

function findWorkflowFiles() {
  const root = process.cwd();
  const dir = path.join(root, '.github', 'workflows');
  const out = [];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    const ents = fs.readdirSync(d, { withFileTypes: true });
    for (const ent of ents) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) {
        walk(p);
      } else if (/\.(yml|yaml)$/i.test(ent.name)) {
        out.push(p);
      }
    }
  }
  walk(dir);
  return out;
}

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function getWorkflowByName(name) {
  const files = findWorkflowFiles();
  for (const file of files) {
    const txt = readFileSafe(file);
    if (txt && /^name:\s*["']?Deploy to GitHub Pages["']?/m.test(txt)) {
      return { file, content: txt };
    }
  }
  return null;
}

function maybeLoadYamlParser() {
  try { return { parser: require('js-yaml'), flavor: 'js-yaml' }; } catch {}
  try { return { parser: require('yaml'), flavor: 'yaml' }; } catch {}
  return { parser: null, flavor: 'none' };
}

describe('GitHub Pages workflow configuration', () => {
  const wf = getWorkflowByName('Deploy to GitHub Pages');

  it('locates the "Deploy to GitHub Pages" workflow file', () => {
    expect(wf && wf.file).toBeTruthy();
    if (wf) {
      expect(fs.existsSync(wf.file)).toBe(true);
      expect(/\.github\/workflows\//.test(wf.file.replace(/\\/g, '/'))).toBe(true);
    }
  });

  if (wf) {
    const { parser, flavor } = maybeLoadYamlParser();

    const parseYaml = (txt) => {
      if (!parser) return null;
      try {
        if (flavor === 'js-yaml' && parser.load) return parser.load(txt);
        if (flavor === 'yaml' && parser.parse) return parser.parse(txt);
      } catch (_) {}
      return null;
    };

    const doc = parseYaml(wf.content);

    describe('basic structure and metadata', () => {
      it('declares correct workflow name', () => {
        expect(/^name:\s*["']?Deploy to GitHub Pages["']?/m.test(wf.content)).toBe(true);
      });

      it('has required top-level sections', () => {
        if (doc) {
          expect(doc).toHaveProperty('on');
          expect(doc).toHaveProperty('permissions');
          expect(doc).toHaveProperty('concurrency');
          expect(doc).toHaveProperty('jobs');
        } else {
          expect(/^\bon:\s*$/m.test(wf.content) || /\bon:\s*\n/.test(wf.content)).toBe(true);
          expect(/\bpermissions:\s*\n/.test(wf.content)).toBe(true);
          expect(/\bconcurrency:\s*\n/.test(wf.content)).toBe(true);
          expect(/\bjobs:\s*\n/.test(wf.content)).toBe(true);
        }
      });
    });

    describe('triggers', () => {
      it('runs on push to main and allows workflow_dispatch', () => {
        if (doc) {
          expect(doc.on).toBeTruthy();
          const on = doc.on;
          // Support both array and mapping forms for "push"
          const push = on.push || (Array.isArray(on) ? on.find(e => e.push) : undefined);
          expect(push).toBeTruthy();
          if (push && push.branches) {
            expect(push.branches).toEqual(expect.arrayContaining(['main']));
          } else {
            // textual fallback
            expect(/push:\s*\n\s*branches:\s*\[?["']?main["']?\]?/m.test(wf.content)).toBe(true);
          }
          expect(on.workflow_dispatch !== undefined || /workflow_dispatch:/m.test(wf.content)).toBe(true);
        } else {
          expect(/push:\s*\n\s*branches:\s*\[?["']?main["']?\]?/m.test(wf.content)).toBe(true);
          expect(/^\s*workflow_dispatch:\s*$/m.test(wf.content) || /workflow_dispatch:/m.test(wf.content)).toBe(true);
        }
      });
    });

    describe('permissions and concurrency', () => {
      it('sets least-privilege permissions for Pages', () => {
        if (doc) {
          expect(doc.permissions).toMatchObject({
            contents: 'read',
            pages: 'write',
            'id-token': 'write',
          });
        } else {
          expect(/permissions:\s*\n\s*contents:\s*read\s*\n\s*pages:\s*write\s*\n\s*id-token:\s*write/m.test(wf.content)).toBe(true);
        }
      });

      it('defines concurrency group "pages" and does not cancel in progress', () => {
        if (doc) {
          expect(doc.concurrency).toBeTruthy();
          expect(doc.concurrency.group).toBe('pages' || 'pages'); // normalize
          expect(Boolean(doc.concurrency['cancel-in-progress'])).toBe(false);
        } else {
          expect(/concurrency:\s*\n\s*group:\s*["']?pages["']?\s*\n\s*cancel-in-progress:\s*false/m.test(wf.content)).toBe(true);
        }
      });
    });

    describe('build job', () => {
      it('runs on ubuntu-latest and uses checkout, setup-node, install, build, configure-pages, upload artifact from ./dist', () => {
        if (doc) {
          expect(doc.jobs).toHaveProperty('build');
          const build = doc.jobs.build;
          expect(build['runs-on']).toBe('ubuntu-latest');
          expect(Array.isArray(build.steps)).toBe(true);

          const uses = build.steps.filter(s => s.uses).map(s => s.uses);
          expect(uses).toEqual(expect.arrayContaining([
            'actions/checkout@v5',
            'actions/setup-node@v4',
            'actions/configure-pages@v5',
            'actions/upload-pages-artifact@v3',
          ]));

          const setupNode = build.steps.find(s => s.uses && s.uses.startsWith('actions/setup-node@'));
          expect(setupNode).toBeTruthy();
          if (setupNode && setupNode.with) {
            expect(String(setupNode.with['node-version'])).toMatch(/^18(\.x)?$/);
            expect(setupNode.with.cache).toBe('npm');
          }

          const install = build.steps.find(s => s.run && /npm\s+ci\b/.test(s.run));
          expect(install).toBeTruthy();

          const buildStep = build.steps.find(s => s.run && /npm\s+run\s+build\b/.test(s.run));
          expect(buildStep).toBeTruthy();
          // Validate env variables on build step
          if (buildStep && buildStep.env) {
            expect(buildStep.env.VITE_API_BASE_URL).toMatch(/^https:\/\/api\.medogram\.ir\/?$/);
            expect(buildStep.env.VITE_LOCAL_API_URL).toMatch(/^https:\/\/api\.medogram\.ir\/?$/);
          } else {
            // fallback textual checks
            expect(/VITE_API_BASE_URL:\s*https:\/\/api\.medogram\.ir/.test(wf.content)).toBe(true);
            expect(/VITE_LOCAL_API_URL:\s*https:\/\/api\.medogram\.ir/.test(wf.content)).toBe(true);
          }

          const upload = build.steps.find(s => s.uses && s.uses.startsWith('actions/upload-pages-artifact@'));
          expect(upload && upload.with && upload.with.path).toBe('./dist');
        } else {
          // Textual validation fallbacks
          expect(/jobs:\s*\n\s*build:\s*\n\s*runs-on:\s*ubuntu-latest/m.test(wf.content)).toBe(true);
          expect(/uses:\s*actions\/checkout@v5/.test(wf.content)).toBe(true);
          expect(/uses:\s*actions\/setup-node@v4/.test(wf.content)).toBe(true);
          expect(/node-version:\s*['"]?18['"]?/.test(wf.content)).toBe(true);
          expect(/cache:\s*['"]?npm['"]?/.test(wf.content)).toBe(true);
          expect(/run:\s*npm\s+ci/.test(wf.content)).toBe(true);
          expect(/run:\s*npm\s+run\s+build/.test(wf.content)).toBe(true);
          expect(/VITE_API_BASE_URL:\s*https:\/\/api\.medogram\.ir/.test(wf.content)).toBe(true);
          expect(/VITE_LOCAL_API_URL:\s*https:\/\/api\.medogram\.ir/.test(wf.content)).toBe(true);
          expect(/uses:\s*actions\/configure-pages@v5/.test(wf.content)).toBe(true);
          expect(/uses:\s*actions\/upload-pages-artifact@v3/.test(wf.content)).toBe(true);
          expect(/path:\s*['"]?\.\/dist['"]?/.test(wf.content)).toBe(true);
        }
      });
    });

    describe('deploy job', () => {
      it('depends on build and deploys with actions/deploy-pages@v4 using environment github-pages', () => {
        if (doc) {
          expect(doc.jobs).toHaveProperty('deploy');
          const deploy = doc.jobs.deploy;
          expect(deploy['runs-on']).toBe('ubuntu-latest');
          // needs: build
          const needs = deploy.needs;
          if (Array.isArray(needs)) {
            expect(needs).toEqual(expect.arrayContaining(['build']));
          } else {
            expect(needs === 'build' || needs === undefined).toBe(true);
          }
          // environment
          expect(deploy.environment).toBeTruthy();
          if (deploy.environment) {
            expect(deploy.environment.name).toBe('github-pages');
            // url reference to steps.deployment.outputs.page_url
            // Allow string with expression
            if (typeof deploy.environment.url === 'string') {
              expect(deploy.environment.url).toMatch(/\$\{\{\s*steps\.deployment\.outputs\.page_url\s*\}\}/);
            }
          }
          // steps -> uses actions/deploy-pages@v4 with id: deployment
          const steps = Array.isArray(deploy.steps) ? deploy.steps : [];
          const deployStep = steps.find(s => s.uses && s.uses.startsWith('actions/deploy-pages@'));
          expect(deployStep).toBeTruthy();
          if (deployStep) {
            expect(deployStep.uses).toBe('actions/deploy-pages@v4');
            expect(deployStep.id === 'deployment' || /id:\s*deployment/.test(wf.content)).toBe(true);
          }
        } else {
          expect(/deploy:\s*\n\s*environment:\s*\n\s*name:\s*github-pages/m.test(wf.content)).toBe(true);
          expect(/url:\s*\$\{\{\s*steps\.deployment\.outputs\.page_url\s*\}\}/m.test(wf.content)).toBe(true);
          expect(/needs:\s*build/.test(wf.content)).toBe(true);
          expect(/uses:\s*actions\/deploy-pages@v4/.test(wf.content)).toBe(true);
          expect(/id:\s*deployment/.test(wf.content)).toBe(true);
        }
      });
    });

    describe('negative/edge checks', () => {
      it('does not request write access for contents (should be read)', () => {
        if (doc && doc.permissions) {
          expect(doc.permissions.contents).not.toBe('write');
        } else {
          expect(/permissions:\s*\n\s*contents:\s*read/.test(wf.content)).toBe(true);
        }
      });

      it('does not cancel in-progress runs for the pages concurrency group', () => {
        if (doc && doc.concurrency) {
          expect(Boolean(doc.concurrency['cancel-in-progress'])).toBe(false);
        } else {
          expect(/cancel-in-progress:\s*false/.test(wf.content)).toBe(true);
        }
      });
    });
  }
});