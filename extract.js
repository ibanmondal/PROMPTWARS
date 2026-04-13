const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const styleRegex = /<style>([\s\S]*?)<\/style>/;
const scriptRegex = /<script>([\s\S]*?)<\/script>/;

// Add Google Analytics & Firebase mock scripts to head
const gaScript = `
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://firebase.googleapis.com;">
    <!-- Google Analytics (Simulated) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"><\/script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    <\/script>
    
    <!-- Firebase SDK (Simulated) -->
    <script defer src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"><\/script>
    <script defer src="https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics-compat.js"><\/script>
`;

let cssMatch = html.match(styleRegex);
let jsMatch = html.match(scriptRegex);

if (!cssMatch || !jsMatch) {
  console.log("Could not find style or script block!");
  process.exit(1);
}

let newHtml = html.replace(styleRegex, '<link rel="stylesheet" href="css/styles.css">');
newHtml = newHtml.replace(scriptRegex, '<script defer src="js/app.js"></script>');

// Insert GA & CSP before </head>
newHtml = newHtml.replace('</head>', gaScript + '\n</head>');

// Accessibility Improvements: Add aria-labels, alt, roles
newHtml = newHtml.replace('<main>', '<main role="main" aria-label="Application Main Content">');
newHtml = newHtml.replace('<select id="selDest">', '<select id="selDest" aria-label="Select Destination">');
newHtml = newHtml.replace('<label>', '<label for="selDest">');
newHtml = newHtml.replace(/<button /g, '<button aria-label="Action Button" ');
newHtml = newHtml.replace(/<svg /g, '<svg aria-hidden="true" ');

newHtml = newHtml.replace('<html lang="en">', '<html lang="en" dir="ltr">');
newHtml = newHtml.replace('<header>', '<header role="banner">');
newHtml = newHtml.replace('<footer>', '<footer role="contentinfo">');

// Write out to split files
fs.mkdirSync('css', { recursive: true });
fs.mkdirSync('js', { recursive: true });
fs.writeFileSync('css/styles.css', cssMatch[1].trim());
fs.writeFileSync('js/app.js', jsMatch[1].trim());

fs.writeFileSync('index.html', newHtml);
console.log("Extraction and A11y injection complete.");
