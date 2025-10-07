// app.js

let currentCategory = "emotional"; // default category
let currentLang = "en"; // en, hi, bn
let currentQuestionIndex = 0;
let answers = {
  emotional: [],
  growth: [],
  overthinking: [],
  resilience: []
};

// UI Elements
const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const endBtn = document.getElementById("end-btn");
const resultDiv = document.getElementById("result");
const categorySelect = document.getElementById("category-select");
const langSelect = document.getElementById("lang-select");
const answerInput = document.getElementById("answer-input");

// Initialize
function loadQuestion() {
  const category = questionsData[currentCategory];
  const question = category.questions[currentQuestionIndex];

  questionTitle.textContent = `${category.title} (${currentQuestionIndex + 1}/${category.questions.length})`;
  questionText.textContent = question[currentLang];

  // Pre-fill previous answer if exists
  answerInput.value = answers[currentCategory][currentQuestionIndex] || "";
}

// Next question
nextBtn.addEventListener("click", () => {
  const answer = answerInput.value.trim();
  answers[currentCategory][currentQuestionIndex] = answer;

  if (currentQuestionIndex < questionsData[currentCategory].questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    alert("This is the last question. Click 'End Test' to see results.");
  }
});

// Previous question
prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    answers[currentCategory][currentQuestionIndex] = answerInput.value.trim();
    currentQuestionIndex--;
    loadQuestion();
  }
});

// End Test
endBtn.addEventListener("click", () => {
  answers[currentCategory][currentQuestionIndex] = answerInput.value.trim();
  showResults(currentCategory);
});

// Category change
categorySelect.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  currentQuestionIndex = 0;
  loadQuestion();
  resultDiv.innerHTML = "";
});

// Language change
langSelect.addEventListener("change", (e) => {
  currentLang = e.target.value;
  loadQuestion();
});

// Simple result calculation
function showResults(category) {
  const allAnswers = answers[category];
  let score = 0;

  allAnswers.forEach(ans => {
    if (ans && ans.length > 0) score++;
  });

  const total = questionsData[category].questions.length;
  const percentage = Math.round((score / total) * 100);

  let levelText = "";
  if (percentage <= 16) levelText = "Level 1";
  else if (percentage <= 33) levelText = "Level 2";
  else if (percentage <= 50) levelText = "Level 3";
  else if (percentage <= 66) levelText = "Level 4";
  else if (percentage <= 83) levelText = "Level 5";
  else levelText = "Level 6";

  resultDiv.innerHTML = `
    <h3>${questionsData[category].title} Results</h3>
    <p>Answered ${score} out of ${total} questions.</p>
    <p>Score: ${percentage}%</p>
    <p>${levelText}</p>
  `;
}

// Initialize first question
loadQuestion();
