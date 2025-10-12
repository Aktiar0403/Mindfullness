// js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCWnHcorRuoumO3kgIbz_toZXZDpTplPaw",
  authDomain: "insight-458f6.firebaseapp.com",
  projectId: "insight-458f6",
  storageBucket: "insight-458f6.firebasestorage.app",
  messagingSenderId: "407501507239",
  appId: "1:407501507239:web:48505fb7100ca4f121e982",
  measurementId: "G-W8ZLN84YY2"
};
// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
    
    // Initialize Firestore
    window.db = firebase.firestore();
    
    // Optional: Enable offline persistence
    db.enablePersistence()
      .catch((err) => {
          console.log('Firebase persistence failed: ', err);
      });
      
} catch (error) {
    console.error("Firebase initialization error:", error);
}
// Add to firebase-config.js or app.js
function testFirebaseConnection() {
    if (window.db) {
        console.log('Firebase is connected!');
        
        // Test write operation
        const testRef = db.collection('test').doc('connection');
        testRef.set({
            test: true,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log('Firebase write test successful');
            // Clean up test document
            testRef.delete();
        }).catch(error => {
            console.error('Firebase write test failed:', error);
        });
    } else {
        console.log('Firebase not available');
    }
}

// Call this in your app initialization
// testFirebaseConnection();