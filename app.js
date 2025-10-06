// === Global Variables ===
let categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategory = 0;
let currentQuestion = 0;
let userName = "";
let selectedLang = "en";
let answers = [];
let blockStartTime = null;
let blockTimes = [0, 0, 0, 0];
let skippedCategories = {};
let userScores = {}; // assuming you calculate these later

// === HTML References ===
const questionText = document.getElementById("question-text");
const slider = document.getElementById("response-slider");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const langSelect = document.getElementById("lang-select");
const skipBtn = document.getElementById("skip-btn");
const exitBtn = document.getElementById("exit-btn");

// === Load Question Function ===
function loadQuestion() {
  const cat = categories[currentCategory];
  const questionList = reportsData[cat].questions;
  const question = questionList[currentQuestion][selectedLang];

  document.getElementById("category-title").innerText = reportsData[cat].title;

  if (currentQuestion === 0 && blockStartTime === null) {
    blockStartTime = new Date().getTime();
  }

  questionText.innerText = question;
  slider.value = 3;

  const progressPercent = (currentQuestion / questionList.length) * 100;
  progressBar.style.width = progressPercent + "%";
}

// === Next Question Handler ===
nextBtn.addEventListener("click", () => {
  if (!userName) {
    const nameInput = document.getElementById("user-name");
    if (nameInput.value.trim() === "") {
      alert("Please enter your name to proceed.");
      return;
    }
    userName = nameInput.value.trim();
  }

  const cat = categories[currentCategory];
  const questionList = reportsData[cat].questions;

  answers.push({
    category: cat,
    questionIndex: currentQuestion,
    value: slider.value,
  });

  currentQuestion++;

  if (currentQuestion >= questionList.length) {
    const now = new Date().getTime();
    blockTimes[currentCategory] = Math.round((now - blockStartTime) / 1000);
    blockStartTime = null;

    currentCategory++;
    currentQuestion = 0;

    if (currentCategory >= categories.length) {
      showResults();
      return;
    }
  }

  loadQuestion();
});

// === Language Change Handler ===
langSelect.addEventListener("change", (e) => {
  selectedLang = e.target.value;
  loadQuestion();
});

// === Skip Category Handler ===
skipBtn.addEventListener("click", () => {
  const catName = reportsData[categories[currentCategory]].title;

  showModal(
    "Skip This Category?",
    `Not a problem if you don’t have time now for “${catName}”. 🌱 
But make sure to take the test later to understand yourself better.
Instead of scrolling endless reels or passing time on social media — invest in knowing yourself better.`,
    () => {
      const cat = categories[currentCategory];
      skippedCategories[cat] = `
        You avoided this category: ${catName}. 
        We recommend taking this test later in full focus when you have time.
        Remember, it’s only for your benefit and growth.
      `;

      currentCategory++;
      currentQuestion = 0;
      blockStartTime = null;

      if (currentCategory >= categories.length) {
        showResults();
      } else {
        loadQuestion();
      }
    }
  );
});

// === Exit Test Handler ===
exitBtn.addEventListener("click", () => {
  showModal(
    "Exit the Test?",
    `Not an issue if you don’t have time now! 🌱 
But make sure to give the test later — it’s designed to help you understand yourself better.
Of course, scrolling endless reels or passing time on social media can wait 😉`,
    () => {
      showResults();
    }
  );
});

// === Show Results ===
function showResults() {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString();

  const allCategories = Object.keys(reportsData);
  const answeredCategories = Object.keys(userScores);
  const isComplete =
    answeredCategories.length === allCategories.length &&
    allCategories.every(
      (cat) => userScores[cat] !== null && userScores[cat] !== undefined
    );

  if (!isComplete) {
    resultsDiv.innerHTML = `
      <h2>Test Incomplete</h2>
      <p>Looks like you didn’t complete the full test — and that’s completely okay 😊</p>
      <p>Whenever you find a calm, distraction-free moment, try taking the test in full. 
      It’s designed to help <strong>you</strong> reflect, grow, and understand yourself better — emotionally, mentally, and behaviorally.</p>
      <p>Instead of endlessly scrolling or passing time on social media, investing a few minutes in knowing yourself can open powerful insights 🌱</p>
      <p>Remember, self-awareness is the first step toward personal mastery.</p>
      <p>Wishing you calmness, clarity, and self-growth ahead ✨</p>
      <div class="result-footer">
        <hr>
        <p><strong>Viewed on:</strong> ${formattedDate} at ${formattedTime}</p>
        <p><strong>Privacy Note:</strong> No data is stored — only you can see your responses.</p>
      </div>
    `;
    return;
  }

  resultsDiv.innerHTML = `<h2>Your Complete Personality Insight Report</h2>`;

  for (const category in userScores) {
    const score = userScores[category];
    const level = getLevelFromScore(score);
    const report = reportsData[category]?.[level] || "Report not available.";

    resultsDiv.innerHTML += `
      <div class="category-report">
        <h3>${category}</h3>
        <p>${report}</p>
        <p><strong>Your Score:</strong> ${score}</p>
        <p><strong>Level:</strong> ${level}</p>
        <hr>
      </div>
    `;
  }

  resultsDiv.innerHTML += `
    <div class="result-footer">
      <p><strong>Completed on:</strong> ${formattedDate} at ${formattedTime}</p>
      <p><strong>Privacy Note:</strong> Your data is not stored or shared — this report is visible only to you.</p>
    </div>
  `;
}

// === Modal System ===
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
// =============================
// INTRO SCREEN LOGIC
// =============================
document.getElementById("start-test-btn").addEventListener("click", function () {
  const intro = document.getElementById("intro-screen");
  const app = document.getElementById("app-container");

  intro.classList.add("fade-out");
  setTimeout(() => {
    intro.style.display = "none";
    app.classList.remove("hidden");
  }, 800);
});

// Optional smooth fade-out animation
const style = document.createElement('style');
style.innerHTML = `
.fade-out {
  animation: fadeOut 0.8s forwards;
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}`;
document.head.appendChild(style);

// === Initialize ===
window.onload = () => {
  loadQuestion();
};
