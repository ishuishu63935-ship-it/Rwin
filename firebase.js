  // Firebase Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAedMCjwyX8yB-zK4hc0RgQ0LaziUj_4io",
    authDomain: "rwin-e6021.firebaseapp.com",
    projectId: "rwin-e6021",
    storageBucket: "rwin-e6021.firebasestorage.app",
    messagingSenderId: "677090984731",
    appId: "1:677090984731:web:9a61a1ec166e193617c9be",
    measurementId: "G-RCR9MT2KV6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase Start
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const status = document.getElementById("loginStatus");

// Signup
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
      .then(() => {
        status.innerHTML = "✅ Account Created";
        alert("Account Created Successfully");
      })
      .catch((error) => {
        status.innerHTML = error.message;
      });
  });
}

// Login
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
      .then(() => {
        status.innerHTML = "✅ Login Success";
        alert("Login Successful");
        window.location.href = "home.html";
      })
      .catch((error) => {
        status.innerHTML = error.message;
      });
  });
}