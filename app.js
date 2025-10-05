// ===================== GLOBAL VARIABLES =====================
let categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategory = 0;
let currentQuestion = 0;
let userName = "";
let selectedLang = "en";
let answers = [];
let blockStartTime = null;
let blockTimes = [0, 0, 0, 0];
let userScores = {};
let skippedCategories = {};

// ===================== ELEMENT REFERENCES =====================
const questionBox = document.getElementById("question-box");
const questionText = document.getElementById("question-text");
const slider = document.getElementById("response-slider");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const langSelect = document.getElementById("lang-select");
const resultsDiv = document.getElementById("results");

// ===================== LANGUAGE SELECTION =====================
langSelect.addEventListener("change", (e) => {
  selectedLang = e.target.value;
  loadQuestion();
});

// ===================== LOAD QUESTION =====================
function loadQuestion() {
  const catKey = categories[currentCategory];
  const categoryData = reportsData[catKey];
  const questionList = categoryData.questions;
  const question = questionList[currentQuestion][selectedLang];

  // Update title
  document.getElementById("category-title").innerText = categoryData.title;

  // Start block timer
  if (currentQuestion === 0) blockStartTime = new Date().getTime();

  questionText.innerText = question;
  slider.value = 3;

  const progressPercent = (currentQuestion / questionList.length) * 100;
  progressBar.style.width = progressPercent + "%";
}

// ===================== NEXT BUTTON =====================
nextBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("user-name");
  if (!userName) {
    if (nameInput.value.trim() === "") {
      alert("Please enter your name to proceed.");
      return;
    }
    userName = nameInput.value.trim();
  }

  const cat = categories[currentCategory];
  const questionList = reportsData[cat].questions;

  // Store answer
  answers.push({
    category: cat,
    questionIndex: currentQuestion,
    value: parseInt(slider.value),
  });

  currentQuestion++;

  // If last question of the block
  if (currentQuestion >= questionList.length) {
    const now = new Date().getTime();
    blockTimes[currentCategory] = Math.round((now - blockStartTime) / 1000);
    userScores[cat] = calculateCategoryScore(cat);
    blockStartTime = null;
    currentQuestion = 0;
    currentCategory++;

    if (currentCategory >= categories.length) {
      showResults();
      return;
    }
  }

  loadQuestion();
});

// ===================== CATEGORY SCORING =====================
function calculateCategoryScore(cat) {
  const catAnswers = answers.filter((a) => a.category === cat);
  if (catAnswers.length === 0) return 0;
  const total = catAnswers.reduce((sum, a) => sum + a.value, 0);
  return Math.round(total / catAnswers.length);
}

// ===================== LEVEL DETERMINATION =====================
function getLevelFromScore(score) {
  if (score <= 1.5) return "level1";
  if (score <= 2.5) return "level2";
  if (score <= 3.5) return "level3";
  if (score <= 4.5) return "level4";
  if (score <= 5.5) return "level5";
  return "level6";
}

// ===================== FETCH REPORT (Markdown) =====================
async function fetchReport(category, level) {
  try {
    const response = await fetch(`Reports/${category}/${level}.md`);
    if (!response.ok) throw new Error("Report not found");
    const text = await response.text();
    return text.replace(/\n/g, "<br>");
  } catch {
    return "Report not available.";
  }
}

// ===================== CUSTOM MODAL FUNCTION =====================
function showModal(title, message, confirmCallback) {
  const modal = document.getElementById("confirmModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const confirmBtn = document.getElementById("confirmModalBtn");
  const cancelBtn = document.getElementById("cancelModal");

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.remove("hidden");

  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    confirmCallback();
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

// ===================== SKIP CATEGORY =====================
function confirmSkipCategory() {
  const catKey = categories[currentCategory];
  const catName = reportsData[catKey].title;

  showModal(
    "Skip This Category?",
    `You’re about to skip "${catName}". No worries if you’re short on time — but do try again later to get full insights 🌱`,
    () => {
      skippedCategories[catKey] = true;
      currentCategory++;
      currentQuestion = 0;

      if (currentCategory >= categories.length) {
        showResults();
      } else {
        loadQuestion();
      }
    }
  );
}

// ===================== EXIT TEST =====================
function confirmExitTest() {
  showModal(
    "Exit the Test?",
    "Not an issue if you don’t have time now! 🌱 But make sure to give the test later — it’s designed to help you understand yourself better. Of course, scrolling endless reels or passing time on social media can wait 😉",
    () => showResults()
  );
}

// ===================== SHOW RESULTS =====================
async function showResults() {
  resultsDiv.innerHTML = "";

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const allAnswered = Object.keys(userScores).length > 0 &&
    Object.keys(userScores).length === categories.length &&
    !Object.keys(skippedCategories).length;

  if (!allAnswered) {
    resultsDiv.innerHTML = `
      <h2>Test Incomplete</h2>
      <p>Looks like you didn’t complete the full test — and that’s completely okay 😊</p>
      <p>Whenever you find a calm, distraction-free moment, try taking it again. 
      It’s designed to help <strong>you</strong> reflect, grow, and understand yourself better — emotionally, mentally, and behaviorally.</p>
      <p>Instead of endlessly scrolling or passing time on social media, 
      invest a few minutes in knowing yourself. It’s one of the best investments 🌱</p>
      <p>Wishing you calmness, clarity, and self-growth ahead ✨</p>

      <div class="result-footer">
        <hr>
        <p><strong>Viewed on:</strong> ${date} at ${time}</p>
        <p><strong>Privacy Note:</strong> No data is stored — only you can see your responses.</p>
      </div>
    `;
    return;
  }

  resultsDiv.innerHTML = `<h2>Your Complete Personality Insight Report</h2>`;

  for (const cat of categories) {
    const score = userScores[cat];
    const level = getLevelFromScore(score);
    const reportText = await fetchReport(cat, level);

    resultsDiv.innerHTML += `
      <div class="category-report">
        <h3>${reportsData[cat].title}</h3>
        <p>${reportText}</p>
        <p><strong>Your Score:</strong> ${score}</p>
        <p><strong>Level:</strong> ${level}</p>
        <hr>
      </div>
    `;
  }

  resultsDiv.innerHTML += `
    <div class="result-footer">
      <p><strong>Completed on:</strong> ${date} at ${time}</p>
      <p><strong>Privacy Note:</strong> Your data is not stored or shared — this report is visible only to you.</p>
    </div>
  `;
}

// ===================== PAGE LOAD =====================
window.onload = () => {
  loadQuestion();
};
