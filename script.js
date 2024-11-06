// Photo Data
const photos = [
    { title: "Roos Mob", thumb: "images/thumbs/roosmob-thumb.JPG", full: "images/roosmob.JPG" },
    { title: "Butterfly - Seaford Rise, SA", thumb: "images/thumbs/butterfly-thumb.jpg", full: "images/butterfly.jpg" },
    { title: "Waterfall - Ingalalla Falls in Normanville, SA", thumb: "images/thumbs/waterfall-thumb.JPG", full: "images/waterfall.JPG" },
    { title: "Rainbow - Seaford Rise, SA", thumb: "images/thumbs/Rainbow-thumb.jpg", full: "images/rainbow.JPG" },
    { title: "Historic Church - Old Noarlunga, SA", thumb: "images/thumbs/HistoricChurchNoarlunga-thumb.JPG", full: "images/HistoricChurchNoarlunga-thumb.JPG" }
];

// Cart Data
let cart = [];
let total = 0;

/* Disable right-click on the entire page */
document.addEventListener('contextmenu', (event) => event.preventDefault());

/* Generate Photo Cards */
function generatePhotoCards() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = photos.map(photo => `
        <div class="photo-card" data-title="${photo.title}">
            <div class="image-overlay">
                <img src="${photo.thumb}" alt="${photo.title}" class="thumbnail">
            </div>
            <p>${photo.title}</p>
            <div class="dropdown-container">
                <select class="type-dropdown">
                    <option value="digital" selected>Digital Download - $15</option>
                    <option value="real">Real Copy</option>
                </select>
                <select class="quantity-dropdown" disabled>
                    ${Array.from({ length: 20 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                </select>
                <select class="size-dropdown" disabled>
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

    attachDropdownListeners(); // Attach listeners to type dropdowns to enable/disable size dropdown
    attachThumbnailListeners();
    attachAddToCartListeners();
    console.log("Photo cards generated and event listeners initialized."); // Debugging line
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

    // Add watermark text if it's not already there
    const watermark = document.getElementById('watermark');
    if (!watermark) {
        const newWatermark = document.createElement('div');
        newWatermark.id = "watermark";
        newWatermark.classList.add('watermark');
        newWatermark.textContent = 'Prodigy Photography';
        document.querySelector('.popup-content').appendChild(newWatermark);
    }

    // Adjust image dimensions after the image has fully loaded
    popupImage.onload = function() {
        const maxWidth = window.innerWidth * 0.9; // Set max width as 90% of viewport width
        const maxHeight = window.innerHeight * 0.9; // Set max height as 90% of viewport height

        // Calculate the natural aspect ratio of the image
        const aspectRatio = popupImage.naturalWidth / popupImage.naturalHeight;

        if (popupImage.naturalWidth > maxWidth || popupImage.naturalHeight > maxHeight) {
            if (aspectRatio > 1) {
                // Landscape image: constrain by width first
                popupImage.style.width = `${maxWidth}px`;
                popupImage.style.height = `${maxWidth / aspectRatio}px`;

                // Adjust height if it still exceeds maxHeight
                if (popupImage.offsetHeight > maxHeight) {
                    popupImage.style.height = `${maxHeight}px`;
                    popupImage.style.width = `${maxHeight * aspectRatio}px`;
                }
            } else {
                // Portrait or square image: constrain by height first
                popupImage.style.height = `${maxHeight}px`;
                popupImage.style.width = `${maxHeight * aspectRatio}px`;

                // Adjust width if it still exceeds maxWidth
                if (popupImage.offsetWidth > maxWidth) {
                    popupImage.style.width = `${maxWidth}px`;
                    popupImage.style.height = `${maxWidth / aspectRatio}px`;
                }
            }
        } else {
            // If the image fits within the max dimensions, display it in natural size
            popupImage.style.width = `${popupImage.naturalWidth}px`;
            popupImage.style.height = `${popupImage.naturalHeight}px`;
        }
    };

    // Make the popup visible
    popup.classList.add('visible');
}

// Disable right-click on the popup
    popup.addEventListener('contextmenu', (event) => event.preventDefault());

    // Attach event listener to close button
    const closeBtn = popup.querySelector('.close-popup-button');
    closeBtn.onclick = () => {
        popup.classList.remove('visible');
        popupImage.src = ''; // Clear the image source after closing
    };
}

/* Add Event Listeners for Page Elements */
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    console.log(gallery); // Should not be null
    generatePhotoCards(); // Make sure this line is executed after the gallery element has loaded
});
    // Additional initialization logic if needed
});

    // Toggle Cart Visibility
    const cartButton = document.getElementById('cart-button');
    const cartElement = document.getElementById('cart');

    if (!cartButton) {
        console.error("Cart button element not found!");
    } else {
        console.log("Cart button found, attaching event listener.");
        cartButton.addEventListener('click', () => {
            console.log("Cart button clicked"); // Debugging line to confirm click event

            // Toggle the 'visible' class to show/hide the cart
            const isCartVisible = cartElement.classList.toggle('visible');
            console.log("Cart visibility toggled."); // Confirm cart visibility is being toggled

            // Enable or disable body scrolling based on cart visibility
            if (isCartVisible) {
                document.body.style.overflow = 'hidden'; // Disable scrolling on the page
            } else {
                document.body.style.overflow = 'auto'; // Re-enable scrolling on the page
            }
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
        });
    });
}

/* Checkout and Send Data to PHP */
function checkout() {
    // Send cart data to PHP backend using AJAX
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "process_cart.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ cart: cart, total: total }));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Handle the response from PHP backend
            let response = JSON.parse(xhr.responseText);
            if (response.status === "success") {
                window.location.href = response.redirectUrl; // Redirect to PayPal or Success Page
            } else {
                alert("There was an issue with your order. Please try again.");
            }
        }
    };
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
    renderPayPalButton();
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

/* Update Cart Count */
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

/* Remove Item from Cart */
function removeFromCart(index) {
    const item = cart.splice(index, 1)[0];
    total -= item.price;
    updateCart();
    updateCartCount();
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

/* Render PayPal Button */
function renderPayPalButton() {
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = ''; // Clear previous buttons

    if (cart.length === 0) return; // Do not render PayPal button if cart is empty

    if (typeof paypal === 'undefined') {
        console.error("PayPal SDK not loaded. PayPal buttons will not be rendered.");
        return; // If PayPal SDK didn't load, do not attempt to render the buttons
    }

    paypal.Buttons({
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2)
                    }
                }]
            });
        },
        onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
                alert('Transaction successful!');
                clearCart();
            });
        }
    }).render('#paypal-button-container');
}

/* Clear Cart */
function clearCart() {
    cart = [];
    total = 0;
    updateCart();
    updateCartCount();
}
