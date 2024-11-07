// Photo Data
const photos = [
    { title: "Roos Mob", thumb: "secure_images/thumbs/roosmob-thumb.JPG", full: "secure_images/roosmob.JPG" },
    { title: "Butterfly - Seaford Rise, SA", thumb: "secure_images/thumbs/butterfly-thumb.jpg", full: "secure_images/butterfly.jpg" },
    { title: "Waterfall - Ingalalla Falls in Normanville, SA", thumb: "secure_images/thumbs/waterfall-thumb.JPG", full: "secure_images/waterfall.JPG" },
    { title: "Rainbow - Seaford Rise, SA", thumb: "secure_images/thumbs/Rainbow-thumb.jpg", full: "secure_images/rainbow.JPG" },
    { title: "Historic Church - Old Noarlunga, SA", thumb: "secure_images/thumbs/HistoricChurchNoarlunga-thumb.JPG", full: "secure_images/HistoricChurchNoarlunga.JPG" }
];

// Cart Data
let cart = [];
let total = 0;

/* Disable right-click on the entire page */
document.addEventListener('contextmenu', (event) => event.preventDefault());

/* Generate Photo Cards */
function generatePhotoCards() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = photos.map((photo, index) => `
        <div class="photo-card" data-title="${photo.title}">
            <div class="image-overlay">
                <img src="${photo.thumb}" alt="${photo.title}" class="thumbnail">
                <div class="watermark">Prodigy Photography</div>
            </div>
            <p>${photo.title}</p>
            <div class="dropdown-container">
                <select class="type-dropdown" name="photo-type-${index}" id="photo-type-${index}">
                    <option value="digital" selected>Digital Download - $15</option>
                    <option value="real">Real Copy</option>
                </select>
                <select class="quantity-dropdown" name="quantity-${index}" id="quantity-${index}" disabled>
                    ${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                </select>
                <select class="size-dropdown" name="photo-size-${index}" id="photo-size-${index}" disabled>
                    <option value="">Select Size</option>
                    <option value="XS">XS - $1</option>
                    <option value="S">S - $2</option>
                    <option value="M">M - $3</option>
                    <option value="L">L - $4</option>
                    <option value="XL">XL - $5</option>
                </select>
            </div>
            <button class="add-to-cart-button">Add to Cart</button>
        </div>
    `).join('');

    attachDropdownListeners();
    attachThumbnailListeners();
    attachAddToCartListeners();
    console.log("Photo cards generated and event listeners initialized.");
}

/* Attach Listeners to Type Dropdowns */
function attachDropdownListeners() {
    document.querySelectorAll('.type-dropdown').forEach(dropdown => {
        const card = dropdown.closest('.photo-card');
        const sizeDropdown = card.querySelector('.size-dropdown');
        const quantityDropdown = card.querySelector('.quantity-dropdown');

        // Set initial state based on default value
        if (dropdown.value === 'digital') {
            sizeDropdown.disabled = true;
            quantityDropdown.disabled = true;
        }

        // Add event listener for changes
        dropdown.addEventListener('change', (event) => {
            if (event.target.value === 'real') {
                // Enable size and quantity for Real Copy
                sizeDropdown.disabled = false;
                quantityDropdown.disabled = false;
                sizeDropdown.value = ""; // Reset size selection
            } else {
                // Disable size and quantity for Digital Download
                sizeDropdown.disabled = true;
                quantityDropdown.disabled = true;
                sizeDropdown.value = ""; // Clear size selection
                quantityDropdown.value = 1; // Default quantity to 1
            }
        });
    });
}

/* Attach Click Listeners to Thumbnails */
function attachThumbnailListeners() {
    document.querySelectorAll('.image-overlay img.thumbnail').forEach((img, index) => {
        img.addEventListener('click', () => openImagePopup(photos[index].full));
    });
}

/* Open Image Popup */
function openImagePopup(src) {
    const popup = document.getElementById('image-popup');
    const popupImage = document.getElementById('popup-image');

    // Load the full-size image
    popupImage.src = src;

    // Make the popup visible
    popup.classList.add('visible');

    // Adjust image dimensions after the image has fully loaded
    popupImage.onload = function() {
        popupImage.style.maxWidth = '90vw';
        popupImage.style.maxHeight = '90vh';
        const watermark = document.getElementById('watermark');
        watermark.style.display = 'flex'; // Show watermark on full-size image
    };

    // Disable right-click on the popup
    popup.addEventListener('contextmenu', (event) => event.preventDefault());

    // Attach event listener to close button
    const closeBtn = popup.querySelector('.close-popup-button');
    closeBtn.onclick = () => {
        popup.classList.remove('visible');
        popupImage.src = ''; // Clear the image source after closing
    };
}

/* Add Watermark to Popup Image */
function addWatermarkToPopup() {
    const watermark = document.getElementById('watermark');
    watermark.style.display = 'block';
}

/* Add Event Listeners for Page Elements */
document.addEventListener('DOMContentLoaded', function () {
    generatePhotoCards();

    // Toggle Cart Visibility
    const cartButton = document.getElementById('cart-button');
    const cartElement = document.getElementById('cart');

    if (!cartButton) {
        console.error("Cart button element not found!");
    } else {
        console.log("Cart button found, attaching event listener.");
        cartButton.addEventListener('click', () => {
            console.log("Cart button clicked");

            // Toggle the 'visible' class to show/hide the cart
            const isCartVisible = cartElement.classList.toggle('visible');
            console.log("Cart visibility toggled.");

            // Enable or disable body scrolling based on cart visibility
            if (isCartVisible) {
                document.body.style.overflow = 'hidden'; // Disable scrolling on the page
            } else {
                document.body.style.overflow = 'auto'; // Re-enable scrolling on the page
            }
        });
    }

    // Attach Checkout Button Listener
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            checkout();
        });
    }
});

/* Add Items to Cart */
function attachAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.photo-card');
            const title = card.dataset.title;
            const type = card.querySelector('.type-dropdown').value;
            const quantity = parseInt(card.querySelector('.quantity-dropdown').value);
            const size = card.querySelector('.size-dropdown').value;
            let price = 0;

            // Calculate price based on type
            if (type === 'digital') {
                price = 15; // Digital Download is a fixed price
            } else if (type === 'real') {
                if (size) {
                    price = getSizePrice(size) * quantity; // Calculate price based on size and quantity
                } else {
                    alert(`Please select a size for the Real Copy.`);
                    return; // Prevent adding to cart without a size
                }
            }

            if (type === 'digital' && cart.some(item => item.title === title && item.type === 'digital')) {
                alert(`"${title}" is already in the cart as a digital copy.`);
                return; // Prevent duplicate digital downloads
            }

            cart.push({ title, type, size, quantity, price });
            total += price;
            updateCart();
            updateCartCount();
            saveCartToServer(); // Save cart to the server after updating it
        });
    });
}

/* Save Cart Data to Server */
function saveCartToServer() {
    fetch('save_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart: cart, total: total })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log("Cart saved successfully on server");
        } else {
            console.error("Error saving cart to server:", data.message);
        }
    })
    .catch(error => {
        console.error("Network error while saving cart to server:", error);
    });
}

/* Update Cart Count */
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

/* Update Cart Display */
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <li class="cart-item">
            <span class="cart-item-title">${item.title} (${item.type}${item.type === 'real' ? `, Size: ${item.size}` : ''})</span>
            <div class="cart-item-controls">
                <span class="cart-item-price">Unit Price: $${(item.price / item.quantity).toFixed(2)}</span>
                <input type="number" class="quantity-input" data-index="${index}" min="1" max="${item.type === 'digital' ? 1 : 20}" value="${item.quantity}">
                <span class="item-total-price">= $${item.price.toFixed(2)}</span>
                <button class="remove-item-button" data-index="${index}">Remove</button>
            </div>
        </li>
    `).join('');

    attachRemoveListeners();
    attachQuantityChangeListeners(); // Attach listeners to quantity input fields
}

/* Attach Change Listeners to Quantity Input Fields */
function attachQuantityChangeListeners() {
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (event) => {
            const index = event.target.dataset.index;
            const newQuantity = parseInt(event.target.value);
            if (newQuantity <= 0) return; // Prevent invalid quantities

            // Update the item's quantity and price in the cart
            const item = cart[index];
            const pricePerUnit = item.price / item.quantity; // Calculate unit price based on current price and quantity
            item.quantity = newQuantity;
            item.price = pricePerUnit * newQuantity;

            // Update the total price of all items
            total = cart.reduce((sum, item) => sum + item.price, 0);

            // Update the cart display with new values
            updateCart();
            updateCartCount();
        });
    });
}

/* Attach Remove Listeners */
function attachRemoveListeners() {
    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            removeFromCart(index);
        });
    });
}

/* Remove Item from Cart */
function removeFromCart(index) {
    const item = cart.splice(index, 1)[0];
    total -= item.price;
    updateCart();
    updateCartCount();
}

/* Checkout Function */
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to proceed to checkout.");
        return;
    }

    saveCartToServer(); // Ensure cart is saved before proceeding
    window.location.href = 'process_payment.php';
}

/* Get Price Based on Size */
function getSizePrice(size) {
    switch (size) {
        case 'XS': return 1;
        case 'S': return 2;
        case 'M': return 3;
        case 'L': return 4;
        case 'XL': return 5;
        default: return 0;
    }
}

window.onload = function() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2) // Use the actual total amount
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Optionally redirect the user or update the UI
            });
        }
    }).render('#paypal-button-container');
};
