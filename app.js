// app.js — Version B (Stable Category Navigation + Results Calculation)

document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("questionContainer");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const skipBtn = document.getElementById("skipBtn");
  const resultSection = document.getElementById("resultSection");
  const resultContent = document.getElementById("resultContent");
  const categoryTitle = document.getElementById("categoryTitle");

  // === IMPORT QUESTIONS ===
  import("./questions.js")
  .then((module) => {
    const questions = module.questions;

    let currentCategoryIndex = 0;
    let currentQuestionIndex = 0;
    let userAnswers = {};

    // ✅ SAFETY CHECK: verify questions.js loaded correctly
    if (Array.isArray(questions) && questions.length > 0) {
      loadCategory(currentCategoryIndex);
    } else {
      const questionContainer = document.getElementById("question-container");
      const nextBtn = document.getElementById("next-btn");
      const skipBtn = document.getElementById("skip-btn");

      questionContainer.innerHTML = "<p>No questions found. Please check questions.js</p>";
      nextBtn.style.display = "none";
      skipBtn.style.display = "none";
      return;
    }

    // ⬇️ The rest of your normal logic continues below
    function loadCategory(index) {
      const category = questions[index];
      currentQuestionIndex = 0;
      showQuestion(category.questions[currentQuestionIndex]);
    }

    function showQuestion(questionObj) {
      const questionContainer = document.getElementById("question-container");
      questionContainer.innerHTML = `
        <h3>${questionObj.question}</h3>
        ${questionObj.options.map(
          (option, i) => `<button class="option-btn" data-index="${i}">${option}</button>`
        ).join("")}
      `;
    }

    // Example: event listeners
    document.getElementById("next-btn").addEventListener("click", () => {
      nextQuestion();
    });

    document.getElementById("skip-btn").addEventListener("click", () => {
      skipCategory();
    });

    function nextQuestion() {
      const category = questions[currentCategoryIndex];
      if (currentQuestionIndex < category.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(category.questions[currentQuestionIndex]);
      } else {
        currentCategoryIndex++;
        if (currentCategoryIndex < questions.length) {
          loadCategory(currentCategoryIndex);
        } else {
          showResults();
        }
      }
    }

    function showResults() {
      const questionContainer = document.getElementById("question-container");
      questionContainer.innerHTML = `
        <div class="results">
          <h2>All done!</h2>
          <p>Great work. You’ve completed the test.</p>
        </div>
      `;
      document.getElementById("next-btn").style.display = "none";
      document.getElementById("skip-btn").style.display = "none";
    }
  })
  .catch((err) => {
    console.error("Error loading questions:", err);
    document.getElementById("question-container").innerHTML =
      "<p>Error loading questions. Please try again later.</p>";
  });
