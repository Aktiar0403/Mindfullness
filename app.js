// =======================
// GLOBAL VARIABLES
// =======================
const categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategory = 0;
let currentQuestion = 0;
let userName = "";
let selectedLang = "en";
let answers = []; // {category, questionIndex, value, skipped}
let blockStartTime = null;

// DOM elements
const questionText = document.getElementById("question-text");
const slider = document.getElementById("response-slider");
const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const exitBtn = document.getElementById("exit-btn");
const resultsDiv = document.getElementById("results");
const categoryTitle = document.getElementById("category-title");
const langSelect = document.getElementById("lang-select");

// =======================
// EVENT LISTENERS
// =======================

// Language change
langSelect.addEventListener("change", e => {
  selectedLang = e.target.value;
  loadQuestion();
});

// Next button
nextBtn.addEventListener("click", () => {
  if (!userName) {
    const nameInput = document.getElementById("user-name");
    if (!nameInput.value.trim()) {
      alert("Please enter your name to proceed.");
      return;
    }
    userName = nameInput.value.trim();
  }

  saveAnswer();
  nextQuestion();
});

// Skip category
skipBtn.addEventListener("click", () => {
  const catName = reportsData[categories[currentCategory]].title;
  showModal(
    "Skip This Category?",
    `Not a problem if you don't have time now for "${catName}". Make sure to take this category later to understand yourself better!`,
    () => {
      answers.push({ category: categories[currentCategory], skipped: true });
      nextCategory();
    }
  );
});

// Exit test
exitBtn.addEventListener("click", () => {
  showModal(
    "Exit Test?",
    "Not an issue if you don't have time now! Take the test later for full benefit. Hope for the best!",
    () => showResults()
  );
});

// =======================
// CORE FUNCTIONS
// =======================

function loadQuestion() {
  if (currentCategory >= categories.length) {
    showResults();
    return;
  }

  const cat = categories[currentCategory];
  const questionList = reportsData[cat].questions;
  if (!questionList || questionList.length === 0) {
    console.warn(`No questions found for ${cat}`);
    return;
  }

  if (currentQuestion >= questionList.length) {
    nextCategory();
    return;
  }

  const question = questionList[currentQuestion][selectedLang] || questionList[currentQuestion]["en"];
  categoryTitle.innerText = reportsData[cat].title;
  questionText.innerText = question;

  slider.value = 3;

  // Start timer for block if first question
  if (currentQuestion === 0 && blockStartTime === null) {
    blockStartTime = new Date().getTime();
  }
}

function saveAnswer() {
  const cat = categories[currentCategory];
  const value = Number(slider.value);
  answers.push({ category: cat, questionIndex: currentQuestion, value });
}

function nextQuestion() {
  currentQuestion++;
  const questionList = reportsData[categories[currentCategory]].questions;
  if (currentQuestion >= questionList.length) {
    nextCategory();
  } else {
    loadQuestion();
  }
}

function nextCategory() {
  currentCategory++;
  currentQuestion = 0;
  blockStartTime = null;

  if (currentCategory >= categories.length) {
    showResults();
  } else {
    loadQuestion();
  }
}

// =======================
// RESULTS
// =======================
async function showResults() {
  document.getElementById("app-container").classList.add("hidden");
  resultsDiv.classList.remove("hidden");
  resultsDiv.innerHTML = "";

  const now = new Date();
  let html = `<h2>Self Insight Report for ${userName || "User"}</h2>`;

  if (answers.length === 0) {
    html += `<p>You did not answer any questions yet. Try taking the test when possible!</p>`;
  } else {
    for (let cat of categories) {
      const catData = reportsData[cat];
      const catAnswers = answers.filter(a => a.category === cat && !a.skipped);
      html += `<h3>${catData.title}</h3>`;

      if (catAnswers.length === 0) {
        html += `<p>You skipped this category. Take it later to gain full insight.</p><hr>`;
        continue;
      }

      const avgScore = catAnswers.reduce((sum, a) => sum + a.value, 0) / catAnswers.length;
      const levelFile = getLevelFileName(avgScore);

      let reportText = "Report not available.";
      try {
        reportText = await fetchReport(cat, levelFile);
      } catch (e) {
        console.warn(`Could not load report for ${cat} ${levelFile}`);
      }

      html += `<p><strong>Average Score:</strong> ${avgScore.toFixed(1)}</p>`;
      html += `<p>${reportText}</p><hr>`;
    }
  }

  html += `<div class="result-footer">
             <p>Completed on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</p>
             <p>Privacy Note: No data is stored; only you can see your answers.</p>
           </div>`;

  resultsDiv.innerHTML = html;
}

// =======================
// HELPER FUNCTIONS
// =======================

function getLevelFileName(avgScore) {
  if (avgScore < 1.5) return "level1.md";
  if (avgScore < 2.5) return "level2.md";
  if (avgScore < 3.5) return "level3.md";
  if (avgScore < 4.5) return "level4.md";
  if (avgScore < 5.5) return "level5.md";
  return "level6.md";
}

async function fetchReport(category, levelFile) {
  try {
    const response = await fetch(`Reports/${category}/${levelFile}`);
    if (!response.ok) throw new Error("Report not found");
    const text = await response.text();
    return text.replace(/\n/g, "<br>");
  } catch (err) {
    console.error(err);
    return "Report not available.";
  }
}

// =======================
// MODAL
// =======================
function showModal(title, message, confirmCallback) {
  const modal = document.getElementById("confirmModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const confirmBtn = document.getElementById("confirmModalBtn");
  const cancelBtn = document.getElementById("cancelModal");

  modalTitle.innerText = title;
  modalMessage.innerText = message;
  modal.classList.remove("hidden");

  // Remove previous listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    confirmCallback();
  });

  cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));
}

// =======================
// START TEST ON LOAD
// =======================
window.onload = () => {
  loadQuestion();
};
