// questions.js

const questionsData = {
  emotional: {
    title: "Emotional Intelligence",
    questions: [
      { en: "I can recognize my emotions easily.", hi: "मैं अपनी भावनाओं को आसानी से पहचान सकता हूँ।", bn: "আমি সহজেই আমার অনুভূতিগুলি চিনতে পারি।" },
      { en: "I can control impulses when upset.", hi: "मैं परेशान होने पर अपने आवेगों को नियंत्रित कर सकता हूँ।", bn: "আমি বিরক্ত হলে আমার আবেগ নিয়ন্ত্রণ করতে পারি।" },
      { en: "I understand others’ feelings in social situations.", hi: "मैं सामाजिक परिस्थितियों में दूसरों की भावनाओं को समझता हूँ।", bn: "আমি সামাজিক পরিস্থিতিতে অন্যদের অনুভূতি বুঝতে পারি।" },
      { en: "I manage stress effectively.", hi: "मैं तनाव को प्रभावी ढंग से संभालता हूँ।", bn: "আমি চাপ কার্যকরভাবে পরিচালনা করি।" },
      { en: "I stay calm during conflicts.", hi: "संघर्षों के दौरान मैं शांत रहता हूँ।", bn: "সংঘর্ষের সময় আমি শান্ত থাকি।" },
      { en: "I express my emotions appropriately.", hi: "मैं अपनी भावनाओं को उचित रूप से व्यक्त करता हूँ।", bn: "আমি আমার অনুভূতিগুলি সঠিকভাবে প্রকাশ করি।" },
      { en: "I reflect on my emotional reactions.", hi: "मैं अपनी भावनात्मक प्रतिक्रियाओं पर विचार करता हूँ।", bn: "আমি আমার আবেগীয় প্রতিক্রিয়াগুলি নিয়ে প্রতিফলন করি।" },
      { en: "I empathize with people easily.", hi: "मैं लोगों के प्रति आसानी से सहानुभूति रखता हूँ।", bn: "আমি সহজেই মানুষের প্রতি সহানুভূতিশীল হই।" },
      { en: "I can forgive others when needed.", hi: "जरूरत पड़ने पर मैं दूसरों को माफ कर सकता हूँ।", bn: "প্রয়োজন হলে আমি অন্যদের ক্ষমা করতে পারি।" },
      { en: "I adapt my emotions to situations.", hi: "मैं अपनी भावनाओं को परिस्थितियों के अनुसार ढाल सकता हूँ।", bn: "আমি পরিস্থিতির সাথে আমার অনুভূতিগুলি মানিয়ে নিতে পারি।" },
      { en: "I handle criticism constructively.", hi: "मैं आलोचना को रचनात्मक तरीके से संभालता हूँ।", bn: "আমি সমালোচনাকে রचनাত্মকভাবে গ্রহণ করি।" },
      { en: "I communicate feelings clearly.", hi: "मैं अपनी भावनाओं को स्पष्ट रूप से संप्रेषित करता हूँ।", bn: "আমি স্পষ্টভাবে আমার অনুভূতি প্রকাশ করি।" },
      { en: "I maintain emotional balance under pressure.", hi: "दबाव में मैं भावनात्मक संतुलन बनाए रखता हूँ।", bn: "চাপে আমি আবেগীয় ভারসাম্য বজায় রাখি।" },
      { en: "I notice subtle emotional cues in others.", hi: "मैं दूसरों में सूक्ष्म भावनात्मक संकेत देखता हूँ।", bn: "আমি অন্যদের সূক্ষ্ম আবেগীয় সংকেত লক্ষ্য করি।" },
      { en: "I regulate my emotional state daily.", hi: "मैं अपनी भावनाओं की स्थिति रोज़ नियंत्रित करता हूँ।", bn: "আমি প্রতিদিন আমার আবেগীয় অবস্থা নিয়ন্ত্রণ করি।" }
    ]
  },

  growth: {
    title: "Growth Mindset",
    questions: [
      { en: "I see challenges as opportunities to grow.", hi: "मैं चुनौतियों को विकास के अवसर के रूप में देखता हूँ।", bn: "আমি চ্যালেঞ্জকে বৃদ্ধির সুযোগ হিসাবে দেখি।" },
      { en: "I embrace feedback to improve myself.", hi: "मैं अपने सुधार के लिए प्रतिक्रिया स्वीकार करता हूँ।", bn: "আমি নিজেকে উন্নত করতে প্রতিক্রিয়া গ্রহণ করি।" },
      { en: "I take responsibility for my learning.", hi: "मैं अपनी सीखने की जिम्मेदारी लेता हूँ।", bn: "আমি আমার শিক্ষার জন্য দায়িত্ব গ্রহণ করি।" },
      { en: "I believe abilities can improve with effort.", hi: "मुझे विश्वास है कि प्रयास से मेरी क्षमताएँ बढ़ सकती हैं।", bn: "আমি বিশ্বাস করি যে চেষ্টা করে আমার দক্ষতা উন্নত হতে পারে।" },
      { en: "I persevere through obstacles.", hi: "मैं बाधाओं के बावजूद दृढ़ता से आगे बढ़ता हूँ।", bn: "আমি বাধা সত্ত্বেও দৃঢ়তার সাথে এগিয়ে যাই।" },
      { en: "I set realistic growth goals.", hi: "मैं यथार्थवादी विकास लक्ष्य निर्धारित करता हूँ।", bn: "আমি বাস্তবসম্মত বৃদ্ধির লক্ষ্য স্থাপন করি।" },
      { en: "I enjoy learning new skills.", hi: "मैं नई क्षमताएँ सीखने का आनंद लेता हूँ।", bn: "আমি নতুন দক্ষতা শেখার আনন্দ উপভোগ করি।" },
      { en: "I adapt to change positively.", hi: "मैं सकारात्मक रूप से परिवर्तन के अनुकूल होता हूँ।", bn: "আমি ইতিবাচকভাবে পরিবর্তনের সাথে মানিয়ে নিই।" },
      { en: "I focus on solutions rather than problems.", hi: "मैं समस्याओं के बजाय समाधान पर ध्यान केंद्रित करता हूँ।", bn: "আমি সমস্যার চেয়ে সমাধানে মনোযোগ দিই।" },
      { en: "I reflect on failures to learn.", hi: "मैं सीखने के लिए असफलताओं पर विचार करता हूँ।", bn: "আমি শেখার জন্য ব্যর্থতার উপর প্রতিফলন করি।" },
      { en: "I take initiative in personal development.", hi: "मैं व्यक्तिगत विकास में पहल करता हूँ।", bn: "আমি ব্যক্তিগত উন্নয়নে উদ্যোগী হই।" },
      { en: "I stay motivated despite setbacks.", hi: "मैं असफलताओं के बावजूद प्रेरित रहता हूँ।", bn: "আমি ব্যর্থতা সত্ত্বেও অনুপ্রাণিত থাকি।" },
      { en: "I seek knowledge actively.", hi: "मैं सक्रिय रूप से ज्ञान प्राप्त करता हूँ।", bn: "আমি সক্রিয়ভাবে জ্ঞান অর্জন করি।" },
      { en: "I celebrate progress, not just results.", hi: "मैं केवल परिणाम नहीं, बल्कि प्रगति का भी जश्न मनाता हूँ।", bn: "আমি কেবল ফলাফল নয়, প্রগতি উদযাপন করি।" },
      { en: "I am open to constructive criticism.", hi: "मैं रचनात्मक आलोचना के लिए खुला हूँ।", bn: "আমি গঠনমূলক সমালোচনার জন্য খোলা।" }
    ]
  },

  overthinking: {
    title: "Overthinking Pattern",
    questions: [
      { en: "I replay past events repeatedly in my mind.", hi: "मैं अतीत की घटनाओं को बार-बार याद करता हूँ।", bn: "আমি অতীতের ঘটনাগুলি বারবার মনে করি।" },
      { en: "I worry excessively about the future.", hi: "मैं भविष्य के बारे में अत्यधिक चिंता करता हूँ।", bn: "আমি ভবিষ্যতের বিষয়ে অতিরিক্ত চিন্তিত হই।" },
      { en: "I struggle to make decisions quickly.", hi: "मैं जल्दी निर्णय लेने में कठिनाई महसूस करता हूँ।", bn: "আমি দ্রুত সিদ্ধান্ত নিতে অসুবিধা বোধ করি।" },
      { en: "I analyze minor details obsessively.", hi: "मैं छोटे विवरणों का अत्यधिक विश्लेषण करता हूँ।", bn: "আমি ছোটখাটো বিশদ অতিরিক্তভাবে বিশ্লেষণ করি।" },
      { en: "I doubt my choices frequently.", hi: "मैं अक्सर अपने विकल्पों पर संदेह करता हूँ।", bn: "আমি প্রায়ই আমার পছন্দ নিয়ে সন্দেহ করি।" },
      { en: "I feel mentally exhausted due to constant thinking.", hi: "लगातार सोचने के कारण मैं मानसिक रूप से थक जाता हूँ।", bn: "ক্রমাগত চিন্তার কারণে আমি মানসিকভাবে ক্লান্ত হয়ে যাই।" },
      { en: "I find it hard to relax my mind.", hi: "मैं अपना मन शांत करना मुश्किल पाता हूँ।", bn: "আমার মনকে শান্ত করা কঠিন মনে হয়।" },
      { en: "I ruminate over conversations or conflicts.", hi: "मैं बातचीत या संघर्षों के बारे में बार-बार सोचता हूँ।", bn: "আমি কথোপকথন বা সংঘাত নিয়ে বারবার চিন্তা করি।" },
      { en: "I fear making mistakes.", hi: "मैं गलतियाँ करने से डरता हूँ।", bn: "আমি ভুল করার ভয় পাই।" },
      { en: "I imagine worst-case scenarios often.", hi: "मैं अक्सर सबसे खराब स्थिति की कल्पना करता हूँ।", bn: "আমি প্রায়ই সবচেয়ে খারাপ পরিস্থিতি কল্পনা করি।" },
      { en: "I procrastinate due to overanalyzing.", hi: "मैं अधिक विश्लेषण के कारण कार्य स्थगित करता हूँ।", bn: "আমি অতিরিক্ত বিশ্লেষণের কারণে কাজ স্থগিত করি।" },
      { en: "I compare myself with others constantly.", hi: "मैं खुद की तुलना लगातार दूसरों से करता हूँ।", bn: "আমি নিজেকে ক্রমাগত অন্যদের সঙ্গে তুলনা করি।" },
      { en: "I struggle to focus because of racing thoughts.", hi: "तेज़ सोच के कारण मैं ध्यान केंद्रित नहीं कर पाता।", bn: "দ্রুত চিন্তার কারণে আমি মনোযোগ রাখতে পারি না।" },
      { en: "I feel anxious about small uncertainties.", hi: "मैं छोटी अनिश्चितताओं के बारे में चिंतित महसूस करता हूँ।", bn: "আমি ছোট অনিশ্চয়তা নিয়ে উদ্বিগ্ন বোধ করি।" },
      { en: "I plan excessively before taking action.", hi: "मैं कार्रवाई करने से पहले अत्यधिक योजना बनाता हूँ।", bn: "আমি কাজ শুরু করার আগে অতিরিক্ত পরিকল্পনা করি।" }
    ]
  },

  resilience: {
    title: "Resilience",
    questions: [
      { en: "I recover quickly from setbacks.", hi: "मैं असफलताओं से जल्दी उबर जाता हूँ।", bn: "আমি ব্যর্থতা থেকে দ্রুত পুনরুদ্ধার করি।" },
      { en: "I stay optimistic during challenges.", hi: "मैं चुनौतियों के दौरान आशावादी रहता हूँ।", bn: "আমি চ্যালেঞ্জের সময় আশাবাদী থাকি।" },
      { en: "I adapt well to unexpected changes.", hi: "मैं अप्रत्याशित परिवर्तनों के अनुकूल ढल जाता हूँ।", bn: "আমি অপ্রত্যাশিত পরিবর্তনের সাথে ভালভাবে মানিয়ে নিই।" },
      { en: "I maintain motivation under stress.", hi: "मैं तनाव में प्रेरित रहता हूँ।", bn: "আমি চাপের মধ্যে অনুপ্রাণিত থাকি।" },
      { en: "I find solutions when faced with obstacles.", hi: "मैं बाधाओं का सामना करते समय समाधान ढूंढता हूँ।", bn: "আমি বাধার সম্মুখীন হলে সমাধান খুঁজি।" },
      { en: "I learn from failures and move forward.", hi: "मैं असफलताओं से सीखता हूँ और आगे बढ़ता हूँ।", bn: "আমি ব্যর্থতা থেকে শিখি এবং এগিয়ে যাই।" },
      { en: "I keep calm in high-pressure situations.", hi: "मैं उच्च दबाव वाली परिस्थितियों में शांत रहता हूँ।", bn: "আমি উচ্চ চাপের পরিস্থিতিতে শান্ত থাকি।" },
      { en: "I rely on personal strengths during tough times.", hi: "मैं कठिन समय में अपनी व्यक्तिगत ताकत पर निर्भर करता हूँ।", bn: "কঠিন সময়ে আমি আমার ব্যক্তিগত শক্তির উপর নির্ভর করি।" },
      { en: "I seek help when needed without hesitation.", hi: "मैं आवश्यकता होने पर बिना हिचक मदद मांगता हूँ।", bn: "প্রয়োজন হলে আমি দ্বিধা ছাড়াই সাহায্য চাই।" },
      { en: "I stay focused on long-term goals despite setbacks.", hi: "मैं असफलताओं के बावजूद दीर्घकालिक लक्ष्यों पर ध्यान केंद्रित रहता हूँ।", bn: "আমি ব্যর্থতা সত্ত্বেও দীর্ঘমেয়াদী লক্ষ্যগুলিতে মনোনিবেশ করি।" },
      { en: "I maintain emotional stability under pressure.", hi: "मैं दबाव में भावनात्मक स्थिरता बनाए रखता हूँ।", bn: "চাপে আমি আবেগীয় স্থিতিশীলতা বজায় রাখি।" },
      { en: "I bounce back quickly from emotional distress.", hi: "मैं भावनात्मक संकट से जल्दी उबर जाता हूँ।", bn: "আমি আবেগীয় কষ্ট থেকে দ্রুত ফিরে আসি।" },
      { en: "I approach problems with a solution-oriented mindset.", hi: "मैं समस्याओं को समाधान-उन्मुख मानसिकता के साथ हल करता हूँ।", bn: "আমি সমস্যা সমাধানমুখী মনোভাব নিয়ে মোকাবিলা করি।" },
      { en: "I maintain confidence even after failures.", hi: "मैं असफलताओं के बाद भी आत्मविश्वास बनाए रखता हूँ।", bn: "আমি ব্যর্থতার পরও আত্মবিশ্বাস বজায় রাখি।" },
      { en: "I stay resilient during stressful periods.", hi: "मैं तनावपूर्ण समय के दौरान लचीला रहता हूँ।", bn: "আমি চাপপূর্ণ সময়ে স্থিতিস্থাপক থাকি।" }
    ]
  }
};
