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
        const cleanedCount = DataManager.cleanupCorruptedData();
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} corrupted data entries`);
        }
        this.loadExistingSession();
        this.initializeGlobalLanguage();
    }
    
    bindEvents() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Language buttons
        const languageBtns = document.querySelectorAll('.language-btn');
        languageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.changeLanguage(lang);
                this.updateCompactLanguageButtons(lang);
            });
        });
        
        // Global language selector
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguageDropdown());
        }
        
        // Language options
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
        
        // Answer selection
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
        if (viewAnalyticsBtn) viewAnalyticsBtn.addEventListener('click', () => this.showCardsReveal());
        
        // Close modal events
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('reportModal');
            if (modal && modal.style.display === 'flex' && e.target === modal) {
                this.closeReportModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeReportModal();
        });
        
        console.log('All event listeners setup complete');
    }
    
    initializeGlobalLanguage() {
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
                viewAnalytics: 'View Analytics'
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
                viewAnalytics: 'विश्लेषण देखें'
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
                viewAnalytics: 'বিশ্লেষণ দেখুন'
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
        
        if (!this.validateInputs(name, age, gender, occupation)) return;
        
        this.state.userId = DataManager.generateUserId();
        this.state.userName = name;
        this.state.demographics = { name, age, gender, occupation };
        this.state.responseTimestamps = [Date.now()];
        
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
        const questionText = QuestionManager.getQuestionText(question);
        const exampleText = QuestionManager.getQuestionExample(question);
        
        // Update UI
        const currentCategoryElement = document.getElementById('currentCategoryBadge');
        if (currentCategoryElement) currentCategoryElement.textContent = category;
        
        const currentSubcategoryElement = document.getElementById('currentCategory');
        if (currentSubcategoryElement) currentSubcategoryElement.textContent = subcategory;
        
        const currentQuestionNumberElement = document.getElementById('currentQuestionNumber');
        if (currentQuestionNumberElement) currentQuestionNumberElement.textContent = this.state.currentQuestionIndex + 1;
        
        const totalQuestionsElement = document.getElementById('totalQuestions');
        if (totalQuestionsElement) totalQuestionsElement.textContent = questions.length;
        
        // Update question text with example
        const questionTextElement = document.getElementById('questionText');
        if (questionTextElement) {
            if (exampleText) {
                questionTextElement.innerHTML = `
                    <div class="question-main">${questionText}</div>
                    <div class="question-example">
                        <strong>Example:</strong> ${exampleText}
                    </div>
                `;
            } else {
                questionTextElement.textContent = questionText;
            }
        }
        
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
        
        // Store answer in state
        if (!this.state.answers[category]) this.state.answers[category] = {};
        if (!this.state.answers[category][subcategory]) this.state.answers[category][subcategory] = [];
        this.state.answers[category][subcategory][this.state.currentQuestionIndex] = answerValue;
        
        // Save to storage
        const saved = DataManager.saveResponse(
            this.state.userId,
            category,
            subcategory,
            this.state.currentQuestionIndex,
            answerValue,
            Date.now()
        );
        
        if (!saved) console.warn('Failed to save response to storage');
        
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
        
        // Skip analytics and go directly to cards
        this.state.analytics = {
            consistency: 85,
            responseTime: { avgTime: 3.5, pattern: 'Balanced' }
        };
        
        DataManager.markComplete(this.state.userId, this.state.results);
        this.showCardsReveal();
    }
        // ===== CARD REVEAL SYSTEM =====
    
    async showReports() {
        this.showAnalysisScreen();
        await this.simulateAnalysis();
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
        }, 800);
    }
    
    simulateAnalysis() {
        return new Promise(resolve => {
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
                <div class="interactive-reports-container" id="interactiveReportsGrid">
                    <!-- Interactive cards will be populated here -->
                </div>
            </div>
        `;
        
        this.renderInteractiveCards();
    }

    renderInteractiveCards() {
        const interactiveGrid = document.getElementById('interactiveReportsGrid');
        if (!interactiveGrid) {
            console.error('Interactive grid not found');
            return;
        }

        interactiveGrid.innerHTML = '';

        // Sort categories by score (highest first)
        const sortedCategories = Object.entries(this.state.results)
            .sort(([,a], [,b]) => b.overall - a.overall);

        console.log('Rendering interactive cards:', sortedCategories.length);

        for (const [category, result] of sortedCategories) {
            const card = this.createInteractiveCard(category, result);
            interactiveGrid.appendChild(card);
        }

        this.setupInteractiveCardInteractions();
    }

    createInteractiveCard(category, result) {
        const card = document.createElement('div');
        card.className = 'interactive-card';
        card.setAttribute('data-category', category);
        card.setAttribute('data-score', result.overall);
        
        const level = result.level;
        const levelLabel = ScoringAlgorithm.getLevelLabel(level);
        const levelColor = ScoringAlgorithm.getLevelColor(level);
        
        const categoryIcons = {
            'Emotional': '💖',
            'Resilience': '🛡️',
            'Growth': '🌱',
            'Overthinking': '🧠'
        };

        const rarityClass = result.overall >= 4.5 ? 'epic' : result.overall >= 4.0 ? 'rare' : 'common';
        
        card.innerHTML = `
            <div class="card-inner ${rarityClass}">
                <div class="card-back">
                    <div class="mystery-shape">🔮</div>
                    <div class="card-prompt">Tap to Reveal</div>
                    <div class="card-category-hint">${category}</div>
                </div>
                <div class="card-front">
                    <div class="card-header">
                        <span class="category-icon">${categoryIcons[category]}</span>
                        <h3>${category} Intelligence</h3>
                    </div>
                    <div class="score-display">
                        <div class="score-ring" style="--score: ${result.overall}">
                            <span class="score-value">${result.overall.toFixed(1)}</span>
                        </div>
                        <span class="level-badge" style="background: ${levelColor}">${levelLabel}</span>
                    </div>
                    <div class="key-insight">
                        ${this.generateQuickInsight(category, result.overall)}
                    </div>
                    <button class="view-details-btn" onclick="psychometricApp.expandCard('${category}')">
                        See Full Analysis →
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    setupInteractiveCardInteractions() {
        document.querySelectorAll('.interactive-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.view-details-btn')) return;
                this.revealInteractiveCard(card);
            });
        });
    }

    revealInteractiveCard(card) {
        if (card.classList.contains('revealed')) return;
        
        card.classList.add('revealing');
        
        setTimeout(() => {
            card.classList.remove('revealing');
            card.classList.add('revealed');
            
            const score = parseFloat(card.dataset.score);
            if (score >= 4.0) this.celebrateInteractiveCard(card);
        }, 600);
    }

    celebrateInteractiveCard(card) {
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
        
        setTimeout(() => confetti.remove(), 1500);
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
    
    expandCard(category) {
        console.log(`📖 Expanding card for: ${category}`);
        this.showDetailedReport(category);
    }

    async showDetailedReport(category) {
        const result = this.state.results[category];
        if (!result) {
            console.error('No result found for category:', category);
            return;
        }

        try {
            this.showReportLoading(category);
            console.log(`🔄 Loading detailed report for ${category} at level ${result.level}`);
            
            const reportContent = await ReportLoader.loadReport(category, result.level);
            console.log('✅ Report content loaded successfully');
            
            this.showReportModal(category, result, reportContent);
            
        } catch (error) {
            console.error(`❌ Error loading detailed report for ${category}:`, error);
            this.showReportError(category, error.message);
        }
    }

    showReportLoading(category) {
        let modal = document.getElementById('reportModal');
        if (!modal) modal = this.createReportModal();
        
        modal.style.display = 'flex';
        modal.style.zIndex = '9999';
        
        modal.innerHTML = `
            <div class="modal-content" style="z-index: 10000;">
                <div class="modal-header">
                    <h2>Loading ${category} Report</h2>
                    <button class="modal-close" onclick="psychometricApp.closeReportModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="loading-report">
                        <div class="loading-spinner"></div>
                        <p>Loading your detailed ${category.toLowerCase()} intelligence analysis...</p>
                        <p class="loading-subtitle">Level ${this.state.results[category].level} - ${ScoringAlgorithm.getLevelLabel(this.state.results[category].level)}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.classList.add('modal-open');
        setTimeout(() => modal.focus(), 100);
    }

    showReportModal(category, result, reportContent) {
        const modal = document.getElementById('reportModal');
        const levelLabel = ScoringAlgorithm.getLevelLabel(result.level);
        const levelColor = ScoringAlgorithm.getLevelColor(result.level);
        
        const categoryIcons = {
            'Emotional': '💖',
            'Resilience': '🛡️',
            'Growth': '🌱',
            'Overthinking': '🧠'
        };

        modal.innerHTML = `
            <div class="modal-content detailed-report" style="z-index: 10000;">
                <div class="modal-header">
                    <div class="report-title-section">
                        <span class="category-icon-large">${categoryIcons[category]}</span>
                        <div>
                            <h2>${category} Intelligence Report</h2>
                            <div class="report-meta">
                                <span class="score-badge-large" style="background: ${levelColor}">
                                    Score: ${result.overall.toFixed(1)}/5.0
                                </span>
                                <span class="level-label-large">${levelLabel} Level</span>
                            </div>
                        </div>
                    </div>
                    <button class="modal-close" onclick="psychometricApp.closeReportModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="detailed-report-content">
                        ${reportContent}
                    </div>
                    <div class="report-actions">
                        <button class="action-button secondary" onclick="psychometricApp.printReport('${category}')">
                            🖨️ Print Report
                        </button>
                        <button class="action-button primary" onclick="psychometricApp.closeReportModal()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        setTimeout(() => modal.focus(), 100);
    }

    createReportModal() {
        const modal = document.createElement('div');
        modal.id = 'reportModal';
        modal.className = 'report-modal';
        modal.setAttribute('tabindex', '-1');
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeReportModal();
        });
        
        return modal;
    }

    closeReportModal() {
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    showReportError(category, errorMessage) {
        const modal = document.getElementById('reportModal');
        const result = this.state.results[category];
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${category} Report</h2>
                    <button class="modal-close" onclick="psychometricApp.closeReportModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="error-message">
                        <div class="error-icon">⚠️</div>
                        <h3>Report Loading Issue</h3>
                        <p>We encountered an issue loading the detailed report for ${category.toLowerCase()} intelligence.</p>
                        <p><strong>Error:</strong> ${errorMessage}</p>
                        <p>Your score of ${result.overall.toFixed(1)} indicates a <strong>${ScoringAlgorithm.getLevelLabel(result.level).toLowerCase()}</strong> level of proficiency.</p>
                        
                        <div class="fallback-content">
                            <h4>Quick Summary</h4>
                            <p>${this.generateQuickInsight(category, result.overall)}</p>
                            
                            <h4>Next Steps</h4>
                            <ul>
                                <li>Try refreshing the page</li>
                                <li>Check your internet connection</li>
                                <li>Contact support if the issue persists</li>
                            </ul>
                        </div>
                        
                        <button class="action-button primary" onclick="psychometricApp.closeReportModal()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }

    printReport(category) {
        const modal = document.getElementById('reportModal');
        const reportContent = modal.querySelector('.detailed-report-content');
        
        if (!reportContent) {
            alert('No report content available to print.');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        const userInfo = `
            <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
                <h1 style="color: #333; margin-bottom: 10px;">${category} Intelligence Report</h1>
                <p style="color: #666; margin: 5px 0;"><strong>User:</strong> ${this.state.userName}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Score:</strong> ${this.state.results[category].overall.toFixed(1)}/5.0 (${ScoringAlgorithm.getLevelLabel(this.state.results[category].level)})</p>
            </div>
        `;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${category} Report - ${this.state.userName}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #2d3748; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                    h2 { color: #4a5568; margin-top: 25px; }
                    h3 { color: #4a5568; margin-top: 20px; }
                    p { margin-bottom: 15px; }
                    ul, ol { margin: 15px 0; padding-left: 25px; }
                    li { margin-bottom: 8px; }
                    strong { color: #2d3748; }
                    blockquote { border-left: 4px solid #6366f1; padding-left: 20px; margin: 20px 0; font-style: italic; color: #666; }
                    @media print { body { padding: 0; } .page-break { page-break-before: always; } }
                </style>
            </head>
            <body>
                ${userInfo}
                ${reportContent.innerHTML}
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9rem;">
                    <p>Generated by Mind Insight Pro • ${new Date().toLocaleDateString()}</p>
                </div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }
        // ===== UTILITY METHODS =====
    
    showAnalytics() {
        this.showCardsReveal();
    }
    
    refreshCurrentQuestion() {
        const questionScreen = document.getElementById('questionScreen');
        if (questionScreen && questionScreen.classList.contains('active')) {
            this.loadCurrentQuestion();
        }
    }
    
    restartTest() {
        if (confirm('Are you sure you want to start over? Your current progress will be lost.')) {
            if (this.state.userId) {
                DataManager.clearUserData(this.state.userId);
            }
            
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
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
        
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
                            
                            this.findCurrentPosition();
                            this.showScreen('questionScreen');
                            this.loadCurrentQuestion();
                            return;
                        } else {
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
        
        this.calculateResults();
    }
}

// ===== SUPPORTING CSS (add to your stylesheet) =====
/*
.interactive-reports-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
}

.interactive-card {
    height: 280px;
    perspective: 1000px;
    cursor: pointer;
}

.interactive-card .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.interactive-card.revealing .card-inner {
    transform: rotateY(180deg);
}

.interactive-card.revealed .card-inner {
    transform: rotateY(180deg);
}

.interactive-card .card-back,
.interactive-card .card-front {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 16px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
}

.interactive-card .card-back {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
}

.interactive-card .card-front {
    background: white;
    transform: rotateY(180deg);
    text-align: center;
}

.mystery-shape {
    font-size: 3rem;
    margin-bottom: 15px;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.card-prompt {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 10px;
}

.card-category-hint {
    font-size: 0.9rem;
    opacity: 0.8;
}

.card-inner.epic .card-back {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.card-inner.rare .card-back {
    background: linear-gradient(135deg, #4834d4 0%, #686de0 100%);
}

.card-inner.common .card-back {
    background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
}

.confetti {
    position: absolute;
    font-size: 1.5rem;
    animation: confetti-fall 1.5s ease-in forwards;
    z-index: 10;
}

@keyframes confetti-fall {
    0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100px) rotate(360deg);
        opacity: 0;
    }
}

.score-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: conic-gradient(#6366f1 0% calc(var(--score) * 20%), #e5e7eb calc(var(--score) * 20%) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
}

.score-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
}

.level-badge {
    padding: 4px 12px;
    border-radius: 20px;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
}

.key-insight {
    margin: 15px 0;
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.4;
}

.view-details-btn {
    background: #6366f1;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s;
}

.view-details-btn:hover {
    background: #4f46e5;
}
*/

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.psychometricApp = new PsychometricApp();
});