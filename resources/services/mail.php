<?php
    if(isset($_POST['email'])) {
        require_once('gump.class.php');
        GUMP::sanitize($_POST);

        define('EMAIL_TO', 'samwelmunga88@hotmail.se');
        define('EMAIL_FROM', 'server@samwel.se');

        $mail     = $_POST['email'];
        $sender   = (isset($_POST['sender'])) ? $_POST['sender'] : $mail;
        $subject  = 'Intresseanmälan från ' . $sender;
        $message  = (isset($_POST['message'])) ? wordwrap($_POST['message']) : '* * * Empty * * *';
        $message .= "\n\nAvsändare: " . $sender . "\nEpost: " . $mail;
        if(isset($_POST['phone'])) $message .= "\nTelefon: " . $_POST['phone'];

        $headers  = "From: " . $sender . " < " . EMAIL_FROM . " >\n";
        $headers .= "X-Sender: " . $sender . " < " . EMAIL_FROM . " >\n";
        $headers .= 'X-Mailer: PHP/' . phpversion();
        $headers .= "X-Priority: 1\n";
        $headers .= "Reply-To:" . $mail . "\r\n";  
        $headers .= "Return-Path: " . EMAIL_FROM . "\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=utf-8\r\n";
        
        mail(EMAIL_TO, $subject, $message, $headers);

        die(json_encode(array('status' => 'Meddelandet har skickats. Tack!')));
    } else {
        die(json_encode(array('status' => 'Något tycks ha gått fel. Vänligen försök igen.')));
    }    
?>