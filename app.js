// ==============================
// Fully Working app.js
// ==============================
window.addEventListener("DOMContentLoaded", () => {

  // Global Variables
  const categories = ["emotional", "growth", "overthinking", "resilience"];
  let currentCategory = 0;
  let currentQuestion = 0;
  let answers = [];
  let selectedLang = "en";
  let userName = "";

  // DOM References
  const questionBox = document.getElementById("question-text");
  const categoryTitle = document.getElementById("category-title");
  const slider = document.getElementById("response-slider");
  const nextBtn = document.getElementById("next-btn");
  const skipBtn = document.getElementById("skip-btn");
  const exitBtn = document.getElementById("exit-btn");
  const resultsDiv = document.getElementById("results");
  const langSelect = document.getElementById("lang-select");

  // Modal Elements
  const modal = document.getElementById("confirmModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const confirmBtn = document.getElementById("confirmModalBtn");
  const cancelBtn = document.getElementById("cancelModal");

  // ==============================
  // Event Listeners
  // ==============================

  // Language change
  langSelect.addEventListener("change", e => {
    selectedLang = e.target.value;
    loadQuestion();
  });

  // Next question
  nextBtn.addEventListener("click", () => {
    saveAnswer();
    nextQuestion();
  });

  // Skip category
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

  // End test
  exitBtn.addEventListener("click", () => {
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

  function loadQuestion() {
    if (!reportsData) return;

    const cat = categories[currentCategory];
    const qList = reportsData[cat].questions;
    if (!qList || qList.length === 0) return;

    const q = qList[currentQuestion][selectedLang];
    categoryTitle.innerText = reportsData[cat].title;
    questionBox.innerText = q;

    slider.value = 3; // default
  }

  function saveAnswer() {
    const cat = categories[currentCategory];
    const value = Number(slider.value);
    answers.push({ category: cat, questionIndex: currentQuestion, value });
  }

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

  function nextCategory() {
    currentCategory++;
    currentQuestion = 0;

    if (currentCategory >= categories.length) {
      showResults();
    } else {
      loadQuestion();
    }
  }

  function getLevelFileName(score) {
    let rounded = Math.round(score);
    if (rounded < 1) rounded = 1;
    if (rounded > 6) rounded = 6;
    return `level${rounded}.md`;
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

  async function showResults() {
    document.getElementById("app-container").classList.add("hidden");
    resultsDiv.classList.remove("hidden");

    if (answers.length === 0) {
      resultsDiv.innerHTML = `<p>You did not answer any questions yet. Try taking the test when possible!</p>`;
      return;
    }

    let html = `<h2>Your Insight Report</h2>`;
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

    resultsDiv.innerHTML = html;
  }

  function showModal(title, message, confirmCallback) {
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modal.classList.remove("hidden");

    // Remove old listeners
    const newConfirm = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirm, confirmBtn);

    const newCancel = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);

    newConfirm.addEventListener("click", () => {
      modal.classList.add("hidden");
      confirmCallback();
    });

    newCancel.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

});
