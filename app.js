// ===================== app.js =====================

// Current category index and user answers
let currentCategoryIndex = 0;
let answers = {
  Emotional: [],
  Growth: [],
  Resilience: [],
  Overthinking: []
};

// Categories in order
const categories = ["Emotional", "Growth", "Resilience", "Overthinking"];

// Load questions from questions.js
// Assume questions.js exports: const questions = [ {category, question, options, reverse}, ... ];

const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("next-btn");
const reportContainer = document.getElementById("report-container");

// ===================== Load Question =====================
function loadQuestion(categoryIndex, questionIndex) {
  const category = categories[categoryIndex];
  const categoryQuestions = questions.filter(q => q.category === category);
  const q = categoryQuestions[questionIndex];

  if (!q) return;

  let html = `<h3>${q.question.en}</h3>`;
  q.options.forEach((opt, idx) => {
    html += `
      <div>
        <input type="radio" name="option" id="opt${idx}" value="${opt.value}">
        <label for="opt${idx}">${opt.text.en}</label>
      </div>`;
  });

  questionContainer.innerHTML = html;
}

// ===================== Save Answer =====================
function saveAnswer(categoryIndex, questionIndex) {
  const category = categories[categoryIndex];
  const categoryQuestions = questions.filter(q => q.category === category);
  const q = categoryQuestions[questionIndex];
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) return false;

  const val = parseInt(selected.value);
  // Apply reverse scoring if needed
  const score = q.reverse ? 6 - val : val;
  answers[category].push(score);
  return true;
}

// ===================== Calculate Score & Level =====================
function calculateLevel(category) {
  const totalScore = answers[category].reduce((a,b) => a + b, 0);
  const maxScore = 15 * 5; // 15 questions max 5 points
  const levelRanges = [
    {level:1, max: Math.floor(maxScore*0.2)},  // 0-15
    {level:2, max: Math.floor(maxScore*0.4)},  // 16-30
    {level:3, max: Math.floor(maxScore*0.6)},  // 31-45
    {level:4, max: Math.floor(maxScore*0.8)},  // 46-60
    {level:5, max: Math.floor(maxScore*0.93)}, // 61-70
    {level:6, max: maxScore}                    // 71-75
  ];

  const levelObj = levelRanges.find(lr => totalScore <= lr.max);
  return levelObj.level;
}

// ===================== Load Report MD =====================
function loadReport(category, level) {
  const path = `Reports/${category}/level${level}.md`;
  fetch(path)
    .then(res => res.text())
    .then(md => {
      // Simple Markdown render (basic)
      reportContainer.innerHTML += `<h2>${category} Report</h2><p>${md.replace(/\n/g,'<br>')}</p>`;
    });
}

// ===================== Next Button Handler =====================
let currentQuestionIndex = 0;

nextBtn.addEventListener("click", () => {
  if (!saveAnswer(currentCategoryIndex, currentQuestionIndex)) {
    alert("Please select an option!");
    return;
  }

  currentQuestionIndex++;
  const category = categories[currentCategoryIndex];
  const categoryQuestions = questions.filter(q => q.category === category);

  if (currentQuestionIndex < categoryQuestions.length) {
    loadQuestion(currentCategoryIndex, currentQuestionIndex);
  } else {
    // Category complete
    const level = calculateLevel(category);
    loadReport(category, level);

    // Move to next category
    currentCategoryIndex++;
    currentQuestionIndex = 0;

    if (currentCategoryIndex < categories.length) {
      loadQuestion(currentCategoryIndex, currentQuestionIndex);
    } else {
      // All categories done
      questionContainer.innerHTML = "<h2>Evaluation Complete!</h2>";
      nextBtn.style.display = "none";
    }
  }
});

// ===================== Initialize =====================
loadQuestion(currentCategoryIndex, currentQuestionIndex);
