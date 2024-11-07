<?php
session_start();
require 'vendor/autoload.php';

// Regenerate session ID to prevent session fixation
session_regenerate_id(true);

// Retrieve cart data and total amount
$totalAmount = isset($_SESSION['total']) ? $_SESSION['total'] : 0;

if ($totalAmount <= 0) {
    echo "No items in the cart.";
    exit;
}

// Set up PayPal API context
$apiContext = new \PayPal\Rest\ApiContext(
    new \PayPal\Auth\OAuthTokenCredential(
        'YOUR_CLIENT_ID',
        'YOUR_CLIENT_SECRET'
    )
);

// Set up the payment object
$payer = new \PayPal\Api\Payer();
$payer->setPaymentMethod("paypal");

$amount = new \PayPal\Api\Amount();
$amount->setTotal($totalAmount);
$amount->setCurrency("AUD");

$transaction = new \PayPal\Api\Transaction();
$transaction->setAmount($amount);
$transaction->setDescription("Prodigy Photography Purchase");

$redirectUrls = new \PayPal\Api\RedirectUrls();
$redirectUrls->setReturnUrl("https://yourwebsite.com/success.php")
             ->setCancelUrl("https://yourwebsite.com/cancel.php");

$payment = new \PayPal\Api\Payment();
$payment->setIntent("sale")
        ->setPayer($payer)
        ->setTransactions(array($transaction))
        ->setRedirectUrls($redirectUrls);

try {
    $payment->create($apiContext);
    header("Location: " . $payment->getApprovalLink());
    exit;
} catch (\PayPal\Exception\PayPalConnectionException $ex) {
    error_log('PayPal Connection Exception: ' . $ex->getData());
    echo 'An error occurred while processing your payment. Please try again later.';
    exit(1);
} catch (Exception $ex) {
    error_log('Exception: ' . $ex->getMessage());
    echo 'An error occurred. Please try again later.';
    exit(1);
}
?>