// ---------------------------
// Full 60 Question Bank (English + Hindi)
// ---------------------------
const questions = [
  // Block 1 (1–15) → EQ (Emotional Intelligence)
  { text: "I can usually identify my emotions as I experience them.", hindi: "मैं आमतौर पर अपनी भावनाओं को पहचान लेता/लेती हूँ जब मैं उन्हें अनुभव करता/करती हूँ।", domain: "EQ", reverse: false },
  { text: "I often react emotionally before thinking through the situation.", hindi: "मैं अक्सर बिना सोचे-समझे भावनात्मक प्रतिक्रिया देता/देती हूँ।", domain: "EQ", reverse: true },
  { text: "I stay calm in stressful situations.", hindi: "तनावपूर्ण स्थितियों में मैं शांत रहता/रहती हूँ।", domain: "EQ", reverse: false },
  { text: "I can easily understand the emotions of others.", hindi: "मैं दूसरों की भावनाओं को आसानी से समझ लेता/लेती हूँ।", domain: "EQ", reverse: false },
  { text: "I lose control of my feelings quickly.", hindi: "मैं जल्दी अपनी भावनाओं पर नियंत्रण खो देता/देती हूँ।", domain: "EQ", reverse: true },
  { text: "I can express my emotions without hurting others.", hindi: "मैं अपनी भावनाओं को बिना किसी को ठेस पहुँचाए व्यक्त कर सकता/सकती हूँ।", domain: "EQ", reverse: false },
  { text: "I feel overwhelmed when dealing with conflicts.", hindi: "संघर्षों से निपटने में मैं अभिभूत महसूस करता/करती हूँ।", domain: "EQ", reverse: true },
  { text: "I am aware of how my behavior impacts people around me.", hindi: "मैं जानता/जानती हूँ कि मेरा व्यवहार मेरे आस-पास के लोगों पर कैसे प्रभाव डालता है।", domain: "EQ", reverse: false },
  { text: "I struggle to manage my anger effectively.", hindi: "मुझे अपने गुस्से को नियंत्रित करने में कठिनाई होती है।", domain: "EQ", reverse: true },
  { text: "I can motivate myself even when I feel discouraged.", hindi: "हतोत्साहित होने पर भी मैं खुद को प्रेरित कर सकता/सकती हूँ।", domain: "EQ", reverse: false },
  { text: "I get irritated over small issues.", hindi: "मैं छोटी-छोटी बातों पर चिड़चिड़ा हो जाता/जाती हूँ।", domain: "EQ", reverse: true },
  { text: "I can adapt my communication style depending on the person.", hindi: "मैं व्यक्ति के अनुसार अपनी संचार शैली बदल सकता/सकती हूँ।", domain: "EQ", reverse: false },
  { text: "I often misunderstand others’ intentions.", hindi: "मैं अक्सर दूसरों के इरादों को गलत समझ लेता/लेती हूँ।", domain: "EQ", reverse: true },
  { text: "I practice empathy when someone shares a problem.", hindi: "जब कोई समस्या साझा करता है, तो मैं सहानुभूति दिखाता/दिखाती हूँ।", domain: "EQ", reverse: false },
  { text: "I find it hard to stay emotionally stable under pressure.", hindi: "दबाव में मुझे भावनात्मक रूप से स्थिर रहना कठिन लगता है।", domain: "EQ", reverse: true },

  // Block 2 (16–30) → Resilience
  { text: "When faced with setbacks, I quickly look for solutions.", hindi: "जब मुझे असफलता मिलती है, तो मैं जल्दी समाधान ढूंढता/ढूंढती हूँ।", domain: "Resilience", reverse: false },
  { text: "I give up easily when things get tough.", hindi: "कठिन परिस्थितियों में मैं आसानी से हार मान लेता/लेती हूँ।", domain: "Resilience", reverse: true },
  { text: "I see challenges as opportunities to grow.", hindi: "मैं चुनौतियों को बढ़ने का अवसर मानता/मानती हूँ।", domain: "Resilience", reverse: false },
  { text: "I struggle to bounce back after failure.", hindi: "असफलता के बाद मैं फिर से संभलने में संघर्ष करता/करती हूँ।", domain: "Resilience", reverse: true },
  { text: "I remain hopeful even in uncertain times.", hindi: "अनिश्चित परिस्थितियों में भी मैं आशावादी रहता/रहती हूँ।", domain: "Resilience", reverse: false },
  { text: "I avoid dealing with problems and hope they resolve on their own.", hindi: "मैं समस्याओं का सामना करने से बचता/बचती हूँ और उम्मीद करता/करती हूँ कि वे खुद सुलझ जाएंगी।", domain: "Resilience", reverse: true },
  { text: "I learn from difficult experiences.", hindi: "मैं कठिन अनुभवों से सीखता/सीखती हूँ।", domain: "Resilience", reverse: false },
  { text: "I feel stuck when things don’t go my way.", hindi: "जब चीजें मेरे अनुसार नहीं होतीं, तो मैं फंसा हुआ महसूस करता/करती हूँ।", domain: "Resilience", reverse: true },
  { text: "I can handle change without much stress.", hindi: "मैं बदलाव को बिना अधिक तनाव के संभाल सकता/सकती हूँ।", domain: "Resilience", reverse: false },
  { text: "I often dwell on past failures.", hindi: "मैं अक्सर पिछली असफलताओं में उलझा रहता/रहती हूँ।", domain: "Resilience", reverse: true },
  { text: "I find ways to stay positive in difficulties.", hindi: "कठिनाइयों में भी मैं सकारात्मक बने रहने का तरीका ढूंढ लेता/लेती हूँ।", domain: "Resilience", reverse: false },
  { text: "I blame others when I cannot cope.", hindi: "जब मैं सामना नहीं कर पाता/पाती, तो मैं दूसरों को दोष देता/देती हूँ।", domain: "Resilience", reverse: true },
  { text: "I adapt quickly to unexpected changes.", hindi: "मैं अप्रत्याशित बदलावों के लिए जल्दी अनुकूल हो जाता/जाती हूँ।", domain: "Resilience", reverse: false },
  { text: "I lose hope when I fail repeatedly.", hindi: "बार-बार असफल होने पर मैं आशा खो देता/देती हूँ।", domain: "Resilience", reverse: true },
  { text: "I use setbacks as motivation to try harder.", hindi: "मैं असफलताओं को और अधिक प्रयास करने की प्रेरणा बनाता/बनाती हूँ।", domain: "Resilience", reverse: false },

  // Block 3 (31–45) → Mindset
  { text: "I believe abilities can always be developed with effort.", hindi: "मेरा मानना है कि क्षमताएँ हमेशा प्रयास से विकसित की जा सकती हैं।", domain: "Mindset", reverse: false },
  { text: "I think talent matters more than effort.", hindi: "मेरा मानना है कि प्रतिभा, प्रयास से अधिक महत्वपूर्ण है।", domain: "Mindset", reverse: true },
  { text: "I enjoy learning new skills.", hindi: "मुझे नए कौशल सीखने में आनंद आता है।", domain: "Mindset", reverse: false },
  { text: "I avoid challenges to prevent failure.", hindi: "मैं असफलता से बचने के लिए चुनौतियों से बचता/बचती हूँ।", domain: "Mindset", reverse: true },
  { text: "Feedback helps me improve.", hindi: "प्रतिक्रिया मुझे सुधारने में मदद करती है।", domain: "Mindset", reverse: false },
  { text: "I feel intelligence is fixed and cannot change.", hindi: "मेरा मानना है कि बुद्धिमत्ता स्थिर है और बदल नहीं सकती।", domain: "Mindset", reverse: true },
  { text: "I put consistent effort into personal growth.", hindi: "मैं व्यक्तिगत विकास में लगातार प्रयास करता/करती हूँ।", domain: "Mindset", reverse: false },
  { text: "I give up if I don’t succeed immediately.", hindi: "अगर मैं तुरंत सफल नहीं होता/होती, तो मैं हार मान लेता/लेती हूँ।", domain: "Mindset", reverse: true },
  { text: "I see failures as learning opportunities.", hindi: "मैं असफलताओं को सीखने के अवसर के रूप में देखता/देखती हूँ।", domain: "Mindset", reverse: false },
  { text: "I avoid effort if I feel I lack natural talent.", hindi: "अगर मुझे लगता है कि मेरे पास प्राकृतिक प्रतिभा नहीं है, तो मैं प्रयास से बचता/बचती हूँ।", domain: "Mindset", reverse: true },
  { text: "I enjoy exploring new ideas.", hindi: "मुझे नए विचारों का पता लगाना अच्छा लगता है।", domain: "Mindset", reverse: false },
  { text: "I believe failure means I am not good enough.", hindi: "मेरा मानना है कि असफलता का मतलब है कि मैं पर्याप्त अच्छा नहीं हूँ।", domain: "Mindset", reverse: true },
  { text: "I persist in tasks even if they take a long time.", hindi: "मैं कार्यों में डटा रहता/रहती हूँ, भले ही वे लंबा समय लें।", domain: "Mindset", reverse: false },
  { text: "I avoid asking questions to not appear weak.", hindi: "मैं कमजोर न दिखने के लिए प्रश्न पूछने से बचता/बचती हूँ।", domain: "Mindset", reverse: true },
  { text: "I believe growth comes from effort, not luck.", hindi: "मेरा मानना है कि विकास प्रयास से आता है, भाग्य से नहीं।", domain: "Mindset", reverse: false },

  // Block 4 (46–60) → Overthinking
  { text: "I often get stuck in loops of repetitive thinking.", hindi: "मैं अक्सर बार-बार सोच में फंस जाता/जाती हूँ।", domain: "Overthinking", reverse: true },
  { text: "I can let go of thoughts that are not useful.", hindi: "मैं उन विचारों को छोड़ सकता/सकती हूँ जो उपयोगी नहीं हैं।", domain: "Overthinking", reverse: false },
  { text: "I keep replaying past mistakes in my mind.", hindi: "मैं अपने दिमाग में पिछली गलतियों को बार-बार दोहराता/दोहराती हूँ।", domain: "Overthinking", reverse: true },
  { text: "I can focus on present tasks without distraction.", hindi: "मैं वर्तमान कार्यों पर ध्यान केंद्रित कर सकता/सकती हूँ।", domain: "Overthinking", reverse: false },
  { text: "I worry excessively about the future.", hindi: "मैं भविष्य के बारे में अत्यधिक चिंता करता/करती हूँ।", domain: "Overthinking", reverse: true },
  { text: "I can redirect my thoughts when I get distracted.", hindi: "जब मैं विचलित होता/होती हूँ तो मैं अपने विचारों को पुनर्निर्देशित कर सकता/सकती हूँ।", domain: "Overthinking", reverse: false },
  { text: "I obsess over small decisions.", hindi: "मैं छोटी-छोटी बातों पर अत्यधिक सोचता/सोचती हूँ।", domain: "Overthinking", reverse: true },
  { text: "I can prioritize and move on without hesitation.", hindi: "मैं प्राथमिकता तय करके बिना झिझक आगे बढ़ सकता/सकती हूँ।", domain: "Overthinking", reverse: false },
  { text: "I replay conversations long after they happen.", hindi: "मैं बातचीत को लंबे समय तक बार-बार सोचता/सोचती हूँ।", domain: "Overthinking", reverse: true },
  { text: "I can make quick, confident decisions.", hindi: "मैं जल्दी और आत्मविश्वास से निर्णय ले सकता/सकती हूँ।", domain: "Overthinking", reverse: false },
  { text: "I get anxious imagining all possible outcomes.", hindi: "मैं सभी संभावित परिणामों की कल्पना करके चिंतित हो जाता/जाती हूँ।", domain: "Overthinking", reverse: true },
  { text: "I focus on what I can control instead of what I can’t.", hindi: "मैं उन चीजों पर ध्यान केंद्रित करता/करती हूँ जिन्हें मैं नियंत्रित कर सकता/सकती हूँ।", domain: "Overthinking", reverse: false },
  { text: "I feel paralyzed when I have to make decisions.", hindi: "निर्णय लेने की स्थिति में मैं जड़ हो जाता/जाती हूँ।", domain: "Overthinking", reverse: true },
  { text: "I can clear my mind and concentrate when needed.", hindi: "जब आवश्यकता होती है, मैं अपना मन शांत कर सकता/सकती हूँ।", domain: "Overthinking", reverse: false },
  { text: "I think too much about how others perceive me.", hindi: "मैं बहुत सोचता/सोचती हूँ कि लोग मुझे कैसे देखते हैं।", domain: "Overthinking", reverse: true },
];

// ---------------------------
// State Variables
// ---------------------------
let currentBlock = 0;
const blockSize = 15;
let blockTimes = [0,0,0,0];
let blockStart = null;
let timerInterval = null;

// ---------------------------
// Render Block
// ---------------------------
function renderBlock(blockIndex) {
  const form = document.getElementById("testForm");
  form.innerHTML = "";

  const start = blockIndex * blockSize;
  const end = start + blockSize;

  questions.slice(start, end).forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("question");
    div.innerHTML = `
      <p><strong>Q${start + i + 1}.</strong> ${q.text}<br><span class="hindi">${q.hindi}</span></p>
      ${[1,2,3,4,5].map(val => `
        <label>
          <input type="radio" name="q${start+i}" value="${val}">
          ${val}
        </label>`).join(" ")}
    `;
    form.appendChild(div);
  });

  // Buttons state
  document.getElementById("prevBtn").disabled = blockIndex === 0;
  document.getElementById("nextBtn").classList.toggle("hidden", blockIndex === 3);
  document.getElementById("submitBtn").classList.toggle("hidden", blockIndex !== 3);

  // Reset + start timer
  if (timerInterval) clearInterval(timerInterval);
  blockStart = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - blockStart) / 1000);
  document.getElementById("timer").textContent =
    `${String(Math.floor(elapsed/60)).padStart(2,"0")}:${String(elapsed%60).padStart(2,"0")}`;
}

// ---------------------------
// Save time for block
// ---------------------------
function saveBlockTime() {
  const elapsed = Math.floor((Date.now() - blockStart) / 1000);
  blockTimes[currentBlock] += elapsed;
  clearInterval(timerInterval);
}

// ---------------------------
// Navigation
// ---------------------------
document.getElementById("prevBtn").addEventListener("click", () => {
  saveBlockTime();
  currentBlock--;
  renderBlock(currentBlock);
});
document.getElementById("nextBtn").addEventListener("click", () => {
  saveBlockTime();
  currentBlock++;
  renderBlock(currentBlock);
});

// ---------------------------
// Handle Submit
// ---------------------------
document.getElementById("submitBtn").addEventListener("click", () => {
  saveBlockTime();
  let scores = {EQ:0, Resilience:0, Mindset:0, Overthinking:0};
  let counts = {EQ:0, Resilience:0, Mindset:0, Overthinking:0};

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) {
      let val = parseInt(selected.value);
      if (q.reverse) val = 6 - val;
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

  resultsDiv.innerHTML += "<h3>Time Taken (per block)</h3>";
  blockTimes.forEach((t, i) => {
    const mins = String(Math.floor(t/60)).padStart(2,"0");
    const secs = String(t%60).padStart(2,"0");
    resultsDiv.innerHTML += `<p>Block ${i+1}: ${mins}:${secs}</p>`;
  });

  resultsDiv.classList.remove("hidden");
});

// ---------------------------
// Start Test
// ---------------------------
renderBlock(currentBlock);
