<?php
include('config.php');

// متغيرات
$username = "";
$errors = array();

// عند الضغط على زر الدخول
if (isset($_POST['login_user'])) {
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $password = mysqli_real_escape_string($db, $_POST['password']);

    if (empty($username)) {
        array_push($errors, "Username is required");
    }
    if (empty($password)) {
        array_push($errors, "Password is required");
    }

    if (count($errors) == 0) {
        $query = "SELECT * FROM users WHERE username='$username' OR email='$username'";
        $results = mysqli_query($db, $query);
        
        if (mysqli_num_rows($results) == 1) {
            $user = mysqli_fetch_assoc($results);
            
            // التحقق من كلمة المرور
            if (password_verify($password, $user['password_hash'])) {
                // حفظ بيانات الجلسة
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['success'] = "You are now logged in";
                
                // تحديث وقت آخر دخول
                $update_query = "UPDATE users SET last_login = NOW() WHERE id = " . $user['id'];
                mysqli_query($db, $update_query);
                
                // التوجيه حسب الدور
                if ($user['role'] == 'admin') {
                    header('location: admin_dashboard.php');
                } elseif ($user['role'] == 'doctor') {
                    header('location: doctor_dashboard.php');
                } else {
                    header('location: patient_dashboard.php');
                }
            } else {
                array_push($errors, "Wrong username/password combination");
            }
        } else {
            array_push($errors, "Wrong username/password combination");
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login - Healthcare System</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="header">
        <h2>Login</h2>
    </div>

    <form method="post" action="login.php">
        <?php include('errors.php'); ?>
        
        <div class="input-group">
            <label>Username or Email</label>
            <input type="text" name="username" value="<?php echo $username; ?>">
        </div>
        
        <div class="input-group">
            <label>Password</label>
            <input type="password" name="password">
        </div>
        
        <div class="input-group">
            <button type="submit" class="btn" name="login_user">Login</button>
        </div>
        
        <p>
            Not yet a member? <a href="register.php">Sign up</a>
        </p>
    </form>
</body>
</html>