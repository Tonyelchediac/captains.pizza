function showCustomAlert() {
  const customAlert = document.getElementById("custom-alert");
  const customAlertOverlay = document.getElementById("custom-alert-overlay");
  customAlert.style.display = "block";
  customAlertOverlay.style.display = "block";
}

function closeCustomAlert() {
  const customAlert = document.getElementById("custom-alert");
  const customAlertOverlay = document.getElementById("custom-alert-overlay");
  customAlert.style.display = "none";
  customAlertOverlay.style.display = "none";
}

document
  .querySelector(".bx.bxs-phone")
  .addEventListener("click", function (event) {
    event.preventDefault();
    showCustomAlert();
  });

  document.addEventListener('DOMContentLoaded', function() {
    var homeBackButton = document.getElementById('backtotop');
    
    homeBackButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

document.addEventListener('DOMContentLoaded', function() {
  var homeBackButton = document.getElementById('homeBack');
  
  homeBackButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

const orderButton = document.getElementById('orderButton');
const orderFrame = document.getElementById('orderFrame');
const closeButton = document.getElementById('closeButton');
const orderCount = document.getElementById('orderCount');
const emptyMessage = document.getElementById('emptyMessage');
const orderItems = document.getElementById('orderItems');
const totalAmount = document.getElementById('totalAmount');
let total = 0;
let itemCount = 0;

let orderedItems = {};

orderButton.addEventListener('click', () => {
  orderFrame.classList.toggle('active');
});

closeButton.addEventListener('click', () => {
  orderFrame.classList.remove('active');
});

function toggleSizeButtons(container) {
  const sizeButtons = container.nextElementSibling;
  sizeButtons.style.display = 'block';
}

function addPizzaToOrder(container, size, price) {
  const itemNameEl = container.querySelector('.itemName');
  const spanEl = itemNameEl.querySelector('span');
  spanEl.textContent = ` ${size}`;
  spanEl.style.display = 'inline';
  container.querySelector('.itemPrice').textContent = price + '$';
  container.nextElementSibling.style.display = 'none';
  addToOrder(container);

  const name = `${itemNameEl.querySelector('p').textContent} (${spanEl.textContent})`;
  const observer = new MutationObserver((mutations) => {
    if (!orderedItems[name]) {
      spanEl.style.display = 'none';
    }
  });
  observer.observe(container, {
    childList: true,
    subtree: true,
    attributes: true
  });
}

//Pizza Modal

////////////////////////

function addToOrder(item) {
  let name, price;

  if (item.querySelector('.itemName') && item.querySelector('.itemPrice')) {
    const itemNameEl = item.querySelector('.itemName');
    if (itemNameEl.querySelector('p') && itemNameEl.querySelector('span')) {
      name = `${itemNameEl.querySelector('p').textContent} (${itemNameEl.querySelector('span').textContent})`;
    } else {
      name = itemNameEl.textContent;
    }
    price = parseFloat(item.querySelector('.itemPrice').textContent.replace('$', ''));
    
    // Add flash effect
    item.style.border = '2px solid red';
    setTimeout(() => {
      item.style.border = '2px solid #ffa500';
      setTimeout(() => {
        item.style.border = '2px solid red';
      }, 200);
    }, 100);
  }

  if (orderedItems[name]) {
    orderedItems[name].quantity++;
    orderedItems[name].totalPrice = orderedItems[name].quantity * orderedItems[name].price;
    orderedItems[name].element = item;
  } else {
    orderedItems[name] = {
      quantity: 1,
      price: price,
      totalPrice: price,
      element: item
    };
  }

  if (item.querySelector) {
    let clickCounter = item.querySelector('.click-counter');
    if (!clickCounter) {
      clickCounter = document.createElement('div');
      clickCounter.className = 'click-counter';
      clickCounter.style.position = 'absolute';
      clickCounter.style.top = '-5px';
      clickCounter.style.right = '-5px';
      clickCounter.style.backgroundColor = 'red';
      clickCounter.style.color = 'white';
      clickCounter.style.width = '20px';
      clickCounter.style.height = '20px';
      clickCounter.style.borderRadius = '50%';
      clickCounter.style.fontSize = '12px';
      clickCounter.style.textAlign = 'center';
      item.style.position = 'relative';
      item.appendChild(clickCounter);
    }
    clickCounter.textContent = orderedItems[name].quantity;
  }

  updateOrderItems();
  total += price;
  totalAmount.textContent = total.toFixed(2);
  itemCount++;
  orderCount.textContent = itemCount;
  orderCount.style.display = 'inline-block';
  emptyMessage.style.display = 'none';
}

function updateOrderItems() {
  orderItems.innerHTML = '';

  for (const name in orderedItems) {
    const item = orderedItems[name];
    const listItem = document.createElement('li');
    listItem.textContent = `${name} x${item.quantity} - $${item.totalPrice.toFixed(2)}`;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');
    removeButton.addEventListener('click', function () {
      removeItem(name, item.price);
    });

    listItem.appendChild(removeButton);
    orderItems.appendChild(listItem);
  }
}

function removeItem(name, price) {
  if (orderedItems[name]) {
    orderedItems[name].quantity--;

    if (orderedItems[name].quantity === 0) {
      if (orderedItems[name].element) {
        orderedItems[name].element.style.border = '';
        const clickCounter = orderedItems[name].element.querySelector('.click-counter');
        if (clickCounter) {
          clickCounter.remove();
        }
      }
      delete orderedItems[name];
    } else {
      orderedItems[name].totalPrice = orderedItems[name].quantity * orderedItems[name].price;
      // Update click counter to show current quantity
      if (orderedItems[name].element) {
        const clickCounter = orderedItems[name].element.querySelector('.click-counter');
        if (clickCounter) {
          clickCounter.textContent = orderedItems[name].quantity;
        }
      }
    }

    updateOrderItems();
    total -= parseFloat(price);
    totalAmount.textContent = total.toFixed(2);
    itemCount--;
    orderCount.textContent = itemCount;

    if (itemCount === 0) {
      emptyMessage.style.display = 'block';
      orderCount.style.display = 'none';
    }
  }
}

document.querySelectorAll('.section-container').forEach(container => {
  container.addEventListener('click', function () {
    const name = this.querySelector('.item-name').textContent;
    const price = this.querySelector('.item-price').textContent.replace('$', '');
    addToOrder(name, price);
  });
});

const orderButtonInsideFrame = document.getElementById('orderButtonInsideFrame');
const orderDialog = document.getElementById('orderDialog');
const closeDialogButton = document.getElementById('closeDialogButton');
const takeawayButton = document.getElementById('takeawayButton');
const deliveryButton = document.getElementById('deliveryButton');

const takeawayfield = document.getElementById('takeAwayField');
const closeTakeAwayField = document.getElementById("closeTakeAwayField");
const takeawaySubmitButton = document.getElementById('takeawaySubmitButton');

const branchDialog = document.getElementById('branchDialog');
const doumaButton = document.getElementById('doumaButton');
const batrounButton = document.getElementById('batrounButton');
const closeBranchDialog = document.getElementById('closeBranchDialog');
const takeawayPhoneNumber = document.getElementById('phoneNumber');
const takeawayErrorMessage = document.getElementById("takeawayErrorMessage");

orderButtonInsideFrame.addEventListener('click', () => {
  orderDialog.classList.add('active');
});

closeDialogButton.addEventListener('click', () => {
  orderDialog.classList.remove('active');
});

takeawayButton.addEventListener('click', () => {
  takeawayfield.classList.add('active');
});

closeTakeAwayField.addEventListener('click', () => {
  takeawayfield.classList.remove('active');
});

takeawaySubmitButton.addEventListener('click', () => {
  takeawayErrorMessage.textContent = "";
  const phoneNumber = takeawayPhoneNumber.value.trim();
  if (!phoneNumber) {
    takeawayErrorMessage.innerHTML = "<i class='bx bx-message-alt'></i> Please enter your phone number.";
    return;
  }

  branchDialog.classList.add('active');
  takeawayfield.classList.remove('active'); 

  function formatOrderedItems() {
    let itemsList = "";
    for (const name in orderedItems) {
      const item = orderedItems[name];
      itemsList += `${name} x${item.quantity} - $${item.totalPrice.toFixed(2)}\n`;
    }
    return itemsList.trim();
  }

  // Generate random order ID
  const generateOrderId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const orderId = generateOrderId();

  // Handle branch selection
  const handleBranchSelection = (branch, phoneNum) => {
    const formattedItems = formatOrderedItems();
    
    const message = `
*Hi Captain's Pizza*
New Wooden Food Order
Order ID: #${orderId}
Branch: *${branch}*

${formattedItems}

Total: *$${total.toFixed(2)}*
Phone: ${phoneNumber}
Order Type: *Takeaway*

Thank you Captain's!
`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNum}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
    branchDialog.classList.remove('active');
  };

  doumaButton.onclick = () => handleBranchSelection('Douma', '70467263');
  batrounButton.onclick = () => handleBranchSelection('Batroun', '71096971');
  closeBranchDialog.onclick = () => branchDialog.classList.remove('active');
});

document.getElementById('deliveryButton').addEventListener('click', () => {
  localStorage.setItem('orderedItems', JSON.stringify(orderedItems));
  window.location.href = 'delivery.html';
});

closeButton.addEventListener('click', () => {
  orderFrame.classList.remove('active');
});
