// ==============================
// Fully Working app.js
// ==============================
window.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // Global Variables
  // ==============================
  let categories = ["emotional", "growth", "overthinking", "resilience"];
  let currentCategory = 0;
  let currentQuestion = 0;
  let userName = "";
  let answers = [];
  let selectedLang = "en"; // default language

  // ==============================
  // DOM References
  // ==============================
  const introScreen = document.getElementById("intro-screen");
  const startBtn = document.getElementById("start-test-btn");
  const appContainer = document.querySelector(".app-container");
  const questionBox = document.getElementById("question-box");
  const categoryTitle = document.getElementById("category-title");
  const slider = document.getElementById("answer-slider");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const skipBtn = document.getElementById("skip-category");
  const endBtn = document.getElementById("end-test");
  const resultSection = document.getElementById("result-section");
  const resultOutput = document.getElementById("result-output");
  const langSelect = document.getElementById("lang-select");

  // ==============================
  // Event Listeners
  // ==============================

  // Start Test
  startBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("user-name");
    userName = nameInput ? nameInput.value.trim() || "Anonymous" : "Anonymous";

    introScreen.classList.add("hidden");
    appContainer.classList.remove("hidden");
    loadQuestion();
  });

  // Language change
  langSelect.addEventListener("change", e => {
    selectedLang = e.target.value;
    loadQuestion();
  });

  // Next Question
  nextBtn.addEventListener("click", () => {
    saveAnswer();
    nextQuestion();
  });

  // Previous Question
  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion();
    }
  });

  // Skip Category
  skipBtn.addEventListener("click", () => {
    showModal(
      "Skip This Category?",
      `Not a problem if you don't have time now for "${categoryTitle.innerText}". Make sure to complete it later for your self-growth.`,
      () => {
        answers.push({ category: categories[currentCategory], skipped: true });
        nextCategory();
      }
    );
  });

  // End Test
  endBtn.addEventListener("click", () => {
    showModal(
      "End Test?",
      "Not a problem if you don’t have time now. Make sure to take the test later to understand yourself better.",
      () => {
        showResults();
      }
    );
  });

  // ==============================
  // Core Functions
  // ==============================

  // Load current question
  function loadQuestion() {
    const cat = categories[currentCategory];
    const qList = reportsData[cat].questions;
    if (!qList || qList.length === 0) return;

    const q = qList[currentQuestion][selectedLang];
    categoryTitle.innerText = reportsData[cat].title;
    questionBox.innerText = q;

    slider.value = 3; // default middle
  }

  // Save answer
  function saveAnswer() {
    const cat = categories[currentCategory];
    const value = Number(slider.value);
    answers.push({ category: cat, questionIndex: currentQuestion, value });
  }

  // Move to next question or category
  function nextQuestion() {
    const cat = categories[currentCategory];
    const qList = reportsData[cat].questions;

    currentQuestion++;
    if (currentQuestion >= qList.length) {
      nextCategory();
    } else {
      loadQuestion();
    }
  }

  // Move to next category
  function nextCategory() {
    currentCategory++;
    currentQuestion = 0;

    if (currentCategory >= categories.length) {
      showResults();
    } else {
      loadQuestion();
    }
  }

  // Map average score to level1–level6
  function getLevelFileName(score) {
    let rounded = Math.round(score);
    if (rounded < 1) rounded = 1;
    if (rounded > 6) rounded = 6;
    return `level${rounded}.md`;
  }

  // Fetch markdown report
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

  // Show final results
  async function showResults() {
    appContainer.classList.add("hidden");
    resultSection.classList.remove("hidden");

    if (answers.length === 0) {
      resultOutput.innerHTML = `
        <p>You did not answer any questions yet. Whenever possible, take the test to understand yourself better!</p>
      `;
      return;
    }

    let html = `<h2>${userName}'s Personality Insight Report</h2>`;

    for (let cat of categories) {
      const catAnswers = answers.filter(a => a.category === cat && !a.skipped);
      if (catAnswers.length === 0) {
        html += `<h3>${reportsData[cat].title}</h3><p>You skipped this category. Try it later for full insight.</p><hr>`;
        continue;
      }

      const avgScore = catAnswers.reduce((sum, a) => sum + a.value, 0) / catAnswers.length;
      const levelFile = getLevelFileName(avgScore);
      const reportText = await fetchReport(cat, levelFile);

      html += `<div class="category-report">
                 <h3>${reportsData[cat].title}</h3>
                 <p><strong>Average Score:</strong> ${avgScore.toFixed(1)}</p>
                 <p>${reportText}</p>
               </div><hr>`;
    }

    const now = new Date();
    html += `<div class="result-footer">
               <p>Completed on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</p>
               <p>Privacy Note: No data is stored; only you can see your answers.</p>
             </div>`;

    resultOutput.innerHTML = html;
  }

  // ==============================
  // Custom Modal
  // ==============================
  function showModal(title, message, confirmCallback) {
    const modal = document.getElementById("modal");
    modal.querySelector("h3").innerText = title;
    modal.querySelector("p").innerText = message;

    modal.classList.remove("hidden");

    let confirmBtn = document.getElementById("confirm-exit");
    let cancelBtn = document.getElementById("cancel-exit");

    // Remove previous listeners
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    cancelBtn.replaceWith(cancelBtn.cloneNode(true));

    confirmBtn = document.getElementById("confirm-exit");
    cancelBtn = document.getElementById("cancel-exit");

    confirmBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
      confirmCallback();
    });

    cancelBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

});
