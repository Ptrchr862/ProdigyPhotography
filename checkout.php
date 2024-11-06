<?php
session_start();
require 'vendor/autoload.php'; // Load PayPal SDK

// Use session data for processing payment
$totalAmount = $_SESSION['total'];

// Set up PayPal API context
$apiContext = new \PayPal\Rest\ApiContext(
    new \PayPal\Auth\OAuthTokenCredential(
        'YOUR_CLIENT_ID',    // Replace with your PayPal client ID
        'YOUR_CLIENT_SECRET' // Replace with your PayPal client secret
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
} catch (Exception $ex) {
    echo 'Exception: ', $ex->getMessage(), "\n";
    exit(1);
}
?>
