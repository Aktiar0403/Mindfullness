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

      // === INITIALIZE ===
      loadCategory(currentCategoryIndex);

      // === LOAD CATEGORY ===
      function loadCategory(index) {
        const category = questions[index];
        if (!category) return;
        categoryTitle.textContent = category.category;
        currentQuestionIndex = 0;
        renderQuestion(category.questions[currentQuestionIndex]);
        updateButtons();
      }

      // === RENDER QUESTION ===
      function renderQuestion(questionObj) {
        if (!questionObj) return;

        questionContainer.innerHTML = `
          <div class="question-box">
            <h2>${questionObj.question}</h2>
            <div class="options">
              ${questionObj.options
                .map(
                  (opt, i) => `
                <label class="option">
                  <input type="radio" name="question" value="${i}" ${
                    userAnswers[getKey()] === i ? "checked" : ""
                  }>
                  ${opt}
                </label>
              `
                )
                .join("")}
            </div>
          </div>
        `;
      }

      // === GET UNIQUE KEY FOR ANSWER TRACKING ===
      function getKey() {
        return `${currentCategoryIndex}-${currentQuestionIndex}`;
      }

      // === SAVE SELECTED ANSWER ===
      function saveAnswer() {
        const selected = document.querySelector(
          'input[name="question"]:checked'
        );
        if (selected) userAnswers[getKey()] = parseInt(selected.value);
      }

      // === UPDATE BUTTON STATES ===
      function updateButtons() {
        prevBtn.style.display =
          currentQuestionIndex === 0 && currentCategoryIndex === 0
            ? "none"
            : "inline-block";
        nextBtn.textContent =
          currentCategoryIndex === questions.length - 1 &&
          currentQuestionIndex ===
            questions[currentCategoryIndex].questions.length - 1
            ? "Finish"
            : "Next";
      }

      // === NEXT BUTTON ===
      nextBtn.addEventListener("click", () => {
        saveAnswer();

        const category = questions[currentCategoryIndex];
        if (currentQuestionIndex < category.questions.length - 1) {
          currentQuestionIndex++;
          renderQuestion(category.questions[currentQuestionIndex]);
        } else if (currentCategoryIndex < questions.length - 1) {
          currentCategoryIndex++;
          loadCategory(currentCategoryIndex);
        } else {
          showResults();
          return;
        }
        updateButtons();
      });

      // === PREV BUTTON ===
      prevBtn.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          renderQuestion(questions[currentCategoryIndex].questions[currentQuestionIndex]);
        } else if (currentCategoryIndex > 0) {
          currentCategoryIndex--;
          loadCategory(currentCategoryIndex);
          currentQuestionIndex =
            questions[currentCategoryIndex].questions.length - 1;
          renderQuestion(questions[currentCategoryIndex].questions[currentQuestionIndex]);
        }
        updateButtons();
      });

      // === SKIP CATEGORY BUTTON ===
      skipBtn.addEventListener("click", () => {
        if (currentCategoryIndex < questions.length - 1) {
          currentCategoryIndex++;
          loadCategory(currentCategoryIndex);
        } else {
          showResults();
        }
      });

      // === SHOW RESULTS ===
      function showResults() {
        questionContainer.style.display = "none";
        nextBtn.style.display = "none";
        prevBtn.style.display = "none";
        skipBtn.style.display = "none";
        categoryTitle.textContent = "Results";

        const results = calculateResults();
        resultContent.innerHTML = `
          <h3>Summary</h3>
          <p><strong>Total Categories:</strong> ${results.totalCategories}</p>
          <p><strong>Completed:</strong> ${results.completed}</p>
          <p><strong>Skipped:</strong> ${results.skipped}</p>
          <p><strong>Score:</strong> ${results.score}</p>
        `;
        resultSection.style.display = "block";
      }

      // === CALCULATE RESULTS (SAFE HANDLING) ===
      function calculateResults() {
        let totalCategories = questions.length;
        let completed = 0;
        let skipped = 0;
        let score = 0;

        questions.forEach((cat, catIndex) => {
          if (!cat || !cat.questions) return;

          let answered = cat.questions.filter((_, qIndex) => {
            return userAnswers[`${catIndex}-${qIndex}`] !== undefined;
          });

          if (answered.length === 0) skipped++;
          else completed++;

          answered.forEach((_, qIndex) => {
            const ansIndex = userAnswers[`${catIndex}-${qIndex}`];
            if (cat.questions[qIndex].correct === ansIndex) score++;
          });
        });

        return { totalCategories, completed, skipped, score };
      }
    })
    .catch((err) => console.error("Error loading questions:", err));
});
