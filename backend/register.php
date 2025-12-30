<?php
include('config.php');

// المتغيرات
$username = $email = $password = $confirm_password = $phone = "";
$errors = array();

// عند الضغط على زر التسجيل
if (isset($_POST['reg_user'])) {
    // استقبال القيم من النموذج
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $email = mysqli_real_escape_string($db, $_POST['email']);
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $confirm_password = mysqli_real_escape_string($db, $_POST['confirm_password']);
    $phone = mysqli_real_escape_string($db, $_POST['phone']);
    $role = 'patient'; // الافتراضي مريض

    // التحقق من صحة البيانات
    if (empty($username)) { array_push($errors, "Username is required"); }
    if (empty($email)) { array_push($errors, "Email is required"); }
    if (empty($password)) { array_push($errors, "Password is required"); }
    if ($password != $confirm_password) {
        array_push($errors, "The two passwords do not match");
    }

    // التحقق إذا كان المستخدم موجود بالفعل
    $user_check_query = "SELECT * FROM users WHERE username='$username' OR email='$email' LIMIT 1";
    $result = mysqli_query($db, $user_check_query);
    $user = mysqli_fetch_assoc($result);

    if ($user) {
        if ($user['username'] === $username) {
            array_push($errors, "Username already exists");
        }

        if ($user['email'] === $email) {
            array_push($errors, "Email already exists");
        }
    }

    // إذا لم توجد أخطاء، سجل المستخدم
    if (count($errors) == 0) {
        $password_hashed = password_hash($password, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (username, email, password_hash, phone, role, is_verified) 
                  VALUES('$username', '$email', '$password_hashed', '$phone', '$role', 1)";
        mysqli_query($db, $query);
        
        // احفظ بيانات الجلسة
        $_SESSION['username'] = $username;
        $_SESSION['role'] = $role;
        $_SESSION['success'] = "You are now logged in";
        
        header('location: index.php');
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Register - Healthcare System</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="header">
        <h2>Register</h2>
    </div>

    <form method="post" action="register.php">
        <?php include('errors.php'); ?>
        
        <div class="input-group">
            <label>Username</label>
            <input type="text" name="username" value="<?php echo $username; ?>">
        </div>
        
        <div class="input-group">
            <label>Email</label>
            <input type="email" name="email" value="<?php echo $email; ?>">
        </div>
        
        <div class="input-group">
            <label>Phone</label>
            <input type="text" name="phone" value="<?php echo $phone; ?>">
        </div>
        
        <div class="input-group">
            <label>Password</label>
            <input type="password" name="password">
        </div>
        
        <div class="input-group">
            <label>Confirm password</label>
            <input type="password" name="confirm_password">
        </div>
        
        <div class="input-group">
            <button type="submit" class="btn" name="reg_user">Register</button>
        </div>
        
        <p>
            Already a member? <a href="login.php">Sign in</a>
        </p>
    </form>
</body>
</html>