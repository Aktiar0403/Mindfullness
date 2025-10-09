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
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const reportBtn = document.getElementById("generate-report-btn");
const reportMessage = document.getElementById("report-message");
const reportContainer = document.getElementById("report-container");

// ---------- INITIALIZATION ----------
document.addEventListener("DOMContentLoaded", () => {
  if (typeof questions === "undefined" || questions.length === 0) {
    questionContainer.innerHTML = "<p>No questions loaded. Check questions.js</p>";
    nextBtn.style.display = "none";
    skipBtn.style.display = "none";
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

// ---------- GROUP QUESTIONS BY CATEGORY ----------
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

  // DISPLAY QUESTION
  questionContainer.textContent = q.question[currentLanguage];

  // DISPLAY OPTIONS
  optionsContainer.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = opt.text[currentLanguage];
    btn.addEventListener("click", () => selectOption(opt.value, q.reverse));
    optionsContainer.appendChild(btn);
  });

  updateProgress();
}

// ---------- SELECT OPTION ----------
function selectOption(value, reverse = false) {
  // Handle reverse scoring
  if (reverse) value = 6 - value;

  userScores[currentCategory].total += value;
  userScores[currentCategory].answered += 1;
  currentQuestionIndex++;
  updateProgress();
  loadQuestion(currentQuestionIndex);
}

// ---------- SKIP ----------
skipBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  updateProgress();
  loadQuestion(currentQuestionIndex);
});

// ---------- UPDATE PROGRESS ----------
function updateProgress() {
  let answeredCount = 0;
  let totalQuestions = 0;

  Object.keys(questionsByCategory).forEach(cat => {
    answeredCount += userScores[cat].answered;
    totalQuestions += questionsByCategory[cat].length;
  });

  const percent = Math.round((answeredCount / totalQuestions) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% completed`;
}

// ---------- GENERATE REPORT ----------
reportBtn.addEventListener("click", async () => {
  const completed = Object.keys(userScores).filter(
    cat => userScores[cat].answered === questionsByCategory[cat].length
  );

  if (completed.length === 0) {
    reportMessage.textContent = "⚠️ Please complete at least one category before viewing your report.";
    reportContainer.innerHTML = "";
    return;
  }

  reportMessage.textContent = "";
  reportContainer.innerHTML = "";

  for (const cat of completed) {
    const avg = userScores[cat].total / userScores[cat].answered;
    const level = Math.min(Math.ceil((avg / 5) * 6), 6);
    await loadReport(cat, level);
  }
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
