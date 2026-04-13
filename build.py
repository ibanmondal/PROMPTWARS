import re

with open('css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<link rel="stylesheet" href="css/styles.css">', f'<style>\n{css}\n</style>')
html = html.replace('<script defer src="js/app.js"></script>', f'<script>\n{js}\n</script>')

html = html.replace('</head>', '    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">\n</head>')

firebase_init = """
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyPlaceholder",
    authDomain: "crowdsync-ai.firebaseapp.com",
    projectId: "crowdsync-ai",
    storageBucket: "crowdsync-ai.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase connected");
}
"""
html = html.replace('<script>', f'<script>\n{firebase_init}\n')

sys_status = """
                <div class="card">
                    <div class="card-header">
                        <h3><span class="material-icons" style="font-size:16px;">science</span> System Status</h3>
                    </div>
                    <div style="font-size:13px; display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; justify-content:space-between;"><span>Simulation:</span> <span style="color:var(--color-low);">Running</span></div>
                        <div style="display:flex; justify-content:space-between;"><span>Firebase:</span> <span style="color:var(--color-low);">Connected</span></div>
                    </div>
                </div>
"""
html = html.replace('<div id="user-controls">', f'<div id="user-controls">\n{sys_status}')

html = html.replace('</footer>', '<br> Powered by Google Firebase and Google Web Services\n    </footer>')

html = html.replace('cell.innerHTML = `', 'cell.innerHTML = `\n                            <div style="position:absolute; top:-18px; font-size:9px; background:rgba(0,0,0,0.7); padding:2px 4px; border-radius:4px; max-width:60px; text-align:center; white-space:nowrap;">${specialNodes[i].name}</div>')

toast_pattern = re.compile(r"let svg = '';.*?svg = '<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12\.01\" y2=\"8\"></line>';", re.DOTALL)

toast_replacement = """let svg = '';
                if (type === 'success') svg = '<span class="material-icons" style="color:var(--color-low); font-size:20px;">check_circle</span>';
                else if (type === 'danger') svg = '<span class="material-icons" style="color:var(--color-high); font-size:20px;">warning</span>';
                else svg = '<span class="material-icons" style="color:var(--color-med); font-size:20px;">info</span>';"""

html = toast_pattern.sub(toast_replacement, html)
html = html.replace('<svg aria-hidden="true" class="icon-svg" style="width:20px; height:20px; color:var(--text-primary)"><g>${svg}</g></svg>', '${svg}')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
