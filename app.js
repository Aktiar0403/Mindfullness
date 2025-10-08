// app.js
import { questionsData } from './questions.js';

document.addEventListener("DOMContentLoaded", () => {
  // ===== DOM ELEMENTS =====
  const introScreen = document.getElementById("intro-screen");
  const startBtn = document.getElementById("start-test-btn");
  const appContainer = document.getElementById("app-container");
  const categoryTitle = document.getElementById("category-title");
  const questionText = document.getElementById("question-text");
  const slider = document.getElementById("response-slider");
  const sliderValue = document.getElementById("slider-value");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const exitBtn = document.getElementById("exit-btn");
  const resultsDiv = document.getElementById("results");
  const userNameInput = document.getElementById("user-name");
  const langSelect = document.getElementById("lang-select");

  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let userAnswers = {};

  // ===== START BUTTON =====
  startBtn.addEventListener("click", () => {
    const name = userNameInput.value.trim();
    if (!name) {
      alert("Please enter your name to start.");
      return;
    }
    introScreen.classList.add("hidden");
    appContainer.classList.remove("hidden");
    loadQuestion();
    updateButtons();
  });

  // ===== LOAD QUESTION =====
  function loadQuestion() {
    const category = questionsData[currentCategoryIndex];
    const questionObj = category.questions[currentQuestionIndex];
    categoryTitle.textContent = category.title;
    const lang = langSelect.value || "en";
    questionText.textContent = questionObj[lang] || questionObj.en;

    const key = getKey();
    slider.value = userAnswers[key] || 3;
    sliderValue.textContent = slider.value;
  }

  function getKey() {
    return `${currentCategoryIndex}-${currentQuestionIndex}`;
  }

  // ===== BUTTON LOGIC =====
  prevBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    } else if (currentCategoryIndex > 0) {
      currentCategoryIndex--;
      currentQuestionIndex = questionsData[currentCategoryIndex].questions.length - 1;
    }
    loadQuestion();
    updateButtons();
  });

  nextBtn.addEventListener("click", () => {
    saveAnswer();
    const category = questionsData[currentCategoryIndex];
    if (currentQuestionIndex < category.questions.length - 1) {
      currentQuestionIndex++;
    } else if (currentCategoryIndex < questionsData.length - 1) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;
    }
    loadQuestion();
    updateButtons();
  });

  exitBtn.addEventListener("click", () => {
    showResults(false);
  });

  function saveAnswer() {
    const key = getKey();
    userAnswers[key] = parseInt(slider.value);
  }

  function updateButtons() {
    prevBtn.style.display = currentCategoryIndex === 0 && currentQuestionIndex === 0 ? "none" : "inline-block";

    // If last question of last category
    const isLastQuestion =
      currentCategoryIndex === questionsData.length - 1 &&
      currentQuestionIndex === questionsData[currentCategoryIndex].questions.length - 1;

    nextBtn.textContent = isLastQuestion ? "Show Report" : "Next ➡️";
  }

  // ===== SHOW RESULTS =====
  function showResults(completed = true) {
    saveAnswer();
    appContainer.querySelectorAll("*").forEach(el => {
      if (!resultsDiv.contains(el)) el.style.display = "none";
    });
    resultsDiv.classList.remove("hidden");

    if (!completed) {
      resultsDiv.innerHTML = `<h2>Test Ended Early</h2>
      <p>You exited before completing the test. Take your time and try again later — this test is for your benefit.</p>`;
      return;
    }

    // Calculate score
    let totalQuestions = 0;
    let answeredQuestions = 0;
    let totalScore = 0;

    questionsData.forEach((cat, cIndex) => {
      totalQuestions += cat.questions.length;
      cat.questions.forEach((q, qIndex) => {
        const key = `${cIndex}-${qIndex}`;
        if (userAnswers[key] !== undefined) {
          answeredQuestions++;
          totalScore += userAnswers[key];
        }
      });
    });

    const name = userNameInput.value.trim() || "User";

    resultsDiv.innerHTML = `
      <h2>📝 Test Report for ${name}</h2>
      <p><strong>Total Questions:</strong> ${totalQuestions}</p>
      <p><strong>Questions Answered:</strong> ${answeredQuestions}</p>
      <p><strong>Total Score:</strong> ${totalScore}</p>
      <p><strong>Average Score:</strong> ${(totalScore / answeredQuestions).toFixed(2)}</p>
    `;
  }

  // ===== SLIDER DISPLAY =====
  slider.addEventListener("input", () => {
    sliderValue.textContent = slider.value;
  });
});
