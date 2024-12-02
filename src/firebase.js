import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOmw8J7a3B3GMCWxOqy-v1X3Z8Mfrr48M",
    authDomain: "shiftsdb-36ed1.firebaseapp.com",
    databaseURL: "https://shiftsdb-36ed1-default-rtdb.firebaseio.com",
    projectId: "shiftsdb-36ed1",
    storageBucket: "shiftsdb-36ed1.firebasestorage.app",
    messagingSenderId: "654883935071",
    appId: "1:654883935071:web:acc2cb0ed5ef9bb0059cea",
    measurementId: "G-EHFJWSMPRW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // Initialize Firebase Authentication

export { database, auth };