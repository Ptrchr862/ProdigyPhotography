<?php
session_start();

// Check if the user is authorized to access images (e.g., has made a purchase)
if (!isset($_SESSION['user_id']) || !isset($_SESSION['has_purchased'])) {
    http_response_code(403); // Forbidden access
    exit("Access denied.");
}

// Sanitize the image name input
$image_name = basename($_GET['image']); // Only take the base filename to prevent directory traversal attacks

// Define the path to your secure images folder
$image_path = "C:\Users\ptrch\OneDrive\Peter\Projects\Darren Photography Website\secure_images" . $image_name;

// Check if the file exists in the secure directory
if (file_exists($image_path)) {
    // Serve the file to the user
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename=' . $image_name);
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($image_path));
    readfile($image_path);
    exit;
} else {
    http_response_code(404); // File not found
    exit("File not found.");
}
