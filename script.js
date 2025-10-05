/***********************
  app.js
  - Single-file integration for:
    * 60 bilingual questions (4 blocks of 15)
    * per-block timers, resume via localStorage
    * scoring with reverse items
    * dynamic report loading from /reports/{category}/level{n}.md
    * results summary + full report rendering
***********************/

/* ==========================
   QUESTIONS: 60 bilingual items
   (Each item: {eng,hindi,domain,reverse})
   Domains: "emotional","resilience","growth","overthinking"
   Block mapping:
     0 -> emotional (questions 0..14)
     1 -> resilience (15..29)
     2 -> growth (30..44)
     3 -> overthinking (45..59)
   ========================== */

const questions = [
  // Block 1: Emotional (1-15)
  {eng:"I can usually identify my emotions as I experience them.", hi:"मैं आम तौर पर अपनी भावनाओं को पहचान लेता/लेती हूँ जब मैं उन्हें अनुभव करता/करती हूँ।", domain:"emotional", reverse:false},
  {eng:"I often react emotionally before thinking through the situation.", hi:"मैं अक्सर बिना सोचे-समझे भावनात्मक प्रतिक्रिया देता/देती हूँ।", domain:"emotional", reverse:true},
  {eng:"I stay calm in stressful situations.", hi:"तनावपूर्ण स्थितियों में मैं शांत रहता/रहती हूँ।", domain:"emotional", reverse:false},
  {eng:"I can easily understand the emotions of others.", hi:"मैं दूसरों की भावनाओं को आसानी से समझ लेता/लेती हूँ।", domain:"emotional", reverse:false},
  {eng:"I lose control of my feelings quickly.", hi:"मैं जल्दी अपनी भावनाओं पर नियंत्रण खो देता/देती हूँ।", domain:"emotional", reverse:true},
  {eng:"I can express my emotions without hurting others.", hi:"मैं अपनी भावनाओं को बिना किसी को ठेस पहुँचाए व्यक्त कर सकता/सकती हूँ।", domain:"emotional", reverse:false},
  {eng:"I feel overwhelmed when dealing with conflicts.", hi:"संघर्षों से निपटने में मैं अभिभूत महसूस करता/करती हूँ।", domain:"emotional", reverse:true},
  {eng:"I am aware of how my behavior impacts people around me.", hi:"मैं जानता/जानती हूँ कि मेरा व्यवहार मेरे आस-पास के लोगों पर कैसे प्रभाव डालता है।", domain:"emotional", reverse:false},
  {eng:"I struggle to manage my anger effectively.", hi:"मुझे अपने गुस्से को नियंत्रित करने में कठिनाई होती है।", domain:"emotional", reverse:true},
  {eng:"I can motivate myself even when I feel discouraged.", hi:"हतोत्साहित होने पर भी मैं खुद को प्रेरित कर सकता/सकती हूँ।", domain:"emotional", reverse:false},
  {eng:"I get irritated over small issues.", hi:"मैं छोटी-छोटी बातों पर चिड़चिड़ा हो जाता/जाती हूँ।", domain:"emotional", reverse:true},
  {eng:"I can adapt my communication style depending on the person.", hi:"मैं व्यक्ति के अनुसार अपनी संचार शैली बदल सकता/सकती हूँ।", domain:"emotional", reverse:false},
  {eng:"I often misunderstand others’ intentions.", hi:"मैं अक्सर दूसरों के इरादों को गलत समझ लेता/लेती हूँ।", domain:"emotional", reverse:true},
  {eng:"I practice empathy when someone shares a problem.", hi:"जब कोई समस्या साझा करता है, तो मैं सहानुभूति दिखाता/दिखाती हूँ।", domain:"emotional", reverse:false},
  {eng:"I find it hard to stay emotionally stable under pressure.", hi:"दबाव में मुझे भावनात्मक रूप से स्थिर रहना कठिन लगता है।", domain:"emotional", reverse:true},

  // Block 2: Resilience (16-30)
  {eng:"When faced with setbacks, I quickly look for solutions.", hi:"जब मुझे असफलता मिलती है, तो मैं जल्दी समाधान ढूंढता/ढूंढती हूँ।", domain:"resilience", reverse:false},
  {eng:"I give up easily when things get tough.", hi:"कठिन परिस्थितियों में मैं आसानी से हार मान लेता/लेती हूँ।", domain:"resilience", reverse:true},
  {eng:"I see challenges as opportunities to grow.", hi:"मैं चुनौतियों को बढ़ने का अवसर मानता/मानती हूँ।", domain:"resilience", reverse:false},
  {eng:"I struggle to bounce back after failure.", hi:"असफलता के बाद मैं फिर से संभलने में संघर्ष करता/करती हूँ।", domain:"resilience", reverse:true},
  {eng:"I remain hopeful even in uncertain times.", hi:"अनिश्चित परिस्थितियों में भी मैं आशावादी रहता/रहती हूँ।", domain:"resilience", reverse:false},
  {eng:"I avoid dealing with problems and hope they resolve on their own.", hi:"मैं समस्याओं का सामना करने से बचता/बचती हूँ और उम्मीद करता/करती हूँ कि वे खुद सुलझ जाएंगी।", domain:"resilience", reverse:true},
  {eng:"I learn from difficult experiences.", hi:"मैं कठिन अनुभवों से सीखता/सीखती हूँ।", domain:"resilience", reverse:false},
  {eng:"I feel stuck when things don’t go my way.", hi:"जब चीजें मेरे अनुसार नहीं होतीं, तो मैं फंसा हुआ महसूस करता/करती हूँ।", domain:"resilience", reverse:true},
  {eng:"I can handle change without much stress.", hi:"मैं बदलाव को बिना अधिक तनाव के संभाल सकता/सकती हूँ।", domain:"resilience", reverse:false},
  {eng:"I often dwell on past failures.", hi:"मैं अक्सर पिछली असफलताओं में उलझा रहता/रहती हूँ।", domain:"resilience", reverse:true},
  {eng:"I find ways to stay positive in difficulties.", hi:"कठिनाइयों में भी मैं सकारात्मक बने रहने का तरीका ढूंढ लेता/लेती हूँ।", domain:"resilience", reverse:false},
  {eng:"I blame others when I cannot cope.", hi:"जब मैं सामना नहीं कर पाता/पाती, तो मैं दूसरों को दोष देता/देती हूँ।", domain:"resilience", reverse:true},
  {eng:"I adapt quickly to unexpected changes.", hi:"मैं अप्रत्याशित बदलावों के लिए जल्दी अनुकूल हो जाता/जाती हूँ।", domain:"resilience", reverse:false},
  {eng:"I lose hope when I fail repeatedly.", hi:"बार-बार असफल होने पर मैं आशा खो देता/देती हूँ।", domain:"resilience", reverse:true},
  {eng:"I use setbacks as motivation to try harder.", hi:"मैं असफलताओं को और अधिक प्रयास करने की प्रेरणा बनाता/बनाती हूँ।", domain:"resilience", reverse:false},

  // Block 3: Growth (31-45)
  {eng:"I believe abilities can always be developed with effort.", hi:"मेरा मानना है कि क्षमताएँ हमेशा प्रयास से विकसित की जा सकती हैं।", domain:"growth", reverse:false},
  {eng:"I think talent matters more than effort.", hi:"मेरा मानना है कि प्रतिभा, प्रयास से अधिक महत्वपूर्ण है।", domain:"growth", reverse:true},
  {eng:"I enjoy learning new skills.", hi:"मुझे नए कौशल सीखने में आनंद आता है।", domain:"growth", reverse:false},
  {eng:"I avoid challenges to prevent failure.", hi:"मैं असफलता से बचने के लिए चुनौतियों से बचता/बचती हूँ।", domain:"growth", reverse:true},
  {eng:"Feedback helps me improve.", hi:"प्रतिक्रिया मुझे सुधारने में मदद करती है।", domain:"growth", reverse:false},
  {eng:"I feel intelligence is fixed and cannot change.", hi:"मेरा मानना है कि बुद्धिमत्ता स्थिर है और बदल नहीं सकती।", domain:"growth", reverse:true},
  {eng:"I put consistent effort into personal growth.", hi:"मैं व्यक्तिगत विकास में लगातार प्रयास करता/करती हूँ।", domain:"growth", reverse:false},
  {eng:"I give up if I don’t succeed immediately.", hi:"अगर मैं तुरंत सफल नहीं होता/होती, तो मैं हार मान लेता/लेती हूँ।", domain:"growth", reverse:true},
  {eng:"I see failures as learning opportunities.", hi:"मैं असफलताओं को सीखने के अवसर के रूप में देखता/देखती हूँ।", domain:"growth", reverse:false},
  {eng:"I avoid effort if I feel I lack natural talent.", hi:"अगर मुझे लगता है कि मेरे पास प्राकृतिक प्रतिभा नहीं है, तो मैं प्रयास से बचता/बचती हूँ।", domain:"growth", reverse:true},
  {eng:"I enjoy exploring new ideas.", hi:"मुझे नए विचारों का पता लगाना अच्छा लगता है।", domain:"growth", reverse:false},
  {eng:"I believe failure means I am not good enough.", hi:"मेरा मानना है कि असफलता का मतलब है कि मैं पर्याप्त अच्छा नहीं हूँ।", domain:"growth", reverse:true},
  {eng:"I persist in tasks even if they take a long time.", hi:"मैं कार्यों में डटा रहता/रहती हूँ, भले ही वे लंबा समय लें।", domain:"growth", reverse:false},
  {eng:"I avoid asking questions to not appear weak.", hi:"मैं कमजोर न दिखने के लिए प्रश्न पूछने से बचता/बचती हूँ।", domain:"growth", reverse:true},
  {eng:"I believe growth comes from effort, not luck.", hi:"मेरा मानना है कि विकास प्रयास से आता है, भाग्य से नहीं।", domain:"growth", reverse:false},

  // Block 4: Overthinking (46-60)
  {eng:"I often get stuck in loops of repetitive thinking.", hi:"मैं अक्सर बार-बार सोच में फंस जाता/जाती हूँ।", domain:"overthinking", reverse:true},
  {eng:"I can let go of thoughts that are not useful.", hi:"मैं उन विचारों को छोड़ सकता/सकती हूँ जो उपयोगी नहीं हैं।", domain:"overthinking", reverse:false},
  {eng:"I keep replaying past mistakes in my mind.", hi:"मैं अपने दिमाग में पिछली गलतियों को बार-बार दोहराता/दोहराती हूँ।", domain:"overthinking", reverse:true},
  {eng:"I can focus on present tasks without distraction.", hi:"मैं वर्तमान कार्यों पर ध्यान केंद्रित कर सकता/सकती हूँ।", domain:"overthinking", reverse:false},
  {eng:"I worry excessively about the future.", hi:"मैं भविष्य के बारे में अत्यधिक चिंता करता/करती हूँ।", domain:"overthinking", reverse:true},
  {eng:"I can redirect my thoughts when I get distracted.", hi:"जब मैं विचलित होता/होती हूँ तो मैं अपने विचारों को पुनर्निर्देशित कर सकता/सकती हूँ।", domain:"overthinking", reverse:false},
  {eng:"I obsess over small decisions.", hi:"मैं छोटी-छोटी बातों पर अत्यधिक सोचता/सोचती हूँ।", domain:"overthinking", reverse:true},
  {eng:"I can prioritize and move on without hesitation.", hi:"मैं प्राथमिकता तय करके बिना झिझक आगे बढ़ सकता/सकती हूँ।", domain:"overthinking", reverse:false},
  {eng:"I replay conversations long after they happen.", hi:"मैं बातचीत को लंबे समय तक बार-बार सोचता/सोचती हूँ।", domain:"overthinking", reverse:true},
  {eng:"I can make quick, confident decisions.", hi:"मैं जल्दी और आत्मविश्वास से निर्णय ले सकता/सकती हूँ।", domain:"overthinking", reverse:false},
  {eng:"I get anxious imagining all possible outcomes.", hi:"मैं सभी संभावित परिणामों की कल्पना करके चिंतित हो जाता/जाती हूँ।", domain:"overthinking", reverse:true},
  {eng:"I focus on what I can control instead of what I can’t.", hi:"मैं उन चीजों पर ध्यान केंद्रित करता/करती हूँ जिन्हें मैं नियंत्रित कर सकता/सकती हूँ।", domain:"overthinking", reverse:false},
  {eng:"I feel paralyzed when I have to make decisions.", hi:"निर्णय लेने की स्थिति में मैं जड़ हो जाता/जाती हूँ।", domain:"overthinking", reverse:true},
  {eng:"I can clear my mind and concentrate when needed.", hi:"जब आवश्यकता होती है, मैं अपना मन शांत कर सकता/सकती हूँ।", domain:"overthinking", reverse:false},
  {eng:"I think too much about how others perceive me.", hi:"मैं बहुत सोचता/सोचती हूँ कि लोग मुझे कैसे देखते हैं।", domain:"overthinking", reverse:true}
];

/* ==========================
   APP STATE
   ========================== */

const blockSize = 15;
const totalBlocks = 4;
let currentBlock = Number(localStorage.getItem('currentBlock') || 0);
let answers = JSON.parse(localStorage.getItem('pd_answers') || '{}'); // keys: questionIndex -> value 1..5
let blockTimes = JSON.parse(localStorage.getItem('pd_blockTimes') || '[0,0,0,0]'); // seconds per block
let blockStartTs = null;
let timerInterval = null;

/* ==========================
   DOM refs (expected in index.html)
   - #testForm  -> where questions render
   - #prevBtn, #nextBtn, #submitBtn
   - #timer -> block timer display
   - #results -> results container
   ========================== */

const formEl = document.getElementById('testForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const timerEl = document.getElementById('timer');
const resultsEl = document.getElementById('results');

/* ==========================
   UTILITIES
   ========================== */

// format seconds to MM:SS
function fmtSec(s){
  s = Math.max(0, Math.floor(s||0));
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

// save localStorage snapshot
function persist(){
  localStorage.setItem('pd_answers', JSON.stringify(answers));
  localStorage.setItem('pd_blockTimes', JSON.stringify(blockTimes));
  localStorage.setItem('currentBlock', String(currentBlock));
}

/* ==========================
   RENDERING: Block Questions
   ========================== */

function renderBlock(idx){
  formEl.innerHTML = '';
  const start = idx * blockSize;
  const end = start + blockSize;
  // header
  const hdr = document.createElement('div');
  hdr.innerHTML = `<div style="margin-bottom:8px;font-weight:600">Block ${idx+1} of ${totalBlocks} • Domain: ${questions[start].domain}</div>`;
  formEl.appendChild(hdr);

  // questions
  questions.slice(start,end).forEach((q, i) => {
    const qIndex = start + i;
    const wrapper = document.createElement('div');
    wrapper.className = 'question';
    const selectedVal = answers[qIndex] || 0;
    wrapper.innerHTML = `
      <div style="margin-bottom:6px"><strong>Q${qIndex+1}.</strong> ${q.eng} <div class="hindi" style="margin-top:4px;color:#666">${q.hi}</div></div>
      <div class="options" data-q="${qIndex}">
        ${[1,2,3,4,5].map(v => `<label class="opt" data-val="${v}" style="margin-right:8px;display:inline-block;padding:6px 10px;border-radius:6px;border:1px solid #ddd;cursor:pointer">
            <input type="radio" name="q${qIndex}" value="${v}" ${selectedVal==v?'checked':''} style="display:none">${v}
          </label>`).join('')}
      </div>
    `;
    formEl.appendChild(wrapper);

    // attach click handlers
    const opts = wrapper.querySelectorAll('.opt');
    opts.forEach(o => {
      o.addEventListener('click', (ev)=>{
        const val = Number(o.dataset.val);
        answers[qIndex] = val;
        persist();
        // update visuals
        opts.forEach(x=>x.style.background='');
        o.style.background = '#246b8a';
        o.style.color = '#fff';
      });
      // initial visual highlight
      if (Number(o.dataset.val) === selectedVal){
        o.style.background = '#246b8a';
        o.style.color = '#fff';
      }
    });
  });

  // buttons state
  prevBtn.disabled = (idx === 0);
  nextBtn.classList.toggle('hidden', idx === totalBlocks - 1);
  submitBtn.classList.toggle('hidden', idx !== totalBlocks - 1);

  // timer
  startBlockTimer();
}

/* ==========================
   TIMER: per-block
   ========================== */

function startBlockTimer(){
  stopBlockTimer();
  blockStartTs = Date.now();
  timerEl.textContent = fmtSec(blockTimes[currentBlock] || 0);
  timerInterval = setInterval(()=> {
    const elapsed = Math.floor((Date.now() - blockStartTs)/1000) + (blockTimes[currentBlock] || 0);
    timerEl.textContent = fmtSec(elapsed);
  }, 300);
}

function stopBlockTimer(){
  if (!blockStartTs) return;
  const elapsed = Math.floor((Date.now() - blockStartTs)/1000);
  blockTimes[currentBlock] = (blockTimes[currentBlock] || 0) + elapsed;
  blockStartTs = null;
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  persist();
}

/* ==========================
   NAVIGATION
   ========================== */

prevBtn.addEventListener('click', ()=>{
  stopBlockTimer();
  if (currentBlock > 0) currentBlock--;
  persist();
  renderBlock(currentBlock);
});
nextBtn.addEventListener('click', ()=>{
  // optional: warn if unanswered in block
  const start = currentBlock*blockSize;
  const end = start+blockSize;
  const unanswered = [];
  for(let i=start;i<end;i++) if(!answers[i]) unanswered.push(i+1);
  if(unanswered.length){
    if(!confirm(`You have ${unanswered.length} unanswered questions in this block. Continue to next block?`)) return;
  }
  stopBlockTimer();
  if (currentBlock < totalBlocks-1) currentBlock++;
  persist();
  renderBlock(currentBlock);
});

submitBtn.addEventListener('click', ()=>{
  // final submission
  // check for unanswered overall
  const unanswered = [];
  for(let i=0;i<questions.length;i++) if(!answers[i]) unanswered.push(i+1);
  if(unanswered.length){
    if(!confirm(`You left ${unanswered.length} questions unanswered. Submit anyway?`)) return;
  }
  stopBlockTimer();
  calculateAndShowResults();
});

/* ==========================
   SCORING & REPORT LEVEL MAPPING
   ========================== */

// domain display names and folder names mapping
const domainInfo = {
  emotional: {label:'Emotional Intelligence', folder:'emotional'},
  resilience: {label:'Resilience', folder:'resilience'},
  growth: {label:'Growth Mindset', folder:'growth'},
  overthinking: {label:'Overthinking Pattern', folder:'overthinking'}
};

// compute domain sums and counts
function computeDomainScores(){
  const domains = {};
  // initialize
  Object.keys(domainInfo).forEach(k => domains[k] = {sum:0,count:0,max:0});
  for(let i=0;i<questions.length;i++){
    const q = questions[i];
    const val = answers[i] ? Number(answers[i]) : 0;
    let scored = val;
    if (q.reverse && val>0) scored = 6 - val; // reverse scoring
    domains[q.domain].sum += scored;
    domains[q.domain].count += (val>0?1:0);
    domains[q.domain].max += 5;
  }
  return domains;
}

// map percentage to level (1..6)
// percentages are percent of max (0..100)
function pctToLevel(pct){
  // thresholds (adjustable):
  // <=20% -> 1
  // <=40% -> 2
  // <=60% -> 3
  // <=75% -> 4
  // <=90% -> 5
  // >90% -> 6
  if (pct <= 20) return 1;
  if (pct <= 40) return 2;
  if (pct <= 60) return 3;
  if (pct <= 75) return 4;
  if (pct <= 90) return 5;
  return 6;
}

/* ==========================
   LOAD & RENDER MARKDOWN REPORT
   ========================== */

function mdToHtml(md){
  // Minimal markdown -> HTML converter (headlines, bold, italics, lists, paragraphs)
  let out = md;
  // escape HTML first (basic)
  out = out.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  // headers
  out = out.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  out = out.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  out = out.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  out = out.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  out = out.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  out = out.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  // bold & italics
  out = out.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  out = out.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  // unordered lists
  out = out.replace(/^\s*[-\*] (.*)/gim, '<li>$1</li>');
  out = out.replace(/(<li>[\s\S]*?<\/li>)/gim, (m) => `<ul>${m}</ul>`);
  // paragraphs
  out = out.replace(/^\s*([^<\n][^\n]+)\s*$/gim, '<p>$1</p>');
  // simple line breaks
  out = out.replace(/\n/g, '');
  return out;
}

function loadReportMarkdown(categoryFolder, level){
  const path = `reports/${categoryFolder}/level${level}.md`;
  return fetch(path).then(res => {
    if (!res.ok) throw new Error(`Missing report file: ${path}`);
    return res.text();
  });
}

/* ==========================
   FINAL RESULTS: compute + render
   ========================== */

function calculateAndShowResults(){
  const domains = computeDomainScores();
  // assemble results
  const results = [];
  Object.keys(domains).forEach(domainKey => {
    const d = domains[domainKey];
    const maxPossible = (questions.filter(q=>q.domain===domainKey).length)*5;
    const pct = maxPossible>0 ? Math.round((d.sum / maxPossible) * 100) : 0;
    const level = pctToLevel(pct);
    results.push({
      domainKey,
      label: domainInfo[domainKey].label,
      folder: domainInfo[domainKey].folder,
      sum: d.sum,
      answered: d.count,
      max: maxPossible,
      pct,
      level,
      timeSeconds: blockTimes[Object.keys(domainInfo).indexOf(domainKey)] || 0
    });
  });

  // render summary skeleton
  let html = `<div style="padding:12px"><h2>Your Detailed Report</h2>`;
  html += `<p style="color:#444">Below are your scores for each domain, the time you spent on that domain, and the full professional report tailored to your level.</p>`;
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px">`;
  results.forEach(r=>{
    html += `<div style="padding:10px;border-radius:8px;border:1px solid #e6eef4;background:#fbfeff">
      <strong>${r.label}</strong>
      <div style="margin-top:6px">Score: <strong>${r.sum}</strong> / ${r.max} (${r.pct}%)</div>
      <div style="margin-top:6px">Level: <strong>${r.level}</strong></div>
      <div style="margin-top:6px">Time: <strong>${fmtSec(r.timeSeconds)}</strong></div>
    </div>`;
  });
  html += `</div><div id="fullReports" style="margin-top:18px"></div>`;
  html += `<div style="margin-top:12px"><button id="downloadResult">Download JSON</button> <button id="printReport">Print</button></div>`;
  html += `</div>`;

  resultsEl.innerHTML = html;

  // load each report markdown and append (in sequence)
  const fullReportsContainer = document.getElementById('fullReports');

  // load sequentially so order stays consistent
  (async function loadAll(){
    for(const r of results){
      try{
        const md = await loadReportMarkdown(r.folder, r.level);
        const blockHtml = `<section style="margin-top:18px;padding:12px;border:1px solid #e9f5f8;border-radius:8px;background:#fff">
            <h2 style="margin-top:0">${r.label} — Level ${r.level}</h2>
            <div style="color:#666;margin-bottom:8px">Score: ${r.sum}/${r.max} • ${r.pct}% • Time: ${fmtSec(r.timeSeconds)}</div>
            <div class="report-content">${mdToHtml(md)}</div>
          </section>`;
        fullReportsContainer.insertAdjacentHTML('beforeend', blockHtml);
      } catch(err){
        fullReportsContainer.insertAdjacentHTML('beforeend', `<div style="color:red">Could not load report for ${r.label} (level ${r.level}).</div>`);
        console.error(err);
      }
    }

    // attach download + print handlers
    document.getElementById('downloadResult').addEventListener('click', ()=>{
      const payload = {
        timestamp: (new Date()).toISOString(),
        answers, blockTimes, results
      };
      const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'pd_results.json'; a.click(); URL.revokeObjectURL(url);
    });
    document.getElementById('printReport').addEventListener('click', ()=> window.print());

  })();
}

/* ==========================
   INITIALIZE UI
   ========================== */

function init(){
  // wire up missing DOM gracefully
  if(!formEl || !prevBtn || !nextBtn || !submitBtn || !timerEl || !resultsEl){
    console.error('Missing required DOM elements. Please ensure #testForm, #prevBtn, #nextBtn, #submitBtn, #timer, and #results exist.');
    return;
  }
  renderBlock(currentBlock);
}

// start
init();
