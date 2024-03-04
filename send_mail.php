<?php


include_once("index.html");


// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect post data from form
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // Specify your email and subject
    $to = "kimhoong0324@gmail.com"; // Replace with your email
    $subject = "New contact from $name";

    // Create the email header
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    // Prepare the email body
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // Send the email
    if (mail($to, $subject, $email_content, $headers)) {
        // Success message
        echo "<p>Thank you for contacting us, $name. You will get a reply shortly.</p>";
    } else {
        // Error message
        echo "<p>Sorry, we were unable to send your message. Please try again later.</p>";
    }
} else {
    // Not a POST request, set a 403 (forbidden) response code.
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}

?>