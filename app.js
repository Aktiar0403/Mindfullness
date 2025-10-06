// ==========================
// Global Variables
// ==========================
let categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategory = 0;
let currentQuestion = 0;
let userName = "";
let answers = []; // {category, questionIndex, value}
let blockStartTime = null;
let blockTimes = {}; // seconds per category
let skippedCategories = {};
let selectedLang = "en";

// ==========================
// DOM References
// ==========================
const introScreen = document.getElementById("intro-screen");
const startBtn = document.getElementById("start-test-btn");
const appContainer = document.getElementById("app-container");

const userNameInput = document.getElementById("user-name");
const langSelect = document.getElementById("lang-select");
const categoryTitle = document.getElementById("category-title");
const questionText = document.getElementById("question-text");
const slider = document.getElementById("response-slider");
const progressBar = document.getElementById("progress-bar");

const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const exitBtn = document.getElementById("exit-btn");

const resultsDiv = document.getElementById("results");

// Modal references
const confirmModal = document.getElementById("confirmModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const confirmModalBtn = document.getElementById("confirmModalBtn");
const cancelModal = document.getElementById("cancelModal");

// ==========================
// Start Test
// ==========================
startBtn.addEventListener("click", () => {
  const name = userNameInput.value.trim();
  if (!name) {
    alert("Please enter your name to start the test.");
    return;
  }
  userName = name;

  introScreen.classList.add("fade-out");
  setTimeout(() => {
    introScreen.style.display = "none";
    appContainer.classList.remove("hidden");
    startCategory();
  }, 400);
});

// ==========================
// Language Selection
// ==========================
langSelect.addEventListener("change", (e) => {
  selectedLang = e.target.value;
  loadQuestion();
});

// ==========================
// Load Current Question
// ==========================
function loadQuestion() {
  const categoryKey = categories[currentCategory];
  const categoryData = reportsData[categoryKey];
  const questions = categoryData.questions;

  if (!questions || questions.length === 0) {
    questionText.innerText = "No questions available.";
    return;
  }

  questionText.innerText = questions[currentQuestion][selectedLang];
  categoryTitle.innerText = categoryData.title;

  // Start timer for category
  if (currentQuestion === 0 && !blockStartTime) {
    blockStartTime = Date.now();
  }

  // Update progress
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
}

// ==========================
// Next Button
// ==========================
nextBtn.addEventListener("click", () => {
  saveAnswer();
  moveNext();
});

function saveAnswer() {
  const category = categories[currentCategory];
  answers.push({
    category,
    questionIndex: currentQuestion,
    value: parseInt(slider.value),
  });
}

function moveNext() {
  const categoryKey = categories[currentCategory];
  const questions = reportsData[categoryKey].questions;

  currentQuestion++;
  if (currentQuestion >= questions.length) {
    // End of category
    const now = Date.now();
    blockTimes[categoryKey] = Math.round((now - blockStartTime) / 1000);
    blockStartTime = null;
    currentCategory++;
    currentQuestion = 0;

    if (currentCategory >= categories.length) {
      showResults();
      return;
    }
  }

  loadQuestion();
}

// ==========================
// Skip Category
// ==========================
skipBtn.addEventListener("click", () => {
  const categoryKey = categories[currentCategory];
  showModal(
    "Skip Category?",
    `You are about to skip "${reportsData[categoryKey].title}".`,
    () => {
      skippedCategories[categoryKey] = true;
      currentCategory++;
      currentQuestion = 0;
      blockStartTime = null;

      if (currentCategory >= categories.length) {
        showResults();
        return;
      }
      loadQuestion();
    }
  );
});

// ==========================
// Exit Test
// ==========================
exitBtn.addEventListener("click", () => {
  showModal(
    "Exit Test?",
    "Do you want to end the test now? You can see your results so far.",
    () => {
      showResults();
    }
  );
});

// ==========================
// Modal Functions
// ==========================
function showModal(title, message, confirmCallback) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  confirmModal.classList.remove("hidden");

  const newConfirmBtn = confirmModalBtn.cloneNode(true);
  confirmModalBtn.parentNode.replaceChild(newConfirmBtn, confirmModalBtn);

  newConfirmBtn.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
    confirmCallback();
  });

  cancelModal.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
  });
}

// ==========================
// Show Results
// ==========================
async function showResults() {
  appContainer.classList.add("hidden");
  resultsDiv.classList.remove("hidden");
  resultsDiv.innerHTML = `<h2>Hello ${userName}, here are your insights:</h2>`;

  for (const categoryKey of categories) {
    const categoryData = reportsData[categoryKey];

    if (skippedCategories[categoryKey]) {
      resultsDiv.innerHTML += `<h3>${categoryData.title} - Skipped</h3>
      <p>You skipped this category. Consider completing it later.</p><hr>`;
      continue;
    }

    // Average score
    const catAnswers = answers.filter(a => a.category === categoryKey);
    const avgScore = catAnswers.reduce((sum, a) => sum + a.value, 0) / catAnswers.length;

    // Level 1-6
    let level = Math.ceil(avgScore);
    if (level < 1) level = 1;
    if (level > 6) level = 6;

    // Load corresponding .md report
    try {
      const res = await fetch(`reports/${categoryKey}/level${level}.md`);
      let text = "";
      if (res.ok) text = await res.text();
      else text = categoryData.reports[`level${level}`] || "Report not available.";

      resultsDiv.innerHTML += `<h3>${categoryData.title}</h3>
      <p>${text.replace(/\n/g, "<br>")}</p>
      <p><strong>Score:</strong> ${avgScore.toFixed(1)} | <strong>Level:</strong> ${level}</p><hr>`;
    } catch (err) {
      resultsDiv.innerHTML += `<h3>${categoryData.title}</h3><p>Report not available.</p><hr>`;
    }
  }

  resultsDiv.innerHTML += `<p>⏱ Time spent per category: ${JSON.stringify(blockTimes)}</p>`;
}

// ==========================
// Initialize first category
// ==========================
function startCategory() {
  currentCategory = 0;
  currentQuestion = 0;
  loadQuestion();
}
