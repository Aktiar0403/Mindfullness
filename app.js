// app.js - Final integrated version for:
// - questions in reports.js (reportsData)
// - report files located at Reports/<category>/level1.md ... level6.md
// - HTML IDs must match your provided HTML (start-test-btn, app-container, question-text, response-slider, next-btn, skip-btn, exit-btn, results, etc.)

window.addEventListener("DOMContentLoaded", () => {
  // -----------------------
  // Config / State
  // -----------------------
  const categories = ["emotional", "growth", "overthinking", "resilience"];
  let currentCategoryIndex = 0;
  let currentQuestionIndex = 0;
  let userName = "";
  let selectedLang = "en";

  // answers stored as: { category: [val0,val1,...] } or skipped category flagged with skippedCategories[cat]=true
  const answersByCategory = {};
  const skippedCategories = {};
  const blockTimes = {}; // seconds per category
  let blockStart = null;

  // -----------------------
  // DOM refs (match your HTML)
  // -----------------------
  const startBtn = document.getElementById("start-test-btn");
  const introScreen = document.getElementById("intro-screen");
  const appContainer = document.getElementById("app-container");
  const nameInput = document.getElementById("user-name");

  const categoryTitleEl = document.getElementById("category-title");
  const questionTextEl = document.getElementById("question-text");
  const sliderEl = document.getElementById("response-slider");
  const progressBar = document.getElementById("progress-bar");

  const langSelect = document.getElementById("lang-select");

  const nextBtn = document.getElementById("next-btn");
  const skipBtn = document.getElementById("skip-btn");
  const exitBtn = document.getElementById("exit-btn");

  const resultsDiv = document.getElementById("results");

  // modal elements
  const modal = document.getElementById("confirmModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalConfirmBtn = document.getElementById("confirmModalBtn");
  const modalCancelBtn = document.getElementById("cancelModal");

  // -----------------------
  // Utilities
  // -----------------------
  function clampInt(n, min, max) {
    return Math.max(min, Math.min(max, Math.round(n)));
  }

  // Map average score (1..6) to level file name "level1".."level6"
  function avgToLevelFile(avg) {
    // round to nearest integer and clamp 1..6
    const r = clampInt(Math.round(avg), 1, 6);
    return `level${r}.md`;
  }

  // Simple markdown -> HTML (very small sanitizer-ish conversion)
  function mdToHtml(md) {
    if (!md) return "";
    // Escape HTML first (very basic)
    const esc = (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const lines = md.split("\n");

    let html = "";
    for (let line of lines) {
      line = line.trim();

      if (!line) {
        html += "<br>";
        continue;
      }

      // headings
      if (line.startsWith("### ")) {
        html += `<h3>${esc(line.slice(4))}</h3>`;
        continue;
      } else if (line.startsWith("## ")) {
        html += `<h2>${esc(line.slice(3))}</h2>`;
        continue;
      } else if (line.startsWith("# ")) {
        html += `<h1>${esc(line.slice(2))}</h1>`;
        continue;
      }

      // list items (simple)
      if (line.startsWith("- ") || line.startsWith("* ")) {
        // open ul if previous not a ul
        if (!html.endsWith("</ul>") && !html.includes("<ul") && !html.endsWith("</li>")) {
          html += "<ul>";
        }
        html += `<li>${esc(line.replace(/^- |^\* /, ""))}</li>`;
        // check next lines: we'll close ul when we encounter non-list; simple approach: leave closing to next block
        continue;
      } else {
        // if previous ended with </li> or we had a ul open, close it
        if (html.includes("<ul>") && !line.startsWith("- ") && !line.startsWith("* ")) {
          // close any open ul
          if (!html.endsWith("</ul>")) html += "</ul>";
        }
      }

      // bold **text**
      line = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      // italics *text* or _text_
      line = line.replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/_(.+?)_/g, "<em>$1</em>");
      // inline code `code`
      line = line.replace(/`(.+?)`/g, "<code>$1</code>");

      html += `<p>${line}</p>`;
    }

    // ensure any unclosed ul closes
    if (html.includes("<ul>") && !html.includes("</ul>")) html += "</ul>";

    return html;
  }

  // Fetch markdown file from Reports/<category>/levelX.md
  async function fetchReportMd(categoryKey, levelFile) {
    // Path is exactly "Reports/<category>/<levelFile>"
    const path = `Reports/${categoryKey}/${levelFile}`;
    try {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const md = await resp.text();
      return md;
    } catch (err) {
      console.warn("Could not fetch", path, err);
      return null;
    }
  }

  // -----------------------
  // UI: Modal
  // -----------------------
  function openModal(title, message, onConfirm) {
    modalTitle.innerText = title;
    modalMessage.innerText = message;
    modal.classList.remove("hidden");

    // remove old listeners safely by cloning
    const newConfirm = modalConfirmBtn.cloneNode(true);
    modalConfirmBtn.parentNode.replaceChild(newConfirm, modalConfirmBtn);

    const newCancel = modalCancelBtn.cloneNode(true);
    modalCancelBtn.parentNode.replaceChild(newCancel, modalCancelBtn);

    // reassign references
    // (note: after replaceChild the variable modalConfirmBtn in outer scope still points to old node,
    // so we find again)
    const confirmBtnNow = document.getElementById("confirmModalBtn");
    const cancelBtnNow = document.getElementById("cancelModal");

    confirmBtnNow.addEventListener("click", () => {
      modal.classList.add("hidden");
      onConfirm && onConfirm();
    });
    cancelBtnNow.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // -----------------------
  // Core: Load question from reportsData (your reports.js)
  // -----------------------
  function loadCurrentQuestion() {
    const catKey = categories[currentCategoryIndex];
    const catData = window.reportsData && window.reportsData[catKey];
    if (!catData) {
      questionTextEl.innerText = "No questions available for " + catKey;
      categoryTitleEl.innerText = catKey;
      return;
    }

    const qList = catData.questions;
    if (!qList || qList.length === 0) {
      questionTextEl.innerText = "No questions found.";
      categoryTitleEl.innerText = catData.title || catKey;
      return;
    }

    // bounds check
    if (currentQuestionIndex < 0) currentQuestionIndex = 0;
    if (currentQuestionIndex >= qList.length) currentQuestionIndex = qList.length - 1;

    const qObj = qList[currentQuestionIndex];
    // prefer selectedLang, fallback to 'en'
    const qText = qObj[selectedLang] || qObj.en || "Question text missing";
    questionTextEl.innerText = qText;
    categoryTitleEl.innerText = catData.title || catKey;

    // reset slider neutral
    sliderEl.value = 3;

    // progress bar for the block
    const pct = Math.round(((currentQuestionIndex + 1) / qList.length) * 100);
    if (progressBar) progressBar.style.width = pct + "%";

    // start timer for this block if first question
    if (currentQuestionIndex === 0 && !blockStart) blockStart = Date.now();
  }

  // -----------------------
  // Save answer for current question
  // -----------------------
  function saveCurrentAnswer() {
    const catKey = categories[currentCategoryIndex];
    if (!answersByCategory[catKey]) answersByCategory[catKey] = [];
    // save at index (so previous answers preserved if user goes back later)
    answersByCategory[catKey][currentQuestionIndex] = Number(sliderEl.value);
  }

  // -----------------------
  // Navigation handlers
  // -----------------------
  // Next
  nextBtn.addEventListener("click", () => {
    // require name once at first next
    if (!userName) {
      const n = (nameInput && nameInput.value && nameInput.value.trim()) || "";
      if (!n) {
        alert("Please enter your name before starting the test.");
        return;
      }
      userName = n;
    }

    saveCurrentAnswer();

    // move
    const catKey = categories[currentCategoryIndex];
    const qList = window.reportsData[catKey].questions;
    currentQuestionIndex++;
    if (currentQuestionIndex >= qList.length) {
      // finish block -> record time
      if (blockStart) {
        blockTimes[catKey] = Math.round((Date.now() - blockStart) / 1000);
        blockStart = null;
      }
      // move to next category
      currentCategoryIndex++;
      currentQuestionIndex = 0;
      if (currentCategoryIndex >= categories.length) {
        // done entire test
        showFinalResults();
        return;
      }
      // else load next category's first question
      loadCurrentQuestion();
    } else {
      loadCurrentQuestion();
    }
  });

  // Skip category
  skipBtn.addEventListener("click", () => {
    const catKey = categories[currentCategoryIndex];
    const catTitle = (window.reportsData && reportsData[catKey] && reportsData[catKey].title) || catKey;
    openModal(
      `Skip "${catTitle}"?`,
      `Not a problem if you don't have time now for "${catTitle}". You can take it later. Proceed to skip this category?`,
      () => {
        // mark skipped
        skippedCategories[catKey] = true;
        // record time if any
        if (blockStart) {
          blockTimes[catKey] = Math.round((Date.now() - blockStart) / 1000);
          blockStart = null;
        }
        // advance category
        currentCategoryIndex++;
        currentQuestionIndex = 0;
        if (currentCategoryIndex >= categories.length) {
          showFinalResults();
          return;
        }
        loadCurrentQuestion();
      }
    );
  });

  // Exit test
  exitBtn.addEventListener("click", () => {
    openModal(
      "Exit test?",
      "Not an issue if you don't have time now. We recommend taking the test later in a calm space. Exit now and view partial results?",
      () => {
        // record time for current block
        const catKey = categories[currentCategoryIndex];
        if (blockStart) {
          blockTimes[catKey] = Math.round((Date.now() - blockStart) / 1000);
          blockStart = null;
        }
        showFinalResults(); // will show motivational result for partial if no answers etc.
      }
    );
  });

  // Language change
  langSelect && langSelect.addEventListener("change", (e) => {
    selectedLang = e.target.value;
    loadCurrentQuestion();
  });

  // -----------------------
  // Final results (async fetch .md files)
  // -----------------------
  async function showFinalResults() {
    // hide test UI
    const appCont = document.getElementById("app-container");
    if (appCont) appCont.classList.add("hidden");
    resultsDiv.classList.remove("hidden");

    // build HTML content
    let html = `<h2>Personal Insight Report — ${userName || "Participant"}</h2>`;
    html += `<p><em>Note: No data is stored — this result is shown only locally in your browser.</em></p>`;

    // if there are zero answers at all, encourage user
    const totalAnswered = Object.values(answersByCategory).reduce((sum, arr) => sum + (arr ? arr.filter(Boolean).length : 0), 0);
    if (totalAnswered === 0 && Object.keys(skippedCategories).length === 0) {
      html += `<p>You didn't answer any questions. Whenever you have time, please take the full test for a complete insight.</p>`;
      resultsDiv.innerHTML = html;
      return;
    }

    // loop categories
    for (const catKey of categories) {
      const catData = (window.reportsData && window.reportsData[catKey]) || {};
      html += `<section class="category-report"><h3>${catData.title || catKey}</h3>`;

      // skipped
      if (skippedCategories[catKey]) {
        html += `<p><strong>Status:</strong> Skipped — try this category later for full results.</p>`;
        html += `</section><hr>`;
        continue;
      }

      const arr = answersByCategory[catKey] || [];
      const numeric = arr.filter((v) => typeof v === "number" && !Number.isNaN(v));
      if (!numeric.length) {
        html += `<p>No answers provided in this category.</p></section><hr>`;
        continue;
      }

      const avg = numeric.reduce((s, v) => s + v, 0) / numeric.length;
      const levelFile = avgToLevelFile(avg);

      // try to fetch the markdown report file
      let md = await fetchReportMd(catKey, levelFile);
      let reportHtml = "";

      if (md !== null) {
        // convert md to html
        reportHtml = mdToHtml(md);
      } else {
        // fallback: if reportsData contains textual `reports` keys (level1..level6), use that
        if (catData.reports && catData.reports[levelFile.replace(".md","")]) {
          reportHtml = `<p>${catData.reports[levelFile.replace(".md","")]}</p>`;
        } else {
          reportHtml = `<p>Detailed report not available for ${catKey} (level ${levelFile}).</p>`;
        }
      }

      html += `<p><strong>Average score:</strong> ${avg.toFixed(1)} — <strong>Level file:</strong> ${levelFile}</p>`;
      html += `<div class="report-content">${reportHtml}</div>`;
      html += `</section><hr>`;
    }

    // add time per block
    if (Object.keys(blockTimes).length) {
      html += `<div class="time-summary"><h4>Time spent (seconds)</h4><pre>${JSON.stringify(blockTimes, null, 2)}</pre></div>`;
    }

    // friendly footer
    const now = new Date();
    html += `<div class="result-footer"><p>Generated: ${now.toLocaleString()}</p>`;
    html += `<p>Privacy: Results shown locally only — no data stored.</p></div>`;

    resultsDiv.innerHTML = html;
    // smooth scroll to results
    resultsDiv.scrollIntoView({ behavior: "smooth" });
  }

  // -----------------------
  // Start test: load first question
  // -----------------------
  // Safe start: when user clicks Start (your HTML has a small starter script; we listen too)
  startBtn && startBtn.addEventListener("click", () => {
    // If the intro script already hid the intro, this call will still safely load
    // only proceed if reportsData is present
    if (!window.reportsData) {
      console.error("reportsData not found. Ensure reports.js is loaded before app.js");
      alert("Internal error: questions not found (reports.js missing).");
      return;
    }

    // initialize answersByCategory arrays
    categories.forEach((c) => (answersByCategory[c] = []));

    // if the start script already hid the intro and showed app, we still call load
    loadCurrentQuestion();
  });
});
