import { questions } from "./questions.js";
import { loadReport } from "./results.js";

document.addEventListener("DOMContentLoaded", () => {
  const questionText = document.getElementById("question-text");
  const responseSlider = document.getElementById("response-slider");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const skipBtn = document.getElementById("skip-btn");
  const categoryTitle = document.getElementById("category-title");
  const resultsDiv = document.getElementById("results");
  const progressBar = document.getElementById("progress-bar");

  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { "category-question": value }

  const totalQuestions = questions.reduce((sum, cat) => sum + cat.questions.length, 0);

  // Initialize first question
  loadCategory(currentCategoryIndex);

  // === LOAD CATEGORY ===
  function loadCategory(index) {
    const category = questions[index];
    if (!category) return;
    categoryTitle.textContent = category.title;
    currentQuestionIndex = 0;
    renderQuestion();
    updateButtons();
    updateProgress();
  }

  // === RENDER QUESTION ===
  function renderQuestion() {
    const category = questions[currentCategoryIndex];
    const questionObj = category.questions[currentQuestionIndex];
    questionText.textContent = questionObj.en; // default English, can expand for language later

    // Preselect previous answer if exists
    const key = getKey();
    if (userAnswers[key] !== undefined) {
      responseSlider.value = userAnswers[key];
    } else {
      responseSlider.value = 3; // default mid
    }
  }

  // === GET UNIQUE KEY ===
  function getKey() {
    return `${currentCategoryIndex}-${currentQuestionIndex}`;
  }

  // === SAVE ANSWER ===
  function saveAnswer() {
    userAnswers[getKey()] = parseInt(responseSlider.value);
  }

  // === UPDATE BUTTON STATES ===
  function updateButtons() {
    prevBtn.style.display = currentCategoryIndex === 0 && currentQuestionIndex === 0 ? "none" : "inline-block";
    nextBtn.textContent = (currentCategoryIndex === questions.length - 1 &&
      currentQuestionIndex === questions[currentCategoryIndex].questions.length - 1) ? "Finish" : "Next";
  }

  // === UPDATE PROGRESS BAR ===
  function updateProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    const percent = Math.round((answeredCount / totalQuestions) * 100);
    progressBar.style.width = `${percent}%`;
  }

  // === NEXT BUTTON ===
  nextBtn.addEventListener("click", async () => {
    saveAnswer();

    const category = questions[currentCategoryIndex];
    if (currentQuestionIndex < category.questions.length - 1) {
      currentQuestionIndex++;
    } else if (currentCategoryIndex < questions.length - 1) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;
    } else {
      // All done — show results
      await showResults();
      return;
    }

    renderQuestion();
    updateButtons();
    updateProgress();
  });

  // === PREV BUTTON ===
  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    } else if (currentCategoryIndex > 0) {
      currentCategoryIndex--;
      currentQuestionIndex = questions[currentCategoryIndex].questions.length - 1;
    }
    renderQuestion();
    updateButtons();
    updateProgress();
  });

  // === SKIP CATEGORY BUTTON ===
  skipBtn.addEventListener("click", () => {
    if (currentCategoryIndex < questions.length - 1) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;
      renderQuestion();
      updateButtons();
      updateProgress();
    } else {
      showResults();
    }
  });

  // === SHOW RESULTS ===
  async function showResults() {
    // Hide question area
    document.getElementById("question-box").style.display = "none";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    skipBtn.style.display = "none";

    categoryTitle.textContent = "Results";
    resultsDiv.classList.remove("hidden");

    // Calculate category-wise levels (average slider per category → 1–6)
    const categoryResults = [];

    for (let i = 0; i < questions.length; i++) {
      const cat = questions[i];
      const answers = cat.questions.map((_, qIdx) => userAnswers[`${i}-${qIdx}`] || 0);
      const sum = answers.reduce((a, b) => a + b, 0);
      const avg = sum / cat.questions.length;
      const level = Math.min(6, Math.max(1, Math.round(avg)));
      categoryResults.push({ category: cat.category, level });
    }

    // Load and display reports
    resultsDiv.innerHTML = "<h2>Personalized Insights</h2>";
    for (let res of categoryResults) {
      const reportText = await loadReport(res.category, res.level);
      resultsDiv.innerHTML += `
        <div class="report">
          <h3>${res.category.toUpperCase()}</h3>
          <pre>${reportText}</pre>
        </div>
      `;
    }
  }
});
