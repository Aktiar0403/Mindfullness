// ---------- GLOBAL VARIABLES ----------
let currentCategoryIndex = 0;
let currentQuestionIndex = 0;
let currentLanguage = "en";
let userScores = {};
let currentCategory = "";
let questionsByCategory = {};

const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");
const reportContainer = document.getElementById("report-container");

// ---------- INITIALIZATION ----------
document.addEventListener("DOMContentLoaded", () => {
  if (typeof questions === "undefined" || questions.length === 0) {
    questionContainer.innerHTML = "<p>No questions loaded. Check questions.js</p>";
    return;
  }

  // Group questions by category
  questionsByCategory = groupByCategory(questions);

  // Initialize scores
  Object.keys(questionsByCategory).forEach(cat => {
    userScores[cat] = { total: 0, answered: 0 };
  });

  // Load first category
  loadCategory(currentCategoryIndex);
});

// ---------- LANGUAGE TOGGLE ----------
document.getElementById("language").addEventListener("change", (e) => {
  currentLanguage = e.target.value;
  loadQuestion(currentQuestionIndex);
});

// ---------- GROUP QUESTIONS ----------
function groupByCategory(all) {
  const grouped = {};
  all.forEach(q => {
    if (!grouped[q.category]) grouped[q.category] = [];
    grouped[q.category].push(q);
  });
  return grouped;
}

// ---------- LOAD CATEGORY ----------
function loadCategory(index) {
  const categories = Object.keys(questionsByCategory);
  if (index >= categories.length) {
    questionContainer.innerHTML = "<p>✅ You’ve completed all categories!</p>";
    optionsContainer.innerHTML = "";
    nextBtn.style.display = "none";
    skipBtn.style.display = "none";
    return;
  }

  currentCategory = categories[index];
  currentQuestionIndex = 0;
  loadQuestion(currentQuestionIndex);
}

// ---------- LOAD QUESTION ----------
function loadQuestion(index) {
  const qs = questionsByCategory[currentCategory];
  if (!qs || index >= qs.length) {
    currentCategoryIndex++;
    loadCategory(currentCategoryIndex);
    return;
  }

  const q = qs[index];
  questionContainer.textContent = q[currentLanguage];
  optionsContainer.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.textContent = i.toString();
    btn.classList.add("option-btn");
    btn.addEventListener("click", () => selectOption(i));
    optionsContainer.appendChild(btn);
  }

  updateCategoryProgress(currentCategory);
}

// ---------- SELECT OPTION ----------
function selectOption(value) {
  userScores[currentCategory].total += value;
  userScores[currentCategory].answered += 1;
  currentQuestionIndex++;

  updateCategoryProgress(currentCategory);
  loadQuestion(currentQuestionIndex);
}

// ---------- SKIP ----------
skipBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  loadQuestion(currentQuestionIndex);
});

// ---------- PROGRESS ----------
function updateCategoryProgress(category) {
  const catQuestions = questionsByCategory[category].length;
  const answered = userScores[category].answered;
  const percent = Math.round((answered / catQuestions) * 100);
  const bar = document.getElementById(`bar-${category}`);
  if (bar) bar.style.width = `${percent}%`;
}

// ---------- REPORT GENERATION ----------
document.getElementById("generate-report-btn").addEventListener("click", () => {
  const completed = Object.keys(userScores).filter(
    cat => userScores[cat].answered === questionsByCategory[cat].length
  );

  const msg = document.getElementById("report-message");
  if (completed.length === 0) {
    msg.textContent = "⚠️ Please complete at least one category before viewing your report.";
    return;
  }

  msg.textContent = "";
  reportContainer.innerHTML = "";

  completed.forEach(cat => {
    const avg = userScores[cat].total / userScores[cat].answered;
    const level = Math.min(Math.ceil((avg / 5) * 6), 6);
    loadReport(cat, level);
  });
});

// ---------- LOAD REPORT ----------
async function loadReport(category, level) {
  const path = `Reports/${category}/level${level}.md`;

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("File not found");

    const text = await res.text();
    const section = document.createElement("div");
    section.innerHTML = `<h3>${category} – Level ${level}</h3><pre>${text}</pre>`;
    reportContainer.appendChild(section);
  } catch (err) {
    console.error("Report load error:", err);
    const errMsg = document.createElement("p");
    errMsg.textContent = `⚠️ Could not load report for ${category} Level ${level}`;
    reportContainer.appendChild(errMsg);
  }
}
