// js/storage.js - Automatic Firebase Saving
const DataManager = {
    generateUserId: function() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    async saveResponse(userId, category, subcategory, questionIndex, answer, timestamp) {
        try {
            // Always save to localStorage for immediate access
            const localKey = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(localKey)) || {
                userId: userId,
                demographics: {},
                responses: {},
                timestamps: [],
                completed: false,
                date: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                consentedToResearch: true // Auto-consent for analytics
            };
            
            // Initialize nested objects
            if (!userData.responses) userData.responses = {};
            if (!userData.responses[category]) userData.responses[category] = {};
            if (!userData.responses[category][subcategory]) userData.responses[category][subcategory] = [];
            if (!userData.timestamps) userData.timestamps = [];
            
            // Ensure array length
            while (userData.responses[category][subcategory].length <= questionIndex) {
                userData.responses[category][subcategory].push(null);
            }
            
            // Update data
            userData.responses[category][subcategory][questionIndex] = answer;
            userData.timestamps.push(timestamp);
            userData.lastUpdated = new Date().toISOString();
            
            // Save to localStorage
            localStorage.setItem(localKey, JSON.stringify(userData));
            
            // Auto-save to Firebase for analytics
            await this.autoSaveToFirebase(userId, userData);
            
            return userData;
        } catch (error) {
            console.error('Error saving response:', error);
            // Continue with localStorage only
            return this.saveToLocalStorageOnly(userId, category, subcategory, questionIndex, answer, timestamp);
        }
    },
    
    async autoSaveToFirebase(userId, userData) {
        try {
            if (!window.db) {
                console.log('Firebase not available, skipping cloud save');
                return;
            }
            
            // Save responses to Firebase
            await db.collection('userResponses').doc(userId).set({
                responses: userData.responses,
                timestamps: userData.timestamps,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            
            // Save demographics if available
            if (userData.demographics && Object.keys(userData.demographics).length > 0) {
                await db.collection('users').doc(userId).set({
                    demographics: userData.demographics,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    consentedToResearch: true
                }, { merge: true });
            }
            
            console.log('Data auto-saved to Firebase for analytics');
        } catch (error) {
            console.error('Auto-save to Firebase failed:', error);
            // Don't throw error - continue silently
        }
    },
    
    async saveDemographics(userId, demographics) {
        try {
            const localKey = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(localKey)) || {
                userId: userId,
                demographics: {},
                responses: {},
                timestamps: [],
                completed: false,
                date: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                consentedToResearch: true
            };
            
            userData.demographics = demographics;
            userData.lastUpdated = new Date().toISOString();
            localStorage.setItem(localKey, JSON.stringify(userData));
            
            // Auto-save to Firebase
            await this.autoSaveToFirebase(userId, userData);
            
            return userData;
        } catch (error) {
            console.error('Error saving demographics:', error);
            return this.saveDemographicsToLocalStorageOnly(userId, demographics);
        }
    },
    
    async markComplete(userId, results) {
        try {
            const localKey = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(localKey));
            
            if (userData) {
                userData.completed = true;
                userData.results = results;
                userData.completionDate = new Date().toISOString();
                userData.lastUpdated = new Date().toISOString();
                localStorage.setItem(localKey, JSON.stringify(userData));
                
                // Auto-save completion to Firebase
                if (window.db) {
                    const completionData = {
                        completed: true,
                        results: results,
                        completionDate: firebase.firestore.FieldValue.serverTimestamp(),
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                        demographics: userData.demographics,
                        consentedToResearch: true
                    };
                    
                    await db.collection('completedAssessments').doc(userId).set(completionData, { merge: true });
                    await db.collection('users').doc(userId).set(completionData, { merge: true });
                    
                    console.log('Completion auto-saved to Firebase');
                }
            }
            
            return userData;
        } catch (error) {
            console.error('Error marking complete:', error);
            return this.markCompleteLocalStorageOnly(userId, results);
        }
    },
    
    // Remove the exportUserData function since we're auto-saving
    // exportUserData: function(userId) { ... } // REMOVED
    
    // ... keep other methods the same (getUserData, getAllUserData, getAggregateData, etc.)

    
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