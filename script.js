let cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartContainer = document.getElementById("cart");
const callTakeaway = document.getElementById("callTakeawayOrder");
const orderBtn = document.getElementById("order-btn");
const orderBtnDelivery = document.getElementById("order-btn-delivery");
const closeCartBtn = document.getElementById("close-cart");
const clearCartBtn = document.getElementById("clear-cart");
const takeawayAlert = document.getElementById("Takeaway");
const closeTakeaway = document.querySelector(".closeTakeaway");
const deliveryAlert = document.getElementById("Delivery");
const closeDelivery = document.querySelector(".closeDelivery");

// Open cart
cartBtn.addEventListener("click", () => {
    cartContainer.classList.add("active");
    displayCartItems();
});

// Close cart
closeCartBtn.addEventListener("click", () => {
    cartContainer.classList.remove("active");
});

// Close cart when clicking outside
document.addEventListener('click', (event) => {
    if (cartContainer.classList.contains('active') && !cartContainer.contains(event.target) && !cartBtn.contains(event.target)) {
        cartContainer.classList.remove("active");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const menuSections = {
        appetizers: "data/appetizers.json",
        salads: "data/salads.json",
        pizzas: "data/pizzas.json",
        burgers: "data/burgers.json",
        drinks: "data/drinks.json",
        addextra: "data/addextra.json"
    };

    function loadMenuItems(sectionId, file) {
        fetch(file)
            .then(response => response.json())
            .then(data => {
                const section = document.querySelector(`#${sectionId} .menu-container`);
                if (!section) return;

                data.forEach(item => {
                    const menuItem = document.createElement("div");
                    menuItem.classList.add("item");
                    menuItem.setAttribute("data-name", item.name);
                    menuItem.setAttribute("data-price", item.price);

                    // Handle missing image
                    const itemImg = item.image || 'images/WoodOven inside Logo.png';

                    menuItem.innerHTML = `
                        <img src="${itemImg}" alt="${item.name}">
                        <div class="itemnameanddes">
                            <h2 class="item-name">${item.name}</h2>
                            <p class="description">${item.description}</p>
                        </div>
                        <div class="priceandorder">
                            <p class="item-price">$${item.price}</p>
                            <button class="add-to-order add-to-cart" title="Add to bag">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <div class="quantity hidden">
                                <button class="minus">-</button>
                                <span class="qty">1</span>
                                <button class="plus">+</button>
                            </div>
                        </div>
                    `;

                    section.appendChild(menuItem);
                });
                attachItemEventListeners();
            })
            .catch(error => console.error(`Error loading ${file}:`, error));
    }

    for (const sectionId in menuSections) {
        loadMenuItems(sectionId, menuSections[sectionId]);
    }
});

function attachItemEventListeners() {
    document.querySelectorAll(".item").forEach(item => {
        const addToOrderBtn = item.querySelector(".add-to-order");
        const plusBtn = item.querySelector(".plus");
        const minusBtn = item.querySelector(".minus");
        const quantityDiv = item.querySelector(".quantity");
        const quantityDisplay = item.querySelector(".qty");

        if (!addToOrderBtn) return;

        // Clone to clear existing listeners (prevent double binding)
        const newAddToOrderBtn = addToOrderBtn.cloneNode(true);
        addToOrderBtn.replaceWith(newAddToOrderBtn);
        
        const newPlusBtn = plusBtn.cloneNode(true);
        plusBtn.replaceWith(newPlusBtn);
        
        const newMinusBtn = minusBtn.cloneNode(true);
        minusBtn.replaceWith(newMinusBtn);

        // Add item to cart
        newAddToOrderBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const name = item.getAttribute("data-name");
            const price = parseFloat(item.getAttribute("data-price"));

            quantityDiv.classList.remove("hidden");
            newAddToOrderBtn.classList.add("hidden");

            let cartItem = cart.find(cartItem => cartItem.name === name);
            if (!cartItem) {
                cart.push({ name, price, quantity: 1 });
            } else {
                cartItem.quantity = 1;
            }

            quantityDisplay.textContent = "1";
            updateCartCount();
            displayCartItems();
        });

        // Increase quantity
        newPlusBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const name = item.getAttribute("data-name");
            let cartItem = cart.find(cartItem => cartItem.name === name);
            if (cartItem) {
                cartItem.quantity++;
                quantityDisplay.textContent = cartItem.quantity;
            }
            updateCartCount();
            displayCartItems();
        });

        // Decrease quantity
        newMinusBtn.addEventListener("click", function (event) {
            event.stopPropagation();
            const name = item.getAttribute("data-name");
            let cartItem = cart.find(cartItem => cartItem.name === name);
            if (cartItem) {
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                    quantityDisplay.textContent = cartItem.quantity;
                } else {
                    cart = cart.filter(cartItem => cartItem.name !== name);
                    quantityDiv.classList.add("hidden");
                    newAddToOrderBtn.classList.remove("hidden");
                }
            }
            updateCartCount();
            displayCartItems();
        });
    });
}

// Update cart count
function updateCartCount() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems === 0 ? "none" : "flex";
}

function displayCartItems() {
    cartItems.innerHTML = "";
    let total = 0; 
    cart.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = `
            <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 600;">${item.name}</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">$${item.price} x ${item.quantity}</span>
            </div>
            <span style="font-weight: 700; color: var(--accent);">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });

    const displayTotal = document.getElementById("cart-total-display");
    if (displayTotal) {
        displayTotal.textContent = `$${total.toFixed(2)}`;
    }

    updateDeliveryTotal(total); 
}

function updateDeliveryTotal(total) { 
    const deliveryFee = 3.00;
    const totalWithDelivery = total + deliveryFee;
    const devTotalElem = document.getElementById('deliveryTotal');
    if (devTotalElem) {
        devTotalElem.innerText = `$${totalWithDelivery.toFixed(2)}`;
    }
}

// Clear cart
clearCartBtn.addEventListener("click", function () {
    cart = [];
    updateCartCount();
    displayCartItems();
    document.querySelectorAll(".quantity").forEach(q => q.classList.add("hidden"));
    document.querySelectorAll(".add-to-order").forEach(btn => btn.classList.remove("hidden"));
});

function generateOrderID() {
    return Math.floor(Math.random() * 1000000);
}

// WhatsApp Order Logic
callTakeaway.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    takeawayAlert.classList.add("active");
});

closeTakeaway.addEventListener("click", () => {
    takeawayAlert.classList.remove("active");
});

document.getElementById("order-btn").addEventListener("click", function () {
    const selectedBranch = document.getElementById("selectBranch").value;
    const phoneNumber = document.getElementById("takeaway-phone").value.trim();

    if (!phoneNumber || phoneNumber.length < 8) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (selectedBranch === "Select") {
        alert('Please select a branch.');
        return;
    }

    let orderID = generateOrderID();
    let message = `*Hi Captain's Pizza*\n`;
    message += `New Wooden Food Order\n`;
    message += `Order ID: *#${orderID}*\n`;
    message += `Branch: *${selectedBranch}*\n\n`;
    message += `Order Details:\n`;
    let total = 0;

    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
    });

    message += `\nTotal: *$${total.toFixed(2)}*\n`;
    message += `Phone: ${phoneNumber}\n`;
    message += `Order Type: *Takeaway*\n\n`;
    message += `Thank you Captain's!`;

    window.open(`https://wa.me/+96171096971?text=${encodeURIComponent(message)}`, "_blank");
});

orderBtnDelivery.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your bag is empty!");
        return;
    }
    deliveryAlert.classList.add("active");
});

closeDelivery.addEventListener("click", () => {
    deliveryAlert.classList.remove("active");
});

// Map Initialization
let map, marker;
function initMap() {
    const defaultLocation = { lat: 34.2541, lng: 35.6583 }; // Batroun area approx
    map = L.map('map').setView([defaultLocation.lat, defaultLocation.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    marker = L.marker([defaultLocation.lat, defaultLocation.lng], { draggable: true }).addTo(map);

    map.on('click', function (event) {
        marker.setLatLng(event.latlng);
    });
}

document.getElementById('delivery-order-btn').addEventListener('click', function () {
    const name = document.getElementById('name').value.trim();
    const phoneNumber = document.getElementById('phone').value.trim();
    const selectedBranch = document.getElementById('selectBranchDelivery').value;
    const latLng = marker.getLatLng();

    if (!name || !phoneNumber || phoneNumber.length < 8) {
        alert('Please enter a valid name and phone number.');
        return;
    }
    if (selectedBranch === 'Select') {
        alert('Please select a branch.');
        return;
    }

    let orderID = generateOrderID();
    let message = `Location: https://www.google.com/maps?q=${latLng.lat},${latLng.lng}\n\n`;
    message += `*Hi Captain's Pizza*\n`;
    message += `New Delivery Order\n\n`;
    message += `Order ID: *#${orderID}*\n`;
    message += `Branch: *${selectedBranch}*\n`;
    message += `Customer: *${name}*\n`;
    message += `Phone: *${phoneNumber}*\n\n`;
    message += `Order Details:\n`;
    let total = 0;
    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
    });
    message += `\nSubtotal: $${total.toFixed(2)}\n`;
    message += `Delivery Fee: $3.00\n`;
    message += `*Total Amount: $${(total + 3).toFixed(2)}*\n\n`;
    message += `Thank you!`;

    window.open(`https://wa.me/+96171096971?text=${encodeURIComponent(message.trim())}`, '_blank');
});

window.onload = () => {
    initMap();
    
    // Contact Alert Logic
    const openAlert = document.getElementById("contact-info");
    const customAlert = document.querySelector(".contact-info-custom-alert");
    
    if (openAlert && customAlert) {
        openAlert.addEventListener("click", (e) => {
            e.preventDefault();
            customAlert.classList.toggle("active");
        });
    }

    // Category button active state logic
    const categoryButtons = document.querySelectorAll('.menu-buttons button');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
};