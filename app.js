// ==============================
// APP.JS FOR SELF INSIGHT TEST
// ==============================

// DOM elements
const categoryTitle = document.getElementById("category-title");
const questionText = document.getElementById("question-text");
const slider = document.getElementById("response-slider");
const progressBar = document.getElementById("progress-bar");
const resultsDiv = document.getElementById("results");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const exitBtn = document.getElementById("exit-btn");

const userNameInput = document.getElementById("user-name");
const langSelect = document.getElementById("lang-select");

// Modal elements
const confirmModal = document.getElementById("confirmModal");
const cancelModalBtn = document.getElementById("cancelModal");
const confirmModalBtn = document.getElementById("confirmModalBtn");

// STATE
let currentCategoryIndex = 0;
let currentQuestionIndex = 0;
let userAnswers = {};
let language = langSelect.value;

// Categories order
const categories = Object.keys(questionsData);

// Initialize answers object
categories.forEach(cat => (userAnswers[cat] = []));

// ================
// FUNCTIONS
// ================

// Start the test
function startTest() {
  currentCategoryIndex = 0;
  currentQuestionIndex = 0;
  resultsDiv.classList.add("hidden");
  showQuestion();
}

// Show current question
function showQuestion() {
  const category = categories[currentCategoryIndex];
  const question = questionsData[category].questions[currentQuestionIndex][language];
  categoryTitle.textContent = questionsData[category].title;
  questionText.textContent = question;

  // Set slider value if user already answered
  const previousAnswer = userAnswers[category][currentQuestionIndex];
  slider.value = previousAnswer || 3;

  updateProgress();
}

// Update progress bar
function updateProgress() {
  const totalQuestions = categories.reduce(
    (sum, cat) => sum + questionsData[cat].questions.length,
    0
  );
  const answeredQuestions = categories.reduce(
    (sum, cat) => sum + userAnswers[cat].filter(Boolean).length,
    0
  );
  const percent = Math.round((answeredQuestions / totalQuestions) * 100);
  progressBar.style.width = percent + "%";
}

// Save current answer
function saveAnswer() {
  const category = categories[currentCategoryIndex];
  userAnswers[category][currentQuestionIndex] = Number(slider.value);
}

// Navigate next question
function nextQuestion() {
  saveAnswer();
  const category = categories[currentCategoryIndex];

  if (currentQuestionIndex < questionsData[category].questions.length - 1) {
    currentQuestionIndex++;
  } else {
    // End of category
    if (currentCategoryIndex < categories.length - 1) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;
    } else {
      // End of all categories
      showResults();
      return;
    }
  }
  showQuestion();
}

// Navigate previous question
function prevQuestion() {
  saveAnswer();
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
  } else if (currentCategoryIndex > 0) {
    currentCategoryIndex--;
    const prevCategory = categories[currentCategoryIndex];
    currentQuestionIndex = questionsData[prevCategory].questions.length - 1;
  }
  showQuestion();
}

// Skip current category
function skipCategory() {
  saveAnswer();
  if (currentCategoryIndex < categories.length - 1) {
    currentCategoryIndex++;
    currentQuestionIndex = 0;
    showQuestion();
  } else {
    showResults();
  }
}

// End test confirmation
function endTest() {
  confirmModal.classList.remove("hidden");
}

// Confirm end
function confirmEndTest() {
  confirmModal.classList.add("hidden");
  showResults();
}

// Cancel end
function cancelEndTest() {
  confirmModal.classList.add("hidden");
}

// Calculate results
function calculateResults() {
  const finalResults = {};

  categories.forEach(cat => {
    const answers = userAnswers[cat];
    const sum = answers.reduce((a, b) => a + b, 0);
    const avg = sum / answers.length;

    // Determine level (1-6)
    let level = Math.ceil((avg / 6) * 6); // Ensures 1-6
    if (level < 1) level = 1;
    if (level > 6) level = 6;

    finalResults[cat] = {
      level,
      report: questionsData[cat].reports["level" + level]
    };
  });

  return finalResults;
}

// Display results
function showResults() {
  const name = userNameInput.value || "User";
  const results = calculateResults();

  let html = `<h2>Hi ${name}, your personalized insight report:</h2>`;
  categories.forEach(cat => {
    html += `<h3>${questionsData[cat].title}</h3>`;
    html += `<p>${results[cat].report}</p>`;
  });

  resultsDiv.innerHTML = html;
  resultsDiv.classList.remove("hidden");
}

// =================
// EVENT LISTENERS
// =================

nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);
skipBtn.addEventListener("click", skipCategory);
exitBtn.addEventListener("click", endTest);

confirmModalBtn.addEventListener("click", confirmEndTest);
cancelModalBtn.addEventListener("click", cancelEndTest);

slider.addEventListener("input", saveAnswer);

langSelect.addEventListener("change", e => {
  language = e.target.value;
  showQuestion();
});
