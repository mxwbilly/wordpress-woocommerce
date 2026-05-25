const tokenKey = 'greensmart-admin-token';
const pageSize = 20;

const loginCard = document.getElementById('loginCard');
const dashboardCard = document.getElementById('dashboardCard');
const loginForm = document.getElementById('loginForm');
const loginFeedback = document.getElementById('loginFeedback');
const inquiryRows = document.getElementById('inquiryRows');
const refreshBtn = document.getElementById('refreshBtn');
const logoutBtn = document.getElementById('logoutBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');
const statusFilter = document.getElementById('statusFilter');
const countryFilter = document.getElementById('countryFilter');
const productFilter = document.getElementById('productFilter');
const keywordFilter = document.getElementById('keywordFilter');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const summaryText = document.getElementById('summaryText');
const detailsPanel = document.getElementById('detailsPanel');
const detailMeta = document.getElementById('detailMeta');
const detailMessage = document.getElementById('detailMessage');
const detailStatusSelect = document.getElementById('detailStatusSelect');
const detailAssigneeSelect = document.getElementById('detailAssigneeSelect');
const detailNoteInput = document.getElementById('detailNoteInput');
const saveStatusBtn = document.getElementById('saveStatusBtn');
const addNoteBtn = document.getElementById('addNoteBtn');
const timelineList = document.getElementById('timelineList');

let inquiryItems = [];
let selectedInquiryId = '';
let currentPage = 1;
let totalItems = 0;
let users = [];

function setAuthState(loggedIn) {
    loginCard.classList.toggle('hidden', loggedIn);
    dashboardCard.classList.toggle('hidden', !loggedIn);
}

function getToken() {
    return localStorage.getItem(tokenKey) || '';
}

function setToken(value) {
    if (value) {
        localStorage.setItem(tokenKey, value);
    } else {
        localStorage.removeItem(tokenKey);
    }
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getUserName(userId) {
    if (!userId) return 'Unassigned';
    const user = users.find((item) => item.id === userId);
    return user ? user.name || user.email : userId;
}

async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || `Request failed (${response.status})`);
    }
    return response.json();
}

function updatePageControls() {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

function renderRows(items) {
    if (!Array.isArray(items) || items.length === 0) {
        inquiryRows.innerHTML = '<tr><td colspan="7">No inquiries yet.</td></tr>';
        summaryText.textContent = `0 records (total ${totalItems})`;
        return;
    }
    summaryText.textContent = `${items.length} records on this page (total ${totalItems})`;
    inquiryRows.innerHTML = items.map((item) => `
        <tr>
            <td>${new Date(item.createdAt).toLocaleString()}</td>
            <td><span class="status-pill">${item.status}</span></td>
            <td>${escapeHtml(item.contact?.name || '')}</td>
            <td>${escapeHtml(item.contact?.email || '')}</td>
            <td>${escapeHtml(item.contact?.country || '')}</td>
            <td>${escapeHtml(item.product || '-')}</td>
            <td>
                <div class="row-actions">
                    <select data-role="row-status" data-id="${item.id}">
                        <option value="new" ${item.status === 'new' ? 'selected' : ''}>new</option>
                        <option value="contacted" ${item.status === 'contacted' ? 'selected' : ''}>contacted</option>
                        <option value="quoted" ${item.status === 'quoted' ? 'selected' : ''}>quoted</option>
                        <option value="won" ${item.status === 'won' ? 'selected' : ''}>won</option>
                        <option value="lost" ${item.status === 'lost' ? 'selected' : ''}>lost</option>
                    </select>
                    <button type="button" class="btn-compact" data-role="save-row-status" data-id="${item.id}">Save</button>
                    <button type="button" class="btn-compact btn-outline" data-role="open-detail" data-id="${item.id}">Details</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderTimeline(item) {
    const timeline = Array.isArray(item.timeline) ? item.timeline : [];
    if (timeline.length === 0) {
        timelineList.innerHTML = '<li>No timeline yet.</li>';
        return;
    }
    const sorted = [...timeline].sort((a, b) => new Date(b.at) - new Date(a.at));
    timelineList.innerHTML = sorted.map((entry) => `
        <li>
            <strong>${escapeHtml(entry.type || 'event')}</strong>
            <div>${new Date(entry.at).toLocaleString()}</div>
            <div>${escapeHtml(entry.note || '')}</div>
        </li>
    `).join('');
}

function fillAssigneeOptions() {
    const options = ['<option value="">Unassigned</option>'];
    users.forEach((user) => {
        options.push(`<option value="${escapeHtml(user.id)}">${escapeHtml(user.name || user.email)}</option>`);
    });
    detailAssigneeSelect.innerHTML = options.join('');
}

function setSelectedInquiry(item) {
    if (!item) {
        selectedInquiryId = '';
        detailsPanel.classList.add('hidden');
        return;
    }
    selectedInquiryId = item.id;
    detailsPanel.classList.remove('hidden');
    detailMeta.textContent = `#${item.id} · ${item.contact?.name || '-'} · ${item.contact?.email || '-'} · ${item.contact?.country || '-'} · Owner: ${getUserName(item.assigneeId)}`;
    detailMessage.textContent = item.message || '';
    detailStatusSelect.value = item.status || 'new';
    detailAssigneeSelect.value = item.assigneeId || '';
    detailNoteInput.value = '';
    renderTimeline(item);
}

function buildQueryFromFilters() {
    const params = new URLSearchParams();
    if (statusFilter.value) params.set('status', statusFilter.value);
    if (countryFilter.value.trim()) params.set('country', countryFilter.value.trim());
    if (productFilter.value.trim()) params.set('product', productFilter.value.trim());
    if (keywordFilter.value.trim()) params.set('q', keywordFilter.value.trim());
    params.set('pageSize', String(pageSize));
    params.set('page', String(currentPage));
    return params;
}

async function loadUsers() {
    const result = await apiFetch('/api/users');
    users = result.items || [];
    fillAssigneeOptions();
}

async function loadInquiries() {
    try {
        const query = buildQueryFromFilters();
        const result = await apiFetch(`/api/inquiries?${query.toString()}`);
        inquiryItems = result.items || [];
        totalItems = Number(result.total || 0);
        renderRows(inquiryItems);
        updatePageControls();
        if (selectedInquiryId) {
            const selected = inquiryItems.find((item) => item.id === selectedInquiryId);
            if (selected) {
                setSelectedInquiry(selected);
            } else {
                const detailResult = await apiFetch(`/api/inquiries/${encodeURIComponent(selectedInquiryId)}`);
                setSelectedInquiry(detailResult.item);
            }
        }
    } catch (error) {
        inquiryRows.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
        summaryText.textContent = 'Load failed';
    }
}

async function patchInquiry(inquiryId, payload) {
    await apiFetch(`/api/inquiries/${encodeURIComponent(inquiryId)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
    });
    await loadInquiries();
}

async function exportCsv() {
    const token = getToken();
    const query = buildQueryFromFilters();
    query.delete('page');
    query.delete('pageSize');
    const response = await fetch(`/api/inquiries/export.csv?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error(`Export failed (${response.status})`);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-page-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById('loginBtn');
    submitBtn.disabled = true;
    loginFeedback.textContent = 'Signing in...';
    try {
        const formData = new FormData(loginForm);
        const payload = Object.fromEntries(formData.entries());
        const result = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        setToken(result.token);
        setAuthState(true);
        loginFeedback.textContent = '';
        await loadUsers();
        await loadInquiries();
    } catch (error) {
        loginFeedback.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
    }
});

refreshBtn?.addEventListener('click', async () => {
    await loadInquiries();
});

exportCsvBtn?.addEventListener('click', async () => {
    exportCsvBtn.disabled = true;
    try {
        await exportCsv();
    } catch (error) {
        alert(error.message);
    } finally {
        exportCsvBtn.disabled = false;
    }
});

applyFilterBtn?.addEventListener('click', async () => {
    currentPage = 1;
    await loadInquiries();
});

clearFilterBtn?.addEventListener('click', async () => {
    statusFilter.value = '';
    countryFilter.value = '';
    productFilter.value = '';
    keywordFilter.value = '';
    currentPage = 1;
    await loadInquiries();
});

prevPageBtn?.addEventListener('click', async () => {
    if (currentPage <= 1) return;
    currentPage -= 1;
    await loadInquiries();
});

nextPageBtn?.addEventListener('click', async () => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    if (currentPage >= totalPages) return;
    currentPage += 1;
    await loadInquiries();
});

logoutBtn?.addEventListener('click', () => {
    setToken('');
    setAuthState(false);
    inquiryRows.innerHTML = '';
    detailsPanel.classList.add('hidden');
    selectedInquiryId = '';
    users = [];
});

inquiryRows?.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const role = target.dataset.role;
    const inquiryId = target.dataset.id;
    if (!role || !inquiryId) return;

    if (role === 'open-detail') {
        const detailResult = await apiFetch(`/api/inquiries/${encodeURIComponent(inquiryId)}`);
        setSelectedInquiry(detailResult.item);
        return;
    }

    if (role === 'save-row-status') {
        const statusSelect = inquiryRows.querySelector(`select[data-role="row-status"][data-id="${inquiryId}"]`);
        if (!(statusSelect instanceof HTMLSelectElement)) return;
        target.setAttribute('disabled', 'disabled');
        try {
            await patchInquiry(inquiryId, { status: statusSelect.value });
        } catch (error) {
            alert(error.message);
        } finally {
            target.removeAttribute('disabled');
        }
    }
});

saveStatusBtn?.addEventListener('click', async () => {
    if (!selectedInquiryId) return;
    saveStatusBtn.disabled = true;
    try {
        await patchInquiry(selectedInquiryId, {
            status: detailStatusSelect.value,
            assigneeId: detailAssigneeSelect.value
        });
    } catch (error) {
        alert(error.message);
    } finally {
        saveStatusBtn.disabled = false;
    }
});

addNoteBtn?.addEventListener('click', async () => {
    if (!selectedInquiryId) return;
    const note = detailNoteInput.value.trim();
    if (!note) {
        alert('Please enter a note first.');
        return;
    }
    addNoteBtn.disabled = true;
    try {
        await patchInquiry(selectedInquiryId, { note });
    } catch (error) {
        alert(error.message);
    } finally {
        addNoteBtn.disabled = false;
    }
});

async function boot() {
    const token = getToken();
    if (!token) {
        setAuthState(false);
        return;
    }
    try {
        await apiFetch('/api/auth/me');
        setAuthState(true);
        await loadUsers();
        await loadInquiries();
    } catch (error) {
        setToken('');
        setAuthState(false);
    }
}

boot();
