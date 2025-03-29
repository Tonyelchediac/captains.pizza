let cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartContainerButtons = document.querySelector(".cart-buttons");
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
cartBtn.addEventListener("click", function () {
    cartContainer.classList.add("active");
    cartContainerButtons.classList.add("active");
    displayCartItems();
});

// Close cart
closeCartBtn.addEventListener("click", function () {
    cartContainer.classList.remove("active");
    cartContainerButtons.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", function () {
    const menuSections = {
        appetizers: "data/appetizers.json",
        salads: "data/salads.json",
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

                    menuItem.innerHTML = `
                        <div class="itemnameanddes">
                            <h2 class="item-name">${item.name}</h2>
                            <p class="description">${item.description}</p>
                        </div>
                        <div class="priceandorder">
                            <p class="item-price">$${item.price}</p>
                            <button class="add-to-order">+</button>
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

document.addEventListener("DOMContentLoaded", function () {
    const pizzaFile = "data/pizzas.json";

    function loadPizzaItems(file) {
        fetch(file)
            .then(response => response.json())
            .then(data => {
                const section = document.querySelector("#pizzas .menu-container");
                if (!section) return;

                data.forEach(item => {
                    const pizzaItem = document.createElement("div");
                    pizzaItem.classList.add("pizza-item");
                    pizzaItem.setAttribute("data-name", item.name);
                    pizzaItem.setAttribute("data-price-medium", item["price-medium"]);
                    pizzaItem.setAttribute("data-price-large", item["price-large"]);

                    pizzaItem.innerHTML = `
                        <div class="itemnameanddes">
                            <h2>${item.name}</h2>
                            <p class="description">${item.description}</p>
                        </div>
                        <div class="priceandorder" id="medium">
                            <p class="item-price">Medium $${item["price-medium"]}</p>
                            <button class="add-to-order">+</button>
                            <div class="quantity hidden">
                                <button class="minus">-</button>
                                <span class="qty">1</span>
                                <button class="plus">+</button>
                            </div>
                        </div>
                        <div class="priceandorder" id="large">
                            <p class="item-price">Large $${item["price-large"]}</p>
                            <button class="add-to-order">+</button>
                            <div class="quantity hidden">
                                <button class="minus">-</button>
                                <span class="qty">1</span>
                                <button class="plus">+</button>
                            </div>
                        </div>
                    `;

                    section.appendChild(pizzaItem);
                });

                attachItemEventListeners();
            })
            .catch(error => console.error(`Error loading ${file}:`, error));
    }

    loadPizzaItems(pizzaFile);

    // Add event listeners to the dynamically created items
    function attachItemEventListeners() {
        const addToOrderButtons = document.querySelectorAll(".add-to-order");

        addToOrderButtons.forEach(button => {
            button.addEventListener("click", function() {
                const pizzaItem = button.closest(".pizza-item");
                const pizzaName = pizzaItem.getAttribute("data-name");
                const size = button.closest(".priceandorder").id; // Get size (medium or large)
                const pizzaPrice = parseFloat(button.closest(".priceandorder").querySelector(".item-price").textContent.replace(/[^0-9.-]+/g,""));

                let cartItem = cart.find(item => item.name === `${pizzaName} ${size.charAt(0).toUpperCase() + size.slice(1)}`);
                if (!cartItem) {
                    cart.push({ name: `${pizzaName} ${size.charAt(0).toUpperCase() + size.slice(1)}`, price: pizzaPrice, quantity: 1 });
                } else {
                    cartItem.quantity++; // Increment quantity in cart
                }

                // Show quantity div and hide add-to-order button
                const quantityDiv = button.nextElementSibling;
                quantityDiv.classList.remove("hidden");
                button.classList.add("hidden");

                // Update the displayed quantity
                const qtyDisplay = quantityDiv.querySelector(".qty");
                qtyDisplay.textContent = cartItem ? cartItem.quantity : 1;

                updateCartCount();
                displayCartItems();
                console.log(`Added ${pizzaName} ${size.charAt(0).toUpperCase() + size.slice(1)} x${cartItem.quantity} - $${(pizzaPrice * cartItem.quantity).toFixed(2)} to the order.`);
            });
        });

        // Attach event listeners for quantity buttons
        const quantityButtons = document.querySelectorAll(".quantity");
        quantityButtons.forEach(quantityDiv => {
            const plusBtn = quantityDiv.querySelector(".plus");
            const minusBtn = quantityDiv.querySelector(".minus");
            const qtyDisplay = quantityDiv.querySelector(".qty");

            plusBtn.addEventListener("click", function() {
                let currentQty = parseInt(qtyDisplay.textContent);
                qtyDisplay.textContent = currentQty + 1;

                // Update the cart quantity
                const pizzaItem = plusBtn.closest(".pizza-item");
                const pizzaName = pizzaItem.getAttribute("data-name");
                const size = plusBtn.closest(".priceandorder").id;
                let cartItem = cart.find(item => item.name === `${pizzaName} ${size.charAt(0).toUpperCase() + size.slice(1)}`);
                if (cartItem) {
                    cartItem.quantity++;
                }
                updateCartCount();
            });

            minusBtn.addEventListener("click", function() {
                let currentQty = parseInt(qtyDisplay.textContent);
                if (currentQty > 1) {
                    qtyDisplay.textContent = currentQty - 1;

                    // Update the cart quantity
                    const pizzaItem = minusBtn.closest(".pizza-item");
                    const pizzaName = pizzaItem.getAttribute("data-name");
                    const size = minusBtn.closest(".priceandorder").id;
                    let cartItem = cart.find(item => item.name === `${pizzaName} ${size.charAt(0).toUpperCase() + size.slice(1)}`);
                    if (cartItem) {
                        cartItem.quantity--;
                    }
                    updateCartCount();
                } else {
                    // If quantity is 0, hide quantity div and show add-to-order button
                    const addToOrderBtn = minusBtn.closest(".priceandorder").querySelector(".add-to-order");
                    quantityDiv.classList.add("hidden");
                    addToOrderBtn.classList.remove("hidden");

                    // Remove item from cart
                    const pizzaItem = minusBtn.closest(".pizza-item");
                    const pizzaName = pizzaItem.getAttribute("data-name");
                    const size = minusBtn.closest(".priceandorder").id;
                    cart = cart.filter(item => item.name !== `${pizzaName} ${size.charAt(0).toUpperCase() + size.slice(1)}`);
                    updateCartCount();
                }
            });
        });
    }
});

function attachItemEventListeners() {
    document.querySelectorAll(".item").forEach(item => {
        const addToOrderBtn = item.querySelector(".add-to-order");
        const plusBtn = item.querySelector(".plus");
        const minusBtn = item.querySelector(".minus");
        const quantityDiv = item.querySelector(".quantity");
        const quantityDisplay = item.querySelector(".qty");

        // Remove existing event listeners before adding new ones
        addToOrderBtn.replaceWith(addToOrderBtn.cloneNode(true));
        plusBtn.replaceWith(plusBtn.cloneNode(true));
        minusBtn.replaceWith(minusBtn.cloneNode(true));

        // Re-select the new buttons
        const newAddToOrderBtn = item.querySelector(".add-to-order");
        const newPlusBtn = item.querySelector(".plus");
        const newMinusBtn = item.querySelector(".minus");

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
                cartItem.quantity = 1; // Ensure it starts at 1
            }

            quantityDisplay.textContent = "1";
            updateCartCount();
            displayCartItems();
        });

        // Increase quantity by 1
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

        // Decrease quantity by 1
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
    if (totalItems > 0) {
        cartCount.style.fontWeight = "bold";
        cartCount.style.position = "absolute";
        cartCount.style.top = "10px";
        cartCount.style.right = "15px";
        cartCount.style.fontSize = "12px";
        cartCount.style.backgroundColor = "red";
        cartCount.style.borderRadius = "50%";
        cartCount.style.height = "20px";
        cartCount.style.width = "20px";
        cartCount.style.justifyContent = "center";
        cartCount.style.alignItems = "center";
        cartCount.style.color = "white";
    }
}

function displayCartItems() {
    cartItems.innerHTML = "";
    let total = 0; 
    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    const totalElement = document.querySelector(".cart-buttons .total");
    totalElement.textContent = cart.length > 0 ? `Total: $${total.toFixed(2)}` : `Total: $0.00`;

    updateDeliveryTotal(total); 
}

function updateDeliveryTotal(total) { 
    const deliveryFee = 3.00;
    const totalWithDelivery = total + deliveryFee;

    document.getElementById('deliveryTotal').innerText = `$${totalWithDelivery.toFixed(2)}`;
}

// Clear cart
clearCartBtn.addEventListener("click", function () {
    cart = [];
    updateCartCount();
    displayCartItems();
    document.querySelectorAll(".quantity").forEach(q => q.classList.add("hidden"));
    document.querySelectorAll(".add-to-order").forEach(btn => btn.classList.remove("hidden"));
});

// Generate a random order ID
function generateOrderID() {
    return Math.floor(Math.random() * 1000000);
}

// Send order to WhatsApp
callTakeaway.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    } else {
        takeawayAlert.classList.add("active");
    }
});

closeTakeaway.addEventListener("click", () => {
    takeawayAlert.classList.remove("active");
});

document.getElementById("order-btn").addEventListener("click", function () {
    const selectedBranch = document.getElementById("selectBranch").value;
    const phoneNumberInput = document.querySelector("#Takeaway input[type='number']");
    const phoneNumber = phoneNumberInput.value.trim();

    if (!phoneNumber || phoneNumber.length < 8) {
        alert("Please enter a valid phone number.");
        return;
    }

    if (selectedBranch === "Select") {
        alert('Please select the Branch');
        return;
    }

    let orderID = generateOrderID();
    let orderType = "Takeaway";

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
    message += `Order Type: *${orderType}*\n\n`;
    message += `Thank you Captain's!`;

    let whatsappURL = `https://wa.me/+96171096971?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
});

// call delivery Alert
orderBtnDelivery.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    } else {
        deliveryAlert.classList.add("active");
    }
});

closeDelivery.addEventListener("click", () => {
    deliveryAlert.classList.remove("active");
});

// map and delivery Alert

let map, marker;

function initMap() {
    const defaultLocation = { lat: 34.0, lng: 35.5018 };

    map = L.map('map').setView([defaultLocation.lat, defaultLocation.lng], 10);

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri & contributors',
    });

    const labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri & contributors',
    });

    satellite.addTo(map);
    labels.addTo(map);

    marker = L.marker([defaultLocation.lat, defaultLocation.lng], { draggable: true })
        .addTo(map)

    map.on('click', function (event) {
        marker.setLatLng(event.latlng);
    });

    marker.on('dragend', function (event) {
        let position = event.target.getLatLng();
        marker.setLatLng(position);
    });
}

function getMarkerPosition() {
    const latLng = marker.getLatLng();
    return {
        lat: latLng.lat,
        lng: latLng.lng,
    };
}

document.getElementById('delivery-order-btn').addEventListener('click', function () {
    const name = document.getElementById('name').value.trim();
    const phoneNumber = document.querySelector('#Delivery input[type="number"]').value.trim();
    const selectedBranch = document.getElementById('selectBranchDelivery').value;
    const position = getMarkerPosition();
    if (!name || !phoneNumber || phoneNumber.length < 8) {
        alert('Please enter a valid name and phone number.');
        return;
    }
    if (selectedBranch === 'Select') {
        alert('Please select a branch.');
        return;
    }

    let orderID = generateOrderID();
    let orderType = 'Delivery';
    let message = `Location: https://www.google.com/maps?q=${position.lat},${position.lng}\n\n`;
    message += `*Hi Captain's Pizza*\n`;
    message += `New Wooden Food Order\n\n`;
    message += `Order ID: *#${orderID}*\n`;
    message += `Branch: *${selectedBranch}*\n`;
    message += `Customer Name: *${name}*\n`;
    message += `Phone: *${phoneNumber}*\n\n`;
    message += `Order Details:\n`;
    let total = 0;
    cart.forEach(item => {
        message += `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        total += item.price * item.quantity;
    });
    message += `\nTotal: *$${total.toFixed(2)}*\n`;
    message += `Order Type: *${orderType}*\n\n`;
    message += `*Final Total: $${(total + 3).toFixed(2)}*\n\n`
    message += `Thank you Captain's!`;
    let whatsappURL = `https://wa.me/+96171096971?text=${encodeURIComponent(message.trim())}`;
    window.open(whatsappURL, '_blank');
});

window.onload = initMap;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.item').forEach(item => {
        const name = item.getAttribute('data-name');
        const price = item.getAttribute('data-price');
        item.querySelector('.item-name').textContent = `${name}`;
        item.querySelector('.item-price').textContent = `$${price}`;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const customAlert = document.querySelector(".contact-info-custom-alert");
    const openAlert = document.getElementById("contact-info");
    const closeAlert = document.querySelector(".close-button");

    openAlert.addEventListener("click", (event) => {
        customAlert.classList.add("active");
    });

    closeAlert.addEventListener("click", () => {
        customAlert.classList.remove("active");
    });
});