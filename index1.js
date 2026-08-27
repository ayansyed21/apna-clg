// =====================================
// 🛒 LOAD CART FROM STORAGE
// =====================================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// =====================================
// 🛒 ADD TO CART FUNCTION
// =====================================
function addToCart(name, price, img) {
    const product = {
        name: name,
        price: price,
        image: img,
        quantity: 1
    };

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart  ✅");
    updateCartCount();
}

// =====================================
// 🛒 DETAIL PAGE SE ADD
// =====================================
function addToCartFromDetail(name, price, img) {
    if (!name || !price || !img) {
        alert("Product data missing ❌");
        return;
    }
    addToCart(name, price, img);
}

// =====================================
// 🔥 BUY NOW DIRECT
// =====================================
function buyNowDirect(name, price, img) {
    const product = {
        name: name,
        price: price,
        image: img,
        quantity: 1
    };

    localStorage.removeItem("totalPrice");
localStorage.setItem("selectedProduct", JSON.stringify(product));

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "checkout.html";
}

// =====================================
// 🛒 CART COUNT UPDATE
// =====================================
function updateCartCount() {
    let el = document.getElementById("cart-count");
    if (el) {
        el.innerText = cart.length;
    }
}

// =====================================
// 🛒 CART PAGE LOAD (OPTIONAL)
// =====================================
function loadCartItems() {
    let container = document.getElementById("cart-items");
    if (!container) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        let div = document.createElement("div");
        div.classList.add("cart-item");

        // Helper: Price se currency symbol hatakar number mein convert karne ke liye
        let parsedPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        let itemQty = parseInt(item.quantity) || 1;

        let itemTotal = parsedPrice * itemQty;
        total += itemTotal;

        div.innerHTML = `
            <img src="${item.image}" width="80">
            <h3>${item.name}</h3>
            <p>₹${itemTotal}</p>
            <div class="qty-box">
                <button onclick="decreaseQty(${index})">-</button>
                <span>${itemQty}</span>
                <button onclick="increaseQty(${index})">+</button>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        container.appendChild(div);
    });

    calculateTotal();
}

// =====================================
// ❌ REMOVE FROM CART
// =====================================
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
    calculateTotal();
}

// =====================================
// ➕ INCREASE QTY
// =====================================
function increaseQty(index) {
    if (cart[index]) {
        cart[index].quantity = (parseInt(cart[index].quantity) || 1) + 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartItems();
        calculateTotal();
    }
}

// =====================================
// ➖ DECREASE QTY
// =====================================
function decreaseQty(index) {
    if (cart[index] && cart[index].quantity > 1) {
        cart[index].quantity = (parseInt(cart[index].quantity) || 1) - 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartItems();
        calculateTotal();
    }
}



// =====================================
// 💰 CALCULATE TOTAL
// =====================================
function calculateTotal() {
    let total = 0;

    cart.forEach(item => {
        let parsedPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        let itemQty = parseInt(item.quantity) || 1;
        total += parsedPrice * itemQty;
    });

    let totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.innerText = "Total: ₹" + total;
    }
}

// Page load hone par functions automatically run ho jayein
loadCartItems();
updateCartCount();



// Search Icon
const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");

if (searchIcon && searchInput) {
    searchIcon.addEventListener("click", () => {
        searchInput.classList.toggle("active");
        searchInput.focus();
    });
}











// =======================
// SEARCH OVERLAY
// =======================


const searchOverlay = document.getElementById("searchOverlay");
const closeSearch = document.getElementById("closeSearch");
const overlaySearch = document.getElementById("overlaySearch");

// Open Search
searchIcon.addEventListener("click", () => {
    searchOverlay.classList.add("active");

overlaySearch.value = "";
suggestionList.innerHTML = "";
productList.innerHTML = "";
overlayResults.style.display = "none";

    overlaySearch.focus();
});

// Close Search
closeSearch.addEventListener("click", () => {
    searchOverlay.classList.remove("active");
    overlaySearch.value = "";
});

// Close by ESC Key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        searchOverlay.classList.remove("active");
        overlaySearch.value = "";
    }
});

// Click Outside to Close
searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) {
        searchOverlay.classList.remove("active");
        overlaySearch.value = "";
    }
});



let searchTimer = null;

overlaySearch.addEventListener("input", (e) => {
  const value = e.target.value.trim().toLowerCase();

  // Khali hone par instant clear aur hide
  if (value === "") {
    if (searchTimer) clearTimeout(searchTimer);
    suggestionList.innerHTML = "";
    productList.innerHTML = "";
    overlayResults.classList.remove("show");
    overlayResults.style.display = "none";
    return;
  }

  // Instant response for quick feel
  if (searchTimer) clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    // Light search query
    const results = allProducts.filter(p => p.name.toLowerCase().includes(value));

    if (results.length > 0) {
      // Speed ke liye maximum 5 items hi show karenge
      const maxResults = results.slice(0, 5);

      let sugStr = "";
      let prodStr = "";

      for (let i = 0; i < maxResults.length; i++) {
        const item = maxResults[i];
        sugStr += `<li>${item.name}</li>`;
        prodStr += `
          <div class="product-item" onclick="openProduct(${item.id})">
            <img src="${item.image1}" alt="" loading="lazy" width="50" height="50" />
            <div>
              <h4>${item.name}</h4>
              <p>₹${item.price}</p>
            </div>
          </div>
        `;
      }

      // Fast single-shot DOM update
      suggestionList.innerHTML = sugStr;
      productList.innerHTML = prodStr;

      overlayResults.classList.add("show");
      overlayResults.style.display = "grid";
    } else {
      suggestionList.innerHTML = "";
      productList.innerHTML = `<p style="color: white; padding: 12px;">No products found</p>`;
      overlayResults.classList.add("show");
      overlayResults.style.display = "grid";
    }
  }, 50); // 50ms = Instant feeling
});