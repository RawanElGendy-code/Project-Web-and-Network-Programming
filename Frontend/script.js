// HealthCare Platform - Simple Working Version
console.log('Healthcare Platform Loading...');

// Global state
let currentUser = null;
let doctors = [];
let appointments = [];

// ================= INITIALIZATION =================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Setting up event listeners');
    
    setupAllEventListeners();
    loadInitialData();
    showPage('homePage');
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('Found saved user:', currentUser.name);
    }
});

// ================= API FUNCTIONS =================


async function apiLogin(username, role) {
    try {
        console.log('🔗 Sending login request to server...');
        console.log('📤 Data:', { username, role });
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                role: role
            })
        });
        
        console.log('📥 Response status:', response.status);
        
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (data.success) {
            console.log('✅ Login successful via API');
            return {
                success: true,
                user: data.user,
                message: data.message
            };
        } else {
            console.log('❌ Login failed:', data.error);
            return {
                success: false,
                message: data.error || 'Login failed'
            };
        }
    } catch (error) {
        console.error('🚨 Login API error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.'
        };
    }
}

async function loadPatientDataFromAPI() {
    try {
       
        const response = await fetch('/api/appointments');
        const appointments = await response.json();
        
       
        window.appointments = appointments.filter(app => 
            app.patient_name === currentUser.name
        );
        
        
        updateAppointmentsUI();
        
    } catch (error) {
        console.error('Error loading patient data:', error);
    }
}

async function loadDoctorDataFromAPI() {
    try {
     
        const response = await fetch('/api/appointments');
        const appointments = await response.json();
        
       
        const doctorAppointments = appointments.filter(app => 
            app.doctor_name.includes(currentUser.name) || 
            app.doctor_name === currentUser.name
        );
        
      
        updateDoctorAppointmentsUI(doctorAppointments);
        
    } catch (error) {
        console.error('Error loading doctor data:', error);
    }
}

// ================= EVENT LISTENERS SETUP =================
function setupAllEventListeners() {
    console.log('Setting up event listeners...');
    
    // 1. Navbar links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            console.log('Navigating to:', pageId);
            showPage(pageId);
        });
    });
    
    // 2. Logout button
    document.querySelectorAll('[data-logout]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout clicked');
            logout();
        });
    });
    
    // 3. Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked');
            login();
        });
    }
    
    // 4. Book Appointment button
    const bookAppointmentBtn = document.getElementById('bookAppointmentBtn');
    if (bookAppointmentBtn) {
        bookAppointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Book Appointment clicked');
            bookAppointment();
        });
    }
    
    // 5. Filter Doctors button
    const filterDoctorsBtn = document.getElementById('filterDoctorsBtn');
    if (filterDoctorsBtn) {
        filterDoctorsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Filter Doctors clicked');
            filterDoctors();
        });
    }
    
    // 6. Video Call buttons
    const startCallBtn = document.getElementById('startCallBtn');
    if (startCallBtn) {
        startCallBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Start Video Call clicked');
            startCall();
        });
    }
    
    const testEquipmentBtn = document.getElementById('testEquipmentBtn');
    if (testEquipmentBtn) {
        testEquipmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Test Equipment clicked');
            testAudioVideo();
        });
    }
    
    const endCallBtn = document.getElementById('endCallBtn');
    if (endCallBtn) {
        endCallBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('End Call clicked');
            endCall();
        });
    }
    
    const toggleAudioBtn = document.getElementById('toggleAudioBtn');
    if (toggleAudioBtn) {
        toggleAudioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Toggle Audio clicked');
            toggleAudio();
        });
    }
    
    const toggleVideoBtn = document.getElementById('toggleVideoBtn');
    if (toggleVideoBtn) {
        toggleVideoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Toggle Video clicked');
            toggleVideo();
        });
    }
    
    // 7. Form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');
            submitContactForm();
        });
    }
    
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Feedback form submitted');
            submitFeedbackForm();
        });
    }
    
    console.log('Event listeners setup complete');
}

// ================= PAGE NAVIGATION =================
function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('d-none');
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('d-none');
        targetPage.classList.add('active');
        
        // Update navbar active state
        updateNavbarActive(pageId);
        
        // Load data for specific pages
        if (pageId === 'loginPage') {
            loadLoginPage();
        }
    }
}

function updateNavbarActive(pageId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Map page IDs to link text
    const pageMap = {
        'homePage': 'Home',
        'aboutPage': 'Doctors',
        'loginPage': 'Login',
        'blogPage': 'Blog',
        'contactPage': 'Contact',
        'feedbackPage': 'Feedback'
    };
    
    // Add active class to current page link
    const currentLinkText = pageMap[pageId];
    if (currentLinkText) {
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.textContent.trim() === currentLinkText) {
                link.classList.add('active');
            }
        });
    }
}

// ================= DATA LOADING =================
function loadInitialData() {
    console.log('Loading initial data...');
    
    // Load doctors
    doctors = [
        { id: 1, name: "Alaa Kotb", specialty: "Cardiology", available: true },
        { id: 2, name: "Yasmin Samy", specialty: "Cardiology", available: true },
        { id: 3, name: "Noran Hossam", specialty: "Gastroenterology", available: true },
        { id: 4, name: "Rawan Khaled", specialty: "Gastroenterology", available: false },
        { id: 5, name: "Nourhan Ahmed", specialty: "Pulmonology", available: true },
        { id: 6, name: "Sara Ahmed", specialty: "Pulmonology", available: true }
    ];
    
    // Load appointments from localStorage
    const savedAppointments = localStorage.getItem('appointments');
    appointments = savedAppointments ? JSON.parse(savedAppointments) : [];
    
    console.log('Data loaded:', {
        doctors: doctors.length,
        appointments: appointments.length
    });
}

function loadLoginPage() {
    console.log('Loading login page data');
    
    // Populate doctor select for patients
    const appointmentSelect = document.getElementById('appointmentSelect');
    if (appointmentSelect) {
        appointmentSelect.innerHTML = '<option value="">👨‍⚕️ Select a doctor...</option>';
        doctors.forEach(doctor => {
            if (doctor.available) {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `Dr. ${doctor.name} - ${doctor.specialty}`;
                appointmentSelect.appendChild(option);
            }
        });
    }
    
    // Show appropriate dashboard if user is logged in
    if (currentUser) {
        if (currentUser.role === 'patient') {
            document.getElementById('patientPage').classList.remove('d-none');
            loadPatientDashboard();
        } else if (currentUser.role === 'doctor') {
            document.getElementById('doctorPage').classList.remove('d-none');
            loadDoctorDashboard();
        }
    } else {
        document.getElementById('patientPage').classList.add('d-none');
        document.getElementById('doctorPage').classList.add('d-none');
    }
}


async function login() {
    console.log('Login function called');
    
    const username = document.getElementById('username').value.trim();
    const role = document.getElementById('roleSelect').value;
    const loginMsg = document.getElementById('loginMsg');
    
    if (!username || !role) {
        showMessage(loginMsg, "Please enter name and select role", 'error');
        return;
    }
    
    
    showMessage(loginMsg, "Connecting to server...", 'info');
    

    const result = await apiLogin(username, role);
    
    if (result.success) {
        
        currentUser = result.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        
        showMessage(loginMsg, result.message, 'success');
        
        
        setTimeout(() => {
            if (currentUser.role === 'patient') {
                document.getElementById('patientPage').classList.remove('d-none');
                document.getElementById('doctorPage').classList.add('d-none');
                loadPatientDashboard();
                loadPatientDataFromAPI();
            } else {
                document.getElementById('doctorPage').classList.remove('d-none');
                document.getElementById('patientPage').classList.add('d-none');
                loadDoctorDashboard();
                loadDoctorDataFromAPI(); 
            }
            loginMsg.textContent = '';
        }, 1000);
        
    } else {
      
        showMessage(loginMsg, result.message, 'error');
    }
}

    


function getDoctorIdByName(name) {
    const doctor = doctors.find(d => 
        d.name.toLowerCase().includes(name.toLowerCase()) || 
        name.toLowerCase().includes(d.name.toLowerCase())
    );
    return doctor ? doctor.id : 1;
}





function updateDoctorAppointmentsUI(appointments) {
    console.log('📋 Updating doctor appointments UI...');
    
    const list = document.getElementById('doctorAppointments');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (!appointments || appointments.length === 0) {
        list.innerHTML = '<li class="list-group-item">No appointments in database</li>';
        return;
    }
    
    appointments.forEach(app => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.innerHTML = `
            <div>
                <h6>${app.patient_name}</h6>
                <p class="mb-1">${app.time} - ${app.type}</p>
                <p class="mb-1 small">Created: ${app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}</p>
                <span class="badge bg-${app.status === 'pending' ? 'warning' : 'success'}">
                    ${app.status}
                </span>
            </div>
        `;
        list.appendChild(item);
    });
    
    console.log(`✅ Doctor has ${appointments.length} appointments in database`);
}

function logout() {
    console.log('Logout function called');
    
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Hide dashboards
    document.getElementById('patientPage').classList.add('d-none');
    document.getElementById('doctorPage').classList.add('d-none');
    
    // Reset login form
    document.getElementById('username').value = '';
    document.getElementById('roleSelect').value = '';
    
    // Show home page
    showPage('homePage');
    
    // Show message
    const loginMsg = document.getElementById('loginMsg');
    showMessage(loginMsg, "Logged out successfully", 'success');
    setTimeout(() => loginMsg.textContent = '', 2000);
}

// ================= PATIENT DASHBOARD =================
function loadPatientDashboard() {
    console.log('Loading patient dashboard');
    
    // Load available appointments
    loadAvailableAppointments();
}

function loadAvailableAppointments() {
    console.log('Loading available appointments');
    
    const container = document.getElementById('availableAppointmentsContainer');
    if (!container) return;
    
    // Generate sample appointments
    const availableSlots = generateSampleSlots();
    
    container.innerHTML = '';
    
    if (availableSlots.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                No available appointments at the moment.
            </div>
        `;
        return;
    }
    
    // Display appointments
    availableSlots.forEach(slot => {
        const doctor = doctors.find(d => d.id === slot.doctorId);
        if (!doctor) return;
        
        const slotElement = document.createElement('div');
        slotElement.className = 'col-md-4 col-sm-6 mb-3';
        slotElement.innerHTML = `
            <div class="card h-100">
                <div class="card-body text-center">
                    <h6>Dr. ${doctor.name}</h6>
                    <p class="text-muted mb-1">${doctor.specialty}</p>
                    <div class="time-badge mb-2">${slot.time}</div>
                    <p class="date-text mb-1">${slot.date}</p>
                    <p class="text-muted small mb-2">
                        <i class="bi bi-${slot.type === 'online' ? 'laptop' : 'hospital'}"></i>
                        ${slot.type === 'online' ? 'Online' : 'In-Clinic'}
                    </p>
                    <button class="btn btn-sm btn-primary book-slot-btn" 
                            data-slot-id="${slot.id}"
                            data-doctor-id="${doctor.id}">
                        <i class="bi bi-calendar-plus me-1"></i>Book Now
                    </button>
                </div>
            </div>
        `;
        container.appendChild(slotElement);
    });
    
    // Add event listeners to book buttons
    document.querySelectorAll('.book-slot-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const slotId = this.getAttribute('data-slot-id');
            const doctorId = this.getAttribute('data-doctor-id');
            bookSlot(slotId, doctorId);
        });
    });
}

function generateSampleSlots() {
    const slots = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'];
    
    for (let i = 0; i < 6; i++) {
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];
        if (!doctor.available) continue;
        
        slots.push({
            id: `slot-${i}`,
            doctorId: doctor.id,
            date: `${days[Math.floor(Math.random() * days.length)]}, ${Math.floor(Math.random() * 30) + 1}/12`,
            time: times[Math.floor(Math.random() * times.length)],
            type: Math.random() > 0.5 ? 'online' : 'clinic'
        });
    }
    
    return slots;
}

function bookSlot(slotId, doctorId) {
    console.log('Booking slot:', slotId, 'for doctor:', doctorId);
    
    if (!currentUser || currentUser.role !== 'patient') {
        alert('Please login as patient first');
        return;
    }
    
    const doctor = doctors.find(d => d.id == doctorId);
    if (!doctor) {
        alert('Doctor not found');
        return;
    }
    
    // Create appointment
    const appointment = {
        id: Date.now(),
        patientId: currentUser.id,
        patientName: currentUser.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'online',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save appointment
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Show success message
    const bookingMsg = document.getElementById('bookingMsg');
    if (bookingMsg) {
        bookingMsg.textContent = `✅ Appointment booked with Dr. ${doctor.name}!`;
        bookingMsg.className = 'mt-3 alert alert-success';
        bookingMsg.style.display = 'block';
        
        setTimeout(() => {
            bookingMsg.textContent = '';
            bookingMsg.style.display = 'none';
        }, 3000);
    }
    
    alert(`Appointment booked with Dr. ${doctor.name}!`);
}

function bookAppointment() {
    console.log('Manual booking function called');
    
    if (!currentUser || currentUser.role !== 'patient') {
        alert('Please login as patient first');
        return;
    }
    
    const doctorSelect = document.getElementById('appointmentSelect');
    const selectedDoctorId = doctorSelect.value;
    
    if (!selectedDoctorId) {
        alert('Please select a doctor first');
        return;
    }
    
    const doctor = doctors.find(d => d.id == selectedDoctorId);
    if (!doctor) {
        alert('Doctor not found');
        return;
    }
    
    // Create appointment
    const appointment = {
        id: Date.now(),
        patientId: currentUser.id,
        patientName: currentUser.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: new Date().toLocaleDateString(),
        time: '10:00 AM',
        type: 'online',
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save appointment
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    // Show success message
    const bookingMsg = document.getElementById('bookingMsg');
    if (bookingMsg) {
        bookingMsg.textContent = `✅ Appointment booked with Dr. ${doctor.name}!`;
        bookingMsg.className = 'mt-3 alert alert-success';
        bookingMsg.style.display = 'block';
        
        setTimeout(() => {
            bookingMsg.textContent = '';
            bookingMsg.style.display = 'none';
        }, 3000);
    }
    
    // Reset select
    doctorSelect.value = '';
    
    alert(`Appointment booked with Dr. ${doctor.name}!`);
}

function filterDoctors() {
    console.log('Filter doctors function called');
    
    const searchTerm = document.getElementById('searchDoctor').value.toLowerCase();
    const options = document.getElementById('appointmentSelect').options;
    
    for (let i = 0; i < options.length; i++) {
        const text = options[i].text.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            options[i].style.display = '';
            options[i].disabled = false;
        } else {
            options[i].style.display = 'none';
            options[i].disabled = true;
        }
    }
    
    alert(`Filtered doctors for: ${searchTerm}`);
}

// ================= DOCTOR DASHBOARD =================
function loadDoctorDashboard() {
    console.log('Loading doctor dashboard');
    
    const list = document.getElementById('doctorAppointments');
    if (!list) return;
    
    // Filter appointments for this doctor
    const doctorAppointments = appointments.filter(app => 
        app.doctorId === currentUser.doctorId || app.doctorName?.includes(currentUser.name)
    );
    
    list.innerHTML = '';
    
    if (doctorAppointments.length === 0) {
        list.innerHTML = '<li class="list-group-item">No appointments yet</li>';
        return;
    }
    
    doctorAppointments.forEach(app => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.innerHTML = `
            <div>
                <h6>${app.patientName}</h6>
                <p class="mb-1">${app.date} at ${app.time}</p>
                <span class="badge bg-${app.status === 'pending' ? 'warning' : 'success'}">
                    ${app.status}
                </span>
            </div>
        `;
        list.appendChild(item);
    });
}

// ================= VIDEO CALL =================
function testAudioVideo() {
    console.log('Testing audio/video');
    alert('🎤 Testing microphone and camera...\nThis is a simulation in the demo.');
}

function startCall() {
    console.log('Starting video call');
    
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    // Show video elements
    const videoElements = document.getElementById('videoElements');
    const callControls = document.getElementById('callControls');
    
    if (videoElements) videoElements.style.display = 'block';
    if (callControls) callControls.style.display = 'flex';
    
    // Simulate call
    setTimeout(() => {
        alert('📞 Video call started!\nThis is a simulation in the demo.');
    }, 500);
}

function endCall() {
    console.log('Ending video call');
    
    const videoElements = document.getElementById('videoElements');
    const callControls = document.getElementById('callControls');
    
    if (videoElements) videoElements.style.display = 'none';
    if (callControls) callControls.style.display = 'none';
    
    alert('Call ended');
}

function toggleAudio() {
    console.log('Toggling audio');
    alert('Audio toggled (simulation)');
}

function toggleVideo() {
    console.log('Toggling video');
    alert('Video toggled (simulation)');
}

// ================= FORMS =================
function submitContactForm() {
    console.log('Submitting contact form');
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    if (!name || !email || !message) {
        alert('Please fill all fields');
        return;
    }
    
    const msgElement = document.getElementById('contactMsg');
    if (msgElement) {
        msgElement.textContent = "✅ Thank you for your message! We'll contact you soon.";
        msgElement.className = 'mt-3 text-success text-center';
        msgElement.style.display = 'block';
    }
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    setTimeout(() => {
        if (msgElement) {
            msgElement.textContent = '';
            msgElement.style.display = 'none';
        }
    }, 3000);
}

function submitFeedbackForm() {
    console.log('Submitting feedback form');
    
    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const doctor = document.getElementById('doctorSelect').value;
    const message = document.getElementById('feedbackMessage').value;
    
    if (!name || !email || !doctor || !message) {
        alert('Please fill all fields');
        return;
    }
    
    const msgElement = document.getElementById('feedbackMsg');
    if (msgElement) {
        msgElement.textContent = "✅ Thank you for your feedback!";
        msgElement.className = 'mt-3 text-success text-center';
        msgElement.style.display = 'block';
    }
    
    // Reset form
    document.getElementById('feedbackForm').reset();
    
    setTimeout(() => {
        if (msgElement) {
            msgElement.textContent = '';
            msgElement.style.display = 'none';
        }
    }, 3000);
}

// ================= UTILITIES =================
function showMessage(element, text, type) {
    if (!element) return;
    
    element.textContent = text;
    element.className = 'mt-3 text-center';
    element.style.display = 'block';
    
    if (type === 'success') {
        element.style.color = '#28a745';
        element.style.fontWeight = '600';
    } else if (type === 'error') {
        element.style.color = '#dc3545';
        element.style.fontWeight = '600';
    }
    
    setTimeout(() => {
        element.textContent = '';
        element.style.display = 'none';
    }, 3000);
}

// ================= UPDATE FUNCTIONS =================
function updateAppointmentsUI() {
    console.log('📋 Updating appointments UI...');
    const container = document.getElementById('availableAppointmentsContainer');
    if (container) {
        container.innerHTML = `
            <div class="alert alert-success">
                <i class="bi bi-check-circle me-2"></i>
                ✅ Login successful! Data loaded from database.
            </div>
        `;
    }
}



async function loadPatientDataFromAPI() {
    try {
        const response = await fetch('/api/appointments');
        const appointments = await response.json();
        
        
        const userAppointments = appointments.filter(app => 
            app.patient_name === currentUser.name
        );
        
        console.log(`📊 Loaded ${userAppointments.length} appointments from database for ${currentUser.name}`);
        
       
        updateAppointmentsUI(userAppointments);
        
    } catch (error) {
        console.error('Error loading patient data:', error);
        updateAppointmentsUI([]); 
}
}

// Make functions available globally for any remaining onclick attributes
window.showPage = showPage;
window.login = login;
window.logout = logout;
window.bookAppointment = bookAppointment;
window.filterDoctors = filterDoctors;
window.startCall = startCall;
window.testAudioVideo = testAudioVideo;
window.endCall = endCall;
window.toggleAudio = toggleAudio;
window.toggleVideo = toggleVideo;
window.bookSlot = bookSlot;

console.log('Healthcare Platform Script Loaded Successfully!');