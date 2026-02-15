import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,   // ⭐ ADD THIS
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



  const firebaseConfig = {
    apiKey: "AIzaSyD0N9O7ctSx8_Uj02u4DMYZ7SaZx81o5js",
    authDomain: "password-vault-proj.firebaseapp.com",
    projectId: "password-vault-proj",
    storageBucket: "password-vault-proj.firebasestorage.app",
    messagingSenderId: "792775710307",
    appId: "1:792775710307:web:2575dbea2ea25dc3aa0a56"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "invisible"
});


// ================= PROVIDERS =================
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

let confirmationResult = null;
let phoneMode = false;


// ================= GOOGLE =================
function googleLogin() {
  const btn = document.querySelector(".google");
  btn.disabled = true;

  signInWithPopup(auth, googleProvider)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => {
      if (err.code !== "auth/cancelled-popup-request") {
        alert(err.message);
      }
    })
    .finally(() => btn.disabled = false);
}



// ================= GITHUB =================
function githubLogin() {
  const btn = document.querySelector(".github");
  btn.disabled = true;

  signInWithPopup(auth, githubProvider)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => {
      if (err.code !== "auth/cancelled-popup-request") {
        alert(err.message);
      }
    })
    .finally(() => btn.disabled = false);
}


// ================= MAIL/PASS =================
function login() {
  const userInput = document.getElementById("loginUser");
  const passInput = document.getElementById("loginPass");

  const email = userInput.value.trim();
  const password = passInput.value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => alert(err.message));
}



// ================= PHONE OTP =================
function phoneLogin() {
    const msg = document.getElementById("otpMsg");

  const userInput = document.getElementById("loginUser");
  const passInput = document.getElementById("loginPass");
  const loginBtn  = document.getElementById("loginBtn");

  const phone = userInput.value.trim();
  const otp   = passInput.value.trim();

  const appVerifier = window.recaptchaVerifier;

  // SEND OTP
  if (!confirmationResult) {

    if (!/^\d{10}$/.test(phone)) return;

    signInWithPhoneNumber(auth, "+91" + phone, appVerifier)
      .then(result => {
        confirmationResult = result;

        passInput.value = "";
        passInput.type = "password";
        passInput.placeholder = "Enter OTP";

        loginBtn.textContent = "Verify & Login";

        msg.textContent = "OTP sent successfully ✅";
        msg.className = "otp-msg otp-success";
      })

      .catch(err => alert(err.message));

    return;
  }

  // VERIFY OTP
  confirmationResult.confirm(otp)
    .then(() => window.location.href = "dashboard.html")
    .catch(() => {
      msg.textContent = "Invalid OTP ❌";
      msg.className = "otp-msg otp-error";
    });

}



// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {

  const googleBtn = document.querySelector(".google");
  const githubBtn = document.querySelector(".github");
  const phoneBtn  = document.querySelector(".phone");

  const loginBtn  = document.getElementById("loginBtn");
  const userInput = document.getElementById("loginUser");
  const passInput = document.getElementById("loginPass");

  const prefix    = document.querySelector(".prefix");
  const toggleTxt = document.getElementById("toggleText");
  const showToggle = document.getElementById("loginShowPass");


  // ===== SOCIAL =====
  googleBtn?.addEventListener("click", googleLogin);
  githubBtn?.addEventListener("click", githubLogin);


  // ===== MAIN LOGIN BUTTON =====
  loginBtn.addEventListener("click", () => {
    if (phoneMode) phoneLogin();
    else login();
  });


  // ===== PHONE ↔ MAIL TOGGLE =====
  phoneBtn?.addEventListener("click", () => {

    confirmationResult = null;

    // PHONE MODE
    if (!phoneMode) {

      document.getElementById("otpMsg").textContent = "";

      phoneMode = true;

      prefix.style.display = "block";

      userInput.type = "tel";
      userInput.value = "";
      userInput.placeholder = "Enter 10 digit number";

      passInput.type = "password";
      passInput.value = "";
      passInput.placeholder = "Enter the OTP";

      toggleTxt.textContent = "Show OTP";

      loginBtn.textContent = "Send OTP";
      loginBtn.disabled = true;

      phoneBtn.innerHTML = '<i class="fa-solid fa-envelope"></i>';
    }

    // MAIL MODE
    else {

      phoneMode = false;

      document.getElementById("otpMsg").textContent = "";  

      prefix.style.display = "none";

      userInput.type = "text";
      userInput.placeholder = "Username";

      passInput.type = "password";
      passInput.placeholder = "Enter your password";

      toggleTxt.textContent = "Show password";

      loginBtn.textContent = "Login";
      loginBtn.disabled = false;

      phoneBtn.innerHTML = '<i class="fa-solid fa-phone"></i>';
    }
  });


  // ===== NUMBER RESTRICTIONS =====

  //phone num
 userInput.addEventListener("input", (e) => {
  if (phoneMode) {
    let numbers = e.target.value.replace(/\D/g, "");

    numbers = numbers.slice(0, 10);   // ⭐ LIMIT TO 10

    e.target.value = numbers;

    loginBtn.disabled = numbers.length !== 10;
  }
});

//otp
passInput.addEventListener("input", (e) => {
  if (phoneMode) {
    let otp = e.target.value.replace(/\D/g, "");

    otp = otp.slice(0, 6);   // ⭐ LIMIT TO 6

    e.target.value = otp;
  }
});



  // ===== SHOW / HIDE PASSWORD OR OTP =====
  showToggle.addEventListener("change", () => {
    passInput.type = showToggle.checked ? "text" : "password";
  });

});


// ================= LOGOUT =================
window.logoutUser = async () => {
  await signOut(auth);
};


// ================= PROTECT DASHBOARD =================
onAuthStateChanged(auth, user => {
  const isDashboard = window.location.pathname.includes("dashboard.html");
  if (!user && isDashboard) window.location.href = "index.html";
});
