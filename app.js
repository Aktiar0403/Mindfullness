// ===============================
// Global Variables
// ===============================
let categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategoryIndex = 0;
let currentQuestionIndex = 0;
let answers = [];
let selectedLang = "en"; // default language

// ===============================
// Load Question
// ===============================
function loadQuestion() {
  if (currentCategoryIndex >= categories.length) {
    showResults();
    return;
  }

  const category = categories[currentCategoryIndex];
  const questionList = reportsData[category].questions;

  if (currentQuestionIndex >= questionList.length) {
    // finished current category, move to next
    currentCategoryIndex++;
    currentQuestionIndex = 0;
    loadQuestion();
    return;
  }

  document.getElementById("category-title").innerText =
    reportsData[category].title;
  document.getElementById("question-box").innerText =
    questionList[currentQuestionIndex][selectedLang];

  document.getElementById("answer-slider").value = 3; // default slider value
}

// ===============================
// Skip / End Test Modal
// ===============================
function openModal(type) {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.dataset.action = type; // "skip" or "exit"
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.add("hidden");
  modal.dataset.action = "";
}

// ===============================
// Show Results
// ===============================
function showResults() {
  document.getElementById("test-section").classList.add("hidden");
  const resultSection = document.getElementById("result-section");
  const resultOutput = document.getElementById("result-output");
  resultSection.classList.remove("hidden");

  if (answers.length === 0) {
    showMotivationalResultMessage();
    return;
  }

  let html = "<h2>Your Complete Personality Insight Report</h2>";

  categories.forEach((category) => {
    const categoryAnswers = answers.filter(
      (a) => a.category === category && !a.skipped
    );
    if (categoryAnswers.length === 0) {
      html += `<h3>${reportsData[category].title}</h3><p>You skipped this category.</p><hr>`;
    } else {
      const score =
        categoryAnswers.reduce((sum, q) => sum + Number(q.value), 0) /
        categoryAnswers.length;
      const level = getLevelFromScore(score);
      html += `<h3>${reportsData[category].title}</h3>
               <p><b>Score:</b> ${score.toFixed(1)}</p>
               <p><b>Level:</b> ${level}</p>
               <p>${reportsData[category][level]}</p><hr>`;
    }
  });

  const now = new Date();
  html += `<div class="result-footer">
             <p>Completed on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</p>
             <p>Privacy Note: Your data is not stored; only you can see your answers.</p>
           </div>`;

  resultOutput.innerHTML = html;
}

// ===============================
// Motivational Message for Partial Test
// ===============================
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
        When you’re free, take this test in full focus. It helps you <b>understand yourself better</b>.
      </p>
      <p>
        Instead of scrolling endless reels, invest a few minutes in self-discovery 🌱
      </p>
      <p><b>Wishing you calm and clarity ✨</b></p>
    </div>
  `;

  resultOutput.innerHTML = message;
}

// ===============================
// Helper: Convert score to level
// ===============================
function getLevelFromScore(score) {
  if (score <= 1.5) return "Very Low";
  if (score <= 2.5) return "Low";
  if (score <= 3.5) return "Medium";
  if (score <= 4.5) return "High";
  return "Very High";
}

// ===============================
// DOMContentLoaded -> attach all listeners
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Start Test button
  document
    .getElementById("start-test-btn")
    .addEventListener("click", () => {
      document.getElementById("intro-screen").classList.add("hidden");
      document.querySelector(".app-container").classList.remove("hidden");
      loadQuestion();
    });

  // Next Button
  document.getElementById("next-btn").addEventListener("click", () => {
    const slider = document.getElementById("answer-slider");
    const category = categories[currentCategoryIndex];

    answers.push({
      category,
      questionIndex: currentQuestionIndex,
      value: slider.value,
    });

    currentQuestionIndex++;
    loadQuestion();
  });

  // Skip Category
  document.getElementById("skip-category").addEventListener("click", () => {
    openModal("skip");
  });

  // End Test
  document.getElementById("end-test").addEventListener("click", () => {
    openModal("exit");
  });

  // Modal confirm
  document.getElementById("confirm-exit").addEventListener("click", () => {
    const modal = document.getElementById("modal");
    const action = modal.dataset.action;
    closeModal();

    if (action === "skip") {
      answers.push({
        category: categories[currentCategoryIndex],
        skipped: true,
      });
      currentCategoryIndex++;
      currentQuestionIndex = 0;
      if (currentCategoryIndex >= categories.length) {
        showMotivationalResultMessage("skipped");
        return;
      }
      loadQuestion();
    } else {
      showMotivationalResultMessage("ended");
    }
  });

  // Modal cancel
  document.getElementById("cancel-exit").addEventListener("click", closeModal);

  // Restart Test
  document.getElementById("restart-btn").addEventListener("click", () => {
    answers = [];
    currentCategoryIndex = 0;
    currentQuestionIndex = 0;
    document.getElementById("result-section").classList.add("hidden");
    document.getElementById("test-section").classList.remove("hidden");
    loadQuestion();
  });

  // Language Selector
  document.getElementById("lang-select").addEventListener("change", (e) => {
    selectedLang = e.target.value;
    loadQuestion();
  });
});
