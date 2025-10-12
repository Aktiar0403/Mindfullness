// js/firebase-config.js - Updated with better error handling
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
try {
    if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "your-api-key-here") {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully");
        
        // Initialize Firestore
        window.db = firebase.firestore();
        
        // Enable offline persistence with better error handling
        if (window.db) {
            db.enablePersistence()
              .catch((err) => {
                  console.log('Firebase persistence failed: ', err);
              });
        }
    } else {
        console.warn('Firebase not configured. Please update firebase-config.js with your Firebase project details.');
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}