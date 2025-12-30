<?php
session_start();

if (!isset($_SESSION['username'])) {
    header('location: login.php');
}

// استيراد اتصال قاعدة البيانات
include('config.php');
?>

<!DOCTYPE html>
<html>
<head>
    <title>Home - Healthcare System</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div class="header">
        <h2>Welcome <?php echo $_SESSION['username']; ?>!</h2>
    </div>
    
    <div class="content">
        <?php if (isset($_SESSION['success'])) : ?>
            <div class="success">
                <?php 
                    echo $_SESSION['success']; 
                    unset($_SESSION['success']);
                ?>
            </div>
        <?php endif ?>
        
        <h3>Your Information:</h3>
        <p><strong>Username:</strong> <?php echo $_SESSION['username']; ?></p>
        <p><strong>Role:</strong> <?php echo $_SESSION['role']; ?></p>
        <p><strong>Email:</strong> <?php echo $_SESSION['email']; ?></p>
        
        <p><a href="logout.php" style="color: red;">Logout</a></p>
        
        <?php if ($_SESSION['role'] == 'patient') : ?>
            <h3>Patient Menu:</h3>
            <ul>
                <li><a href="book_appointment.php">Book Appointment</a></li>
                <li><a href="my_appointments.php">My Appointments</a></li>
                <li><a href="medical_records.php">Medical Records</a></li>
            </ul>
        <?php endif ?>
        
        <?php if ($_SESSION['role'] == 'doctor') : ?>
            <h3>Doctor Menu:</h3>
            <ul>
                <li><a href="doctor_appointments.php">View Appointments</a></li>
                <li><a href="add_medical_record.php">Add Medical Record</a></li>
                <li><a href="doctor_patients.php">My Patients</a></li>
            </ul>
        <?php endif ?>
        
        <?php if ($_SESSION['role'] == 'admin') : ?>
            <h3>Admin Menu:</h3>
            <ul>
                <li><a href="manage_users.php">Manage Users</a></li>
                <li><a href="system_reports.php">System Reports</a></li>
                <li><a href="admin_settings.php">System Settings</a></li>
            </ul>
        <?php endif ?>
    </div>
</body>
</html>