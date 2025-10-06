// ==========================
// Global Variables
// ==========================
const categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategory = 0;
let currentQuestion = 0;
let userName = "";
let answers = []; // {category, questionIndex, value}
let blockStartTime = null;
let blockTimes = {}; // seconds spent per category
let skippedCategories = {};
let selectedLang = "en";

// ==========================
// DOM References
// ==========================
const introScreen = document.getElementById("intro-screen");
const startBtn = document.getElementById("start-test-btn");
const appContainer = document.getElementById("app-container");

const userNameInput = document.getElementById("user-name");
const langSelect = document.getElementById("lang-select");
const categoryTitle = document.getElementById("category-title");
const questionText = document.getElementById("question-text");
const slider = document.getElementById("response-slider");
const progressBar = document.getElementById("progress-bar");

const nextBtn = document.getElementById("next-btn");
const skipBtn = document.getElementById("skip-btn");
const exitBtn = document.getElementById("exit-btn");

const resultsDiv = document.getElementById("results");

// Modal references
const confirmModal = document.getElementById("confirmModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const confirmModalBtn = document.getElementById("confirmModalBtn");
const cancelModal = document.getElementById("cancelModal");

// ==========================
// Start Test
// ==========================
startBtn.addEventListener("click", () => {
  const name = userNameInput.value.trim();
  if (!name) {
    alert("Please enter your name to start the test.");
    return;
  }
  userName = name;

  introScreen.classList.add("fade-out");
  setTimeout(() => {
    introScreen.style.display = "none";
    appContainer.classList.remove("hidden");
    startCategory();
  }, 400);
});

// ==========================
// Language Selection
// ==========================
langSelect.addEventListener("change", (e) => {
  selectedLang = e.target.value;
  loadQuestion();
});

// ==========================
// Load Current Question
// ==========================
function loadQuestion() {
  const category = categories[currentCategory];
  const questionsFile = `questions/${category}.json`; // optional, or your source

  fetch(questionsFile)
    .then((res) => res.json())
    .then((data) => {
      const questionList = data.questions;
      const questionObj = questionList[currentQuestion];
      questionText.innerText = questionObj[selectedLang];

      // Update category title
      categoryTitle.innerText = data.title;

      // Start timer for block
      if (currentQuestion === 0 && !blockStartTime) {
        blockStartTime = Date.now();
      }

      // Update progress bar
      progressBar.style.width = `${((currentQuestion + 1) / questionList.length) * 100}%`;
    })
    .catch((err) => {
      console.error("Error loading questions:", err);
      questionText.innerText = "Error loading question.";
    });
}

// ==========================
// Next Button
// ==========================
nextBtn.addEventListener("click", () => {
  saveAnswer();
  moveNext();
});

function saveAnswer() {
  const category = categories[currentCategory];
  answers.push({
    category,
    questionIndex: currentQuestion,
    value: parseInt(slider.value),
  });
}

// Move to next question or category
function moveNext() {
  const category = categories[currentCategory];
  const questionsFile = `questions/${category}.json`;

  fetch(questionsFile)
    .then((res) => res.json())
    .then((data) => {
      const questionList = data.questions;
      currentQuestion++;
      if (currentQuestion >= questionList.length) {
        // End of category
        const now = Date.now();
        blockTimes[category] = Math.round((now - blockStartTime) / 1000);
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
}

// ==========================
// Skip Category
// ==========================
skipBtn.addEventListener("click", () => {
  const category = categories[currentCategory];
  showModal(
    "Skip Category?",
    `You are about to skip "${category}". You can complete it later.`,
    () => {
      skippedCategories[category] = true;
      currentCategory++;
      currentQuestion = 0;
      blockStartTime = null;

      if (currentCategory >= categories.length) {
        showResults();
        return;
      }
      loadQuestion();
    }
  );
});

// ==========================
// Exit Test
// ==========================
exitBtn.addEventListener("click", () => {
  showModal(
    "Exit Test?",
    "Do you want to exit now? You can complete the test later.",
    () => {
      showResults();
    }
  );
});

// ==========================
// Modal Functions
// ==========================
function showModal(title, message, confirmCallback) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  confirmModal.classList.remove("hidden");

  const newConfirmBtn = confirmModalBtn.cloneNode(true);
  confirmModalBtn.parentNode.replaceChild(newConfirmBtn, confirmModalBtn);

  newConfirmBtn.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
    confirmCallback();
  });

  cancelModal.addEventListener("click", () => {
    confirmModal.classList.add("hidden");
  });
}

// ==========================
// Show Results
// ==========================
async function showResults() {
  appContainer.classList.add("hidden");
  resultsDiv.classList.remove("hidden");
  resultsDiv.innerHTML = `<h2>Hello ${userName}, here are your insights:</h2>`;

  for (const category of categories) {
    if (skippedCategories[category]) {
      resultsDiv.innerHTML += `<h3>${category} - Skipped</h3><p>You skipped this category. Consider completing it later.</p>`;
      continue;
    }

    // Calculate average score for category
    const catAnswers = answers.filter((a) => a.category === category);
    const avgScore = catAnswers.reduce((sum, a) => sum + a.value, 0) / catAnswers.length;

    // Determine level 1-6
    let level = Math.ceil(avgScore); // 1-6
    if (level < 1) level = 1;
    if (level > 6) level = 6;

    // Fetch corresponding .md report
    try {
      const res = await fetch(`reports/${category}/level${level}.md`);
      if (!res.ok) throw new Error("Report not found");
      const text = await res.text();
      resultsDiv.innerHTML += `<h3>${category}</h3><p>${text.replace(/\n/g, "<br>")}</p><p><strong>Score:</strong> ${avgScore.toFixed(1)} | <strong>Level:</strong> ${level}</p><hr>`;
    } catch (err) {
      resultsDiv.innerHTML += `<h3>${category}</h3><p>Report not available.</p>`;
    }
  }

  resultsDiv.innerHTML += `<p>⏱ Time spent per category: ${JSON.stringify(blockTimes)}</p>`;
}
