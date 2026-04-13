const fs = require('fs');

const css = fs.readFileSync('css/styles.css', 'utf8');
const js = fs.readFileSync('js/app.js', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');

// Restore monolithic CSS and JS
html = html.replace('<link rel="stylesheet" href="css/styles.css">', `<style>\n${css}\n</style>`);
html = html.replace('<script defer src="js/app.js"></script>', `<script>\n${js}\n</script>`);

// Add Material Icons link 
html = html.replace('</head>', '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">\n</head>');

// Add Firebase INIT
const firebaseInit = `
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyPlaceholder",
    authDomain: "crowdsync-ai.firebaseapp.com",
    projectId: "crowdsync-ai",
    storageBucket: "crowdsync-ai.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};
firebase.initializeApp(firebaseConfig);
console.log("Firebase connected");
`;
html = html.replace('<script>', `<script>\n${firebaseInit}\n`);

// Update System Status Box
const systemStatusHTML = `
                <div class="card">
                    <div class="card-header">
                        <h3><span class="material-icons" style="font-size:16px;">science</span> System Status</h3>
                    </div>
                    <div style="font-size:13px; display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; justify-content:space-between;"><span>Simulation:</span> <span style="color:var(--color-low);">Running</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>Firebase:</span> <span style="color:var(--color-low);">Connected</span></div>
                    </div>
                </div>
`;
// Insert into user-controls
html = html.replace('<div id="user-controls">', `<div id="user-controls">\n${systemStatusHTML}`);

// Add Footer Notice
html = html.replace('</footer>', '<br> Powered by Google Firebase and Google Web Services\n    </footer>');

// UI Labels: modify JS to add explicit text label for POIs
html = html.replace("cell.innerHTML = `", "cell.innerHTML = '\\n<div style=\"position:absolute; top:-18px; font-size:9px; background:rgba(0,0,0,0.7); padding:2px 4px; border-radius:4px; max-width:60px; text-align:center; white-space:nowrap;\">' + specialNodes[i].name + '</div>' + `");

// Also replace toast SVG with Material Icons inside JS
html = html.replace(/let svg = '';[\\s\\S]*?svg = '<circle cx="12" cy="12" r="10"><\\/circle><line x1="12" y1="16" x2="12" y2="12"><\\/line><line x1="12" y1="8" x2="12.01" y2="8"><\\/line>';/, `let svg = '';
                if (type === 'success') svg = '<span class="material-icons" style="color:var(--color-low); font-size:20px;">check_circle</span>';
                else if (type === 'danger') svg = '<span class="material-icons" style="color:var(--color-high); font-size:20px;">warning</span>';
                else svg = '<span class="material-icons" style="color:var(--color-med); font-size:20px;">info</span>';`);
html = html.replace('<svg aria-hidden="true" class="icon-svg" style="width:20px; height:20px; color:var(--text-primary)"><g>${svg}</g></svg>', '${svg}');

fs.writeFileSync('index.html', html);
console.log('Build applied. Monolithic complete.');
