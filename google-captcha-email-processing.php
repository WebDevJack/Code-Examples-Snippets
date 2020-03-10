<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  class MailData {
    public $errors, $emailFrom, $emailTo, $message, $name, $responseStr, $private, $clientIP, $url;
    public function __construct($privKey) {
      $this->message = $_POST['message'];
      $this->emailFrom = $_POST['email'];
      $this->name = $_POST['name'];
      $this->responseStr = $_POST['g-recaptcha-response'];
      $this->clientIP = $_SERVER["REMOTE_ADDR"];
      $this->emailTo = "your_email@domain.com";
      $this->errors = array();
      $this->private = $privKey;
    }
    public function sanitise() {
      (!empty($this->emailFrom) ? $this->emailFrom = filter_var($this->emailFrom, FILTER_SANITIZE_EMAIL) : array_push($this->errors, "email=empty"));
      (!empty($this->message) ? $this->message = filter_var($this->message, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH) : array_push($this->errors, "message=empty"));
      (!empty($this->name) ? $this->name = filter_var($this->name, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH) : array_push($this->errors, "name=empty"));
      (!empty($this->responseStr) ? $this->responseStr = filter_var($this->responseStr, FILTER_SANITIZE_STRING) : array_push($this->errors, "google=empty"));
      if (!filter_var($this->emailFrom, FILTER_VALIDATE_EMAIL)) { array_push($this->errors, "email=invalid" . $this->emailFrom); }
      if ($this->checkGoogle() !== true) { array_push($this->errors, "robot=true"); }
    }
    public function checkGoogle() {
      $this->url = "https://www.google.com/recaptcha/api/siteverify?secret=" . $this->private . "&response=" . $this->responseStr ."&remoteip=" . $this->clientIP;
      $response = file_get_contents($this->url);
      $decoded = json_decode($response, true);
      $result = (intval($decoded["success"]) !== 1 ? false : true);
      return $result;
    }
    public function sendMail() {
       if (!empty($this->errors)) {
         $getErrors = implode("&", $this->errors);
         header("Location: https://www.domain.co.uk/index.php?" . $getErrors);
         exit();
       } else {
         $subject = "New Message from " . $this->name;
         $headers = array('From' => $this->emailFrom, 'Reply-To' => $this->emailFrom);
         if (mail($this->emailTo, $subject, $this->message, $headers)) {
           header("Location: https://www.domain.co.uk/index.php?success");
         }
       }
    }
  }
  require "google-captcha.php"; // needed for google key variables.
  $init = new MailData($privKey);
  $init->sanitise();
  $init->sendMail();
}

?>
