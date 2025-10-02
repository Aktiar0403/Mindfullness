// ---------------------------
// Question Bank (short demo, add all ~60 here)
// ---------------------------
const questions = [
  // ---------------------------
  // Emotional Intelligence (EQ) – 15
  // ---------------------------
  { text: "I can usually identify my emotions as I experience them.",
    hindi: "मैं आमतौर पर अपनी भावनाओं को पहचान लेता/लेती हूँ जब मैं उन्हें अनुभव करता/करती हूँ।",
    domain: "EQ", reverse: false },
  { text: "I find it easy to understand how others are feeling.",
    hindi: "मुझे यह समझना आसान लगता है कि अन्य लोग कैसा महसूस कर रहे हैं।",
    domain: "EQ", reverse: false },
  { text: "I can stay calm and composed under stress.",
    hindi: "तनाव में भी मैं शांत और संयमित रह सकता/सकती हूँ।",
    domain: "EQ", reverse: false },
  { text: "I often react emotionally before thinking through the situation.",
    hindi: "मैं अक्सर बिना सोचे-समझे भावनात्मक प्रतिक्रिया देता/देती हूँ।",
    domain: "EQ", reverse: true },
  { text: "I know how to motivate myself when I lose focus.",
    hindi: "जब मेरा ध्यान भटकता है, तो मैं खुद को प्रेरित करना जानता/जानती हूँ।",
    domain: "EQ", reverse: false },
  { text: "I am good at reading non-verbal cues (facial expressions, tone).",
    hindi: "मैं गैर-मौखिक संकेतों (चेहरे के भाव, स्वर) को समझने में अच्छा/अच्छी हूँ।",
    domain: "EQ", reverse: false },
  { text: "I avoid discussing emotions because it makes me uncomfortable.",
    hindi: "मैं भावनाओं पर चर्चा करने से बचता/बचती हूँ क्योंकि यह मुझे असहज करता है।",
    domain: "EQ", reverse: true },
  { text: "I can express my feelings clearly to others.",
    hindi: "मैं अपनी भावनाओं को दूसरों के सामने स्पष्ट रूप से व्यक्त कर सकता/सकती हूँ।",
    domain: "EQ", reverse: false },
  { text: "I get defensive when someone gives me feedback.",
    hindi: "जब कोई मुझे प्रतिक्रिया देता है तो मैं रक्षात्मक हो जाता/जाती हूँ।",
    domain: "EQ", reverse: true },
  { text: "I try to see situations from another person’s perspective.",
    hindi: "मैं स्थितियों को दूसरे व्यक्ति के दृष्टिकोण से देखने की कोशिश करता/करती हूँ।",
    domain: "EQ", reverse: false },
  { text: "I manage my anger effectively.",
    hindi: "मैं अपने गुस्से को प्रभावी ढंग से नियंत्रित करता/करती हूँ।",
    domain: "EQ", reverse: false },
  { text: "I struggle to control my emotions when I feel upset.",
    hindi: "जब मैं परेशान होता/होती हूँ तो मुझे अपनी भावनाओं को नियंत्रित करने में कठिनाई होती है।",
    domain: "EQ", reverse: true },
  { text: "I can inspire or uplift others with my words or actions.",
    hindi: "मैं अपने शब्दों या कार्यों से दूसरों को प्रेरित कर सकता/सकती हूँ।",
    domain: "EQ", reverse: false },
  { text: "I avoid conflicts rather than resolving them.",
    hindi: "मैं समस्याओं को हल करने की बजाय उनसे बचता/बचती हूँ।",
    domain: "EQ", reverse: true },
  { text: "I adapt my communication style depending on who I’m talking to.",
    hindi: "मैं जिस व्यक्ति से बात करता/करती हूँ, उसके अनुसार अपनी संचार शैली बदलता/बदलती हूँ।",
    domain: "EQ", reverse: false },

  // ---------------------------
  // Resilience – 15
  // ---------------------------
  { text: "When faced with setbacks, I quickly look for solutions.",
    hindi: "जब मुझे असफलता मिलती है, तो मैं तुरंत समाधान ढूंढता/ढूंढती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "I see challenges as opportunities to grow stronger.",
    hindi: "मैं चुनौतियों को मजबूत बनने के अवसर के रूप में देखता/देखती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "If something doesn’t work, I keep trying different approaches.",
    hindi: "यदि कुछ काम नहीं करता है, तो मैं अलग-अलग तरीके आजमाता/आज़माती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "I often give up easily when things become difficult.",
    hindi: "जब चीजें कठिन हो जाती हैं, तो मैं आसानी से हार मान लेता/लेती हूँ।",
    domain: "Resilience", reverse: true },
  { text: "I recover emotionally from disappointments faster than others.",
    hindi: "मैं भावनात्मक निराशाओं से दूसरों की तुलना में जल्दी उबर जाता/जाती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "I stay optimistic even in tough circumstances.",
    hindi: "कठिन परिस्थितियों में भी मैं आशावादी रहता/रहती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "I tend to blame myself excessively when things go wrong.",
    hindi: "जब चीजें गलत हो जाती हैं, तो मैं खुद को अत्यधिक दोषी ठहराता/ठहराती हूँ।",
    domain: "Resilience", reverse: true },
  { text: "I can find meaning or learning in difficult experiences.",
    hindi: "मैं कठिन अनुभवों में भी अर्थ या सीख ढूंढ सकता/सकती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "Stressful events affect me for a long time.",
    hindi: "तनावपूर्ण घटनाएँ मुझे लंबे समय तक प्रभावित करती हैं।",
    domain: "Resilience", reverse: true },
  { text: "I am confident in my ability to handle crises.",
    hindi: "मुझे संकटों को संभालने की अपनी क्षमता पर विश्वास है।",
    domain: "Resilience", reverse: false },
  { text: "I adapt quickly when circumstances change.",
    hindi: "जब परिस्थितियाँ बदलती हैं तो मैं जल्दी अनुकूल हो जाता/जाती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "I panic when unexpected problems arise.",
    hindi: "जब अप्रत्याशित समस्याएँ आती हैं तो मैं घबरा जाता/जाती हूँ।",
    domain: "Resilience", reverse: true },
  { text: "I maintain hope even when faced with repeated failures.",
    hindi: "बार-बार असफल होने के बाद भी मैं उम्मीद बनाए रखता/रखती हूँ।",
    domain: "Resilience", reverse: false },
  { text: "I let small obstacles discourage me.",
    hindi: "मैं छोटी-छोटी बाधाओं से हतोत्साहित हो जाता/जाती हूँ।",
    domain: "Resilience", reverse: true },
  { text: "I believe every setback can be turned into a comeback.",
    hindi: "मेरा मानना है कि हर असफलता को वापसी में बदला जा सकता है।",
    domain: "Resilience", reverse: false },

  // ---------------------------
  // Mindset – 15
  // ---------------------------
  { text: "I believe abilities can always be developed with effort.",
    hindi: "मेरा मानना है कि क्षमताएँ हमेशा प्रयास से विकसित की जा सकती हैं।",
    domain: "Mindset", reverse: false },
  { text: "When I fail, I see it as a chance to learn.",
    hindi: "जब मैं असफल होता/होती हूँ, तो मैं इसे सीखने का अवसर मानता/मानती हूँ।",
    domain: "Mindset", reverse: false },
  { text: "Some people are just naturally talented; effort changes little.",
    hindi: "कुछ लोग स्वाभाविक रूप से प्रतिभाशाली होते हैं; प्रयास बहुत कम बदलाव करता है।",
    domain: "Mindset", reverse: true },
  { text: "I actively seek feedback even if it is critical.",
    hindi: "मैं सक्रिय रूप से प्रतिक्रिया माँगता/माँगती हूँ, भले ही वह आलोचनात्मक हो।",
    domain: "Mindset", reverse: false },
  { text: "I push myself to step out of my comfort zone regularly.",
    hindi: "मैं नियमित रूप से खुद को आरामदायक क्षेत्र से बाहर धकेलता/धकेलती हूँ।",
    domain: "Mindset", reverse: false },
  { text: "I believe intelligence is fixed and cannot change.",
    hindi: "मेरा मानना है कि बुद्धिमत्ता स्थिर है और इसे बदला नहीं जा सकता।",
    domain: "Mindset", reverse: true },
  { text: "I enjoy tackling difficult problems.",
    hindi: "मुझे कठिन समस्याओं का सामना करना पसंद है।",
    domain: "Mindset", reverse: false },
  { text: "I avoid challenges because I fear failure.",
    hindi: "मैं चुनौतियों से बचता/बचती हूँ क्योंकि मुझे असफलता का डर है।",
    domain: "Mindset", reverse: true },
  { text: "I reflect on my mistakes to improve in the future.",
    hindi: "मैं अपनी गलतियों पर विचार करता/करती हूँ ताकि भविष्य में सुधार कर सकूँ।",
    domain: "Mindset", reverse: false },
  { text: "I get discouraged when I don’t succeed immediately.",
    hindi: "जब मुझे तुरंत सफलता नहीं मिलती तो मैं हतोत्साहित हो जाता/जाती हूँ।",
    domain: "Mindset", reverse: true },
  { text: "I believe effort and persistence matter more than natural ability.",
    hindi: "मेरा मानना है कि प्रयास और दृढ़ता प्राकृतिक क्षमता से अधिक महत्वपूर्ण हैं।",
    domain: "Mindset", reverse: false },
  { text: "I quit tasks if they take too long to master.",
    hindi: "यदि किसी कार्य में महारत हासिल करने में अधिक समय लगता है तो मैं उसे छोड़ देता/देती हूँ।",
    domain: "Mindset", reverse: true },
  { text: "I set goals that push me to grow.",
    hindi: "मैं ऐसे लक्ष्य निर्धारित करता/करती हूँ जो मुझे बढ़ने के लिए प्रेरित करते हैं।",
    domain: "Mindset", reverse: false },
  { text: "I learn from others’ success instead of feeling threatened.",
    hindi: "मैं दूसरों की सफलता से सीखता/सीखती हूँ बजाय इसके कि खतरा महसूस करूँ।",
    domain: "Mindset", reverse: false },
  { text: "I think my potential is always expandable.",
    hindi: "मेरा मानना है कि मेरी क्षमता हमेशा बढ़ाई जा सकती है।",
    domain: "Mindset", reverse: false },

  // ---------------------------
  // Overthinking – 15
  // ---------------------------
  { text: "I often get stuck in loops of repetitive thinking that prevent action.",
    hindi: "मैं अक्सर बार-बार सोच में फंस जाता/जाती हूँ जिससे मैं कार्य नहीं कर पाता/पाती।",
    domain: "Overthinking", reverse: true },
  { text: "I spend more time planning than actually doing.",
    hindi: "मैं वास्तव में करने की बजाय योजना बनाने में अधिक समय बिताता/बिताती हूँ।",
    domain: "Overthinking", reverse: true },
  { text: "I find it difficult to switch off my thoughts when I want to relax.",
    hindi: "जब मैं आराम करना चाहता/चाहती हूँ, तब भी अपने विचार बंद करना मुश्किल होता है।",
    domain: "Overthinking", reverse: true },
  { text: "I use strategies (journaling, mindfulness) to clear my mind.",
    hindi: "मैं अपने मन को साफ करने के लिए रणनीतियों (डायरी लिखना, माइंडफुलनेस) का उपयोग करता/करती हूँ।",
    domain: "Overthinking", reverse: false },
  { text: "I can let go of small mistakes without replaying them in my head.",
    hindi: "मैं छोटी गलतियों को बार-बार सोचने की बजाय आसानी से जाने देता/देती हूँ।",
    domain: "Overthinking", reverse: false },
  { text: "I overanalyze simple situations.",
    hindi: "मैं सरल स्थितियों का भी अत्यधिक विश्लेषण करता/करती हूँ।",
    domain: "Overthinking", reverse: true },
  { text: "I delay decisions because I keep weighing all possibilities.",
    hindi: "मैं निर्णय लेने में देर करता/करती हूँ क्योंकि मैं सभी संभावनाओं का बार-बार तौलता/तौलती हूँ।",
    domain: "Overthinking", reverse: true },
  { text: "I can stop worrying when I realize it’s unproductive.",
    hindi: "जब मुझे एहसास होता है कि चिंता करना अनुपयोगी है तो मैं इसे रोक सकता/सकती हूँ।",
    domain: "Overthinking", reverse: false },
  { text: "I lose sleep because of overthinking.",
    hindi: "अत्यधिक सोचने के कारण मेरी नींद खराब हो जाती है।",
    domain: "Overthinking", reverse: true },
  { text: "I talk myself through difficult choices to calm my mind.",
    hindi: "मैं कठिन विकल्पों में खुद से बात करता/करती हूँ ताकि मेरा मन शांत हो सके।",
    domain: "Overthinking", reverse: false },
  { text: "I mentally replay conversations long after they end.",
    hindi: "मैं बातचीत खत्म होने के बाद भी लंबे समय तक उसे दोहराता/दोहराती रहता/रहती हूँ।",
    domain: "Overthinking", reverse: true },
  { text: "I distract myself with healthy activities when my mind gets stuck.",
    hindi: "जब मेरा मन अटक जाता है तो मैं स्वस्थ गतिविधियों से खुद को विचलित करता/करती हूँ।",
    domain: "Overthinking", reverse: false },
  { text: "I criticize myself harshly for small mistakes.",
    hindi: "मैं छोटी गलतियों के लिए खुद की कठोर आलोचना करता/करती हूँ।",
    domain: "Overthinking", reverse: true },
  { text: "I know when to stop gathering information and just act.",
    hindi: "मुझे पता है कि कब जानकारी इकट्ठा करना बंद करना है और बस कार्य करना है।",
    domain: "Overthinking", reverse: false },
  { text: "I feel paralyzed when I have too many choices.",
    hindi: "जब मेरे पास बहुत सारे विकल्प होते हैं तो मैं असहाय महसूस करता/करती हूँ।",
    domain: "Overthinking", reverse: true }
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
