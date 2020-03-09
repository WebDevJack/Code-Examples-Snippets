<?php

/* -----------------------------------------------------------------

  PHP OOP script email validation. - WebDevJack

  This PHP script handles the validation of an email form using 
  google captcha v2. The form sends the user back to the index.php 
  page with a string of GET paramaters.

------------------------------------------------------------------ */

if ($_SERVER["REQUEST_METHOD"] == "POST") {

  class MailData {
    public $errors, $emailFrom, $emailTo, $message, $name, $responseStr, $private, $clientIP, $url;
    public function __construct($privKey) {
      $this->message = $_POST['message'];
      $this->emailFrom = $_POST['email'];
      $this->name = $_POST['name'];
      $this->responseStr = $_POST['g-recaptcha-response'];
      $this->clientIP = $_SERVER["REMOTE_ADDR"];
      $this->emailTo = "your_email_here@domain.co.uk";
      $this->errors = array();
      $this->private = $privKey;
    }
    public function sanitise() {
      if (!filter_var($this->message, FILTER_SANITIZE_STRING)) { array_push($this->errors, "messageError"); }
      if (!filter_var($this->emailFrom, FILTER_SANITISE_EMAIL)) { array_push($this->errors, "emailError"); }
      if (!filter_var($this->emailFrom, FILTER_VALIDATE_EMAIL)) { array_push($this->errors, "emailInvalid"); }
      if (!filter_var($this->name, FILTER_SANITIZE_STRING)) { array_push($this->errors, "nameError"); }
      if (!filter_var($this->responseStr, FILTER_SANITIZE_STRING)) { array_push($this->errors, "googleError"); }
    }
    public function checkGoogle() {
      $this->url = "https://www.google.com/recaptcha/api/siteverify?secret=" . $this->private . "&response=" . $this->responseStr ."&remoteip=" . $this->clientIP;
      $response = file_get_contents($this->url);
      $decoded = json_decode($response, true);
      $result = (intval($decoded["success"]) !== 1 ? false : true);
      return $result;
    }
    public function sendMail() {
       if ($this->checkGoogle() !== true) {
         array_push($this->errors, "robot=true");
       } else {
         if (empty($this->emailFrom)) { array_push($this->errors, "email%20error=true"); }
         if (empty($this->message)) { array_push($this->errors, "message%20error=true"); }
         if (empty($this->name)) { array_push($this->errors, "name%20error=true"); }
         if (!empty($this->errors)) {
           $getErrors = implode("&", $this->errors);
           header("Location: https://www.domain.co.uk/index.php?" . $getErrors);
         } else {
           $subject = "New Email from " . $this->name;
           $headers = array(
             'From' => $this->emailFrom,
             'Reply-To' => $this->emailFrom
           );
           if (mail($this->emailTo, $subject, $this->message, $headers)) {
             header("Location: https://www.domain.co.uk/index.php?success");
           }
         }
      }
    }
  }

require "../google-captcha.php"; // store private key in this file, in variable $privKey (higher directory for security purposes).

$init = new MailData($privKey);
$init->sanitise();
$init->sendMail();
  
  /* -------------------------------------------------------
  
      Recomended: Use JavaScript DOM manipulation
      to provide a UI/UX changes based on these params 
      E.G success message in green color, error in red etc.
  
  ---------------------------------------------------------*/
}

?>
