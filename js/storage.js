// js/storage.js - Complete Data Storage and Analytics Manager
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
    
    saveToLocalStorageOnly(userId, category, subcategory, questionIndex, answer, timestamp) {
        try {
            const localKey = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(localKey)) || {
                userId: userId,
                demographics: {},
                responses: {},
                timestamps: [],
                completed: false,
                date: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            if (!userData.responses) userData.responses = {};
            if (!userData.responses[category]) userData.responses[category] = {};
            if (!userData.responses[category][subcategory]) userData.responses[category][subcategory] = [];
            if (!userData.timestamps) userData.timestamps = [];
            
            while (userData.responses[category][subcategory].length <= questionIndex) {
                userData.responses[category][subcategory].push(null);
            }
            
            userData.responses[category][subcategory][questionIndex] = answer;
            userData.timestamps.push(timestamp);
            userData.lastUpdated = new Date().toISOString();
            
            localStorage.setItem(localKey, JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Error saving to localStorage only:', error);
            return null;
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
    
    saveDemographicsToLocalStorageOnly(userId, demographics) {
        try {
            const localKey = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(localKey)) || {
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
            localStorage.setItem(localKey, JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Error saving demographics to localStorage only:', error);
            return null;
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
    
    markCompleteLocalStorageOnly(userId, results) {
        try {
            const localKey = `psychometric_${userId}`;
            let userData = JSON.parse(localStorage.getItem(localKey));
            
            if (userData) {
                userData.completed = true;
                userData.results = results;
                userData.completionDate = new Date().toISOString();
                userData.lastUpdated = new Date().toISOString();
                localStorage.setItem(localKey, JSON.stringify(userData));
            }
            
            return userData;
        } catch (error) {
            console.error('Error marking complete in localStorage only:', error);
            return null;
        }
    },
    
    getUserData(userId) {
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
    
    getUserDataFromLocalStorage(userId) {
        try {
            const key = `psychometric_${userId}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting user data from localStorage:', error);
            return null;
        }
    },
    
    getAllUserData() {
        const allData = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('psychometric_')) {
                    try {
                        const userData = JSON.parse(localStorage.getItem(key));
                        if (userData && userData.completed) {
                            allData.push(userData);
                        }
                    } catch (parseError) {
                        console.warn('Skipping invalid user data for key:', key);
                    }
                }
            }
        } catch (error) {
            console.error('Error reading all user data:', error);
        }
        return allData;
    },
    
    getAllUserDataFromLocalStorage() {
        const allData = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('psychometric_')) {
                    try {
                        const userData = JSON.parse(localStorage.getItem(key));
                        if (userData && userData.completed) {
                            allData.push(userData);
                        }
                    } catch (error) {
                        console.warn('Skipping corrupted data for key:', key);
                    }
                }
            }
        } catch (error) {
            console.error('Error getting all user data from localStorage:', error);
        }
        return allData;
    },
    
    async getAggregateData() {
        try {
            const allData = await this.getAllUserData();
            if (allData.length === 0) return null;
            
            const aggregates = {
                totalUsers: allData.length,
                categoryAverages: {},
                demographicBreakdown: {
                    ageGroups: { under25: 0, age25to35: 0, age36to50: 0, over50: 0 },
                    gender: {},
                    occupation: {}
                },
                source: 'localStorage' // or 'firebase' if from cloud
            };
            
            const categorySums = {};
            const categoryCounts = {};
            
            allData.forEach(function(user) {
                // Demographic breakdown
                const age = user.demographics ? user.demographics.age : 0;
                if (age < 25) {
                    aggregates.demographicBreakdown.ageGroups.under25++;
                } else if (age <= 35) {
                    aggregates.demographicBreakdown.ageGroups.age25to35++;
                } else if (age <= 50) {
                    aggregates.demographicBreakdown.ageGroups.age36to50++;
                } else {
                    aggregates.demographicBreakdown.ageGroups.over50++;
                }
                
                const gender = (user.demographics && user.demographics.gender) ? user.demographics.gender : 'not-specified';
                aggregates.demographicBreakdown.gender[gender] = 
                    (aggregates.demographicBreakdown.gender[gender] || 0) + 1;
                
                const occupation = (user.demographics && user.demographics.occupation) ? user.demographics.occupation : 'not-specified';
                aggregates.demographicBreakdown.occupation[occupation] = 
                    (aggregates.demographicBreakdown.occupation[occupation] || 0) + 1;
                
                // Category averages
                if (user.results) {
                    Object.entries(user.results).forEach(function([category, result]) {
                        if (result && typeof result.overall === 'number') {
                            if (!categorySums[category]) {
                                categorySums[category] = 0;
                                categoryCounts[category] = 0;
                            }
                            categorySums[category] += result.overall;
                            categoryCounts[category]++;
                        }
                    });
                }
            });
            
            // Calculate final averages
            Object.keys(categorySums).forEach(function(category) {
                if (categoryCounts[category] > 0) {
                    aggregates.categoryAverages[category] = 
                        categorySums[category] / categoryCounts[category];
                }
            });
            
            return aggregates;
        } catch (error) {
            console.error('Error calculating aggregate data:', error);
            return null;
        }
    },
    
    validateUserData(userId) {
        try {
            const userData = this.getUserData(userId);
            if (!userData) return false;
            
            const requiredFields = ['userId', 'demographics', 'responses', 'timestamps'];
            for (const field of requiredFields) {
                if (!userData[field]) {
                    console.warn(`Missing required field: ${field}`);
                    return false;
                }
            }
            
            // Validate responses structure
            for (const category in userData.responses) {
                if (typeof userData.responses[category] !== 'object') {
                    console.warn(`Invalid responses structure for category: ${category}`);
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error validating user data:', error);
            return false;
        }
    },
    
    cleanupCorruptedData() {
        try {
            const corruptedKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('psychometric_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        // Basic validation
                        if (!data || typeof data !== 'object' || !data.userId) {
                            corruptedKeys.push(key);
                        }
                    } catch (error) {
                        corruptedKeys.push(key);
                    }
                }
            }
            
            corruptedKeys.forEach(function(key) {
                console.log('Removing corrupted data:', key);
                localStorage.removeItem(key);
            });
            
            console.log(`Cleaned up ${corruptedKeys.length} corrupted data entries`);
            return corruptedKeys.length;
        } catch (error) {
            console.error('Error during data cleanup:', error);
            return 0;
        }
    },
    
    clearUserData(userId) {
        try {
            const key = `psychometric_${userId}`;
            localStorage.removeItem(key);
            
            // Also try to remove from Firebase if available
            if (window.db) {
                db.collection('users').doc(userId).delete().catch(error => {
                    console.log('Firebase user deletion failed (might not exist):', error);
                });
                db.collection('userResponses').doc(userId).delete().catch(error => {
                    console.log('Firebase responses deletion failed (might not exist):', error);
                });
            }
            
            return true;
        } catch (error) {
            console.error('Error clearing user data:', error);
            return false;
        }
    },
    
    clearAllData() {
        try {
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
            
            console.log(`Cleared all ${keysToRemove.length} user data entries`);
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    },
    
    getStorageStats() {
        try {
            let totalUsers = 0;
            let completedAssessments = 0;
            let totalResponses = 0;
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('psychometric_')) {
                    try {
                        const userData = JSON.parse(localStorage.getItem(key));
                        totalUsers++;
                        
                        if (userData.completed) {
                            completedAssessments++;
                        }
                        
                        // Count responses
                        if (userData.responses) {
                            Object.values(userData.responses).forEach(category => {
                                Object.values(category).forEach(subcategory => {
                                    totalResponses += subcategory.filter(answer => answer !== null && answer !== undefined).length;
                                });
                            });
                        }
                    } catch (error) {
                        // Skip corrupted data
                    }
                }
            }
            
            return {
                totalUsers: totalUsers,
                completedAssessments: completedAssessments,
                totalResponses: totalResponses,
                storageUsage: this.getLocalStorageUsage()
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return null;
        }
    },
    
    getLocalStorageUsage() {
        try {
            let totalSize = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key);
                    totalSize += key.length + (value ? value.length : 0);
                }
            }
            return {
                sizeBytes: totalSize,
                sizeKB: Math.round(totalSize / 1024 * 100) / 100,
                sizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
            };
        } catch (error) {
            console.error('Error calculating storage usage:', error);
            return { sizeBytes: 0, sizeKB: 0, sizeMB: 0 };
        }
    },
    
    // Backup and restore methods
    exportAllData() {
        try {
            const allData = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('psychometric_')) {
                    try {
                        allData[key] = JSON.parse(localStorage.getItem(key));
                    } catch (error) {
                        console.warn('Skipping corrupted data for key:', key);
                    }
                }
            }
            
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `psychometric_data_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Error exporting all data:', error);
            return false;
        }
    },
    
    importData(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            let importedCount = 0;
            
            Object.entries(data).forEach(([key, value]) => {
                if (key.startsWith('psychometric_')) {
                    localStorage.setItem(key, JSON.stringify(value));
                    importedCount++;
                }
            });
            
            console.log(`Imported ${importedCount} user records`);
            return importedCount;
        } catch (error) {
            console.error('Error importing data:', error);
            return 0;
        }
    }
};