// js/app.js - COMPLETE PSYCHOMETRIC ASSESSMENT APPLICATION
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
        
        // New language selector events
        const languageCards = document.querySelectorAll('.language-card');
        if (languageCards.length > 0) {
            languageCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    console.log('Language selected:', lang);
                    this.changeLanguage(lang);
                });
            });
            console.log('Language event listeners added');
        }
        
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
        
        // New answer selection with emojis
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
        
        // Print button will be added dynamically
        console.log('All event listeners setup complete');
    }
    
    changeLanguage(lang) {
        console.log('Changing language to:', lang);
        if (LanguageManager.setLanguage(lang)) {
            this.updateLanguageUI(lang);
            this.refreshCurrentQuestion();
        }
    }
    
    updateLanguageUI(lang) {
        console.log('Updating UI for language:', lang);
        
        // Update new language cards
        const languageCards = document.querySelectorAll('.language-card');
        if (languageCards.length > 0) {
            languageCards.forEach(card => {
                card.classList.toggle('active', card.dataset.lang === lang);
            });
        }
        
        // Update any language-specific text
        this.updateStaticText(lang);
    }
    
    updateStaticText(lang) {
        console.log('Updating static text for:', lang);
        const placeholders = {
            en: {
                name: 'Enter your name',
                age: 'Your age',
                start: 'Begin Assessment'
            },
            hi: {
                name: 'अपना नाम दर्ज करें',
                age: 'आपकी उम्र',
                start: 'मूल्यांकन शुरू करें'
            },
            bn: {
                name: 'আপনার নাম লিখুন',
                age: 'আপনার বয়স',
                start: 'মূল্যায়ন শুরু করুন'
            }
        };
        
        const texts = placeholders[lang] || placeholders.en;
        
        // Update form placeholders
        const userNameInput = document.getElementById('userName');
        if (userNameInput) userNameInput.placeholder = texts.name;
        
        const userAgeInput = document.getElementById('userAge');
        if (userAgeInput) userAgeInput.placeholder = texts.age;
        
        // Update button text
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            const firstSpan = startBtn.querySelector('span:first-child');
            if (firstSpan) firstSpan.textContent = texts.start;
        }
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
    
    async showReports() {
        this.showScreen('resultScreen');
        await this.renderReports();
    }
    
    async renderReports() {
        // Update user greeting
        const userGreetingElement = document.getElementById('userGreeting');
        if (userGreetingElement) userGreetingElement.textContent = `Here are your personalized insights, ${this.state.userName}.`;
        
        // Display results summary
        const resultsSummary = document.getElementById('resultsSummary');
        if (!resultsSummary) return;
        
        resultsSummary.innerHTML = '';
        
        for (const [category, result] of Object.entries(this.state.results)) {
            const levelText = ScoringAlgorithm.getLevelLabel(result.level);
            const levelColor = ScoringAlgorithm.getLevelColor(result.level);
            
            const categoryResult = document.createElement('div');
            categoryResult.className = 'category-result';
            categoryResult.style.borderLeft = `4px solid ${levelColor}`;
            categoryResult.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-score" style="color: ${levelColor}">${result.overall.toFixed(1)}</div>
                <div class="category-level">${levelText}</div>
            `;
            
            resultsSummary.appendChild(categoryResult);
        }
        
        // Load and display reports
        const reportsContainer = document.getElementById('reportsContainer');
        if (!reportsContainer) return;
        
        reportsContainer.innerHTML = '<div class="loading-reports">Loading your personalized reports...</div>';
        
        try {
            await this.loadAndDisplayReports();
        } catch (error) {
            console.error('Error loading reports:', error);
            reportsContainer.innerHTML = '<div class="error-message">Unable to load reports. Please try again later.</div>';
        }
    }
    
    async loadAndDisplayReports() {
        const reportsContainer = document.getElementById('reportsContainer');
        if (!reportsContainer) return;
        
        reportsContainer.innerHTML = '';
        
        for (const [category, result] of Object.entries(this.state.results)) {
            try {
                const reportContent = await ReportLoader.loadReport(category, result.level);
                
                const reportSection = document.createElement('div');
                reportSection.className = 'report-section';
                
                const reportHeader = document.createElement('div');
                reportHeader.className = 'report-header';
                reportHeader.innerHTML = `
                    <h3 class="report-title">${category} Intelligence - Level ${result.level}</h3>
                    <div class="report-meta">
                        <span class="score-badge" style="background: ${ScoringAlgorithm.getLevelColor(result.level)}">
                            Score: ${result.overall.toFixed(1)}/5.0
                        </span>
                        <span class="level-label">${ScoringAlgorithm.getLevelLabel(result.level)}</span>
                    </div>
                `;
                
                const reportContentDiv = document.createElement('div');
                reportContentDiv.className = 'report-content';
                reportContentDiv.innerHTML = reportContent;
                
                reportSection.appendChild(reportHeader);
                reportSection.appendChild(reportContentDiv);
                
                reportsContainer.appendChild(reportSection);
            } catch (error) {
                console.error(`Error loading report for ${category}:`, error);
                // Show fallback content
                const fallbackSection = document.createElement('div');
                fallbackSection.className = 'report-section';
                fallbackSection.innerHTML = `
                    <div class="report-header">
                        <h3 class="report-title">${category} Intelligence - Level ${result.level}</h3>
                        <div class="report-meta">
                            <span class="score-badge" style="background: ${ScoringAlgorithm.getLevelColor(result.level)}">
                                Score: ${result.overall.toFixed(1)}/5.0
                            </span>
                            <span class="level-label">${ScoringAlgorithm.getLevelLabel(result.level)}</span>
                        </div>
                    </div>
                    <div class="report-content">
                        <p>Detailed report for ${category} intelligence is currently unavailable.</p>
                        <p>Your score of ${result.overall.toFixed(1)} indicates a ${ScoringAlgorithm.getLevelLabel(result.level).toLowerCase()} level of proficiency in this area.</p>
                    </div>
                `;
                reportsContainer.appendChild(fallbackSection);
            }
        }
        
        // Add print button after reports are loaded
        this.addPrintButton();
    }
    
    addPrintButton() {
        const actionButtons = document.querySelector('.action-section');
        if (!actionButtons) return;
        
        // Remove existing print button if any
        const existingPrintBtn = document.getElementById('printReportsBtn');
        if (existingPrintBtn) {
            existingPrintBtn.remove();
        }
        
        const printBtn = document.createElement('button');
        printBtn.id = 'printReportsBtn';
        printBtn.className = 'action-button secondary';
        printBtn.innerHTML = '🖨️ Print Reports';
        printBtn.addEventListener('click', () => this.printReports());
        
        // Insert before the first button
        actionButtons.insertBefore(printBtn, actionButtons.firstChild);
    }
    
    printReports() {
        const printWindow = window.open('', '_blank');
        const reportsContainer = document.getElementById('reportsContainer');
        
        if (!reportsContainer) {
            alert('No reports available to print.');
            return;
        }
        
        const userInfo = `
            <h2>Mind Insight Pro - Assessment Report</h2>
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <strong>User:</strong> ${this.state.userName}<br>
                <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>Overall Profile:</strong> ${this.getOverallLevel()}
            </div>
        `;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Mind Insight Pro - ${this.state.userName}'s Assessment Report</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        color: #333; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px;
                    }
                    .report-section { 
                        margin-bottom: 30px; 
                        page-break-inside: avoid;
                        border: 1px solid #ddd; 
                        border-radius: 8px; 
                        padding: 20px;
                    }
                    .report-header { 
                        background: #f8f9fa; 
                        padding: 15px; 
                        margin: -20px -20px 20px -20px;
                        border-bottom: 1px solid #ddd;
                        border-radius: 8px 8px 0 0;
                    }
                    .report-title { 
                        color: #2d3748; 
                        margin: 0 0 10px 0;
                    }
                    .report-content h1 { color: #2d3748; margin-top: 20px; }
                    .report-content h2 { color: #4a5568; margin-top: 15px; }
                    .report-content p { margin-bottom: 10px; }
                    .report-content ul { margin: 10px 0; padding-left: 20px; }
                    .report-content li { margin-bottom: 5px; }
                    @media print {
                        body { padding: 0; }
                        .report-section { border: none; margin-bottom: 20px; }
                    }
                </style>
            </head>
            <body>
                ${userInfo}
                ${reportsContainer.innerHTML}
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }
    
    getOverallLevel() {
        const overallScore = Object.values(this.state.results).reduce((sum, result) => sum + result.overall, 0) / Object.keys(this.state.results).length;
        const overallLevel = ScoringAlgorithm.determineLevel(overallScore);
        return ScoringAlgorithm.getLevelLabel(overallLevel);
    }
    
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

// Add CSS for progress indicator
const progressIndicatorCSS = `
.progress-dots {
    display: flex;
    gap: 6px;
}
.progress-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
    transition: background 0.3s ease;
}
.progress-dot.active {
    background: var(--primary);
}
`;

// Inject progress indicator styles
const style = document.createElement('style');
style.textContent = progressIndicatorCSS;
document.head.appendChild(style);