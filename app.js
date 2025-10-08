

document.addEventListener("DOMContentLoaded", () => {
  const categoryTitle = document.getElementById("category-title");
  const questionText = document.getElementById("question-text");
  const responseSlider = document.getElementById("response-slider");
  const progressBar = document.getElementById("progress-bar");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const skipBtn = document.getElementById("skip-btn");
  const resultsDiv = document.getElementById("results");
  const userNameInput = document.getElementById("user-name");
  const langSelect = document.getElementById("lang-select");

  // Import questions
  import("./questions.js")
    .then((module) => {
      const questions = module.questions;
      let currentCategoryIndex = 0;
      let currentQuestionIndex = 0;
      let userAnswers = {}; // {"catIndex-qIndex": value}

      loadCategory(currentCategoryIndex);
      updateProgress();

      // === LOAD CATEGORY ===
      function loadCategory(catIndex) {
        const category = questions[catIndex];
        if (!category) return;
        categoryTitle.textContent = category.title;
        currentQuestionIndex = 0;
        renderQuestion();
        updateButtons();
      }

      // === RENDER QUESTION ===
      function renderQuestion() {
        const category = questions[currentCategoryIndex];
        const questionObj = category.questions[currentQuestionIndex];
        if (!questionObj) return;

        const lang = langSelect.value || "en";
        questionText.textContent = questionObj[lang];

        const key = getKey();
        responseSlider.value = userAnswers[key] !== undefined ? userAnswers[key] : 3;

        updateProgress();
      }

      function getKey() {
        return `${currentCategoryIndex}-${currentQuestionIndex}`;
      }

      function saveAnswer() {
        const key = getKey();
        userAnswers[key] = parseInt(responseSlider.value);
      }

      function updateButtons() {
        prevBtn.style.display =
          currentQuestionIndex === 0 && currentCategoryIndex === 0
            ? "none"
            : "inline-block";

        nextBtn.textContent =
          currentCategoryIndex === questions.length - 1 &&
          currentQuestionIndex === questions[currentCategoryIndex].questions.length - 1
            ? "Finish"
            : "Next";
      }

      function updateProgress() {
        const totalQuestions = questions.reduce(
          (sum, cat) => sum + cat.questions.length,
          0
        );
        const completedQuestions = Object.keys(userAnswers).length +
          currentQuestionIndex; // optional progressive bar
        const percent =
          ((currentCategoryIndex * 15 + currentQuestionIndex + 1) / totalQuestions) *
          100;
        progressBar.style.width = `${percent}%`;
      }

      // === NAVIGATION ===
      nextBtn.addEventListener("click", () => {
        saveAnswer();
        const category = questions[currentCategoryIndex];
        if (currentQuestionIndex < category.questions.length - 1) {
          currentQuestionIndex++;
        } else if (currentCategoryIndex < questions.length - 1) {
          currentCategoryIndex++;
          currentQuestionIndex = 0;
        } else {
          showResults();
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
            questions[currentCategoryIndex].questions.length - 1;
        }
        renderQuestion();
        updateButtons();
      });

      skipBtn.addEventListener("click", () => {
        if (currentCategoryIndex < questions.length - 1) {
          currentCategoryIndex++;
          currentQuestionIndex = 0;
          renderQuestion();
        } else {
          showResults();
        }
      });

      // === LANGUAGE CHANGE ===
      langSelect.addEventListener("change", renderQuestion);

      // === SHOW RESULTS & LOAD REPORTS ===
      async function showResults() {
        saveAnswer();
        document.getElementById("question-box").style.display = "none";
        document.querySelector(".slider-container").style.display = "none";
        document.querySelector(".controls").style.display = "none";
        categoryTitle.textContent = `Results for ${userNameInput.value || "User"}`;

        let html = "";
        for (let catIndex = 0; catIndex < questions.length; catIndex++) {
          const cat = questions[catIndex];
          const total = cat.questions.length;
          let sum = 0;

          cat.questions.forEach((_, qIndex) => {
            const key = `${catIndex}-${qIndex}`;
            sum += userAnswers[key] || 0;
          });

          const avg = Math.round(sum / total);
          html += `<h3>${cat.title}</h3>`;
          html += `<p>Average score: ${avg} / 6</p>`;

          // Load report from Markdown
          try {
            const response = await fetch(`./reports/${cat.title.toLowerCase()}/level${avg}.md`);
            if (!response.ok) throw new Error("Report not found");
            const reportText = await response.text();
            html += `<div class="report">${reportText}</div>`;
          } catch (err) {
            html += `<p style="color:red;">Report unavailable.</p>`;
            console.error(err);
          }
        }

        resultsDiv.innerHTML = html;
        resultsDiv.classList.remove("hidden");
      }
    })
    .catch((err) => console.error("Error loading questions:", err));
});
