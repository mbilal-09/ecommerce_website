import {initializeApp} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut, deleteUser} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("delete-btn").style.display = "block";
    } else {
        document.getElementById("login-btn").style.display = "block";
        document.getElementById("logout-btn").style.display = "none";
        document.getElementById("delete-btn").style.display = "none";
    };
});

let logOutBtn = document.getElementById("logout-btn");
logOutBtn.addEventListener("click", () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        Swal.fire({ // position: 'top-end',
            icon: "success",
            title: "logged Out",
            showConfirmButton: false,
            timer: 1000
        });
    }).catch((error) => {});
});

let deleteBtn = document.getElementById("delete-btn");
deleteBtn.addEventListener("click", () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire("Deleted!", "Your account has been deleted.", "success");
            deletingAccount();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire("Cancelled", "Your account is safe :)", "error");
        };
    });
    function deletingAccount() {
        const user = auth.currentUser;
        deleteUser(user).then(() => {}).catch((error) => {});
    };
});

let items;
let allItems = [];

const db = getDatabase();
const starCountRef = ref(db, "users/" + uid);
onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        items = Object.values(data)[0];
        document.getElementById("navCart").innerText = items.length;
        items = Object.values(data)[0];
        allItems = items;
    };
});

let products;
let cardContainer = document.getElementById("card-container");

(async () => {
    const productsResponse = await fetch("https://dummyjson.com/products").then(res => res.json());
    products = productsResponse.products;
    let categories = ["all"];
    products.forEach(product => {
        if (! categories.includes(product.category)) {
            categories.push(product.category);
        };
    });
    categories.forEach(item => {
        let btn = `<button class="btn btn-success ctg-btn" value=${item}>${item}</button>`;
        document.getElementById("categories").innerHTML += btn;
    });
    Array.from(document.getElementsByClassName("ctg-btn")).forEach(btn => {
        btn.addEventListener("click", function () {
            let categoryProducts = products.filter(product => product.category === btn.value);
            cardContainer.innerHTML = "";
            if (btn.value === "all") {
                cards(products);
            } else {
                cards(categoryProducts);
            };
        });
    });
    cards(products);
})();

const search = async () => {
    let input = document.querySelector(".search__input").value;
    let search = await fetch(`https://dummyjson.com/products/search?q=${input}`).then(res => res.json());
    let products = search.products;
    cards(products);
    document.querySelector(".search__input").value = "";
};

document.querySelector(".search__input").addEventListener("keypress", (enter) => {
    if (enter.key === "Enter") {
        enter.preventDefault();
        search();
    }
});

function cards(products) {
    cardContainer.innerHTML = "";
    products.forEach(product => {
        let card = `<div class="card my-4">
        <img src=${
            product.thumbnail
        } class="card-img-top d-block mx-auto" alt="...">
        <div class="card-body">
          <h5 class="card-title">${
            product.title
        }</h5>
          <p class="card-text">$${
            product.price
        }</p>
          <button class="btn btn-success cartBtn">Add To Cart</button>
        </div>
      </div>`;
        cardContainer.innerHTML += card;
    });

    let cartBtn = document.getElementsByClassName("cartBtn");
    let cartArray = Object.values(cartBtn);
    cartArray.forEach((btn) => {
        btn.addEventListener("click", () => {
            let image = btn.parentNode.parentNode.children[0].src;
            let title = btn.parentNode.children[0].innerText;
            let price = btn.parentNode.children[1].innerText;
            let itemDetails = [image, title, price];
            allItems.push(itemDetails);
            function writeUserData(userId) {
                const db = getDatabase();
                set(ref(db, "users/" + userId), {cartItems: allItems});
            };
            writeUserData();
        });
    });
}