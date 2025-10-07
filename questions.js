// questions.js

const questionsData = {
  emotional: {
    en: {
      categoryTitle: "Emotional Awareness",
      questions: [
        "I can easily recognize when I’m feeling sad or anxious.",
        "I find it hard to explain my emotions to others.",
        "I take time to process how I truly feel before reacting.",
        "I often feel emotions without knowing exactly why.",
        "I can sense when my mood is affecting others around me.",
        "I avoid situations that might make me feel emotionally uncomfortable.",
        "I try to hide my emotions even when I’m deeply affected.",
        "I can recognize when someone else is upset even if they don’t say it.",
        "I reflect on emotional experiences to understand myself better.",
        "I feel emotionally drained after dealing with other people’s problems.",
        "I get overwhelmed by emotions easily.",
        "I can quickly calm myself when I get upset.",
        "I find it easy to talk about how I feel.",
        "I notice how my emotions affect my physical energy.",
        "I tend to ignore my emotions and move on quickly."
      ]
    },
    hi: {
      categoryTitle: "भावनात्मक जागरूकता",
      questions: [
        "मैं आसानी से पहचान लेता हूँ जब मैं दुखी या चिंतित महसूस करता हूँ।",
        "मुझे दूसरों को अपनी भावनाएँ समझाना मुश्किल लगता है।",
        "मैं प्रतिक्रिया देने से पहले अपनी भावनाओं को समझने की कोशिश करता हूँ।",
        "कभी-कभी मुझे अपनी भावनाओं का कारण समझ नहीं आता।",
        "मैं महसूस कर सकता हूँ कि मेरा मूड दूसरों को प्रभावित कर रहा है।",
        "मैं ऐसी स्थितियों से बचता हूँ जो मुझे भावनात्मक रूप से असहज बना सकती हैं।",
        "मैं अपनी भावनाओं को छिपाने की कोशिश करता हूँ, भले ही मैं अंदर से बहुत प्रभावित हूँ।",
        "मैं पहचान सकता हूँ जब कोई और परेशान है, भले ही वह कुछ न कहे।",
        "मैं अपनी भावनात्मक घटनाओं पर विचार करता हूँ ताकि खुद को बेहतर समझ सकूँ।",
        "दूसरों की समस्याएँ सुनकर मैं भावनात्मक रूप से थक जाता हूँ।",
        "मैं आसानी से भावनाओं से अभिभूत हो जाता हूँ।",
        "जब मैं परेशान होता हूँ, तो मैं जल्दी खुद को शांत कर लेता हूँ।",
        "मुझे अपनी भावनाओं के बारे में बात करना आसान लगता है।",
        "मैं नोटिस करता हूँ कि मेरी भावनाएँ मेरे शारीरिक ऊर्जा को प्रभावित करती हैं।",
        "मैं अक्सर अपनी भावनाओं को नज़रअंदाज़ करता हूँ और आगे बढ़ जाता हूँ।"
      ]
    },
    bn: {
      categoryTitle: "আবেগীয় সচেতনতা",
      questions: [
        "আমি সহজেই বুঝতে পারি যখন আমি দুঃখিত বা উদ্বিগ্ন থাকি।",
        "আমার জন্য আমার আবেগ অন্যদের বোঝানো কঠিন।",
        "আমি প্রতিক্রিয়া জানানোর আগে আমার অনুভূতিগুলি বিশ্লেষণ করি।",
        "অনেক সময় আমি জানি না কেন আমি কোনো আবেগ অনুভব করছি।",
        "আমি বুঝতে পারি আমার মেজাজ অন্যদের প্রভাবিত করছে।",
        "আমি এমন পরিস্থিতি এড়িয়ে যাই যা আমাকে আবেগিকভাবে অস্বস্তিকর করতে পারে।",
        "আমি আমার আবেগ লুকানোর চেষ্টা করি যদিও ভিতরে কষ্ট পাই।",
        "আমি বুঝতে পারি কেউ কষ্টে আছে, যদিও সে কিছু বলে না।",
        "আমি আবেগীয় অভিজ্ঞতা নিয়ে চিন্তা করি নিজেকে বোঝার জন্য।",
        "অন্যদের সমস্যা শুনে আমি মানসিকভাবে ক্লান্ত হয়ে পড়ি।",
        "আমি সহজেই আবেগে ভেসে যাই।",
        "আমি দ্রুত শান্ত হতে পারি যখন রেগে যাই।",
        "আমি আমার অনুভূতি নিয়ে কথা বলতে স্বাচ্ছন্দ্যবোধ করি।",
        "আমি লক্ষ্য করি আমার আবেগ আমার শক্তিকে প্রভাবিত করে।",
        "আমি আমার আবেগ উপেক্ষা করি এবং এগিয়ে যাই।"
      ]
    }
  },

  growth: {
    en: {
      categoryTitle: "Growth Mindset",
      questions: [
        "I believe I can always improve with consistent effort.",
        "I see failures as opportunities to learn.",
        "I feel excited about learning new things even if they’re hard.",
        "I compare my progress with my own past, not others.",
        "I get discouraged easily when I don’t see results quickly.",
        "I believe talent matters more than effort.",
        "I reflect on mistakes to understand how to do better next time.",
        "I appreciate constructive feedback even if it’s hard to hear.",
        "I keep trying even when I feel like giving up.",
        "I feel proud when I see progress, no matter how small.",
        "I believe intelligence can grow with time and learning.",
        "I try to step out of my comfort zone regularly.",
        "I learn something valuable even from failures.",
        "I believe effort is the path to mastery.",
        "I feel uncomfortable when I’m not growing or learning."
      ]
    },
    hi: {
      categoryTitle: "विकास मानसिकता",
      questions: [
        "मेरा मानना है कि लगातार प्रयास से मैं हमेशा बेहतर हो सकता हूँ।",
        "मैं असफलताओं को सीखने का अवसर मानता हूँ।",
        "नई चीजें सीखने को लेकर मैं उत्साहित रहता हूँ, भले ही वे कठिन हों।",
        "मैं अपनी प्रगति की तुलना केवल अपने पिछले स्तर से करता हूँ।",
        "जब तुरंत परिणाम नहीं दिखते तो मैं जल्दी हताश हो जाता हूँ।",
        "मेरा मानना है कि प्रतिभा प्रयास से अधिक महत्वपूर्ण है।",
        "मैं गलतियों से सीखने की कोशिश करता हूँ।",
        "मैं रचनात्मक प्रतिक्रिया को स्वीकार करता हूँ, भले ही वह कठोर लगे।",
        "मैं तब तक प्रयास करता रहता हूँ जब तक मैं हार नहीं मान लेता।",
        "मैं छोटी से छोटी प्रगति पर भी गर्व महसूस करता हूँ।",
        "मेरा विश्वास है कि बुद्धि समय और सीख से बढ़ सकती है।",
        "मैं नियमित रूप से अपने कम्फर्ट ज़ोन से बाहर आने की कोशिश करता हूँ।",
        "मैं असफलताओं से भी कुछ मूल्यवान सीखता हूँ।",
        "मेरा मानना है कि मेहनत ही निपुणता का रास्ता है।",
        "जब मैं नहीं बढ़ रहा होता तो असहज महसूस करता हूँ।"
      ]
    },
    bn: {
      categoryTitle: "বিকাশ মনোভাব",
      questions: [
        "আমি বিশ্বাস করি নিয়মিত প্রচেষ্টায় আমি সবসময় উন্নতি করতে পারি।",
        "আমি ব্যর্থতাকে শেখার সুযোগ হিসেবে দেখি।",
        "কঠিন হলেও নতুন কিছু শেখা আমাকে উৎসাহিত করে।",
        "আমি আমার অগ্রগতির তুলনা নিজের অতীতের সঙ্গে করি।",
        "যখন দ্রুত ফল দেখি না, আমি সহজেই হতাশ হয়ে যাই।",
        "আমি মনে করি প্রতিভা প্রচেষ্টার চেয়ে বেশি গুরুত্বপূর্ণ।",
        "আমি ভুল থেকে শিখতে চেষ্টা করি।",
        "আমি গঠনমূলক সমালোচনা গ্রহণ করি, যদিও শুনতে কষ্ট হয়।",
        "আমি চেষ্টা চালিয়ে যাই, যতক্ষণ না সফল হই।",
        "আমি ছোটো অগ্রগতিতেও গর্ববোধ করি।",
        "আমি বিশ্বাস করি বুদ্ধিমত্তা শেখার মাধ্যমে বাড়ানো যায়।",
        "আমি প্রায়ই নিজের কমফোর্ট জোনের বাইরে যেতে চেষ্টা করি।",
        "আমি ব্যর্থতা থেকেও কিছু শিখি।",
        "আমি বিশ্বাস করি প্রচেষ্টা পারদর্শিতার পথ।",
        "যখন আমি বাড়ছি না তখন অস্বস্তি বোধ করি।"
      ]
    }
  },

  resilience: {
    en: {
      categoryTitle: "Resilience & Coping",
      questions: [
        "I stay calm during stressful situations.",
        "I bounce back quickly after setbacks.",
        "I try to find solutions instead of focusing on problems.",
        "I believe challenges make me stronger.",
        "I tend to lose motivation when things get tough.",
        "I try to stay positive even when everything seems uncertain.",
        "I can adapt when plans don’t work out.",
        "I seek help when I feel overwhelmed.",
        "I focus on what I can control, not what I can’t.",
        "I handle criticism without losing confidence.",
        "I remind myself that tough times don’t last forever.",
        "I can see the good side even in bad situations.",
        "I use humor to cope with difficulties.",
        "I recover emotionally after disappointments.",
        "I believe every experience teaches me something."
      ]
    },
    hi: {
      categoryTitle: "लचीलापन और सामना करने की क्षमता",
      questions: [
        "तनावपूर्ण परिस्थितियों में मैं शांत रहता हूँ।",
        "मैं असफलताओं के बाद जल्दी संभल जाता हूँ।",
        "मैं समस्याओं पर नहीं बल्कि समाधान पर ध्यान देता हूँ।",
        "मेरा मानना है कि चुनौतियाँ मुझे मजबूत बनाती हैं।",
        "जब चीजें कठिन हो जाती हैं तो मैं प्रेरणा खो देता हूँ।",
        "अनिश्चितता के समय मैं सकारात्मक रहने की कोशिश करता हूँ।",
        "जब योजनाएँ असफल होती हैं तो मैं खुद को ढाल लेता हूँ।",
        "जब मैं अभिभूत महसूस करता हूँ तो मदद माँगता हूँ।",
        "मैं उस पर ध्यान देता हूँ जिसे मैं नियंत्रित कर सकता हूँ।",
        "मैं आलोचना से अपना आत्मविश्वास नहीं खोता।",
        "मैं खुद को याद दिलाता हूँ कि कठिन समय हमेशा नहीं रहता।",
        "मैं बुरी स्थितियों में भी कुछ अच्छा देखने की कोशिश करता हूँ।",
        "मैं मुश्किलों से निपटने के लिए हास्य का उपयोग करता हूँ।",
        "मैं निराशा के बाद भावनात्मक रूप से उभर जाता हूँ।",
        "मेरा विश्वास है कि हर अनुभव कुछ सिखाता है।"
      ]
    },
    bn: {
      categoryTitle: "সহনশীলতা ও মানিয়ে নেওয়া",
      questions: [
        "চাপের সময় আমি শান্ত থাকি।",
        "আমি ব্যর্থতার পরে দ্রুত পুনরুদ্ধার করি।",
        "আমি সমস্যার পরিবর্তে সমাধানে মনোযোগ দিই।",
        "আমি বিশ্বাস করি চ্যালেঞ্জ আমাকে শক্তিশালী করে।",
        "বিপদে পড়লে আমি সহজেই অনুপ্রেরণা হারাই।",
        "আমি অনিশ্চিত অবস্থাতেও ইতিবাচক থাকার চেষ্টা করি।",
        "পরিকল্পনা ব্যর্থ হলে আমি নিজেকে মানিয়ে নিই।",
        "অতিরিক্ত চাপে আমি সাহায্য চাই।",
        "আমি যেটা নিয়ন্ত্রণ করতে পারি সেটার ওপর ফোকাস করি।",
        "সমালোচনায় আমি আত্মবিশ্বাস হারাই না।",
        "আমি নিজেকে মনে করাই, কঠিন সময় চিরকাল থাকে না।",
        "আমি খারাপ অবস্থাতেও ভালো দিক খুঁজে বের করার চেষ্টা করি।",
        "আমি হাস্যরস ব্যবহার করে কষ্টের সঙ্গে মোকাবিলা করি।",
        "আমি হতাশার পর আবার মানসিকভাবে শক্ত হই।",
        "আমি বিশ্বাস করি প্রতিটি অভিজ্ঞতা কিছু শেখায়।"
      ]
    }
  },

  overthinking: {
    en: {
      categoryTitle: "Overthinking & Clarity",
      questions: [
        "I replay past mistakes in my mind repeatedly.",
        "I struggle to make decisions fearing I might be wrong.",
        "I spend a lot of time thinking about what others think of me.",
        "I find it hard to relax because my mind keeps running.",
        "I overanalyze even simple situations.",
        "I think about conversations long after they’ve happened.",
        "I imagine worst-case scenarios frequently.",
        "I try to mentally prepare for every possible outcome.",
        "I find myself stuck in 'what if' thoughts often.",
        "I worry about things that are beyond my control.",
        "I wish I could switch off my thoughts sometimes.",
        "I feel mentally exhausted from thinking too much.",
        "I seek reassurance from others to feel calm.",
        "I struggle to stay in the present moment.",
        "I often think more and act less."
      ]
    },
    hi: {
      categoryTitle: "अधिक सोच और स्पष्टता",
      questions: [
        "मैं बार-बार अपने पिछले गलतियों के बारे में सोचता हूँ।",
        "मैं निर्णय लेने में हिचकिचाता हूँ क्योंकि गलती का डर रहता है।",
        "मैं अक्सर सोचता हूँ कि लोग मेरे बारे में क्या सोचते हैं।",
        "मुझे आराम करना मुश्किल लगता है क्योंकि मेरा दिमाग लगातार चलता रहता है।",
        "मैं साधारण चीज़ों को भी ज़रूरत से ज़्यादा सोचता हूँ।",
        "मैं बातचीत के बाद भी लंबे समय तक उसे याद करता रहता हूँ।",
        "मैं अक्सर सबसे बुरे परिणाम की कल्पना करता हूँ।",
        "मैं हर स्थिति के लिए मानसिक रूप से तैयार रहने की कोशिश करता हूँ।",
        "मैं अक्सर 'क्या हो अगर' जैसे विचारों में फँस जाता हूँ।",
        "मैं उन चीजों की चिंता करता हूँ जो मेरे नियंत्रण से बाहर हैं।",
        "काश मैं अपने विचारों को बंद कर पाता।",
        "ज़्यादा सोचने से मैं मानसिक रूप से थक जाता हूँ।",
        "मैं शांत रहने के लिए दूसरों से आश्वासन चाहता हूँ।",
        "मैं वर्तमान क्षण में रहना मुश्किल पाता हूँ।",
        "मैं अक्सर सोचता ज़्यादा हूँ और करता कम।"
      ]
    },
    bn: {
      categoryTitle: "অতিরিক্ত চিন্তা ও স্বচ্ছতা",
      questions: [
        "আমি বারবার অতীতের ভুল নিয়ে ভাবি।",
        "ভুল হওয়ার ভয়ে সিদ্ধান্ত নিতে কষ্ট হয়।",
        "আমি ভাবি অন্যরা আমার সম্পর্কে কী ভাবছে।",
        "আমি বিশ্রাম নিতে পারি না কারণ মস্তিষ্ক সবসময় চলতে থাকে।",
        "আমি সাধারণ বিষয় নিয়েও বেশি ভাবি।",
        "আমি কথোপকথন শেষ হওয়ার পরও তা নিয়ে চিন্তা করি।",
        "আমি প্রায়ই সবচেয়ে খারাপ পরিস্থিতি কল্পনা করি।",
        "আমি প্রতিটি ফলাফলের জন্য মানসিকভাবে প্রস্তুতি নিই।",
        "আমি প্রায়ই 'যদি এমন হয়' চিন্তায় আটকে যাই।",
        "আমি এমন বিষয় নিয়ে উদ্বিগ্ন হই যা আমার নিয়ন্ত্রণে নয়।",
        "আমি চাই কখনও কখনও আমার চিন্তাগুলো বন্ধ করতে পারতাম।",
        "অতিরিক্ত চিন্তায় আমি মানসিকভাবে ক্লান্ত হয়ে পড়ি।",
        "আমি শান্ত থাকার জন্য অন্যদের কাছ থেকে আশ্বাস চাই।",
        "আমি বর্তমান মুহূর্তে থাকা কঠিন মনে করি।",
        "আমি প্রায়ই বেশি ভাবি কিন্তু কম কাজ করি।"
      ]
    }
  }
};

export default questionsData;
