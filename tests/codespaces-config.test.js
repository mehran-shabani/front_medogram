// Testing framework: Node.js built-in test runner (node:test) + node:assert/strict
// Scope: Validates Codespaces configuration files and setup

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';

const devcontainerPath = new URL('../.devcontainer/devcontainer.json', import.meta.url);
const dockerfilePath = new URL('../.devcontainer/Dockerfile', import.meta.url);
const readmePath = new URL('../.devcontainer/README.md', import.meta.url);

async function loadDevcontainer() {
  try {
    const raw = await readFile(devcontainerPath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to load devcontainer.json: ${error.message}`);
  }
}

async function loadDockerfile() {
  try {
    return await readFile(dockerfilePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to load Dockerfile: ${error.message}`);
  }
}

async function loadReadme() {
  try {
    return await readFile(readmePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to load README.md: ${error.message}`);
  }
}

test('Codespaces: devcontainer.json exists and is accessible', async () => {
  try {
    await access(devcontainerPath, constants.F_OK);
    assert.ok(true, 'devcontainer.json exists');
  } catch {
    assert.fail('devcontainer.json should exist');
  }
});

test('Codespaces: Dockerfile exists and is accessible', async () => {
  try {
    await access(dockerfilePath, constants.F_OK);
    assert.ok(true, 'Dockerfile exists');
  } catch {
    assert.fail('Dockerfile should exist');
  }
});

test('Codespaces: README.md exists and is accessible', async () => {
  try {
    await access(readmePath, constants.F_OK);
    assert.ok(true, 'README.md exists');
  } catch {
    assert.fail('README.md should exist');
  }
});

test('Codespaces: devcontainer.json has valid JSON syntax', async () => {
  const config = await loadDevcontainer();
  assert.ok(typeof config === 'object', 'devcontainer.json should be a valid JSON object');
});

test('Codespaces: devcontainer.json has required fields', async () => {
  const config = await loadDevcontainer();
  
  const requiredFields = ['name', 'image', 'forwardPorts', 'postCreateCommand'];
  for (const field of requiredFields) {
    assert.ok(Object.prototype.hasOwnProperty.call(config, field), `devcontainer.json should have '${field}' field`);
  }
});

test('Codespaces: devcontainer.json has correct name', async () => {
  const config = await loadDevcontainer();
  assert.equal(config.name, 'Medogram Modern Development', 'Name should match expected value');
});

test('Codespaces: devcontainer.json uses correct base image', async () => {
  const config = await loadDevcontainer();
  assert.ok(config.image.includes('mcr.microsoft.com/devcontainers/javascript-node'), 'Should use Microsoft devcontainer base image');
  assert.ok(config.image.includes('20'), 'Should use Node.js 20');
});

test('Codespaces: devcontainer.json forwards correct ports', async () => {
  const config = await loadDevcontainer();
  assert.ok(Array.isArray(config.forwardPorts), 'forwardPorts should be an array');
  assert.ok(config.forwardPorts.includes(3000), 'Should forward port 3000');
  assert.ok(config.forwardPorts.includes(5173), 'Should forward port 5173');
});

test('Codespaces: devcontainer.json has postCreateCommand', async () => {
  const config = await loadDevcontainer();
  assert.equal(config.postCreateCommand, 'npm install', 'postCreateCommand should run npm install');
});

test('Codespaces: devcontainer.json has postStartCommand', async () => {
  const config = await loadDevcontainer();
  assert.equal(config.postStartCommand, 'npm run dev', 'postStartCommand should run npm run dev');
});

test('Codespaces: devcontainer.json has VS Code extensions', async () => {
  const config = await loadDevcontainer();
  assert.ok(config.customizations, 'Should have customizations');
  assert.ok(config.customizations.vscode, 'Should have VS Code customizations');
  assert.ok(Array.isArray(config.customizations.vscode.extensions), 'Should have extensions array');
  
  const extensions = config.customizations.vscode.extensions;
  const requiredExtensions = [
    'bradlc.vscode-tailwindcss',
    'esbenp.prettier-vscode',
    'dbaeumer.vscode-eslint'
  ];
  
  for (const extension of requiredExtensions) {
    assert.ok(extensions.includes(extension), `Should include ${extension} extension`);
  }
});

test('Codespaces: devcontainer.json has environment variables', async () => {
  const config = await loadDevcontainer();
  assert.ok(config.containerEnv, 'Should have containerEnv');
  assert.equal(config.containerEnv.NODE_ENV, 'development', 'NODE_ENV should be development');
  assert.equal(config.containerEnv.VITE_API_BASE_URL, 'https://api.medogram.ir', 'VITE_API_BASE_URL should be set');
  assert.equal(config.containerEnv.VITE_LOCAL_API_URL, 'https://api.medogram.ir', 'VITE_LOCAL_API_URL should be set');
});

test('Codespaces: Dockerfile has required instructions', async () => {
  const dockerfile = await loadDockerfile();
  
  assert.ok(dockerfile.includes('FROM'), 'Dockerfile should have FROM instruction');
  assert.ok(dockerfile.includes('WORKDIR'), 'Dockerfile should have WORKDIR instruction');
  assert.ok(dockerfile.includes('EXPOSE'), 'Dockerfile should have EXPOSE instruction');
  assert.ok(dockerfile.includes('CMD'), 'Dockerfile should have CMD instruction');
});

test('Codespaces: Dockerfile uses correct base image', async () => {
  const dockerfile = await loadDockerfile();
  assert.ok(dockerfile.includes('mcr.microsoft.com/devcontainers/javascript-node'), 'Should use Microsoft devcontainer base image');
  assert.ok(dockerfile.includes('20'), 'Should use Node.js 20');
});

test('Codespaces: Dockerfile exposes correct ports', async () => {
  const dockerfile = await loadDockerfile();
  assert.ok(dockerfile.includes('EXPOSE 3000 5173'), 'Should expose ports 3000 and 5173');
});

test('Codespaces: Dockerfile sets environment variables', async () => {
  const dockerfile = await loadDockerfile();
  assert.ok(dockerfile.includes('ENV NODE_ENV=development'), 'Should set NODE_ENV');
  assert.ok(dockerfile.includes('ENV VITE_API_BASE_URL'), 'Should set VITE_API_BASE_URL');
  assert.ok(dockerfile.includes('ENV VITE_LOCAL_API_URL'), 'Should set VITE_LOCAL_API_URL');
});

test('Codespaces: README.md contains essential information', async () => {
  const readme = await loadReadme();
  
  assert.ok(readme.includes('GitHub Codespaces'), 'README should mention GitHub Codespaces');
  assert.ok(readme.includes('Quick Start'), 'README should have Quick Start section');
  assert.ok(readme.includes('Development Environment'), 'README should describe development environment');
  assert.ok(readme.includes('VS Code Extensions'), 'README should list VS Code extensions');
  assert.ok(readme.includes('Ports'), 'README should mention ports');
  assert.ok(readme.includes('Environment Variables'), 'README should list environment variables');
});

test('Codespaces: README.md contains troubleshooting section', async () => {
  const readme = await loadReadme();
  assert.ok(readme.includes('Troubleshooting'), 'README should have troubleshooting section');
});

test('Codespaces: README.md contains support information', async () => {
  const readme = await loadReadme();
  assert.ok(readme.includes('Support'), 'README should have support section');
});