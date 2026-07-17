// =====================================================
// ExperTwin — Knowledge Transfer MVP
// =====================================================

// -----------------------------------------------
// Mock data
// -----------------------------------------------

const defaultKnowledgeItems = [
  {
    id: crypto.randomUUID(),
    expertName: "Senior operations engineer",
    domain: "Operations",
    riskLevel: "High",
    situation: "Production line slows down without triggering an official alarm",
    officialProcedure: "Check the dashboard, inspect active alerts, and restart the affected subsystem if no alarm is shown.",
    realWorldAdvice: "If the slowdown happens after a shift change, check whether the previous operator manually adjusted the feed rate. This is often not logged properly.",
    warningSigns: "Small output drops, unusual operator comments, repeated manual overrides, and no visible alarm.",
    mistakes: "New employees trust the dashboard too much and restart the subsystem before checking manual overrides.",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    expertName: "Maintenance specialist",
    domain: "Maintenance",
    riskLevel: "Critical",
    situation: "Pump pressure drops suddenly during normal operation",
    officialProcedure: "Inspect the pump, check the valve position, verify flow rate, and escalate if pressure remains unstable.",
    realWorldAdvice: "Before escalating, listen for a short rattling sound near the intake. If present, the issue is usually partial blockage rather than pump failure.",
    warningSigns: "Pressure fluctuation, rattling noise, temperature increase, and delayed response after valve adjustment.",
    mistakes: "Junior staff often replace parts too early instead of checking for partial blockage first.",
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    expertName: "Safety coordinator",
    domain: "Safety",
    riskLevel: "Medium",
    situation: "Workers bypass a safety checklist during urgent maintenance",
    officialProcedure: "All safety checklist steps must be completed before maintenance begins.",
    realWorldAdvice: "When urgency is high, people skip steps they think are repetitive. The team lead should verbally confirm the three highest-risk checks before allowing work to start.",
    warningSigns: "Time pressure, informal verbal approvals, missing signatures, and repeated phrases like 'we have done this before.'",
    mistakes: "New supervisors assume experienced workers will self-regulate under pressure.",
    createdAt: new Date().toISOString()
  }
];

const defaultProfiles = [
  { id: "s1", role: "senior", name: "Henrik Laine", title: "Senior Operations Engineer", initials: "HL", yearsExperience: 28, domains: ["Operations", "Safety"], contributions: 14, retirementMonths: 8, retirementUrgency: "high" },
  { id: "s2", role: "senior", name: "Marja Korhonen", title: "Maintenance Specialist", initials: "MK", yearsExperience: 22, domains: ["Maintenance", "Engineering"], contributions: 9, retirementMonths: 18, retirementUrgency: "medium" },
  { id: "s3", role: "senior", name: "Timo Virtanen", title: "Safety Coordinator", initials: "TV", yearsExperience: 31, domains: ["Safety", "Operations", "Onboarding"], contributions: 21, retirementMonths: 4, retirementUrgency: "critical" },
  { id: "j1", role: "junior", name: "Aino Mäkelä", title: "Operations Trainee", initials: "AM", monthsExperience: 6, domains: ["Operations"], itemsConsumed: 8, skillLevel: 25, gaps: ["Non-standard alarm interpretation", "Manual override procedures"] },
  { id: "j2", role: "junior", name: "Elias Nurmi", title: "Maintenance Apprentice", initials: "EN", monthsExperience: 14, domains: ["Maintenance"], itemsConsumed: 17, skillLevel: 45, gaps: ["Pump diagnostics by sound", "Vendor-specific part selection"] },
  { id: "j3", role: "junior", name: "Sofia Järvinen", title: "Safety Intern", initials: "SJ", monthsExperience: 3, domains: ["Safety", "Onboarding"], itemsConsumed: 4, skillLevel: 15, gaps: ["Emergency exception protocols", "Checklist override authority", "Incident escalation timing"] }
];

const defaultAccounts = [
  { username: "henrik.laine", password: "demo1234", profileId: "s1", email: "henrik.laine@expertwin.local" },
  { username: "marja.korhonen", password: "demo1234", profileId: "s2", email: "marja.korhonen@expertwin.local" },
  { username: "timo.virtanen", password: "demo1234", profileId: "s3", email: "timo.virtanen@expertwin.local" },
  { username: "aino.makela", password: "demo1234", profileId: "j1", email: "aino.makela@expertwin.local" },
  { username: "elias.nurmi", password: "demo1234", profileId: "j2", email: "elias.nurmi@expertwin.local" },
  { username: "sofia.jarvinen", password: "demo1234", profileId: "j3", email: "sofia.jarvinen@expertwin.local" }
];

// -----------------------------------------------
// State
// -----------------------------------------------

let knowledgeItems = loadKnowledgeItems();
let activeProfileRole = "senior";
let session = loadSession();

// -----------------------------------------------
// DOM references
// -----------------------------------------------

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

const knowledgeGroup = document.getElementById("knowledgeGroup");
const knowledgeParent = document.getElementById("knowledgeParent");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const settingsBtn = document.getElementById("settingsBtn");

const userHeader = document.getElementById("userHeader");
const userHeaderAvatar = document.getElementById("userHeaderAvatar");
const userHeaderName = document.getElementById("userHeaderName");
const userHeaderEmail = document.getElementById("userHeaderEmail");
const userDropdown = document.getElementById("userDropdown");
const userDropdownAvatar = document.getElementById("userDropdownAvatar");
const userDropdownName = document.getElementById("userDropdownName");
const userDropdownEmail = document.getElementById("userDropdownEmail");
const userRole = document.getElementById("userRole");

const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const loginCancelBtn = document.getElementById("loginCancelBtn");

const profileSelfBanner = document.getElementById("profileSelfBanner");
const profileToggle = document.getElementById("profileToggle");
const profilesSubtitle = document.getElementById("profilesSubtitle");

const floatingAskBtn = document.getElementById("floatingAskBtn");
const chatWindow = document.getElementById("chatWindow");
const chatHeader = document.getElementById("chatHeader");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");
const micBtn = document.getElementById("micBtn");
const chatMaxBtn = document.getElementById("chatMaxBtn");
const chatCloseBtn = document.getElementById("chatCloseBtn");
const chatResizeHandle = document.getElementById("chatResizeHandle");

const KNOWLEDGE_SECTIONS = ["capture", "library", "gaps", "tree"];

const titles = {
  home: { title: "Home", subtitle: "Preserve expert knowledge before it disappears." },
  capture: { title: "Capture Knowledge", subtitle: "Extract practical know-how from experienced employees." },
  library: { title: "Knowledge Library", subtitle: "Browse, search, and filter captured expertise." },
  gaps: { title: "Knowledge Gaps", subtitle: "Identify areas where critical expertise is under-documented." },
  tree: { title: "Knowledge Tree", subtitle: "Visual representation of expertise. Domains are branches; items are books." },
  calendar: { title: "Calendar", subtitle: "Connect your calendar to manage events." },
  team: { title: "Team", subtitle: "Teammates, roles, shared tasks, shared-task progress, communication, and employee profiles." }
};

// -----------------------------------------------
// Persistence
// -----------------------------------------------

function loadKnowledgeItems() {
  const saved = localStorage.getItem("expertwinItems");
  if (!saved) {
    localStorage.setItem("expertwinItems", JSON.stringify(defaultKnowledgeItems));
    return [...defaultKnowledgeItems];
  }
  try { return JSON.parse(saved); } catch { return [...defaultKnowledgeItems]; }
}

function saveKnowledgeItems() {
  localStorage.setItem("expertwinItems", JSON.stringify(knowledgeItems));
}

function loadAccounts() {
  const saved = localStorage.getItem("expertwinAccounts");
  if (!saved) {
    localStorage.setItem("expertwinAccounts", JSON.stringify(defaultAccounts));
    return [...defaultAccounts];
  }
  try { return JSON.parse(saved); } catch { return [...defaultAccounts]; }
}

function saveAccounts(accounts) {
  localStorage.setItem("expertwinAccounts", JSON.stringify(accounts));
}

function loadSession() {
  const saved = localStorage.getItem("expertwinSession");
  if (!saved) return null;
  try { return JSON.parse(saved); } catch { return null; }
}

function saveSession(sessionObj) {
  if (sessionObj === null) localStorage.removeItem("expertwinSession");
  else localStorage.setItem("expertwinSession", JSON.stringify(sessionObj));
}

// -----------------------------------------------
// Authentication
// -----------------------------------------------

function updateAuthUI() {
  if (session) {
    const profile = defaultProfiles.find(p => p.id === session.profileId);
    if (!profile) { clearSession(); return; }

    const account = loadAccounts().find(a => a.username === session.username);
    const email = session.email || account?.email || `${session.username}@expertwin.local`;
    const roleLabel = profile.role === "senior" ? "Senior Expert" : "Junior Employee";

    loginBtn.classList.add("hidden");
    userHeader.classList.remove("hidden");

    userHeaderAvatar.textContent = profile.initials;
    userHeaderAvatar.classList.toggle("junior", profile.role === "junior");
    userHeaderName.textContent = profile.name;
    userHeaderEmail.textContent = email;

    userDropdownAvatar.textContent = profile.initials;
    userDropdownAvatar.classList.toggle("junior", profile.role === "junior");
    userDropdownName.textContent = profile.name;
    userDropdownEmail.textContent = email;
    userRole.textContent = roleLabel;
  } else {
    loginBtn.classList.remove("hidden");
    userHeader.classList.add("hidden");
    closeUserDropdown();
  }
}

function openLoginModal() {
  loginModal.classList.remove("hidden");
  loginError.classList.add("hidden");
  loginError.textContent = "";
  loginUsername.value = "";
  loginPassword.value = "";
  setTimeout(() => loginUsername.focus(), 50);
}

function closeLoginModal() { loginModal.classList.add("hidden"); }

function handleLogin(event) {
  event.preventDefault();
  const username = loginUsername.value.trim().toLowerCase();
  const password = loginPassword.value;
  const accounts = loadAccounts();
  const account = accounts.find(a => a.username.toLowerCase() === username && a.password === password);

  if (!account) { loginError.textContent = "Invalid username or password."; loginError.classList.remove("hidden"); return; }

  const profile = defaultProfiles.find(p => p.id === account.profileId);
  if (!profile) { loginError.textContent = "Account not linked to profile."; loginError.classList.remove("hidden"); return; }

  session = {
    username: account.username,
    profileId: account.profileId,
    role: profile.role,
    email: account.email || `${account.username}@expertwin.local`,
    loggedInAt: new Date().toISOString()
  };
  saveSession(session);
  updateAuthUI();
  closeLoginModal();
  switchSection("home");
}

function clearSession() { session = null; saveSession(null); updateAuthUI(); }
function handleLogout() { if (!confirm("Log out?")) return; clearSession(); switchSection("home"); }

function openSettings() {
  closeUserDropdown();
  alert("Settings panel would open here. (Placeholder for future configuration UI.)");
}

loginBtn.addEventListener("click", openLoginModal);
logoutBtn.addEventListener("click", handleLogout);
settingsBtn.addEventListener("click", openSettings);
modalCloseBtn.addEventListener("click", closeLoginModal);
loginCancelBtn.addEventListener("click", closeLoginModal);
loginForm.addEventListener("submit", handleLogin);
loginModal.addEventListener("click", (e) => { if (e.target === loginModal) closeLoginModal(); });

// -----------------------------------------------
// User header dropdown
// -----------------------------------------------

function closeUserDropdown() {
  userDropdown.classList.add("hidden");
  userHeader.classList.remove("open");
  userHeader.setAttribute("aria-expanded", "false");
}

function toggleUserDropdown() {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
  }
  
  const willOpen = userDropdown.classList.contains("hidden");
  if (willOpen) {
    userDropdown.classList.remove("hidden");
    userHeader.classList.add("open");
    userHeader.setAttribute("aria-expanded", "true");
  } else {
    closeUserDropdown();
  }
}

userHeader.addEventListener("click", (e) => {
  if (e.target.closest("#userDropdown")) return;
  toggleUserDropdown();
});

userHeader.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleUserDropdown();
  }
});

document.addEventListener("click", (e) => {
  if (!userHeader.contains(e.target)) closeUserDropdown();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeUserDropdown();
});

// -----------------------------------------------
// Navigation
// -----------------------------------------------

function switchSection(sectionId) {
  sections.forEach(section => section.classList.toggle("active", section.id === sectionId));
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.section === sectionId));

  const t = titles[sectionId];
  if (t) {
    pageTitle.textContent = t.title;
    pageSubtitle.textContent = t.subtitle;
  }

  const isKnowledgeSection = KNOWLEDGE_SECTIONS.includes(sectionId);
  if (knowledgeGroup) {
    knowledgeGroup.classList.toggle("open", isKnowledgeSection);
    knowledgeParent.classList.toggle("active", isKnowledgeSection);
    knowledgeParent.setAttribute("aria-expanded", String(isKnowledgeSection));
  }

  if (sectionId === "library") renderKnowledgeList();
  if (sectionId === "home") updateDashboardMetrics();
  if (sectionId === "tree") renderKnowledgeTree();
  if (sectionId === "team") { renderTeam(); renderProfiles(); }
}

navLinks.forEach(link => link.addEventListener("click", () => switchSection(link.dataset.section)));
document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => switchSection(button.dataset.go)));
document.getElementById("quickCaptureBtn")?.addEventListener("click", () => switchSection("capture"));

knowledgeParent.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    knowledgeGroup.classList.add("open");
    knowledgeParent.setAttribute("aria-expanded", "true");
    return;
  }
  const nowOpen = knowledgeGroup.classList.toggle("open");
  knowledgeParent.setAttribute("aria-expanded", String(nowOpen));
});

// -----------------------------------------------
// Sidebar collapse
// -----------------------------------------------

sidebarToggle.addEventListener("click", () => {
  closeUserDropdown();
  sidebar.classList.toggle("collapsed");
});

// -----------------------------------------------
// Calendar
// -----------------------------------------------

function connectCalendar() {
  if (!session) {
    alert("Please log in first.");
    openLoginModal();
    return;
  }
  alert("Calendar connection would open here.");
}

// -----------------------------------------------
// Capture form
// -----------------------------------------------

const knowledgeForm = document.getElementById("knowledgeForm");
knowledgeForm.addEventListener("submit", event => {
  event.preventDefault();
  const expertName = session ? (defaultProfiles.find(p => p.id === session.profileId)?.name || "Anonymous") : "Anonymous";
  const newItem = {
    id: crypto.randomUUID(),
    expertName,
    domain: document.getElementById("domain").value,
    riskLevel: document.getElementById("riskLevel").value,
    situation: document.getElementById("situation").value.trim(),
    officialProcedure: document.getElementById("officialProcedure").value.trim(),
    realWorldAdvice: document.getElementById("realWorldAdvice").value.trim(),
    warningSigns: document.getElementById("warningSigns").value.trim(),
    mistakes: document.getElementById("mistakes").value.trim(),
    createdAt: new Date().toISOString()
  };
  knowledgeItems.unshift(newItem);
  saveKnowledgeItems();
  knowledgeForm.reset();
  updateDashboardMetrics();
  alert(`Knowledge item saved${session ? ` as ${expertName}` : ""}.`);
  switchSection("library");
});

// -----------------------------------------------
// Knowledge Library
// -----------------------------------------------

const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
searchInput.addEventListener("input", renderKnowledgeList);
domainFilter.addEventListener("change", renderKnowledgeList);

function renderKnowledgeList() {
  const list = document.getElementById("knowledgeList");
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedDomain = domainFilter.value;

  const filteredItems = knowledgeItems.filter(item => {
    const matchesDomain = selectedDomain === "All" || item.domain === selectedDomain;
    const searchableText = `${item.expertName} ${item.domain} ${item.riskLevel} ${item.situation} ${item.officialProcedure} ${item.realWorldAdvice} ${item.warningSigns} ${item.mistakes}`.toLowerCase();
    return matchesDomain && searchableText.includes(searchTerm);
  });

  if (filteredItems.length === 0) {
    list.innerHTML = `<div class="knowledge-card"><p class="muted">No matching knowledge items found.</p></div>`;
    return;
  }

  list.innerHTML = filteredItems.map(item => {
    const riskClass = `risk-${item.riskLevel.toLowerCase()}`;
    return `
      <article class="knowledge-card">
        <div class="knowledge-card-header">
          <div>
            <h4>${escapeHTML(item.situation)}</h4>
            <p>Source: ${escapeHTML(item.expertName)}</p>
          </div>
          <button class="secondary-btn" onclick="deleteKnowledgeItem('${item.id}')">Delete</button>
        </div>
        <div class="badges">
          <span class="badge">${escapeHTML(item.domain)}</span>
          <span class="badge ${riskClass}">${escapeHTML(item.riskLevel)} risk</span>
        </div>
        <div class="knowledge-body">
          <div><strong>Official procedure</strong><p>${escapeHTML(item.officialProcedure)}</p></div>
          <div><strong>Expert's real-world advice</strong><p>${escapeHTML(item.realWorldAdvice)}</p></div>
          <div><strong>Warning signs</strong><p>${escapeHTML(item.warningSigns)}</p></div>
          <div><strong>Common mistakes</strong><p>${escapeHTML(item.mistakes)}</p></div>
        </div>
      </article>`;
  }).join("");
}

function deleteKnowledgeItem(id) {
  if (!confirm("Delete this knowledge item?")) return;
  knowledgeItems = knowledgeItems.filter(item => item.id !== id);
  saveKnowledgeItems();
  renderKnowledgeList();
  updateDashboardMetrics();
}

// -----------------------------------------------
// Ask System
// -----------------------------------------------

function findRelevantKnowledge(question) {
  const questionWords = question.split(/\s+/).map(word => word.replace(/[^\w]/g, "")).filter(word => word.length > 2);
  return knowledgeItems.map(item => {
    const searchableText = `${item.situation} ${item.officialProcedure} ${item.realWorldAdvice} ${item.warningSigns} ${item.mistakes} ${item.domain}`.toLowerCase();
    const score = questionWords.reduce((total, word) => searchableText.includes(word) ? total + 1 : total, 0);
    return { ...item, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
}

function buildChatAnswerHTML(rawQuestion) {
  const question = rawQuestion.toLowerCase().trim();
  const relevantItems = findRelevantKnowledge(question);
  if (relevantItems.length === 0) {
    return `<p>I could not find a strong match.</p><div class="answer-source"><strong>Suggested next step:</strong> Capture knowledge from a senior expert about this topic.</div>`;
  }
  const topItem = relevantItems[0];
  return `
    <h5>Suggested guidance</h5>
    <p>Based on captured expert knowledge, the most relevant situation is: <strong>${escapeHTML(topItem.situation)}</strong></p>
    <ul>
      <li><strong>First check:</strong> ${escapeHTML(topItem.warningSigns)}</li>
      <li><strong>Expert advice:</strong> ${escapeHTML(topItem.realWorldAdvice)}</li>
      <li><strong>Avoid this mistake:</strong> ${escapeHTML(topItem.mistakes)}</li>
    </ul>
    <div class="answer-source"><strong>Source:</strong> ${escapeHTML(topItem.expertName)} · ${escapeHTML(topItem.domain)} · ${escapeHTML(topItem.riskLevel)} risk</div>`;
}

// -----------------------------------------------
// Floating Chat Window
// -----------------------------------------------

const CHAT_HISTORY_KEY = "expertwinChatHistory";
const ASK_BTN_POS_KEY = "expertwinAskBtnPos";

let chatHistory = loadChatHistory();
let chatInitialized = false;
let chatMaximized = false;
let chatPrevRect = null;

function loadChatHistory() {
  const saved = localStorage.getItem(CHAT_HISTORY_KEY);
  if (!saved) return [];
  try { return JSON.parse(saved); } catch { return []; }
}

function saveChatHistory() {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
}

function renderChatMessages() {
  if (chatHistory.length === 0) {
    chatMessages.innerHTML = `<p class="chat-empty">Ask a workplace knowledge question to get source-backed guidance from the knowledge library.</p>`;
    return;
  }
  chatMessages.innerHTML = chatHistory.map(msg => {
    if (msg.role === "user") return `<div class="chat-msg user">${escapeHTML(msg.text)}</div>`;
    return `<div class="chat-msg assistant">${msg.html}</div>`;
  }).join("");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatHistory.push({ role: "user", text, at: new Date().toISOString() });
  chatHistory.push({ role: "assistant", html: buildChatAnswerHTML(text), at: new Date().toISOString() });
  saveChatHistory();
  chatInput.value = "";
  renderChatMessages();
}

function setChatRect(left, top, width, height) {
  chatWindow.style.left = `${left}px`;
  chatWindow.style.top = `${top}px`;
  chatWindow.style.width = `${width}px`;
  chatWindow.style.height = `${height}px`;
  chatWindow.style.right = "auto";
  chatWindow.style.bottom = "auto";
}

function setDefaultChatRect() {
  const w = Math.max(Math.round(window.innerWidth * 0.10), 240);
  const h = Math.min(Math.round(w * 1.1), window.innerHeight - 40);
  const left = Math.max(window.innerWidth - w - 24, 0);
  const top = Math.max(window.innerHeight - h - 24, 0);
  setChatRect(left, top, w, h);
}

function openChatWindow() {
  if (!chatInitialized) { setDefaultChatRect(); chatInitialized = true; }
  chatWindow.classList.remove("hidden");
  floatingAskBtn.classList.add("hidden");
  renderChatMessages();
  setTimeout(() => chatInput.focus(), 50);
}

function closeChatWindow() {
  chatWindow.classList.add("hidden");
  floatingAskBtn.classList.remove("hidden");
}

function openAskChat() { openChatWindow(); }

function toggleChatMaximize() {
  if (!chatMaximized) {
    const r = chatWindow.getBoundingClientRect();
    chatPrevRect = { left: r.left, top: r.top, width: r.width, height: r.height };
    setChatRect(0, 0, window.innerWidth, window.innerHeight);
    chatWindow.classList.add("maximized");
    chatMaximized = true;
    chatMaxBtn.textContent = "❐";
    chatMaxBtn.title = "Restore";
    chatMaxBtn.setAttribute("aria-label", "Restore");
  } else {
    if (chatPrevRect) setChatRect(chatPrevRect.left, chatPrevRect.top, chatPrevRect.width, chatPrevRect.height);
    else setDefaultChatRect();
    chatWindow.classList.remove("maximized");
    chatMaximized = false;
    chatMaxBtn.textContent = "⛶";
    chatMaxBtn.title = "Maximize";
    chatMaxBtn.setAttribute("aria-label", "Maximize");
  }
}

chatSendBtn.addEventListener("click", sendChatMessage);
chatInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); sendChatMessage(); } });
chatCloseBtn.addEventListener("click", closeChatWindow);
chatMaxBtn.addEventListener("click", toggleChatMaximize);

// --- Chat window drag ---
(function initChatDrag() {
  let dragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;

  chatHeader.addEventListener("pointerdown", e => {
    if (e.target.closest("button")) return;
    if (chatMaximized) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    const r = chatWindow.getBoundingClientRect();
    origLeft = r.left; origTop = r.top;
    chatHeader.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  chatHeader.addEventListener("pointermove", e => {
    if (!dragging) return;
    const r = chatWindow.getBoundingClientRect();
    let left = origLeft + (e.clientX - startX);
    let top = origTop + (e.clientY - startY);
    left = Math.min(Math.max(left, -r.width + 60), window.innerWidth - 60);
    top = Math.min(Math.max(top, 0), window.innerHeight - 40);
    chatWindow.style.left = `${left}px`;
    chatWindow.style.top = `${top}px`;
    chatWindow.style.right = "auto";
    chatWindow.style.bottom = "auto";
  });

  const stop = () => { dragging = false; };
  chatHeader.addEventListener("pointerup", stop);
  chatHeader.addEventListener("pointercancel", stop);
})();

// --- Chat window resize ---
(function initChatResize() {
  let resizing = false, startX = 0, startY = 0, origW = 0, origH = 0;

  chatResizeHandle.addEventListener("pointerdown", e => {
    if (chatMaximized) return;
    resizing = true;
    startX = e.clientX; startY = e.clientY;
    const r = chatWindow.getBoundingClientRect();
    origW = r.width; origH = r.height;
    setChatRect(r.left, r.top, r.width, r.height);
    chatResizeHandle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  chatResizeHandle.addEventListener("pointermove", e => {
    if (!resizing) return;
    const r = chatWindow.getBoundingClientRect();
    let w = origW + (e.clientX - startX);
    let h = origH + (e.clientY - startY);
    w = Math.min(Math.max(w, 220), window.innerWidth - r.left);
    h = Math.min(Math.max(h, 220), window.innerHeight - r.top);
    chatWindow.style.width = `${w}px`;
    chatWindow.style.height = `${h}px`;
  });

  const stop = () => { resizing = false; };
  chatResizeHandle.addEventListener("pointerup", stop);
  chatResizeHandle.addEventListener("pointercancel", stop);
})();

// -----------------------------------------------
// Voice input (Web Speech API)
// -----------------------------------------------

let recognition = null;
let isListening = false;

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const rec = new SpeechRecognition();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.continuous = false;

  rec.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    chatInput.focus();
  };

  rec.onerror = () => stopListening();
  rec.onend = () => stopListening();

  return rec;
}

function startListening() {
  if (!recognition) {
    alert("Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.");
    return;
  }
  if (isListening) return;
  try {
    recognition.start();
    isListening = true;
    micBtn.classList.add("active");
  } catch (e) {
    isListening = false;
    micBtn.classList.remove("active");
  }
}

function stopListening() {
  isListening = false;
  micBtn.classList.remove("active");
  if (recognition) {
    try { recognition.stop(); } catch { /* already stopped */ }
  }
}

micBtn.addEventListener("click", () => {
  if (isListening) stopListening();
  else startListening();
});

recognition = setupSpeechRecognition();

// -----------------------------------------------
// Draggable floating Ask button
// -----------------------------------------------

(function initDraggableAskBtn() {
  function applyAskBtnPos(left, top) {
    const w = floatingAskBtn.offsetWidth || 72;
    const h = floatingAskBtn.offsetHeight || 72;
    left = Math.min(Math.max(left, 0), window.innerWidth - w);
    top = Math.min(Math.max(top, 0), window.innerHeight - h);
    floatingAskBtn.style.left = `${left}px`;
    floatingAskBtn.style.top = `${top}px`;
    floatingAskBtn.style.right = "auto";
    floatingAskBtn.style.bottom = "auto";
    return { left, top };
  }

  const saved = localStorage.getItem(ASK_BTN_POS_KEY);
  if (saved) {
    try {
      const p = JSON.parse(saved);
      if (typeof p.left === "number" && typeof p.top === "number") applyAskBtnPos(p.left, p.top);
    } catch { /* ignore */ }
  }

  let dragging = false, moved = false;
  let startX = 0, startY = 0, origLeft = 0, origTop = 0;

  floatingAskBtn.addEventListener("pointerdown", e => {
    dragging = true;
    moved = false;
    startX = e.clientX; startY = e.clientY;
    const r = floatingAskBtn.getBoundingClientRect();
    origLeft = r.left; origTop = r.top;
    floatingAskBtn.setPointerCapture(e.pointerId);
  });

  floatingAskBtn.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!moved && Math.hypot(dx, dy) > 5) moved = true;
    if (moved) applyAskBtnPos(origLeft + dx, origTop + dy);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      const r = floatingAskBtn.getBoundingClientRect();
      localStorage.setItem(ASK_BTN_POS_KEY, JSON.stringify({ left: r.left, top: r.top }));
    }
  }
  floatingAskBtn.addEventListener("pointerup", endDrag);
  floatingAskBtn.addEventListener("pointercancel", endDrag);

  floatingAskBtn.addEventListener("click", e => {
    if (moved) { moved = false; e.preventDefault(); e.stopPropagation(); return; }
    openChatWindow();
  });

  window.addEventListener("resize", () => {
    if (floatingAskBtn.style.left) {
      const r = floatingAskBtn.getBoundingClientRect();
      applyAskBtnPos(r.left, r.top);
    }
  });
})();

// -----------------------------------------------
// Profiles (inside Team)
// -----------------------------------------------

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeProfileRole = btn.dataset.role;
    renderProfiles();
  });
});

function renderProfiles() {
  const grid = document.getElementById("profileGrid");
  if (session) {
    const myProfile = defaultProfiles.find(p => p.id === session.profileId);
    if (!myProfile) { grid.innerHTML = `<p class="muted">Profile not found.</p>`; return; }
    profileSelfBanner.classList.remove("hidden");
    profileToggle.classList.add("hidden");
    profilesSubtitle.textContent = `This is your personal profile on ExperTwin.`;
    grid.classList.remove("three-col");
    grid.innerHTML = renderProfileCard(myProfile);
  } else {
    profileSelfBanner.classList.add("hidden");
    profileToggle.classList.remove("hidden");
    profilesSubtitle.textContent = `Senior experts contribute knowledge. Junior employees consume it.`;
    grid.classList.add("three-col");
    const filtered = defaultProfiles.filter(p => p.role === activeProfileRole);
    grid.innerHTML = filtered.map(p => renderProfileCard(p)).join("");
  }
}

function renderProfileCard(p) {
  if (p.role === "senior") {
    const urgencyLabel = p.retirementUrgency === "critical" ? `⚠️ Retiring in ${p.retirementMonths} months — CRITICAL` : p.retirementUrgency === "high" ? `⚠️ Retiring in ${p.retirementMonths} months — urgent` : `Retiring in ${p.retirementMonths} months`;
    const urgencyClass = p.retirementUrgency === "critical" || p.retirementUrgency === "high" ? "" : "low";
    return `
      <article class="profile-card">
        <div class="profile-header"><div class="profile-avatar">${escapeHTML(p.initials)}</div><div><h4>${escapeHTML(p.name)}</h4><p>${escapeHTML(p.title)}</p></div></div>
        <div class="profile-stats"><span class="profile-stat"><strong>${p.yearsExperience}</strong> years</span><span class="profile-stat"><strong>${p.contributions}</strong> contributions</span></div>
        <div class="profile-domains">${p.domains.map(d => `<span class="badge">${escapeHTML(d)}</span>`).join("")}</div>
        <div class="profile-urgency ${urgencyClass}">${urgencyLabel}</div>
        <button class="primary-btn" onclick="switchSection('capture')">Capture from this expert</button>
      </article>`;
  } else {
    return `
      <article class="profile-card junior">
        <div class="profile-header"><div class="profile-avatar">${escapeHTML(p.initials)}</div><div><h4>${escapeHTML(p.name)}</h4><p>${escapeHTML(p.title)}</p></div></div>
        <div class="profile-stats"><span class="profile-stat"><strong>${p.monthsExperience}</strong> months</span><span class="profile-stat"><strong>${p.itemsConsumed}</strong> items consumed</span></div>
        <div class="profile-domains">${p.domains.map(d => `<span class="badge">${escapeHTML(d)}</span>`).join("")}</div>
        <div class="profile-progress"><label>Skill level: ${p.skillLevel}%</label><div class="progress-bar"><div class="progress-fill" style="width: ${p.skillLevel}%"></div></div></div>
        <div class="profile-gaps"><h5>Knowledge gaps</h5><ul>${p.gaps.map(g => `<li>${escapeHTML(g)}</li>`).join("")}</ul></div>
        <button class="primary-btn" onclick="openAskChat()">Ask a question</button>
      </article>`;
  }
}

// -----------------------------------------------
// Knowledge Tree
// -----------------------------------------------

function renderKnowledgeTree() {
  const container = document.getElementById("knowledgeTree");

  if (knowledgeItems.length === 0) {
    container.innerHTML = `<p class="tree-empty">No knowledge items to display. Capture some expertise first.</p>`;
    return;
  }

  const grouped = {};
  knowledgeItems.forEach(item => {
    if (!grouped[item.domain]) grouped[item.domain] = [];
    grouped[item.domain].push(item);
  });

  const domainOrder = ["Operations", "Maintenance", "Safety", "Engineering", "Onboarding"];
  const sortedDomains = Object.keys(grouped).sort((a, b) => {
    const ai = domainOrder.indexOf(a);
    const bi = domainOrder.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  let html = `<div class="visual-tree"><div class="tree-trunk"></div><div class="tree-branches-container">`;

  sortedDomains.forEach((domain, index) => {
    const items = grouped[domain];
    const side = index % 2 === 0 ? "branch-left" : "branch-right";

    const booksHtml = items.map(item => {
      const riskClass = `risk-${item.riskLevel.toLowerCase()}`;
      return `<div class="book ${riskClass}" title="${escapeHTML(item.situation)} (${escapeHTML(item.expertName)})"></div>`;
    }).join("");

    html += `
      <div class="tree-branch-outer ${side}">
        <div class="branch-content">
          <div class="branch-label">${escapeHTML(domain)} (${items.length})</div>
          <div class="book-cluster">${booksHtml}</div>
        </div>
        <div class="visual-branch-line"></div>
      </div>
    `;
  });

  html += `</div></div>`;
  container.innerHTML = html;
}

// -----------------------------------------------
// Dashboard metrics
// -----------------------------------------------

function updateDashboardMetrics() {
  const totalEl = document.getElementById("totalKnowledgeItems");
  const seniorEl = document.getElementById("seniorCount");
  const juniorEl = document.getElementById("juniorCount");

  if (totalEl) totalEl.textContent = knowledgeItems.length;
  if (seniorEl) seniorEl.textContent = defaultProfiles.filter(p => p.role === "senior").length;
  if (juniorEl) juniorEl.textContent = defaultProfiles.filter(p => p.role === "junior").length;
}

// -----------------------------------------------
// Team
// -----------------------------------------------

const TEAM_NAME = "Plant Knowledge Transfer Team";

const defaultPersonalData = {
  s1: { calendar: [{ date: "2026-07-15", label: "Capture session with Aino" }], tasks: [{ id: "s1-t1", title: "Record manual override walkthrough", done: true }], projects: ["Line 2 playbook"] },
  s2: { calendar: [{ date: "2026-07-16", label: "Pump diagnostics demo" }], tasks: [{ id: "s2-t1", title: "Document rattling-sound steps", done: false }], projects: ["Pump diagnostics"] },
  s3: { calendar: [{ date: "2026-07-14", label: "Safety checklist audit" }], tasks: [{ id: "s3-t1", title: "Write emergency protocol", done: false }], projects: ["Emergency protocols"] },
  j1: { calendar: [{ date: "2026-07-15", label: "Capture session with Henrik" }], tasks: [{ id: "j1-t1", title: "Study manual overrides", done: false }], projects: ["Alarm training"] },
  j2: { calendar: [{ date: "2026-07-16", label: "Pump demo with Marja" }], tasks: [{ id: "j2-t1", title: "Practice blockage diagnosis", done: true }], projects: ["Pump diagnostics"] },
  j3: { calendar: [{ date: "2026-07-22", label: "Mentoring with Timo" }], tasks: [{ id: "j3-t1", title: "Read override authority rules", done: false }], projects: ["Safety onboarding"] }
};

const defaultSharedTasks = [
  { id: "st1", title: "Document pump diagnostics", pairing: "Marja → Elias", domain: "Maintenance", progress: 70 },
  { id: "st2", title: "Capture alarm interpretation", pairing: "Henrik → Aino", domain: "Operations", progress: 40 },
  { id: "st3", title: "Write emergency protocol", pairing: "Timo → Sofia", domain: "Safety", progress: 20 }
];

function loadStored(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) { localStorage.setItem(key, JSON.stringify(fallback)); return JSON.parse(JSON.stringify(fallback)); }
  try { return JSON.parse(saved); } catch { return JSON.parse(JSON.stringify(fallback)); }
}

let personalData = loadStored("expertwinPersonal", defaultPersonalData);
let sharedTasks = loadStored("expertwinSharedTasks", defaultSharedTasks);
let teamMessages = loadStored("expertwinTeamMessages", [{ author: "Timo Virtanen", text: "Confirm high-risk checks before urgent maintenance.", at: new Date().toISOString() }]);

function computeTeamProgress() {
  const juniors = defaultProfiles.filter(p => p.role === "junior");
  if (juniors.length === 0) return 0;
  return Math.round(juniors.reduce((sum, j) => sum + j.skillLevel, 0) / juniors.length);
}

function computeSharedTaskProgress() {
  if (sharedTasks.length === 0) return 0;
  return Math.round(sharedTasks.reduce((sum, t) => sum + t.progress, 0) / sharedTasks.length);
}

function renderTeam() {
  const container = document.getElementById("teamContent");
  const taskProgress = computeSharedTaskProgress();
  const roleLabel = p => p.role === "senior" ? `Mentor · ${p.title}` : `Learner · ${p.title}`;

  container.innerHTML = `
    <div class="card panel-card"><h4>👥 Teammates</h4><div class="chip-row">${defaultProfiles.map(m => `<span class="member-chip ${m.role}"><span class="chip-avatar">${escapeHTML(m.initials)}</span>${escapeHTML(m.name)}</span>`).join("")}</div></div>
    <div class="card panel-card"><h4>🎖 Roles</h4><ul class="simple-list">${defaultProfiles.map(m => `<li><strong>${escapeHTML(m.name)}</strong> — ${escapeHTML(roleLabel(m))}</li>`).join("")}</ul></div>
    <div class="card panel-card span-all"><h4>🤝 Shared Tasks</h4>${sharedTasks.map(t => `<div class="shared-task"><div class="shared-task-top"><div><strong>${escapeHTML(t.title)}</strong><p class="muted">${escapeHTML(t.pairing)} · <span class="badge">${escapeHTML(t.domain)}</span></p></div><button class="secondary-btn" onclick="advanceSharedTask('${t.id}')">+10%</button></div><div class="progress-bar"><div class="progress-fill" style="width:${t.progress}%"></div></div><span class="muted" style="font-size:0.82rem">${t.progress}% complete</span></div>`).join("")}</div>
    <div class="card panel-card span-all"><h4>📈 Progress</h4><p class="progress-note">Shared-task completion progress.</p><div class="progress-bar"><div class="progress-fill" style="width:${taskProgress}%"></div></div><p class="muted" style="margin-top:8px">Shared-task completion: <strong>${taskProgress}%</strong></p></div>
    <div class="card panel-card span-all"><h4>💬 Communicate</h4><div class="message-list">${teamMessages.map(m => `<div class="message"><strong>${escapeHTML(m.author)}</strong><span class="muted"> · ${new Date(m.at).toLocaleString()}</span><p>${escapeHTML(m.text)}</p></div>`).join("")}</div><div class="message-compose"><input type="text" id="teamMessageInput" placeholder="Write a message..." /><button class="primary-btn" onclick="sendTeamMessage()">Send</button></div></div>`;
}

function advanceSharedTask(id) {
  const task = sharedTasks.find(t => t.id === id);
  if (!task) return;
  task.progress = Math.min(100, task.progress + 10);
  localStorage.setItem("expertwinSharedTasks", JSON.stringify(sharedTasks));
  renderTeam();
}

function sendTeamMessage() {
  const input = document.getElementById("teamMessageInput");
  const text = input.value.trim();
  if (!text) return;
  const author = session ? (defaultProfiles.find(p => p.id === session.profileId)?.name || "Anonymous") : "Anonymous";
  teamMessages.push({ author, text, at: new Date().toISOString() });
  localStorage.setItem("expertwinTeamMessages", JSON.stringify(teamMessages));
  renderTeam();
}

// -----------------------------------------------
// Utilities
// -----------------------------------------------

function escapeHTML(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

// -----------------------------------------------
// Initial render
// -----------------------------------------------

updateAuthUI();
renderKnowledgeList();
updateDashboardMetrics();
