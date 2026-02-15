// GSAP
gsap.from(".login-box", { y: 80, opacity: 0, duration: 1 });
gsap.from(".hero-img", { scale: 0.8, opacity: 0, duration: 1.2 });
gsap.to(".hero-img", {
  y: -20,
  repeat: -1,
  yoyo: true,
  duration: 3,
  ease: "sine.inOut"
});

// TOGGLE LOGIN / REGISTER
function showRegister() {
  document.getElementById("authBox").classList.add("active");
}

function showLogin() {
  document.getElementById("authBox").classList.remove("active");
  document.getElementById("generatorBox").classList.remove("show");
}

// AUTH
function register() {
  if (regUser.value === "" || regPass.value.length < 4) {
    alert("Invalid details");
    return;
  }

  if (regPass.value !== confirmPass.value) {
    alert("Passwords do not match");
    return;
  }

  localStorage.setItem("user", regUser.value);
  localStorage.setItem("pass", regPass.value);

  alert("Registered successfully!");
  showLogin();
}


function login() {
  if (
    loginUser.value === localStorage.getItem("user") &&
    loginPass.value === localStorage.getItem("pass")
  ) {
    window.location.href = "../dashboard/dashboard_index.html";
  } else alert("Invalid login");
}

// DARK MODE
document.querySelector(".theme-toggle").onclick = () => {
  document.body.classList.toggle("light");
};

// GENERATOR
const slider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");

slider.oninput = () => lengthValue.textContent = slider.value;

function toggleGenerator() {
  generatorBox.classList.toggle("show");
}

function generatePassword() {
  let chars = "abcdefghijklmnopqrstuvwxyz";
  if (upper.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers.checked) chars += "0123456789";
  if (symbols.checked) chars += "!@#$%^&*";

  let pass = "";
  for (let i = 0; i < slider.value; i++)
    pass += chars[Math.floor(Math.random() * chars.length)];

  generatedPassword.value = pass;
  regPass.value = pass;

  /* show password so user can see */
  regPass.type = "text";

  /* force re-entry */
  confirmPass.value = "";
  matchMsg.textContent = "Re-enter the password to confirm";
  matchMsg.style.color = "#facc15"; // yellow hint
  registerBtn.disabled = true;

  regPass.focus();


  // show password so user can see it
  regPass.type = "text";
  regPass.focus();

}

function copyPassword() {
  const pass = generatedPassword.value.trim();
  const btn = document.querySelector(".copy-btn");

  if (!pass) {
    btn.innerHTML = "❌";
    setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy"></i>', 800);
    return;
  }

  navigator.clipboard.writeText(pass);

  btn.innerHTML = "✓";
  setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy"></i>', 800);
}


// STRENGTH
regPass.addEventListener("input", e => {
  const v = e.target.value;

  // ⭐ NEW: empty → reset meter
  if (v.length === 0) {
    strengthBar.style.width = "0%";
    strengthBar.style.background = "transparent";
    return;
  }

  if (v.length < 4) {
    strengthBar.style.width = "30%";
    strengthBar.style.background = "red";
  }
  else if (/[^a-zA-Z0-9]/.test(v)) {
    strengthBar.style.width = "100%";
    strengthBar.style.background = "lime";
  }
  else if (/[A-Z]/.test(v) && /[0-9]/.test(v)) {
    strengthBar.style.width = "70%";
    strengthBar.style.background = "orange";
  }
});



// document.querySelector(".google").onclick = () => alert("Google login coming soon");
// document.querySelector(".facebook").onclick = () => alert("Facebook login coming soon");
// document.querySelector(".apple").onclick = () => alert("Apple login coming soon");
// document.querySelector(".linkedin").onclick = () => alert("LinkedIn login coming soon");



const words = [
  "passwords",
  "passkeys",
  "cards",
  "notes",
  "secrets"
];

let index = 0;
const el = document.getElementById("changingWord");

function animateWord(word) {
  el.innerHTML = "";

  word.split("").forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter;

    el.appendChild(span);

    // smoother animation
    setTimeout(() => {
      span.style.transition = "all 0.4s cubic-bezier(.22,1,.36,1)";
      span.style.opacity = 1;
      span.style.transform = "translateY(0)";
    }, i * 60);
  });
}

animateWord(words[0]);

setInterval(() => {
  index = (index + 1) % words.length;
  animateWord(words[index]);
}, 2200);

const confirmPass = document.getElementById("confirmPass");
const matchMsg = document.getElementById("matchMsg");
const registerBtn = document.getElementById("registerBtn");

/* eye toggle */
function toggleEye(id, icon) {
  /* login checkbox toggle */
  function togglePasswordCheckbox(cb, id) {
    const input = document.getElementById(id);
    input.type = cb.checked ? "text" : "password";
  }

  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

/* live match check */
function checkPasswordMatch() {
  if (confirmPass.value === "") {
    matchMsg.textContent = "";
    registerBtn.disabled = true;
    return;
  }

  if (regPass.value === confirmPass.value) {
    matchMsg.textContent = "✓ Passwords match";
    matchMsg.style.color = "lime";
    registerBtn.disabled = false;
  } else {
    matchMsg.textContent = "✗ Passwords do not match";
    matchMsg.style.color = "red";
    registerBtn.disabled = true;
  }
}

regPass.addEventListener("input", checkPasswordMatch);
confirmPass.addEventListener("input", checkPasswordMatch);

/* LOGIN show password toggle (safe method) */
const loginPassInput = document.getElementById("loginPass");
const loginShowPass = document.getElementById("loginShowPass");

loginShowPass.addEventListener("change", () => {
  loginPassInput.type = loginShowPass.checked ? "text" : "password";
});
