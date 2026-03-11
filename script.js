let allIssues = [];

const API_ALL = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
const API_SINGLE = (id) => `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

// ====================== FETCH ISSUES ======================
async function fetchIssues() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('issues-container').innerHTML = '';

    try {
        const res = await fetch(API_ALL);
        const json = await res.json();
        allIssues = json.data || json || [];
        
        document.getElementById('total-issues').textContent = `${allIssues.length} Issues`;
        renderIssues(allIssues);
    } catch (e) {
        document.getElementById('issues-container').innerHTML = `
            <p class="col-span-full text-red-500 text-center py-12">Failed to load issues</p>`;
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}

// ====================== STATUS ICON ======================
function getStatusIcon(isOpen) {
    return isOpen 
        ? `<img src="./assets/Open-Status.png" class="w-6 h-6">`
        : `<img src="./assets/Closed-Status.png" class="w-6 h-6">`;
}

// ====================== LABELS ======================
function getLabelHTML(label) {
    const l = label.toLowerCase().trim();
    if (l.includes('bug')) {
        return `<span class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
            <img src="./assets/BugDroid.png" class="w-4 h-4"> ${label.toUpperCase()}
        </span>`;
    }
    if (l.includes('enhancement')) {
        return `<span class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold">
            <img src="./assets/Sparkle.png" class="w-4 h-4"> ${label.toUpperCase()}
        </span>`;
    }
    if (l.includes('help') || l.includes('wanted')) {
        return `<span class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-600 text-[10px] font-bold">
            <i class="fa-solid fa-life-ring"></i> HELP WANTED
        </span>`;
    }
    return `<span class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">
        ${label.toUpperCase()}
    </span>`;
}

// ====================== PRIORITY BADGE ======================
function getPriorityBadge(priority) {
    const p = (priority || 'HIGH').toLowerCase();
    if (p === 'high') return `<span class="text-xs bg-red-100 text-red-600 px-6 py-1 rounded-[100px] font-bold">HIGH</span>`;
    if (p === 'medium') return `<span class="text-xs bg-yellow-100 text-yellow-600 px-6 py-1 rounded-[100px] font-bold">MEDIUM</span>`;
    if (p === 'low') return `<span class="text-xs bg-gray-100 text-gray-600 px-6 py-1 rounded-[100px] font-bold">LOW</span>`;
    return `<span class="text-xs bg-red-100 text-red-600 px-6 py-1 rounded-[100px] font-bold">${p.toUpperCase()}</span>`;
}

// ====================== RENDER CARDS ======================
function renderIssues(issues) {
    const container = document.getElementById('issues-container');
    container.innerHTML = '';

    if (issues.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-12">No issues found</p>`;
        return;
    }

    issues.forEach(issue => {
        const status = (issue.status || issue.state || '').toLowerCase();
        const isOpen = status === 'open' || status === 'opened';

        const cardHTML = `
            <div class="card bg-white shadow-sm border border-gray-200 issue-card cursor-pointer overflow-hidden">
                <div class="${isOpen ? 'top-border-open' : 'top-border-closed'}"></div>
                <div class="card-body p-5">
                    <div class="flex justify-between items-center mb-3">
                        ${getStatusIcon(isOpen)}
                        ${getPriorityBadge(issue.priority)}
                    </div>
                    <h3 class="font-semibold text-sm leading-tight mb-2">${issue.title}</h3>
                    <p class="text-xs text-gray-500 mt-2 line-clamp-2">${issue.description || issue.body || 'No description provided.'}</p>
                    <div class="flex gap-2 mt-4 flex-wrap">
                        ${(issue.labels || ['BUG']).map(label => getLabelHTML(label)).join('')}
                    </div>
                    <div class="pt-4 mt-4 border-t border-[#e4e4e7] text-gray-400 text-xs">
                        #${issue.id || issue.number} by ${issue.author || issue.user?.login || 'Unknown'}<br>
                        ${issue.createdAt 
                            ? new Date(issue.createdAt).toLocaleDateString('en-US', {month:'numeric', day:'numeric', year:'numeric'}) 
                            : '1/15/2024'}
                    </div>
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = cardHTML;
        wrapper.querySelector('.card').onclick = () => showIssueModal(issue.id || issue.number);
        container.appendChild(wrapper);
    });
}

// ====================== FILTER TABS ======================
function filterIssues(type) {
    // Reset all buttons
    document.querySelectorAll('#btn-all, #btn-open, #btn-closed').forEach(btn => {
        btn.classList.remove('btn-primary', 'bg-[#4a00ff]', 'text-white');
    });

    // Activate the clicked button
    if (type === 'all') document.getElementById('btn-all').classList.add('btn-primary', 'bg-[#4a00ff]', 'text-white');
    else if (type === 'open') document.getElementById('btn-open').classList.add('btn-primary', 'bg-[#4a00ff]', 'text-white');
    else document.getElementById('btn-closed').classList.add('btn-primary', 'bg-[#4a00ff]', 'text-white');

    // Filter the data
    let filtered = allIssues;
    if (type === 'open') filtered = allIssues.filter(i => (i.status || i.state || '').toLowerCase() === 'open' || (i.status || i.state || '').toLowerCase() === 'opened');
    if (type === 'closed') filtered = allIssues.filter(i => (i.status || i.state || '').toLowerCase() === 'closed');

    renderIssues(filtered);
}

// ====================== SEARCH ======================
function searchIssues() {
    const term = document.getElementById('search-input').value.toLowerCase().trim();
    if (!term) return renderIssues(allIssues);

    const filtered = allIssues.filter(issue => 
        (issue.title || '').toLowerCase().includes(term) ||
        (issue.description || issue.body || '').toLowerCase().includes(term)
    );
    renderIssues(filtered);
}

// ====================== MODAL ======================
async function showIssueModal(id) {
    try {
        const res = await fetch(API_SINGLE(id));
        const json = await res.json();
        const issue = json.data || json;

        const status = (issue.status || issue.state || '').toLowerCase();
        const isOpen = status === 'open' || status === 'opened';

        document.getElementById('modal-title').textContent = issue.title;

        const pill = document.getElementById('modal-status-pill');
        pill.innerHTML = isOpen 
            ? `<span class="bg-green-500 text-white px-5 py-1 rounded-full text-xs font-semibold">Opened</span>`
            : `<span class="bg-purple-500 text-white px-5 py-1 rounded-full text-xs font-semibold">Closed</span>`;
        
        const date = issue.createdAt ? new Date(issue.createdAt) : new Date();
        const formattedDate = `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
        
        document.getElementById('modal-opened-by').innerHTML = 
            `Opened by ${issue.author || issue.user?.login || 'Unknown'} • ${formattedDate}`;

        const labelsDiv = document.getElementById('modal-labels');
        labelsDiv.innerHTML = (issue.labels || ['BUG']).map(label => getLabelHTML(label)).join('');

        document.getElementById('modal-description').textContent = 
            issue.description || issue.body || 'No description provided.';

        document.getElementById('modal-assignee').textContent = 
            issue.author || issue.user?.login || 'Unknown';

        document.getElementById('modal-priority').innerHTML = getPriorityBadge(issue.priority);

        document.getElementById('issue-modal').classList.remove('hidden');
    } catch (e) {
        alert("Could not load issue details");
    }
}

function closeModal() {
    document.getElementById('issue-modal').classList.add('hidden');
}

function newIssue() {
    alert("New Issue modal would open here");
}

// ====================== INIT ======================
window.onload = () => {
    if (window.location.pathname.includes('dashboard.html')) {
        fetchIssues();
    }
};