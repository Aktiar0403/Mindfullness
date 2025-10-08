document.addEventListener("DOMContentLoaded", () => {
  const questionText = document.getElementById("question-text");
  const responseSlider = document.getElementById("response-slider");
  const categoryTitle = document.getElementById("category-title");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const skipBtn = document.getElementById("skip-btn");
  const progressBar = document.getElementById("progress-bar");
  const resultsDiv = document.getElementById("results");

  const categoryKeys = Object.keys(questions);
  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { "emotional-0": 3 }

  function getKey() {
    return `${categoryKeys[currentCategoryIndex]}-${currentQuestionIndex}`;
  }

  function renderQuestion() {
    const catKey = categoryKeys[currentCategoryIndex];
    const category = questions[catKey];
    const qObj = category.questions[currentQuestionIndex];

    categoryTitle.textContent = category.title;
    questionText.textContent = qObj.en; // Default English

    // Set slider value if already answered
    const key = getKey();
    if (userAnswers[key] !== undefined) {
      responseSlider.value = userAnswers[key];
    } else {
      responseSlider.value = 3;
    }

    updateProgress();
    updateButtons();
  }

  function saveAnswer() {
    userAnswers[getKey()] = parseInt(responseSlider.value);
  }

  function updateButtons() {
    prevBtn.style.display =
      currentCategoryIndex === 0 && currentQuestionIndex === 0
        ? "none"
        : "inline-block";

    nextBtn.textContent =
      currentCategoryIndex === categoryKeys.length - 1 &&
      currentQuestionIndex === questions[categoryKeys[currentCategoryIndex]].questions.length - 1
        ? "Finish"
        : "Next";
  }

  function updateProgress() {
    const totalQuestions = categoryKeys.reduce(
      (sum, key) => sum + questions[key].questions.length,
      0
    );
    const answeredQuestions = Object.keys(userAnswers).length;
    const percent = Math.round((answeredQuestions / totalQuestions) * 100);
    progressBar.style.width = `${percent}%`;
  }

  nextBtn.addEventListener("click", () => {
    saveAnswer();

    const category = questions[categoryKeys[currentCategoryIndex]];
    if (currentQuestionIndex < category.questions.length - 1) {
      currentQuestionIndex++;
    } else if (currentCategoryIndex < categoryKeys.length - 1) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;
    } else {
      showResults();
      return;
    }

    renderQuestion();
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
    } else if (currentCategoryIndex > 0) {
      currentCategoryIndex--;
      currentQuestionIndex = questions[categoryKeys[currentCategoryIndex]].questions.length - 1;
    }
    renderQuestion();
  });

  skipBtn.addEventListener("click", () => {
    if (currentCategoryIndex < categoryKeys.length - 1) {
      currentCategoryIndex++;
      currentQuestionIndex = 0;
      renderQuestion();
    } else {
      showResults();
    }
  });

  function showResults() {
    saveAnswer();

    const summary = {};
    categoryKeys.forEach((key) => {
      const cat = questions[key];
      let sum = 0;
      cat.questions.forEach((_, idx) => {
        const val = userAnswers[`${key}-${idx}`];
        if (val !== undefined) sum += val;
      });
      summary[key] = {
        total: cat.questions.length,
        answered: cat.questions.filter((_, i) => userAnswers[`${key}-${i}`] !== undefined).length,
        avg: sum / cat.questions.length
      };
    });

    let html = "<h3>Your Results</h3>";
    categoryKeys.forEach((key) => {
      const res = summary[key];
      html += `<p><b>${questions[key].title}</b> — Average Score: ${res.avg.toFixed(
        2
      )} (${res.answered}/${res.total} answered)</p>`;
    });

    resultsDiv.innerHTML = html;
    resultsDiv.classList.remove("hidden");

    // Hide test UI
    questionText.parentElement.style.display = "none";
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    skipBtn.style.display = "none";
    categoryTitle.textContent = "Results";
    progressBar.style.width = "100%";
  }

  // Initialize
  renderQuestion();
});
