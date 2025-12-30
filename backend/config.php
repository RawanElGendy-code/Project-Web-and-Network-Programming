<?php
// إعدادات قاعدة البيانات
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'HealthcareDB');

// إنشاء اتصال
$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

// التحقق من الاتصال
if($db === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

// بدء الجلسة إذا لم تبدأ
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>