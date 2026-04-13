document.addEventListener("DOMContentLoaded", () => {
            // STATE
            const totalCells = 144;
            const cols = 12; const rows = 12;
            const gridData = [];
            let simActive = false;
            let activeAlertsCount = 0;

            const specialNodes = {
                5: { key: 'stage', name: 'Main Stage', icon: 'ic-stage' },
                21: { key: 'food', name: 'Food Court', icon: 'ic-food' },
                60: { key: 'washroom', name: 'Washrooms', icon: 'ic-washroom' },
                142: { key: 'exit', name: 'North Exit', icon: 'ic-exit' },
                132: { key: 'start', name: 'You are here', icon: 'ic-start' }
            };

            const targetMap = { 'food': 21, 'exit': 142, 'washroom': 60, 'stage': 5 };

            // BOOTSTRAP
            setTimeout(() => {
                document.getElementById('loader').style.opacity = '0';
                document.getElementById('loader').style.visibility = 'hidden';
                document.getElementById('intro-modal').classList.add('active');
            }, 1200);

            document.getElementById('start-btn').addEventListener('click', () => {
                document.getElementById('intro-modal').classList.remove('active');
                simActive = true;
                showToast('System Activated', 'Simulation matrices have been loaded successfully.', 'success');
            });

            // GRID INIT
            const mapEl = document.getElementById('heatmap');
            function initGrid() {
                for (let i = 0; i < totalCells; i++) {
                    let cell = document.createElement('div');
                    let x = i % cols, y = Math.floor(i / cols);
                    let letter = String.fromCharCode(65 + Math.floor(y / 2));
                    let num = x + 1;

                    cell.className = 'zone low';
                    cell.dataset.idx = i;
                    cell.dataset.name = `Zone ${letter}${num}`;

                    // Icon injection
                    if (specialNodes[i]) {
                        cell.innerHTML = `
                            <div class="zone-icon-wrapper">
                                <svg class="icon-svg"><use href="#${specialNodes[i].icon}"></use></svg>
                            </div>
                        `;
                        cell.style.background = 'rgba(255,255,255,0.06)';
                        cell.style.border = '1px solid rgba(255,255,255,0.15)';
                    }

                    mapEl.appendChild(cell);

                    // Compute start density
                    let distRaw = Math.abs(x - 5.5) + Math.abs(y - 5.5);
                    let denRaw = 10;
                    if (distRaw < 3) denRaw = 75 + Math.random() * 25;
                    else if (distRaw < 6) denRaw = 40 + Math.random() * 35;
                    else denRaw = Math.random() * 40;

                    let dCategory = 'low';
                    if (denRaw > 75) dCategory = 'high';
                    else if (denRaw > 40) dCategory = 'medium';

                    gridData.push({ id: i, densityValue: Math.floor(denRaw), density: dCategory });
                }
                syncGridDOM();
            }

            function syncGridDOM() {
                for (let i = 0; i < totalCells; i++) {
                    const c = mapEl.children[i];
                    if (!c.classList.contains('path')) {
                        c.className = 'zone ' + gridData[i].density;
                    }
                }
            }

            initGrid();

            // TOOLTIP LOGIC
            const tooltip = document.getElementById('floating-tooltip');
            mapEl.addEventListener('mousemove', (e) => {
                const target = e.target.closest('.zone');
                if (target) {
                    const idx = target.dataset.idx;
                    const d = gridData[idx];
                    let dColor = 'var(--color-low)';
                    if (d.density === 'medium') dColor = 'var(--color-med)';
                    if (d.density === 'high') dColor = 'var(--color-high)';

                    let specialHtml = '';
                    if (specialNodes[idx]) specialHtml = `<div style="font-size:11px; color:var(--accent-primary); font-weight:600; margin-top:4px;">${specialNodes[idx].name}</div>`;

                    tooltip.innerHTML = `
                        <div style="font-weight:600;">${target.dataset.name}</div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <div style="width:8px; height:8px; border-radius:2px; background:${dColor}"></div>
                            <span style="color:var(--text-secondary)">Density: ${d.densityValue}%</span>
                        </div>
                        ${specialHtml}
                    `;

                    tooltip.style.left = (e.clientX + 16) + 'px';
                    tooltip.style.top = (e.clientY + 16) + 'px';
                    tooltip.classList.add('visible');
                } else {
                    tooltip.classList.remove('visible');
                }
            });
            mapEl.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

            // SIMULATION LOOP
            setInterval(() => {
                if (!simActive) return;

                let hC = 0, mC = 0, maxVal = 0, maxZone = '';

                gridData.forEach((cell, i) => {
                    // Slight variation
                    if (Math.random() < 0.2 && !specialNodes[i]) {
                        cell.densityValue += (Math.random() * 20 - 10);
                        if (cell.densityValue < 5) cell.densityValue = 5;
                        if (cell.densityValue > 99) cell.densityValue = 99;

                        let val = cell.densityValue;
                        if (val > 78) cell.density = 'high';
                        else if (val > 45) cell.density = 'medium';
                        else cell.density = 'low';
                    }

                    if (cell.density === 'high') hC++;
                    if (cell.density === 'medium') mC++;

                    if (cell.densityValue > maxVal) {
                        maxVal = cell.densityValue;
                        maxZone = mapEl.children[i].dataset.name;
                    }
                });

                syncGridDOM();

                // Stats updating
                let totalLoad = ((hC * 3 + mC * 1.5 + (totalCells - hC - mC) * 0.5) / (totalCells * 3)) * 100;
                document.getElementById('statLoad').innerText = Math.floor(totalLoad) + '%';

                let zEl = document.getElementById('statZone');
                zEl.innerText = maxZone;
                zEl.style.color = maxVal > 80 ? 'var(--color-high)' : 'var(--color-med)';

                // Auto Red Alert
                if (maxVal > 95 && Math.random() > 0.6) {
                    showToast('Critical Congestion', `Zone ${maxZone} has hit maximum capacity thresholds. Redirecting...`, 'danger');
                }
            }, 2500);

            // QUEUE LOGIC
            const queues = [
                { id: 'q1', name: 'Food Court A', base: 18, current: 18 },
                { id: 'q2', name: 'Food Court B', base: 8, current: 8 },
                { id: 'q3', name: 'Drinks Desk', base: 12, current: 12 }
            ];

            function renderQ() {
                const c = document.getElementById('queue-container');
                c.innerHTML = '';

                let lowest = queues.reduce((prev, curr) => prev.current < curr.current ? prev : curr);

                queues.forEach(q => {
                    let col = 'var(--color-low)';
                    if (q.current > 15) col = 'var(--color-high)';
                    else if (q.current > 10) col = 'var(--color-med)';

                    let isBest = (q === lowest);
                    let w = Math.min((q.current / 25) * 100, 100);

                    c.innerHTML += `
                        <div class="queue-item ${isBest ? 'best' : ''}">
                            <div class="queue-header">
                                <span>${q.name}</span>
                                <span style="color:${col}">${Math.floor(q.current)} min wait</span>
                            </div>
                            <div class="queue-bar-bg">
                                <div class="queue-bar" style="width:${w}%; background:${col}"></div>
                            </div>
                        </div>
                    `;
                });
            }
            renderQ();

            setInterval(() => {
                if (!simActive) return;
                queues.forEach(q => {
                    q.current += (Math.random() * 4 - 2);
                    if (q.current < 2) q.current = 2;
                    if (q.current > 25) q.current = 25;
                });
                renderQ();
            }, 3500);

            // NAVIGATION ALGORITHM
            let lastPath = [];
            const btnRoute = document.getElementById('btnRoute');

            btnRoute.addEventListener('click', () => {
                if (!simActive) return;

                // reset visuals
                lastPath.forEach(id => {
                    let cn = mapEl.children[id];
                    cn.classList.remove('path', 'path-start', 'path-end');
                });
                syncGridDOM(); // reapply colors

                const targetStr = document.getElementById('selDest').value;
                const eIdx = targetMap[targetStr];
                const sIdx = 132; // Start node

                // Dijkstra Setup
                let dist = Array(totalCells).fill(Infinity);
                let prev = Array(totalCells).fill(null);
                dist[sIdx] = 0;
                let unvisited = new Set([...Array(totalCells).keys()]);

                while (unvisited.size > 0) {
                    let u = null, min = Infinity;
                    unvisited.forEach(node => {
                        if (dist[node] < min) { min = dist[node]; u = node; }
                    });

                    if (u === null || u === eIdx) break;
                    unvisited.delete(u);

                    const ux = u % cols, uy = Math.floor(u / cols);

                    const neighbors = [[ux, uy - 1], [ux, uy + 1], [ux - 1, uy], [ux + 1, uy]];
                    neighbors.forEach(([nx, ny]) => {
                        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                            let v = ny * cols + nx;
                            if (unvisited.has(v)) {
                                let w = 1;
                                let dVal = gridData[v].densityValue;
                                if (dVal > 78) w = 200; // avoid red
                                else if (dVal > 45) w = 30; // hesitate yellow

                                let alt = dist[u] + w;
                                if (alt < dist[v]) { dist[v] = alt; prev[v] = u; }
                            }
                        }
                    });
                }

                let path = []; let curr = eIdx;
                if (prev[curr] !== null || curr === sIdx) {
                    while (curr !== null) { path.unshift(curr); curr = prev[curr]; }
                }

                lastPath = path;

                // Visual Animation
                btnRoute.disabled = true;
                btnRoute.innerHTML = 'Calculating...';

                setTimeout(() => {
                    path.forEach((id, n) => {
                        setTimeout(() => {
                            let cel = mapEl.children[id];
                            cel.className = 'zone path';
                            if (n === 0) cel.classList.add('path-start');
                            if (n === path.length - 1) cel.classList.add('path-end');
                        }, n * 50);
                    });

                    setTimeout(() => {
                        btnRoute.disabled = false;
                        btnRoute.innerHTML = '<svg class="icon-svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg> Optimize Route';
                        showToast('Route Optimized', 'AI has optimized your path to avoid congestion.', 'success');
                    }, path.length * 50 + 200);

                }, 400);
            });

            // TOAST ALERTS 
            const toastCont = document.getElementById('toastContainer');
            function showToast(title, msg, type = 'info') {
                const el = document.createElement('div');
                el.className = `toast ${type}`;

                let svg = '';
                if (type === 'success') svg = '<polyline points="20 6 9 17 4 12"></polyline>';
                else if (type === 'danger') svg = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
                else svg = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';

                el.innerHTML = `
                    <div class="toast-icon">
                        <svg class="icon-svg" style="width:20px; height:20px; color:var(--text-primary)"><g>${svg}</g></svg>
                    </div>
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div class="toast-msg">${msg}</div>
                    </div>
                `;

                toastCont.appendChild(el);

                activeAlertsCount++;
                document.getElementById('statAlerts').innerText = activeAlertsCount;

                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        el.remove();
                        activeAlertsCount = Math.max(0, activeAlertsCount - 1);
                        document.getElementById('statAlerts').innerText = activeAlertsCount;
                    }, 300);
                }, 5000);
            }

            // VIEW TOGGLE
            const modeSwitch = document.getElementById('modeSwitch');
            const userBox = document.getElementById('user-controls');
            const orgBox = document.getElementById('org-controls');

            modeSwitch.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.getElementById('lblUser').style.color = 'var(--text-secondary)';
                    document.getElementById('lblOrg').style.color = '#fff';
                    userBox.style.display = 'none';
                    orgBox.style.display = 'block';
                } else {
                    document.getElementById('lblUser').style.color = '#fff';
                    document.getElementById('lblOrg').style.color = 'var(--text-secondary)';
                    userBox.style.display = 'block';
                    orgBox.style.display = 'none';
                }
            });

            // ORG ACTIONS
            document.getElementById('btnEmerg').addEventListener('click', () => {
                showToast('⚠️ EMERGENCY ALERT TRIGGERED', 'Global notification dispatched requesting immediate venue clearance routing.', 'danger');
            });
            document.getElementById('btnStaff').addEventListener('click', () => {
                showToast('Staff Deployed', 'On-ground task force directed to high density zones.', 'success');
                // Force simulation drop
                gridData.forEach(cell => { if (cell.density === 'high') { cell.densityValue -= 35; } });
            });

        });