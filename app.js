// ===================== app.js =====================
// Inside Mind Psychometry App

// ===== Global State =====
let currentCategoryIndex = 0;
let currentQuestionIndex = 0;
let currentLang = "en"; // default language

const categories = ["Emotional", "Growth", "Resilience", "Overthinking"];
let answers = {
  Emotional: [],
  Growth: [],
  Resilience: [],
  Overthinking: []
};

// ===== DOM References =====
const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const reportContainer = document.getElementById("report-container");
const langSelect = document.getElementById("lang");

// ===== Language Change Event =====
langSelect.addEventListener("change", (e) => {
  currentLang = e.target.value;
  loadQuestion(currentCategoryIndex, currentQuestionIndex);
});

// ===== Load Question =====
function loadQuestion(categoryIndex, questionIndex) {
  const category = categories[categoryIndex];
  const categoryQuestions = questions.filter(q => q.category === category);
  const q = categoryQuestions[questionIndex];

  if (!q) {
    questionContainer.innerHTML = "<p>No question found.</p>";
    return;
  }

  // Build question HTML
  let html = `<div class="question-block">
    <h3>${q.question[currentLang]}</h3>
    <div class="options">`;

  q.options.forEach((opt, idx) => {
    html += `
      <div class="option-item">
        <input type="radio" name="option" id="opt${idx}" value="${opt.value}">
        <label for="opt${idx}">${opt.text[currentLang]}</label>
      </div>`;
  });

  html += `</div></div>`;
  questionContainer.innerHTML = html;
  updateProgress(currentQuestionIndex, questions.length);

}

// ===== Save Answer =====
function saveAnswer(categoryIndex, questionIndex) {
  const category = categories[categoryIndex];
  const categoryQuestions = questions.filter(q => q.category === category);
  const q = categoryQuestions[questionIndex];
  const selected = document.querySelector('input[name="option"]:checked');

  if (!selected) return false;

  const val = parseInt(selected.value);
  const score = q.reverse ? 6 - val : val; // reverse scoring
  answers[category].push(score);
  return true;
}

// ===== Calculate Level =====
function calculateLevel(category) {
  const totalScore = answers[category].reduce((a, b) => a + b, 0);
  const maxScore = 15 * 5; // 15 questions * max 5 per
  const percent = (totalScore / maxScore) * 100;

  if (percent <= 20) return 1;
  if (percent <= 40) return 2;
  if (percent <= 60) return 3;
  if (percent <= 80) return 4;
  if (percent <= 93) return 5;
  return 6;
}

// ===== Load Report (English only) =====
async function loadReport(category, level) {
  const reportPath = `Reports/${category}/level${level}.md`;
  try {
    const response = await fetch(reportPath);
    if (!response.ok) throw new Error("File not found");
    const text = await response.text();
    const reportContainer = document.getElementById("report-content");
    if (reportContainer) reportContainer.innerHTML = marked.parse(text);
  } catch (err) {
    console.error("Report load error:", err);
    const reportContainer = document.getElementById("report-content");
    if (reportContainer) {
      reportContainer.innerHTML = `<p style="color:red;">⚠️ Report not found for ${category} Level ${level}. Please check file path or name.</p>`;
    }
  }
}

// ===== Next Button Logic =====
nextBtn.addEventListener("click", () => {
  if (!saveAnswer(currentCategoryIndex, currentQuestionIndex)) {
    alert("Please select an option before continuing.");
    return;
  }

  currentQuestionIndex++;
  const category = categories[currentCategoryIndex];
  const categoryQuestions = questions.filter(q => q.category === category);

  // Next Question or Category
  if (currentQuestionIndex < categoryQuestions.length) {
    loadQuestion(currentCategoryIndex, currentQuestionIndex);
  } else {
    // Completed category → Calculate level & show report
    const level = calculateLevel(category);
    loadReport(category, level);

    // Move to next category
    currentCategoryIndex++;
    currentQuestionIndex = 0;

    if (currentCategoryIndex < categories.length) {
      loadQuestion(currentCategoryIndex, currentQuestionIndex);
    } else {
      // All Done
      questionContainer.innerHTML = "<h2>✅ Evaluation Complete!</h2>";
      nextBtn.style.display = "none";
    }
  }
});
// ---------------- PROGRESS BAR ----------------
function updateProgress(currentIndex, totalQuestions) {
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const bar = document.getElementById("progress-bar");
  if (bar) bar.style.width = `${progress}%`;
}

// Call this function every time user answers or skips a question
// Example: updateProgress(currentQuestionIndex, questions.length);

// ---------------- REPORT BUTTON ----------------
document.getElementById("generate-report-btn").addEventListener("click", () => {
  const completedCategories = Object.keys(userScores || {}).filter(cat => userScores[cat]?.answered === 15);
  const messageEl = document.getElementById("report-message");

  if (completedCategories.length === 0) {
    messageEl.textContent = "⚠️ Please complete at least one category before viewing your report.";
    return;
  }

  // Load reports for all completed categories
  messageEl.textContent = "";
  completedCategories.forEach(cat => {
    const avgScore = userScores[cat].total / userScores[cat].answered;
    const level = Math.min(Math.ceil(avgScore / 5 * 6), 6);
    loadReport(cat, level);
  });
});

// ===== Initialize App =====
document.addEventListener("DOMContentLoaded", () => {
  loadQuestion(currentCategoryIndex, currentQuestionIndex);
});
