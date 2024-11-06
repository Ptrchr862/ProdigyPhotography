<?php
session_start();

// Get JSON input from JavaScript
$cartData = file_get_contents('php://input');
$cart = json_decode($cartData, true);

if (!$cart) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid cart data']);
    exit;
}

// Calculate total securely and validate items
$total = 0;
foreach ($cart['cart'] as $item) {
    // Assume you have a function that securely fetches product prices from the database
    $price = getProductPrice($item['title']);
    if ($price !== false) {
        $total += $price * $item['quantity'];
    }
}

// Compare with the client-provided total to ensure there is no tampering
if ($total != $cart['total']) {
    echo json_encode(['status' => 'error', 'message' => 'Price mismatch detected.']);
    exit;
}

// Store cart data in session for further use in the checkout process
$_SESSION['cart'] = $cart['cart'];
$_SESSION['total'] = $total;

// Integrate with PayPal SDK or redirect to a payment processing page
$redirectUrl = "checkout.php"; // Redirect URL for payment (or create a PayPal order)

echo json_encode(['status' => 'success', 'redirectUrl' => $redirectUrl]);
?>
