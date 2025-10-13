// js/report-loader.js
const ReportLoader = {
    async loadReport(category, level) {
        try {
            console.log(`📂 Loading report: ${category}, level ${level}`);
            
            // Convert category to lowercase for file paths
            const categoryLower = category.toLowerCase();
            const filePath = `reports/${categoryLower}/level${level}.md`;
            
            console.log(`🔍 Looking for file: ${filePath}`);
            
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const markdownContent = await response.text();
            console.log('✅ Report loaded successfully');
            
            return this.convertMarkdownToHTML(markdownContent);
            
        } catch (error) {
            console.error('❌ Error loading report:', error);
            return this.getFallbackReport(category, level);
        }
    },
    
    convertMarkdownToHTML(markdown) {
        if (!markdown) return '<p>No report content available.</p>';
        
        let html = markdown
            // Headers
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            // Bold and Italic
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            // Line breaks and paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // Lists
        html = html
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
        
        return `<div class="markdown-content">${html}</div>`;
    },
    
    getFallbackReport(category, level) {
        const levelLabel = ScoringAlgorithm.getLevelLabel(level);
        const levelDescriptions = {
            1: "beginning stage with significant growth potential",
            2: "developing foundation with clear improvement areas", 
            3: "moderate proficiency with balanced strengths",
            4: "good competency with advanced development opportunities",
            5: "strong capabilities with mastery potential",
            6: "excellent proficiency with leadership opportunities"
        };
        
        return `
            <div class="fallback-report">
                <h2>${category} Intelligence Report</h2>
                <div class="report-meta">
                    <span class="level-badge">${levelLabel} Level</span>
                </div>
                <p>Your assessment shows <strong>${levelLabel.toLowerCase()}</strong> proficiency in ${category.toLowerCase()} intelligence.</p>
                <p>This indicates you're at a ${levelDescriptions[level] || "developing stage"}.</p>
                
                <div class="recommendations">
                    <h3>Recommended Development Path:</h3>
                    <ul>
                        <li>Practice daily awareness and reflection exercises</li>
                        <li>Focus on applying these skills in real-world situations</li>
                        <li>Track your progress with weekly check-ins</li>
                        <li>Seek feedback from trusted colleagues or friends</li>
                    </ul>
                </div>
                
                <div class="next-steps">
                    <h3>Immediate Next Steps:</h3>
                    <p>Start with small, consistent practices and gradually build up to more advanced techniques as you develop confidence in this area.</p>
                </div>
            </div>
        `;
    }
};