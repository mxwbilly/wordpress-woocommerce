const tokenKey = 'greensmart-admin-token';
const pageSize = 20;
const adminApiBase = '/api/admin';

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
const quotePriceInput = document.getElementById('quotePriceInput');
const quoteCurrencyInput = document.getElementById('quoteCurrencyInput');
const quoteMoqInput = document.getElementById('quoteMoqInput');
const quoteIncotermInput = document.getElementById('quoteIncotermInput');
const quoteValidityInput = document.getElementById('quoteValidityInput');
const quoteNoteInput = document.getElementById('quoteNoteInput');
const createQuoteBtn = document.getElementById('createQuoteBtn');
const quoteList = document.getElementById('quoteList');
const kpiTotal = document.getElementById('kpiTotal');
const kpi7d = document.getElementById('kpi7d');
const kpiQuoted = document.getElementById('kpiQuoted');
const kpiWon = document.getElementById('kpiWon');
const notifyEmailInput = document.getElementById('notifyEmailInput');
const defaultAssigneeInput = document.getElementById('defaultAssigneeInput');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

let inquiryItems = [];
let selectedInquiryId = '';
let currentPage = 1;
let totalItems = 0;
let users = [];
let currentUser = null;

const statusLabelMap = {
    new: '新建',
    contacted: '已联系',
    quoted: '已报价',
    won: '已成交',
    lost: '已流失'
};

const productLabelMap = {
    bamboo: '竹纤维花盆',
    'self-watering': '自动浇水陶瓷花盆',
    nursery: '可堆叠育苗盘套装',
    terracotta: '透气红陶花盆',
    balcony: '阳台菜园花箱',
    coir: '悬挂椰棕花篮',
    other: '其他/定制需求'
};

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
    if (!userId) return '未分配';
    const user = users.find((item) => item.id === userId);
    return user ? user.name || user.email : userId;
}

function getStatusLabel(status) {
    return statusLabelMap[status] || status || '-';
}

function getProductLabel(product) {
    if (!product) return '-';
    return productLabelMap[product] || product;
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
    pageInfo.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= totalPages;
}

function renderRows(items) {
    if (!Array.isArray(items) || items.length === 0) {
        inquiryRows.innerHTML = '<tr><td colspan="7">暂无询盘记录</td></tr>';
        summaryText.textContent = `当前 0 条（总计 ${totalItems} 条）`;
        return;
    }
    summaryText.textContent = `本页 ${items.length} 条（总计 ${totalItems} 条）`;
    inquiryRows.innerHTML = items.map((item) => `
        <tr>
            <td>${new Date(item.createdAt).toLocaleString()}</td>
            <td><span class="status-pill">${getStatusLabel(item.status)}</span></td>
            <td>${escapeHtml(item.contact?.name || '')}</td>
            <td>${escapeHtml(item.contact?.email || '')}</td>
            <td>${escapeHtml(item.contact?.country || '')}</td>
            <td>${escapeHtml(getProductLabel(item.product))}</td>
            <td>
                <div class="row-actions">
                    <select data-role="row-status" data-id="${item.id}">
                        <option value="new" ${item.status === 'new' ? 'selected' : ''}>新建</option>
                        <option value="contacted" ${item.status === 'contacted' ? 'selected' : ''}>已联系</option>
                        <option value="quoted" ${item.status === 'quoted' ? 'selected' : ''}>已报价</option>
                        <option value="won" ${item.status === 'won' ? 'selected' : ''}>已成交</option>
                        <option value="lost" ${item.status === 'lost' ? 'selected' : ''}>已流失</option>
                    </select>
                    <button type="button" class="btn-compact" data-role="save-row-status" data-id="${item.id}">保存</button>
                    <button type="button" class="btn-compact btn-outline" data-role="open-detail" data-id="${item.id}">详情</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderTimeline(item) {
    const timeline = Array.isArray(item.timeline) ? item.timeline : [];
    if (timeline.length === 0) {
        timelineList.innerHTML = '<li>暂无跟进记录</li>';
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
    const options = ['<option value="">未分配</option>'];
    users.forEach((user) => {
        options.push(`<option value="${escapeHtml(user.id)}">${escapeHtml(user.name || user.email)}</option>`);
    });
    detailAssigneeSelect.innerHTML = options.join('');
    defaultAssigneeInput.innerHTML = ['<option value="">默认负责人（不设置）</option>', ...options.slice(1)].join('');
}

function setSelectedInquiry(item) {
    if (!item) {
        selectedInquiryId = '';
        detailsPanel.classList.add('hidden');
        return;
    }
    selectedInquiryId = item.id;
    detailsPanel.classList.remove('hidden');
    detailMeta.textContent = `#${item.id} · ${item.contact?.name || '-'} · ${item.contact?.email || '-'} · ${item.contact?.country || '-'} · 负责人：${getUserName(item.assigneeId)}`;
    detailMessage.textContent = item.message || '';
    detailStatusSelect.value = item.status || 'new';
    detailAssigneeSelect.value = item.assigneeId || '';
    detailNoteInput.value = '';
    renderTimeline(item);
    renderQuotes(item.quotes || []);
    quotePriceInput.value = '';
    quoteMoqInput.value = '';
    quoteIncotermInput.value = '';
    quoteValidityInput.value = '30';
    quoteNoteInput.value = '';
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
    const result = await apiFetch(`${adminApiBase}/users`);
    users = result.items || [];
    fillAssigneeOptions();
}

function renderQuotes(quotes) {
    if (!Array.isArray(quotes) || quotes.length === 0) {
        quoteList.innerHTML = '<li>暂无报价记录</li>';
        return;
    }
    const sorted = [...quotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    quoteList.innerHTML = sorted.map((quote) => `
        <li>
            <strong>${escapeHtml(quote.quoteNo)}</strong>
            <div>${escapeHtml(quote.currency)} ${escapeHtml(quote.unitPrice)} · MOQ ${escapeHtml(quote.moq || '-')} · ${escapeHtml(quote.incoterm || '-')}</div>
            <div>有效期：${escapeHtml(quote.validityDays)} 天 · ${new Date(quote.createdAt).toLocaleString()}</div>
            <div>${escapeHtml(quote.note || '')}</div>
        </li>
    `).join('');
}

function updateKpis(summary) {
    const byStatus = summary?.byStatus || {};
    kpiTotal.textContent = String(summary?.total || 0);
    kpi7d.textContent = String(summary?.recent7d || 0);
    kpiQuoted.textContent = String(byStatus.quoted || 0);
    kpiWon.textContent = String(byStatus.won || 0);
}

async function loadDashboardSummary() {
    const result = await apiFetch(`${adminApiBase}/dashboard/summary`);
    updateKpis(result.item || {});
}

async function loadSettings() {
    if (!currentUser || currentUser.role !== 'admin') {
        notifyEmailInput.value = '';
        defaultAssigneeInput.value = '';
        notifyEmailInput.disabled = true;
        defaultAssigneeInput.disabled = true;
        saveSettingsBtn.disabled = true;
        return;
    }
    notifyEmailInput.disabled = false;
    defaultAssigneeInput.disabled = false;
    saveSettingsBtn.disabled = false;
    const result = await apiFetch(`${adminApiBase}/settings`);
    notifyEmailInput.value = result.item?.notifyEmail || '';
    defaultAssigneeInput.value = result.item?.defaultAssigneeId || '';
}

async function loadInquiries() {
    try {
        const query = buildQueryFromFilters();
        const result = await apiFetch(`${adminApiBase}/inquiries?${query.toString()}`);
        inquiryItems = result.items || [];
        totalItems = Number(result.total || 0);
        renderRows(inquiryItems);
        updatePageControls();
        if (selectedInquiryId) {
            const selected = inquiryItems.find((item) => item.id === selectedInquiryId);
            if (selected) {
                setSelectedInquiry(selected);
            } else {
                const detailResult = await apiFetch(`${adminApiBase}/inquiries/${encodeURIComponent(selectedInquiryId)}`);
                setSelectedInquiry(detailResult.item);
            }
        }
        await loadDashboardSummary();
    } catch (error) {
        inquiryRows.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;
        summaryText.textContent = '加载失败';
    }
}

async function patchInquiry(inquiryId, payload) {
    await apiFetch(`${adminApiBase}/inquiries/${encodeURIComponent(inquiryId)}`, {
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
    const response = await fetch(`${adminApiBase}/inquiries/export.csv?${query.toString()}`, {
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

async function createQuote() {
    if (!selectedInquiryId) {
        alert('请先选择一条询盘。');
        return;
    }
    const payload = {
        unitPrice: Number(quotePriceInput.value),
        currency: String(quoteCurrencyInput.value || 'USD').trim().toUpperCase(),
        moq: quoteMoqInput.value.trim(),
        incoterm: quoteIncotermInput.value.trim().toUpperCase(),
        validityDays: Number(quoteValidityInput.value || 30),
        note: quoteNoteInput.value.trim()
    };
    await apiFetch(`${adminApiBase}/inquiries/${encodeURIComponent(selectedInquiryId)}/quotes`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    await loadInquiries();
}

loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = document.getElementById('loginBtn');
    submitBtn.disabled = true;
    loginFeedback.textContent = '登录中...';
    try {
        const formData = new FormData(loginForm);
        const payload = Object.fromEntries(formData.entries());
        const result = await apiFetch(`${adminApiBase}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        setToken(result.token);
        currentUser = result.user || null;
        setAuthState(true);
        loginFeedback.textContent = '';
        await loadUsers();
        await loadSettings();
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
    currentUser = null;
});

inquiryRows?.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const role = target.dataset.role;
    const inquiryId = target.dataset.id;
    if (!role || !inquiryId) return;

    if (role === 'open-detail') {
        const detailResult = await apiFetch(`${adminApiBase}/inquiries/${encodeURIComponent(inquiryId)}`);
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
        alert('请先输入备注内容。');
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

createQuoteBtn?.addEventListener('click', async () => {
    createQuoteBtn.disabled = true;
    try {
        await createQuote();
    } catch (error) {
        alert(error.message);
    } finally {
        createQuoteBtn.disabled = false;
    }
});

saveSettingsBtn?.addEventListener('click', async () => {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('仅管理员可以修改系统设置。');
        return;
    }
    saveSettingsBtn.disabled = true;
    try {
        await apiFetch(`${adminApiBase}/settings`, {
            method: 'PATCH',
            body: JSON.stringify({
                notifyEmail: notifyEmailInput.value.trim(),
                defaultAssigneeId: defaultAssigneeInput.value
            })
        });
        await loadSettings();
        await loadInquiries();
    } catch (error) {
        alert(error.message);
    } finally {
        saveSettingsBtn.disabled = false;
    }
});

async function boot() {
    const token = getToken();
    if (!token) {
        setAuthState(false);
        return;
    }
    try {
        const me = await apiFetch(`${adminApiBase}/auth/me`);
        currentUser = me.user || null;
        setAuthState(true);
        await loadUsers();
        await loadSettings();
        await loadInquiries();
    } catch (error) {
        setToken('');
        setAuthState(false);
    }
}

boot();
