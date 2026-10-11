// Workspace-local REA MCP client. Uses portable research tools without changing Codex settings.
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
const reaRoot = process.env.REA_PACKAGE_DIR;
if (!reaRoot) throw new Error('Set REA_PACKAGE_DIR to the installed rea-agents package');
const require = createRequire(join(reaRoot, 'package.json'));
const { Client } = await import(pathToFileURL(require.resolve('@modelcontextprotocol/client')));
const { StdioClientTransport } = await import(pathToFileURL(require.resolve('@modelcontextprotocol/client/stdio')));
const root = resolve('.tools');
const queue = join(root, 'rea-queue');
mkdirSync(queue, { recursive: true });
const client = new Client({ name: 'examview-research', version: '1.0.0' });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(reaRoot, 'scripts/rea.mjs'), 'mcp'], env: { ...process.env, GHIDRA_INSTALL_DIR: join(root, 'ghidra/ghidra_12.1.4_PUBLIC'), JAVA_HOME: join(root, 'jdk/jdk-21.0.12.1+1') } }));
writeFileSync(join(queue, 'tools.json'), JSON.stringify(await client.listTools(), null, 2));
console.log('REA client ready; submit numbered *.request.json files to .tools/rea-queue');
try {
  while (!existsSync(join(queue, 'stop'))) {
    for (const file of readdirSync(queue).filter(f => f.endsWith('.request.json')).sort()) {
      const output = join(queue, file.replace('.request.json', '.result.json'));
      if (existsSync(output)) continue;
      const request = JSON.parse(readFileSync(join(queue, file), 'utf8'));
      console.log(`Starting ${file}: ${request.name}`);
      try {
        const result = await client.callTool(request, { timeout: 3600000, maxTotalTimeout: 3600000 });
        writeFileSync(output, JSON.stringify(result, null, 2));
      } catch (error) {
        writeFileSync(output, JSON.stringify({ error: error.message }, null, 2));
      }
      console.log(`Finished ${file}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
} finally { await client.close(); }
