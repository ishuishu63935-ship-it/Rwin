// ================================
// RWIN OFFICIAL FIREBASE V3
// PART 1 - IMPORTS
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// ================================
// PART 2 - CONFIG
// ================================

const firebaseConfig = {

 
  apiKey: "YAHA_APNI_API_KEY",

  authDomain: "rwin-e6021.firebaseapp.com",

  projectId: "rwin-e6021",

  storageBucket: "rwin-e6021.appspot.com",

  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",

  appId: "YOUR_APP_ID"

};

// ================================
// PART 3 - INITIALIZE
// ================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

// ================================
// PART 4 - ELEMENTS
// ================================

const email = document.getElementById("email");

const password = document.getElementById("password");

const loginBtn = document.getElementById("loginBtn");

const signupBtn = document.getElementById("signupBtn");

const status = document.getElementById("loginStatus");

console.log("✅ Firebase Ready");
