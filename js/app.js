// Main Application Controller
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
        this.loadExistingSession();
    }
    
    bindEvents() {
        // Intro screen
        document.getElementById('startBtn').addEventListener('click', () => this.startTest());
        document.getElementById('userName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startTest();
        });
        
        // Question screen
        document.getElementById('backBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('skipBtn').addEventListener('click', () => this.skipQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.handleAnswer());
        
        // Option selection
        document.querySelectorAll('.option-input').forEach(input => {
            input.addEventListener('change', () => {
                document.getElementById('nextBtn').disabled = false;
            });
        });
        
        // Analytics screen
        document.getElementById('viewReportsBtn').addEventListener('click', () => this.showReports());
     
        
        // Result screen
        document.getElementById('restartBtn').addEventListener('click', () => this.restartTest());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPDFReport());
        document.getElementById('viewAnalyticsBtn').addEventListener('click', () => this.showAnalytics());
    }
    
    // Add the new download method
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
        }
        
    } catch (error) {
        console.error('Error generating PDF report:', error);
        alert('Error generating PDF report. Please try again.');
    } finally {
        // Restore button state
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.textContent = 'Download Full Report';
        downloadBtn.disabled = false;
    }
}

// Helper method to strip HTML from reports
stripHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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
        
        // Update UI
        document.getElementById('currentCategory').textContent = `${category} - ${subcategory}`;
        document.getElementById('currentQuestionNumber').textContent = this.state.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = questions.length;
        document.getElementById('questionText').textContent = question.q;
        
        // Reset radio buttons
        document.querySelectorAll('.option-input').forEach(input => {
            input.checked = false;
        });
        
        // Update progress
        this.updateProgress();
        
        // Enable/disable navigation
        document.getElementById('backBtn').disabled = this.isFirstQuestion();
        document.getElementById('nextBtn').disabled = true;
        
        // Record timestamp
        this.state.responseTimestamps.push(Date.now());
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
        
        // Store answer
        if (!this.state.answers[category]) {
            this.state.answers[category] = {};
        }
        if (!this.state.answers[category][subcategory]) {
            this.state.answers[category][subcategory] = [];
        }
        this.state.answers[category][subcategory][this.state.currentQuestionIndex] = answerValue;
        
        // Save to storage
        DataManager.saveResponse(
            this.state.userId,
            category,
            subcategory,
            this.state.currentQuestionIndex,
            answerValue,
            Date.now()
        );
        
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
        
        document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    getAnsweredQuestionsCount() {
        let answered = 0;
        for (const category in this.state.answers) {
            for (const subcategory in this.state.answers[category]) {
                answered += this.state.answers[category][subcategory].filter(a => a !== null && a !== undefined).length;
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
        
        // Mark as complete
        DataManager.markComplete(this.state.userId, this.state.results);
        
        this.showAnalytics();
    }
    
    showAnalytics() {
        this.showScreen('analyticsScreen');
        this.renderAnalytics();
    }
    
    renderAnalytics() {
        const analyticsGrid = document.getElementById('analyticsGrid');
        analyticsGrid.innerHTML = '';
        
        // Overall Score Card
        const overallScore = Object.values(this.state.results).reduce((sum, result) => sum + result.overall, 0) / Object.keys(this.state.results).length;
        const overallLevel = ScoringAlgorithm.determineLevel(overallScore);
        
        analyticsGrid.appendChild(this.createAnalyticsCard('Overall Psychological Profile', `
            <div style="text-align: center; margin: 20px 0;">
                <div style="font-size: 3rem; font-weight: bold; color: ${ScoringAlgorithm.getLevelColor(overallLevel)}">${overallScore.toFixed(1)}</div>
                <div style="font-size: 1.2rem; color: #666;">Level ${overallLevel} - ${ScoringAlgorithm.getLevelLabel(overallLevel)}</div>
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
                    <div style="padding-left: 20px; font-size: 0.9rem; color: #666;">
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
            let comparisonContent = `<div style="margin-bottom: 15px;">Based on ${aggregateData.totalUsers} completed assessments</div>`;
            
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
            insightsContent += `<div><strong>Recommendations:</strong><ul style="margin-top: 10px;">${insights.recommendations.map(r => `<li>${r}</li>`).join('')}</ul></div>`;
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
        document.getElementById('userGreeting').textContent = `Here are your personalized insights, ${this.state.userName}.`;
        
        // Display results summary
        const resultsSummary = document.getElementById('resultsSummary');
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
            }
        }
    }
    
    saveUserData() {
        const success = DataManager.exportUserData(this.state.userId);
        if (success) {
            alert("Your data has been saved successfully!");
        } else {
            alert("Error saving your data. Please try again.");
        }
    }
    
    downloadReport() {
        alert("In a complete implementation, this would generate a comprehensive PDF report with all analytics.");
        // This would use libraries like jsPDF and html2canvas
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
        document.getElementById(screenId).classList.add('active');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.psychometricApp = new PsychometricApp();
});