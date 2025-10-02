// ---------------------------
// Question Bank (short demo, add all ~60 here)
// ---------------------------
const questions = [
  {
    text: "I can usually identify my emotions as I experience them.",
    hindi: "मैं आमतौर पर अपनी भावनाओं को पहचान लेता/लेती हूँ जब मैं उन्हें अनुभव करता/करती हूँ।",
    domain: "EQ",
    reverse: false
  },
  {
    text: "I often react emotionally before thinking through the situation.",
    hindi: "मैं अक्सर बिना सोचे-समझे भावनात्मक प्रतिक्रिया देता/देती हूँ।",
    domain: "EQ",
    reverse: true
  },
  {
    text: "When faced with setbacks, I quickly look for solutions rather than dwelling on problems.",
    hindi: "जब मुझे असफलता मिलती है, तो मैं समस्याओं में फंसने की बजाय जल्दी समाधान ढूंढता/ढूंढती हूँ।",
    domain: "Resilience",
    reverse: false
  },
  {
    text: "I believe abilities can always be developed with effort and practice.",
    hindi: "मेरा मानना है कि क्षमताएँ हमेशा प्रयास और अभ्यास से विकसित की जा सकती हैं।",
    domain: "Mindset",
    reverse: false
  },
  {
    text: "I often get stuck in loops of repetitive thinking that prevent me from acting.",
    hindi: "मैं अक्सर बार-बार सोच में फंस जाता/जाती हूँ, जिससे मैं कार्य नहीं कर पाता/पाती।",
    domain: "Overthinking",
    reverse: true
  }
  // 👉 Continue adding all ~60 questions in same format
];

// ---------------------------
// Render Questions
// ---------------------------
const form = document.getElementById("testForm");

questions.forEach((q, i) => {
  const div = document.createElement("div");
  div.classList.add("question");
  div.innerHTML = `
    <p><strong>Q${i + 1}.</strong> ${q.text}<br><span class="hindi">${q.hindi}</span></p>
    ${[1,2,3,4,5].map(val => `
      <label>
        <input type="radio" name="q${i}" value="${val}">
        ${val}
      </label>`).join(" ")}
  `;
  form.appendChild(div);
});

// ---------------------------
// Handle Submit
// ---------------------------
document.getElementById("submitBtn").addEventListener("click", () => {
  let scores = {EQ:0, Resilience:0, Mindset:0, Overthinking:0};
  let counts = {EQ:0, Resilience:0, Mindset:0, Overthinking:0};

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) {
      let val = parseInt(selected.value);
      if (q.reverse) val = 6 - val; // reverse scoring
      scores[q.domain] += val;
      counts[q.domain]++;
    }
  });

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h2>Results / परिणाम</h2>";
  for (let domain in scores) {
    const avg = (scores[domain] / counts[domain]).toFixed(2);
    resultsDiv.innerHTML += `<p><strong>${domain}:</strong> ${avg} / 5</p>`;
  }
  resultsDiv.classList.remove("hidden");
});
