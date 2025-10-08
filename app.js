// app.js
import { questionsData } from "./questions.js"; // <- match your export

document.addEventListener("DOMContentLoaded", () => {
  const questionContainer = document.getElementById("questionContainer");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const endBtn = document.getElementById("endBtn");
  const resultSection = document.getElementById("resultSection");
  const resultContent = document.getElementById("resultContent");
  const categoryTitle = document.getElementById("categoryTitle");

  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let userAnswers = {};
  let examEndedEarly = false;

  const totalCategories = questionsData.length;

  // === INITIALIZE ===
  loadCategory(currentCategoryIndex);

  // === LOAD CATEGORY ===
  function loadCategory(index) {
    const category = questionsData[index];
    if (!category) return;
    categoryTitle.textContent = category.title;
    currentQuestionIndex = 0;
    renderQuestion(category.questions[currentQuestionIndex]);
    updateButtons();
  }

  // === RENDER QUESTION ===
  function renderQuestion(questionObj) {
    if (!questionObj) return;
    questionContainer.innerHTML = `
      <div class="question-box">
        <h2>${questionObj.en}</h2>
        <div class="options">
          ${[1,2,3,4].map(i => `
            <label class="option">
              <input type="radio" name="question" value="${i}" ${
                userAnswers[getKey()] === i ? "checked" : ""
              }>
              ${i}
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }

  function getKey() {
    return `${currentCategoryIndex}-${currentQuestionIndex}`;
  }

  function saveAnswer() {
    const selected = document.querySelector('input[name="question"]:checked');
    if (selected) userAnswers[getKey()] = parseInt(selected.value);
  }

  function updateButtons() {
    prevBtn.style.display = currentQuestionIndex === 0 && currentCategoryIndex === 0 ? "none" : "inline-block";

    // If last question of last category, button becomes "Show Report"
    if (currentCategoryIndex === totalCategories - 1 &&
        currentQuestionIndex === questionsData[currentCategoryIndex].questions.length - 1) {
      nextBtn.textContent = "Show Report";
    } else {
      nextBtn.textContent = "Next";
    }
  }

  // === NEXT BUTTON ===
  nextBtn.addEventListener("click", () => {
    saveAnswer();
    const category = questionsData[currentCategoryIndex];

    if (currentQuestionIndex < category.questions.length - 1) {
      currentQuestionIndex++;
      renderQuestion(category.questions[currentQuestionIndex]);
    } else if (currentCategoryIndex < totalCategories - 1) {
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
      renderQuestion(questionsData[currentCategoryIndex].questions[currentQuestionIndex]);
    } else if (currentCategoryIndex > 0) {
      currentCategoryIndex--;
      loadCategory(currentCategoryIndex);
      currentQuestionIndex = questionsData[currentCategoryIndex].questions.length - 1;
      renderQuestion(questionsData[currentCategoryIndex].questions[currentQuestionIndex]);
    }
    updateButtons();
  });

  // === END BUTTON ===
  endBtn.addEventListener("click", () => {
    // Check if all questions answered
    const allAnswered = questionsData.every((cat, catIndex) =>
      cat.questions.every((_, qIndex) => userAnswers[`${catIndex}-${qIndex}`] !== undefined)
    );

    if (!allAnswered) {
      examEndedEarly = true;
    }

    showResults();
  });

  function showResults() {
    questionContainer.style.display = "none";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    endBtn.style.display = "none";
    categoryTitle.textContent = "Results";

    if (examEndedEarly) {
      resultContent.innerHTML = `<p>You exited early. Please take the test when you have sufficient time and patience. This test is for your benefit and understanding.</p>`;
    } else {
      const results = calculateResults();
      resultContent.innerHTML = `
        <h3>Summary</h3>
        <p><strong>Total Categories:</strong> ${results.totalCategories}</p>
        <p><strong>Completed:</strong> ${results.completed}</p>
        <p><strong>Score:</strong> ${results.score}</p>
      `;
    }

    resultSection.style.display = "block";
  }

  function calculateResults() {
    let completed = 0;
    let score = 0;

    questionsData.forEach((cat, catIndex) => {
      const answered = cat.questions.filter((_, qIndex) => userAnswers[`${catIndex}-${qIndex}`] !== undefined);
      if (answered.length > 0) completed++;

      answered.forEach((_, qIndex) => {
        const ans = userAnswers[`${catIndex}-${qIndex}`];
        // For demonstration, assume correct answer is 4 for all (or you can extend questions with 'correct')
        if (ans === 4) score++;
      });
    });

    return {
      totalCategories,
      completed,
      score
    };
  }
});
