// app.js — Full Version (Category Navigation + Slider + Dynamic Reports)

import { loadReport } from "./results.js";

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const userNameInput = document.getElementById("user-name");
  const langSelect = document.getElementById("lang-select");
  const categoryTitle = document.getElementById("category-title");
  const questionText = document.getElementById("question-text");
  const responseSlider = document.getElementById("response-slider");
  const progressBar = document.getElementById("progress-bar");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const skipBtn = document.getElementById("skip-btn");
  const resultsDiv = document.getElementById("results");

  let questions = {};
  let categoryKeys = [];
  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let userAnswers = {};

  // Load questions
  import("./questions.js")
    .then((module) => {
      questions = module.questions;
      categoryKeys = Object.keys(questions);
      startCategory(currentCategoryIndex);
      updateButtons();
    })
    .catch((err) => console.error("Error loading questions:", err));

  // --- RENDER QUESTION ---
  function renderQuestion() {
    const categoryKey = categoryKeys[currentCategoryIndex];
    const category = questions[categoryKey];
    const questionObj = category.questions[currentQuestionIndex];
    const lang = langSelect.value || "en";

    questionText.textContent = questionObj[lang] || questionObj.en;
    responseSlider.value =
      userAnswers[`${categoryKey}-${currentQuestionIndex}`] || 3;

    updateProgress();
  }

  // --- START CATEGORY ---
  function startCategory(index) {
    currentQuestionIndex = 0;
    renderQuestion();
    categoryTitle.textContent = questions[categoryKeys[index]].title;
  }

  // --- UPDATE PROGRESS ---
  function updateProgress() {
    const category = questions[categoryKeys[currentCategoryIndex]];
    const percent =
      ((currentQuestionIndex + 1) / category.questions.length) * 100;
    progressBar.style.width = `${percent}%`;
  }

  // --- SAVE ANSWER ---
  function saveAnswer() {
    const key = `${categoryKeys[currentCategoryIndex]}-${currentQuestionIndex}`;
    userAnswers[key] = parseInt(responseSlider.value);
  }

  // --- BUTTON STATES ---
  function updateButtons() {
    prevBtn.style.display =
      currentCategoryIndex === 0 && currentQuestionIndex === 0
        ? "none"
        : "inline-block";

    nextBtn.textContent =
      currentCategoryIndex === categoryKeys.length - 1 &&
      currentQuestionIndex ===
        questions[categoryKeys[currentCategoryIndex]].questions.length - 1
        ? "Finish"
        : "Next";
  }

  // --- NAVIGATION BUTTONS ---
  nextBtn.addEventListener("click", async () => {
    saveAnswer();
    const category = questions[categoryKeys[currentCategoryIndex]];

    if (currentQuestionIndex < category.questions.length - 1) {
      currentQuestionIndex++;
    } else if (currentCategoryIndex < categoryKeys.length - 1) {
      currentCategoryIndex++;
      startCategory(currentCategoryIndex);
    } else {
      await showResults();
      return;
    }
    renderQuestion();
    updateButtons();
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    } else if (currentCategoryIndex > 0) {
      currentCategoryIndex--;
      currentQuestionIndex =
        questions[categoryKeys[currentCategoryIndex]].questions.length - 1;
    }
    startCategory(currentCategoryIndex);
    renderQuestion();
    updateButtons();
  });

  skipBtn.addEventListener("click", () => {
    if (currentCategoryIndex < categoryKeys.length - 1) {
      currentCategoryIndex++;
      startCategory(currentCategoryIndex);
    } else {
      showResults();
    }
  });

  // --- CALCULATE LEVEL FROM AVERAGE ---
  function getLevelFromAverage(avg) {
    if (avg <= 1) return 1;
    if (avg <= 2) return 2;
    if (avg <= 3) return 3;
    if (avg <= 4) return 4;
    if (avg <= 5) return 5;
    return 6;
  }

  // --- SHOW RESULTS ---
  async function showResults() {
    saveAnswer();
    categoryTitle.textContent = "Results";
    document.getElementById("question-box").style.display = "none";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    skipBtn.style.display = "none";
    progressBar.style.width = "100%";

    let html = `<h3>Hello ${userNameInput.value || "User"}!</h3>`;

    for (const key of categoryKeys) {
      const cat = questions[key];
      let sum = 0;
      cat.questions.forEach((_, idx) => {
        const val = userAnswers[`${key}-${idx}`];
        if (val) sum += val;
      });
      const avg = sum / cat.questions.length || 0;
      const level = getLevelFromAverage(avg);
      const reportText = await loadReport(key, level);

      html += `<h4>${cat.title} (Level ${level})</h4>`;
      html += `<p>${reportText}</p>`;
    }

    resultsDiv.innerHTML = html;
    resultsDiv.classList.remove("hidden");
  }
});
