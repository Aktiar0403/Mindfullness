document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // VARIABLES
  // =========================
  const categoryTitle = document.getElementById("category-title");
  const questionBox = document.getElementById("question-box");
  const slider = document.getElementById("answer-slider");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const resultSection = document.getElementById("result-section");
  const resultOutput = document.getElementById("result-output");
  const restartBtn = document.getElementById("restart-btn");
  const introScreen = document.getElementById("intro-screen");
  const startBtn = document.getElementById("start-test-btn");
  const appContainer = document.querySelector(".app-container");

  // Modal elements
  const modal = document.getElementById("modal");
  const confirmExitBtn = document.getElementById("confirm-exit");
  const cancelExitBtn = document.getElementById("cancel-exit");

  // Skip & End test buttons
  const endTestBtn = document.getElementById("end-test");
  const skipCategoryBtn = document.getElementById("skip-category");

  // App state
  let categories = Object.keys(reportsData);
  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let answers = {};
  let language = "en";
  let pendingExit = false;

  // =========================
  // LANGUAGE SELECTION
  // =========================
  const languageSelect = document.createElement("select");
  languageSelect.classList.add("language-select");
  languageSelect.innerHTML = `
    <option value="en">🇬🇧 English</option>
    <option value="hi">🇮🇳 Hindi</option>
    <option value="bn">🇧🇩 Bengali</option>
  `;
  document.querySelector("header").appendChild(languageSelect);

  languageSelect.addEventListener("change", (e) => {
    language = e.target.value;
    loadQuestion();
  });

  // =========================
  // START TEST
  // =========================
  startBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    appContainer.classList.remove("hidden");
    loadQuestion();
  });

  // =========================
  // LOAD QUESTION
  // =========================
  function loadQuestion() {
    let currentCategory = categories[currentCategoryIndex];
    let questions = reportsData[currentCategory].questions;

    if (!answers[currentCategory]) answers[currentCategory] = [];

    if (currentQuestionIndex >= questions.length) {
      // Category done → go next
      currentCategoryIndex++;
      currentQuestionIndex = 0;

      if (currentCategoryIndex >= categories.length) {
        showResults();
        return;
      }
      loadQuestion();
      return;
    }

    const questionText = questions[currentQuestionIndex][language];
    categoryTitle.textContent = `Category: ${currentCategory}`;
    questionBox.textContent = questionText;

    slider.value = 3; // reset to neutral position
  }

  // =========================
  // NAVIGATION BUTTONS
  // =========================
  nextBtn.addEventListener("click", () => {
    saveAnswer();
    currentQuestionIndex++;
    loadQuestion();
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) currentQuestionIndex--;
    loadQuestion();
  });

  // =========================
  // SAVE ANSWER
  // =========================
  function saveAnswer() {
    let currentCategory = categories[currentCategoryIndex];
    if (!answers[currentCategory]) answers[currentCategory] = [];
    answers[currentCategory][currentQuestionIndex] = parseInt(slider.value);
  }

  // =========================
  // SHOW RESULTS
  // =========================
  function showResults() {
    document.getElementById("test-section").classList.add("hidden");
    resultSection.classList.remove("hidden");

    // Check if user skipped or incomplete
    const answeredCategories = Object.keys(answers).filter(
      (c) => answers[c] && answers[c].length > 0
    );
    if (answeredCategories.length < categories.length) {
      resultOutput.innerHTML = `
        <div class="motivational-end">
          <h3>✨ Take Your Time ✨</h3>
          <p>
            Not an issue if you didn’t complete the test right now.<br>
            Sometimes self-reflection needs the right mood and peace of mind.<br><br>
            When you feel calm, come back — your answers will help you know your inner self deeply.<br>
            Remember, investing time in yourself brings the best returns. 🌱
          </p>
          <p class="end-note">With positivity,<br>— Self Insight Team 💫</p>
        </div>
      `;
      return;
    }

    // Normal result
    let reportHTML = `<h3>🧭 Self Insight Report</h3>`;
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

    for (let cat of categories) {
      let avg =
        answers[cat].reduce((a, b) => a + b, 0) / answers[cat].length;
      let level = Math.round(avg);
      let report = reportsData[cat].reports[level - 1].en;
      reportHTML += `<h4>${cat}</h4><p>${report}</p>`;
    }

    reportHTML += `<div class="meta">Generated on: ${formattedDate}</div>`;
    resultOutput.innerHTML = reportHTML;
  }

  // =========================
  // RESTART TEST
  // =========================
  restartBtn.addEventListener("click", () => {
    currentCategoryIndex = 0;
    currentQuestionIndex = 0;
    answers = {};
    resultSection.classList.add("hidden");
    document.getElementById("test-section").classList.remove("hidden");
    loadQuestion();
  });

  // =========================
  // EXIT / SKIP MODAL HANDLING
  // =========================
  function openExitModal(isExit = false) {
    pendingExit = isExit;
    modal.classList.remove("hidden");
  }

  function closeExitModal() {
    modal.classList.add("hidden");
  }

  endTestBtn.addEventListener("click", () => {
    openExitModal(true);
  });

  skipCategoryBtn.addEventListener("click", () => {
    openExitModal(false);
  });

  confirmExitBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    document.getElementById("test-section").classList.add("hidden");
    resultSection.classList.remove("hidden");
    resultOutput.innerHTML = `
      <div class="motivational-end">
        <h3>✨ Take Your Time ✨</h3>
        <p>
          Not an issue if you didn’t complete the test right now.<br>
          Sometimes self-reflection needs the right mood and peace of mind.<br><br>
          When you feel calm, come back — your answers will help you know your inner self deeply.<br>
          Remember, investing time in yourself brings the best returns. 🌱
        </p>
        <p class="end-note">With positivity,<br>— Self Insight Team 💫</p>
      </div>
    `;
  });

  cancelExitBtn.addEventListener("click", () => {
    closeExitModal();
    pendingExit = false;
  });
});
