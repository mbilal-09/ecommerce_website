import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvrBoaDaXkmDZFEDyFI5MNI63dugzmPmY",
    authDomain: "project-1-7c0af.firebaseapp.com",
    databaseURL: "https://project-1-7c0af-default-rtdb.firebaseio.com",
    projectId: "project-1-7c0af",
    storageBucket: "project-1-7c0af.appspot.com",
    messagingSenderId: "65951281326",
    appId: "1:65951281326:web:a93d2b2c350db8e77f7d3f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let uid;
onAuthStateChanged(auth, (user) => {
  if (user) {
      uid = user.uid;
  }  
});

let items;
let cartContainer = document.getElementById('cart-container')

const db = getDatabase();
const starCountRef = ref(db, 'users/' + uid);
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  if(data){
  items = Object.values(data)[0];
  cartContainer.innerHTML = '';
  let totalPrice = 0;
  items.forEach(item => {
    let cart = `<div class="row ms-2">
    <div class="col-5">
        <img src=${item[0]} height="50px" width="50px" class="mb-2" alt="">
        <span>${item[1]}</span>
    </div>
    <div class="col-5 price">
        <span>${item[2]}</span>
    </div>
    <div class="col-2 deleteItemBtn">
        <i class="fa-solid fa-xmark"></i>
    </div>
    <hr>
  </div>`
  cartContainer.innerHTML += cart;
  totalPrice += Number(item[2].slice(1))
  });
  console.log(totalPrice)
  document.getElementById('totalPrice').innerText = '$' + totalPrice;
} else {
  document.getElementById('totalPrice').innerText = '$' + 0;
}
Array.from(document.getElementsByClassName('deleteItemBtn')).forEach(btn =>{
    btn.addEventListener('click', function (){
        for (let i = 0; i < items.length; i++) {
            if (btn.parentNode.children[0].children[1].innerText == items[i][1]) {
                items.splice(i, 1)
            };
        };
        btn.parentNode.remove();
        function writeUserData(userId) {
            const db = getDatabase();
            set(ref(db, 'users/' + userId), {
              cartItems: items
            });
          };
          writeUserData();
      });
  });
});
