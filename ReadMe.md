<p align="center">
  <img src="icon.svg" width="100">
</p>

# 🔐 SecureVault – Advanced Password Manager

SecureVault is a modern, secure, and cloud-powered password manager that allows users to store, manage, and protect their credentials safely using Firebase Authentication and Firestore.

It supports multiple login methods, password generation, and secure cloud storage.

---

## 🚀 Features

### 🔑 Authentication
- Email & Password login
- Google login
- GitHub login
- Phone OTP login (Firebase Authentication)
- Secure logout
- Protected dashboard access

### 🧠 Password Management
- Store passwords securely in Firebase Firestore
- View saved credentials in dashboard
- Delete stored passwords
- Automatic password loading after login

### 🎨 Modern UI
- Professional animated login page
- Password generator with custom length and options
- Dark mode / Light mode toggle
- Responsive design
- Smooth animations using GSAP

### 🔐 Security
- Firebase Authentication
- Firestore cloud database
- Dashboard protected from unauthorized access
- User-specific password storage

---

## 📁 Project Structure
```text
OUR-PROJECT/
│
├── dashboard/
│   ├── dashboard_index.html     # Dashboard UI
│   ├── dashboard_script.js      # Dashboard logic
│   └── dashboard_styles.css     # Dashboard styling
│
├── login/
│   ├── index.html               # Login / Register page
│   ├── script.js                # UI logic and password generator
│   ├── style.css                # Login styling
│   └── auth.js                  # Firebase authentication & database logic
|
├── Mainpage/
│   ├── main_index.html          # Main password storage page
│   ├── main_script.js           # UI logic and password generator
│   └── main_style.css           # Main styling
│                     
│
├── icon.svg                     # App icon (SVG)
├── icon.png                     # App icon (PNG)
│
└── README.md                    # Project documentation
```

---

## ⚙️ Technologies Used

Frontend:
- HTML5
- CSS3
- JavaScript (ES6)

Backend & Cloud:
- Firebase Authentication
- Firebase Firestore Database

Libraries:
- GSAP (animations)
- Font Awesome (icons)

---

## 🔥 Firebase Services Used

- Firebase Authentication
- Firestore Database
- Google OAuth
- GitHub OAuth
- Phone OTP Authentication

---

## ▶️ How to Run the Project

### Step 1: Clone the repository

```bash
git clone https://github.com/akshayspeaks/our-project.git
```

### Step 2: Open project folder

```bash
cd project
```

### Step 3: Open login page

Open this file in your browser:

```
index.html
```

---

## 🔐 How the System Works

1. User logs in using:
   - Email/password
   - Google
   - GitHub
   - Phone OTP

2. Firebase authenticates user

3. User is redirected to dashboard

4. Passwords are stored in Firestore:

```text
users/{userUID}/passwords/{docID}
```

5. Only logged-in user can access their passwords

---

## 🧠 Password Generator

Features:
- Custom password length
- Uppercase letters
- Numbers
- Special characters
- Copy to clipboard

---

## 🛡️ Security Features

- Authentication required for dashboard access
- Automatic logout protection
- User-isolated password storage
- Cloud-secured Firebase backend

---

## 🚀 Future Improvements

- AES encryption for passwords
- Auto-lock after inactivity
- Password edit feature
- Search passwords
- Browser extension integration
- Electron desktop app

---

## 👤 Authors

- **Akshay K**  
  GitHub: [@akshayspeaks](https://github.com/akshayspeaks)

- **Hariprakaash**  
  GitHub: [@hari-prakaash](https://github.com/hari-prakaash)

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Project Status

Authentication: ✅ Completed  
Dashboard: ✅ Completed  
Cloud Storage: ✅ Completed  
UI/UX: ✅ Completed  
Security Improvements: 🔄 In Progress  

---

## 💡 Project Purpose

This project demonstrates:

- Firebase Authentication integration
- Secure cloud database usage
- Modern UI/UX development
- Real-world password manager architecture

---

SecureVault – Secure. Smart. Reliable.
