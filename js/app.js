// js/app.js - COMPLETE PSYCHOMETRIC APP WITH CARD REVEAL SYSTEM
class PsychometricApp {
    constructor() {
        this.state = {
            userId: null,
            userName: "",
            demographics: {},
            currentCategoryIndex: 0,
            currentSubcategoryIndex: 0,
            currentQuestionIndex: 0,
            answers: {},
            responseTimestamps: [],
            results: {},
            analytics: {}
        };
        
        this.initializeApp();
    }
    
    initializeApp() {
        this.bindEvents();
        
        // Clean up any corrupted data on startup
        const cleanedCount = DataManager.cleanupCorruptedData();
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} corrupted data entries`);
        }
        
        this.loadExistingSession();
        this.initializeGlobalLanguage();
    }
    
    bindEvents() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Compact language buttons in intro
        const languageBtns = document.querySelectorAll('.language-btn');
        if (languageBtns.length > 0) {
            languageBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    console.log('Language selected:', lang);
                    this.changeLanguage(lang);
                    this.updateCompactLanguageButtons(lang);
                });
            });
        }
        
        // Global language selector
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguageDropdown());
        }
        
        // Global language options
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.changeLanguage(lang);
                this.hideLanguageDropdown();
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.global-language-selector')) {
                this.hideLanguageDropdown();
            }
        });
        
        // Start button
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startTest());
        }
        
        // User name enter key
        const userNameInput = document.getElementById('userName');
        if (userNameInput) {
            userNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.startTest();
            });
        }
        
        // Question screen buttons
        const backBtn = document.getElementById('backBtn');
        if (backBtn) backBtn.addEventListener('click', () => this.previousQuestion());
        
        const skipBtn = document.getElementById('skipBtn');
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipQuestion());
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.addEventListener('click', () => this.handleAnswer());
        
        // Answer selection with emojis
        document.querySelectorAll('.answer-input').forEach(input => {
            input.addEventListener('change', () => {
                const nextBtn = document.getElementById('nextBtn');
                if (nextBtn) nextBtn.disabled = false;
            });
        });
        
        // Analytics and Results events
        const viewReportsBtn = document.getElementById('viewReportsBtn');
        if (viewReportsBtn) viewReportsBtn.addEventListener('click', () => this.showReports());
        
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartTest());
        
        const viewAnalyticsBtn = document.getElementById('viewAnalyticsBtn');
        if (viewAnalyticsBtn) viewAnalyticsBtn.addEventListener('click', () => this.showAnalytics());
        
        console.log('All event listeners setup complete');
    }
    
    initializeGlobalLanguage() {
        // Set initial language from localStorage or default to English
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        this.changeLanguage(savedLang);
    }
    
    changeLanguage(lang) {
        console.log('Changing language to:', lang);
        if (LanguageManager.setLanguage(lang)) {
            this.updateGlobalLanguageSelector(lang);
            this.updateCompactLanguageButtons(lang);
            this.updateStaticText(lang);
            this.refreshCurrentQuestion();
        }
    }
    
    updateGlobalLanguageSelector(lang) {
        const languageToggle = document.getElementById('languageToggle');
        const currentLanguageSpan = languageToggle?.querySelector('.current-language');
        
        if (currentLanguageSpan) {
            const flags = { en: '🇺🇸', hi: '🇮🇳', bn: '🇧🇩' };
            currentLanguageSpan.textContent = flags[lang] || '🌐';
        }
        
        // Update active state in dropdown
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }
    
    updateCompactLanguageButtons(lang) {
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }
    
    toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        const chevron = document.querySelector('.chevron');
        
        if (dropdown && chevron) {
            dropdown.classList.toggle('show');
            chevron.style.transform = dropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
        }
    }
    
    hideLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        const chevron = document.querySelector('.chevron');
        
        if (dropdown && chevron) {
            dropdown.classList.remove('show');
            chevron.style.transform = 'rotate(0)';
        }
    }
    
    updateStaticText(lang) {
        console.log('Updating static text for:', lang);
        const translations = {
            en: {
                name: 'Enter your name',
                age: 'Your age',
                start: 'Begin Assessment',
                chooseLang: 'Choose Language:',
                questionProgress: 'Question',
                of: 'of',
                assessmentProgress: 'Assessment Progress',
                previous: 'Previous',
                skip: 'Skip',
                next: 'Next Question',
                viewReports: 'View Detailed Reports',
                printReports: 'Print Reports',
                takeAgain: 'Take Again',
                viewAnalytics: 'View Analytics',
                analyzing: 'Analyzing Your Responses',
                analyzingDesc: "We're carefully reviewing your answers to create personalized insights...",
                step1: 'Processing emotional patterns',
                step2: 'Evaluating resilience factors',
                step3: 'Assessing growth mindset',
                step4: 'Compiling insights',
                profileReady: 'Your Psychological Profile is Ready! 🎉',
                tapToReveal: 'Tap each card to reveal your personalized insights',
                startWithStrongest: 'Start with your strongest area'
            },
            hi: {
                name: 'अपना नाम दर्ज करें',
                age: 'आपकी उम्र',
                start: 'मूल्यांकन शुरू करें',
                chooseLang: 'भाषा चुनें:',
                questionProgress: 'प्रश्न',
                of: 'में से',
                assessmentProgress: 'मूल्यांकन प्रगति',
                previous: 'पिछला',
                skip: 'छोड़ें',
                next: 'अगला प्रश्न',
                viewReports: 'विस्तृत रिपोर्ट देखें',
                printReports: 'रिपोर्ट प्रिंट करें',
                takeAgain: 'फिर से करें',
                viewAnalytics: 'विश्लेषण देखें',
                analyzing: 'आपके उत्तरों का विश्लेषण',
                analyzingDesc: 'हम आपके उत्तरों का सावधानीपूर्वक विश्लेषण कर व्यक्तिगत अंतर्दृष्टि बना रहे हैं...',
                step1: 'भावनात्मक पैटर्न संसाधित करना',
                step2: 'लचीलापन कारकों का मूल्यांकन',
                step3: 'विकास मानसिकता का आकलन',
                step4: 'अंतर्दृष्टि संकलित करना',
                profileReady: 'आपका मनोवैज्ञानिक प्रोफाइल तैयार है! 🎉',
                tapToReveal: 'अपनी व्यक्तिगत अंतर्दृष्टि देखने के लिए प्रत्येक कार्ड टैप करें',
                startWithStrongest: 'अपने सबसे मजबूत क्षेत्र से शुरू करें'
            },
            bn: {
                name: 'আপনার নাম লিখুন',
                age: 'আপনার বয়স',
                start: 'মূল্যায়ন শুরু করুন',
                chooseLang: 'ভাষা নির্বাচন করুন:',
                questionProgress: 'প্রশ্ন',
                of: 'এর',
                assessmentProgress: 'মূল্যায়ন অগ্রগতি',
                previous: 'পূর্ববর্তী',
                skip: 'এড়িয়ে যান',
                next: 'পরবর্তী প্রশ্ন',
                viewReports: 'বিস্তারিত রিপোর্ট দেখুন',
                printReports: 'রিপোর্ট প্রিন্ট করুন',
                takeAgain: 'আবার করুন',
                viewAnalytics: 'বিশ্লেষণ দেখুন',
                analyzing: 'আপনার উত্তর বিশ্লেষণ করা হচ্ছে',
                analyzingDesc: 'আমরা আপনার উত্তরগুলি সাবধানে পর্যালোচনা করে ব্যক্তিগত অন্তর্দৃষ্টি তৈরি করছি...',
                step1: 'মানসিক নমুনা প্রক্রিয়া করা',
                step2: 'স্থিতিস্থাপকতা ফ্যাক্টর মূল্যায়ন',
                step3: 'বৃদ্ধির মানসিকতা মূল্যায়ন',
                step4: 'অন্তর্দৃষ্টি কম্পাইল করা',
                profileReady: 'আপনার মনস্তাত্ত্বিক প্রোফাইল প্রস্তুত! 🎉',
                tapToReveal: 'আপনার ব্যক্তিগত অন্তর্দৃষ্টি প্রকাশ করতে প্রতিটি কার্ড ট্যাপ করুন',
                startWithStrongest: 'আপনার শক্তিশালী এলাকা দিয়ে শুরু করুন'
            }
        };
        
        const texts = translations[lang] || translations.en;
        
        // Update form placeholders
        const userNameInput = document.getElementById('userName');
        if (userNameInput) userNameInput.placeholder = texts.name;
        
        const userAgeInput = document.getElementById('userAge');
        if (userAgeInput) userAgeInput.placeholder = texts.age;
        
        // Update buttons and labels
        this.updateButtonText('#startBtn span:first-child', texts.start);
        this.updateTextContent('.language-label', texts.chooseLang);
        this.updateButtonText('#backBtn', texts.previous);
        this.updateButtonText('#skipBtn', texts.skip);
        this.updateButtonText('#nextBtn', texts.next);
        this.updateButtonText('#viewReportsBtn', texts.viewReports);
        this.updateButtonText('#printReportsBtn', texts.printReports);
        this.updateButtonText('#restartBtn', texts.takeAgain);
        this.updateButtonText('#viewAnalyticsBtn', texts.viewAnalytics);
        
        // Update progress labels
        this.updateTextContent('.progress-info span:first-child', texts.assessmentProgress);
    }
    
    updateButtonText(selector, text) {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    }
    
    updateTextContent(selector, text) {
        const element = document.querySelector(selector);
        if (element) element.textContent = text;
    }
    
    startTest() {
        const name = document.getElementById('userName').value.trim();
        const age = parseInt(document.getElementById('userAge').value);
        const gender = document.getElementById('userGender').value;
        const occupation = document.getElementById('userOccupation').value;
        
        if (!this.validateInputs(name, age, gender, occupation)) {
            return;
        }
        
        this.state.userId = DataManager.generateUserId();
        this.state.userName = name;
        this.state.demographics = { name, age, gender, occupation };
        this.state.responseTimestamps = [Date.now()];
        
        // Save demographics
        DataManager.saveDemographics(this.state.userId, this.state.demographics);
        
        this.showScreen('questionScreen');
        this.loadCurrentQuestion();
    }
    
    validateInputs(name, age, gender, occupation) {
        if (!name) {
            alert("Please enter your name to continue.");
            return false;
        }
        
        if (!age || age < 16 || age > 100) {
            alert("Please enter a valid age between 16 and 100.");
            return false;
        }
        
        if (!gender) {
            alert("Please select your gender.");
            return false;
        }
        
        if (!occupation) {
            alert("Please select your occupation.");
            return false;
        }
        
        return true;
    }
    
    loadCurrentQuestion() {
        const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
        const subcategories = QuestionManager.getSubcategories(category);
        
        if (subcategories.length === 0) {
            this.moveToNextQuestion();
            return;
        }
        
        const subcategory = subcategories[this.state.currentSubcategoryIndex];
        const questions = QuestionManager.getQuestions(category, subcategory);
        
        if (questions.length === 0) {
            this.moveToNextQuestion();
            return;
        }
        
        const question = questions[this.state.currentQuestionIndex];
        
        // Use multi-language text
        const questionText = QuestionManager.getQuestionText(question);
        
        // Update UI with new design
        const currentCategoryElement = document.getElementById('currentCategoryBadge');
        if (currentCategoryElement) currentCategoryElement.textContent = category;
        
        const currentSubcategoryElement = document.getElementById('currentCategory');
        if (currentSubcategoryElement) currentSubcategoryElement.textContent = subcategory;
        
        const currentQuestionNumberElement = document.getElementById('currentQuestionNumber');
        if (currentQuestionNumberElement) currentQuestionNumberElement.textContent = this.state.currentQuestionIndex + 1;
        
        const totalQuestionsElement = document.getElementById('totalQuestions');
        if (totalQuestionsElement) totalQuestionsElement.textContent = questions.length;
        
        const questionTextElement = document.getElementById('questionText');
        if (questionTextElement) questionTextElement.textContent = questionText;
        
        // Reset radio buttons
        document.querySelectorAll('.answer-input').forEach(input => {
            input.checked = false;
        });
        
        // Update progress
        this.updateProgress();
        
        // Enable/disable navigation
        const backBtn = document.getElementById('backBtn');
        if (backBtn) backBtn.disabled = this.isFirstQuestion();
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) nextBtn.disabled = true;
        
        // Record timestamp
        this.state.responseTimestamps.push(Date.now());
    }
    
    handleAnswer() {
        const selectedOption = document.querySelector('.answer-input:checked');
        
        if (!selectedOption) {
            alert("Please select an answer before continuing.");
            return;
        }
        
        const answerValue = parseInt(selectedOption.value);
        const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
        const subcategory = QuestionManager.getSubcategories(category)[this.state.currentSubcategoryIndex];
        
        // Store answer in state first
        if (!this.state.answers[category]) {
            this.state.answers[category] = {};
        }
        if (!this.state.answers[category][subcategory]) {
            this.state.answers[category][subcategory] = [];
        }
        this.state.answers[category][subcategory][this.state.currentQuestionIndex] = answerValue;
        
        // Then save to storage (automatically saves to Firebase)
        const saved = DataManager.saveResponse(
            this.state.userId,
            category,
            subcategory,
            this.state.currentQuestionIndex,
            answerValue,
            Date.now()
        );
        
        if (!saved) {
            console.warn('Failed to save response to storage');
            // Continue anyway, data is in memory
        }
        
        this.moveToNextQuestion();
    }
    
    previousQuestion() {
        if (this.state.currentQuestionIndex > 0) {
            this.state.currentQuestionIndex--;
        } else {
            if (this.state.currentSubcategoryIndex > 0) {
                this.state.currentSubcategoryIndex--;
                const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
                const subcategory = QuestionManager.getSubcategories(category)[this.state.currentSubcategoryIndex];
                this.state.currentQuestionIndex = QuestionManager.getQuestions(category, subcategory).length - 1;
            } else {
                if (this.state.currentCategoryIndex > 0) {
                    this.state.currentCategoryIndex--;
                    const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
                    const subcategories = QuestionManager.getSubcategories(category);
                    this.state.currentSubcategoryIndex = subcategories.length - 1;
                    const subcategory = subcategories[this.state.currentSubcategoryIndex];
                    this.state.currentQuestionIndex = QuestionManager.getQuestions(category, subcategory).length - 1;
                }
            }
        }
        
        this.loadCurrentQuestion();
    }
    
    skipQuestion() {
        this.moveToNextQuestion();
    }
    
    moveToNextQuestion() {
        this.state.currentQuestionIndex++;
        
        const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
        const subcategories = QuestionManager.getSubcategories(category);
        const subcategory = subcategories[this.state.currentSubcategoryIndex];
        const questions = QuestionManager.getQuestions(category, subcategory);
        
        if (this.state.currentQuestionIndex < questions.length) {
            this.loadCurrentQuestion();
        } else {
            this.state.currentSubcategoryIndex++;
            this.state.currentQuestionIndex = 0;
            
            if (this.state.currentSubcategoryIndex < subcategories.length) {
                this.loadCurrentQuestion();
            } else {
                this.state.currentCategoryIndex++;
                this.state.currentSubcategoryIndex = 0;
                this.state.currentQuestionIndex = 0;
                
                if (this.state.currentCategoryIndex < QuestionManager.getCategories().length) {
                    this.loadCurrentQuestion();
                } else {
                    this.calculateResults();
                }
            }
        }
    }
    
    isFirstQuestion() {
        return this.state.currentCategoryIndex === 0 && 
               this.state.currentSubcategoryIndex === 0 && 
               this.state.currentQuestionIndex === 0;
    }
    
    updateProgress() {
        const totalQuestions = QuestionManager.getTotalQuestionsCount();
        const answeredQuestions = this.getAnsweredQuestionsCount();
        const progress = (answeredQuestions / totalQuestions) * 100;
        
        const progressPercentageElement = document.getElementById('progressPercentage');
        if (progressPercentageElement) progressPercentageElement.textContent = `${Math.round(progress)}%`;
        
        const progressFillElement = document.getElementById('progressFill');
        if (progressFillElement) progressFillElement.style.width = `${progress}%`;
        
        // Also update browser tab title with progress
        document.title = `Mind Insight (${Math.round(progress)}%)`;
    }
    
    getAnsweredQuestionsCount() {
        let answered = 0;
        for (const category in this.state.answers) {
            for (const subcategory in this.state.answers[category]) {
                const answers = this.state.answers[category][subcategory];
                answered += answers.filter(a => a !== null && a !== undefined).length;
            }
        }
        return answered;
    }
    
    calculateResults() {
        this.state.results = {};
        
        // Calculate scores for each category
        for (const category of QuestionManager.getCategories()) {
            const categoryData = questions[category];
            const categoryAnswers = this.state.answers[category] || {};
            
            const categoryResult = ScoringAlgorithm.calculateCategoryScore(categoryData, categoryAnswers);
            categoryResult.level = ScoringAlgorithm.determineLevel(categoryResult.overall);
            
            this.state.results[category] = categoryResult;
        }
        
        // Calculate additional analytics
        this.state.analytics.consistency = ScoringAlgorithm.calculateConsistency(this.state.answers);
        this.state.analytics.responseTime = ScoringAlgorithm.calculateResponseTimeAnalysis(this.state.responseTimestamps);
        
        // Mark as complete (automatically saves to Firebase)
        DataManager.markComplete(this.state.userId, this.state.results);
        
        this.showAnalytics();
    }
    
    showAnalytics() {
        this.showScreen('analyticsScreen');
        this.renderAnalytics();
    }
    
    renderAnalytics() {
        const analyticsGrid = document.getElementById('analyticsGrid');
        if (!analyticsGrid) return;
        
        analyticsGrid.innerHTML = '';
        
        // Overall Score Card
        const overallScore = Object.values(this.state.results).reduce((sum, result) => sum + result.overall, 0) / Object.keys(this.state.results).length;
        const overallLevel = ScoringAlgorithm.determineLevel(overallScore);
        
        analyticsGrid.appendChild(this.createAnalyticsCard('Overall Psychological Profile', `
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 3rem; font-weight: bold; color: ${ScoringAlgorithm.getLevelColor(overallLevel)}">${overallScore.toFixed(1)}</div>
                <div style="font-size: 1.2rem; color: var(--text-secondary);">Level ${overallLevel} - ${ScoringAlgorithm.getLevelLabel(overallLevel)}</div>
            </div>
            <div class="stat-item">
                <span>Response Consistency:</span>
                <span class="stat-value">${this.state.analytics.consistency.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span>Average Response Time:</span>
                <span class="stat-value">${this.state.analytics.responseTime.avgTime.toFixed(1)}s</span>
            </div>
            <div class="stat-item">
                <span>Response Pattern:</span>
                <span class="stat-value">${this.state.analytics.responseTime.pattern}</span>
            </div>
        `));
        
        // Category Breakdown
        let categoryContent = '';
        for (const [category, result] of Object.entries(this.state.results)) {
            categoryContent += `
                <div class="stat-item">
                    <span>${category}:</span>
                    <span class="stat-value">${result.overall.toFixed(1)} (Level ${result.level})</span>
                </div>
            `;
            
            for (const [subcategory, subResult] of Object.entries(result.subcategories)) {
                categoryContent += `
                    <div style="padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary);">
                        <span>${subcategory}:</span>
                        <span>${subResult.score.toFixed(1)}</span>
                    </div>
                `;
            }
        }
        
        analyticsGrid.appendChild(this.createAnalyticsCard('Category Breakdown', categoryContent));
        
        // Comparative Analytics
        const aggregateData = DataManager.getAggregateData();
        if (aggregateData && aggregateData.totalUsers > 1) {
            let comparisonContent = `<div style="margin-bottom: 15px; color: var(--text-secondary);">Based on ${aggregateData.totalUsers} completed assessments</div>`;
            
            for (const [category, avgScore] of Object.entries(aggregateData.categoryAverages)) {
                const userScore = this.state.results[category] ? this.state.results[category].overall : 0;
                const difference = userScore - avgScore;
                const differenceText = difference >= 0 ? `+${difference.toFixed(1)} above average` : `${difference.toFixed(1)} below average`;
                
                comparisonContent += `
                    <div class="stat-item">
                        <span>${category}:</span>
                        <span class="stat-value">${differenceText}</span>
                    </div>
                `;
            }
            
            analyticsGrid.appendChild(this.createAnalyticsCard('Comparison with Other Users', comparisonContent));
        }
        
        // Insights
        const comparison = AnalyticsEngine.generateComparativeAnalysis(this.state.results, aggregateData);
        const insights = AnalyticsEngine.generateInsights(this.state.results, comparison);
        
        let insightsContent = '';
        if (insights.keyStrengths.length > 0) {
            insightsContent += `<div style="margin-bottom: 15px;"><strong>Key Strengths:</strong> ${insights.keyStrengths.map(s => s.category).join(', ')}</div>`;
        }
        if (insights.developmentAreas.length > 0) {
            insightsContent += `<div style="margin-bottom: 15px;"><strong>Areas for Development:</strong> ${insights.developmentAreas.map(a => a.category).join(', ')}</div>`;
        }
        if (insights.recommendations.length > 0) {
            insightsContent += `<div><strong>Recommendations:</strong><ul style="margin-top: 10px; padding-left: 20px;">${insights.recommendations.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}</ul></div>`;
        }
        
        analyticsGrid.appendChild(this.createAnalyticsCard('Key Insights', insightsContent));
    }
    
    createAnalyticsCard(title, content) {
        const card = document.createElement('div');
        card.className = 'analytics-card';
        card.innerHTML = `<h3>${title}</h3>${content}`;
        return card;
    }
    
    // ===== NEW CARD REVEAL SYSTEM =====
    
    async showReports() {
        // Show analysis screen first
        this.showAnalysisScreen();
        
        // Simulate analysis delay (3-4 seconds)
        await this.simulateAnalysis();
        
        // Hide analysis screen and show cards
        this.hideAnalysisScreen();
        this.showCardsReveal();
    }
    
    showAnalysisScreen() {
        const analysisScreen = document.getElementById('analysisScreen');
        if (analysisScreen) {
            analysisScreen.style.display = 'flex';
            this.animateAnalysisSteps();
        }
    }
    
    animateAnalysisSteps() {
        const steps = document.querySelectorAll('.analysis-steps .step');
        let currentStep = 0;
        
        const stepInterval = setInterval(() => {
            if (currentStep > 0) {
                steps[currentStep - 1].classList.remove('active');
            }
            
            if (currentStep < steps.length) {
                steps[currentStep].classList.add('active');
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 800); // Change step every 800ms
    }
    
    simulateAnalysis() {
        return new Promise(resolve => {
            // Random delay between 3-5 seconds for realism
            const delay = 3000 + Math.random() * 2000;
            setTimeout(resolve, delay);
        });
    }
    
    hideAnalysisScreen() {
        const analysisScreen = document.getElementById('analysisScreen');
        if (analysisScreen) {
            analysisScreen.style.opacity = '0';
            setTimeout(() => {
                analysisScreen.style.display = 'none';
                analysisScreen.style.opacity = '1';
            }, 500);
        }
    }
    
    showCardsReveal() {
        this.showScreen('resultScreen');
        
        const reportsContainer = document.getElementById('reportsContainer');
        const texts = this.getCurrentLanguageTexts();
        
        reportsContainer.innerHTML = `
            <div class="cards-reveal-container">
                <div class="reveal-message">
                    <h2>${texts.profileReady}</h2>
                    <p>${texts.tapToReveal}</p>
                    <div class="reveal-hint">${texts.startWithStrongest}</div>
                </div>
                <div class="cards-grid" id="cardsGrid">
                    <!-- Cards will be populated here -->
                </div>
            </div>
        `;
        
        this.renderCards();
    }
    
    getCurrentLanguageTexts() {
        const lang = LanguageManager.getLanguage();
        const translations = {
            en: {
                profileReady: 'Your Psychological Profile is Ready! 🎉',
                tapToReveal: 'Tap each card to reveal your personalized insights',
                startWithStrongest: 'Start with your strongest area'
            },
            hi: {
                profileReady: 'आपका मनोवैज्ञानिक प्रोफाइल तैयार है! 🎉',
                tapToReveal: 'अपनी व्यक्तिगत अंतर्दृष्टि देखने के लिए प्रत्येक कार्ड टैप करें',
                startWithStrongest: 'अपने सबसे मजबूत क्षेत्र से शुरू करें'
            },
            bn: {
                profileReady: 'আপনার মনস্তাত্ত্বিক প্রোফাইল প্রস্তুত! 🎉',
                tapToReveal: 'আপনার ব্যক্তিগত অন্তর্দৃষ্টি প্রকাশ করতে প্রতিটি কার্ড ট্যাপ করুন',
                startWithStrongest: 'আপনার শক্তিশালী এলাকা দিয়ে শুরু করুন'
            }
        };
        
        return translations[lang] || translations.en;
    }
    
    renderCards() {
        const cardsGrid = document.getElementById('cardsGrid');
        if (!cardsGrid) return;
        
        cardsGrid.innerHTML = '';
        
        // Sort categories by score (highest first for better UX)
        const sortedCategories = Object.entries(this.state.results)
            .sort(([,a], [,b]) => b.overall - a.overall);
        
        for (const [category, result] of sortedCategories) {
            const cardHTML = this.createPsychCard(category, result);
            cardsGrid.innerHTML += cardHTML;
        }
        
        // Add card interaction listeners
        this.setupCardInteractions();
    }
    
    createPsychCard(category, result) {
        const level = result.level;
        const score = result.overall;
        const levelLabel = ScoringAlgorithm.getLevelLabel(level);
        const levelColor = ScoringAlgorithm.getLevelColor(level);
        
        const categoryIcons = {
            'Emotional': '💖',
            'Resilience': '🛡️',
            'Growth': '🌱',
            'Overthinking': '🧠'
        };
        
        const rarityClass = score >= 4.5 ? 'epic' : score >= 4.0 ? 'rare' : 'common';
        const quickInsight = this.generateQuickInsight(category, score);
        
        return `
            <div class="psych-card ${rarityClass}" data-category="${category}" data-score="${score}">
                <div class="card-inner">
                    <div class="card-back">
                        <div class="mystery-shape">🔮</div>
                        <div class="card-prompt">Tap to Reveal</div>
                    </div>
                    <div class="card-front">
                        <div class="card-header">
                            <span class="category-icon">${categoryIcons[category]}</span>
                            <h3>${category} Intelligence</h3>
                        </div>
                        <div class="score-display">
                            <div class="score-ring" style="--score: ${score}">
                                <span class="score-value">${score.toFixed(1)}</span>
                            </div>
                            <span class="level-badge" style="background: ${levelColor}">${levelLabel}</span>
                        </div>
                        <div class="key-insight">
                            ${quickInsight}
                        </div>
                        <button class="view-details" onclick="psychometricApp.expandCard('${category}')">
                            See Full Analysis →
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateQuickInsight(category, score) {
        const insights = {
            Emotional: {
                high: "You have exceptional emotional awareness and empathy skills",
                medium: "You demonstrate good emotional understanding with room for growth",
                low: "Developing emotional awareness can enhance your relationships"
            },
            Resilience: {
                high: "You bounce back quickly from challenges with strong adaptability",
                medium: "You handle stress well but could strengthen coping strategies",
                low: "Building resilience will help you navigate life's challenges"
            },
            Growth: {
                high: "You actively seek learning and embrace new opportunities",
                medium: "You're open to growth with potential for more proactive learning",
                low: "Developing a growth mindset can unlock new possibilities"
            },
            Overthinking: {
                high: "You maintain balanced thinking without excessive analysis",
                medium: "You occasionally overthink but generally make decisive choices",
                low: "Practicing mindfulness can help reduce overthinking patterns"
            }
        };
        
        const categoryInsights = insights[category];
        let insightKey = 'medium';
        
        if (score >= 4.0) insightKey = 'high';
        else if (score <= 2.5) insightKey = 'low';
        
        return categoryInsights[insightKey];
    }
    
    setupCardInteractions() {
        document.querySelectorAll('.psych-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.view-details')) {
                    this.revealCard(card);
                }
            });
        });
    }
    
    revealCard(card) {
        if (card.classList.contains('revealed')) return;
        
        card.classList.add('revealing');
        
        setTimeout(() => {
            card.classList.remove('revealing');
            card.classList.add('revealed');
            
            // Add celebration for high scores
            const score = parseFloat(card.dataset.score);
            if (score >= 4.0) {
                this.celebrateCard(card);
            }
        }, 600);
    }
    
    celebrateCard(card) {
        const score = parseFloat(card.dataset.score);
        const confettiCount = score >= 4.5 ? 8 : 5;
        
        for (let i = 0; i < confettiCount; i++) {
            this.createConfetti(card);
        }
    }
    
    createConfetti(card) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.textContent = '✨';
        confetti.style.left = Math.random() * 80 + 10 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        card.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 1500);
    }
    
    expandCard(category) {
        // For now, just alert - you can expand this to show detailed reports
        alert(`Detailed analysis for ${category} intelligence would open here with full markdown reports from your files.`);
        
        // Future implementation:
        // 1. Load the corresponding markdown report
        // 2. Show in a modal or expand the card
        // 3. Include actionable recommendations
    }
    
    // ===== EXISTING FUNCTIONALITY =====
    
    refreshCurrentQuestion() {
        // Only refresh if we're on the question screen
        const questionScreen = document.getElementById('questionScreen');
        if (questionScreen && questionScreen.classList.contains('active')) {
            this.loadCurrentQuestion();
        }
    }
    
    restartTest() {
        if (confirm('Are you sure you want to start over? Your current progress will be lost.')) {
            // Clear current session
            if (this.state.userId) {
                DataManager.clearUserData(this.state.userId);
            }
            
            // Reset state
            this.state = {
                userId: null,
                userName: "",
                demographics: {},
                currentCategoryIndex: 0,
                currentSubcategoryIndex: 0,
                currentQuestionIndex: 0,
                answers: {},
                responseTimestamps: [],
                results: {},
                analytics: {}
            };
            
            // Reset form
            const userNameInput = document.getElementById('userName');
            if (userNameInput) userNameInput.value = "";
            
            const userAgeInput = document.getElementById('userAge');
            if (userAgeInput) userAgeInput.value = "";
            
            const userGenderSelect = document.getElementById('userGender');
            if (userGenderSelect) userGenderSelect.value = "";
            
            const userOccupationSelect = document.getElementById('userOccupation');
            if (userOccupationSelect) userOccupationSelect.value = "";
            
            this.showScreen('introScreen');
        }
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
        // Update progress indicator in header
        this.updateProgressIndicator(screenId);
    }
    
    updateProgressIndicator(screenId) {
        const progressIndicator = document.getElementById('progressIndicator');
        if (!progressIndicator) return;
        
        const screens = ['introScreen', 'questionScreen', 'analyticsScreen', 'resultScreen'];
        const currentIndex = screens.indexOf(screenId);
        const progressDots = progressIndicator.querySelector('.progress-dots');
        
        if (progressDots && currentIndex >= 0) {
            progressDots.innerHTML = '';
            for (let i = 0; i < screens.length; i++) {
                const dot = document.createElement('div');
                dot.className = `progress-dot ${i <= currentIndex ? 'active' : ''}`;
                progressDots.appendChild(dot);
            }
        }
    }
    
    loadExistingSession() {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('psychometric_')) {
                    const userData = JSON.parse(localStorage.getItem(key));
                    if (userData && !userData.completed) {
                        const continueTest = confirm(
                            `We found an incomplete assessment for ${userData.demographics.name || 'a user'}. ` +
                            `Would you like to continue where you left off?`
                        );
                        
                        if (continueTest) {
                            this.state.userId = userData.userId;
                            this.state.demographics = userData.demographics;
                            this.state.answers = userData.responses || {};
                            this.state.responseTimestamps = userData.timestamps || [];
                            
                            // Find current position
                            this.findCurrentPosition();
                            this.showScreen('questionScreen');
                            this.loadCurrentQuestion();
                            return;
                        } else {
                            // Clear the incomplete session
                            DataManager.clearUserData(userData.userId);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error loading existing session:', error);
        }
    }
    
    findCurrentPosition() {
        const categories = QuestionManager.getCategories();
        
        for (let catIdx = 0; catIdx < categories.length; catIdx++) {
            const category = categories[catIdx];
            const subcategories = QuestionManager.getSubcategories(category);
            
            for (let subIdx = 0; subIdx < subcategories.length; subIdx++) {
                const subcategory = subcategories[subIdx];
                const questions = QuestionManager.getQuestions(category, subcategory);
                
                for (let qIdx = 0; qIdx < questions.length; qIdx++) {
                    const hasAnswer = this.state.answers[category] && 
                                     this.state.answers[category][subcategory] && 
                                     this.state.answers[category][subcategory][qIdx] !== undefined;
                    
                    if (!hasAnswer) {
                        this.state.currentCategoryIndex = catIdx;
                        this.state.currentSubcategoryIndex = subIdx;
                        this.state.currentQuestionIndex = qIdx;
                        return;
                    }
                }
            }
        }
        
        // If all questions are answered, go to results
        this.calculateResults();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.psychometricApp = new PsychometricApp();
});