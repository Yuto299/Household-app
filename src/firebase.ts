// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDPPn4gsRT2I_xx4VIl_aUJqEibJgRCEKQ',
  authDomain: 'householdtypescript-d2a0b.firebaseapp.com',
  projectId: 'householdtypescript-d2a0b',
  storageBucket: 'householdtypescript-d2a0b.firebasestorage.app',
  messagingSenderId: '848054035480',
  appId: '1:848054035480:web:db5e9dae3786d4c2b74f6d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
