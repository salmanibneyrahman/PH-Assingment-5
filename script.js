// script.js
let allIssues = [];

const API_ALL = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
const API_SINGLE = (id) => `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

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

// Dynamic label with different colors & icons (exactly as you wanted)
function getLabelHTML(label) {
    const l = label.toLowerCase().trim();
    
    if (l === 'bug' || l.includes('bug')) {
        return `<span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold">
            <img src="./assets/BugDroid.png" class="w-4 h-4"> ${label.toUpperCase()}
        </span>`;
    }
    if (l === 'enhancement' || l.includes('enhancement')) {
        return `<span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-bold">
            <img src="./assets/Sparkle.png" class="w-4 h-4"> ${label.toUpperCase()}
        </span>`;
    }
    if (l.includes('help') || l.includes('wanted')) {
        return `<span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
            <i class="fa-solid fa-life-ring"></i> HELP WANTED
        </span>`;
    }
    // default for any other label
    return `<span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
        ${label.toUpperCase()}
    </span>`;
}

function renderIssues(issues) {
    const container = document.getElementById('issues-container');
    container.innerHTML = '';

    if (issues.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-12">No issues found</p>`;
        return;
    }

    issues.forEach(issue => {
        const isOpen = (issue.status || issue.state || 'open').toLowerCase() === 'open';

        const cardHTML = `
            <div class="card bg-white shadow-sm border border-gray-200 issue-card cursor-pointer overflow-hidden">
                <div class="${isOpen ? 'top-border-open' : 'top-border-closed'}"></div>
                
                <div class="card-body p-5">
                    <!-- Top row: Status icon + Priority -->
                    <div class="flex justify-between items-center mb-3">
                        <img src="./assets/${isOpen ? 'Open-Status.png' : 'Closed-Status.png'}" class="w-6 h-6">
                        
                        <span class="text-xs bg-red-100 text-red-600 px-6 py-1 rounded-[100px] font-bold">
                            ${(issue.priority || 'HIGH').toUpperCase()}
                        </span>
                    </div>

                    <!-- Title -->
                    <h3 class="font-semibold text-sm leading-tight mb-2">${issue.title}</h3>

                    <!-- Description -->
                    <p class="text-xs text-gray-500 mt-2 line-clamp-2">
                        ${issue.description || issue.body || 'No description provided.'}
                    </p>

                    <!-- Labels - DIFFERENT COLORS & ICONS -->
                    <div class="flex gap-3 mt-4 flex-wrap">
                        ${(issue.labels || ['BUG']).map(label => getLabelHTML(label)).join('')}
                    </div>

                    <!-- Footer with border-top (EXACTLY as in your HTML) -->
                    <div class="pt-4 mt-4 border-t border-[#e4e4e7] text-gray-400 text-xs">
                        #${issue.id || issue.number} by ${issue.author || issue.user?.login || 'Unknown'}<br>
                        ${issue.createdAt 
                            ? new Date(issue.createdAt).toLocaleDateString('en-US', {month:'numeric', day:'numeric', year:'numeric'}) 
                            : '1/15/2024'}
                    </div>
                </div>
            </div>
        `;

        const cardWrapper = document.createElement('div');
        cardWrapper.innerHTML = cardHTML;
        cardWrapper.querySelector('.card').onclick = () => showIssueModal(issue.id || issue.number);
        container.appendChild(cardWrapper);
    });
}


function filterIssues(type) {}
function searchIssues() {}
async function showIssueModal(id) { }
function closeModal() {}
function newIssue() { alert("New Issue modal would open here ✨"); }

window.onload = () => {
    if (window.location.pathname.includes('dashboard.html')) {
        fetchIssues();
    }
};