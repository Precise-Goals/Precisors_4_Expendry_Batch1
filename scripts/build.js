const { spawnSync } = require('child_process');
const args = process.argv.slice(2).filter(a => a !== '--filter=web');
const res = spawnSync('bun', ['--filter=web', 'run', 'build', ...args], { stdio: 'inherit', shell: true });
process.exit(res.status ?? 0);
