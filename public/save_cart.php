<?php
session_start();

// Regenerate session ID to prevent session fixation
session_regenerate_id(true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

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
    $price = getProductPrice($item['title']);
    if ($price !== false) {
        $total += $price * $item['quantity'];
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid product: ' . htmlspecialchars($item['title'])]);
        exit;
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
$redirectUrl = "checkout.php";

// Return success response with redirect URL
echo json_encode(['status' => 'success', 'redirectUrl' => $redirectUrl]);

// Function to get product price securely from the database
function getProductPrice($title) {
    $products = [
        "Roos Mob" => 15,
        "Butterfly - Seaford Rise, SA" => 15,
        "Waterfall - Ingalalla Falls in Normanville, SA" => 15,
        "Rainbow - Seaford Rise, SA" => 15,
        "Historic Church - Old Noarlunga, SA" => 15
    ];

    return isset($products[$title]) ? $products[$title] : false;
}
?>