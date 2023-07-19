// register form 
let createAccountBtn = document.getElementById('createAccount')
const showRegisterForm = () => {
  document.querySelector('.login').style.display = 'none';
  document.querySelector('.register').style.display = 'block';
}
createAccountBtn.addEventListener('click', showRegisterForm)

// login form 
let loginLink = document.getElementById('login-link')
const showLoginForm = () => {
  document.querySelector('.login').style.display = 'block';
  document.querySelector('.register').style.display = 'none';
}
loginLink.addEventListener('click', showLoginForm)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvrBoaDaXkmDZFEDyFI5MNI63dugzmPmY",
  authDomain: "project-1-7c0af.firebaseapp.com",
  projectId: "project-1-7c0af",
  storageBucket: "project-1-7c0af.appspot.com",
  messagingSenderId: "65951281326",
  appId: "1:65951281326:web:a93d2b2c350db8e77f7d3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let registerBtn = document.getElementById('registerBtn')

function registration() {
  let firstName = document.getElementById('firstName').value
  let lastName = document.getElementById('lastName').value
  let email = document.getElementById('email').value
  let password = document.getElementById('password').value
  let confirmPassword = document.getElementById('confirmPassword').value

  if (password === confirmPassword) {
    document.getElementById('confirmPasswordError').innerText = '';
    document.getElementById('email-error').innerText = '';
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: 'Registered',
        showConfirmButton: false,
        timer: 1000
      });
      setTimeout(() => {
        location.href = 'index.html';
      }, 1100);
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        document.getElementById('email-error').style.display = 'block';
        document.getElementById('email-error').innerText = 'Email is already in use';
      } else if (errorCode === "auth/invalid-email") {
        document.getElementById('email-error').style.display = 'block';
        document.getElementById('email-error').innerText = 'Enter a valid Email';
      } else if (errorCode === "auth/weak-password") {
        document.getElementById('confirmPasswordError').innerText = 'Password should be atleast 6 characters';
      }
  });  
  } else {
    document.getElementById('confirmPasswordError').innerText = 'Password and confirm password should be same'
  };
};
registerBtn.addEventListener('click', registration)

function login() {
  let loginEmail = document.getElementById('login-email').value;
  let loginPass = document.getElementById('login-pass').value;

  signInWithEmailAndPassword(auth, loginEmail, loginPass)
  .then((userCredential) => {
    document.getElementById('login-email-error').innerText = '';
    document.getElementById('login-pass-error').innerText = '';
    const user = userCredential.user;
    Swal.fire({
      // position: 'top-end',
      icon: 'success',
      title: 'logged In',
      showConfirmButton: false,
      timer: 1000
    });
    setTimeout(() => {
      location.href = 'index.html';
    }, 1100);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    if (errorCode === 'auth/user-not-found') {
      document.getElementById('login-email-error').innerText = 'No account exist with this email';
      document.getElementById('login-email-error').style.display = 'block';
    } else if (errorCode === "auth/invalid-email"){
      document.getElementById('login-email-error').innerText = 'Enter a valid Email';
      document.getElementById('login-email-error').style.display = 'block';
    }else if (errorCode === 'auth/wrong-password') {
      document.getElementById('login-pass-error').innerText = 'Wrong Password';
      document.getElementById('login-pass-error').style.display = 'block';
    }
  });
};
const loginBtn = document.getElementById('login-btn')
loginBtn.addEventListener('click', login);
