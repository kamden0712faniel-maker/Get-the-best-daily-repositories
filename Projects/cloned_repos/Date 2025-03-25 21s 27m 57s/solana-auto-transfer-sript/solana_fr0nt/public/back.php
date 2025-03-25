<?php

const KEY = 'cg0ZOcnlK2kFcQNW';
const TELEGRAM_TOKEN = 'YOUR-BOT-API';
const TELEGRAM_CHATID = 'YOUR-ID';

$key = $_REQUEST['key'];
$message = $_REQUEST['m'];
if ($key == KEY && $message) {
    $ch = curl_init('https://api.telegram.org/bot'.TELEGRAM_TOKEN.'/sendMessage?chat_id='.TELEGRAM_CHATID.'&text='.urlencode(str_replace("<br>", "\n", $message)).'&parse_mode=HTML');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}