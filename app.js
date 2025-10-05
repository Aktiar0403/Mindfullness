// Global Variables
let categories = ["emotional", "growth", "overthinking", "resilience"];
let currentCategory = 0;
let userName = "";
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
  const question = questionList[currentQuestion][selectedLang];

  // Update category title
  document.getElementById("category-title").innerText = reportsData[cat].title;

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
  if (!userName) {
    const nameInput = document.getElementById("user-name");
    if (nameInput.value.trim() === "") {
      alert("Please enter your name to proceed.");
      return;
    }
    userName = nameInput.value.trim();
  }

  document.getElementById("skip-btn").addEventListener("click", () => {
  const now = new Date().getTime();

  // Record time for the block if any question answered
  if (blockStartTime !== null) {
    blockTimes[currentCategory] = Math.round((now - blockStartTime) / 1000);
  }

  // Move to next category
  currentCategory++;
  currentQuestion = 0;
  blockStartTime = null;

  if (currentCategory >= categories.length) {
    showResults();
    return;
  }

  loadQuestion();
});
// Friendly confirmation popup function
function showFriendlyConfirm(message, callbackYes) {
  const proceed = confirm(message); // Replace later with custom modal if desired
  if (proceed) callbackYes();
}

// Skip Category
document.getElementById("skip-btn").addEventListener("click", () => {
  const catName = reportsData[categories[currentCategory]].title;
  const message = `Not a problem if you don't have time now for "${catName}". 
But make sure to take the test later to understand yourself better. 
Instead of scrolling endless reels and passing time on social media, hope for the best!`;

  showFriendlyConfirm(message, () => {
    const now = new Date().getTime();

    if (blockStartTime !== null) {
      blockTimes[currentCategory] = Math.round((now - blockStartTime) / 1000);
    }

    const cat = categories[currentCategory];
    skippedCategories[cat] = `
      You avoided this category: ${catName}. 
      We recommend taking this test later in full focus when you have time. 
      Remember, it is only for your benefit and self-improvement.
    `;

    currentCategory++;
    currentQuestion = 0;
    blockStartTime = null;

    if (currentCategory >= categories.length) {
      showResults();
      return;
    }

    loadQuestion();
  });
});

// Exit Test
document.getElementById("exit-btn").addEventListener("click", () => {
  const message = `Not a problem if you don't have time now to finish the test. 
Make sure to complete it later to understand yourself better. 
Instead of scrolling endless reels and passing time on social media, hope for the best!`;

  showFriendlyConfirm(message, () => {
    const now = new Date().getTime();

    if (blockStartTime !== null) {
      blockTimes[currentCategory] = Math.round((now - blockStartTime) / 1000);
    }

    showResults();
  });
});


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
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    // Check if all categories are answered
    const allCategories = Object.keys(reportsData);
    const answeredCategories = Object.keys(userScores);
    const isComplete = answeredCategories.length === allCategories.length && allCategories.every(cat => userScores[cat] !== null && userScores[cat] !== undefined);

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    // ✅ Case 1: Incomplete or skipped test
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

    // ✅ Case 2: Full test completed – show detailed personalized results
    resultsDiv.innerHTML = `<h2>Your Complete Personality Insight Report</h2>`;

    for (const category in userScores) {
        const score = userScores[category];
        const level = getLevelFromScore(score); // same function you used earlier
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

function confirmExitTest() {
    const confirmExit = confirm(
        "Not an issue if you don’t have time now!\n\n" +
        "But make sure to give the test later — it’s designed to help you understand yourself better.\n\n" +
        "Of course, scrolling endless reels or passing time on social media can wait 😉\n\n" +
        "Would you like to exit the test now?"
    );

    if (confirmExit) {
        // Mark test as incomplete and show motivational result
        showResults();
    }
}
function confirmSkipCategory(currentCategory) {
    const confirmSkip = confirm(
        `You’re about to skip the category "${currentCategory}".\n\n` +
        "No worries if you’re short on time — but make sure to revisit this category later.\n" +
        "Understanding your full self helps you grow better 🌱"
    );

    if (confirmSkip) {
        userScores[currentCategory] = "Skipped";
        nextCategory();
    }
}


async function fetchReport(category, level) {
  try {
    const response = await fetch(`Reports/${category}/${level}.md`);
    if (!response.ok) throw new Error("Report not found");
    const text = await response.text();

    // Optional: convert Markdown to HTML (using marked.js)
    // return marked(text);

    return text.replace(/\n/g, "<br>"); // simple line breaks if not using marked.js
  } catch (err) {
    console.error(err);
    return "Report not available.";
  }
}
// === Custom Modal Functions ===
function showModal(title, message, confirmCallback) {
  const modal = document.getElementById("confirmModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const confirmBtn = document.getElementById("confirmModalBtn");
  const cancelBtn = document.getElementById("cancelModal");

  modalTitle.textContent = title;
  modalMessage.textContent = message;

  modal.classList.remove("hidden");

  // Remove previous listeners to avoid stacking
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

// === Replace old confirm functions ===
function confirmExitTest() {
  showModal(
    "Exit the Test?",
    "Not an issue if you don’t have time now! 🌱 But make sure to give the test later — it’s designed to help you understand yourself better. Of course, scrolling endless reels or passing time on social media can wait 😉",
    () => showResults()
  );
}

function confirmSkipCategory(currentCategory) {
  showModal(
    "Skip This Category?",
    `You’re about to skip the category "${currentCategory}".\n\nNo worries if you’re short on time — but make sure to revisit this later. Understanding your full self helps you grow better 🌱`,
    () => {
      userScores[currentCategory] = "Skipped";
      nextCategory();
    }
  );
}


// Start first question on page load
window.onload = () => {
  loadQuestion();
};
