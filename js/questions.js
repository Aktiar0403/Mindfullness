// js/questions.js - Multi-language Support with Examples

const questions = {
    "Emotional": {
        "Self-Awareness": [
            { 
                q: {
                    en: "I can accurately identify my emotions as I experience them",
                    bn: "আমি আমার অনুভূতিগুলো সঠিকভাবে চিনতে পারি যখন আমি সেগুলো অনুভব করি",
                    hi: "मैं अपनी भावनाओं को सही ढंग से पहचान सकता हूं जब मैं उन्हें अनुभव करता हूं"
                },
                example: {
                    en: "If a colleague gets a promotion you also wanted, can you tell if you're feeling primarily sad (disappointed), angry (it's unfair), or anxious (worried about your own future)?",
                    bn: "যদি একজন সহকর্মী এমন একটি পদোন্নতি পায় যা আপনি চেয়েছিলেন, আপনি বলতে পারবেন কি আপনি প্রাথমিকভাবে দুঃখিত (হতাশ), রাগান্বিত (এটা অন্যায়) বা উদ্বিগ্ন (আপনার নিজের ভবিষ্যত নিয়ে চিন্তিত) বোধ করছেন?",
                    hi: "यदि एक सहकर्मी को वह पदोन्नति मिलती है जो आप भी चाहते थे, क्या आप बता सकते हैं कि आप मुख्य रूप से दुखी (निराश), क्रोधित (यह अनुचित है), या चिंतित (अपने भविष्य को लेकर चिंतित) महसूस कर रहे हैं?"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I understand what causes my emotional reactions",
                    bn: "আমি বুঝি কী কারণে আমার আবেগজনিত প্রতিক্রিয়া হয়",
                    hi: "मैं समझता हूं कि मेरी भावनात्मक प्रतिक्रियाओं का कारण क्या है"
                },
                example: {
                    en: "You snap at a family member for a minor reason. Do you realize it's not about them, but because you're actually stressed about a looming work deadline?",
                    bn: "আপনি একটি ছোটখাটো কারণে একটি পরিবারের সদস্যের উপর চিৎকার করেন। আপনি কি বুঝতে পারেন যে এটা তাদের সম্পর্কে নয়, বরং কারণ আপনি আসলে একটি আসন্ন কাজের সময়সীমা নিয়ে চাপে আছেন?",
                    hi: "आप एक मामूली कारण से परिवार के किसी सदस्य पर चिल्लाते हैं। क्या आपको एहसास है कि यह उनके बारे में नहीं है, बल्कि इसलिए कि आप वास्तव में काम की आसन्न समय सीमा को लेकर तनाव में हैं?"
                },
                weight: 1.1 
            },
            { 
                q: {
                    en: "I recognize how my emotions affect my thoughts and decisions",
                    bn: "আমি বুঝি আমার আবেগ কীভাবে আমার চিন্তাভাবনা এবং সিদ্ধান্তকে প্রভাবিত করে",
                    hi: "मैं पहचानता हूं कि मेरी भावनाएं मेरे विचारों और निर्णयों को कैसे प्रभावित करती हैं"
                },
                example: {
                    en: "When you're in a great mood, do you notice you're more likely to say 'yes' to new plans, but when you're tired, you tend to see more problems in every idea?",
                    bn: "যখন আপনি দুর্দান্ত মূডে থাকেন, আপনি কি লক্ষ্য করেন যে আপনি নতুন পরিকল্পনায় 'হ্যাঁ' বলতে বেশি ইচ্ছুক, কিন্তু যখন আপনি ক্লান্ত থাকেন, আপনি প্রতিটি ধারণায় আরও সমস্যা দেখতে পাচ্ছেন?",
                    hi: "जब आप बहुत अच्छे मूड में होते हैं, तो क्या आप देखते हैं कि आप नई योजनाओं के लिए 'हाँ' कहने की अधिक संभावना रखते हैं, लेकिन जब आप थके होते हैं, तो आप हर विचार में अधिक समस्याएं देखते हैं?"
                },
                weight: 1.3 
            }
        ],
        "Self-Regulation": [
            { 
                q: {
                    en: "I can manage disruptive emotions and impulses effectively",
                    bn: "আমি বিঘ্নিত আবেগ এবং আবেগকে কার্যকরভাবে পরিচালনা করতে পারি",
                    hi: "मैं विघटनकारी भावनाओं और आवेगों को प्रभावी ढंग से प्रबंधित कर सकता हूं"
                },
                example: {
                    en: "When you feel a surge of anger in a heated discussion, can you stop yourself from sending that harsh text or making a hurtful comment, and instead take a deep breath?",
                    bn: "একটি উত্তপ্ত আলোচনায় যখন আপনি রাগের একটি ঢেউ অনুভব করেন, আপনি কি সেই কঠোর টেক্সট পাঠানো বা একটি ক্ষতিকর মন্তব্য করা থেকে নিজেকে বিরত রাখতে পারেন এবং পরিবর্তে একটি গভীর শ্বাস নিতে পারেন?",
                    hi: "जब आप गर्मजोशी की चर्चा में क्रोध की लहर महसूस करते हैं, तो क्या आप उस कठोर पाठ को भेजने या दुखद टिप्पणी करने से खुद को रोक सकते हैं, और इसके बजाय गहरी सांस ले सकते हैं?"
                },
                weight: 1.4 
            },
            { 
                q: {
                    en: "I remain calm under pressure and think clearly",
                    bn: "চাপের মধ্যেও আমি শান্ত থাকি এবং স্পষ্টভাবে চিন্তা করি",
                    hi: "मैं दबाव में शांत रहता हूं और स्पष्ट रूप से सोचता हूं"
                },
                example: {
                    en: "Your computer crashes right before you need to submit an important project. Instead of panicking, you systematically start your recovery steps and inform your boss.",
                    bn: "একটি গুরুত্বপূর্ণ প্রকল্প জমা দেওয়ার ঠিক আগে আপনার কম্পিউটার ক্র্যাশ করে। আতঙ্কিত হওয়ার পরিবর্তে, আপনি পদ্ধতিগতভাবে আপনার পুনরুদ্ধারের পদক্ষেপগুলি শুরু করেন এবং আপনার বসকে জানান।",
                    hi: "आपके कंप्यूटर में एक महत्वपूर्ण प्रोजेक्ट जमा करने से ठीक पहले क्रैश हो जाता है। घबराने के बजाय, आप व्यवस्थित रूप से अपनी रिकवरी के कदम शुरू करते हैं और अपने बॉस को सूचित करते हैं।"
                },
                weight: 1.5 
            },
            { 
                q: {
                    en: "I adapt easily to changing situations",
                    bn: "পরিবর্তনশীল পরিস্থিতিতে আমি সহজেই খাপ খাইয়ে নিতে পারি",
                    hi: "मैं बदलती परिस्थितियों के अनुकूल आसानी से ढल जाता हूं"
                },
                example: {
                    en: "Your weekend plans get suddenly canceled due to rain. Are you able to quickly think of and feel good about a fun 'Plan B' to do at home?",
                    bn: "বৃষ্টির কারণে আপনার সপ্তাহান্তের পরিকল্পনা হঠাৎ বাতিল হয়ে যায়। আপনি কি দ্রুত বাড়িতে করার জন্য একটি মজার 'প্ল্যান বি' নিয়ে চিন্তা করতে এবং এটিকে নিয়ে ভাল বোধ করতে সক্ষম?",
                    hi: "बारिश के कारण आपकी सप्ताहांत की योजनाएं अचानक रद्द हो जाती हैं। क्या आप घर पर करने के लिए एक मजेदार 'योजना बी' के बारे में जल्दी से सोचने और अच्छा महसूस करने में सक्षम हैं?"
                },
                weight: 1.2 
            }
        ],
        "Empathy": [
            { 
                q: {
                    en: "I can sense what others are feeling without being told",
                    bn: "কাউকে কিছু না বললেও আমি বুঝতে পারি অন্যরা কী অনুভব করছে",
                    hi: "मैं बिना बताए महसूस कर सकता हूं कि दूसरे क्या महसूस कर रहे हैं"
                },
                example: {
                    en: "You notice a friend is laughing, but their smile doesn't reach their eyes and they're quieter than usual. Can you sense they might be feeling down, even if they say 'I'm fine'?",
                    bn: "আপনি লক্ষ্য করেন যে একজন বন্ধু হাসছে, কিন্তু তাদের হাসি তাদের চোখে পৌঁছায় না এবং তারা স্বাভাবিকের চেয়ে বেশি শান্ত। তারা যদি 'আমি ঠিক আছি'ও বলে, তবুও আপনি কি অনুভব করতে পারেন যে তারা হয়তো খারাপ বোধ করছে?",
                    hi: "आप देखते हैं कि एक दोस्त हंस रहा है, लेकिन उसकी मुस्कान उसकी आंखों तक नहीं पहुंचती और वह सामान्य से अधिक शांत है। क्या आप महसूस कर सकते हैं कि वह नीचे महसूस कर रहा होगा, भले ही वह कहे 'मैं ठीक हूं'?"
                },
                weight: 1.1 
            },
            { 
                q: {
                    en: "I understand others' perspectives even when different from mine",
                    bn: "আমার থেকে ভিন্ন হলেও আমি অন্যদের দৃষ্টিভঙ্গি বুঝতে পারি",
                    hi: "मैं दूसरों के दृष्टिकोण को समझता हूं भले ही वे मेरे से अलग हों"
                },
                example: {
                    en: "In a debate about remote work, can you genuinely understand why your colleague, who has young kids at home, prefers the office, even if you work better from home?",
                    bn: "রিমোট কাজ নিয়ে একটি বিতর্কে, আপনি কি সত্যিই বুঝতে পারেন যে আপনার সহকর্মী, যার বাড়িতে ছোট শিশু আছে, সে অফিস পছন্দ করে, এমনকি আপনি যদি বাড়ি থেকে更好地 কাজ করেন?",
                    hi: "दूरस्थ कार्य पर एक बहस में, क्या आप वास्तव में समझ सकते हैं कि आपका सहकर्मी, जिसके घर में छोटे बच्चे हैं, कार्यालय को क्यों पसंद करता है, भले ही आप घर से बेहतर काम करते हों?"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I can anticipate people's emotional needs",
                    bn: "আমি মানুষের আবেগজনিত প্রয়োজনগুলি আগে থেকে অনুমান করতে পারি",
                    hi: "मैं लोगों की भावनात्मक जरूरतों का अंदाजा लगा सकता हूं"
                },
                example: {
                    en: "Your teammate is presenting to a tough client. Without them asking, you prepare some supporting data and chime in to back them up when they seem stuck.",
                    bn: "আপনার সতীর্থ একজন কঠিন ক্লায়েন্টের কাছে উপস্থাপনা করছে। তাদের না জিজ্ঞাসা করেই, আপনি কিছু সহায়ক ডেটা প্রস্তুত করেন এবং当他们看起来卡住时插话支持他们.",
                    hi: "आपका साथी एक कठिन ग्राहक के सामने प्रस्तुति दे रहा है। उनके पूछे बिना, आप कुछ सहायक डेटा तैयार करते हैं और जब वे अटके हुए लगते हैं तो उनका समर्थन करने के लिए बातचीत में शामिल होते हैं।"
                },
                weight: 1.3 
            }
        ],
        "Social Skills": [
            { 
                q: {
                    en: "I build rapport easily with diverse people",
                    bn: "বিভিন্ন ধরনের মানুষের সাথে আমি সহজেই সুসম্পর্ক গড়ে তুলতে পারি",
                    hi: "मैं विविध लोगों के साथ आसानी से रिपोर्ट बना लेता हूं"
                },
                example: {
                    en: "At a social event, can you comfortably have a genuine conversation with people from different age groups, backgrounds, and jobs?",
                    bn: "একটি সামাজিক অনুষ্ঠানে, আপনি কি বিভিন্ন বয়সী গোষ্ঠী, পটভূমি এবং চাকরির মানুষদের সাথে আরামদায়কভাবে একটি সত্যিকারের কথোপকথন করতে পারেন?",
                    hi: "क्या एक सामाजिक कार्यक्रम में, आप विभिन्न आयु वर्ग, पृष्ठभूमि और नौकरियों के लोगों के साथ आराम से वास्तविक बातचीत कर सकते हैं?"
                },
                weight: 1.1 
            },
            { 
                q: {
                    en: "I manage conflict constructively",
                    bn: "আমি গঠনমূলকভাবে দ্বন্দ্ব পরিচালনা করি",
                    hi: "मैं रचनात्मक रूप से संघर्ष का प्रबंधन करता हूं"
                },
                example: {
                    en: "When you and your partner disagree on finances, do you focus on finding a solution that works for both, rather than on 'winning' the argument?",
                    bn: "আপনি এবং আপনার অংশীদার যখন অর্থনৈতিক বিষয়ে দ্বিমত পোষণ করেন, তখন কি আপনি 'তর্ক জয়' করার পরিবর্তে উভয়ের জন্য কাজ করে এমন একটি সমাধান খোঁজার উপর ফোকাস করেন?",
                    hi: "जब आप और आपके साथी वित्त पर असहमत होते हैं, तो क्या आप तर्क 'जीतने' के बजाय एक ऐसे समाधान को खोजने पर ध्यान केंद्रित करते हैं जो दोनों के लिए काम करे?"
                },
                weight: 1.4 
            },
            { 
                q: {
                    en: "I communicate my ideas clearly and persuasively",
                    bn: "আমি আমার ধারণাগুলি স্পষ্টভাবে এবং প্রতিপন্নভাবে যোগাযোগ করি",
                    hi: "मैं अपने विचारों को स्पष्ट और प्रेरक ढंग से संप्रेषित करता हूं"
                },
                example: {
                    en: "You need to explain a complex idea to your team. Can you break it down into simple points that everyone understands and gets excited about?",
                    bn: "আপনাকে আপনার দলের কাছে একটি জটিল ধারণা ব্যাখ্যা করতে হবে। আপনি কি এটিকে এমন সহজ পয়েন্টে ভেঙে দিতে পারেন যা everyone বোঝে এবং উত্তেজিত হয়?",
                    hi: "आपको अपनी टीम को एक जटिल विचार समझाने की आवश्यकता है। क्या आप इसे सरल बिंदुओं में तोड़ सकते हैं जिसे everyone समझता है और उत्साहित होता है?"
                },
                weight: 1.2 
            }
        ]
    },
    "Resilience": {
        "Adaptability": [
            { 
                q: {
                    en: "I bounce back quickly from setbacks and disappointments",
                    bn: "ব্যর্থতা এবং হতাশা থেকে আমি দ্রুত সুস্থ হয়ে উঠি",
                    hi: "मैं असफलताओं और निराशाओं से जल्दी उबर जाता हूं"
                },
                example: {
                    en: "If you fail your driving test, do you allow yourself to be disappointed for an evening, then sign up for more practice and re-book the test the next day?",
                    bn: "আপনি যদি আপনার ড্রাইভিং টেস্টে失败, আপনি কি নিজেকে একটি সন্ধ্যার জন্য হতাশ হতে দেন, তারপর আরও অনুশীলনের জন্য সাইন আপ করুন এবং পরের দিন টেস্টটি পুনরায় বুক করুন?",
                    hi: "यदि आप अपनी ड्राइविंग टेस्ट में失败, क्या आप अपने आप को एक शाम के लिए निराश होने देते हैं, फिर अधिक अभ्यास के लिए साइन अप करते हैं और अगले दिन टेस्ट को फिर से बुक करते हैं?"
                },
                weight: 1.5 
            },
            { 
                q: {
                    en: "I adapt my approach when faced with obstacles",
                    bn: "বাধার সম্মুখীন হলে আমি আমার পদ্ধতি পরিবর্তন করি",
                    hi: "बाधाओं का सामना करने पर मैं अपना दृष्टिकोण बदल लेता हूं"
                },
                example: {
                    en: "You're following a recipe and realize you're missing a key ingredient. Do you quickly Google a substitute or find a different recipe, rather than giving up on cooking?",
                    bn: "আপনি একটি রেসিপি অনুসরণ করছেন এবং বুঝতে পারছেন যে আপনি একটি মূল উপাদান হারিয়ে ফেলেছেন। আপনি কি রান্না ছেড়ে দেওয়ার পরিবর্তে দ্রুত একটি বিকল্প গুগল করেন বা একটি ভিন্ন রেসিপি খুঁজে পান?",
                    hi: "आप एक रेसिपी का पालन कर रहे हैं और महसूस करते हैं कि आप एक प्रमुख सामग्री से चूक गए हैं। क्या आप खाना बनाना छोड़ने के बजाय जल्दी से एक विकल्प गूगल करते हैं या एक अलग रेसिपी ढूंढते हैं?"
                },
                weight: 1.3 
            },
            { 
                q: {
                    en: "I view challenges as opportunities for growth",
                    bn: "আমি চ্যালেঞ্জগুলিকে বৃদ্ধির সুযোগ হিসাবে দেখি",
                    hi: "मैं चुनौतियों को विकास के अवसर के रूप में देखता हूं"
                },
                example: {
                    en: "You're given a difficult new task at work that you've never done before. Do you think, 'This is scary, but I'm going to learn a lot,' rather than, 'I can't do this'?",
                    bn: "আপনাকে কাজে একটি কঠিন নতুন কাজ দেওয়া হয়েছে যা আপনি আগে কখনও করেননি। আপনি কি ভাবেন, 'এটা ভয়ঙ্কর, কিন্তু আমি অনেক কিছু শিখতে যাচ্ছি,' এর পরিবর্তে, 'আমি এটা করতে পারি না'?",
                    hi: "आपको काम पर एक कठिन नया कार्य दिया गया है जो आपने पहले कभी नहीं किया है। क्या आप सोचते हैं, 'यह डरावना है, लेकिन मैं बहुत कुछ सीखने जा रहा हूं,' इसके बजाय, 'मैं यह नहीं कर सकता'?"
                },
                weight: 1.4 
            }
        ],
        "Perseverance": [
            { 
                q: {
                    en: "I persist in pursuing goals despite difficulties",
                    bn: "কঠিনতা সত্ত্বেও আমি লক্ষ্য অর্জনে অটল থাকি",
                    hi: "कठिनाइयों के बावजूद मैं लक्ष्यों का पीछा करता रहता हूं"
                },
                example: {
                    en: "Learning to play a song on the guitar is frustrating and your fingers hurt. Do you keep practicing for 10 minutes each day instead of putting the guitar away for good?",
                    bn: "গিটার上一个歌 শেখা令人沮丧 এবং আপনার আঙ্গুল ব্যথা। আপনি কি গিটারটি স্থায়ীভাবে সরিয়ে রাখার পরিবর্তে প্রতিদিন 10 মিনিট অনুশীলন চালিয়ে যান?",
                    hi: "गिटार上 एक गाना सीखना निराशाजनक है और आपकी उंगलियां दर्द करती हैं। क्या आप गिटार को हमेशा के लिए दूर रखने के बजाय हर दिन 10 मिनट अभ्यास करते रहते हैं?"
                },
                weight: 1.4 
            },
            { 
                q: {
                    en: "I maintain effort and interest over long periods",
                    bn: "দীর্ঘ সময় ধরে আমি প্রচেষ্টা এবং আগ্রহ বজায় রাখি",
                    hi: "मैं लंबे समय तक प्रयास और रुचि बनाए रखता हूं"
                },
                example: {
                    en: "You start a fitness goal like running. After the initial excitement fades in a month, are you still able to stick to your schedule and find ways to stay motivated?",
                    bn: "আপনি দৌড়ানোর মতো একটি ফিটনেস লক্ষ্য শুরু করেন। এক মাস পরে প্রাথমিক উত্তেজনা ম্লান হয়ে গেলে, আপনি কি এখনও আপনার সময়表 sticking এবং অনুপ্রাণিত থাকার উপায় খুঁজে পেতে সক্ষম?",
                    hi: "आप दौड़ने जैसे फिटनेस लक्ष्य की शुरुआत करते हैं। एक महीने बाद प्रारंभिक उत्साह फीका पड़ने के बाद, क्या आप अभी भी अपने समय表 को चिपकाने और प्रेरित रहने के तरीके खोजने में सक्षम हैं?"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I complete tasks I start even when they become difficult",
                    bn: "কাজ কঠিন হয়ে উঠলেও আমি শুরু করা কাজগুলি সম্পন্ন করি",
                    hi: "मैं उन कार्यों को पूरा करता हूं जो मैं शुरू करता हूं, भले ही वे कठिन हो जाएं"
                },
                example: {
                    en: "You start a 1000-piece puzzle. When it gets to the tricky, similar-looking sky pieces, do you push through to finish it?",
                    bn: "আপনি একটি 1000-টুকরা ধাঁধা শুরু করেন। যখন এটি কৌশলী, একই রকম দেখতে আকাশের টুকরোগুলিতে পৌঁছায়, আপনি কি এটি শেষ করতে এগিয়ে যান?",
                    hi: "आप एक 1000-टुकड़ा पहेली शुरू करते हैं। जब यह मुश्किल, समान दिखने वाले आकाश के टुकड़ों तक पहुंचता है, तो क्या आप इसे खत्म करने के लिए आगे बढ़ते हैं?"
                },
                weight: 1.3 
            }
        ],
        "Optimism": [
            { 
                q: {
                    en: "I maintain a positive outlook in difficult situations",
                    bn: "কঠিন পরিস্থিতিতেও আমি ইতিবাচক দৃষ্টিভঙ্গি বজায় রাখি",
                    hi: "मैं कठिन परिस्थितियों में सकारात्मक दृष्टिकोण बनाए रखता हूं"
                },
                example: {
                    en: "You get stuck in a massive traffic jam. Instead of fuming, do you decide to enjoy the extra time to listen to your favorite podcast or audiobook?",
                    bn: "আপনি একটি বিশাল ট্রাফিক জ্যামে আটকে গেছেন। রাগ করার পরিবর্তে, আপনি কি আপনার প্রিয় পডকাস্ট বা অডিওবুক শোনার জন্য অতিরিক্ত সময় উপভোগ করার সিদ্ধান্ত নেন?",
                    hi: "आप एक बड़े ट्रैफिक जाम में फंस जाते हैं। क्रोधित होने के बजाय, क्या आप अपने पसंदीदा पॉडकास्ट या ऑडियोबुक को सुनने के लिए अतिरिक्त समय का आनंद लेने का निर्णय लेते हैं?"
                },
                weight: 1.3 
            },
            { 
                q: {
                    en: "I believe I can overcome most challenges I face",
                    bn: "আমি বিশ্বাস করি আমি আমার সম্মুখীন বেশিরভাগ চ্যালেঞ্জ কাটিয়ে উঠতে পারব",
                    hi: "मेरा मानना है कि मैं अपने सामने आने वाली अधिकांश चुनौतियों पर काबू पा सकता हूं"
                },
                example: {
                    en: "Facing a major home repair, do you think, 'This is a big problem, but I/we can handle it,' and start looking for solutions?",
                    bn: "একটি বড় বাড়ির মেরামতের সম্মুখীন, আপনি কি ভাবেন, 'এটি একটি বড় সমস্যা, কিন্তু আমি/আমরা এটি সামলাতে পারি,' এবং সমাধান খুঁজতে শুরু করি?",
                    hi: "एक बड़ी घर की मरम्मत का सामना करते हुए, क्या आप सोचते हैं, 'यह एक बड़ी समस्या है, लेकिन मैं/हम इसे संभाल सकते हैं,' और समाधान ढूंढना शुरू करते हैं?"
                },
                weight: 1.4 
            },
            { 
                q: {
                    en: "I expect good things to happen in the future",
                    bn: "আমি ভবিষ্যতে ভালো কিছু ঘটবে বলে আশা করি",
                    hi: "मुझे उम्मीद है कि भविष्य में अच्छी चीजें होंगी"
                },
                example: {
                    en: "When thinking about the year ahead, do you generally feel that good things are coming, even if you don't know what they are yet?",
                    bn: "আগামী বছর নিয়ে চিন্তা করার সময়, আপনি কি সাধারণত feel that ভাল জিনিস আসছে, এমনকি আপনি যদি এখনও না জানেন যে সেগুলি কী?",
                    hi: "अगले साल के बारे में सोचते समय, क्या आप आम तौर पर महसूस करते हैं कि अच्छी चीजें आ रही हैं, भले ही आप अभी तक नहीं जानते कि वे क्या हैं?"
                },
                weight: 1.2 
            }
        ]
    },
    "Growth": {
        "Learning Orientation": [
            { 
                q: {
                    en: "I actively seek opportunities to learn new things",
                    bn: "আমি সক্রিয়ভাবে নতুন জিনিস শেখার সুযোগ খুঁজি",
                    hi: "मैं सक्रिय रूप से नई चीजें सीखने के अवसर तलाशता हूं"
                },
                example: {
                    en: "When you need to fix something at home, do you immediately look up a 'how-to' video on YouTube instead of calling someone?",
                    bn: "যখন আপনার বাড়িতে কিছু ঠিক করতে হবে, আপনি কি কারোকে ডাকার পরিবর্তে ইউটিউবে একটি 'কিভাবে' ভিডিও খুঁজে দেখেন?",
                    hi: "जब आपको घर पर कुछ ठीक करने की आवश्यकता होती है, तो क्या आप किसी को फोन करने के बजाय तुरंत YouTube पर एक 'कैसे-करें' वीडियो देखते हैं?"
                },
                weight: 1.3 
            },
            { 
                q: {
                    en: "I enjoy acquiring new knowledge and skills",
                    bn: "আমি নতুন জ্ঞান এবং দক্ষতা অর্জন করতে উপভোগ করি",
                    hi: "मुझे नया ज्ञान और कौशल हासिल करने में आनंद आता है"
                },
                example: {
                    en: "Do you find yourself falling down Wikipedia rabbit holes about random topics, or taking a free online course just for fun?",
                    bn: "আপনি কি নিজেকে এলোমেলো বিষয় সম্পর্কে উইকিপিডিয়া রাবিট গর্তে falling down, বা মজার জন্য একটি বিনামূল্যের অনলাইন কোর্স নিতে দেখতে পান?",
                    hi: "क्या आप अपने आप को यादृच्छिक विषयों के बारे में विकिपीडिया खरगोश के छेदों में falling down, या सिर्फ मनोरंजन के लिए एक मुफ्त ऑनलाइन कोर्स लेते हुए पाते हैं?"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I apply feedback to improve my performance",
                    bn: "আমি আমার performance উন্নত করতে feedback প্রয়োগ করি",
                    hi: "मैं अपने प्रदर्शन को सुधारने के लिए feedback लागू करता हूं"
                },
                example: {
                    en: "Your manager suggests you speak more slowly in presentations. In your next talk, do you consciously focus on your pacing and use pauses?",
                    bn: "আপনার manager建议您在演示中说话慢一点。在您的下一次演讲中，您是否有意识地注意自己的节奏并使用停顿?",
                    hi: "आपका manager सुझाव देता है कि आप प्रस्तुतियों में अधिक धीरे-धीरे बोलें। आपकी अगली बातचीत में, क्या आप सचेत रूप से अपनी गति पर ध्यान केंद्रित करते हैं और विराम का उपयोग करते हैं?"
                },
                weight: 1.4 
            }
        ],
        "Curiosity": [
            { 
                q: {
                    en: "I frequently explore unfamiliar topics and ideas",
                    bn: "আমি প্রায়শই অপরিচিত বিষয় এবং ধারণাগুলি অন্বেষণ করি",
                    hi: "मैं अक्सर अपरिचित विषयों और विचारों का पता लगाता हूं"
                },
                example: {
                    en: "When you meet someone with a job you don't understand (like a 'data scientist'), do you ask them questions about what they actually do all day?",
                    bn: "যখন আপনি এমন কারো সাথে দেখা করেন যার কাজ আপনি বুঝতে পারেন না (যেমন একজন 'ডেটা সায়েন্টিস্ট'), আপনি কি তাদের জিজ্ঞাসা করেন যে তারা সারা দিন实际做什么?",
                    hi: "जब आप किसी ऐसे व्यक्ति से मिलते हैं जिसकी नौकरी आप नहीं समझते (जैसे 'डेटा वैज्ञानिक'), क्या आप उनसे पूछते हैं कि वे दिन भर में实际 क्या करते हैं?"
                },
                weight: 1.1 
            },
            { 
                q: {
                    en: "I ask questions to deepen my understanding",
                    bn: "আমার বোঝাপড়া গভীর করতে আমি প্রশ্ন করি",
                    hi: "मैं अपनी समझ को गहरा करने के लिए सवाल पूछता हूं"
                },
                example: {
                    en: "When someone explains a news event, do you find yourself asking 'Why did that happen?' or 'What happens next?' to understand the bigger picture?",
                    bn: "কেউ যখন একটি খবরের ঘটনা ব্যাখ্যা করে, আপনি কি নিজেকে বড় ছবিটি বুঝতে 'কেন এটা happened?' বা 'এরপর কী হয়?' জিজ্ঞাসা করতে দেখেন?",
                    hi: "जब कोई समाचार की घटना की व्याख्या करता है, तो क्या आप अपने आप से बड़ी तस्वीर को समझने के लिए 'ऐसा क्यों हुआ?' या 'आगे क्या होता है?' पूछते हुए पाते हैं?"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I enjoy thinking about complex problems",
                    bn: "জটিল সমস্যা নিয়ে চিন্তা করতে আমি উপভোগ করি",
                    hi: "मुझे जटिल समस्याओं के बारे में सोचने में आनंद आता है"
                },
                example: {
                    en: "Do you enjoy puzzles, strategy games, or discussions about 'what if' scenarios that don't have an easy answer?",
                    bn: "আপনি কি ধাঁধা, কৌশল গেম, বা 'কি হবে যদি' পরিস্থিতি সম্পর্কে আলোচনা উপভোগ করেন যার সহজ উত্তর নেই?",
                    hi: "क्या आप पहेलियों, रणनीति खेलों, या 'क्या होगा अगर' परिदृश्यों पर चर्चा का आनंद लेते हैं जिनका आसान जवाब नहीं है?"
                },
                weight: 1.3 
            }
        ],
        "Openness to Change": [
            { 
                q: {
                    en: "I willingly try new approaches and methods",
                    bn: "আমি ইচ্ছাপূর্বক নতুন পদ্ধতি এবং পদ্ধতি চেষ্টা করি",
                    hi: "मैं स्वेच्छा से नए दृष्टिकोण और तरीके आजमाता हूं"
                },
                example: {
                    en: "Your favorite app gets a complete redesign. Do you explore the new features with curiosity, or do you immediately grumble about how it was better before?",
                    bn: "আপনার প্রিয় অ্যাপটি একটি সম্পূর্ণ রিডিজাইন পায়। আপনি কি কৌতূহলের সাথে নতুন বৈশিষ্ট্যগুলি অন্বেষণ করেন, নাকি আপনি immediately গুঞ্জন করেন যে এটি আগে কতটা ভাল ছিল?",
                    hi: "आपके पसंदीदा ऐप को पूरी तरह से रीडिज़ाइन किया गया है। क्या आप जिज्ञासा के साथ नई सुविधाओं का पता लगाते हैं, या आप तुरंत बड़बड़ाते हैं कि यह पहले कितना बेहतर था?"
                },
                weight: 1.3 
            },
            { 
                q: {
                    en: "I adapt quickly to new technologies and systems",
                    bn: "আমি নতুন প্রযুক্তি এবং সিস্টেমে দ্রুত খাপ খাইয়ে নিই",
                    hi: "मैं नई तकनीकों और प्रणालियों के लिए जल्दी से अनुकूल हो जाता हूं"
                },
                example: {
                    en: "When your workplace introduces new software, are you one of the first to learn it, or one of the last who complains it's too different?",
                    bn: "যখন আপনার কর্মস্থল নতুন সফ্টওয়্যার চালু করে, আপনি কি এটি শেখার প্রথম দলের মধ্যে একজন, নাকি শেষের দলের মধ্যে একজন যিনি抱怨 এটি খুব আলাদা?",
                    hi: "जब आपके कार्यस्थल पर नया सॉफ़्टवेयर पेश किया जाता है, तो क्या आप इसे सीखने वाले पहले लोगों में से एक हैं, या आखिरी लोगों में से एक हैं जो शिकायत करते हैं कि यह बहुत अलग है?"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I embrace rather than resist organizational changes",
                    bn: "আমি organizational পরিবর্তনগুলিকে প্রতিরোধ করার পরিবর্তে গ্রহণ করি",
                    hi: "मैं organizational परिवर्तनों का विरोध करने के बजाय उन्हें अपनाता हूं"
                },
                example: {
                    en: "If your company decides to switch to a new hybrid work model, do you look for the benefits and adapt your routine, or focus only on the inconveniences?",
                    bn: "যদি আপনার কোম্পানি একটি নতুন হাইব্রিড কাজের মডেলে স্যুইচ করার সিদ্ধান্ত নেয়, আপনি কি সুবিধাগুলি সন্ধান করেন এবং আপনার রুটিন adapt, নাকি শুধুমাত্র অসুবিধাগুলির উপর ফোকাস করেন?",
                    hi: "यदि आपकी कंपनी एक नए हाइब्रिड कार्य मॉडल पर स्विच करने का निर्णय लेती है, तो क्या आप लाभों की तलाश करते हैं और अपनी दिनचर्या को अपनाते हैं, या केवल असुविधाओं पर ध्यान केंद्रित करते हैं?"
                },
                weight: 1.4 
            }
        ]
    },
    "Overthinking": {
        "Rumination": [
            { 
                q: {
                    en: "I repeatedly think about past mistakes or regrets",
                    bn: "আমি বারবার অতীতের ভুল বা অনুশোচনা নিয়ে চিন্তা করি",
                    hi: "मैं बार-बार पिछली गलतियों या पछतावों के बारे में सोचता हूं"
                },
                example: {
                    en: "Do you find yourself replaying a conversation from five years ago and cringing, or thinking 'I should have said...' long after the moment has passed?",
                    bn: "আপনি কি নিজেকে পাঁচ বছর আগের একটি কথোপকথন replaying এবং cringing, বা মুহূর্তটি passing long after 'আমার বল উচিত ছিল...' ভাবতে দেখেন?",
                    hi: "क्या आप अपने आप को पांच साल पहले की बातचीत को replaying और cringing, या पल के बीतने के लंबे समय बाद 'मुझे कहना चाहिए था...' सोचते हुए पाते हैं?"
                },
                weight: 1.5,
                reverse: true
            },
            { 
                q: {
                    en: "I have difficulty letting go of negative thoughts",
                    bn: "নেতিবাচক চিন্তা ছেড়ে দিতে আমার অসুবিধা হয়",
                    hi: "मुझे नकारात्मक विचारों को छोड़ने में कठिनाई होती है"
                },
                example: {
                    en: "If someone gives you one piece of criticism amid nine compliments, does the one criticism stick in your head for the rest of the day, drowning out the positive?",
                    bn: "কেউ যদি নয়টি প্রশংসার মধ্যে আপনাকে একটি সমালোচনা দেয়, সেই একটি সমালোচনা কি সারাদিন আপনার মাথায় আটকে থাকে, ইতিবাচকতাকে drowning out?",
                    hi: "यदि कोई आपको नौ प्रशंसाओं के बीच एक आलोचना देता है, तो क्या वह एक आलोचना पूरे दिन आपके सिर में अटकी रहती है, सकारात्मक को drowning out करती है?"
                },
                weight: 1.4,
                reverse: true
            },
            { 
                q: {
                    en: "I dwell on problems for longer than necessary",
                    bn: "আমি প্রয়োজনীয়তার চেয়ে বেশি সময় সমস্যাগুলি নিয়ে চিন্তা করি",
                    hi: "मैं आवश्यकता से अधिक समय तक समस्याओं पर ध्यान देता हूं"
                },
                example: {
                    en: "After a minor disagreement is resolved, do you keep analyzing it in your head for hours, going over every word that was said?",
                    bn: "একটি ছোটখাটো মতবিরোধ resolved পরে, আপনি কি ঘন্টার পর ঘন্টা আপনার মাথায় এটি বিশ্লেষণ করতে থাকেন, said প্রতিটি শব্দ going over?",
                    hi: "एक मामूली असहमति के resolved होने के बाद, क्या आप घंटों तक अपने सिर में इसका विश्लेषण करते रहते हैं, कहा गया हर शब्द going over?"
                },
                weight: 1.6,
                reverse: true
            }
        ],
        "Indecisiveness": [
            { 
                q: {
                    en: "I struggle to make decisions for fear of making mistakes",
                    bn: "ভুল করার ভয়ে সিদ্ধান্ত নিতে আমার struggle হয়",
                    hi: "गलतियाँ करने के डर से मुझे निर्णय लेने में संघर्ष होता है"
                },
                example: {
                    en: "Do you spend 20 minutes staring at the menu in a restaurant, worrying that you'll order the 'wrong' thing and be disappointed?",
                    bn: "আপনি কি একটি রেস্টুরেন্টে মেনুতে 20 মিনিট তাকিয়ে থাকেন, এই worry নিয়ে যে আপনি 'ভুল' জিনিস অর্ডার করবেন এবং হতাশ হবেন?",
                    hi: "क्या आप एक रेस्तरां में मेनू को 20 मिनट तक देखते रहते हैं, इस चिंता में कि आप 'गलत' चीज़ ऑर्डर करेंगे और निराश होंगे?"
                },
                weight: 1.3,
                reverse: true
            },
            { 
                q: {
                    en: "I frequently second-guess my choices",
                    bn: "আমি প্রায়শই আমার পছন্দগুলিকে দ্বিতীয়বার চিন্তা করি",
                    hi: "मैं अक्सर अपनी पसंद पर दोबारा विचार करता हूं"
                },
                example: {
                    en: "After you finally buy a new item, do you immediately go online to check if you got the best deal or if there was a better product, looking for buyer's remorse?",
                    bn: "আপনি finally একটি নতুন জিনিস কেনার পরে, আপনি কি immediately অনলাইনে যান যাতে পরীক্ষা করুন যে আপনি সেরা চুক্তি পেয়েছেন কিনা বা আরও ভাল পণ্য ছিল কিনা, buyer's remorse খুঁজছেন?",
                    hi: "आप finally एक नया आइटम खरीदने के बाद, क्या आप तुरंत ऑनलाइन जाते हैं यह जांचने के लिए कि क्या आपको सबसे अच्छा सौदा मिला है या कोई बेहतर उत्पाद था, buyer's remorse की तलाश में?"
                },
                weight: 1.4,
                reverse: true
            },
            { 
                q: {
                    en: "I spend excessive time analyzing options before deciding",
                    bn: "সিদ্ধান্ত নেওয়ার আগে আমি অত্যধিক সময় বিকল্পগুলি বিশ্লেষণে ব্যয় করি",
                    hi: "निर्णय लेने से पहले मैं विकल्पों का विश्लेषण करने में अत्यधिक समय बिताता हूं"
                },
                example: {
                    en: "When planning a vacation, do you get stuck for weeks comparing dozens of hotels and flight options, unable to book anything?",
                    bn: "ছুটি planning করার সময়, আপনি কি সপ্তাহের জন্য আটকে যান dozens হোটেল এবং ফ্লাইটের বিকল্পগুলির comparing, কিছুই book করতে unable?",
                    hi: "छुट्टी की योजना बनाते समय, क्या आप सप्ताहों के लिए दर्जनों होटलों और फ्लाइट विकल्पों की तुलना करने में फंस जाते हैं, कुछ भी बुक करने में असमर्थ?"
                },
                weight: 1.2,
                reverse: true
            }
        ],
        "Worry": [
            { 
                q: {
                    en: "I worry about things that might never happen",
                    bn: "আমি এমন জিনিসগুলি নিয়ে চিন্তিত হই যা কখনও ঘটতে পারে না",
                    hi: "मैं उन चीजों के बारे में चिंता करता हूं जो शायद कभी नहीं होंगी"
                },
                example: {
                    en: "If your partner is 30 minutes late coming home, does your mind jump to them being in a terrible accident, rather than assuming they hit traffic?",
                    bn: "যদি আপনার অংশীদার বাড়িতে আসতে 30 মিনিট দেরি হয়, আপনার মন কি তারা একটি ভয়ানক accident হয়েছে তে jump, তারা ট্রাফিক hit হয়েছে ধরে নেওয়ার পরিবর্তে?",
                    hi: "यदि आपका साथी घर आने में 30 मिनट देरी से है, तो क्या आपका दिमाग उनके एक भयानक accident में होने पर jump करता है, बजाय इसके कि वे ट्रैफिक hit कर चुके हैं?"
                },
                weight: 1.5,
                reverse: true
            },
            { 
                q: {
                    en: "I imagine worst-case scenarios",
                    bn: "আমি সবচেয়ে খারাপ পরিস্থিতি কল্পনা করি",
                    hi: "मैं सबसे खराब स्थितियों की कल्पना करता हूं"
                },
                example: {
                    en: "Before a doctor's appointment, do you find yourself mentally planning for a serious diagnosis, even for a routine check-up?",
                    bn: "ডাক্তারের অ্যাপয়েন্টমেন্টের আগে, আপনি কি নিজেকে একটি গুরুতর diagnosis জন্য মানসিকভাবে planning জন্য খুঁজে পান, এমনকি একটি routine check-up জন্য?",
                    hi: "डॉक्टर की नियुक्ति से पहले, क्या आप अपने आप को एक गंभीर diagnosis के लिए मानसिक रूप से planning करते हुए पाते हैं, यहां तक कि एक routine check-up के लिए भी?"
                },
                weight: 1.4,
                reverse: true
            },
            { 
                q: {
                    en: "I have trouble sleeping due to racing thoughts",
                    bn: "দ্রুত চলমান চিন্তার কারণে আমার ঘুমাতে সমস্যা হয়",
                    hi: "तेज दौड़ने वाले विचारों के कारण मुझे सोने में परेशानी होती है"
                },
                example: {
                    en: "Do you lie in bed at night, unable to switch off your brain because you're mentally reviewing the day's events and worrying about tomorrow's to-do list?",
                    bn: "আপনি কি রাতে বিছানায় শুয়ে থাকেন, আপনার মস্তিষ্ক বন্ধ করতে unable কারণ আপনি মানসিকভাবে দিনের ঘটনাগুলি reviewing এবং আগামীকালের to-do list নিয়ে worrying করছেন?",
                    hi: "क्या आप रात में बिस्तर पर लेटे रहते हैं, अपने दिमाग को बंद करने में असमर्थ क्योंकि आप मानसिक रूप से दिन की घटनाओं की समीक्षा कर रहे हैं और कल की to-do list की चिंता कर रहे हैं?"
                },
                weight: 1.6,
                reverse: true
            }
        ]
    }
};

// Language Manager - COMPLETE VERSION WITH EXAMPLE SUPPORT
const LanguageManager = {
    currentLanguage: 'en',
    
    languages: {
        en: { name: 'English', code: 'en', flag: '🇺🇸' },
        bn: { name: 'বাংলা', code: 'bn', flag: '🇧🇩' },
        hi: { name: 'हिन्दी', code: 'hi', flag: '🇮🇳' }
    },

    setLanguage(lang) {
        if (this.languages[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('preferredLanguage', lang);
            this.updateUIElements();
            return true;
        }
        return false;
    },

    getLanguage() {
        return this.currentLanguage;
    },

    getText(textObj) {
        if (!textObj) return '';
        return textObj[this.currentLanguage] || textObj.en || 'Text not available';
    },

    updateUIElements() {
        // Update static UI elements that need translation
        this.updateStaticText();
        
        // Update current question if test is in progress
        if (window.psychometricApp && typeof window.psychometricApp.refreshCurrentQuestion === 'function') {
            window.psychometricApp.refreshCurrentQuestion();
        }
    },

    updateStaticText() {
        // Update any static text that needs translation
        console.log('Updating static text for language:', this.currentLanguage);
    },

    init() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.languages[savedLang]) {
            this.currentLanguage = savedLang;
        }
        this.updateUIElements();
    }
};

// Update QuestionManager to support multiple languages and examples
const QuestionManager = {
    getCategories: function() {
        return Object.keys(questions);
    },
    
    getSubcategories: function(category) {
        return questions[category] ? Object.keys(questions[category]) : [];
    },
    
    getQuestions: function(category, subcategory) {
        return questions[category] && questions[category][subcategory] ? questions[category][subcategory] : [];
    },
    
    getQuestionText: function(question) {
        return LanguageManager.getText(question.q);
    },
    
    getQuestionExample: function(question) {
        return question.example ? LanguageManager.getText(question.example) : null;
    },
    
    getTotalQuestionsCount: function() {
        let total = 0;
        for (const category of this.getCategories()) {
            for (const subcategory of this.getSubcategories(category)) {
                total += this.getQuestions(category, subcategory).length;
            }
        }
        return total;
    },
    
    getQuestion: function(category, subcategory, index) {
        const categoryQuestions = questions[category];
        if (!categoryQuestions) return null;
        
        const subcategoryQuestions = categoryQuestions[subcategory];
        if (!subcategoryQuestions || index >= subcategoryQuestions.length) return null;
        
        return subcategoryQuestions[index];
    },
    
    // Helper method to get all questions for scoring
    getAllQuestions: function() {
        return questions;
    }
};

// Initialize language manager when the script loads
LanguageManager.init();