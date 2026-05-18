const fs = require('fs');
let content = fs.readFileSync('e:/My Webs/New Dev Portfolio/manav3d.html', 'utf8');

// Inject --text-rgb in :root
content = content.replace(/:root \{\s*--bg: #03090b;/g, ':root {\n      --text-rgb: 180, 220, 228;\n      --bg: #03090b;');
content = content.replace(/:root\.light-mode \{\s*--bg: #f0f5f9;/g, ':root.light-mode {\n      --text-rgb: 20, 30, 40;\n      --bg: #f0f5f9;');

// Replace rgba text colors
content = content.replace(/rgba\(180, 220, 228,/g, 'rgba(var(--text-rgb),');
content = content.replace(/rgba\(224, 247, 250,/g, 'rgba(var(--text-rgb),');
content = content.replace(/rgba\(200, 230, 240,/g, 'rgba(var(--text-rgb),');

// Replace explicit white colors for text specifically
content = content.replace(/color: #fff;/g, 'color: rgba(var(--text-rgb), 1);');
content = content.replace(/color: #ffffff;/g, 'color: rgba(var(--text-rgb), 1);');

// Fix toggle script
content = content.replace(`if (root.classList.contains('light-mode')) {
        btn.textContent = '🌙';`, `if (root.classList.contains('light-mode')) {
        btn.textContent = '☀️';`);
content = content.replace(`} else {
        btn.textContent = '☀️';`, `} else {
        btn.textContent = '🌙';`);
content = content.replace(`if (btn) btn.textContent = '🌙';`, `if (btn) btn.textContent = '☀️';`);

// Also change the default icon in HTML
content = content.replace(`onclick="toggleTheme()">☀️</button>`, `onclick="toggleTheme()">🌙</button>`);


fs.writeFileSync('e:/My Webs/New Dev Portfolio/manav3d.html', content);
console.log('Replacements complete.');
