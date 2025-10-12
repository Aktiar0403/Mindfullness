// Analytics and Reporting System
const AnalyticsEngine = {
    generateComparativeAnalysis: function(userResults, aggregateData) {
        if (!aggregateData) return null;
        
        const comparison = {
            overall: {},
            categories: {},
            strengths: [],
            improvements: []
        };
        
        // Calculate overall comparison
        const userOverall = Object.values(userResults).reduce((sum, result) => sum + result.overall, 0) / Object.keys(userResults).length;
        const aggregateOverall = Object.values(aggregateData.categoryAverages).reduce((sum, score) => sum + score, 0) / Object.keys(aggregateData.categoryAverages).length;
        
        comparison.overall = {
            userScore: userOverall,
            averageScore: aggregateOverall,
            difference: userOverall - aggregateOverall,
            percentile: this.calculatePercentile(userOverall, aggregateData)
        };
        
        // Category comparisons
        for (const [category, userResult] of Object.entries(userResults)) {
            const avgScore = aggregateData.categoryAverages[category] || 0;
            comparison.categories[category] = {
                userScore: userResult.overall,
                averageScore: avgScore,
                difference: userResult.overall - avgScore
            };
            
            // Identify strengths and improvements
            if (userResult.overall >= 4.0) {
                comparison.strengths.push(category);
            } else if (userResult.overall <= 2.5) {
                comparison.improvements.push(category);
            }
        }
        
        return comparison;
    },
    
    calculatePercentile: function(userScore, aggregateData) {
        // Simplified percentile calculation
        // In a real implementation, this would use proper statistical methods
        const allScores = Object.values(aggregateData.categoryAverages);
        if (allScores.length === 0) return 50;
        
        const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
        const stdDev = Math.sqrt(allScores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / allScores.length);
        
        if (stdDev === 0) return 50;
        
        const zScore = (userScore - avgScore) / stdDev;
        // Convert z-score to percentile (simplified)
        return Math.min(99, Math.max(1, 50 + (zScore * 15)));
    },
    
    generateInsights: function(userResults, comparison) {
        const insights = {
            keyStrengths: [],
            developmentAreas: [],
            recommendations: []
        };
        
        // Analyze category patterns
        const categories = Object.keys(userResults);
        const scores = categories.map(cat => userResults[cat].overall);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        
        // Identify key strengths (scores >= 4.0 and above average)
        categories.forEach(category => {
            const result = userResults[category];
            const comp = comparison.categories[category];
            
            if (result.overall >= 4.0 && comp.difference > 0) {
                insights.keyStrengths.push({
                    category: category,
                    score: result.overall,
                    advantage: comp.difference
                });
            }
        });
        
        // Identify development areas (scores <= 3.0 or below average)
        categories.forEach(category => {
            const result = userResults[category];
            const comp = comparison.categories[category];
            
            if (result.overall <= 3.0 || comp.difference < -0.5) {
                insights.developmentAreas.push({
                    category: category,
                    score: result.overall,
                    gap: Math.abs(comp.difference)
                });
            }
        });
        
        // Generate recommendations
        if (insights.developmentAreas.length > 0) {
            insights.recommendations.push(`Focus on developing your ${insights.developmentAreas[0].category} skills through targeted practice and learning.`);
        }
        
        if (insights.keyStrengths.length > 0) {
            insights.recommendations.push(`Leverage your strength in ${insights.keyStrengths[0].category} to enhance your overall psychological profile.`);
        }
        
        // Add general recommendations based on response patterns
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        if (avgScore < 3.0) {
            insights.recommendations.push("Consider seeking professional development resources to build foundational psychological skills.");
        } else if (avgScore > 4.0) {
            insights.recommendations.push("Your strong psychological profile suggests you could benefit from leadership or mentoring opportunities.");
        }
        
        return insights;
    },
    
    createProgressChart: function(userResults) {
        // Create a simple radar chart representation
        const categories = Object.keys(userResults);
        const scores = categories.map(cat => userResults[cat].normalized);
        
        return {
            type: 'radar',
            categories: categories,
            scores: scores,
            maxScore: 100,
            avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
        };
    }
};

// Report Loader for Markdown Files
const ReportLoader = {
    loadReport: async function(category, level) {
        try {
            const response = await fetch(`reports/${category.toLowerCase()}/level${level}.md`);
            if (!response.ok) {
                throw new Error(`Report not found: ${category}/level${level}`);
            }
            const markdown = await response.text();
            return this.convertMarkdownToHTML(markdown);
        } catch (error) {
            console.error('Error loading report:', error);
            return this.getFallbackReport(category, level);
        }
    },
    
    convertMarkdownToHTML: function(markdown) {
        // Simple markdown to HTML conversion
        return markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/<p>(.*?)<\/p>/g, '<p>$1</p>');
    },
    
    getFallbackReport: function(category, level) {
        const levelLabels = {
            1: "Very Low", 2: "Low", 3: "Moderate", 
            4: "Good", 5: "Strong", 6: "Excellent"
        };
        
        return `
            <h1>${category} Intelligence - Level ${level}</h1>
            <h2>${levelLabels[level]} Proficiency</h2>
            <p>Your assessment results indicate a <strong>${levelLabels[level].toLowerCase()}</strong> level of ${category.toLowerCase()} intelligence.</p>
            <p>This area of your psychological profile shows significant potential for development and growth.</p>
            <h3>Recommendations</h3>
            <p>Based on your current level, we recommend:</p>
            <ul>
                <li>Engaging in targeted practice exercises</li>
                <li>Seeking feedback from peers or mentors</li>
                <li>Exploring additional learning resources</li>
                <li>Applying these skills in real-world situations</li>
            </ul>
            <p>Continue your development journey to reach higher levels of mastery.</p>
        `;
    }
};