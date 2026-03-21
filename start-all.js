const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Check if backend directory exists
const backendDir = path.join(__dirname, 'edushare-backend');
if (!fs.existsSync(backendDir)) {
  log(colors.red, '❌ Backend directory not found!');
  log(colors.yellow, 'Please ensure the edushare-backend directory exists.');
  process.exit(1);
}

// Check if package.json exists in backend
const backendPackageJson = path.join(backendDir, 'package.json');
if (!fs.existsSync(backendPackageJson)) {
  log(colors.red, '❌ Backend package.json not found!');
  process.exit(1);
}

log(colors.cyan, '🚀 Starting EduShare Application...');
log(colors.yellow, '📁 Frontend: React.js (http://localhost:3000)');
log(colors.yellow, '📁 Backend: Node.js (http://localhost:5000)');

// Start Backend
log(colors.blue, '\n🔧 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: backendDir,
  stdio: 'pipe',
  shell: true
});

backend.stdout.on('data', (data) => {
  log(colors.green, `[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
  log(colors.red, `[Backend Error] ${data.toString().trim()}`);
});

// Wait a moment before starting frontend
setTimeout(() => {
  // Start Frontend
  log(colors.blue, '\n🎨 Starting Frontend Application...');
  const frontend = spawn('npm', ['start'], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true
  });

  frontend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output.includes('Compiled successfully') || output.includes('Local:')) {
      log(colors.green, `[Frontend] ${output}`);
    } else {
      log(colors.cyan, `[Frontend] ${output}`);
    }
  });

  frontend.stderr.on('data', (data) => {
    log(colors.red, `[Frontend Error] ${data.toString().trim()}`);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    log(colors.yellow, '\n🛑 Shutting down servers...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });

  frontend.on('close', (code) => {
    if (code !== 0) {
      log(colors.red, `Frontend process exited with code ${code}`);
    }
  });

}, 2000); // Wait 2 seconds before starting frontend

backend.on('close', (code) => {
  if (code !== 0) {
    log(colors.red, `Backend process exited with code ${code}`);
  }
});

log(colors.magenta, '\n⏳ Waiting for servers to start...');
log(colors.cyan, '🌐 Frontend will be available at: http://localhost:3000');
log(colors.cyan, '🔌 Backend API will be available at: http://localhost:5000/api');
log(colors.yellow, '\n💡 Press Ctrl+C to stop both servers');
