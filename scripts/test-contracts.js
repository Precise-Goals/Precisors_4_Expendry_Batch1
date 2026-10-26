const { spawnSync } = require('child_process');
const args = process.argv.slice(2).filter(a => a !== '--filter=contracts');
const res = spawnSync('bun', ['--filter=contracts', 'run', 'test', ...args], { stdio: 'inherit', shell: true });
process.exit(res.status ?? 0);
