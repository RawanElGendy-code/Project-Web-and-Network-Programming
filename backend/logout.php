<?php
session_start();

// إلغاء جميع متغيرات الجلسة
$_SESSION = array();

// إذا كنت تريد إنهاء الجلسة تمامًا، احذف ملف cookie الخاص بالجلسة
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// أخيرًا، تدمير الجلسة
session_destroy();

header('location: login.php');
exit();
?>