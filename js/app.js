// js/app.js - Complete Corrected Version
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
        LanguageManager.init();
        // Clean up any corrupted data on startup
        const cleanedCount = DataManager.cleanupCorruptedData();
        if (cleanedCount > 0) {
            console.log(`Cleaned up ${cleanedCount} corrupted data entries`);
        }
        
        this.loadExistingSession();
    }
    
    bindEvents() {
        // Intro screen
        document.getElementById('startBtn').addEventListener('click', () => this.startTest());
        document.getElementById('userName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startTest();
        });
        
        // Language selector events
        document.getElementById('langBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('langDropdown').classList.toggle('active');
        });

        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.changeLanguage(lang);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#langDropdown') && !e.target.closest('#langBtn')) {
                document.getElementById('langDropdown').classList.remove('active');
            }
        });
        
        // Question screen
        document.getElementById('backBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.handleAnswer());
        
        // Option selection
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="answer"]')) {
                document.getElementById('nextBtn').disabled = false;
            }
        });
        
        // Analytics screen
        document.getElementById('viewReportsBtn').addEventListener('click', () => this.showReports());
        
        // Result screen
        document.getElementById('restartBtn').addEventListener('click', () => this.restartTest());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPDFReport());
        document.getElementById('viewAnalyticsBtn').addEventListener('click', () => this.showAnalytics());
    }
    
    changeLanguage(lang) {
        if (LanguageManager.setLanguage(lang)) {
            this.updateLanguageUI();
            if (this.state.currentCategoryIndex !== 0 || this.state.currentQuestionIndex !== 0) {
                this.loadCurrentQuestion(); // Refresh current question
            }
        }
    }

    updateLanguageUI() {
        const currentLang = LanguageManager.getLanguage();
        const langData = LanguageManager.languages[currentLang];
        
        document.getElementById('currentLangFlag').textContent = langData.flag;
        document.getElementById('currentLangName').textContent = langData.name;
        
        // Update active state in dropdown
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === currentLang);
        });
    }
    
    loadExistingSession() {
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('psychometric_')) {
                    const userData = JSON.parse(localStorage.getItem(key));
                    if (userData && !userData.completed) {
                        const continueTest = confirm(
                            `We found an incomplete assessment for ${userData.demographics?.name || 'a user'}. ` +
                            `Would you like to continue where you left off?`
                        );
                        
                        if (continueTest) {
                            this.state.userId = userData.userId;
                            this.state.demographics = userData.demographics || {};
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
        document.getElementById('currentCategory').textContent = `${category} - ${subcategory}`;
        document.getElementById('currentQuestionNumber').textContent = this.state.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = questions.length;
        document.getElementById('questionText').textContent = QuestionManager.getQuestionText(question);
        
        // Reset radio buttons and check for existing answer
        let hasExistingAnswer = false;
        document.querySelectorAll('.option-input').forEach(input => {
            input.checked = false;
            
            // Check if this question was already answered
            const existingAnswer = this.getCurrentAnswer();
            if (existingAnswer !== undefined && parseInt(input.value) === existingAnswer) {
                input.checked = true;
                hasExistingAnswer = true;
            }
        });
        
        // Update progress
        this.updateProgress();
        
        // Enable/disable navigation
        document.getElementById('backBtn').disabled = this.isFirstQuestion();
        document.getElementById('nextBtn').disabled = !hasExistingAnswer;
        
        // Record timestamp
        this.state.responseTimestamps.push(Date.now());
    }
    
    getCurrentAnswer() {
        const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
        const subcategory = QuestionManager.getSubcategories(category)[this.state.currentSubcategoryIndex];
        
        return this.state.answers[category]?.[subcategory]?.[this.state.currentQuestionIndex];
    }
    
    handleAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        
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
        // Mark as skipped (null value)
        const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
        const subcategory = QuestionManager.getSubcategories(category)[this.state.currentSubcategoryIndex];
        
        if (!this.state.answers[category]) {
            this.state.answers[category] = {};
        }
        if (!this.state.answers[category][subcategory]) {
            this.state.answers[category][subcategory] = [];
        }
        this.state.answers[category][subcategory][this.state.currentQuestionIndex] = null;
        
        this.moveToNextQuestion();
    }
    
    moveToNextQuestion() {
        this.state.currentQuestionIndex++;
        
        const category = QuestionManager.getCategories()[this.state.currentCategoryIndex];
        const subcategories = QuestionManager.getSubcategories(category);
        
        // Check if we have more categories
        if (this.state.currentCategoryIndex >= QuestionManager.getCategories().length) {
            this.calculateResults();
            return;
        }
        
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
        const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
        
        document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        // Also update browser tab title with progress
        document.title = `Psychometric Test (${Math.round(progress)}%)`;
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
        const categories = Object.keys(this.state.results);
        const overallScore = categories.length > 0 
            ? categories.reduce((sum, category) => sum + this.state.results[category].overall, 0) / categories.length
            : 0;
        const overallLevel = ScoringAlgorithm.determineLevel(overallScore);
        
        analyticsGrid.appendChild(this.createAnalyticsCard('Overall Psychological Profile', `
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 3rem; font-weight: bold; color: ${ScoringAlgorithm.getLevelColor(overallLevel)}">${overallScore.toFixed(1)}</div>
                <div style="font-size: 1.2rem; color: #666;">Level ${overallLevel} - ${ScoringAlgorithm.getLevelLabel(overallLevel)}</div>
            </div>
            <div class="stat-item">
                <span>Response Consistency:</span>
                <span class="stat-value">${(this.state.analytics.consistency || 0).toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span>Average Response Time:</span>
                <span class="stat-value">${((this.state.analytics.responseTime?.avgTime) || 0).toFixed(1)}s</span>
            </div>
            <div class="stat-item">
                <span>Response Pattern:</span>
                <span class="stat-value">${this.state.analytics.responseTime?.pattern || 'Normal'}</span>
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
            
            if (result.subcategories) {
                for (const [subcategory, subResult] of Object.entries(result.subcategories)) {
                    categoryContent += `
                        <div style="padding-left: 20px; font-size: 0.9rem; color: #666;">
                            <span>${subcategory}:</span>
                            <span>${subResult.score.toFixed(1)}</span>
                        </div>
                    `;
                }
            }
        }
        
        analyticsGrid.appendChild(this.createAnalyticsCard('Category Breakdown', categoryContent));
        
        // Comparative Analytics
        const aggregateData = DataManager.getAggregateData();
        if (aggregateData && aggregateData.totalUsers > 1) {
            let comparisonContent = `<div style="margin-bottom: 15px;">Based on ${aggregateData.totalUsers} completed assessments</div>`;
            
            for (const [category, avgScore] of Object.entries(aggregateData.categoryAverages || {})) {
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
        if (insights?.keyStrengths?.length > 0) {
            insightsContent += `<div style="margin-bottom: 15px;"><strong>Key Strengths:</strong> ${insights.keyStrengths.map(s => s.category).join(', ')}</div>`;
        }
        if (insights?.developmentAreas?.length > 0) {
            insightsContent += `<div style="margin-bottom: 15px;"><strong>Areas for Development:</strong> ${insights.developmentAreas.map(a => a.category).join(', ')}</div>`;
        }
        if (insights?.recommendations?.length > 0) {
            insightsContent += `<div><strong>Recommendations:</strong><ul style="margin-top: 10px;">${insights.recommendations.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
        }
        
        if (insightsContent) {
            analyticsGrid.appendChild(this.createAnalyticsCard('Key Insights', insightsContent));
        }
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
        const userGreeting = document.getElementById('userGreeting');
        if (userGreeting) {
            userGreeting.textContent = `Here are your personalized insights, ${this.state.userName}.`;
        }
        
        // Display results summary
        const resultsSummary = document.getElementById('resultsSummary');
        if (resultsSummary) {
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
        }
        
        // Load and display reports
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
                reportHeader.innerHTML = `<h3 class="report-title">${category} - Level ${result.level} (${ScoringAlgorithm.getLevelLabel(result.level)})</h3>`;
                
                const reportContentDiv = document.createElement('div');
                reportContentDiv.className = 'report-content';
                reportContentDiv.innerHTML = reportContent;
                
                reportSection.appendChild(reportHeader);
                reportSection.appendChild(reportContentDiv);
                
                reportsContainer.appendChild(reportSection);
            } catch (error) {
                console.error(`Error loading report for ${category}:`, error);
                
                // Create a fallback report section
                const reportSection = document.createElement('div');
                reportSection.className = 'report-section';
                reportSection.innerHTML = `
                    <div class="report-header">
                        <h3 class="report-title">${category} - Level ${result.level}</h3>
                    </div>
                    <div class="report-content">
                        <p>Report content is currently unavailable. Please try again later.</p>
                    </div>
                `;
                reportsContainer.appendChild(reportSection);
            }
        }
    }
    
    async downloadPDFReport() {
        try {
            // Show loading state
            const downloadBtn = document.getElementById('downloadBtn');
            const originalText = downloadBtn.textContent;
            downloadBtn.textContent = 'Generating PDF...';
            downloadBtn.disabled = true;
            
            // Collect all report content
            const reportsContent = {};
            for (const [category, result] of Object.entries(this.state.results)) {
                try {
                    const report = await ReportLoader.loadReport(category, result.level);
                    reportsContent[category] = this.stripHTML(report);
                } catch (error) {
                    console.error(`Error loading report for ${category}:`, error);
                    reportsContent[category] = `Report for ${category} - Level ${result.level} not available.`;
                }
            }
            
            // Get user data
            const userData = DataManager.getUserData(this.state.userId) || {
                demographics: this.state.demographics,
                responses: this.state.answers
            };
            
            // Generate PDF
            const success = await PDFGenerator.generateReport(
                userData, 
                this.state.results, 
                reportsContent
            );
            
            if (success) {
                console.log('PDF report generated successfully');
            } else {
                throw new Error('PDF generation failed');
            }
            
        } catch (error) {
            console.error('Error generating PDF report:', error);
            alert('Error generating PDF report. Please try again.');
        } finally {
            // Restore button state
            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.textContent = 'Download Full Report';
                downloadBtn.disabled = false;
            }
        }
    }
    
    // Helper method to strip HTML from reports
    stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
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
            document.getElementById('userName').value = "";
            document.getElementById('userAge').value = "";
            document.getElementById('userGender').value = "";
            document.getElementById('userOccupation').value = "";
            
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
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.psychometricApp = new PsychometricApp();
});