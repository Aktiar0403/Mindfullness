document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("intro-screen");
  const startBtn = document.getElementById("start-test-btn");
  const appContainer = document.querySelector(".app-container");

  const categoryTitle = document.getElementById("category-title");
  const questionBox = document.getElementById("question-box");
  const slider = document.getElementById("answer-slider");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const skipBtn = document.getElementById("skip-category");
  const endBtn = document.getElementById("end-test");
  const restartBtn = document.getElementById("restart-btn");
  const resultSection = document.getElementById("result-section");
  const resultOutput = document.getElementById("result-output");
  const testSection = document.getElementById("test-section");

  const modal = document.getElementById("modal");
  const confirmExitBtn = document.getElementById("confirm-exit");
  const cancelExitBtn = document.getElementById("cancel-exit");

  let categories = Object.keys(reportsData);
  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let answers = {};
  let language = "en";
  let pendingExit = false;

  // --- Add language selector ---
  const langSelect = document.createElement("select");
  langSelect.classList.add("language-select");
  langSelect.innerHTML = `
    <option value="en">🇬🇧 English</option>
    <option value="hi">🇮🇳 Hindi</option>
    <option value="bn">🇧🇩 Bengali</option>
  `;
  document.querySelector("header").appendChild(langSelect);

  langSelect.addEventListener("change", (e) => {
    language = e.target.value;
    loadQuestion();
  });

  // --- Start Test ---
  startBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    appContainer.classList.remove("hidden");
    loadQuestion();
  });

  function loadQuestion() {
    const currentCategory = categories[currentCategoryIndex];
    const questions = reportsData[currentCategory].questions;

    if (!answers[currentCategory]) answers[currentCategory] = [];

    if (currentQuestionIndex >= questions.length) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;

      if (currentCategoryIndex >= categories.length) {
        showResults();
        return;
      }
      loadQuestion();
      return;
    }

    categoryTitle.textContent = `Category: ${currentCategory}`;
    questionBox.textContent = questions[currentQuestionIndex][language];
    slider.value = 3;
  }

  nextBtn.addEventListener("click", () => {
    saveAnswer();
    currentQuestionIndex++;
    loadQuestion();
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) currentQuestionIndex--;
    loadQuestion();
  });

  function saveAnswer() {
    const currentCategory = categories[currentCategoryIndex];
    if (!answers[currentCategory]) answers[currentCategory] = [];
    answers[currentCategory][currentQuestionIndex] = parseInt(slider.value);
  }

  function showResults() {
    testSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    const answered = Object.keys(answers).filter(
      (c) => answers[c] && answers[c].length > 0
    );

    if (answered.length < categories.length) {
      showMotivationalMessage();
      return;
    }

    let html = `<h3>🧭 Self Insight Report</h3>`;
    const now = new Date();
    html += `<div class="meta">Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>`;

    for (let cat of categories) {
      const avg = answers[cat].reduce((a, b) => a + b, 0) / answers[cat].length;
      const level = Math.round(avg);
      const report = reportsData[cat].reports[level - 1].en;
      html += `<h4>${cat}</h4><p>${report}</p>`;
    }

    resultOutput.innerHTML = html;
  }

  restartBtn.addEventListener("click", () => {
    currentCategoryIndex = 0;
    currentQuestionIndex = 0;
    answers = {};
    resultSection.classList.add("hidden");
    testSection.classList.remove("hidden");
    loadQuestion();
  });

  // --- Modal Logic ---
  function openModal() {
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
  }

  skipBtn.addEventListener("click", () => openModal());
  endBtn.addEventListener("click", () => openModal());

  confirmExitBtn.addEventListener("click", () => {
  closeModal();

  // Check if all categories and questions are completed
  const allCategoriesCompleted =
    currentCategoryIndex >= categories.length - 1 &&
    currentQuestionIndex >= categories[categories.length - 1].questions.length - 1;

  if (allCategoriesCompleted) {
    // If user has completed all questions, show results
    showResults();
  } else {
    // Otherwise, show motivational message
    showMotivationalMessage();
  }
});

  cancelExitBtn.addEventListener("click", closeModal);

  function showMotivationalMessage() {
    testSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
    resultOutput.innerHTML = `
      <div class="motivational-end">
        <h3>✨ Take Your Time ✨</h3>
        <p>Not an issue if you didn’t complete the test right now.<br>
        Sometimes self-reflection needs the right moment.<br><br>
        When you feel calm, come back — your answers will help you know your inner self deeply.<br>
        Remember, investing time in yourself brings the best returns. 🌱</p>
        <p class="end-note">With positivity,<br>— Self Insight Team 💫</p>
      </div>`;
  }
});
