const cart = [];
const favourites = new Set();

const cartCount = document.getElementById("cartCount");
const drawerCount = document.getElementById("drawerCount");
const cartTotal = document.getElementById("cartTotal");
const cartItems = document.getElementById("cartItems");

const cartDrawer = document.getElementById("cartDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const toast = document.getElementById("toast");

let activeFilter = "all";
let toastTimer;

function showToast(message) {
toast.textContent = message;
toast.classList.add("show");

```
clearTimeout(toastTimer);

toastTimer = setTimeout(() => {
    toast.classList.remove("show");
}, 2400);
```

}

function getCartQuantity() {
return cart.reduce((total, item) => total + item.quantity, 0);
}

function updateCart() {
const quantity = getCartQuantity();

```
cartCount.textContent = quantity;
drawerCount.textContent = `(${quantity})`;

const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
);

cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;

if (cart.length === 0) {
    cartItems.innerHTML =
        '<p class="empty-cart">Your bag is waiting for something good.</p>';
    return;
}

cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
        <div>
            <h3>${item.name}</h3>
            <p>₹${item.price.toLocaleString("en-IN")} each</p>

            <div class="cart-item-actions">
                <button data-action="decrease" data-index="${index}"
                    aria-label="Decrease quantity">−</button>

                <span>${item.quantity}</span>

                <button data-action="increase" data-index="${index}"
                    aria-label="Increase quantity">+</button>
            </div>
        </div>

        <button class="remove-item" data-action="remove"
            data-index="${index}">Remove</button>
    </div>
`).join("");
```

}

function addToCart(name, price) {
const existingItem = cart.find(item => item.name === name);

```
if (existingItem) {
    existingItem.quantity += 1;
} else {
    cart.push({
        name,
        price,
        quantity: 1
    });
}

updateCart();
showToast(`${name} added to your bag.`);
```

}

function openCart() {
cartDrawer.inert = false;
cartDrawer.setAttribute("aria-hidden", "false");
cartDrawer.classList.add("open");

```
drawerOverlay.hidden = false;
document.body.classList.add("drawer-open");

document.getElementById("closeCart").focus();
```

}

function closeCart() {
cartDrawer.classList.remove("open");
cartDrawer.setAttribute("aria-hidden", "true");
cartDrawer.inert = true;

```
drawerOverlay.hidden = true;
document.body.classList.remove("drawer-open");

document.getElementById("cartButton").focus();
```

}

document.querySelectorAll(".quick-add").forEach(button => {
button.addEventListener("click", () => {
const name = button.dataset.name;
const price = Number(button.dataset.price);

```
    addToCart(name, price);
});
```

});

cartItems.addEventListener("click", event => {
const button = event.target.closest("button[data-action]");

```
if (!button) return;

const index = Number(button.dataset.index);
const action = button.dataset.action;
const item = cart[index];

if (!item) return;

if (action === "increase") {
    item.quantity += 1;
}

if (action === "decrease") {
    item.quantity -= 1;

    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }
}

if (action === "remove") {
    cart.splice(index, 1);
}

updateCart();
```

});

document.getElementById("cartButton").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

drawerOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
if (event.key === "Escape") {
if (cartDrawer.classList.contains("open")) {
closeCart();
}

```
    closeSearch();
}
```

});

// Wishlist buttons
document.querySelectorAll(".wishlist-toggle").forEach(button => {
button.addEventListener("click", () => {
const card = button.closest(".product-card");
const name = card.querySelector("h3").textContent;

```
    if (favourites.has(name)) {
        favourites.delete(name);
        button.classList.remove("is-favourite");
        button.textContent = "♡";
        button.setAttribute("aria-pressed", "false");

        showToast("Removed from your wishlist.");
    } else {
        favourites.add(name);
        button.classList.add("is-favourite");
        button.textContent = "♥";
        button.setAttribute("aria-pressed", "true");

        showToast("Added to your wishlist.");
    }
});
```

});

// Product category filters
const filterButtons = document.querySelectorAll(".filter-button");

filterButtons.forEach(button => {
button.addEventListener("click", () => {
activeFilter = button.dataset.filter;

```
    filterButtons.forEach(item => {
        item.classList.toggle("active", item === button);
    });

    filterButtons.forEach(item => {
        item.setAttribute(
            "aria-pressed",
            String(item === button)
        );
    });

    filterProducts();
});
```

});

function filterProducts() {
const searchTerm = document.getElementById("searchInput").value
.trim()
.toLowerCase();

```
document.querySelectorAll(".product-card").forEach(card => {
    const category = card.dataset.category;

    const name = card.querySelector("h3").textContent.toLowerCase();
    const details = card.querySelector(".product-info p").textContent.toLowerCase();

    const matchesCategory =
        activeFilter === "all" || category === activeFilter;

    const matchesSearch =
        `${name} ${details}`.includes(searchTerm);

    card.hidden = !(matchesCategory && matchesSearch);
});
```

}

// Sorting
document.getElementById("sortSelect").addEventListener("change", event => {
const sortType = event.target.value;
const productGrid = document.getElementById("products");

```
const cards = [...productGrid.querySelectorAll(".product-card")];

if (sortType === "low") {
    cards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
} else if (sortType === "high") {
    cards.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
}

cards.forEach(card => productGrid.appendChild(card));

filterProducts();
```

});

// Search panel
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchButton").addEventListener("click", () => {
searchPanel.hidden = false;
searchInput.focus();
});

function closeSearch() {
searchPanel.hidden = true;
}

document.getElementById("closeSearch").addEventListener("click", closeSearch);

searchInput.addEventListener("input", filterProducts);

// Mobile navigation
const navigation = document.getElementById("navigation");
const menuButton = document.getElementById("menuButton");

menuButton.setAttribute("aria-expanded", "false");

menuButton.addEventListener("click", () => {
const isOpen = navigation.classList.toggle("open");

```
menuButton.setAttribute("aria-expanded", String(isOpen));
menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
);
```

});

navigation.querySelectorAll("a").forEach(link => {
link.addEventListener("click", () => {
navigation.classList.remove("open");
menuButton.setAttribute("aria-expanded", "false");
menuButton.setAttribute("aria-label", "Open navigation menu");
});
});

// Demo checkout
document.getElementById("checkoutButton").addEventListener("click", () => {
if (cart.length === 0) {
showToast("Your bag is empty.");
return;
}

```
showToast("Checkout will be available after backend setup.");
```

});

updateCart();
