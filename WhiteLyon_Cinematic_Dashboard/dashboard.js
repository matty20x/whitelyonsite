// dashboard.js
if (localStorage.getItem("loggedInUser")) {
  document.getElementById("welcomeUser").textContent = localStorage.getItem("loggedInUser");
  document.getElementById("profileEmail").textContent = localStorage.getItem("loggedInUser");
}

function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

window.addEventListener("click", function(e) {
  if (!e.target.closest(".profile-menu")) {
    document.getElementById("dropdownMenu").style.display = "none";
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("rememberedUser");
  window.location.href = "index.html";
}

const notesField = document.getElementById("quickNotes");
const savedNote = localStorage.getItem("whiteLyonNotes") || "";
notesField.value = savedNote;
notesField.addEventListener("input", () => {
  localStorage.setItem("whiteLyonNotes", notesField.value);
  logActivity("Updated quick notes");
});

const activityLog = document.getElementById("activityLog");
let activityData = JSON.parse(localStorage.getItem("whiteLyonActivity")) || [];

function logActivity(action) {
  const entry = `${new Date().toLocaleString()}: ${action}`;
  activityData.unshift(entry);
  if (activityData.length > 5) activityData.pop();
  localStorage.setItem("whiteLyonActivity", JSON.stringify(activityData));
  renderActivity();
}

function renderActivity() {
  if (activityData.length === 0) {
    activityLog.innerHTML = "<li>No recent activity yet.</li>";
    return;
  }
  activityLog.innerHTML = activityData.map(item => `<li>${item}</li>`).join("");
}
renderActivity();

function loadUpcomingEvents() {
  const list = document.getElementById("upcomingEventsList");
  const events = JSON.parse(localStorage.getItem("whiteLyonFullEvents")) || [];
  const now = new Date();
  const upcoming = events.filter(e => new Date(e.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);
  list.innerHTML = upcoming.length ? upcoming.map(e => {
    const date = new Date(e.start).toLocaleString();
    return `<li><strong>${e.title}</strong> – <em>${e.project}</em><br><small>${date}</small></li>`;
  }).join("") : "<li>No upcoming events.</li>";
}
loadUpcomingEvents();

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
let tasks = JSON.parse(localStorage.getItem("whiteLyonTasks")) || [];

function renderTasks() {
  todoList.innerHTML = tasks.map((task, i) => \`
    <li>
      <input type="checkbox" onchange="toggleTask(\${i})" \${task.done ? 'checked' : ''}/> \${task.text}
    </li>\`).join("");
}
function addTask() {
  if (!todoInput.value.trim()) return;
  tasks.push({ text: todoInput.value, done: false });
  todoInput.value = "";
  localStorage.setItem("whiteLyonTasks", JSON.stringify(tasks));
  logActivity("Added a new task");
  renderTasks();
}
function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  localStorage.setItem("whiteLyonTasks", JSON.stringify(tasks));
  logActivity("Toggled task: " + tasks[i].text);
  renderTasks();
}
renderTasks();
