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


// ================= FIREBASE =================
// const firebaseConfig = {
//   apiKey: "AIzaSyD54NJ6n1Zo8zAQ_ukf6HyYwz1lt1Fg-1Q",
//   authDomain: "mywebsiteauth-1f398.firebaseapp.com",
//   projectId: "mywebsiteauth-1f398",
//   storageBucket: "mywebsiteauth-1f398.firebasestorage.app",
//   messagingSenderId: "1050355297255",
//   appId: "1:1050355297255:web:6878c794fd8a8dda02eb42"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA_muEI5nJm30VPDTW2zNYQfoMezIPQ5Wk",
  authDomain: "projectwork02068.firebaseapp.com",
  projectId: "projectwork02068",
  storageBucket: "projectwork02068.firebasestorage.app",
  messagingSenderId: "726973146553",
  appId: "1:726973146553:web:67856e48ce530923d64268"
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
