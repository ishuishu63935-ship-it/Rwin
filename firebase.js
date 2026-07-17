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
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";




// ================================
// PART 2 - CONFIG
// ================================



const firebaseConfig = {
  apiKey: "AIzaSyAedMCjwyX8yB-zK4hc0RgQ0LaziUj_4io",
  authDomain: "rwin-e6021.firebaseapp.com",
  projectId: "rwin-e6021",
  storageBucket: "rwin-e6021.firebasestorage.app",
  messagingSenderId: "677090984731",
  appId: "1:677090984731:web:f35ddadf5cc931ee17c9be"
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
// ================================
// PART 5 - SIGNUP
// ================================

if (signupBtn) {

  signupBtn.addEventListener("click", async () => {

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.value.trim(),
          password.value
        );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {

        email: user.email,

        balance: 10000,

        xp: 0,

        level: 1,

        membership: false,
membershipPlan: "Free",

membershipExpiry: null,

        history: [],

        createdAt: new Date().toISOString()

      });

      status.innerHTML = "✅ Account Created Successfully";

      alert("Welcome to RWIN 🎉");

    } catch (error) {

      console.error(error);

      status.innerHTML = error.message;

      alert(error.message);

    }

  });

}
// ================================
// PART 6 - LOGIN
// ================================

if (loginBtn) {

  loginBtn.addEventListener("click", async () => {

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.value.trim(),
          password.value
        );

      const user = userCredential.user;

      const userDoc =
        await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {

        localStorage.setItem(
          "rwinCloud",
          JSON.stringify(userDoc.data())
        );

      }

      status.innerHTML = "✅ Login Successful";

      alert("Welcome Back 😎");

      window.location.href = "home.html";

    } catch (error) {

      console.error(error);

      status.innerHTML = error.message;

      alert(error.message);

    }

  });

}
