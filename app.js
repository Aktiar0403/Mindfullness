import questionsData from "./questions.js";

document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById("category-select");
  const langSelect = document.getElementById("lang-select");
  const questionsContainer = document.getElementById("questions-container");
  const submitBtn = document.getElementById("submit-btn");
  const resultsContainer = document.getElementById("results-container");

  let currentCategory = "emotional";
  let currentLang = "en";

  // 🔹 Load questions initially
  loadQuestions();

  // 🔹 Event listeners for category/language change
  categorySelect.addEventListener("change", e => {
    currentCategory = e.target.value;
    loadQuestions();
  });

  langSelect.addEventListener("change", e => {
    currentLang = e.target.value;
    loadQuestions();
  });

  submitBtn.addEventListener("click", handleSubmit);

  // --------------------------
  // 🔹 Load Questions Function
  // --------------------------
  function loadQuestions() {
    const data = questionsData[currentCategory][currentLang];
    const { categoryTitle, questions } = data;

    document.getElementById("category-title").textContent = categoryTitle;
    questionsContainer.innerHTML = "";

    questions.forEach((q, i) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question-item";
      questionDiv.innerHTML = `
        <p class="question-text">${i + 1}. ${q}</p>
        <div class="options">
          <label><input type="radio" name="q${i}" value="1"> 1</label>
          <label><input type="radio" name="q${i}" value="2"> 2</label>
          <label><input type="radio" name="q${i}" value="3"> 3</label>
          <label><input type="radio" name="q${i}" value="4"> 4</label>
          <label><input type="radio" name="q${i}" value="5"> 5</label>
        </div>
      `;
      questionsContainer.appendChild(questionDiv);
    });

    resultsContainer.innerHTML = ""; // clear previous results
  }

  // --------------------------
  // 🔹 Handle Submit Function
  // --------------------------
  async function handleSubmit() {
    const data = questionsData[currentCategory][currentLang];
    const { questions } = data;
    let totalScore = 0;
    let answered = 0;

    for (let i = 0; i < questions.length; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected) {
        totalScore += parseInt(selected.value);
        answered++;
      }
    }

    if (answered < questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }

    const avgScore = totalScore / questions.length;
    const level = determineLevel(avgScore);

    displayResults(level, avgScore);
  }

  // --------------------------
  // 🔹 Determine Level (1–6)
  // --------------------------
  function determineLevel(score) {
    if (score <= 1.5) return 1;
    if (score <= 2.5) return 2;
    if (score <= 3.5) return 3;
    if (score <= 4.0) return 4;
    if (score <= 4.5) return 5;
    return 6;
  }

  // --------------------------
  // 🔹 Display Final Result
  // --------------------------
  async function displayResults(level, avgScore) {
    const reportPath = `reports/${currentCategory}/level${level}.md`;

    try {
      const response = await fetch(reportPath);
      if (!response.ok) throw new Error("Report not found");
      const markdown = await response.text();

      resultsContainer.innerHTML = `
        <h2>Final Results</h2>
        <p><strong>Category:</strong> ${questionsData[currentCategory][currentLang].categoryTitle}</p>
        <p><strong>Average Score:</strong> ${avgScore.toFixed(2)}</p>
        <p><strong>Level:</strong> ${level}</p>
        <div class="report-content">${marked.parse(markdown)}</div>
      `;
    } catch (err) {
      resultsContainer.innerHTML = `<p style="color:red;">Error loading report: ${err.message}</p>`;
    }
  }
});
