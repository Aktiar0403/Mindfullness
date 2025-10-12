// Enhanced Questions with Subcategories and Weights
const questions = {
    "Emotional": {
        "Self-Awareness": [
            { q: "I can accurately identify my emotions as I experience them", weight: 1.2 },
            { q: "I understand what causes my emotional reactions", weight: 1.1 },
            { q: "I recognize how my emotions affect my thoughts and decisions", weight: 1.3 }
        ],
        "Self-Regulation": [
            { q: "I can manage disruptive emotions and impulses effectively", weight: 1.4 },
            { q: "I remain calm under pressure and think clearly", weight: 1.5 },
            { q: "I adapt easily to changing situations", weight: 1.2 }
        ],
        "Empathy": [
            { q: "I can sense what others are feeling without being told", weight: 1.1 },
            { q: "I understand others' perspectives even when different from mine", weight: 1.2 },
            { q: "I can anticipate people's emotional needs", weight: 1.3 }
        ],
        "Social Skills": [
            { q: "I build rapport easily with diverse people", weight: 1.1 },
            { q: "I manage conflict constructively", weight: 1.4 },
            { q: "I communicate my ideas clearly and persuasively", weight: 1.2 }
        ]
    },
    "Resilience": {
        "Adaptability": [
            { q: "I bounce back quickly from setbacks and disappointments", weight: 1.5 },
            { q: "I adapt my approach when faced with obstacles", weight: 1.3 },
            { q: "I view challenges as opportunities for growth", weight: 1.4 }
        ],
        "Perseverance": [
            { q: "I persist in pursuing goals despite difficulties", weight: 1.4 },
            { q: "I maintain effort and interest over long periods", weight: 1.2 },
            { q: "I complete tasks I start even when they become difficult", weight: 1.3 }
        ],
        "Optimism": [
            { q: "I maintain a positive outlook in difficult situations", weight: 1.3 },
            { q: "I believe I can overcome most challenges I face", weight: 1.4 },
            { q: "I expect good things to happen in the future", weight: 1.2 }
        ]
    },
    "Growth": {
        "Learning Orientation": [
            { q: "I actively seek opportunities to learn new things", weight: 1.3 },
            { q: "I enjoy acquiring new knowledge and skills", weight: 1.2 },
            { q: "I apply feedback to improve my performance", weight: 1.4 }
        ],
        "Curiosity": [
            { q: "I frequently explore unfamiliar topics and ideas", weight: 1.1 },
            { q: "I ask questions to deepen my understanding", weight: 1.2 },
            { q: "I enjoy thinking about complex problems", weight: 1.3 }
        ],
        "Openness to Change": [
            { q: "I willingly try new approaches and methods", weight: 1.3 },
            { q: "I adapt quickly to new technologies and systems", weight: 1.2 },
            { q: "I embrace rather than resist organizational changes", weight: 1.4 }
        ]
    },
    "Overthinking": {
        "Rumination": [
            { q: "I repeatedly think about past mistakes or regrets", weight: 1.5, reverse: true },
            { q: "I have difficulty letting go of negative thoughts", weight: 1.4, reverse: true },
            { q: "I dwell on problems for longer than necessary", weight: 1.6, reverse: true }
        ],
        "Indecisiveness": [
            { q: "I struggle to make decisions for fear of making mistakes", weight: 1.3, reverse: true },
            { q: "I frequently second-guess my choices", weight: 1.4, reverse: true },
            { q: "I spend excessive time analyzing options before deciding", weight: 1.2, reverse: true }
        ],
        "Worry": [
            { q: "I worry about things that might never happen", weight: 1.5, reverse: true },
            { q: "I imagine worst-case scenarios", weight: 1.4, reverse: true },
            { q: "I have trouble sleeping due to racing thoughts", weight: 1.6, reverse: true }
        ]
    }
};

// Utility functions for questions
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