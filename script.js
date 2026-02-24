/* Matrix Rain Effect */
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const columns = Math.floor(width / 20); // Width of column
const drops = [];
const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*()_+-=[]{}|;':,./<>?";

// Initialize drops
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Fade effect
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0F0'; // Green text
    ctx.font = '15px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = symbols[Math.floor(Math.random() * symbols.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

/* Boot Sequence */
const bootScreen = document.getElementById('boot-screen');
const bootLog = document.getElementById('boot-log');
const terminal = document.getElementById('terminal');
const output = document.getElementById('terminal-output');
const input = document.getElementById('command-input');

const bootMessages = [
    "Loading kernel modules...",
    "Mounting file systems...",
    "Checking disk quotas...",
    "Starting system logger...",
    "Loading cheat codes...",
    "Injecting coffee...",
    "Compiling implementation details...",
    "Optimizing responsive layouts...",
    "Initializing portfolio.service...",
    "Starting graphics interface...",
    "Welcome to TharunOS v1.0.0"
];

let bootIndex = 0;

function boot() {
    if (bootIndex < bootMessages.length) {
        const p = document.createElement('div');
        p.className = 'boot-line';

        // Randomize status colors
        const status = Math.random() > 0.8 ? '<span class="boot-info">[INFO]</span>' : '<span class="boot-ok">[ OK ]</span>';

        p.innerHTML = `${status} ${bootMessages[bootIndex]}`;
        bootLog.appendChild(p);

        // Auto scroll
        bootScreen.scrollTop = bootScreen.scrollHeight;

        bootIndex++;
        setTimeout(boot, Math.random() * 300 + 100);
    } else {
        setTimeout(() => {
            bootScreen.style.display = 'none';
            terminal.style.display = 'flex';
            input.focus();
            showWelcome();
        }, 1000);
    }
}

// Start boot sequence on load
window.addEventListener('load', boot);

/* Terminal Logic */
const fileSystem = {
    '~': { type: 'dir', content: ['projects', 'skills', 'contact', 'about.txt'] },
    '~/projects': { type: 'dir', content: ['portfolio-v1', 'robotics-arm-control', 'ai-chatbot'] },
    '~/skills': { type: 'dir', content: ['python', 'javascript', 'c++', 'embedded-c'] },
    '~/contact': { type: 'dir', content: ['email.txt', 'github.url', 'linkedin.url'] }
};

let currentPath = '~';
let commandHistory = [];
let historyIndex = -1;

function updatePrompt() {
    const pathSpan = document.querySelector('.path');
    pathSpan.textContent = currentPath;
}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = input.value.trim();
        executeCommand(command);
        if (command) {
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        }
        input.value = '';
    } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabComplete();
    } else if (e.ctrlKey && e.key === 'c') {
        const command = input.value;
        const cmdLine = document.createElement('div');
        cmdLine.className = 'output-line';
        cmdLine.innerHTML = `<span class="user">guest</span><span class="at">@</span><span class="host">tharun-portfolio</span>:<span class="path">${currentPath}</span>$ ${escapeHtml(command)}^C`;
        output.appendChild(cmdLine);
        input.value = '';
        const container = document.querySelector('.container');
        container.scrollTop = container.scrollHeight;
    } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
        e.preventDefault();
    } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
        e.preventDefault();
    }
});

function handleTabComplete() {
    const val = input.value.trim();
    if (!val) return;

    const parts = val.split(' ');
    const lastPart = parts[parts.length - 1];

    const commands = ['about', 'skills', 'projects', 'contact', 'resume', 'ls', 'cd', 'clear', 'whoami', 'hire-me', 'sudo'];
    const currentDirContent = fileSystem[currentPath] ? fileSystem[currentPath].content : [];

    const possibleMatches = [...commands, ...currentDirContent];
    const matches = possibleMatches.filter(m => m.startsWith(lastPart));

    if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        input.value = parts.join(' ');
    } else if (matches.length > 1) {
        // Show multiple matches
        const cmdLine = document.createElement('div');
        cmdLine.className = 'output-line';
        cmdLine.innerHTML = `<span class="user">guest</span><span class="at">@</span><span class="host">tharun-portfolio</span>:<span class="path">${currentPath}</span>$ ${escapeHtml(val)}`;
        output.appendChild(cmdLine);

        const matchesDiv = document.createElement('div');
        matchesDiv.className = 'command-output';
        matchesDiv.innerHTML = matches.join('  ');
        output.appendChild(matchesDiv);

        const container = document.querySelector('.container');
        container.scrollTop = container.scrollHeight;
    }
}

// Focus input when clicking anywhere
document.addEventListener('click', () => {
    if (terminal.style.display !== 'none') {
        input.focus();
    }
});

function executeCommand(cmd) {
    // Echo command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'output-line';
    cmdLine.innerHTML = `<span class="user">guest</span><span class="at">@</span><span class="host">tharun-portfolio</span>:<span class="path">${currentPath}</span>$ ${escapeHtml(cmd)}`;
    output.appendChild(cmdLine);

    // Process command
    if (!cmd) return;

    const args = cmd.split(' ').filter(arg => arg.length > 0);
    const command = args[0] ? args[0].toLowerCase() : '';
    const arg1 = args[1];

    let response = '';

    switch (command) {
        case 'help':
            response = `
<div class="text-green">Available Commands:</div>
<div class="grid-container">
    <div class="grid-item">about    - Display about me info</div>
    <div class="grid-item">skills   - List technical skills</div>
    <div class="grid-item">projects - Show recent projects</div>
    <div class="grid-item">contact  - View contact details</div>
    <div class="grid-item">resume   - Download resume</div>
    <div class="grid-item">ls       - List directory content</div>
    <div class="grid-item">cd       - Change directory</div>
    <div class="grid-item">clear    - Clear terminal screen</div>
    <div class="grid-item">whoami   - Display current user</div>
    <div class="grid-item">hire-me  - Run hire protocol</div>
</div>
            `;
            break;
        case 'ls':
            const dir = fileSystem[currentPath];
            if (dir) {
                response = dir.content.map(item => {
                    const isDir = item === 'projects' || item === 'skills' || item === 'contact';
                    return isDir ? `<span class="text-blue">${item}/</span>` : item;
                }).join('  ');
            } else {
                response = '';
            }
            break;
        case 'cd':
            if (!arg1 || arg1 === '~') {
                currentPath = '~';
            } else if (arg1 === '..') {
                if (currentPath !== '~') {
                    // Simple logic for one level deep: assume we only have ~/foo depth
                    currentPath = '~';
                }
            } else {
                const target = currentPath === '~' ? `~/${arg1}` : `${currentPath}/${arg1}`;
                // Strip trailing slash if user typed 'cd projects/'
                const cleanTarget = target.endsWith('/') ? target.slice(0, -1) : target;

                if (fileSystem[cleanTarget] && fileSystem[cleanTarget].type === 'dir') {
                    currentPath = cleanTarget;
                } else {
                    response = `cd: ${arg1}: No such file or directory`;
                }
            }
            updatePrompt();
            break;
        case 'about':
            response = `
<div class="fade-in">
    <span class="text-blue"># About Me</span><br>
    Hello! I'm Tharun, An engineer specializing in automation, AI, cloud solutions, and backend development, currently working as an Associate Software Engineer.<br>
    Passionate about building scalable, efficient systems that solve real-world problems and streamline workflows.<br>
    Outside of work, enjoys exploring emerging technologies, contributing to open-source projects, experimenting with embedded hardware, and collaborating with peers to share knowledge and create innovative applications.
</div>
            `;
            break;
        case 'skills':
            response = `
<div class="fade-in">
    <span class="text-purple"># Technical Skills</span>
    <div class="grid-container">
        <div class="grid-item"><span class="text-yellow">Py</span> Python & AI</div>
        <div class="grid-item"><span class="text-blue">Js</span> JavaScript & Web</div>
        <div class="grid-item"><span class="text-red">C++</span> Embedded C/C++</div>
        <div class="grid-item"><span class="text-green">Rb</span> Robotics & ROS</div>
        <div class="grid-item"><span class="text-white">Op</span> TensorFlow & OpenCV</div>
        <div class="grid-item"><span class="text-grey">Gi</span> Git & Linux</div>
    </div>
</div>
            `;
            break;
        case 'projects':
            response = `
<div class="fade-in">
    <span class="text-green"># Recent Projects</span> (Click to view)
    <div class="grid-container">
        <div class="grid-item">
            <a href="#" target="_blank">1. Autonomous Robot</a><br>
            <small class="text-grey">Obstacle avoidance & path planning using ROS2.</small>
        </div>
        <div class="grid-item">
            <a href="#" target="_blank">2. IoT Home Automation</a><br>
            <small class="text-grey">ESP32 based smart home system controlled via App.</small>
        </div>
        <div class="grid-item">
            <a href="#" target="_blank">3. Portfolio Terminal</a><br>
            <small class="text-grey">This very website! Built with Vanilla JS.</small>
        </div>
    </div>
</div>
            `;
            break;
        case 'contact':
            response = `
<div class="fade-in">
    <span class="text-blue"># Contact Info</span><br>    
    Email: <a href="mailto:mailtopvtharun@gmail.com">mailtopvtharun@gmail.com</a><br>
    GitHub: <a href="https://github.com/Tharun-PV/" target="_blank">github.com/Tharun-PV</a><br>
    LinkedIn: <a href="https://linkedin.com/in/tharun-pv29" target="_blank">linkedin.com/in/tharun-pv29</a>
</div>
            `;
            break;
        case 'resume':
            response = `
<div class="fade-in">
    <span class="text-green">Generating download link...</span><br>
    <a href="TharunPV_Resume.pdf" download>Click here to download Resume.pdf</a>
</div>
            `;
            break;
        case 'clear':
            output.innerHTML = '';
            return; // Don't append empty response
        case 'whoami':
            response = 'guest';
            break;
        case 'sudo':
            if (args[1] === 'hire-me') {
                response = `<span class="text-green">Access Granted.</span> Initiating interview protocol...\nEmail sent to <a href="mailto:mailtopvtharun@gmail.com">mailtopvtharun@gmail.com</a>`;
                window.location.href = "mailto:mailtopvtharun@gmail.com?subject=Job%20Opportunity&body=Hello%20Tharun,%20I'd%20like%20to%20hire%20you!";
            } else {
                response = `usage: sudo [command]`;
            }
            break;
        case 'hire-me':
            response = `Permission denied. Try 'sudo hire-me'`;
            break;
        default:
            response = `<span class="text-red">Command not found:</span> ${escapeHtml(command)}. Type <span class="text-green">'help'</span> for a list of commands.`;
    }

    // Add response to output
    const respDiv = document.createElement('div');
    respDiv.className = 'command-output';
    respDiv.innerHTML = response;
    output.appendChild(respDiv);

    // Scroll to bottom of container
    const container = document.querySelector('.container');
    container.scrollTop = container.scrollHeight;
}

function showWelcome() {
    const welcomeMsg = `
<div class="ascii-art fade-in">
  _______ _                               
 |__   __| |                              
    | |  | |__   __ _ _ __ _   _ _ __     
    | |  | '_ \\ / _\` | '__| | | | '_ \\    
    | |  | | | | (_| | |  | |_| | | | |   
    |_|  |_| |_|\\__,_|_|   \\__,_|_| |_|   
                                          
</div>
<div class="fade-in">
    Welcome to Tharun's Interactive Portfolio.<br>
    Type <span class="text-green">'help'</span> to view available commands.
</div>
    `;
    const div = document.createElement('div');
    div.innerHTML = welcomeMsg;
    output.appendChild(div);
}

function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
