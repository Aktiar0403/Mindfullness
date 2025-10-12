// Advanced Scoring Algorithm
const ScoringAlgorithm = {
    calculateCategoryScore: function(category, answers) {
        let totalWeightedScore = 0;
        let totalPossibleScore = 0;
        let subcategoryScores = {};
        
        for (const [subcategory, questions] of Object.entries(category)) {
            let subcategoryScore = 0;
            let subcategoryWeight = 0;
            
            questions.forEach((question, index) => {
                const answer = answers[subcategory] ? answers[subcategory][index] : null;
                if (answer !== null && answer !== undefined) {
                    // Apply reverse scoring for Overthinking category
                    const adjustedAnswer = question.reverse ? (6 - answer) : answer;
                    subcategoryScore += adjustedAnswer * question.weight;
                    subcategoryWeight += question.weight;
                }
            });
            
            const avgSubcategoryScore = subcategoryWeight > 0 ? subcategoryScore / subcategoryWeight : 0;
            subcategoryScores[subcategory] = {
                score: avgSubcategoryScore,
                normalized: (avgSubcategoryScore / 5) * 100
            };
            
            totalWeightedScore += subcategoryScore;
            totalPossibleScore += subcategoryWeight * 5;
        }
        
        const overallScore = totalPossibleScore > 0 ? (totalWeightedScore / totalPossibleScore) * 5 : 0;
        
        return {
            overall: overallScore,
            subcategories: subcategoryScores,
            normalized: (overallScore / 5) * 100
        };
    },
    
    determineLevel: function(score) {
        if (score >= 4.5) return 6;
        else if (score >= 4.0) return 5;
        else if (score >= 3.5) return 4;
        else if (score >= 3.0) return 3;
        else if (score >= 2.0) return 2;
        else return 1;
    },
    
    calculateConsistency: function(answers) {
        // Calculate response consistency across questions
        const variances = [];
        
        for (const category in answers) {
            const categoryAnswers = Object.values(answers[category]).flat();
            if (categoryAnswers.length > 1) {
                const mean = categoryAnswers.reduce((a, b) => a + b, 0) / categoryAnswers.length;
                const variance = categoryAnswers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / categoryAnswers.length;
                variances.push(variance);
            }
        }
        
        const avgVariance = variances.reduce((a, b) => a + b, 0) / variances.length;
        // Convert to consistency score (0-100), lower variance = higher consistency
        return Math.max(0, 100 - (avgVariance * 20));
    },
    
    calculateResponseTimeAnalysis: function(timestamps) {
        // Analyze response time patterns
        if (timestamps.length < 2) return { avgTime: 0, consistency: 0 };
        
        const times = [];
        for (let i = 1; i < timestamps.length; i++) {
            times.push(timestamps[i] - timestamps[i-1]);
        }
        
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const mean = avgTime / 1000; // Convert to seconds
        
        // Calculate consistency (lower standard deviation = more consistent)
        const variance = times.reduce((a, b) => a + Math.pow(b - avgTime, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);
        const consistency = Math.max(0, 100 - (stdDev / avgTime) * 100);
        
        return {
            avgTime: mean,
            consistency: consistency,
            pattern: mean < 3 ? "Rushed" : mean > 15 ? "Deliberate" : "Balanced"
        };
    },
    
    getLevelLabel: function(level) {
        switch(level) {
            case 1: return "Very Low";
            case 2: return "Low";
            case 3: return "Moderate";
            case 4: return "Good";
            case 5: return "Strong";
            case 6: return "Excellent";
            default: return "Unknown";
        }
    },
    
    getLevelColor: function(level) {
        switch(level) {
            case 1: return "#dc3545";
            case 2: return "#fd7e14";
            case 3: return "#ffc107";
            case 4: return "#20c997";
            case 5: return "#0d6efd";
            case 6: return "#198754";
            default: return "#6c757d";
        }
    }
};