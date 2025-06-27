// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDlZ3K1vKwZ3LAqJ8-sgv7RPcLOEwgAaSk",
  authDomain: "python-powered-logs-entry.firebaseapp.com",
  databaseURL: "https://python-powered-logs-entry-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "python-powered-logs-entry",
  storageBucket: "python-powered-logs-entry.firebasestorage.app",
  messagingSenderId: "403246847260",
  appId: "1:403246847260:web:30d8dd50204668cd5e56d9",
  measurementId: "G-9L5S6GXTJX"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
