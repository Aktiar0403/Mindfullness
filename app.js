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
function showMotivationalResultMessage(reason = "incomplete") {
  document.getElementById("test-section").classList.add("hidden");
  const resultSection = document.getElementById("result-section");
  const resultOutput = document.getElementById("result-output");
  resultSection.classList.remove("hidden");

  let message = `
    <div class="motivational-box">
      <h2>✨ Take Your Time ✨</h2>
      <p>
        You chose to ${reason === "skipped" ? "skip a category" : "end the test early"}.
        That’s perfectly fine — maybe you didn’t have time right now.
      </p>
      <p>
        When you’re free, come back and complete the test in peace and focus.
        It’s designed to help you <b>understand yourself better</b> — not to judge you.
      </p>
      <p>
        Of course, from scrolling endless reels to growing self-awareness… we wish you choose the better path 🌿
      </p>
      <p><b>— Wishing you calm and clarity 💫</b></p>
    </div>
  `;

  resultOutput.innerHTML = message;
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

// ===============================
// MODAL & EXIT / SKIP HANDLING
// ===============================

// Open modal with action type (skip or exit)
function openModal(type) {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.dataset.action = type; // "skip" or "exit"
}

// Close modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
  modal.dataset.action = "";
}

// Motivational message shown when skipped or exited early
function showMotivationalResultMessage(reason = "incomplete") {
  document.getElementById("test-section").classList.add("hidden");
  const resultSection = document.getElementById("result-section");
  const resultOutput = document.getElementById("result-output");
  resultSection.classList.remove("hidden");

  let message = `
    <div class="motivational-box">
      <h2>✨ Take Your Time ✨</h2>
      <p>
        You chose to ${
          reason === "skipped" ? "skip a category" : "end the test early"
        } — and that’s totally fine!  
      </p>
      <p>
        Maybe you didn’t have time right now. When you’re free, take this test with focus.  
        It helps you <b>understand yourself better</b> — not to judge you.
      </p>
      <p>
        From scrolling endless reels to exploring your own mind — we wish you choose the better path 🌱
      </p>
      <p><b>✨ Wishing you calm and clarity ahead 💫</b></p>
    </div>
  `;

  resultOutput.innerHTML = message;
}

// Confirm Exit / Skip
document.getElementById("confirm-exit").addEventListener("click", () => {
  const modal = document.getElementById("modal");
  const action = modal.dataset.action;
  closeModal();

  if (action === "skip") {
    showMotivationalResultMessage("skipped");
  } else {
    // Check if all categories and questions are completed
    const allCategoriesCompleted =
      currentCategoryIndex >= categories.length - 1 &&
      currentQuestionIndex >=
        categories[categories.length - 1].questions.length - 1;

    if (allCategoriesCompleted) {
      showResults(); // full test done
    } else {
      showMotivationalResultMessage("ended"); // exited early
    }
  }
});

// Cancel exit
document.getElementById("cancel-exit").addEventListener("click", closeModal);


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
