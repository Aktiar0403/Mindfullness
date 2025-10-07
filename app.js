// ==========================
// Self Insight Test App
// ==========================

import { questionsData } from './questions.js'; // renamed from reports.js

// --- DOM Elements ---
const introScreen = document.getElementById('intro-screen');
const appContainer = document.getElementById('app-container');
const startBtn = document.getElementById('start-test-btn');

const userNameInput = document.getElementById('user-name');
const langSelect = document.getElementById('lang-select');

const categoryTitle = document.getElementById('category-title');
const questionText = document.getElementById('question-text');
const responseSlider = document.getElementById('response-slider');

const progressBar = document.getElementById('progress-bar');

const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');
const exitBtn = document.getElementById('exit-btn');

const resultsDiv = document.getElementById('results');

const confirmModal = document.getElementById('confirmModal');
const cancelModal = document.getElementById('cancelModal');
const confirmModalBtn = document.getElementById('confirmModalBtn');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

// --- App State ---
let categories = Object.keys(questionsData); // ['emotional','growth','overthinking','resilience']
let currentCategoryIndex = 0;
let currentQuestionIndex = 0;
let userResponses = {}; // { emotional: [1,4,3...], growth: [2,6,...] }
let currentLang = 'en';

// --- Start Test ---
startBtn.addEventListener('click', () => {
  introScreen.style.display = 'none';
  appContainer.classList.remove('hidden');
  loadCategory();
});

// --- Language Change ---
langSelect.addEventListener('change', e => {
  currentLang = e.target.value;
  loadQuestion();
});

// --- Load Category ---
function loadCategory() {
  currentQuestionIndex = 0;
  const catKey = categories[currentCategoryIndex];
  categoryTitle.textContent = questionsData[catKey].title;
  userResponses[catKey] = [];
  loadQuestion();
  updateProgress();
}

// --- Load Question ---
function loadQuestion() {
  const catKey = categories[currentCategoryIndex];
  const questionObj = questionsData[catKey].questions[currentQuestionIndex];
  if (!questionObj) return;
  questionText.textContent = questionObj[currentLang];
  responseSlider.value = 3; // default middle
}

// --- Update Progress Bar ---
function updateProgress() {
  const catKey = categories[currentCategoryIndex];
  const totalQ = questionsData[catKey].questions.length;
  const progressPercent = ((currentQuestionIndex) / totalQ) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

// --- Next Question ---
nextBtn.addEventListener('click', () => {
  saveResponse();
  const catKey = categories[currentCategoryIndex];
  if (currentQuestionIndex < questionsData[catKey].questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
    updateProgress();
  } else {
    // Category finished
    currentCategoryIndex++;
    if (currentCategoryIndex < categories.length) {
      loadCategory();
    } else {
      showResults();
    }
  }
});

// --- Skip Category ---
skipBtn.addEventListener('click', () => {
  currentCategoryIndex++;
  if (currentCategoryIndex < categories.length) {
    loadCategory();
  } else {
    showResults();
  }
});

// --- End Test / Exit ---
exitBtn.addEventListener('click', () => {
  showModal('Exit Test', 'Are you sure you want to end the test? Your current answers will be saved and results calculated.', () => {
    showResults();
    closeModal();
  });
});

// --- Save Response ---
function saveResponse() {
  const catKey = categories[currentCategoryIndex];
  userResponses[catKey].push(Number(responseSlider.value));
}

// --- Show Modal ---
function showModal(title, message, confirmCallback) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  confirmModal.classList.remove('hidden');
  confirmModalBtn.onclick = confirmCallback;
}
cancelModal.addEventListener('click', closeModal);
function closeModal() {
  confirmModal.classList.add('hidden');
}

// --- Show Results ---
async function showResults() {
  appContainer.style.display = 'none';
  resultsDiv.classList.remove('hidden');
  resultsDiv.innerHTML = `<h2>Hi ${userNameInput.value || ''}, Your Insight Report</h2>`;
  
  for (const catKey of categories) {
    const scores = userResponses[catKey] || [];
    const avgScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    const level = Math.min(Math.max(avgScore,1),6); // clamp 1-6
    
    // Fetch report .md file
    const mdPath = `reports/${catKey}/level${level}.md`;
    let reportContent = `No report found for ${catKey} level ${level}`;
    try {
      const res = await fetch(mdPath);
      if (res.ok) {
        reportContent = await res.text();
      }
    } catch(err) {
      console.error(err);
    }

    resultsDiv.innerHTML += `
      <div class="category-result">
        <h3>${questionsData[catKey].title} (Level ${level})</h3>
        <pre>${reportContent}</pre>
      </div>
    `;
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
