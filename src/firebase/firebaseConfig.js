// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCO8z1plQkLpZr_G0fxygQr_Nqaa2RYyF0",
  authDomain: "almed-c945b.firebaseapp.com",
  projectId: "almed-c945b",
  storageBucket: "almed-c945b.firebasestorage.app",
  messagingSenderId: "1011231570413",
  appId: "1:1011231570413:web:829b1dbb13a43956420fe4",
  measurementId: "G-GHDQWMSR0N"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
