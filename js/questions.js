// Enhanced Questions with Subcategories and Weights
   const questions = {
    "Emotional": {
        "Self-Awareness": [
            { 
                q: {
                    en: "I can accurately identify my emotions as I experience them",
                    bn: "আমি আমার অনুভূতিগুলো সঠিকভাবে চিনতে পারি যখন আমি সেগুলো অনুভব করি",
                    hi: "मैं अपनी भावनाओं को सही ढंग से पहचान सकता हूं जब मैं उन्हें अनुभव करता हूं"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I understand what causes my emotional reactions",
                    bn: "আমি বুঝি কী কারণে আমার আবেগজনিত প্রতিক্রিয়া হয়",
                    hi: "मैं समझता हूं कि मेरी भावनात्मक प्रतिक्रियाओं का कारण क्या है"
                },
                weight: 1.1 
            },
            { 
                q: {
                    en: "I recognize how my emotions affect my thoughts and decisions",
                    bn: "আমি বুঝি আমার আবেগ কীভাবে আমার চিন্তাভাবনা এবং সিদ্ধান্তকে প্রভাবিত করে",
                    hi: "मैं पहचानता हूं कि मेरी भावनाएं मेरे विचारों और निर्णयों को कैसे प्रभावित करती हैं"
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
                weight: 1.4 
            },
            { 
                q: {
                    en: "I remain calm under pressure and think clearly",
                    bn: "চাপের মধ্যেও আমি শান্ত থাকি এবং স্পষ্টভাবে চিন্তা করি",
                    hi: "मैं दबाव में शांत रहता हूं और स्पष्ट रूप से सोचता हूं"
                },
                weight: 1.5 
            },
            { 
                q: {
                    en: "I adapt easily to changing situations",
                    bn: "পরিবর্তনশীল পরিস্থিতিতে আমি সহজেই খাপ খাইয়ে নিতে পারি",
                    hi: "मैं बदलती परिस्थितियों के अनुकूल आसानी से ढल जाता हूं"
                },
                weight: 1.2 
            }
        ],
        "Empathy": [
            { 
                q: {
                    en: "I can sense what others are feeling without being told",
                    bn: "কিছু না বললেও আমি বুঝতে পারি অন্যরা কী অনুভব করছে",
                    hi: "मैं बिना बताए ही समझ सकता हूं कि दूसरे क्या महसूस कर रहे हैं"
                },
                weight: 1.1 
            },
            { 
                q: {
                    en: "I understand others' perspectives even when different from mine",
                    bn: "আমার থেকে ভিন্ন হলেও আমি অন্যদের দৃষ্টিভঙ্গি বুঝতে পারি",
                    hi: "मैं दूसरों के दृष्टिकोण को समझता हूं भले ही वे मेरे से अलग हों"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I can anticipate people's emotional needs",
                    bn: "আমি মানুষের আবেগিক প্রয়োজনগুলি আগাম অনুমান করতে পারি",
                    hi: "मैं लोगों की भावनात्मक जरूरतों का अंदाजा लगा सकता हूं"
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
                weight: 1.1 
            },
            { 
                q: {
                    en: "I manage conflict constructively",
                    bn: "আমি গঠনমূলকভাবে দ্বন্দ্ব পরিচালনা করি",
                    hi: "मैं रचनात्मक रूप से संघर्ष का प्रबंधन करता हूं"
                },
                weight: 1.4 
            },
            { 
                q: {
                    en: "I communicate my ideas clearly and persuasively",
                    bn: "আমি আমার ধারণাগুলি স্পষ্ট এবং প্রতিপন্নভাবে যোগাযোগ করি",
                    hi: "मैं अपने विचारों को स्पष्ट और प्रभावशाली ढंग से संप्रेषित करता हूं"
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
                weight: 1.5 
            },
            { 
                q: {
                    en: "I adapt my approach when faced with obstacles",
                    bn: "বাধার সম্মুখীন হলে আমি আমার পদ্ধতি পরিবর্তন করি",
                    hi: "बाधाओं का सामना करने पर मैं अपना दृष्टिकोण बदल लेता हूं"
                },
                weight: 1.3 
            },
            { 
                q: {
                    en: "I view challenges as opportunities for growth",
                    bn: "আমি চ্যালেঞ্জগুলিকে বৃদ্ধির সুযোগ হিসাবে দেখি",
                    hi: "मैं चुनौतियों को विकास के अवसर के रूप में देखता हूं"
                },
                weight: 1.4 
            }
        ],
        "Perseverance": [
            { 
                q: {
                    en: "I persist in pursuing goals despite difficulties",
                    bn: "কঠিনতা সত্ত্বেও আমি লক্ষ্য অর্জনের জন্য অবিচল থাকি",
                    hi: "कठिनाइयों के बावजूद मैं लक्ष्यों का पीछा करना जारी रखता हूं"
                },
                weight: 1.4 
            },
            { 
                q: {
                    en: "I maintain effort and interest over long periods",
                    bn: "দীর্ঘ সময় ধরে আমি প্রচেষ্টা এবং আগ্রহ বজায় রাখি",
                    hi: "मैं लंबे समय तक प्रयास और रुचि बनाए रखता हूं"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I complete tasks I start even when they become difficult",
                    bn: "কাজ কঠিন হয়ে গেলেও আমি শুরু করা কাজগুলি সম্পূর্ণ করি",
                    hi: "मैं उन कार्यों को पूरा करता हूं जो मैं शुरू करता हूं, भले ही वे कठिन हो जाएं"
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
                weight: 1.3 
            },
            { 
                q: {
                    en: "I believe I can overcome most challenges I face",
                    bn: "আমি বিশ্বাস করি আমি আমার সম্মুখীন বেশিরভাগ চ্যালেঞ্জ কাটিয়ে উঠতে পারি",
                    hi: "मेरा मानना है कि मैं अपने सामने आने वाली अधिकांश चुनौतियों पर काबू पा सकता हूं"
                },
                weight: 1.4 
            },
            { 
                q: {
                    en: "I expect good things to happen in the future",
                    bn: "আমি ভবিষ্যতে ভালো কিছু ঘটার আশা করি",
                    hi: "मुझे उम्मीद है कि भविष्य में अच्छी चीजें होंगी"
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
                weight: 1.3 
            },
            { 
                q: {
                    en: "I enjoy acquiring new knowledge and skills",
                    bn: "আমি নতুন জ্ঞান এবং দক্ষতা অর্জন করতে উপভোগ করি",
                    hi: "मुझे नया ज्ञान और कौशल हासिल करने में आनंद आता है"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I apply feedback to improve my performance",
                    bn: "আমি আমার কর্মক্ষমতা উন্নত করতে প্রতিক্রিয়া প্রয়োগ করি",
                    hi: "मैं अपने प्रदर्शन को सुधारने के लिए प्रतिक्रिया लागू करता हूं"
                },
                weight: 1.4 
            }
        ],
        "Curiosity": [
            { 
                q: {
                    en: "I frequently explore unfamiliar topics and ideas",
                    bn: "আমি প্রায়শই অপরিচিত বিষয় এবং ধারণা অন্বেষণ করি",
                    hi: "मैं अक्सर अपरिचित विषयों और विचारों का पता लगाता हूं"
                },
                weight: 1.1 
            },
            { 
                q: {
                    en: "I ask questions to deepen my understanding",
                    bn: "আমি আমার বোঝাপড়া গভীর করতে প্রশ্ন করি",
                    hi: "मैं अपनी समझ को गहरा करने के लिए सवाल पूछता हूं"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I enjoy thinking about complex problems",
                    bn: "আমি জটিল সমস্যা নিয়ে চিন্তা করতে উপভোগ করি",
                    hi: "मुझे जटिल समस्याओं के बारे में सोचने में आनंद आता है"
                },
                weight: 1.3 
            }
        ],
        "Openness to Change": [
            { 
                q: {
                    en: "I willingly try new approaches and methods",
                    bn: "আমি ইচ্ছাপূর্বক নতুন পদ্ধতি এবং উপায় চেষ্টা করি",
                    hi: "मैं स्वेच्छा से नए दृष्टिकोण और तरीके आजमाता हूं"
                },
                weight: 1.3 
            },
            { 
                q: {
                    en: "I adapt quickly to new technologies and systems",
                    bn: "আমি নতুন প্রযুক্তি এবং সিস্টেমে দ্রুত অভ্যস্ত হয়ে যাই",
                    hi: "मैं नई तकनीकों और प्रणालियों के लिए जल्दी से अनुकूल हो जाता हूं"
                },
                weight: 1.2 
            },
            { 
                q: {
                    en: "I embrace rather than resist organizational changes",
                    bn: "আমি সাংগঠনিক পরিবর্তনগুলিকে প্রতিরোধ করার পরিবর্তে গ্রহণ করি",
                    hi: "मैं संगठनात्मक परिवर्तनों का विरोध करने के बजाय उन्हें अपनाता हूं"
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
                weight: 1.5,
                reverse: true 
            },
            { 
                q: {
                    en: "I have difficulty letting go of negative thoughts",
                    bn: "আমার নেতিবাচক চিন্তা ছেড়ে দিতে সমস্যা হয়",
                    hi: "मुझे नकारात्मक विचारों को छोड़ने में कठिनाई होती है"
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
                weight: 1.6,
                reverse: true 
            }
        ],
        "Indecisiveness": [
            { 
                q: {
                    en: "I struggle to make decisions for fear of making mistakes",
                    bn: "ভুল করার ভয়ে আমি সিদ্ধান্ত নিতে সংগ্রাম করি",
                    hi: "गलतियाँ करने के डर से मुझे निर्णय लेने में संघर्ष करना पड़ता है"
                },
                weight: 1.3,
                reverse: true 
            },
            { 
                q: {
                    en: "I frequently second-guess my choices",
                    bn: "আমি প্রায়শই আমার পছন্দগুলি নিয়ে সন্দেহ করি",
                    hi: "मैं अक्सर अपनी पसंद पर संदेह करता हूं"
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
                weight: 1.2,
                reverse: true 
            }
        ],
        "Worry": [
            { 
                q: {
                    en: "I worry about things that might never happen",
                    bn: "আমি এমন জিনিস নিয়ে চিন্তা করি যা কখনও ঘটবে না",
                    hi: "मैं उन चीजों के बारे में चिंता करता हूं जो शायद कभी नहीं होंगी"
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
                weight: 1.4,
                reverse: true 
            },
            { 
                q: {
                    en: "I have trouble sleeping due to racing thoughts",
                    bn: "দ্রুতগতির চিন্তার কারণে আমার ঘুমাতে সমস্যা হয়",
                    hi: "दौड़ते विचारों के कारण मुझे सोने में परेशानी होती है"
                },
                weight: 1.6,
                reverse: true 
            }
        ]
    }
};


// Language Manager
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
            this.applyLanguage();
            return true;
        }
        return false;
    },

    getLanguage() {
        return this.currentLanguage;
    },

    getText(textObj) {
        return textObj[this.currentLanguage] || textObj.en || 'Text not available';
    },

    applyLanguage() {
        // Update all dynamic text in the app
        if (window.psychometricApp) {
            window.psychometricApp.updateLanguage();
        }
    },

    init() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && this.languages[savedLang]) {
            this.currentLanguage = savedLang;
        }
        this.applyLanguage();
    }
};

// Update QuestionManager to support multiple languages
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
    }
};
