// Data Storage and Analytics Manager
const DataManager = {
    generateUserId: function() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    saveResponse: function(userId, category, subcategory, questionIndex, answer, timestamp) {
        try {
            const key = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(key)) || {
                userId: userId,
                demographics: {},
                responses: {},
                timestamps: [],
                completed: false,
                date: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            // Initialize nested objects if they don't exist
            if (!userData.responses) userData.responses = {};
            if (!userData.responses[category]) userData.responses[category] = {};
            if (!userData.responses[category][subcategory]) userData.responses[category][subcategory] = [];
            if (!userData.timestamps) userData.timestamps = [];
            
            // Ensure the array is long enough
            while (userData.responses[category][subcategory].length <= questionIndex) {
                userData.responses[category][subcategory].push(null);
            }
            
            // Save the answer
            userData.responses[category][subcategory][questionIndex] = answer;
            userData.timestamps.push(timestamp);
            userData.lastUpdated = new Date().toISOString();
            
            localStorage.setItem(key, JSON.stringify(userData));
            console.log(`Saved response: ${category}/${subcategory}/Q${questionIndex} = ${answer}`);
            return userData;
        } catch (error) {
            console.error('Error saving response:', error);
            return null;
        }
    },
    
    saveDemographics: function(userId, demographics) {
        try {
            const key = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(key)) || {
                userId: userId,
                demographics: {},
                responses: {},
                timestamps: [],
                completed: false,
                date: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            userData.demographics = demographics;
            userData.lastUpdated = new Date().toISOString();
            localStorage.setItem(key, JSON.stringify(userData));
            console.log('Saved demographics for user:', userId);
            return userData;
        } catch (error) {
            console.error('Error saving demographics:', error);
            return null;
        }
    },
    
    markComplete: function(userId, results) {
        try {
            const key = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(key));
            
            if (userData) {
                userData.completed = true;
                userData.results = results;
                userData.completionDate = new Date().toISOString();
                userData.lastUpdated = new Date().toISOString();
                localStorage.setItem(key, JSON.stringify(userData));
                console.log('Marked user as complete:', userId);
            }
            
            return userData;
        } catch (error) {
            console.error('Error marking complete:', error);
            return null;
        }
    },
    
    getUserData: function(userId) {
        try {
            const key = `psychometric_${userId}`;
            const data = localStorage.getItem(key);
            if (!data) return null;
            
            const userData = JSON.parse(data);
            console.log('Retrieved user data for:', userId);
            return userData;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },
    
    // ... rest of the methods remain the same as previous corrected version ...

    
    getAllUserData: function() {
        const allData = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('psychometric_')) {
                try {
                    const userData = JSON.parse(localStorage.getItem(key));
                    if (userData && userData.completed) {
                        allData.push(userData);
                    }
                } catch (error) {
                    console.error('Error parsing user data for key:', key, error);
                }
            }
        }
        return allData;
    },
    
    getAggregateData: function() {
        const allData = this.getAllUserData();
        if (allData.length === 0) return null;
        
        const aggregates = {
            totalUsers: allData.length,
            categoryAverages: {},
            demographicBreakdown: {
                age: { under25: 0, twentyFiveTo35: 0, thirtySixTo50: 0, over50: 0 },
                gender: {},
                occupation: {}
            }
        };
        
        // Calculate category averages
        const categorySums = {};
        const categoryCounts = {};
        
        allData.forEach(user => {
            // Demographic breakdown
            const age = user.demographics ? user.demographics.age : 0;
            if (age < 25) {
                aggregates.demographicBreakdown.age.under25++;
            } else if (age <= 35) {
                aggregates.demographicBreakdown.age.twentyFiveTo35++;
            } else if (age <= 50) {
                aggregates.demographicBreakdown.age.thirtySixTo50++;
            } else {
                aggregates.demographicBreakdown.age.over50++;
            }
            
            const gender = (user.demographics && user.demographics.gender) ? user.demographics.gender : 'not-specified';
            aggregates.demographicBreakdown.gender[gender] = 
                (aggregates.demographicBreakdown.gender[gender] || 0) + 1;
            
            const occupation = (user.demographics && user.demographics.occupation) ? user.demographics.occupation : 'not-specified';
            aggregates.demographicBreakdown.occupation[occupation] = 
                (aggregates.demographicBreakdown.occupation[occupation] || 0) + 1;
            
            // Category averages
            if (user.results) {
                Object.entries(user.results).forEach(([category, result]) => {
                    if (!categorySums[category]) {
                        categorySums[category] = 0;
                        categoryCounts[category] = 0;
                    }
                    categorySums[category] += result.overall;
                    categoryCounts[category]++;
                });
            }
        });
        
        // Calculate final averages
        Object.keys(categorySums).forEach(category => {
            aggregates.categoryAverages[category] = 
                categorySums[category] / categoryCounts[category];
        });
        
        return aggregates;
    },
    
    exportUserData: function(userId) {
        const userData = this.getUserData(userId);
        if (userData && userData.demographics) {
            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            const userName = userData.demographics.name || 'user';
            const date = new Date().toISOString().split('T')[0];
            a.download = `psychometric_data_${userName}_${date}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            return true;
        }
        return false;
    },
    
    clearUserData: function(userId) {
        const key = `psychometric_${userId}`;
        localStorage.removeItem(key);
    },
    
    clearAllData: function() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('psychometric_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(function(key) {
            localStorage.removeItem(key);
        });
    }
};