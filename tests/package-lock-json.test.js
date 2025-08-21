/* 
  package-lock-json.test.js

  Testing library/framework: This suite uses standard describe/it/expect globals,
  compatible with Jest or Vitest, matching common repository conventions.

  Focus: Validate critical fields in package-lock.json that were modified in the PR diff.
  - Root package ("") metadata and dependencies/devDependencies presence and versions
  - react-router-dom lock entry and engine constraints
  - vite lock entry, engine constraints, dependencies, bin, and peerDependencies

  The tests intentionally avoid brittle full-lock assertions; they assert targeted,
  high-signal properties relevant to the diff, while being resilient to unrelated changes.
*/

const fs = require('fs');
const path = require('path');

function readLockfile() {
  const lockPath = path.resolve(process.cwd(), 'package-lock.json');
  const raw = fs.readFileSync(lockPath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error('Failed to parse package-lock.json: ' + e.message);
  }
}

// Return the "packages" map for npm lockfile v3+, or construct a map-like view
// for older shapes so tests are robust across npm versions.
function getPackagesMap(lock) {
  if (lock && typeof lock === 'object' && lock.packages && typeof lock.packages === 'object') {
    return lock.packages;
  }
  // Fallback: treat top-level keys (except common metadata) as packages
  const omit = new Set(['name', 'version', 'lockfileVersion', 'requires', 'packages']);
  const map = {};
  for (const [k, v] of Object.entries(lock || {})) {
    if (!omit.has(k)) {
      map[k] = v;
    }
  }
  return map;
}

function getRootPackage(packagesMap) {
  const root = packagesMap[''];
  if (!root || typeof root !== 'object') {
    throw new Error('Root package entry "" not found in package-lock.json');
  }
  return root;
}

describe('package-lock.json integrity (PR diff focused)', () => {
  let lock;
  let packagesMap;
  let root;

  beforeAll(() => {
    lock = readLockfile();
    packagesMap = getPackagesMap(lock);
    root = getRootPackage(packagesMap);
  });

  describe('Root package metadata and declared deps (") entry)', () => {
    it('has expected project name and version', () => {
      expect(root).toHaveProperty('name', 'medogram-modern');
      expect(root).toHaveProperty('version', '2.0.0');
    });

    it('declares required runtime dependencies with expected semver ranges', () => {
      expect(root).toHaveProperty('dependencies');
      const deps = root.dependencies || {};

      // Spot-check key deps from the diff
      expect(deps).toHaveProperty('@tanstack/react-query', '^5.59.0');
      expect(deps).toHaveProperty('axios', '^1.8.2');
      expect(deps).toHaveProperty('react', '^18.2.0');
      expect(deps).toHaveProperty('react-dom', '^18.2.0');
      expect(deps).toHaveProperty('react-router-dom', '^7.8.1');
      expect(deps).toHaveProperty('tailwind-merge', '^3.3.1');
      expect(deps).toHaveProperty('@tailwindcss/postcss', '^4.1.12');
      expect(deps).toHaveProperty('tailwindcss', undefined); // ensure not mistakenly listed under runtime; tailwindcss should be in devDependencies
    });

    it('declares expected devDependencies with expected semver ranges', () => {
      expect(root).toHaveProperty('devDependencies');
      const dev = root.devDependencies || {};

      expect(dev).toHaveProperty('@vitejs/plugin-react', '^5.0.0');
      expect(dev).toHaveProperty('vite', '^7.1.2');
      expect(dev).toHaveProperty('tailwindcss', '^4.1.12');
      expect(dev).toHaveProperty('postcss', '^8.4.49'); // as per root devDeps in diff
    });

    it('specifies Node engines constraint at root', () => {
      expect(root).toHaveProperty('engines');
      expect(root.engines).toHaveProperty('node', '>=18.0.0');
    });
  });

  describe('react-router-dom lock entry', () => {
    it('pins react-router-dom to 7.8.1 with expected metadata', () => {
      const rrd = packagesMap['node_modules/react-router-dom'];
      expect(rrd).toBeTruthy();
      expect(rrd).toHaveProperty('version', '7.8.1');
      expect(rrd).toHaveProperty('license', 'MIT');

      expect(rrd).toHaveProperty('dependencies');
      expect(rrd.dependencies).toHaveProperty('react-router', '7.8.1');

      expect(rrd).toHaveProperty('engines');
      expect(rrd.engines).toHaveProperty('node', '>=20.0.0');

      expect(rrd).toHaveProperty('peerDependencies');
      expect(rrd.peerDependencies).toMatchObject({
        react: '>=18',
        'react-dom': '>=18',
      });
    });
  });

  describe('vite lock entry', () => {
    it('pins vite to 7.1.2 and marks it as a dev dependency', () => {
      const vite = packagesMap['node_modules/vite'];
      expect(vite).toBeTruthy();
      expect(vite).toHaveProperty('version', '7.1.2');
      expect(vite).toHaveProperty('dev', true);
    });

    it('includes selected direct dependencies (esbuild, postcss, rollup, tinyglobby)', () => {
      const vite = packagesMap['node_modules/vite'];
      expect(vite).toHaveProperty('dependencies');

      const deps = vite.dependencies || {};
      expect(deps).toHaveProperty('esbuild', '^0.25.0');
      expect(deps).toHaveProperty('postcss', '^8.5.6');
      expect(deps).toHaveProperty('rollup', '^4.43.0');
      expect(deps).toHaveProperty('tinyglobby', '^0.2.14');

      // Also included in diff:
      expect(deps).toHaveProperty('fdir', '^6.4.6');
      expect(deps).toHaveProperty('picomatch', '^4.0.3');
    });

    it('exposes the vite bin correctly', () => {
      const vite = packagesMap['node_modules/vite'];
      expect(vite).toHaveProperty('bin');
      expect(vite.bin).toHaveProperty('vite', 'bin/vite.js');
    });

    it('enforces modern Node engines on vite', () => {
      const vite = packagesMap['node_modules/vite'];
      expect(vite).toHaveProperty('engines');
      expect(vite.engines).toHaveProperty('node', '^20.19.0 || >=22.12.0');
    });

    it('declares optional peerDependencies metadata as shown in diff', () => {
      const vite = packagesMap['node_modules/vite'];
      expect(vite).toHaveProperty('peerDependencies');
      expect(vite.peerDependencies).toMatchObject({
        '@types/node': '^20.19.0 || >=22.12.0',
        jiti: '>=1.21.0',
        less: '^4.0.0',
        lightningcss: '^1.21.0',
        sass: '^1.70.0',
        'sass-embedded': '^1.70.0',
        stylus: '>=0.54.8',
        sugarss: '^5.0.0',
        terser: '^5.16.0',
        tsx: '^4.8.1',
        yaml: '^2.4.2',
      });

      expect(vite).toHaveProperty('peerDependenciesMeta');
      // Verify that several peer deps are marked optional
      const meta = vite.peerDependenciesMeta || {};
      for (const key of [
        '@types/node',
        'jiti',
        'less',
        'lightningcss',
        'sass',
        'sass-embedded',
        'stylus',
        'sugarss',
        'terser',
        'tsx',
        'yaml',
      ]) {
        expect(meta[key]).toMatchObject({ optional: true });
      }
    });

    it('lists fsevents as optional dependency (macOS filesystem watcher)', () => {
      const vite = packagesMap['node_modules/vite'];
      expect(vite).toHaveProperty('optionalDependencies');
      expect(vite.optionalDependencies).toHaveProperty('fsevents', '~2.3.3');
    });
  });

  // Non-failing reminder for maintainers: ensure Node version used in CI/engines
  // aligns with strictest dependency requirement (e.g., Vite 7 requires Node >=20.19).
  test.todo?.('Align root engines.node with the strictest engines.node among dependencies (e.g., >=20.19.0)');

});