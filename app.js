// Global Variables
let categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategory = 0;
let currentQuestion = 0;
let answers = [];
let blockTimes = [0, 0, 0, 0]; // Timer for each block
let selectedLang = "en"; // Default language

// Timer variables
let blockStartTime = null;

// Reference to HTML elements
const questionBox = document.getElementById("question-box");
const questionText = document.getElementById("question-text");
const slider = document.getElementById("response-slider");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const langSelect = document.getElementById("lang-select");
// Change question language dynamically
langSelect.addEventListener("change", (e) => {
  selectedLang = e.target.value;
  loadQuestion();
});
function loadQuestion() {
  const cat = categories[currentCategory];
  const questionList = reportsData[cat].questions;
  const question = questionList[currentQuestion][selectedLang]; // Use selected language

  // Start timer for block if first question
  if (currentQuestion === 0 && blockStartTime === null) {
    blockStartTime = new Date().getTime();
  }

  questionText.innerText = question;

  // Reset slider
  slider.value = 3;

  // Update progress bar
  const progressPercent = (currentQuestion / questionList.length) * 100;
  progressBar.style.width = progressPercent + "%";
}
nextBtn.addEventListener("click", () => {
  const cat = categories[currentCategory];
  const questionList = reportsData[cat].questions;

  // Store answer
  answers.push({
    category: cat,
    questionIndex: currentQuestion,
    value: slider.value
  });

  currentQuestion++;

  if (currentQuestion >= questionList.length) {
    // End of block, record time
    const now = new Date().getTime();
    blockTimes[currentCategory] = Math.round((now - blockStartTime) / 1000); // in seconds
    blockStartTime = null; // reset for next block

    currentCategory++;
    currentQuestion = 0;

    if (currentCategory >= categories.length) {
      showResults();
      return;
    }
  }

  loadQuestion();
});
function showResults() {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  categories.forEach((cat, index) => {
    const totalScore = answers
      .filter(a => a.category === cat)
      .reduce((sum, a) => sum + parseInt(a.value), 0);

    const questionCount = reportsData[cat].questions.length;
    const avgScore = totalScore / questionCount;

    // Determine report level (1-6)
    let level;
    if (avgScore <= 1.5) level = "level1";
    else if (avgScore <= 2.5) level = "level2";
    else if (avgScore <= 3.5) level = "level3";
    else if (avgScore <= 4.5) level = "level4";
    else if (avgScore <= 5.5) level = "level5";
    else level = "level6";

    const reportText = reportsData[cat].reports[level];

    // Display results
    const blockDiv = document.createElement("div");
    blockDiv.classList.add("result-block");
    blockDiv.innerHTML = `
      <h3>${reportsData[cat].title}</h3>
      <p><strong>Block Time:</strong> ${blockTimes[index]} seconds</p>
      <p>${reportText}</p>
    `;
    resultsContainer.appendChild(blockDiv);
  });

  // Hide question box and show results
  questionBox.style.display = "none";
  resultsContainer.style.display = "block";
}
// Start first question on page load
window.onload = () => {
  loadQuestion();
};
