const { spawn } = require('child_process');
const { argv } = require('yargs');

const watchPackages = (argv.watch || 'core').split(',')
  .map(dir => ['--watch', `./packages/${dir}`]);

const node = spawn('nodemon', [
  ...watchPackages,
  '--watch', `./examples/${argv.example}`,
  '-x', 'ts-node', `-r tsconfig-paths/register ./examples/${argv.example}`,
]);

node.stdout.on('data', (buffer) => console.log(buffer.toString()));
node.stderr.on('data', (buffer) => console.log(buffer.toString()));
node.on('close', () => process.exit());

// nodemon --watch ../../packages/core --watch ./src -x ts-node -r tsconfig-paths/register src/index.ts
