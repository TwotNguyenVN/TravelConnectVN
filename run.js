#!/usr/bin/env node

/**
 * ==============================================================================
 * TRAVELCONNECTVN - CROSS-PLATFORM DEV TOOL (macOS / Linux / Windows)
 * ==============================================================================
 * 
 * Đây là tệp tin công cụ duy nhất dùng để cài đặt (setup), dọn dẹp (clean), 
 * hoặc chạy (start) toàn bộ dự án TravelConnectVN trên mọi hệ điều hành.
 * 
 * Cách sử dụng:
 * 1. Chạy tương tác (Hiển thị Menu):
 *    node run.js
 * 
 * 2. Chạy nhanh qua dòng lệnh:
 *    node run.js setup      - Cài đặt dependency & Prisma
 *    node run.js start      - Chạy đồng thời Backend & Frontend
 *    node run.js clean      - Dọn dẹp các thư mục build/log
 *    node run.js clean-all  - Dọn dẹp sạch sẽ cả node_modules
 * ==============================================================================
 */

        const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');
const os = require('os');

// Màu sắc Console ANSI
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underline: '\x1b[4m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m'
};

const REQUIRED_NODE_VERSION = 24;

// Tự động cấu hình môi trường shell (Aliases: tcvn, run, runf, runb)
function setupShellEnvironment() {
  const zshrcPath = path.join(os.homedir(), '.zshrc');
  const projectRoot = __dirname;
  
  const shellConfig = `
# ==========================================
# TravelConnectVN custom aliases & functions
# ==========================================
alias tcvn="node ${projectRoot}/run.js"
alias TCVN="tcvn"
alias Tcvn="tcvn"

function run() {
  local current_dir=$(pwd)
  local project_root="${projectRoot}"
  
  if [[ "$current_dir" == "$project_root" ]]; then
    echo "Bạn đang ở thư mục gốc. Bạn muốn chạy Backend hay Frontend?"
    echo "1. Backend"
    echo "2. Frontend"
    echo -n "Chọn (1/2): "
    read choice
    echo ""
    if [[ "$choice" == "1" ]]; then
      cd "$project_root/backend" && npm run start:dev
    elif [[ "$choice" == "2" ]]; then
      cd "$project_root/frontend" && npm run dev
    else
      echo "Lựa chọn không hợp lệ."
    fi
  elif [[ "$current_dir" == "$project_root/frontend" ]]; then
    npm run dev
  elif [[ "$current_dir" == "$project_root/backend" ]]; then
    npm run start:dev
  else
    echo "Lệnh 'run' không hỗ trợ trong thư mục này."
  fi
}

function runf() {
  cd "${projectRoot}/frontend" && npm run dev
}

function runb() {
  cd "${projectRoot}/backend" && npm run start:dev
}
# ==========================================
`;

  try {
    if (fs.existsSync(zshrcPath)) {
      const zshrcContent = fs.readFileSync(zshrcPath, 'utf8');
      if (!zshrcContent.includes('TravelConnectVN custom aliases & functions')) {
        fs.appendFileSync(zshrcPath, '\n' + shellConfig);
        console.log(`${COLORS.bgGreen}${COLORS.bright} ĐÃ CẤU HÌNH TỰ ĐỘNG TERMINAL ${COLORS.reset}`);
        console.log(`${COLORS.green}Các lệnh rút gọn (tcvn, run, runf, runb) đã được cài đặt vào ~/.zshrc.${COLORS.reset}`);
        console.log(`${COLORS.yellow}>>> Vui lòng khởi động lại Terminal hoặc chạy: source ~/.zshrc để có hiệu lực. <<<${COLORS.reset}\n`);
      }
    }
  } catch (error) {
    console.log(`${COLORS.red}Lỗi khi cấu hình tự động ~/.zshrc: ${error.message}${COLORS.reset}`);
  }
}

// Banner ASCII nghệ thuật
function showBanner() {
  console.clear();
  
  const logo = [
    "   _____                      _  _____                            _     ",
    "  |_   _| __ __ ___   _____  | |/  __ \\ ___  _ __  _ __   ___  __| |_   ",
    "    | || '_/ _` \\ \\ / / _ \\ | || /  \\/ _ \\| '_ \\| '_ \\ / _ \\/ __| __|  ",
    "    | || | | (_| |\\ V /  __/ | || \\__/\\ (_) | | | | | | |  __/ (__| |_   ",
    "    |_||_|  \\__,_| \\_/ \\___| |_| \\____/\\___/|_| |_|_| |_|\\___|\\___|\\__|  "
  ];
  
  const cyan = `${COLORS.cyan}${COLORS.bright}`;
  const magenta = `${COLORS.magenta}${COLORS.bright}`;
  const yellow = `${COLORS.yellow}${COLORS.bright}`;
  const reset = COLORS.reset;
  
  // Top Border (Cyan to Magenta split)
  console.log(`  ${cyan}╔════════════════════════════════════${magenta}════════════════════════════════════╗`);
  
  // Logo lines split and colored in Neon Cyan & Magenta
  logo.forEach(line => {
    const part1 = line.substring(0, 32);
    const part2 = line.substring(32);
    console.log(`  ${cyan}║${part1}${magenta}${part2}║`);
  });
  
  // Spacing
  console.log(`  ${cyan}║                                    ${magenta}                                    ║`);
  
  // Subtitle (Golden Yellow with glowing sparkles, perfectly aligned)
  const subtitleText = "✨  HỆ THỐNG WEB KẾT NỐI DU LỊCH VIỆT NAM  ✨";
  const leftSpaces = " ".repeat(13);
  const rightSpaces = " ".repeat(14);
  console.log(`  ${cyan}║${leftSpaces}${yellow}${subtitleText}${magenta}${rightSpaces}║`);
  
  // Bottom Border (Cyan to Magenta split)
  console.log(`  ${cyan}╚════════════════════════════════════${magenta}════════════════════════════════════╝`);
  console.log(reset);
}

// Kiểm tra phiên bản Node.js
function checkNodeVersion() {
  const currentVersion = process.version;
  const majorVersion = parseInt(currentVersion.replace('v', '').split('.')[0], 10);
  
  console.log(`${COLORS.bright}Kiểm tra môi trường:${COLORS.reset}`);
  console.log(`- Hệ điều hành: ${COLORS.yellow}${os.type()} (${os.arch()})${COLORS.reset}`);
  console.log(`- Phiên bản Node.js hiện tại: ${COLORS.yellow}${currentVersion}${COLORS.reset}`);
  
  if (majorVersion < REQUIRED_NODE_VERSION) {
    console.log(`\n${COLORS.bgYellow}${COLORS.bright} CẢNH BÁO / WARNING ${COLORS.reset}`);
    console.log(`${COLORS.yellow}Dự án khuyến nghị Node.js v${REQUIRED_NODE_VERSION} trở lên (Hiện tại: ${currentVersion}).`);
    console.log(`Một số tính năng nâng cao có thể không hoạt động ổn định trên phiên bản cũ.${COLORS.reset}\n`);
  } else {
    console.log(`- Phiên bản Node.js: ${COLORS.green}Đạt yêu cầu (v${REQUIRED_NODE_VERSION}+)${COLORS.reset}\n`);
  }
}

// Hàm chạy lệnh đồng bộ, kế thừa stdio của terminal
function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`${COLORS.cyan}>> Đang chạy: ${command} ${args.join(' ')} trong thư mục ${cwd || '.'}${COLORS.reset}`);
    
    // Windows cần shell: true để tự giải quyết các file bat/cmd
    const processInstance = spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
      shell: true
    });
    
    processInstance.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Lệnh thất bại với mã lỗi: ${code}`));
      }
    });
    
    processInstance.on('error', (err) => {
      reject(err);
    });
  });
}

// 1. Chức năng setup
async function doSetup() {
  console.log(`${COLORS.magenta}${COLORS.bright}========== BẮT ĐẦU CÀI ĐẶT DỰ ÁN (SETUP) ==========${COLORS.reset}\n`);
  checkNodeVersion();
  
  try {

    // A. Cài đặt Backend
    console.log(`${COLORS.bright}[1/3] Đang cài đặt thư viện cho Backend...${COLORS.reset}`);
    await runCommand('npm', ['install'], path.join(__dirname, 'backend'));
    console.log(`${COLORS.green}✔ Backend npm install hoàn thành.\n${COLORS.reset}`);
    
    // B. Tạo Prisma Client
    console.log(`${COLORS.bright}[2/3] Đang khởi tạo cơ sở dữ liệu Prisma Client...${COLORS.reset}`);
    await runCommand('npx', ['prisma', 'generate'], path.join(__dirname, 'backend'));
    console.log(`${COLORS.green}✔ Prisma Client generate hoàn thành.\n${COLORS.reset}`);
    
    // C. Cài đặt Frontend
    console.log(`${COLORS.bright}[3/3] Đang cài đặt thư viện cho Frontend...${COLORS.reset}`);
    await runCommand('npm', ['install'], path.join(__dirname, 'frontend'));
    console.log(`${COLORS.green}✔ Frontend npm install hoàn thành.\n${COLORS.reset}`);
    
    console.log(`${COLORS.bgGreen}${COLORS.bright} CÀI ĐẶT THÀNH CÔNG! / SETUP SUCCESSFUL ${COLORS.reset}\n`);
    console.log(`Dự án đã sẵn sàng hoạt động. Để khởi chạy dự án, hãy chạy:`);
    console.log(`${COLORS.cyan}${COLORS.bright}  node run.js start${COLORS.reset}\n`);
  } catch (error) {
    console.error(`\n${COLORS.bgRed}${COLORS.bright} LỖI CÀI ĐẶT / SETUP ERROR ${COLORS.reset}`);
    console.error(`${COLORS.red}${error.message}${COLORS.reset}\n`);
  }
}

// Chức năng xóa file/folder đệ quy (cross-platform)
function cleanDirectory(targetPath, isFolder = true) {
  if (fs.existsSync(targetPath)) {
    try {
      if (isFolder) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`${COLORS.green}✔ Đã xóa thư mục: ${targetPath}${COLORS.reset}`);
      } else {
        fs.unlinkSync(targetPath);
        console.log(`${COLORS.green}✔ Đã xóa tệp tin: ${targetPath}${COLORS.reset}`);
      }
    } catch (e) {
      console.log(`${COLORS.red}✗ Không thể xóa ${targetPath}: ${e.message}${COLORS.reset}`);
    }
  }
}

// Tìm và xóa các file theo pattern (DS_Store, log...)
function cleanFilesPattern(dir, pattern) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Bỏ qua node_modules khi tìm file rác
      if (file !== 'node_modules') {
        cleanFilesPattern(fullPath, pattern);
      }
    } else if (file.match(pattern)) {
      try {
        fs.unlinkSync(fullPath);
        console.log(`${COLORS.green}✔ Đã xóa file rác: ${fullPath}${COLORS.reset}`);
      } catch (e) {
        // Bỏ qua lỗi file đang bận
      }
    }
  }
}

// 2. Chức năng clean
function doClean(cleanModules = false) {
  console.log(`\n${COLORS.magenta}${COLORS.bright}========== BẮT ĐẦU DỌN DẸP DỰ ÁN (CLEAN) ==========${COLORS.reset}\n`);
  
  // A. Xóa các thư mục build
  console.log(`${COLORS.bright}1. Đang dọn dẹp các thư mục build...${COLORS.reset}`);
  cleanDirectory(path.join(__dirname, 'backend', 'dist'));
  cleanDirectory(path.join(__dirname, 'frontend', 'dist'));
  
  // B. Xóa các file log và file tạm
  console.log(`\n${COLORS.bright}2. Đang quét và dọn dẹp các file log, file rác (.log, .DS_Store)...${COLORS.reset}`);
  cleanFilesPattern(__dirname, /\.log$/);
  cleanFilesPattern(__dirname, /^\.DS_Store$/);
  
  // C. Xóa node_modules nếu được yêu cầu
  if (cleanModules) {
    console.log(`\n${COLORS.red}${COLORS.bright}3. Đang dọn dẹp toàn bộ thư mục node_modules...${COLORS.reset}`);
    cleanDirectory(path.join(__dirname, 'backend', 'node_modules'));
    cleanDirectory(path.join(__dirname, 'frontend', 'node_modules'));
  }
  
  console.log(`\n${COLORS.bgGreen}${COLORS.bright} DỌN DẸP HOÀN TẤT! / CLEAN COMPLETED ${COLORS.reset}\n`);
  if (cleanModules) {
    console.log(`Bạn sẽ cần chạy ${COLORS.cyan}node run.js setup${COLORS.reset} để tải lại các thư viện trước khi chạy dự án.`);
  }
}

// 3. Chức năng chạy đồng thời cả Backend và Frontend
function doStart() {
  console.log(`\n${COLORS.magenta}${COLORS.bright}========== KHỞI CHẠY DỰ ÁN ĐỒNG THỜI (START) ==========${COLORS.reset}`);
  console.log(`${COLORS.dim}Nhấn Ctrl+C để dừng cả hai máy chủ.\n${COLORS.reset}`);
  
  // Khởi tạo các biến tiến trình
  let backendProcess = null;
  let frontendProcess = null;
  
  // Đăng ký dọn dẹp tiến trình con khi tiến trình cha thoát
  const killChildren = () => {
    console.log(`\n${COLORS.yellow}Đang dừng các máy chủ...${COLORS.reset}`);
    if (backendProcess) {
      try { process.kill(-backendProcess.pid); } catch (e) {
        try { backendProcess.kill(); } catch (err) {}
      }
    }
    if (frontendProcess) {
      try { process.kill(-frontendProcess.pid); } catch (e) {
        try { frontendProcess.kill(); } catch (err) {}
      }
    }
    console.log(`${COLORS.green}Đã dừng toàn bộ máy chủ thành công. Hẹn gặp lại!${COLORS.reset}\n`);
    process.exit(0);
  };

  process.on('SIGINT', killChildren);
  process.on('SIGTERM', killChildren);
  process.on('exit', () => {
    if (backendProcess) backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();
  });

  // A. Khởi chạy Backend
  console.log(`${COLORS.cyan}Đang khởi động NestJS Backend...${COLORS.reset}`);
  backendProcess = spawn('npm', ['run', 'start:dev'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    detached: process.platform !== 'win32' // Chạy detached trên Unix để kill nguyên cây tiến trình
  });

  // Đọc dữ liệu ra từ Backend và in có gắn nhãn màu sắc
  backendProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${COLORS.cyan}[Backend]${COLORS.reset} ${line}`);
      }
    });
  });

  backendProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${COLORS.red}[Backend-Error]${COLORS.reset} ${line}`);
      }
    });
  });

  // B. Khởi chạy Frontend
  console.log(`${COLORS.magenta}Đang khởi động Vite Frontend...${COLORS.reset}`);
  frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'frontend'),
    shell: true,
    detached: process.platform !== 'win32'
  });

  // Đọc dữ liệu ra từ Frontend và in có gắn nhãn màu sắc
  frontendProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${COLORS.magenta}[Frontend]${COLORS.reset} ${line}`);
      }
    });
  });

  frontendProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${COLORS.red}[Frontend-Error]${COLORS.reset} ${line}`);
      }
    });
  });

  // Lắng nghe sự kiện kết thúc tiến trình
  backendProcess.on('close', (code) => {
    console.log(`${COLORS.red}[Backend] Máy chủ Backend đã dừng với mã lỗi: ${code}${COLORS.reset}`);
    killChildren();
  });

  frontendProcess.on('close', (code) => {
    console.log(`${COLORS.red}[Frontend] Máy chủ Frontend đã dừng với mã lỗi: ${code}${COLORS.reset}`);
    killChildren();
  });
}

// Hiển thị menu tương tác readline
function showInteractiveMenu() {
  showBanner();
  checkNodeVersion();
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log(`${COLORS.bright}Vui lòng lựa chọn thao tác bạn muốn thực hiện:${COLORS.reset}`);
  console.log(`${COLORS.cyan}  [1] Cài đặt dự án (Setup)       - Tải thư viện, sinh Prisma Client${COLORS.reset}`);
  console.log(`${COLORS.magenta}  [2] Chạy đồng thời dự án (Start)  - Chạy cả Backend & Frontend bằng 1 terminal${COLORS.reset}`);
  console.log(`${COLORS.yellow}  [3] Dọn dẹp nhanh dự án (Clean)  - Xóa dist, log, file rác${COLORS.reset}`);
  console.log(`${COLORS.red}  [4] Dọn dẹp Sạch sẽ (Clean All)  - Xóa cả các thư mục node_modules${COLORS.reset}`);
  console.log(`${COLORS.dim}  [5] Thoát công cụ (Exit)${COLORS.reset}\n`);
  
  rl.question(`${COLORS.bright}Lựa chọn của bạn (1-5): ${COLORS.reset}`, async (answer) => {
    const selection = answer.trim();
    
    switch (selection) {
      case '1':
        rl.close();
        await doSetup();
        break;
      case '2':
        rl.close();
        doStart();
        break;
      case '3':
        rl.close();
        doClean(false);
        break;
      case '4':
        rl.question(`${COLORS.red}${COLORS.bright}CẢNH BÁO: Thao tác này sẽ xóa toàn bộ node_modules. Bạn có chắc chắn? (y/n): ${COLORS.reset}`, (confirm) => {
          rl.close();
          if (confirm.toLowerCase().trim() === 'y') {
            doClean(true);
          } else {
            console.log('Đã hủy thao tác dọn dẹp sạch.');
          }
        });
        break;
      case '5':
        rl.close();
        console.log('Đã thoát. Chúc bạn code vui vẻ!');
        process.exit(0);
        break;
      default:
        rl.close();
        console.log(`${COLORS.red}Lựa chọn không hợp lệ. Vui lòng chạy lại script!${COLORS.reset}\n`);
        process.exit(1);
    }
  });
}

// Xử lý tham số dòng lệnh đầu vào
function main() {
  setupShellEnvironment();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showInteractiveMenu();
    return;
  }
  
  const action = args[0].toLowerCase().trim();
  
  switch (action) {
    case 'setup':
      doSetup();
      break;
    case 'start':
      doStart();
      break;
    case 'clean':
      doClean(false);
      break;
    case 'clean-all':
      doClean(true);
      break;
    case 'help':
    case '--help':
    case '-h':
      console.log(`\n${COLORS.bright}CÁCH SỬ DỤNG TRAVELCONNECTVN CLI TOOL:${COLORS.reset}`);
      console.log(`  node run.js            - Khởi chạy ở chế độ menu tương tác`);
      console.log(`  node run.js setup      - Cài đặt dependency & Prisma Client`);
      console.log(`  node run.js start      - Khởi chạy đồng thời cả Backend & Frontend`);
      console.log(`  node run.js clean      - Xóa các file rác và thư mục build dist`);
      console.log(`  node run.js clean-all  - Xóa toàn bộ build dist và node_modules\n`);
      break;
    default:
      console.log(`${COLORS.red}Lệnh không hợp lệ: "${action}". Chạy "node run.js --help" để xem hướng dẫn.${COLORS.reset}`);
      process.exit(1);
  }
}

main();
