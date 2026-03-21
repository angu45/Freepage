// --- CORE HUB LOGIC ---

// 1. Theme Management
function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('hub-theme', theme);
    // Update logo/dot colors dynamically if they exist on the page
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    if(document.getElementById('logoBox')) document.getElementById('logoBox').style.backgroundColor = primaryColor;
}

// 2. History System (The Data Collector)
function saveToHistory(toolName, resultSummary) {
    let history = JSON.parse(localStorage.getItem('freerate-history')) || [];
    
    const newEntry = {
        id: Date.now(),
        tool: toolName,
        result: resultSummary,
        date: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    // Keep only the last 20 entries
    history.unshift(newEntry);
    if (history.length > 20) history.pop();

    localStorage.setItem('freerate-history', JSON.stringify(history));
}

function renderHistory() {
    const historyContainer = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem('freerate-history')) || [];

    if (history.length === 0) {
        historyContainer.innerHTML = '<p class="text-slate-400 text-xs text-center py-4">No recent activity found.</p>';
        return;
    }

    historyContainer.innerHTML = history.map(item => `
        <div class="flex items-start justify-between p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
            <div>
                <p class="font-bold text-[10px] uppercase text-indigo-600 tracking-wider">${item.tool}</p>
                <p class="text-sm font-semibold text-slate-700">${item.result}</p>
                <p class="text-[9px] text-slate-400">${item.date}</p>
            </div>
            <button onclick="deleteHistoryItem(${item.id})" class="text-slate-300 hover:text-rose-500 text-xs">✕</button>
        </div>
    `).join('');
}

function deleteHistoryItem(id) {
    let history = JSON.parse(localStorage.getItem('freerate-history')) || [];
    history = history.filter(item => item.id !== id);
    localStorage.setItem('freerate-history', JSON.stringify(history));
    renderHistory();
}

function clearAllHistory() {
    if(confirm("Clear all your calculation history?")) {
        localStorage.removeItem('freerate-history');
        renderHistory();
    }
}

// 3. Modal Toggles
function openSettings() { 
    document.getElementById('settingsModal').classList.remove('hidden'); 
    renderHistory(); // Refresh history when opened
}

function closeSettings() { 
    document.getElementById('settingsModal').classList.add('hidden'); 
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('hub-theme') || 'theme-indigo';
    setTheme(savedTheme);
});
