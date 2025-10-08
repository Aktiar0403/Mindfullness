// app.js — Complete Version
document.addEventListener("DOMContentLoaded", async () => {
  const introScreen = document.getElementById("intro-screen");
  const startBtn = document.getElementById("start-test-btn");
  const appContainer = document.getElementById("app-container");
  const questionBox = document.getElementById("question-box");
  const questionText = document.getElementById("question-text");
  const responseSlider = document.getElementById("response-slider");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const exitBtn = document.getElementById("exit-btn");
  const categoryTitle = document.getElementById("category-title");
  const resultsDiv = document.getElementById("results");
  const langSelect = document.getElementById("lang-select");

  let categories = [];
  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let userAnswers = {}; // stores answers as key "catIndex-quesIndex" => value 1-6

  // Load questions
  try {
    const questionsModule = await import("./questions.js");
    const questionsData = questionsModule.questionsData;
    categories = Object.keys(questionsData).map((key) => ({
      category: questionsData[key].title,
      key,
      questions: questionsData[key].questions,
    }));
  } catch (err) {
    console.error("Error loading questions:", err);
    questionBox.innerHTML = "<p>Questions failed to load. Check console.</p>";
    return;
  }

  // Start button
  startBtn.addEventListener("click", () => {
    introScreen.style.display = "none";
    appContainer.classList.remove("hidden");
    renderQuestion(getCurrentQuestion());
    updateButtons();
    updateExitButton();
  });

  // Get current question object
  function getCurrentQuestion() {
    return categories[currentCategoryIndex].questions[currentQuestionIndex];
  }

  // Render question and slider
  function renderQuestion(questionObj) {
    const savedAnswer = userAnswers[getKey()] || 3; // default middle value
    questionText.textContent = questionObj[langSelect.value];
    responseSlider.value = savedAnswer;
    categoryTitle.textContent = categories[currentCategoryIndex].category;
  }

  // Unique key for answers
  function getKey() {
    return `${currentCategoryIndex}-${currentQuestionIndex}`;
  }

  // Save answer
  function saveAnswer() {
    userAnswers[getKey()] = parseInt(responseSlider.value);
    updateExitButton();
  }

  // Next button
  nextBtn.addEventListener("click", () => {
    saveAnswer();
    const category = categories[currentCategoryIndex];
    if (currentQuestionIndex < category.questions.length - 1) {
      currentQuestionIndex++;
    } else if (currentCategoryIndex < categories.length - 1) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;
    } else {
      showResults();
      return;
    }
    renderQuestion(getCurrentQuestion());
    updateButtons();
  });

  // Previous button
  prevBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    } else if (currentCategoryIndex > 0) {
      currentCategoryIndex--;
      currentQuestionIndex = categories[currentCategoryIndex].questions.length - 1;
    }
    renderQuestion(getCurrentQuestion());
    updateButtons();
  });

  // Update Next / Prev buttons visibility
  function updateButtons() {
    prevBtn.style.display =
      currentCategoryIndex === 0 && currentQuestionIndex === 0 ? "none" : "inline-block";
    nextBtn.textContent =
      currentCategoryIndex === categories.length - 1 &&
      currentQuestionIndex === categories[currentCategoryIndex].questions.length - 1
        ? "Finish"
        : "Next ➡️";
  }

  // Update Exit button text dynamically
  function updateExitButton() {
    const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
    const answeredQuestions = Object.keys(userAnswers).length;
    exitBtn.textContent = answeredQuestions === totalQuestions ? "Show Report" : "End Test";
  }

  // Exit / Show Report button
  exitBtn.addEventListener("click", () => {
    saveAnswer();
    const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0);
    const answeredQuestions = Object.keys(userAnswers).length;

    questionBox.style.display = "none";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    exitBtn.style.display = "none";

    resultsDiv.classList.remove("hidden");

    if (answeredQuestions < totalQuestions) {
      resultsDiv.innerHTML = `
        <h3>Take it easy!</h3>
        <p>You haven’t completed the test. This is for your personal insight, so take it later when you have enough time and focus.</p>
      `;
    } else {
      showResults();
    }
  });

  // Calculate and show results with report loading
  async function showResults() {
    let summaryHTML = `<h3>Summary</h3>`;
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const answered = cat.questions.filter((_, qIndex) => userAnswers[`${i}-${qIndex}`] !== undefined);
      const score = answered.reduce((sum, _, qIndex) => sum + parseInt(userAnswers[`${i}-${qIndex}`]), 0);
      summaryHTML += `<p><strong>${cat.category}:</strong> ${score}/${cat.questions.length * 6}</p>`;

      // Load report based on level (here level = rounded average)
      const avg = Math.round(score / answered.length || 1);
      try {
        const reportRes = await fetch(`./reports/${cat.key}/level${avg}.md`);
        if (reportRes.ok) {
          const reportText = await reportRes.text();
          summaryHTML += `<div class="report"><strong>Report:</strong><p>${reportText}</p></div>`;
        } else {
          summaryHTML += `<div class="report"><p>Report unavailable.</p></div>`;
        }
      } catch {
        summaryHTML += `<div class="report"><p>Report unavailable.</p></div>`;
      }
    }
    resultsDiv.innerHTML = summaryHTML;
  }
});
