// results.js
async function loadReport(category, level) {
  try {
    const response = await fetch(`./reports/${category}/level${level}.md`);
    if (!response.ok) throw new Error("Report not found");
    const text = await response.text();
    return text;
  } catch (err) {
    console.error("Error loading report:", err);
    return "Report unavailable. Please check file structure.";
  }
}

// Make it global for app.js
window.loadReport = loadReport;
